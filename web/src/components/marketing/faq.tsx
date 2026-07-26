const faqs = [
  {
    q: "Is Pasahero PH a ride-hailing app like Grab?",
    a: "No. We're building an inter-region booking platform — bus and van seats, not on-demand rides. The idea is that you compare licensed operators on a route and book in one place. We're not live yet, so nothing is bookable today.",
  },
  {
    q: "How do you make money if drivers keep 100%?",
    a: "Advertising, mainly — sponsored placements alongside results and on booking confirmations. Later, a software subscription for operators who want bulk schedule management. We never take a cut of the fare, and carpool listings carry no booking fee at all.",
  },
  {
    q: "What corridors do you cover?",
    a: "None yet. Manila ⇆ Baguio is the one we're opening first. La Union, Clark, Subic, Tagaytay, Batangas and Naga are lined up behind it — but which we actually open depends on what commuters ask for, so tell us your route.",
  },
  {
    q: "Can I pay in cash?",
    a: "That's the plan — reserve online, then pay cash at the terminal or by GCash, Maya, or card. Payments aren't built yet, so this is what we're working toward rather than something you can do now.",
  },
  {
    q: "Will operators be verified?",
    a: "Yes. Before any operator can list seats they'll have to show an active LTFRB Certificate of Public Convenience and proof of passenger insurance. That's why we're onboarding licensed operators first, ahead of anything else.",
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
