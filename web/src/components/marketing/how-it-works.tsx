import { Search, Ticket, Bus } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Search,
    title: "Search & compare",
    body: "Every Manila ⇆ Baguio departure, side by side. Sort by time, price, or operator.",
  },
  {
    n: "02",
    icon: Ticket,
    title: "Reserve your seat",
    body: "Book in under a minute. Pay later in cash, or now via GCash, Maya, or card.",
  },
  {
    n: "03",
    icon: Bus,
    title: "Skip the queue",
    body: "Show your QR ticket at the terminal. The operator boards you straight to your seat.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
        <div className="flex flex-col gap-3 max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.12em] text-[color:var(--accent)] font-medium">
            How it works
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em]">
            From search to seat in three steps.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map(({ n, icon: Icon, title, body }) => (
            <div
              key={n}
              className="group relative rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7 hover:border-[color:var(--border-strong)] transition-colors"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono tnum text-sm text-[color:var(--muted)]">{n}</span>
                <div className="flex size-11 items-center justify-center rounded-xl bg-[color:var(--surface-muted)] text-[color:var(--accent)] group-hover:bg-[color:var(--accent)] group-hover:text-[color:var(--accent-foreground)] transition-colors">
                  <Icon className="size-5" />
                </div>
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
