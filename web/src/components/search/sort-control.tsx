"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const options = [
  { value: "departure", label: "Earliest departure" },
  { value: "price_asc", label: "Lowest price" },
  { value: "price_desc", label: "Highest price" },
  { value: "duration", label: "Shortest trip" },
];

export function SortControl({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(params);
    next.set("sort", e.target.value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-4 h-10 text-sm">
      <ArrowUpDown className="size-3.5 text-[color:var(--muted)]" />
      <span className="text-[color:var(--muted)]">Sort by</span>
      <select
        value={current}
        onChange={onChange}
        className="bg-transparent font-medium tracking-tight outline-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
