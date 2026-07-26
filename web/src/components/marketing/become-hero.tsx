import Link from "next/link";
import { Car, Fuel, ShieldCheck, ArrowRight, Star } from "lucide-react";

const perks = [
  {
    icon: Fuel,
    title: "Recover your fuel cost",
    body: "List your empty seats on a Manila ⇆ Baguio trip you're already taking. Passengers chip in for gas. You don't pay us a peso.",
  },
  {
    icon: ShieldCheck,
    title: "Verified passengers only",
    body: "Every passenger goes through SMS verification before they can book. You see their name, contact, and trip history.",
  },
  {
    icon: Star,
    title: "Build your Hero rating",
    body: "Top-rated Heroes get listed first in search results. More visibility = more passengers = better fuel offset.",
  },
];

export function BecomeHero() {
  return (
    <section className="relative border-t border-[color:var(--border)] overflow-hidden">
      <div className="absolute inset-0 bg-horizon opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--accent)]/10 border border-[color:var(--accent)]/30 text-[color:var(--accent)] px-3 py-1 text-xs font-medium uppercase tracking-[0.1em]">
              <Car className="size-3.5" />
              For drivers
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] mt-4">
              Heading to Baguio? Bring some passengers.
            </h2>
            <p className="text-lg text-[color:var(--muted)] leading-relaxed mt-5 max-w-xl">
              Gas is up. Tolls are up. If you&apos;re already driving the route, your empty seats
              are paying you nothing. List them on Pasahero PH and let passengers help cover the
              fuel — no commission, no contracts, no quotas.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/drivers/apply"
                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-6 h-12 text-base font-medium hover:opacity-90 transition-opacity"
              >
                Become a Hero Driver <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/#how"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--foreground)] hover:text-[color:var(--accent)] transition-colors h-12 px-2"
              >
                See how it works
              </Link>
            </div>

            <p className="text-xs text-[color:var(--muted)] mt-6 max-w-md leading-relaxed">
              Carpool listings are for fuel-cost sharing among verified members. Drivers retain
              private-vehicle status — Pasahero PH does not operate as a TNVS or commercial carrier.
            </p>
          </div>

          <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)]/90 backdrop-blur p-6 md:p-7 shadow-[0_24px_64px_-32px_oklch(0.16_0.05_250/0.4)]">
            <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--muted)] mb-5">
              How it pays back
            </p>
            <ul className="space-y-5">
              {perks.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--accent)]/10 text-[color:var(--accent)] flex-shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold tracking-tight">{title}</p>
                    <p className="text-sm text-[color:var(--muted)] leading-relaxed mt-1">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
