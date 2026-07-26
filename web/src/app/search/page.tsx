import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { SortControl } from "@/components/search/sort-control";
import { TypeFilter } from "@/components/search/type-filter";
import { TripCard } from "@/components/search/trip-card";
import { CarpoolCard } from "@/components/search/carpool-card";
import {
  ComingSoonState,
  UnsupportedCorridorState,
} from "@/components/search/coming-soon-state";
import {
  listingsForCorridor,
  listingId,
  seedOperators,
  seedCarpoolDrivers,
  type AnyListing,
} from "@/content/corridor";
import { findCorridor } from "@/content/corridors";
import { BOOKING_ENABLED } from "@/lib/flags";
import { readableDate } from "@/lib/format";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";

type Search = {
  from?: string;
  to?: string;
  date?: string;
  pax?: string;
  sort?: string;
  type?: string;
};

export const metadata = {
  title: "Search trips",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const from = sp.from ?? "Manila";
  const to = sp.to ?? "Baguio";
  const date = sp.date ?? new Date().toISOString().slice(0, 10);
  const pax = Math.max(1, Number(sp.pax ?? "1") || 1);
  const sort = sp.sort ?? "departure";
  const type = sp.type ?? "all";

  const corridor = findCorridor(from, to);

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface-muted)]">
          <div className="mx-auto max-w-6xl px-5 md:px-8 py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)] mb-4"
            >
              <ArrowLeft className="size-4" />
              Change search
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {from} <span className="text-[color:var(--muted)]">→</span> {to}
              </h1>
              <span className="hidden md:inline text-[color:var(--muted)]">·</span>
              <p className="text-sm md:text-base text-[color:var(--muted)] inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                {readableDate(date)} · {pax} {pax === 1 ? "passenger" : "passengers"}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 md:px-8 py-8 md:py-10">
          {!corridor ? (
            <UnsupportedCorridorState from={from} to={to} />
          ) : !BOOKING_ENABLED || corridor.status === "coming-soon" ? (
            <ComingSoonState corridor={corridor} />
          ) : (
            <ActiveResults
              corridorId={corridor.id}
              from={from}
              to={to}
              date={date}
              pax={pax}
              sort={sort}
              type={type}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function ActiveResults({
  corridorId,
  from,
  to,
  date,
  pax,
  sort,
  type,
}: {
  corridorId: string;
  from: string;
  to: string;
  date: string;
  pax: number;
  sort: string;
  type: string;
}) {
  const listings = listingsForCorridor(corridorId);

  const filtered = listings.filter((l) => {
    if (type === "bus") return l.kind === "bus";
    if (type === "carpool") return l.kind === "carpool";
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "duration") return durationMinutes(a) - durationMinutes(b);
    return a.departure.localeCompare(b.departure);
  });

  const buses = listings.filter((l) => l.kind === "bus");
  const cheapestBus = buses.length > 0 ? Math.min(...buses.map((l) => l.price)) : 0;

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <TypeFilter current={type} />
          <p className="text-sm text-[color:var(--muted)]">
            <span className="font-semibold text-[color:var(--foreground)] tnum">{sorted.length}</span>{" "}
            results
          </p>
        </div>
        <SortControl current={sort} />
      </div>

      {sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-3 md:gap-4">
          {sorted.map((l, i) => {
            const tripParams = new URLSearchParams({ date, pax: String(pax) });
            const detailHref = `/trip/${listingId(l)}?${tripParams.toString()}`;
            if (l.kind === "bus") {
              const op = seedOperators.find((o) => o.id === l.operator)!;
              const params = new URLSearchParams({
                kind: "bus",
                op: l.operator,
                dep: l.departure,
                arr: l.arrival,
                fare: String(l.price),
                vehicle: l.vehicle,
                date,
                from,
                to,
                pax: String(pax),
              });
              return (
                <TripCard
                  key={i}
                  schedule={l}
                  operator={op}
                  bookHref={`/book?${params.toString()}`}
                  detailHref={detailHref}
                />
              );
            }
            const driver = seedCarpoolDrivers.find((d) => d.id === l.driver)!;
            const params = new URLSearchParams({
              kind: "carpool",
              op: l.driver,
              dep: l.departure,
              arr: l.arrival,
              fare: String(l.price),
              vehicle: `${driver.car} · ${driver.color}`,
              date,
              from,
              to,
              pax: String(pax),
            });
            return (
              <CarpoolCard
                key={i}
                listing={l}
                driver={driver}
                bookHref={`/book?${params.toString()}`}
                detailHref={detailHref}
                busBaseline={cheapestBus}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

function durationMinutes(l: AnyListing) {
  const [dh, dm] = l.departure.split(":").map(Number);
  const [ah, am] = l.arrival.split(":").map(Number);
  const mins = (ah * 60 + am) - (dh * 60 + dm);
  return mins < 0 ? mins + 24 * 60 : mins;
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--border-strong)] bg-[color:var(--surface)] p-10 text-center">
      <p className="font-medium">No trips match your search.</p>
      <p className="text-sm text-[color:var(--muted)] mt-1">
        Try a different date, filter, or check back soon — we add operators and Hero Drivers weekly.
      </p>
    </div>
  );
}
