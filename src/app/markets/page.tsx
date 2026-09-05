import type { Metadata } from "next";
import { MarketBrowser } from "@/components/MarketBrowser";
import { Label, SampleNote, Stat } from "@/components/ui";
import { KINDS, type Kind } from "@/data/markets";
import { factoryTotals, MIN_AGE_FOR_APY_MINUTES } from "@/lib/markets";
import { chain, siteConfig, terms } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Carry markets",
  description: `Every market the ${siteConfig.name} factory has opened on ${chain.name}. Nothing here is curated, ranked or endorsed.`,
};

export default async function MarketsPage(props: PageProps<"/markets">) {
  const totals = factoryTotals();
  /* Resolved here rather than in the client component, so a ?kind= deep link
     renders the right rows on the server's first pass. */
  const { kind } = await props.searchParams;
  const initialKind =
    typeof kind === "string" && KINDS.some((k) => k.id === kind)
      ? (kind as Kind)
      : "all";

  return (
    <div className="shell py-14">
      <Label>Every market the works has opened</Label>
      <h1 className="display mt-4 text-[clamp(34px,6vw,58px)]">
        The registry
      </h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-mid">
        Read straight from the {siteConfig.name} factory on {chain.name}.
        Nothing here is curated, ranked or endorsed — it is simply everything
        that exists, in whatever order you ask for it.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
        <div className="bg-surface">
          <Stat label="Markets" value={totals.markets} />
        </div>
        <div className="bg-surface">
          <Stat label="Depositors" value={totals.depositors} />
        </div>
        <div className="bg-surface">
          <Stat label="Assets in use" value={totals.assets} />
        </div>
        <div className="bg-surface">
          <Stat
            label="Launch fee"
            value={`${terms.launchFee} ${terms.launchFeeSymbol}`}
          />
        </div>
      </div>

      <div className="mt-8">
        <SampleNote />
      </div>

      <div className="mt-8">
        {/* No Suspense boundary here on purpose — see MarketBrowser. */}
        <MarketBrowser initialKind={initialKind} />
      </div>

      <p className="mt-6 max-w-2xl text-[12px] leading-relaxed text-low">
        APY is annualised from a market&apos;s own price per share since launch,
        and from nothing else. A market younger than{" "}
        {MIN_AGE_FOR_APY_MINUTES / 60} hours does not get one — the number would
        be noise.
      </p>
    </div>
  );
}
