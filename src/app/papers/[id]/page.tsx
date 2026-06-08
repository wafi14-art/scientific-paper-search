import { Metadata } from "next";
import PaperDetailClient from "./PaperDetailClient";

export const metadata: Metadata = {
  title: "Paper Details",
  description: "View extracted text and metadata for a paper.",
};

export default function PaperDetailPage({ params }: { params: { id: string } }) {
  return <PaperDetailClient id={params.id} />;
}
