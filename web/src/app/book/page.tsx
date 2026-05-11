import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { seedOperators, seedCarpoolDrivers } from "@/content/corridor";
import { php, durationBetween, readableDate } from "@/lib/format";
import { ArrowLeft, ShieldCheck, Bus, Clock, Car, Star, MapPin } from "lucide-react";
import Link from "next/link";
import { BookingForm } from "@/components/booking/booking-form";
import { ConfirmationCard } from "@/components/booking/confirmation-card";
import { redirect } from "next/navigation";

type Search = {
  kind?: string;
  op?: string;
  dep?: string;
  arr?: string;
  fare?: string;
  vehicle?: string;
  date?: string;
  from?: string;
  to?: string;
  pax?: string;
  ref?: string;
  name?: string;
  phone?: string;
  email?: string;
  pay?: string;
};

export const metadata = {
  title: "Reserve your seat",
};

export default async function BookPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const kind = sp.kind === "carpool" ? "carpool" : "bus";

  const provider =
    kind === "carpool"
      ? seedCarpoolDrivers.find((d) => d.id === sp.op)
      : seedOperators.find((o) => o.id === sp.op);

  if (!provider || !sp.dep || !sp.arr || !sp.fare) {
    redirect("/search?corridor=manila-baguio");
  }

  const fare = Number(sp.fare);
  const pax = Math.max(1, Number(sp.pax ?? "1") || 1);
  const bookingFee = kind === "carpool" ? 15 : 25;
  const total = fare * pax + bookingFee;

  const isConfirmed = Boolean(sp.ref);
  const providerName = "name" in provider ? provider.name : (provider as { name: string }).name;

  return (
    <>
      <Nav />
      <main className="flex-1 bg-[color:var(--surface-muted)]">
        <div className="mx-auto max-w-5xl px-5 md:px-8 py-8 md:py-12">
          {!isConfirmed ? (
            <Link
              href={`/search?from=${sp.from ?? "Manila"}&to=${sp.to ?? "Baguio"}&date=${sp.date ?? ""}&pax=${pax}`}
              className="inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)] mb-6"
            >
              <ArrowLeft className="size-4" />
              Back to results
            </Link>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
            <div className="order-2 lg:order-1">
              {isConfirmed ? (
                <ConfirmationCard
                  reference={sp.ref!}
                  passengerName={sp.name ?? "Passenger"}
                  phone={sp.phone ?? ""}
                  email={sp.email ?? ""}
                  payment={sp.pay ?? "cash"}
                  operator={providerName}
                  date={sp.date ?? ""}
                  departure={sp.dep!}
                  total={total}
                  kind={kind}
                />
              ) : (
                <BookingForm pax={pax} kind={kind} />
              )}
            </div>

            <aside className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
                <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--muted)] mb-4 inline-flex items-center gap-1.5">
                  {kind === "carpool" ? (
                    <>
                      <Car className="size-3" />
                      Carpool · driven by
                    </>
                  ) : (
                    "Trip summary"
                  )}
                </p>

                {kind === "carpool" ? (
                  <CarpoolHeader driver={provider as (typeof seedCarpoolDrivers)[number]} />
                ) : (
                  <OperatorHeader operator={provider as (typeof seedOperators)[number]} />
                )}

                <div className="flex items-center gap-3 py-4 border-y border-[color:var(--border)]">
                  <div>
                    <p className="text-xl font-semibold tnum">{sp.dep}</p>
                    <p className="text-xs text-[color:var(--muted)]">{sp.from ?? "Manila"}</p>
                  </div>
                  <div className="flex-1 flex items-center gap-2 text-[color:var(--muted)]">
                    <span className="h-px flex-1 bg-[color:var(--border-strong)]" />
                    <span className="text-xs inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {durationBetween(sp.dep!, sp.arr!)}
                    </span>
                    <span className="h-px flex-1 bg-[color:var(--border-strong)]" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold tnum">{sp.arr}</p>
                    <p className="text-xs text-[color:var(--muted)]">{sp.to ?? "Baguio"}</p>
                  </div>
                </div>

                <dl className="text-sm mt-4 space-y-2">
                  <Row label="Date">{sp.date ? readableDate(sp.date) : "—"}</Row>
                  <Row label={kind === "carpool" ? "Vehicle" : "Class"}>
                    <span className="inline-flex items-center gap-1.5">
                      {kind === "carpool" ? (
                        <Car className="size-3.5 text-[color:var(--muted)]" />
                      ) : (
                        <Bus className="size-3.5 text-[color:var(--muted)]" />
                      )}
                      {sp.vehicle}
                    </span>
                  </Row>
                  {kind === "carpool" ? (
                    <Row label="Pickup">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-[color:var(--accent)]" />
                        {(provider as (typeof seedCarpoolDrivers)[number]).pickup}
                      </span>
                    </Row>
                  ) : null}
                  <Row label="Passengers">{pax}</Row>
                  <Row label={`Fare × ${pax}`}>
                    <span className="tnum">{php(fare * pax)}</span>
                  </Row>
                  <Row label="Booking fee">
                    <span className="tnum">{php(bookingFee)}</span>
                  </Row>
                </dl>
                <div className="mt-4 pt-4 border-t border-[color:var(--border)] flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-2xl font-semibold tnum tracking-tight">{php(total)}</span>
                </div>
                <p className="text-xs text-[color:var(--muted)] mt-3 leading-relaxed">
                  {kind === "carpool"
                    ? "Driver receives the full fare to cover fuel — pasaheroph doesn't take a commission. The booking fee covers verification, support, and platform costs."
                    : "Operator receives 100% of the fare. Booking fee covers platform costs — drivers don't pay a commission."}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function OperatorHeader({ operator }: { operator: (typeof seedOperators)[number] }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="size-10 rounded-lg bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] flex items-center justify-center text-[color:var(--primary-foreground)] text-xs font-semibold flex-shrink-0">
        {operator.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
      </div>
      <div>
        <p className="text-sm font-semibold tracking-tight">{operator.name}</p>
        <p className="text-xs text-[color:var(--muted)] inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3 text-[color:var(--success)]" />
          Verified operator
        </p>
      </div>
    </div>
  );
}

function CarpoolHeader({ driver }: { driver: (typeof seedCarpoolDrivers)[number] }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="size-10 rounded-full bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--primary)] flex items-center justify-center text-[color:var(--accent-foreground)] text-xs font-semibold flex-shrink-0">
        {driver.initials}
      </div>
      <div>
        <p className="text-sm font-semibold tracking-tight">{driver.name}</p>
        <p className="text-xs text-[color:var(--muted)] inline-flex items-center gap-1.5">
          <Star className="size-3 text-[color:var(--accent)] fill-[color:var(--accent)]" />
          <span className="font-medium text-[color:var(--foreground)] tnum">{driver.rating}</span>
          <span>· {driver.trips} trips</span>
          <span className="text-[color:var(--border-strong)]">·</span>
          <span className="tnum">{driver.plate}</span>
        </p>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[color:var(--muted)]">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}
