"use client";

import React, { useCallback, useState } from "react";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Upload } from "lucide-react";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ACCEPTED_TYPE = "application/pdf";

export function UploadPageClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = useCallback((file: File) => {
    if (file.type !== ACCEPTED_TYPE && !file.name.toLowerCase().endsWith(".pdf")) {
      return "Only PDF documents are allowed.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must be 25 MB or less.";
    }

    return null;
  }, []);

  const handleSelectFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      setMessage(null);
      setProgress(0);
      setStatus("idle");

      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        return;
      }

      setError(null);
      setSelectedFile(file);
    },
    [validateFile]
  );

  const uploadFile = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select a PDF before uploading.");
      return;
    }

    setIsUploading(true);
    setStatus("uploading");
    setProgress(0);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/papers/upload");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress((event.loaded / event.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);
          setStatus("success");
          setSelectedFile(null);
          setMessage("Your PDF has been uploaded successfully.");
          resolve();
          return;
        }

        const responseBody = xhr.responseText ? JSON.parse(xhr.responseText) : null;
        reject(responseBody?.error ?? `Upload failed with status ${xhr.status}`);
      };

      xhr.onerror = () => reject("Upload failed due to a network error.");
      xhr.onabort = () => reject("Upload has been cancelled.");
      xhr.send(formData);
    })
      .catch((uploadError) => {
        setStatus("error");
        setError(typeof uploadError === "string" ? uploadError : "Upload failed.");
      })
      .finally(() => {
        setIsUploading(false);
      });
  }, [selectedFile]);

  return (
    <div className="flex-1 bg-muted/10 pb-12">
      <div className="border-b border-border bg-background py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Upload PDF Document
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Store the PDF in Supabase Storage and save initial paper metadata to your research library.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              <Upload className="h-4 w-4 text-primary" />
              PDF only - 25 MB max
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <UploadDropzone
          selectedFile={selectedFile}
          onSelectFile={handleSelectFile}
          error={error ?? undefined}
          disabled={isUploading}
        />

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Upload progress</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Submit the PDF file to your secure Supabase bucket and create the paper record.
              </p>
            </div>
            <Button onClick={uploadFile} disabled={!selectedFile || isUploading}>
              {isUploading ? "Uploading..." : "Upload PDF"}
            </Button>
          </div>

          <div className="mt-6">
            <UploadProgress progress={progress} status={status} message={message ?? undefined} />
          </div>

          {error ? (
            <div className="mt-4">
              <Alert variant="destructive">{error}</Alert>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
