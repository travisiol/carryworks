import Link from "next/link";
import { Wordmark } from "@/components/Logo";
import { siteConfig } from "@/lib/site-config";

const SECTIONS = [
  { href: "/markets", label: "Markets" },
  { href: "/#flow", label: "How it works" },
  { href: "/#vault", label: "The vault" },
  { href: "/CarryWorks.sol.txt", label: "Contract", file: true },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-void/70 backdrop-blur-[6px]">
      <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label={siteConfig.name}>
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {SECTIONS.map((s) =>
            s.file ? (
              <a
                key={s.href}
                href={s.href}
                className="label transition-colors hover:text-hi"
              >
                {s.label}
              </a>
            ) : (
              <Link
                key={s.href}
                href={s.href}
                className="label transition-colors hover:text-hi"
              >
                {s.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/launch" className="btn btn-brand btn-sm">
            Open a market
          </Link>
          <button type="button" className="btn btn-glass btn-sm hidden sm:inline-flex">
            Connect
          </button>
        </div>
      </div>

      {/* Mobile keeps the section links as a ruled tab strip rather than a
          drawer — a document has tabs, not a hamburger. */}
      <div className="border-t border-[var(--line-soft)] md:hidden">
        <div className="shell flex gap-5 overflow-x-auto py-2">
          {SECTIONS.map((s) =>
            s.file ? (
              <a key={s.href} href={s.href} className="label whitespace-nowrap">
                {s.label}
              </a>
            ) : (
              <Link key={s.href} href={s.href} className="label whitespace-nowrap">
                {s.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </header>
  );
}
