import { desc } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { painLabel } from "@/content/pains";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Submissions",
  robots: { index: false, follow: false },
};

function when(d: Date | string) {
  return new Date(d).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  });
}

export default async function AdminPage() {
  if (!db) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-10">
        <p>Database isn&apos;t connected.</p>
      </main>
    );
  }

  const [requests, applications, feedback] = await Promise.all([
    db.select().from(schema.routeRequests).orderBy(desc(schema.routeRequests.createdAt)).limit(200),
    db
      .select()
      .from(schema.supplyApplications)
      .orderBy(desc(schema.supplyApplications.createdAt))
      .limit(200),
    db
      .select()
      .from(schema.feedbackSubmissions)
      .orderBy(desc(schema.feedbackSubmissions.createdAt))
      .limit(200),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-5 md:px-8 py-10 md:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Submissions</h1>
      <p className="text-sm text-[color:var(--muted)] mt-1">
        All times Manila. Newest first, 200 max per section. Contains personal data — don&apos;t
        share this page.
      </p>

      <Section title="Route requests" count={requests.length}>
        {requests.map((r) => (
          <Row key={r.id} when={when(r.createdAt)}>
            <p className="font-medium tracking-tight">
              {r.origin} <span className="text-[color:var(--muted)]">→</span> {r.destination}
            </p>
            <p className="text-sm text-[color:var(--muted)] mt-1">{painLabel(r.pain)}</p>
            {r.details ? <p className="text-sm mt-2 leading-relaxed">{r.details}</p> : null}
            <Meta>
              {r.contact}
              {r.frequency ? ` · ${r.frequency}` : ""}
            </Meta>
          </Row>
        ))}
      </Section>

      <Section title="Operator / driver applications" count={applications.length}>
        {applications.map((a) => (
          <Row key={a.id} when={when(a.createdAt)}>
            <p className="font-medium tracking-tight">
              {a.name}{" "}
              <span className="text-xs uppercase tracking-[0.08em] text-[color:var(--accent)]">
                {a.applicantType === "operator" ? "operator" : "hero driver"}
              </span>
            </p>
            <p className="text-sm text-[color:var(--muted)] mt-1">{a.corridor}</p>
            {a.notes ? <p className="text-sm mt-2 leading-relaxed">{a.notes}</p> : null}
            <Meta>
              {a.contact}
              {a.cpcNumber ? ` · CPC ${a.cpcNumber}` : ""}
              {a.vehicleClass ? ` · ${a.vehicleClass}` : ""}
              {a.seats ? ` · ${a.seats} seats` : ""}
            </Meta>
          </Row>
        ))}
      </Section>

      <Section title="Feedback" count={feedback.length}>
        {feedback.map((f) => (
          <Row key={f.id} when={when(f.createdAt)}>
            <p className="text-sm leading-relaxed">{f.message}</p>
            <Meta>
              {f.pagePath}
              {f.contact ? ` · ${f.contact}` : ""}
            </Meta>
          </Row>
        ))}
      </Section>
    </main>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight">
        {title} <span className="text-[color:var(--muted)] tnum">({count})</span>
      </h2>
      {count === 0 ? (
        <p className="text-sm text-[color:var(--muted)] mt-2">Nothing yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">{children}</ul>
      )}
    </section>
  );
}

function Row({ when, children }: { when: string; children: React.ReactNode }) {
  return (
    <li className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
      <p className="text-[0.65rem] uppercase tracking-[0.08em] text-[color:var(--muted)] mb-2">
        {when}
      </p>
      {children}
    </li>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-[color:var(--muted)] mt-2 font-mono break-all">{children}</p>
  );
}
