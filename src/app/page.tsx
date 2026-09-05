import Link from "next/link";
import { RingBadge } from "@/components/Logo";
import { Hero3D } from "@/components/Hero3D";
import { MarketTable } from "@/components/MarketTable";
import {
  Btn,
  Label,
  Panel,
  Pulse,
  ReadThis,
  SampleNote,
  SectionHead,
  Stat,
  Terms,
} from "@/components/ui";
import { KINDS, MARKETS, YIELD_SOURCE } from "@/data/markets";
import { factoryTotals, sortMarkets, tvl } from "@/lib/markets";
import { AWAITING, contractAddress, isLive } from "@/lib/contracts";
import { amount, bps, shortAddress } from "@/lib/format";
import { chain, explorerAddress, siteConfig, terms } from "@/lib/site-config";

const FLOW = [
  {
    head: "Name the carry",
    body: "A title, a ticker for the shares, and a plain sentence about where the return comes from. All three are written into the factory's storage, not into a database we run.",
  },
  {
    head: "Set the terms",
    body: "Wire it to a live source or name your own strategy address. Then the ceiling on how much capital may sit there, and the fee you take on carry.",
  },
  {
    head: "Open the vault",
    body: `One transaction to the ${siteConfig.name} factory deploys a vault of its own. Nothing is shared with any other market — no pooled balance, no shared accounting.`,
  },
  {
    head: "Capital arrives",
    body: "Anyone deposits the asset and receives shares. The market is open the second it exists; there is no listing to apply for and no queue to join.",
  },
  {
    head: "Carry lifts the share price",
    body: "Every token that arrives makes a share worth more. Depositors withdraw at that price whenever they like, against whatever the vault is holding idle.",
  },
];

const GUARANTEES = [
  {
    head: "TVL only moves when tokens move",
    body: "Capital at the strategy is counted from what actually left the vault. No function writes a larger number into it — a creator can mark a position down, and can never mark one up.",
  },
  {
    head: "The fee is charged on carry, never on principal",
    body: "Fee shares are minted only when the vault is worth more than the last time it looked, and they dilute holders by exactly the fee and by nothing else.",
  },
  {
    head: "Illiquidity is stated, not hidden",
    body: "A withdrawal larger than the idle balance reverts instead of queueing quietly. Every market prints how much of it is out at the strategy right now.",
  },
];

