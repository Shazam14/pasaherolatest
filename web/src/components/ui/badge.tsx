import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  tone = "default",
}: {
  className?: string;
  children: React.ReactNode;
  tone?: "default" | "accent" | "success";
}) {
  const tones = {
    default:
      "bg-[color:var(--surface-muted)] text-[color:var(--muted)] border-[color:var(--border)]",
    accent:
      "bg-[color:var(--accent)]/10 text-[color:var(--accent)] border-[color:var(--accent)]/30",
    success:
      "bg-[color:var(--success)]/10 text-[color:var(--success)] border-[color:var(--success)]/30",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-tight",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
