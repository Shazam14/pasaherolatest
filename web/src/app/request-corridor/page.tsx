import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { RequestForm } from "@/components/marketing/request-form";
import { getDemandBoard, type DemandRow } from "@/lib/demand";
import { painLabel } from "@/content/pains";
import { ArrowUp, MapPin, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Request a corridor",
  description:
    "Tell us the route you wish existed. We open corridors where commuters say current options are broken.",
};

// The board counts live submissions, so it must never be served from cache.
export const dynamic = "force-dynamic";

export default async function RequestCorridorPage() {
  const requests = await getDemandBoard(8);

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
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start">
            <RequestForm />

            <aside>
              <div className="flex items-center gap-2 text-[color:var(--muted)]">
                <MessageSquare className="size-4" />
                <span className="text-xs uppercase tracking-[0.12em] font-medium">
                  What others are asking for
                </span>
              </div>
              <p className="text-sm text-[color:var(--muted)] leading-relaxed mt-3 max-w-md">
                Every gap commuters have reported so far, counted live. A route only moves
                if enough people name the same missing trip.
              </p>

              {requests.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-[color:var(--border-strong)] bg-[color:var(--surface)] p-6">
                  <p className="font-medium tracking-tight">Nothing here yet.</p>
                  <p className="text-sm text-[color:var(--muted)] mt-1.5 leading-relaxed">
                    Nobody has reported a gap yet — yours would be the first on the board.
                  </p>
                </div>
              ) : (
                <ul className="mt-6 space-y-3">
                  {requests.map((r) => (
                    <RequestRow key={`${r.origin}-${r.destination}-${r.pain}`} request={r} />
                  ))}
                </ul>
              )}

              <p className="text-xs text-[color:var(--muted)] mt-6 leading-relaxed inline-flex items-start gap-1.5">
                <MapPin className="size-3.5 mt-0.5 flex-shrink-0 text-[color:var(--accent)]" />
                See your route here? Submit it anyway — duplicates count as votes. The
                more people asking, the faster we move.
              </p>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function RequestRow({ request }: { request: DemandRow }) {
  return (
    <li className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 flex gap-3">
      <div className="flex flex-col items-center justify-center rounded-lg bg-[color:var(--surface-muted)] px-2.5 py-1.5 min-w-12">
        <ArrowUp className="size-3.5 text-[color:var(--muted)]" />
        <span className="text-sm font-semibold tnum">{request.votes}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium tracking-tight">
          {request.origin} <span className="text-[color:var(--muted)]">→</span>{" "}
          {request.destination}
        </p>
        <p className="text-xs text-[color:var(--muted)] mt-1.5 leading-relaxed">
          {painLabel(request.pain)}
        </p>
        <p className="text-[0.65rem] uppercase tracking-[0.08em] text-[color:var(--muted)] mt-2">
          {request.votes === 1 ? "1 person asking" : `${request.votes} people asking`}
        </p>
      </div>
    </li>
  );
}
