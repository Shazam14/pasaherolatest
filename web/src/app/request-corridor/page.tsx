import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { RequestForm } from "@/components/marketing/request-form";
import {
  topRequests,
  statusLabel,
  type RouteRequest,
} from "@/content/requests";
import { ArrowUp, MapPin, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Request a corridor",
  description:
    "Tell us the route you wish existed. We open corridors where commuters say current options are broken.",
};

export default function RequestCorridorPage() {
  const requests = topRequests(6);

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
                Real requests from commuters in closed beta. We sort by upvotes — the more
                people stuck on a route, the higher it goes.
              </p>

              <ul className="mt-6 space-y-3">
                {requests.map((r) => (
                  <RequestRow key={r.id} request={r} />
                ))}
              </ul>

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

function RequestRow({ request }: { request: RouteRequest }) {
  const statusColor =
    request.status === "launching"
      ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
      : request.status === "researching"
      ? "bg-[color:var(--accent)]/15 text-[color:var(--accent)]"
      : "bg-[color:var(--surface-muted)] text-[color:var(--muted)]";

  return (
    <li className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 flex gap-3">
      <div className="flex flex-col items-center justify-center rounded-lg bg-[color:var(--surface-muted)] px-2.5 py-1.5 min-w-12">
        <ArrowUp className="size-3.5 text-[color:var(--muted)]" />
        <span className="text-sm font-semibold tnum">{request.votes}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className="font-medium tracking-tight">
            {request.origin}{" "}
            <span className="text-[color:var(--muted)]">→</span>{" "}
            {request.destination}
          </p>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.08em] font-medium ${statusColor}`}
          >
            {statusLabel(request.status)}
          </span>
        </div>
        <p className="text-xs text-[color:var(--muted)] mt-1.5 leading-relaxed">
          {request.pain}
        </p>
        <p className="text-[0.65rem] uppercase tracking-[0.08em] text-[color:var(--muted)] mt-2">
          {request.requestedBy} · {request.postedAgo}
        </p>
      </div>
    </li>
  );
}
