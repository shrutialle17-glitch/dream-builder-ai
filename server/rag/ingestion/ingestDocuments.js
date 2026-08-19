import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { GoogleGenAI } from "@google/genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import prisma from "../../src/lib/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENTS_PATH = path.join(__dirname, "..", "documents");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

// --------------------------------------------------
// Generate embedding
// --------------------------------------------------

async function generateEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  const embedding = response.embeddings[0].values;

  if (!embedding || embedding.length !== 768) {
    throw new Error(
      `Invalid embedding dimension: ${embedding?.length}`
    );
  }

  return embedding;
}

// --------------------------------------------------
// Delay
// --------------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --------------------------------------------------
// Ingest one PDF
// --------------------------------------------------

async function ingestPDF(fileName) {
  const PDF_PATH = path.join(DOCUMENTS_PATH, fileName);

  console.log("\n========================================");
  console.log(`PROCESSING: ${fileName}`);
  console.log("========================================");

  // ------------------------------------------------
  // 1. Load PDF
  // ------------------------------------------------

  console.log("\nLoading PDF...");

  const loader = new PDFLoader(PDF_PATH, {
    splitPages: true,
  });

  const pages = await loader.load();

  console.log(`Loaded ${pages.length} pages.`);

  // ------------------------------------------------
  // 2. Create chunks
  // ------------------------------------------------

  console.log("\nCreating chunks...");

  const chunks = await splitter.splitDocuments(pages);

  console.log(`Created ${chunks.length} chunks.`);

  // ------------------------------------------------
  // 3. Check if document already exists
  // ------------------------------------------------

  let document = await prisma.document.findFirst({
    where: {
      fileName,
    },
  });

  // ------------------------------------------------
  // 4. Create Document if it doesn't exist
  // ------------------------------------------------

  if (!document) {
    console.log("\nCreating Document record...");

    const title = path
      .basename(fileName, path.extname(fileName))
      .replace(/[-_]+/g, " ")
      .trim();

    document = await prisma.document.create({
      data: {
        title,
        source: "Research PDF",
        category: "Startup Research",
        fileName,
      },
    });

    console.log(`Document created: ${document.id}`);
  } else {
    console.log(`\nDocument already exists: ${document.id}`);
  }

  // ------------------------------------------------
  // 5. Check existing chunks
  // ------------------------------------------------

  const existingChunks = await prisma.documentChunk.count({
    where: {
      documentId: document.id,
    },
  });

  console.log(`Existing chunks: ${existingChunks}`);

  // ------------------------------------------------
  // 6. Already completely ingested
  // ------------------------------------------------

  if (existingChunks === chunks.length) {
    console.log(
      `\nSKIPPING ${fileName} — already fully ingested.`
    );

    return {
      fileName,
      status: "SKIPPED",
      chunks: existingChunks,
    };
  }

  // ------------------------------------------------
  // 7. Resume incomplete ingestion
  // ------------------------------------------------

  if (existingChunks > chunks.length) {
    console.log(
      `\nWARNING: Database has more chunks than expected.`
    );

    return {
      fileName,
      status: "WARNING",
      chunks: existingChunks,
    };
  }

  console.log(
    `\nStarting from chunk ${existingChunks + 1}/${chunks.length}...`
  );

  // ------------------------------------------------
  // 8. Generate embeddings + insert chunks
  // ------------------------------------------------

  for (let i = existingChunks; i < chunks.length; i++) {
    const chunk = chunks[i];

    const content = chunk.pageContent.trim();

    if (!content) {
      continue;
    }

    const pageNumber =
      chunk.metadata?.loc?.pageNumber ??
      chunk.metadata?.page ??
      null;

    console.log(
      `[${i + 1}/${chunks.length}] Embedding chunk...`
    );

    const embedding = await generateEmbedding(content);

    const vectorString = `[${embedding.join(",")}]`;

    await prisma.$executeRaw`
      INSERT INTO "DocumentChunk"
      (
        "id",
        "documentId",
        "content",
        "chunkIndex",
        "pageNumber",
        "embedding",
        "createdAt"
      )
      VALUES
      (
        gen_random_uuid(),
        ${document.id},
        ${content},
        ${i},
        ${pageNumber},
        ${vectorString}::vector,
        NOW()
      )
    `;

    /*
     * Gemini free tier embedding quota:
     * keep requests safely below 100 requests/minute.
     */
    await sleep(1100);
  }

  // ------------------------------------------------
  // 9. Verify
  // ------------------------------------------------

  const finalCount = await prisma.documentChunk.count({
    where: {
      documentId: document.id,
    },
  });

  console.log("\n----------------------------------------");
  console.log(`PDF: ${fileName}`);
  console.log(`Document ID: ${document.id}`);
  console.log(`Expected chunks: ${chunks.length}`);
  console.log(`Stored chunks: ${finalCount}`);
  console.log("----------------------------------------");

  if (finalCount !== chunks.length) {
    throw new Error(
      `Chunk count mismatch for ${fileName}. Expected ${chunks.length}, got ${finalCount}.`
    );
  }

  console.log(`✓ ${fileName} successfully ingested.`);

  return {
    fileName,
    status: "INGESTED",
    chunks: finalCount,
  };
}

// --------------------------------------------------
// Main
// --------------------------------------------------

async function main() {
  console.log("========================================");
  console.log("DREAM BUILDER AI - MULTI PDF INGESTION");
  console.log("========================================");

  // ------------------------------------------------
  // Find all PDFs
  // ------------------------------------------------

  if (!fs.existsSync(DOCUMENTS_PATH)) {
    throw new Error(
      `Documents folder not found: ${DOCUMENTS_PATH}`
    );
  }

  /*const files = fs
    .readdirSync(DOCUMENTS_PATH)
    .filter((file) => file.toLowerCase().endsWith(".pdf"))
    .sort();*/

  const files = [
    "startup_research.pdf",
    "Compendium-of-Best-Practices-15-01-26.pdf",
    "daignostucs.pdf",
    "IndiaInnovationReport2020Book.pdf",
    "Startup-Schemes-Playbook-June-2026.pdf",
    "Maharashtra_State_Report.pdf",
    
  ];  
  
  console.log(`\nFound ${files.length} PDF files.`);

  if (files.length === 0) {
    console.log("No PDF files found.");
    return;
  }

  console.log("\nPDFs:");

  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });

  // ------------------------------------------------
  // Process PDFs one by one
  // ------------------------------------------------

  const results = [];

  for (const fileName of files) {
    try {
      const result = await ingestPDF(fileName);

      results.push(result);
    } catch (error) {
      console.error(`\nFAILED: ${fileName}`);
      console.error(error);

      console.log(
        "\nContinuing with the next PDF..."
      );
    }
  }

  // ------------------------------------------------
  // Final summary
  // ------------------------------------------------

  console.log("\n\n========================================");
  console.log("MULTI PDF INGESTION SUMMARY");
  console.log("========================================");

  results.forEach((result) => {
    console.log(
      `${result.status.padEnd(10)} | ${result.fileName} | ${result.chunks} chunks`
    );
  });

  console.log("\n========================================");
  console.log("INGESTION PROCESS FINISHED");
  console.log("========================================");
}

// --------------------------------------------------
// Run
// --------------------------------------------------

main()
  .catch((error) => {
    console.error("\nINGESTION FAILED");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });