"use client";

import React, { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn, formatBytes } from "@/utils";
import { FileText, UploadCloud } from "lucide-react";

interface UploadDropzoneProps {
  selectedFile: File | null;
  onSelectFile: (file: File) => void;
  error?: string;
  disabled?: boolean;
}

export function UploadDropzone({
  selectedFile,
  onSelectFile,
  error,
  disabled,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      onSelectFile(file);
      setIsDragging(false);
    },
    [onSelectFile]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (files?.[0]) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);

      const files = event.dataTransfer.files;
      if (files?.[0]) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="file-upload" className="text-base">
          Upload PDF
        </Label>
        <Button
          variant="outline"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Choose file
        </Button>
      </div>

      <div
        className={cn(
          "relative rounded-3xl border border-border bg-card p-10 text-center transition-all duration-300",
          isDragging ? "border-primary bg-primary/5" : "hover:border-primary/70"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={handleInputChange}
          disabled={disabled}
        />

        <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background text-primary">
            <UploadCloud className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Drag and drop a PDF file</p>
            <p>or click to choose a file from your device.</p>
            <p className="text-xs">Maximum file size: 25 MB</p>
          </div>

          {selectedFile ? (
            <div className="mt-4 rounded-2xl border border-border bg-muted/50 p-4 text-left text-sm text-foreground">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(selectedFile.size)} &bull; PDF file
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
