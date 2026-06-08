import type { Metadata } from "next";
import { UploadPageClient } from "./UploadPageClient";

export const metadata: Metadata = {
  title: "Upload Paper",
  description: "Upload your research paper in PDF format and store it securely in Supabase Storage.",
};

export default function UploadPage() {
  return <UploadPageClient />;
}
