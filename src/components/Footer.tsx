import Link from "next/link";
import { Wordmark } from "@/components/Logo";
import { Label } from "@/components/ui";
import { siteConfig, chain } from "@/lib/site-config";
import { contractAddress, AWAITING } from "@/lib/contracts";

const COLUMNS: { head: string; links: { label: string; href: string; ext?: boolean }[] }[] = [
  {
    head: "Product",
    links: [
      { label: "All markets", href: "/markets" },
      { label: "Open a market", href: "/launch" },
      { label: "Markets you opened", href: "/launch#mine" },
      { label: "CarryVault source", href: "/CarryWorks.sol.txt", ext: true },
    ],
  },
  {
    head: "Chain",
    links: [
      { label: "Explorer", href: chain.explorer, ext: true },
      { label: "The works factory", href: "/#vault" },
      { label: "Fee collector", href: "/#vault" },
    ],
  },
  {
    head: "Understand it",
    links: [
      { label: "The five steps", href: "/#flow" },
      { label: "What gets deployed", href: "/#vault" },
      { label: "What can be a carry", href: "/#kinds" },
      { label: `${siteConfig.name} on X ↗`, href: `https://x.com/${siteConfig.x}`, ext: true },
    ],
  },
];

export function Footer() {
  const factory = contractAddress("factory");

  return (
    <footer className="mt-24 border-t border-[var(--line)] bg-surface">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-mid">
              A permissionless works for carry markets on {chain.name}.{" "}
              {siteConfig.name} never holds a deposit, never routes capital and
              never vouches for a strategy.
            </p>
            <p className="num mt-5 text-[11.5px] text-low">
              Factory {factory ?? AWAITING}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.head} className="md:col-span-2">
              <Label>{col.head}</Label>
              <ul className="mt-4 grid gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.ext ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[13px] text-mid transition-colors hover:text-hi"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-[13px] text-mid transition-colors hover:text-hi"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="perf my-10" />

        {/* The register at the bottom of the page. Small type, plainly said,
            and not to be trimmed in a tidy-up. */}
        <div className="grid gap-3 text-[11.5px] leading-relaxed text-low md:max-w-3xl">
          <p>
            {siteConfig.name} is infrastructure. A market listed here has not
            been reviewed, endorsed or diligenced by anyone — not by us, not by
            a committee, not by the chain.
          </p>
          <p>
            A carry market can lose money. Capital deployed to a strategy is at
            that strategy&apos;s risk and may not come back. Read the custody
            terms on a market before depositing, and treat a strategy address
            you cannot identify as an address you should not fund.
          </p>
          <p>
            Nothing here is investment advice. Every transaction is built in
            your browser and approved in your own wallet.
          </p>
          <p className="num pt-2">
            © {new Date().getUTCFullYear()} {siteConfig.name} · ${siteConfig.ticker}
          </p>
        </div>
      </div>
    </footer>
  );
}
