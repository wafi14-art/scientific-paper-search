import * as React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils";

type AlertVariant = "default" | "destructive" | "success";

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
};

export function Alert({
  className,
  variant = "default",
  children,
  ...props
}: AlertProps) {
  const isDestructive = variant === "destructive";
  const isSuccess = variant === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-md border p-3 text-sm",
        isDestructive &&
          "border-destructive/30 bg-destructive/10 text-destructive",
        isSuccess && "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        variant === "default" && "border-border bg-muted/40 text-muted-foreground",
        className
      )}
      role={isDestructive ? "alert" : "status"}
      {...props}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
