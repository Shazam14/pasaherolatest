const faqs = [
  {
    q: "Is Pasahero PH a ride-hailing app like Grab?",
    a: "No. We're an inter-region booking platform — think bus and van seats, not on-demand rides. We aggregate verified operators (Victory Liner, Genesis, Joybus, UV Express, etc.) so you can compare and reserve in one place.",
  },
  {
    q: "How do you make money if drivers keep 100%?",
    a: "Three ways: a small passenger booking fee, sponsored placements and ads on our results pages, and a software subscription for transport operators who want bulk schedule management. None of it touches the driver's fare.",
  },
  {
    q: "What corridors do you cover?",
    a: "Beta launches with Manila ⇆ Baguio. Next: Cebu ⇆ Bohol, Manila ⇆ Batangas (Mindoro/Boracay gateway), and Cavite/Laguna ⇆ Manila daily commuter.",
  },
  {
    q: "Can I pay in cash?",
    a: "Yes. You can reserve now and pay cash at the terminal, or pay online via GCash, Maya, or card. Your choice.",
  },
  {
    q: "Are operators verified?",
    a: "Every operator must show an active LTFRB Certificate of Public Convenience and proof of passenger insurance before they can list seats on the platform.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-3xl px-5 md:px-8 py-20 md:py-28">
        <div className="flex flex-col gap-3 mb-12">
          <span className="text-xs uppercase tracking-[0.12em] text-[color:var(--accent)] font-medium">
            Common questions
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em]">
            Quick answers.
          </h2>
        </div>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                <span className="text-base md:text-lg font-medium tracking-tight">{f.q}</span>
                <span className="flex size-8 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--muted)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-[color:var(--muted)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
