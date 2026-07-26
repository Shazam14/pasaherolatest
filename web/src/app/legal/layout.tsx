import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="border-b border-[color:var(--border)] bg-[color:var(--surface-muted)]">
          <div className="mx-auto max-w-3xl px-5 md:px-8 py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            >
              ← Back home
            </Link>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-5 md:px-8 py-10 md:py-14">{children}</section>
      </main>
      <Footer />
    </>
  );
}
