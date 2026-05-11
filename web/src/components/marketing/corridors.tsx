import Link from "next/link";
import { ArrowRight, Clock, Route, Sparkles, Users } from "lucide-react";
import { corridors, type Corridor } from "@/content/corridors";

export function Corridors() {
  return (
    <section id="corridors" className="border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
        <div className="flex flex-col gap-3 max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-[0.12em] text-[color:var(--accent)] font-medium">
            Where we run
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em]">
            One corridor at a time — done right.
          </h2>
          <p className="text-base md:text-lg text-[color:var(--muted)] leading-relaxed mt-2">
            We open routes only when there&apos;s real supply: verified Hero Drivers and at least one
            operator running daily. Manila ⇆ Baguio first. The rest are queueing up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {corridors.map((c) => (
            <CorridorCard key={c.id} corridor={c} />
          ))}
        </div>

        <p className="mt-8 text-sm text-[color:var(--muted)]">
          Don&apos;t see your route? Tell us where to open next —{" "}
          <a
            className="text-[color:var(--foreground)] underline decoration-[color:var(--accent)] underline-offset-4"
            href="/request-corridor"
          >
            request a corridor
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function CorridorCard({ corridor }: { corridor: Corridor }) {
  const isActive = corridor.status === "active";
  const params = new URLSearchParams({
    from: corridor.origin,
    to: corridor.destination,
  });
  return (
    <Link
      href={`/search?${params.toString()}`}
      className="group flex flex-col rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 hover:border-[color:var(--border-strong)] hover:shadow-[0_16px_48px_-24px_oklch(0.16_0.05_250/0.3)] transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg md:text-xl font-semibold tracking-tight">
          {corridor.origin} <span className="text-[color:var(--muted)]">⇆</span>{" "}
          {corridor.destination}
        </h3>
        {isActive ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--success)]/15 text-[color:var(--success)] px-2.5 py-0.5 text-[0.7rem] uppercase tracking-[0.1em] font-medium">
            <Sparkles className="size-3" />
            Live
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--surface-muted)] text-[color:var(--muted)] border border-[color:var(--border)] px-2.5 py-0.5 text-[0.7rem] uppercase tracking-[0.1em] font-medium">
            {corridor.expectedLaunch ?? "Soon"}
          </span>
        )}
      </div>

      <p className="text-sm text-[color:var(--muted)] leading-relaxed mt-3 flex-1">
        {corridor.blurb}
      </p>

      <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[color:var(--muted)]">
        <span className="inline-flex items-center gap-1.5">
          <Route className="size-3.5" />
          {corridor.distanceKm} km
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" />
          ~{corridor.durationHours}h
        </span>
        {isActive && (
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" />
            {corridor.heroCount} Heroes
          </span>
        )}
      </dl>

      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--foreground)] group-hover:text-[color:var(--accent)] transition-colors">
        {isActive ? "Search trips" : "Join waitlist"}
        <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
