import { ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SearchForm } from "@/components/search/search-form";

export function Hero() {
  return (
    <section className="bg-horizon relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 md:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="flex flex-col items-start gap-6 max-w-3xl">
          <Badge tone="accent">
            <Sparkles className="size-3.5" />
            Beta — Manila ⇆ Baguio first, more rolling out
          </Badge>
          <h1 className="text-[2.6rem] leading-[1.05] tracking-[-0.025em] font-semibold md:text-[4.5rem]">
            Inter-region travel,{" "}
            <span className="bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--primary)] bg-clip-text text-transparent">
              without the terminal queue.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[color:var(--muted)] max-w-2xl leading-relaxed">
            Buses, vans, and verified carpool in one search. Manila ⇆ Baguio is live now —
            La Union, Clark, Subic, Tagaytay, Naga, and Batangas are queueing up. Drivers keep
            100%, we don&apos;t take a commission.
          </p>
        </div>

        <div className="mt-10 md:mt-14">
          <SearchForm />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[color:var(--muted)]">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="size-4 text-[color:var(--success)]" />
            Verified operators only
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[color:var(--accent)]" />
            Cash, GCash, or card
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[color:var(--accent)]" />
            Free cancellation up to 6 hours before
          </span>
        </div>
      </div>
    </section>
  );
}
