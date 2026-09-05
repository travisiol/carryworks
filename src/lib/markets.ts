import { MARKETS, type Market } from "@/data/markets";

/** A market younger than this gets no APY — the annualisation would be noise. */
export const MIN_AGE_FOR_APY_MINUTES = 360;

export function tvl(m: Market) {
  return m.idle + m.deployed;
}

/**
 * Annualised from the market's own price per share since launch, and from
 * nothing else. No external rate, no strategy's advertised number.
 */
export function apy(m: Market): number | null {
  if (m.ageMinutes < MIN_AGE_FOR_APY_MINUTES) return null;
  if (m.pricePerShare <= 1) return 0;
  const years = m.ageMinutes / (60 * 24 * 365);
  if (years <= 0) return null;
  return (Math.pow(m.pricePerShare, 1 / years) - 1) * 100;
}

/** What share of the vault is currently out at the strategy. */
export function custody(m: Market): { label: string; out: number } {
  const total = tvl(m);
  if (m.maxDeployBps === 0) return { label: "locked", out: 0 };
  if (total === 0) return { label: "none out", out: 0 };
  const out = m.deployed / total;
  if (out === 0) return { label: "none out", out: 0 };
  return { label: `${Math.round(out * 100)}% out`, out };
}

export function getMarket(vault: string): Market | undefined {
  return MARKETS.find((m) => m.vault.toLowerCase() === vault.toLowerCase());
}

export type SortKey = "newest" | "tvl" | "apy" | "yield" | "depositors";

export const SORTS: { id: SortKey; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "tvl", label: "Largest TVL" },
  { id: "apy", label: "Highest APY" },
  { id: "yield", label: "Most carry paid" },
  { id: "depositors", label: "Most depositors" },
];

export function sortMarkets(list: Market[], key: SortKey): Market[] {
  const copy = [...list];
  switch (key) {
    case "tvl":
      return copy.sort((a, b) => tvl(b) - tvl(a));
    case "apy":
      return copy.sort((a, b) => (apy(b) ?? -1) - (apy(a) ?? -1));
    case "yield":
      return copy.sort((a, b) => b.totalYield - a.totalYield);
    case "depositors":
      return copy.sort((a, b) => b.depositors - a.depositors);
    case "newest":
    default:
      return copy.sort((a, b) => a.ageMinutes - b.ageMinutes);
  }
}

/**
 * Factory-wide totals. TVL is not summed across assets — a USDG and an NVDA
 * market are not the same unit, and pretending otherwise would be the exact
 * kind of number this site refuses to print.
 */
export function factoryTotals() {
  const depositors = MARKETS.reduce((n, m) => n + m.depositors, 0);
  const assets = new Set(MARKETS.map((m) => m.asset));
  const withCarry = MARKETS.filter((m) => m.totalYield > 0).length;
  return {
    markets: MARKETS.length,
    depositors,
    assets: assets.size,
    withCarry,
  };
}
