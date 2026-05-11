import { seedOperators } from "@/content/corridor";
import { CheckCircle2 } from "lucide-react";

export function Operators() {
  return (
    <section id="operators" className="border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
        <div className="flex flex-col gap-3 max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.12em] text-[color:var(--accent)] font-medium">
            On the platform
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em]">
            Verified Manila ⇆ Baguio operators.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {seedOperators.map((op) => (
            <div
              key={op.id}
              className="group rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 hover:border-[color:var(--border-strong)] transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="size-10 rounded-lg bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] opacity-90 flex items-center justify-center text-[color:var(--primary-foreground)] font-semibold text-sm">
                  {op.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <CheckCircle2 className="size-4 text-[color:var(--success)]" />
              </div>
              <p className="text-sm font-medium tracking-tight">{op.name}</p>
              <p className="text-xs text-[color:var(--muted)] mt-0.5">{op.type}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-[color:var(--muted)]">
          You run a bus line, UV Express, or transport co-op?{" "}
          <a className="text-[color:var(--foreground)] underline decoration-[color:var(--accent)] underline-offset-4" href="/operators">
            List your schedules — it&apos;s free.
          </a>
        </p>
      </div>
    </section>
  );
}
