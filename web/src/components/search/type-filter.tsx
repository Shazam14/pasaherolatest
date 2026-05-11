"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Bus, Car, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { value: "all", label: "All", icon: LayoutGrid },
  { value: "bus", label: "Bus & van", icon: Bus },
  { value: "carpool", label: "Carpool", icon: Car },
] as const;

export function TypeFilter({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const onSelect = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete("type");
    else next.set("type", value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface)] p-1">
      {tabs.map(({ value, label, icon: Icon }) => {
        const active = current === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 h-8 text-sm font-medium tracking-tight transition-colors",
              active
                ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
