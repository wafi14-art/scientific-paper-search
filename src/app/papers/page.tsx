import type { Metadata } from "next";
import { PapersPageClient } from "./PapersPageClient";

export const metadata: Metadata = {
  title: "Uploaded Papers",
  description: "Manage and review the scientific PDFs you have uploaded to your research library.",
};

export default function PapersPage() {
  return <PapersPageClient />;
}
