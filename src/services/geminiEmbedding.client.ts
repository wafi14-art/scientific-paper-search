export class GeminiEmbeddingClient {
  private readonly apiKey: string;
  private readonly modelName = "text-embedding-004";
  private readonly apiUrl: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable.");
    }

    this.apiKey = apiKey;
    this.apiUrl = process.env.GEMINI_API_URL ??
      "https://gemini.googleapis.com/v1/models/text-embedding-004/embeddings";
  }

  async generateEmbedding(input: string | string[]): Promise<number[][]> {
    const texts = Array.isArray(input) ? input : [input];

    if (texts.length === 0) {
      throw new Error("No text provided for embedding generation.");
    }

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "X-Goog-Api-Key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.modelName,
        input: texts,
      }),
    });

    const json = (await response.json()) as {
      data?: Array<{ embedding?: unknown }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      const errorMessage = json?.error?.message ?? response.statusText;
      throw new Error(`Gemini embedding request failed: ${errorMessage}`);
    }

    if (!Array.isArray(json.data)) {
      throw new Error("Unexpected Gemini embedding response format.");
    }

    const embeddings = json.data.map((item) => {
      if (!Array.isArray(item?.embedding)) {
        throw new Error("Invalid embedding vector returned from Gemini.");
      }
      return item.embedding.map((value) => {
        const numberValue = Number(value);
        if (Number.isNaN(numberValue)) {
          throw new Error("Gemini returned a non-numeric embedding value.");
        }
        return numberValue;
      });
    });

    if (embeddings.length !== texts.length) {
      throw new Error("Gemini returned a different number of embeddings than inputs.");
    }

    return embeddings;
  }
}
