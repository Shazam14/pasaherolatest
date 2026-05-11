import Link from "next/link";
import { Star, ArrowRight, Clock, Car, ShieldCheck, Users, MapPin } from "lucide-react";
import { php, durationBetween } from "@/lib/format";
import type { seedCarpools, seedCarpoolDrivers } from "@/content/corridor";

type Listing = (typeof seedCarpools)[number];
type Driver = (typeof seedCarpoolDrivers)[number];

export function CarpoolCard({
  listing,
  driver,
  bookHref,
  detailHref,
  busBaseline,
}: {
  listing: Listing;
  driver: Driver;
  bookHref: string;
  detailHref: string;
  busBaseline?: number;
}) {
  const duration = durationBetween(listing.departure, listing.arrival);
  const savings = busBaseline ? busBaseline - listing.price : 0;

  return (
    <article className="group relative rounded-2xl border border-[color:var(--accent)]/30 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--accent)]/[0.04] p-5 md:p-6 hover:border-[color:var(--accent)]/60 hover:shadow-[0_16px_48px_-24px_oklch(0.62_0.18_35/0.3)] transition-all">
      <Link
        href={detailHref}
        aria-label={`View ${driver.name} carpool details`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
      />
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.1em] font-semibold">
          <Car className="size-3" />
          Carpool
        </span>
      </div>

      <div className="flex items-start gap-3 pr-24">
        <div className="size-12 rounded-full bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--primary)] flex items-center justify-center text-[color:var(--accent-foreground)] font-semibold text-sm flex-shrink-0">
          {driver.initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold tracking-tight">{driver.name}</p>
          <p className="text-xs text-[color:var(--muted)] inline-flex items-center gap-1.5 mt-0.5 flex-wrap">
            {driver.verified ? (
              <>
                <ShieldCheck className="size-3.5 text-[color:var(--success)]" />
                Verified Hero
              </>
            ) : null}
            <span className="text-[color:var(--border-strong)]">·</span>
            <Star className="size-3 text-[color:var(--accent)] fill-[color:var(--accent)]" />
            <span className="font-medium text-[color:var(--foreground)] tnum">{driver.rating}</span>
            <span>({driver.trips} trips)</span>
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 md:gap-3 text-xs">
        <div className="rounded-lg bg-[color:var(--surface-muted)] px-3 py-2">
          <p className="text-[color:var(--muted)] uppercase tracking-[0.08em] text-[0.65rem]">Vehicle</p>
          <p className="font-medium tracking-tight mt-0.5">
            {driver.car} <span className="text-[color:var(--muted)] font-normal">· {driver.color}</span>
          </p>
          <p className="text-[color:var(--muted)] tnum mt-0.5">{driver.plate}</p>
        </div>
        <div className="rounded-lg bg-[color:var(--surface-muted)] px-3 py-2">
          <p className="text-[color:var(--muted)] uppercase tracking-[0.08em] text-[0.65rem]">Pickup</p>
          <p className="font-medium tracking-tight mt-0.5 inline-flex items-center gap-1">
            <MapPin className="size-3 text-[color:var(--accent)]" />
            {driver.pickup}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4 md:gap-6">
        <div>
          <p className="text-2xl font-semibold tracking-tight tnum">{listing.departure}</p>
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
          <p className="text-2xl font-semibold tracking-tight tnum">{listing.arrival}</p>
          <p className="text-xs text-[color:var(--muted)]">Baguio</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold tracking-tight tnum">{php(listing.price)}</p>
          {savings > 0 ? (
            <span className="text-xs font-medium text-[color:var(--success)]">
              Save {php(savings)} vs bus
            </span>
          ) : null}
          <span className="text-xs text-[color:var(--muted)] inline-flex items-center gap-1">
            <Users className="size-3" />
            {listing.seatsAvailable} seats left
          </span>
        </div>
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
