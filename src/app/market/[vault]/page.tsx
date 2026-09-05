import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MARKETS, kindLabel } from "@/data/markets";
import { apy, custody, tvl } from "@/lib/markets";
import { DepositPanel } from "@/components/DepositPanel";
import { PriceChart } from "@/components/PriceChart";
import { Label, Panel, ReadThis, SampleNote, Stat, Terms } from "@/components/ui";
import { AssetLogo } from "@/components/AssetLogo";
import { age, amount, bps, launchedOn, percent, price, shortAddress } from "@/lib/format";
import { chain, explorerAddress, siteConfig, terms } from "@/lib/site-config";

export function generateStaticParams() {
  return MARKETS.map((m) => ({ vault: m.vault }));
}

export async function generateMetadata(
  props: PageProps<"/market/[vault]">,
): Promise<Metadata> {
  const { vault } = await props.params;
  const market = MARKETS.find(
    (m) => m.vault.toLowerCase() === vault.toLowerCase(),
  );
  if (!market) return { title: "Market not found" };
  return {
    title: market.name,
    description:
      market.description ??
      `A ${kindLabel(market.kind).toLowerCase()} market on ${siteConfig.name}, denominated in ${market.asset}.`,
  };
}

export default async function MarketPage(props: PageProps<"/market/[vault]">) {
  const { vault } = await props.params;
  const market = MARKETS.find(
    (m) => m.vault.toLowerCase() === vault.toLowerCase(),
  );
  if (!market) notFound();

  const a = apy(market);
  const c = custody(market);
  const total = tvl(market);
  const capUsed = market.depositCap > 0 ? total / market.depositCap : null;

  return (
    <div className="shell py-10">
      <Link href="/markets" className="label transition-colors hover:text-hi">
        ← All markets
      </Link>

      {/* ------------------------------------------------------------- header */}
      <header className="mt-6 flex flex-wrap items-start justify-between gap-6 border-b border-[var(--line)] pb-8">
        <div className="flex items-start gap-4">
          <AssetLogo asset={market.asset} fallback={market.mark} size={52} />
          <div>
            <h1 className="display text-[clamp(26px,4.4vw,40px)]">
              {market.name}
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="chip">{market.ticker}</span>
              <span className="chip">{kindLabel(market.kind)}</span>
              <span className="chip">{market.asset} denominated</span>
              <span className="chip">
                {market.maxDeployBps === 0 ? "capital locked in vault" : c.label}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <Label>Vault</Label>
          <p className="num mt-2 text-[12px]">{shortAddress(market.vault, 10, 8)}</p>
          <a
            href={explorerAddress(market.vault)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-glass btn-sm mt-3"
          >
            On the explorer
          </a>
        </div>
      </header>

      <div className="mt-4">
        <SampleNote>
          Sample market. The factory is not deployed, so nothing below was read
          from a chain.
        </SampleNote>
      </div>

      {/* ---------------------------------------------------------------- kpis */}
      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
        <div className="bg-surface">
          <Stat
            label="APY since launch"
            value={a === null ? <span className="text-low">too new</span> : percent(a)}
          />
        </div>
        <div className="bg-surface">
          <Stat label="Total value" value={amount(total, market.asset)} />
        </div>
        <div className="bg-surface">
          <Stat
            label="Price per share"
            value={price(market.pricePerShare)}
            sub={market.asset}
          />
        </div>
        <div className="bg-surface">
          <Stat label="Depositors" value={market.depositors} />
        </div>
      </div>

      {/* min-w-0 on both columns: a grid item defaults to min-width:auto, so
          without it the activity table's min-w-[560px] sizes the whole column
          and the page scrolls sideways on a phone instead of the table. */}
      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7 xl:col-span-8">
          {/* ------------------------------------------------------- the chart */}
          <section>
            <div className="flex items-baseline justify-between pb-3">
              <Label>Price per share</Label>
              <span className="num text-[11px] text-low">
                since launch · {launchedOn(market.ageMinutes)}
              </span>
            </div>
            <hr className="rule-x" />
            <div className="pt-6">
              <PriceChart history={market.history} asset={market.asset} />
            </div>
          </section>

          {/* ---------------------------------------------------- the strategy */}
          <section className="mt-14">
            <Label>The strategy</Label>
            <hr className="rule-x mt-2" />
            <h2 className="display mt-6 text-[26px]">
              {kindLabel(market.kind)}
            </h2>
            <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-mid">
              {market.description ??
                "The creator left no description. Everything that matters is still readable in the terms below."}
            </p>

            <div className="mt-6">
              <Terms
                rows={[
                  ["Creator", shortAddress(market.creator)],
                  [
                    "Strategy",
                    market.strategy
                      ? `${market.strategyLabel} · ${shortAddress(market.strategy)}`
                      : "none — capital never leaves",
                  ],
                ]}
              />
            </div>

            {market.maxDeployBps === 0 ? (
              <p className="mt-5 border-l-2 border-violet pl-4 text-[13px] leading-relaxed text-mid">
                This market was opened with a deploy ceiling of zero. No
                address, not even the creator&apos;s, can move capital out of
                the vault — carry has to be paid in from outside.
              </p>
            ) : null}
          </section>

          {/* ----------------------------------------------------- the capital */}
          <section className="mt-14">
            <Label>Capital right now</Label>
            <hr className="rule-x mt-2" />

            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div>
                {/* Custody bar: idle in ink, deployed hatched away from it. */}
                <div className="flex h-3 w-full overflow-hidden border border-[var(--line-strong)]">
                  <div
                    className="brand-fill"
                    style={{ width: `${total > 0 ? (market.idle / total) * 100 : 0}%` }}
                  />
                  <div
                    className="bg-surface-3"
                    style={{ width: `${total > 0 ? (market.deployed / total) * 100 : 0}%` }}
                  />
                </div>
                <div className="mt-3">
                  <Terms
                    rows={[
                      ["Idle in the vault", amount(market.idle, market.asset)],
                      ["At the strategy", amount(market.deployed, market.asset)],
                      [
                        "Deploy ceiling",
                        market.maxDeployBps === 0
                          ? "0% — it never leaves"
                          : bps(market.maxDeployBps),
                      ],
                    ]}
                  />
                </div>
              </div>

              <div>
                <Label>Deposit cap</Label>
                <p className="num mt-2 text-[20px]">
                  {market.depositCap === 0
                    ? "uncapped"
                    : `${amount(total)} / ${amount(market.depositCap)} ${market.asset}`}
                </p>
                {capUsed !== null ? (
                  <div className="mt-3 h-3 w-full border border-[var(--line-strong)]">
                    <div
                      className="brand-fill h-full"
                      style={{ width: `${Math.min(capUsed * 100, 100)}%` }}
                    />
                  </div>
                ) : null}
                <p className="mt-3 text-[12.5px] leading-relaxed text-low">
                  A withdrawal larger than the idle balance reverts. It does not
                  queue, and nothing here pretends otherwise.
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------ the terms */}
          <section className="mt-14">
            <Label>Market terms</Label>
            <hr className="rule-x mt-2" />
            <div className="mt-6">
              <Terms
                rows={[
                  ["Asset", market.asset],
                  ["Share token", market.ticker],
                  [
                    "Deploy ceiling",
                    market.maxDeployBps === 0
                      ? "none — capital stays put"
                      : bps(market.maxDeployBps),
                  ],
                  [
                    "Strategy address",
                    market.strategy ? shortAddress(market.strategy) : "not used",
                  ],
                  ["Performance fee", `${bps(market.performanceFeeBps)} of carry`],
                  ["Works' share of the fee", `${bps(terms.protocolCutBps)} of it`],
                  [
                    "Deposit cap",
                    market.depositCap === 0
                      ? "uncapped"
                      : amount(market.depositCap, market.asset),
                  ],
                  ["Lifetime deposits", amount(market.totalDeposited, market.asset)],
                  ["Lifetime withdrawals", amount(market.totalWithdrawn, market.asset)],
                  ["Lifetime carry", amount(market.totalYield, market.asset)],
                  ["Shares outstanding", amount(market.sharesOutstanding)],
                  [
                    "Opened",
                    `${launchedOn(market.ageMinutes)} · ${age(market.ageMinutes)} ago`,
                  ],
                  ["Owner", "none — the vault cannot be paused or upgraded"],
                ]}
              />
            </div>
          </section>

          {/* -------------------------------------------------------- activity */}
          <section className="mt-14">
            <Label>Activity</Label>
            <hr className="rule-x mt-2" />
            <div className="mt-4 -mx-3 overflow-x-auto px-3">
              <table className="tbl min-w-[560px]">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Detail</th>
                    <th className="r">Amount</th>
                    <th className="r">When</th>
                  </tr>
                </thead>
                <tbody>
                  {market.activity.map((e, i) => (
                    <tr key={i}>
                      <td className="num text-[12px] whitespace-nowrap">
                        {e.event}
                      </td>
                      <td className="text-[12.5px] text-mid">{e.detail}</td>
                      <td className="num r whitespace-nowrap">{e.amount}</td>
                      <td className="num r text-low">{age(e.minutesAgo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* --------------------------------------------------------- the ticket */}
        <aside className="min-w-0 lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-24">
            <DepositPanel market={market} />

            <div className="mt-6">
              <ReadThis
                label="Before you deposit"
                items={[
                  `${siteConfig.name} has not reviewed this strategy. Nobody has.`,
                  "The creator earns a fee on carry, so their incentive is to make the vault worth more — not to protect it from loss.",
                  market.maxDeployBps === 0
                    ? "Capital in this market never leaves the vault, so withdrawals are always available against what it holds."
                    : `Up to ${bps(market.maxDeployBps)} of this vault can be sitting at the strategy, and that part is not withdrawable until it comes back.`,
                ]}
              />
            </div>

            <Panel tint className="mt-6 p-5">
              <Label>Chain</Label>
              <div className="mt-3">
                <Terms
                  rows={[
                    ["Network", chain.name],
                    ["Vault", shortAddress(market.vault)],
                    ["Creator", shortAddress(market.creator)],
                  ]}
                />
              </div>
            </Panel>
          </div>
        </aside>
      </div>
    </div>
  );
}
