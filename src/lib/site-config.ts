/**
 * The brand lives in exactly three strings — `name`, `wordmark` and `ticker`.
 * Everything else in the app reads from here, so a rename is those three plus
 * the `NEXT_PUBLIC_CARRYWORKS_*` env prefix, `public/CarryWorks.sol.txt`,
 * `package.json` and this file's own README entry.
 */
export const siteConfig = {
  name: "CarryWorks",
  wordmark: { head: "CARRY", tail: "WORKS" },
  ticker: "CARRY",
  /** Prefix the factory puts in front of every share ticker it mints. */
  sharePrefix: "cw",

  tagline: "Any carry, made into a market",
  seoDescription:
    "A permissionless works for carry markets. Name a return, point it at a strategy, and the factory deploys a standard vault anyone can deposit into. No review, no list, no owner.",

  url: "https://carryworks.xyz",
  x: "carryworks",
} as const;

export const chain = {
  name: "Robinhood Chain",
  explorer: "https://robinhoodchain.blockscout.com",
  gasSymbol: "ETH",
} as const;

/**
 * The terms the factory hard-codes. These are the numbers a depositor is
 * trusting, so they are stated once and read everywhere — never retyped
 * into copy.
 */
export const terms = {
  launchFee: "0.001",
  launchFeeSymbol: "ETH",
  /** Ceiling a creator may set on their own performance fee. */
  maxPerformanceFeeBps: 2000,
  /** The works' cut of whatever performance fee a creator charges. */
  protocolCutBps: 2000,
  /** Dead shares burned on the first deposit so the price cannot be walked up. */
  seedShares: 1000,
} as const;

export function explorerAddress(address: string) {
  return `${chain.explorer}/address/${address}`;
}
