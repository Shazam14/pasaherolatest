import Link from "next/link";

export const metadata = {
  title: "Terms of service",
  description: "Terms will be published before booking opens on Pasahero PH.",
};

export default function TermsPage() {
  return (
    <article>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em]">Terms of service</h1>

      <div className="mt-6 rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] p-6">
        <p className="text-[color:var(--muted)] leading-relaxed">
          Not published yet — and deliberately so. Terms govern who is responsible when a trip goes
          wrong, between you, us, and the operator carrying you. Writing that before we have a
          single operator on board would mean writing it about nothing.
        </p>
        <p className="text-[color:var(--muted)] leading-relaxed mt-3">
          Booking is closed, so there is nothing yet for terms to cover. They will be published,
          reviewed by counsel, before the first seat can be booked.
        </p>
      </div>

      <p className="text-[color:var(--muted)] leading-relaxed mt-6">
        Our{" "}
        <Link
          href="/legal/privacy"
          className="text-[color:var(--foreground)] underline decoration-[color:var(--accent)] underline-offset-4"
        >
          privacy notice
        </Link>{" "}
        is live now and covers everything we currently collect.
      </p>
    </article>
  );
}