export default function Home() {
  const factory = contractAddress("factory");
  const totals = factoryTotals();
  const newest = sortMarkets(MARKETS, "newest").slice(0, 6);
  const deposited = MARKETS.filter((m) => m.asset === "USDG").reduce(
    (sum, m) => sum + tvl(m),
    0,
  );
  const carry = MARKETS.filter((m) => m.asset === "USDG").reduce(
    (sum, m) => sum + m.totalYield,
    0,
  );

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div className="grid-floor" />
        <div className="shell relative grid items-center gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <span className="chip cursor-default">
              <span className="pulse" /> Carry markets · {chain.name}
            </span>
            <h1 className="display mt-6 text-[clamp(40px,7.6vw,80px)]">
              Any <span className="glow">carry</span>, made into a market.
            </h1>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-mid">
              Someone knows where a return comes from. {siteConfig.name} turns
              that into a vault anyone can put money into — the same contract
              every time, with the terms written in at launch and no way to
              edit them afterwards.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Btn href="/launch">Open a market</Btn>
              <Btn href="/markets" variant="glass">
                Browse the registry
              </Btn>
            </div>
            <p className="num mt-7 text-[11.5px] tracking-[0.14em] text-low uppercase">
              Open a carry · Fund it · Earn from it
            </p>
          </div>

          {/* The ring of type turns behind the chrome; the object sits in it. */}
          <div className="relative mx-auto aspect-square w-full max-w-[420px] md:col-span-5">
            <RingBadge
              size={420}
              className="absolute inset-0 h-full w-full opacity-80"
            />
            <Hero3D className="absolute inset-[8%]" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- factory strip */}
      <section className="border-b border-[var(--line)] bg-surface">
        <div className="shell py-8">
          <div className="flex items-center justify-between gap-4 pb-4">
            <Label>The works</Label>
            <Pulse live={isLive} />
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
            <div className="bg-surface">
              <Stat label="Markets opened" value={totals.markets} />
            </div>
            <div className="bg-surface">
              <Stat
                label="Deposited (USDG books)"
                value={amount(deposited)}
                sub="USDG-denominated markets only"
              />
            </div>
            <div className="bg-surface">
              <Stat
                label="Carry recognised"
                value={amount(carry)}
                sub={`${totals.withCarry} of ${totals.markets} markets have paid`}
              />
            </div>
            <div className="bg-surface">
              <Stat label="Depositors" value={totals.depositors} />
            </div>
          </div>

          <div className="mt-6 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <Terms
                rows={[
                  [
                    "Factory",
                    factory ? (
                      <a
                        key="f"
                        href={explorerAddress(factory)}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-dotted underline-offset-4"
                      >
                        {shortAddress(factory)}
                      </a>
                    ) : (
                      AWAITING
                    ),
                  ],
                  ["Launch fee", `${terms.launchFee} ${terms.launchFeeSymbol}`],
                ]}
              />
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <Terms
                rows={[
                  ["Performance fee", `set by the creator, max ${bps(terms.maxPerformanceFeeBps)}`],
                  ["Charged on", "carry only"],
                  ["Vault owner", "nobody"],
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ registry */}
      <section className="shell py-20">
        <SectionHead
          id="markets"
          label="The registry"
          title="Every market the works has opened."
          lede="Everything the factory has ever deployed, in the order it was deployed. Nothing here is curated, ranked or endorsed — it is simply what exists."
          aside={
            <Link
              href="/markets"
              className="label transition-colors hover:text-hi"
            >
              All markets →
            </Link>
          }
        />
        <div className="mt-10">
          <SampleNote />
          <div className="mt-4">
            <MarketTable markets={newest} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- flow */}
      <section className="border-y border-[var(--line)] bg-surface">
        <div className="shell py-20">
          <SectionHead
            id="flow"
            label="The core flow"
            title="Five steps, and none of them ask us for permission."
            lede={`${siteConfig.name} is a works, not a yield aggregator. It does not pick strategies, rate them or curate a list. It casts the vault and gets out of the way.`}
          />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-5">
            {FLOW.map((s, i) => (
              <li key={s.head} className="bg-surface p-5">
                <div className="num text-[11px] tracking-[0.14em] text-warn">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-3 text-[14.5px] leading-snug font-medium">
                  {s.head}
                </h3>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-mid">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --------------------------------------------------------------- kinds */}
      <section className="shell py-20">
        <SectionHead
          id="kinds"
          label="What can be a carry"
          title="Any carry. One market."
          lede="The vault does not care where the return comes from — only that more of the asset comes back than went out. That covers most of what earns onchain."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {KINDS.map((k) => (
            <Link
              key={k.id}
              href={`/markets?kind=${k.id}`}
              className="group bg-transparent p-6 transition-colors hover:bg-surface"
            >
              <div className="flex items-baseline justify-between">
                <span className="label">{k.id}</span>
                <span className="num text-[11px] text-low transition-transform group-hover:translate-x-[2px]">
                  →
                </span>
              </div>
              <h3 className="display mt-4 text-[20px]">{k.label}</h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-mid">
                {k.blurb}
              </p>
              <p className="num mt-4 text-[11px] text-low">
                {MARKETS.filter((m) => m.kind === k.id).length} open
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- vault */}
      <section className="border-y border-[var(--line)] bg-surface">
        <div className="shell py-20">
          <SectionHead
            id="vault"
            label="What the factory casts"
            title="A vault that cannot lie about its own size."
            lede="Every market is the same contract with different constants. No owner, no pause switch, no upgrade path — the numbers on a market page are read straight out of it."
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Panel className="p-6">
                <Label>The contract</Label>
                <div className="mt-4">
                  <Terms
                    rows={[
                      ["Contract", "CarryVault"],
                      ["Shares", "ERC-20, priced in the asset"],
                      ["Owner", "none"],
                      ["Pause / upgrade", "none"],
                      ["Deposit", "open to anyone"],
                      ["Withdraw", "anytime, against idle capital"],
                      ["Creator can move capital", "only to the declared strategy"],
                      ["Deploy ceiling", "fixed at launch"],
                      ["Performance fee", `on carry only, max ${bps(terms.maxPerformanceFeeBps)}`],
                      ["Works' share of that fee", bps(terms.protocolCutBps)],
                      ["Dead shares seeded on first deposit", terms.seedShares.toLocaleString("en-US")],
                    ]}
                  />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <a href="/CarryWorks.sol.txt" className="btn btn-glass btn-sm">
                    Read the contract
                  </a>
                  <a
                    href={factory ? explorerAddress(factory) : chain.explorer}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-glass btn-sm"
                  >
                    Factory on the explorer
                  </a>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Label>Three things it guarantees</Label>
              <div className="mt-4 grid gap-px bg-[var(--line)]">
                {GUARANTEES.map((g, i) => (
                  <div key={g.head} className="bg-surface py-5">
                    <div className="flex gap-4">
                      <span className="num shrink-0 text-[11px] tracking-[0.14em] text-low">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="display text-[19px]">{g.head}</h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-mid">
                          {g.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- source */}
      <section className="shell py-20">
        <SectionHead
          label="Where a market can actually earn"
          title="Point it at something that already pays."
          lede={`A market can be wired to a live ERC-4626 vault on ${chain.name}. ${siteConfig.name} deploys a small adapter you own, the market supplies its capital into the source, and anyone can bring principal and carry back.`}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Panel className="p-6">
              <div className="flex items-center justify-between gap-4">
                <Label>Live on {chain.name}</Label>
                <Pulse live />
              </div>
              <h3 className="display mt-4 text-[26px]">{YIELD_SOURCE.name}</h3>
              <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-mid">
                {YIELD_SOURCE.blurb}
              </p>
              <div className="mt-6">
                <Terms
                  rows={[
                    ["Standard", YIELD_SOURCE.standard],
                    ["Held in the source", YIELD_SOURCE.held],
                    ["Share price", YIELD_SOURCE.sharePrice],
                    ["Adapter", "deployed by you, owned by you"],
                  ]}
                />
              </div>
              <a
                href={explorerAddress(YIELD_SOURCE.address)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-glass btn-sm mt-6"
              >
                On the explorer
              </a>
            </Panel>
          </div>

          <div className="lg:col-span-5">
            <ReadThis
              label="Before you point at anything"
              items={[
                "You are not limited to a wired source. Any address can be a strategy — a desk, a contract, a multisig — and a market that names one says so on its page.",
                `${siteConfig.name} has not reviewed that address, and neither has anyone else. An address you cannot identify is an address you should not fund.`,
                "Capital sent to a strategy is at that strategy's risk. It may come back smaller, or not at all.",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ the deal */}
      <section className="border-y border-[var(--line)] bg-surface">
        <div className="shell grid gap-px bg-[var(--line)] py-0 md:grid-cols-3">
          {[
            {
              who: "Creators bring the carry",
              body: "The person who knows where the return comes from does not have to build a protocol to sell it. They describe it, set the terms, and open the market.",
            },
            {
              who: `${siteConfig.name} casts the vault`,
              body: "The factory deploys the same contract every time: shares, accounting, custody ceiling, fee. Nothing bespoke, so there is nothing bespoke to review.",
            },
            {
              who: "Depositors bring the capital",
              body: "Put money into whichever market you believe, see exactly what it holds and what it has paid, and take your shares back at their price.",
            },
          ].map((p) => (
            <div key={p.who} className="bg-surface px-6 py-14">
              <h3 className="display text-[22px]">{p.who}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-mid">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------- cta */}
      <section className="shell py-24 text-center">
        <h2 className="display mx-auto max-w-3xl text-[clamp(30px,5.4vw,56px)]">
          Open a carry. Fund it. Earn from it.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-mid">
          One transaction, {terms.launchFee} {terms.launchFeeSymbol}, and the
          market exists — on the chain, not on a waitlist.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Btn href="/launch">Open a market</Btn>
          <Btn href="/markets" variant="glass">
            Browse the registry
          </Btn>
        </div>
      </section>
    </>
  );
}
