import { runRAG } from './ragService.js';
import prisma from '../src/lib/prisma.js';

async function testRAG() {
  console.log("========================================");
  console.log("TESTING REUSABLE RAG SERVICE");
  console.log("========================================\n");

  const query = "What are the main sources of funding for startups?";
  
  console.log(`Query: "${query}"\n`);
  console.log("Running RAG pipeline (this will do embeddings, search, and LLM generation)...\n");

  try {
    const result = await runRAG({ 
      query: query, 
      topK: 3 
    });

    console.log("========================================");
    console.log("RAG ANSWER");
    console.log("========================================");
    console.log(result.answer);
    
    console.log("\n========================================");
    console.log("SOURCES USED");
    console.log("========================================");
    
    result.sources.forEach((source, index) => {
      console.log(`\n[Source ${index + 1}]`);
      console.log(`Page: ${source.page}`);
      console.log(`Similarity: ${source.similarity.toFixed(4)}`);
    });

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Disconnect so the script cleanly exits
    await prisma.$disconnect();
  }
}

testRAG();
