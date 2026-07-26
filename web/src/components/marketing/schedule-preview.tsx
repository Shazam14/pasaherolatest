import { seedSchedules, seedOperators } from "@/content/corridor";
import { ArrowRight, Clock, Bus } from "lucide-react";

export function SchedulePreview() {
  return (
    <section className="border-t border-[color:var(--border)] bg-[color:var(--surface-muted)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.12em] text-[color:var(--accent)] font-medium">
              Today&apos;s departures
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] mt-3">
              Manila → Baguio.
            </h2>
          </div>
          <a
            href="/search?corridor=manila-baguio"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--foreground)] hover:text-[color:var(--accent)] transition-colors"
          >
            See all trips <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] overflow-hidden">
          <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-[color:var(--border)] text-[0.7rem] uppercase tracking-[0.1em] text-[color:var(--muted)]">
            <span>Operator</span>
            <span>Departure</span>
            <span>Arrival</span>
            <span>Vehicle</span>
            <span className="text-right">Fare</span>
          </div>
          <ul>
            {seedSchedules.map((s, i) => {
              const op = seedOperators.find((o) => o.id === s.operator);
              return (
                <li
                  key={i}
                  className="grid grid-cols-[1fr_auto] md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 px-5 md:px-6 py-4 border-b border-[color:var(--border)] last:border-b-0 hover:bg-[color:var(--surface-muted)] transition-colors items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] flex items-center justify-center text-[color:var(--primary-foreground)] text-xs font-semibold flex-shrink-0">
                      {op?.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium tracking-tight truncate">{op?.name}</p>
                      <p className="md:hidden text-xs text-[color:var(--muted)] tnum">
                        {s.departure} → {s.arrival} · {s.vehicle}
                      </p>
                    </div>
                  </div>

                  <span className="hidden md:flex items-center gap-1.5 text-sm tnum tracking-tight">
                    <Clock className="size-3.5 text-[color:var(--muted)]" />
                    {s.departure}
                  </span>
                  <span className="hidden md:inline text-sm tnum text-[color:var(--muted)]">
                    {s.arrival}
                  </span>
                  <span className="hidden md:flex items-center gap-1.5 text-sm text-[color:var(--muted)]">
                    <Bus className="size-3.5" />
                    {s.vehicle}
                  </span>

                  <div className="flex items-center justify-end gap-3">
                    <span className="text-base font-semibold tracking-tight tnum">
                      ₱{s.price.toLocaleString()}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
