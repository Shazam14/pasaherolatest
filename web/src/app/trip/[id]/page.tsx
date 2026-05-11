import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { RouteMap } from "@/components/trip/route-map";
import {
  listingById,
  amenitiesFor,
  stopsFor,
  seedOperators,
  seedCarpoolDrivers,
} from "@/content/corridor";
import { corridorById } from "@/content/corridors";
import { php, durationBetween, readableDate } from "@/lib/format";
import {
  ArrowLeft,
  ArrowRight,
  Bus,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;
type Search = Promise<{ date?: string; pax?: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const listing = listingById(id);
  if (!listing) return { title: "Trip not found" };
  const corridor = corridorById(listing.corridorId);
  const name =
    listing.kind === "bus"
      ? seedOperators.find((o) => o.id === listing.operator)?.name
      : seedCarpoolDrivers.find((d) => d.id === listing.driver)?.name;
  return {
    title: `${name} · ${corridor?.origin} → ${corridor?.destination}`,
  };
}

export default async function TripDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const listing = listingById(id);
  if (!listing) notFound();

  const corridor = corridorById(listing.corridorId);
  if (!corridor) notFound();

  const date = sp.date ?? new Date().toISOString().slice(0, 10);
  const pax = Math.max(1, Number(sp.pax ?? "1") || 1);

  const duration = durationBetween(listing.departure, listing.arrival);
  const amenities = amenitiesFor(listing);
  const stops = stopsFor(listing, corridor.origin, corridor.destination);

  const operator =
    listing.kind === "bus"
      ? seedOperators.find((o) => o.id === listing.operator)
      : undefined;
  const driver =
    listing.kind === "carpool"
      ? seedCarpoolDrivers.find((d) => d.id === listing.driver)
      : undefined;
  const providerName = operator?.name ?? driver?.name ?? "Unknown";

  const bookParams = new URLSearchParams({
    kind: listing.kind,
    op: listing.kind === "bus" ? listing.operator : listing.driver,
    dep: listing.departure,
    arr: listing.arrival,
    fare: String(listing.price),
    vehicle:
      listing.kind === "bus"
        ? listing.vehicle
        : `${driver?.car ?? ""} · ${driver?.color ?? ""}`,
    date,
    from: corridor.origin,
    to: corridor.destination,
    pax: String(pax),
  });

  const searchHref = `/search?from=${corridor.origin}&to=${corridor.destination}&date=${date}&pax=${pax}`;

  const hasMap =
    corridor.originCoord && corridor.destinationCoord && corridor.routeGeometry;

  return (
    <>
      <Nav />
      <main className="flex-1 bg-[color:var(--surface-muted)]">
        <div className="mx-auto max-w-5xl px-5 md:px-8 py-8 md:py-12">
          <Link
            href={searchHref}
            className="inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)] mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to results
          </Link>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              {listing.kind === "bus" ? (
                <div className="flex items-center gap-3">
                  <div className="size-14 rounded-xl bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] flex items-center justify-center text-[color:var(--primary-foreground)] font-semibold text-sm flex-shrink-0">
                    {operator!.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-semibold tracking-tight">
                      {operator!.name}
                    </p>
                    <p className="text-xs text-[color:var(--muted)] inline-flex items-center gap-1.5 mt-1">
                      <ShieldCheck className="size-3.5 text-[color:var(--success)]" />
                      Verified operator · {listing.vehicle}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="size-14 rounded-full bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--primary)] flex items-center justify-center text-[color:var(--accent-foreground)] font-semibold text-sm flex-shrink-0">
                    {driver!.initials}
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-semibold tracking-tight">
                      {driver!.name}
                    </p>
                    <p className="text-xs text-[color:var(--muted)] inline-flex items-center gap-1.5 mt-1 flex-wrap">
                      <ShieldCheck className="size-3.5 text-[color:var(--success)]" />
                      Verified Hero
                      <span className="text-[color:var(--border-strong)]">·</span>
                      <Star className="size-3 text-[color:var(--accent)] fill-[color:var(--accent)]" />
                      <span className="font-medium text-[color:var(--foreground)] tnum">
                        {driver!.rating}
                      </span>
                      <span>({driver!.trips} trips)</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="text-right">
                <p className="text-3xl font-semibold tracking-tight tnum">
                  {php(listing.price)}
                </p>
                <p className="text-xs text-[color:var(--muted)]">per passenger</p>
              </div>
            </div>

            {hasMap ? (
              <div className="mt-6">
                <RouteMap
                  origin={corridor.origin}
                  destination={corridor.destination}
                  originCoord={corridor.originCoord!}
                  destinationCoord={corridor.destinationCoord!}
                  routeGeometry={corridor.routeGeometry!}
                  distanceKm={corridor.distanceKm}
                  durationLabel={duration}
                />
              </div>
            ) : null}

            <div className="mt-6 flex items-center gap-4 md:gap-6">
              <div>
                <p className="text-2xl md:text-3xl font-semibold tracking-tight tnum">
                  {listing.departure}
                </p>
                <p className="text-xs text-[color:var(--muted)]">{corridor.origin}</p>
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
                <p className="text-2xl md:text-3xl font-semibold tracking-tight tnum">
                  {listing.arrival}
                </p>
                <p className="text-xs text-[color:var(--muted)]">{corridor.destination}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-[color:var(--muted)]">
              {readableDate(date)} · {pax} {pax === 1 ? "passenger" : "passengers"}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-[color:var(--muted)] mb-4">
                {listing.kind === "carpool" ? "Vehicle & amenities" : "Amenities"}
              </h2>
              {listing.kind === "carpool" && driver ? (
                <div className="mb-5 rounded-xl bg-[color:var(--surface-muted)] p-4">
                  <p className="text-xs text-[color:var(--muted)] uppercase tracking-[0.08em]">
                    Vehicle
                  </p>
                  <p className="font-medium tracking-tight mt-1 inline-flex items-center gap-1.5">
                    <Car className="size-4 text-[color:var(--accent)]" />
                    {driver.car} · {driver.color}
                  </p>
                  <p className="text-xs text-[color:var(--muted)] tnum mt-1">
                    Plate {driver.plate}
                  </p>
                </div>
              ) : null}
              <ul className="grid grid-cols-1 gap-2">
                {amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-[color:var(--success)] flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-[color:var(--muted)] mb-4">
                {listing.kind === "carpool" ? "Pickup & drop-off" : "Stops"}
              </h2>
              <ol className="relative space-y-5">
                {stops.map((s, i) => (
                  <li key={i} className="relative pl-6">
                    {i < stops.length - 1 ? (
                      <span
                        aria-hidden
                        className="absolute left-[7px] top-3 bottom-[-20px] w-px bg-[color:var(--border-strong)]"
                      />
                    ) : null}
                    <span
                      aria-hidden
                      className="absolute left-0 top-1.5 size-3.5 rounded-full border-2 border-[color:var(--accent)] bg-[color:var(--surface)]"
                    />
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-medium tracking-tight inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-[color:var(--muted)]" />
                        {s.label}
                      </p>
                      <p className="text-sm tnum text-[color:var(--muted)]">{s.time}</p>
                    </div>
                    {s.note ? (
                      <p className="text-xs text-[color:var(--muted)] mt-0.5 ml-5">
                        {s.note}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="mt-6 rounded-2xl border border-[color:var(--accent)]/30 bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--accent)]/[0.04] p-5 md:p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-[color:var(--muted)] inline-flex items-center gap-1.5">
                {listing.kind === "carpool" ? (
                  <>
                    <Car className="size-3.5" />
                    Carpool · driven by {providerName}
                  </>
                ) : (
                  <>
                    <Bus className="size-3.5" />
                    {providerName}
                  </>
                )}
              </p>
              <p className="text-2xl font-semibold tracking-tight tnum mt-1">
                {php(listing.price)}{" "}
                <span className="text-sm font-normal text-[color:var(--muted)]">
                  / passenger
                </span>
              </p>
            </div>
            <Link
              href={`/book?${bookParams.toString()}`}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] px-6 h-12 text-sm font-medium hover:brightness-105 active:brightness-95 transition-all shadow-[0_8px_24px_-12px_oklch(0.62_0.18_35/0.6)]"
            >
              Reserve seat
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <p className="mt-4 text-xs text-[color:var(--muted)] leading-relaxed max-w-2xl">
            {listing.kind === "carpool"
              ? "Carpool listings are for fuel-cost sharing among verified members. Drivers retain private-vehicle status — pasaheroph does not operate as a TNVS or commercial carrier. Free cancellation up to 6 hours before departure."
              : "Verified operator. Free cancellation up to 6 hours before departure. The operator receives 100% of the fare — pasaheroph doesn't take a commission."}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
