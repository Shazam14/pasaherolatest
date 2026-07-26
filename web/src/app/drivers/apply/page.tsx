import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { ApplyForm } from "@/components/supply/apply-form";
import { BadgeCheck, Coins, HandCoins } from "lucide-react";
import Link from "next/link";

type Search = { as?: string };

export const metadata = {
  title: "Apply to carry passengers",
  description:
    "Bus lines, UV Express and transport co-ops running Manila ⇆ Baguio — list your schedules free. No commission, ever.",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const initialType = sp.as === "driver" ? "hero_driver" : "operator";

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface-muted)]">
          <div className="mx-auto max-w-6xl px-5 md:px-8 py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            >
              ← Back home
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] mt-4">
              Carry passengers on Pasahero PH.
            </h1>
            <p className="text-base md:text-lg text-[color:var(--muted)] leading-relaxed mt-3 max-w-2xl">
              We&apos;re opening Manila ⇆ Baguio first, and we&apos;re onboarding licensed operators
              before anything else. Tell us what you run and we&apos;ll come to you.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start">
            <ApplyForm initialType={initialType} />

            <aside className="grid gap-4">
              <Point icon={<Coins className="size-5" />} title="You keep 100% of the fare">
                We take no commission from operators or drivers — not now, not later. The platform
                is funded by advertising, so your fare is your fare.
              </Point>
              <Point icon={<BadgeCheck className="size-5" />} title="Licensed operators first">
                We aggregate operators who hold a CPC. That keeps passengers on legal, insured
                transport and keeps us out of the franchise grey area.
              </Point>
              <Point icon={<HandCoins className="size-5" />} title="No contracts, no quotas">
                List a schedule, pull it whenever. We&apos;re trying to fill empty seats, not lock
                you into anything.
              </Point>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Point({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
      <span className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
        {icon}
      </span>
      <h2 className="font-semibold tracking-tight mt-4">{title}</h2>
      <p className="text-sm text-[color:var(--muted)] leading-relaxed mt-1.5">{children}</p>
    </div>
  );
}
