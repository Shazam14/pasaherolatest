import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[color:var(--border)] bg-[color:var(--background)]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="Pasahero PH home" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[color:var(--muted)] md:flex">
          <a href="#how" className="hover:text-[color:var(--foreground)] transition-colors">How it works</a>
          <a href="#operators" className="hover:text-[color:var(--foreground)] transition-colors">Operators</a>
          <a href="#why" className="hover:text-[color:var(--foreground)] transition-colors">Why Pasahero PH</a>
          <a href="#faq" className="hover:text-[color:var(--foreground)] transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/drivers/apply?as=operator" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm">For operators</Button>
          </Link>
          <Button variant="dark" size="sm">Sign in</Button>
        </div>
      </div>
    </header>
  );
}
