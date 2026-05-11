import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:brightness-105 active:brightness-95 shadow-[0_8px_24px_-12px_oklch(0.62_0.18_35/0.6)]",
        dark:
          "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:opacity-90",
        outline:
          "border border-[color:var(--border-strong)] bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface-muted)]",
        ghost:
          "bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface-muted)]",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-13 px-7 text-base",
        xl: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}
