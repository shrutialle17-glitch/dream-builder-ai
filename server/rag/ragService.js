import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import prisma from "../src/lib/prisma.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const EMBEDDING_DIMENSION = 768;
const DEFAULT_TOP_K = 5;
const MAX_TOP_K = 20;
const DEFAULT_MIN_SIMILARITY = 0.60;

// --------------------------------------------------
// Generate query embedding
// --------------------------------------------------

async function generateQueryEmbedding(query) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: query,
    config: {
      outputDimensionality: EMBEDDING_DIMENSION,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding || embedding.length !== EMBEDDING_DIMENSION) {
    throw new Error(
      `Invalid query embedding dimension: ${embedding?.length}`
    );
  }

  return embedding;
}

// --------------------------------------------------
// Retrieve similar chunks
// --------------------------------------------------

async function retrieveChunks(
  vectorString,
  topK,
  documentId = null
) {
  if (documentId) {
    return await prisma.$queryRawUnsafe(
      `
      SELECT
        dc.id,
        dc.content,
        dc."pageNumber",
        dc."documentId",

        d.title AS "documentTitle",
        d."fileName",
        d.source,
        d.category,
        d.industry,
        d.country,
        d."publicationYear",

        1 - (dc.embedding <=> $1::vector) AS similarity

      FROM "DocumentChunk" dc

      JOIN "Document" d
        ON d.id = dc."documentId"

      WHERE dc."documentId" = $2

      ORDER BY dc.embedding <=> $1::vector

      LIMIT $3;
      `,
      vectorString,
      documentId,
      topK
    );
  }

  return await prisma.$queryRawUnsafe(
    `
    SELECT
      dc.id,
      dc.content,
      dc."pageNumber",
      dc."documentId",

      d.title AS "documentTitle",
      d."fileName",
      d.source,
      d.category,
      d.industry,
      d.country,
      d."publicationYear",

      1 - (dc.embedding <=> $1::vector) AS similarity

    FROM "DocumentChunk" dc

    JOIN "Document" d
      ON d.id = dc."documentId"

    ORDER BY dc.embedding <=> $1::vector

    LIMIT $2;
    `,
    vectorString,
    topK
  );
}

// --------------------------------------------------
// RAG
// --------------------------------------------------

export const runRAG = async ({
  query,
  topK = DEFAULT_TOP_K,
  documentId = null,
  minSimilarity = DEFAULT_MIN_SIMILARITY,
}) => {
  try {
    // ----------------------------------------------
    // Validate input
    // ----------------------------------------------

    if (
      !query ||
      typeof query !== "string" ||
      !query.trim()
    ) {
      throw new Error("RAG query is required");
    }

    topK = Math.min(
      Math.max(Number(topK) || DEFAULT_TOP_K, 1),
      MAX_TOP_K
    );

    minSimilarity = Number(minSimilarity);

    // ----------------------------------------------
    // 1. Query → embedding
    // ----------------------------------------------

    const queryEmbedding =
      await generateQueryEmbedding(query);

    const vectorString =
      `[${queryEmbedding.join(",")}]`;

    // ----------------------------------------------
    // 2. Vector search
    // ----------------------------------------------

    const rawResults = await retrieveChunks(
      vectorString,
      topK,
      documentId
    );

    // ----------------------------------------------
    // 3. Similarity filtering
    // ----------------------------------------------

    const results = rawResults.filter(
      (result) =>
        Number(result.similarity) >= minSimilarity
    );

    // ----------------------------------------------
    // No relevant research
    // ----------------------------------------------

    if (results.length === 0) {
      return {
        answer:
          "I could not find sufficiently relevant information in the research database.",
        sources: [],
        context: "",
      };
    }

    // ----------------------------------------------
    // 4. Build research context
    // ----------------------------------------------

    const context = results
      .map(
        (result, index) => `
SOURCE ${index + 1}

Document: ${result.documentTitle}
File: ${result.fileName}
Page: ${result.pageNumber ?? "Unknown"}
Similarity: ${Number(result.similarity).toFixed(4)}

Content:
${result.content}
`
      )
      .join(
        "\n\n-----------------------------\n\n"
      );

    // ----------------------------------------------
    // 5. Grounded answer
    // ----------------------------------------------

    const prompt = `
You are an AI research assistant for Dream Builder AI.

Answer the user's question using ONLY the research context provided below.

Rules:
- Use only information contained in the research context.
- Do not invent facts.
- Do not use outside knowledge.
- If the research does not contain enough information, say so clearly.
- Give a concise, professional answer.
- Cite the document name and page number when using evidence.
- Do not mention embeddings, vectors, pgvector, or retrieval.

USER QUESTION:
${query}

RESEARCH CONTEXT:
${context}
`;

    // ----------------------------------------------
    // 6. Generate answer
    // ----------------------------------------------

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    // ----------------------------------------------
    // 7. Return standardized result
    // ----------------------------------------------

    return {
      answer: response.text,

      context,

      sources: results.map((result) => ({
        id: result.id,
        documentId: result.documentId,
        documentTitle: result.documentTitle,
        fileName: result.fileName,
        page: result.pageNumber,
        similarity: Number(result.similarity),
        content: result.content,
      })),
    };
  } catch (error) {
    console.error("Error in RAG Service:", error);

    throw new Error(
      "Failed to execute RAG pipeline"
    );
  }
};