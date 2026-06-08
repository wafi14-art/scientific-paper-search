import { cn } from "@/utils";

interface UploadProgressProps {
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  message?: string;
}

export function UploadProgress({ progress, status, message }: UploadProgressProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-full border border-border bg-muted/70 overflow-hidden h-2">
        <div
          className={cn(
            "h-2 transition-all duration-300",
            status === "success" ? "bg-emerald-500" : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{status === "uploading" ? "Uploading PDF..." : status === "success" ? "Upload complete" : status === "error" ? "Upload failed" : "Ready to upload"}</span>
        <span>{progress.toFixed(0)}%</span>
      </div>
      {message ? (
        <p className={cn("text-sm", status === "error" ? "text-destructive" : "text-foreground")}>{message}</p>
      ) : null}
    </div>
  );
}
