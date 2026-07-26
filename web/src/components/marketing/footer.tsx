import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface-muted)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4 max-w-xs">
            <Logo />
            <p className="text-sm text-[color:var(--muted)] leading-relaxed">
              Inter-region travel for the Philippines. Drivers keep 100%. We don&apos;t take from the fare.
            </p>
          </div>
          <FooterCol
            title="Travel"
            links={[
              { href: "/search?corridor=manila-baguio", label: "Manila ⇆ Baguio" },
              { href: "/request-corridor", label: "Request a corridor" },
              { href: "/#corridors", label: "All corridors" },
            ]}
          />
          <FooterCol
            title="For operators"
            links={[
              { href: "/drivers/apply?as=operator", label: "List your schedules" },
              { href: "/drivers/apply?as=driver", label: "Become a Hero Driver" },
              { href: "/#operators", label: "Lines we want on board" },
            ]}
          />
        </div>
        <div className="divider mb-6" />
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 text-xs text-[color:var(--muted)]">
          <p>© {new Date().getFullYear()} Pasahero PH. Beta — Manila ⇆ Baguio corridor.</p>
          <p>
            Built in 🇵🇭 — registered with the National Privacy Commission (pending).
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--foreground)] font-medium">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
