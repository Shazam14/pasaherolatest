import { HandCoins, ShieldCheck, MapPinned, Megaphone } from "lucide-react";

const points = [
  {
    icon: HandCoins,
    title: "Drivers keep 100% of the fare",
    body: "We don't take a commission from operators or drivers. Our platform is funded by ads and a small passenger booking fee — never the driver's pocket.",
  },
  {
    icon: ShieldCheck,
    title: "Verified operators only",
    body: "Every bus line and van operator is checked for an active LTFRB CPC and passenger insurance before they list a single seat.",
  },
  {
    icon: MapPinned,
    title: "Built for inter-region",
    body: "Grab won't take you to Baguio. We will. Manila ⇆ Baguio first, then Cebu ⇆ Bohol, Manila ⇆ Batangas, and the daily Cavite ⇆ Manila commute.",
  },
  {
    icon: Megaphone,
    title: "Advocacy, not extraction",
    body: "We started this in 2024 to fight an industry that punishes drivers and overcharges commuters. We're back, and the model is finally clean.",
  },
];

export function WhyUs() {
  return (
    <section id="why" className="border-t border-[color:var(--border)] bg-[color:var(--surface-muted)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
        <div className="flex flex-col gap-3 max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.12em] text-[color:var(--accent)] font-medium">
            Why pasaheroph
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em]">
            A booking platform that doesn&apos;t bleed the driver.
          </h2>
          <p className="text-lg text-[color:var(--muted)] leading-relaxed mt-2">
            Most ride apps in the Philippines take 20–30% from every fare, then pass the cost to passengers
            via inflated pricing. We don&apos;t. Here&apos;s what that means in practice.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {points.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-[color:var(--accent)]/10 text-[color:var(--accent)] mb-5">
                <Icon className="size-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-2">{title}</h3>
              <p className="text-[color:var(--muted)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
