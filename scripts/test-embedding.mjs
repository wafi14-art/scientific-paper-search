import { GeminiEmbeddingClient } from "../src/services/geminiEmbedding.client.js";

async function run() {
  const client = new GeminiEmbeddingClient();
  const texts = [
    "This is a test embedding for a sample scientific paper paragraph.",
    "Vector search enables semantic retrieval of papers based on content similarity.",
  ];

  const embeddings = await client.generateEmbedding(texts);
  console.log("Embedding results:", {
    model: "text-embedding-004",
    count: embeddings.length,
    dimensions: embeddings[0]?.length,
    sample: embeddings[0]?.slice(0, 10),
  });
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
