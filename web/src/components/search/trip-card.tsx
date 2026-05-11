import Link from "next/link";
import { Bus, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { php, durationBetween } from "@/lib/format";
import type { seedSchedules, seedOperators } from "@/content/corridor";

type Schedule = (typeof seedSchedules)[number];
type Operator = (typeof seedOperators)[number];

export function TripCard({
  schedule,
  operator,
  bookHref,
  detailHref,
}: {
  schedule: Schedule;
  operator: Operator;
  bookHref: string;
  detailHref: string;
}) {
  const initials = operator.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const duration = durationBetween(schedule.departure, schedule.arrival);

  return (
    <article className="group relative rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 md:p-6 hover:border-[color:var(--border-strong)] hover:shadow-[0_16px_48px_-24px_oklch(0.16_0.05_250/0.25)] transition-all">
      <Link
        href={detailHref}
        aria-label={`View ${operator.name} trip details`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
      />
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-xl bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] flex items-center justify-center text-[color:var(--primary-foreground)] font-semibold text-sm flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold tracking-tight">{operator.name}</p>
            <p className="text-xs text-[color:var(--muted)] inline-flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="size-3.5 text-[color:var(--success)]" />
              Verified · {schedule.vehicle}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-semibold tracking-tight tnum">{php(schedule.price)}</p>
          <p className="text-xs text-[color:var(--muted)]">per passenger</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4 md:gap-6">
        <div>
          <p className="text-2xl font-semibold tracking-tight tnum">{schedule.departure}</p>
          <p className="text-xs text-[color:var(--muted)]">Manila</p>
        </div>
        <div className="flex-1 flex items-center gap-2 text-[color:var(--muted)]">
          <span className="h-px flex-1 bg-[color:var(--border-strong)]" />
          <span className="inline-flex items-center gap-1 text-xs">
            <Clock className="size-3" />
            {duration}
          </span>
          <span className="h-px flex-1 bg-[color:var(--border-strong)]" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tracking-tight tnum">{schedule.arrival}</p>
          <p className="text-xs text-[color:var(--muted)]">Baguio</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-[color:var(--muted)] inline-flex items-center gap-1.5">
          <Bus className="size-3.5" />
          {operator.terminal}
        </span>
        <Link
          href={bookHref}
          className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] px-5 h-10 text-sm font-medium hover:brightness-105 active:brightness-95 transition-all shadow-[0_8px_24px_-12px_oklch(0.62_0.18_35/0.6)]"
        >
          Reserve seat <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
