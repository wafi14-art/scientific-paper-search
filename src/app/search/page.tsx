import { Metadata } from "next";
import { SearchPageClient } from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Search Papers",
  description: "Search research documents using semantic similarity with Gemini embeddings and pgvector.",
};

export default function SearchPage() {
  return <SearchPageClient />;
}
