/**
 * Sample markets.
 *
 * Nothing here has been read off a chain — the factory is not deployed. This
 * file exists so the tables, the sorting and a market page have something
 * truthful to render, and every page that shows it says so above the numbers
 * (see `SampleNote`). Ages are minutes-before-a-fixed-reference so prerendered
 * HTML does not drift.
 */

export type Kind =
  | "lending"
  | "assets"
  | "lp-fees"
  | "liquidations"
  | "rwa"
  | "custom";

export const KINDS: { id: Kind; label: string; blurb: string }[] = [
  {
    id: "lending",
    label: "Stablecoin lending",
    blurb:
      "Supply a stable asset to a lending venue and hand the borrow rate through to depositors.",
  },
  {
    id: "assets",
    label: "Tokenized assets",
    blurb:
      "Return earned on tokenized equities, ETFs and other onchain asset exposure.",
  },
  {
    id: "lp-fees",
    label: "LP fees",
    blurb:
      "Post liquidity somewhere it gets traded against and route the fees back into the vault.",
  },
  {
    id: "liquidations",
    label: "Liquidations",
    blurb:
      "Capital held ready to absorb liquidations and keep the discount it buys them at.",
  },
  {
    id: "rwa",
    label: "RWA carry",
    blurb:
      "Offchain cashflow — treasuries, private credit, receivables — settled back onchain.",
  },
  {
    id: "custom",
    label: "Custom strategy",
    blurb:
      "Anything else that gives back more of the asset than it was handed.",
  },
];

export const kindLabel = (id: Kind) =>
  KINDS.find((k) => k.id === id)?.label ?? id;

export type ActivityEvent = {
  event: "Deposit" | "Withdraw" | "Report" | "Deployed" | "Collected" | "Launch";
  detail: string;
  amount: string;
  minutesAgo: number;
};

export type Market = {
  vault: string;
  name: string;
  /** Share ticker, minted by the factory with the `cw` prefix. */
  ticker: string;
  asset: string;
  kind: Kind;
  mark: string;
  description: string | null;
  creator: string;
  strategy: string | null;
  strategyLabel: string | null;
  /** Ceiling on capital allowed to sit at the strategy. 0 = it never leaves. */
  maxDeployBps: number;
  performanceFeeBps: number;
  /** 0 = uncapped. */
  depositCap: number;
  ageMinutes: number;

  idle: number;
  deployed: number;
  pricePerShare: number;
  totalYield: number;
  totalDeposited: number;
  totalWithdrawn: number;
  depositors: number;
  sharesOutstanding: number;

  /** Price per share over the market's life, oldest first. */
  history: number[];
  activity: ActivityEvent[];
};

export const MARKETS: Market[] = [
  {
    vault: "0x7A31c4E0b8f2A9d5C61e0Fb47a2c9D3e5B180aC4",
    name: "Steakhouse USDG passthrough",
    ticker: "cwUSDG",
    asset: "USDG",
    kind: "lending",
    mark: "SH",
    description:
      "Supplies into the Steakhouse USDG vault and holds nothing back. Whatever that vault accrues comes home when anyone calls collect — I do not touch the rate and I cannot.",
    creator: "0x9bCe4f27A1d8E5630c7B24aF95Dd0e13F86ab5A4",
    strategy: "0xBeEff033F34C046626B8D0A041844C5d1A5409dd",
    strategyLabel: "Steakhouse USDG adapter",
    maxDeployBps: 9000,
    performanceFeeBps: 1000,
    depositCap: 0,
    ageMinutes: 59_040,
    idle: 164_300,
    deployed: 1_120_000,
    pricePerShare: 1.0412,
    totalYield: 51_240,
    totalDeposited: 1_402_900,
    totalWithdrawn: 189_460,
    depositors: 318,
    sharesOutstanding: 1_233_939,
    history: [
      1, 1.0021, 1.0048, 1.0072, 1.0104, 1.0129, 1.0156, 1.0188, 1.0211,
      1.0238, 1.0264, 1.0291, 1.0318, 1.0344, 1.0369, 1.0391, 1.0412,
    ],
    activity: [
      { event: "Deposit", detail: "0x41c9…8Ee2", amount: "12,000 USDG", minutesAgo: 34 },
      { event: "Report", detail: "gain recognised", amount: "1,284 USDG", minutesAgo: 190 },
      { event: "Collected", detail: "principal + carry from adapter", amount: "84,000 USDG", minutesAgo: 191 },
      { event: "Withdraw", detail: "0xC0aB…41d7", amount: "5,400 USDG", minutesAgo: 622 },
      { event: "Deployed", detail: "to Steakhouse USDG adapter", amount: "150,000 USDG", minutesAgo: 1_460 },
      { event: "Deposit", detail: "0x18Fa…9b03", amount: "150,000 USDG", minutesAgo: 1_478 },
    ],
  },
  {
    vault: "0x2C90aB4e17F5d0836B1c9E24aD73f6C085e1B902",
    name: "NVDA lending carry",
    ticker: "cwNVDA",
    asset: "NVDA",
    kind: "assets",
    mark: "NV",
    description:
      "Tokenized NVDA lent to desks that want the borrow. Denominated in NVDA, so a depositor keeps the equity exposure and earns shares on top of it.",
    creator: "0x3fD1a92cB4e7508D6a2F1c93eB05D74a8C6b21fE",
    strategy: "0x51aC7d2E9b03F846c1D5A94e2708bB63fD1c40A7",
    strategyLabel: "Desk borrow book",
    maxDeployBps: 7500,
    performanceFeeBps: 1500,
    depositCap: 0,
    ageMinutes: 37_440,
    idle: 2_140,
    deployed: 5_980,
    pricePerShare: 1.0181,
    totalYield: 144,
    totalDeposited: 8_260,
    totalWithdrawn: 210,
    depositors: 96,
    sharesOutstanding: 7_975,
    history: [1, 1.0018, 1.0041, 1.0063, 1.0088, 1.0112, 1.0139, 1.0161, 1.0181],
    activity: [
      { event: "Report", detail: "gain recognised", amount: "18 NVDA", minutesAgo: 260 },
      { event: "Deposit", detail: "0x7b21…C4a9", amount: "310 NVDA", minutesAgo: 900 },
      { event: "Deployed", detail: "to desk borrow book", amount: "1,400 NVDA", minutesAgo: 2_880 },
    ],
  },
  {
    vault: "0xE41b09Cd7f83A2e650B1c4D9a8F27356eB0c9D18",
    name: "USDG/ETH fee router",
    ticker: "cwUSDG",
    asset: "USDG",
    kind: "lp-fees",
    mark: "LP",
    description:
      "Liquidity on the deepest USDG/ETH pool on this chain. Trading fees are swept back into the vault on a schedule; impermanent loss lands on depositors, not on me.",
    creator: "0x6Ac41E9b8D0725f3C1a94Be607dF25a8b3C10e46",
    strategy: "0xAd90F2e14C3b8756Da01e9B4c73F206a5E8b91dC",
    strategyLabel: "Concentrated LP position",
    maxDeployBps: 9500,
    performanceFeeBps: 2000,
    depositCap: 0,
    ageMinutes: 21_600,
    idle: 38_900,
    deployed: 402_600,
    pricePerShare: 1.0233,
    totalYield: 10_670,
    totalDeposited: 461_000,
    totalWithdrawn: 29_400,
    depositors: 141,
    sharesOutstanding: 431_649,
    history: [1, 1.0034, 1.0061, 1.0079, 1.0072, 1.0108, 1.0147, 1.0189, 1.0233],
    activity: [
      { event: "Collected", detail: "fees swept from pool", amount: "2,140 USDG", minutesAgo: 420 },
      { event: "Report", detail: "gain recognised", amount: "2,140 USDG", minutesAgo: 420 },
      { event: "Deposit", detail: "0x9E04…77Fb", amount: "40,000 USDG", minutesAgo: 1_310 },
    ],
  },
  {
    vault: "0x58Fa3c9E21b7D064a8C15e903F27bD64a0e13C7B",
    name: "Liquidation backstop",
    ticker: "cwUSDG",
    asset: "USDG",
    kind: "liquidations",
    mark: "LQ",
    description:
      "Capital that sits with a liquidator and buys collateral at the protocol discount when a position goes underwater. It earns nothing on a quiet week. That is the trade.",
    creator: "0xB721e0C94a3F58d16E20b7cA9354fD07a1e8630B",
    strategy: "0x0d47Ba9E31c5F802a6D19eC84b7350fA26c1D9E5",
    strategyLabel: "Liquidator hot wallet",
    maxDeployBps: 10_000,
    performanceFeeBps: 1500,
    depositCap: 0,
    ageMinutes: 14_400,
    idle: 0,
    deployed: 210_000,
    pricePerShare: 1.0094,
    totalYield: 1_960,
    totalDeposited: 208_100,
    totalWithdrawn: 0,
    depositors: 27,
    sharesOutstanding: 208_045,
    history: [1, 1, 1.0031, 1.0031, 1.0031, 1.0068, 1.0094],
    activity: [
      { event: "Report", detail: "gain recognised", amount: "770 USDG", minutesAgo: 1_100 },
      { event: "Collected", detail: "discount returned from liquidator", amount: "20,770 USDG", minutesAgo: 1_101 },
      { event: "Deployed", detail: "to liquidator hot wallet", amount: "210,000 USDG", minutesAgo: 4_200 },
    ],
  },
  {
    vault: "0x9d02E7a4Cb16F385e094D2c7Ba58f130a6C4e81F",
    name: "90-day receivables",
    ticker: "cwUSDG",
    asset: "USDG",
    kind: "rwa",
    mark: "RW",
    description:
      "Invoices from three logistics counterparties, bought at a discount and settled back onchain when they pay. If a counterparty does not pay, the vault gets marked down and you will see it here.",
    creator: "0x4E19cB0f7a2D6538b91C40eA7d635f28C0a17b93",
    strategy: "0xF106bE83d24A9c750B1e63aF95D0728c4a1B60E9",
    strategyLabel: "Settlement multisig (3/5)",
    maxDeployBps: 8000,
    performanceFeeBps: 1200,
    depositCap: 750_000,
    ageMinutes: 8_640,
    idle: 91_500,
    deployed: 305_000,
    pricePerShare: 1.0057,
    totalYield: 2_240,
    totalDeposited: 394_260,
    totalWithdrawn: 0,
    depositors: 62,
    sharesOutstanding: 394_255,
    history: [1, 1, 1.0019, 1.0019, 1.0038, 1.0057],
    activity: [
      { event: "Report", detail: "gain recognised", amount: "760 USDG", minutesAgo: 2_100 },
      { event: "Deposit", detail: "0x2a55…E109", amount: "75,000 USDG", minutesAgo: 3_400 },
      { event: "Deployed", detail: "to settlement multisig", amount: "305,000 USDG", minutesAgo: 6_100 },
    ],
  },
  {
    vault: "0x1B47ea90C3f5D826a70b1E94cF3d5027bA6e8140",
    name: "Basis desk, quarterly",
    ticker: "cwUSDG",
    asset: "USDG",
    kind: "custom",
    mark: "BD",
    description:
      "Cash-and-carry on the quarterly. Long spot, short the future, hold to expiry. Nothing exotic and nothing levered — the fee only pays if the basis was there.",
    creator: "0x8C05fA31b7e264D09a1E5cB730f4a26D81b09e5C",
    strategy: "0x62Ee1c04Bd9A7f38501eC7b24aF06D93e5107aB8",
    strategyLabel: "Desk address (named, not audited)",
    maxDeployBps: 6000,
    performanceFeeBps: 2000,
    depositCap: 0,
    ageMinutes: 5_760,
    idle: 74_200,
    deployed: 96_000,
    pricePerShare: 1.0029,
    totalYield: 495,
    totalDeposited: 169_800,
    totalWithdrawn: 0,
    depositors: 44,
    sharesOutstanding: 169_708,
    history: [1, 1.0008, 1.0016, 1.0029],
    activity: [
      { event: "Report", detail: "gain recognised", amount: "180 USDG", minutesAgo: 1_500 },
      { event: "Deployed", detail: "to desk address", amount: "96,000 USDG", minutesAgo: 4_000 },
    ],
  },
  {
    vault: "0xC3e80B14aF7d295c60E1a94bD3f0568a2Ce17b40",
    name: "Idle USDG, locked",
    ticker: "cwUSDG",
    asset: "USDG",
    kind: "lending",
    mark: "ID",
    description:
      "Deploy ceiling of zero. Capital cannot leave this vault by any address, mine included. Carry has to be paid in from outside, which is the whole point of it.",
    creator: "0x2740aB19cE83f5D064a1b90eC7f3528Da6e04B71",
    strategy: null,
    strategyLabel: null,
    maxDeployBps: 0,
    performanceFeeBps: 500,
    depositCap: 250_000,
    ageMinutes: 2_880,
    idle: 61_400,
    deployed: 0,
    pricePerShare: 1.0011,
    totalYield: 67,
    totalDeposited: 61_340,
    totalWithdrawn: 0,
    depositors: 19,
    sharesOutstanding: 61_332,
    history: [1, 1.0004, 1.0011],
    activity: [
      { event: "Report", detail: "carry funded in", amount: "67 USDG", minutesAgo: 700 },
      { event: "Deposit", detail: "0x5D31…Ba82", amount: "20,000 USDG", minutesAgo: 1_900 },
    ],
  },
  {
    vault: "0x74B0d1E93c5aF286017b4Ec9D035a86fB2e14C0D",
    name: "SPY dividend passthrough",
    ticker: "cwSPY",
    asset: "SPY",
    kind: "assets",
    mark: "SP",
    description:
      "Tokenized SPY held for the quarterly distribution. The distribution arrives as more SPY and lifts the share price; nothing is sold.",
    creator: "0xaB93017Ec54D2f861b0A9e73cD452806fE1b93A7",
    strategy: null,
    strategyLabel: null,
    maxDeployBps: 0,
    performanceFeeBps: 800,
    depositCap: 0,
    ageMinutes: 660,
    idle: 1_180,
    deployed: 0,
    pricePerShare: 1,
    totalYield: 0,
    totalDeposited: 1_180,
    totalWithdrawn: 0,
    depositors: 11,
    sharesOutstanding: 1_179,
    history: [1, 1],
    activity: [
      { event: "Deposit", detail: "0xEe10…3C77", amount: "400 SPY", minutesAgo: 120 },
      { event: "Launch", detail: "deployed by creator", amount: "—", minutesAgo: 660 },
    ],
  },
  {
    vault: "0x0F62aC85e3B19d740a2c6E84fB3705dA91c6e2B3",
    name: "Overnight repo, onchain",
    ticker: "cwUSDG",
    asset: "USDG",
    kind: "rwa",
    mark: "OR",
    description: null,
    creator: "0x51e0Ba49c7D31f8620aE94b0C7d3f581a26e04B9",
    strategy: "0xD8a71c02E9b45F361a0Cd7e83B25f094a6E1c730",
    strategyLabel: "Custodian address",
    maxDeployBps: 5000,
    performanceFeeBps: 1000,
    depositCap: 0,
    ageMinutes: 240,
    idle: 8_000,
    deployed: 0,
    pricePerShare: 1,
    totalYield: 0,
    totalDeposited: 8_000,
    totalWithdrawn: 0,
    depositors: 4,
    sharesOutstanding: 7_999,
    history: [1, 1],
    activity: [
      { event: "Deposit", detail: "0x77Ea…19bC", amount: "8,000 USDG", minutesAgo: 190 },
      { event: "Launch", detail: "deployed by creator", amount: "—", minutesAgo: 240 },
    ],
  },
  {
    vault: "0xA95d0c73E128bF460a1e7C94d3F05286bE1c740a",
    name: "test market, ignore",
    ticker: "cwUSDG",
    asset: "USDG",
    kind: "custom",
    mark: "TM",
    description: null,
    creator: "0x9bCe4f27A1d8E5630c7B24aF95Dd0e13F86ab5A4",
    strategy: null,
    strategyLabel: null,
    maxDeployBps: 0,
    performanceFeeBps: 2000,
    depositCap: 100,
    ageMinutes: 55,
    idle: 0,
    deployed: 0,
    pricePerShare: 1,
    totalYield: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    depositors: 0,
    sharesOutstanding: 0,
    history: [1],
    activity: [{ event: "Launch", detail: "deployed by creator", amount: "—", minutesAgo: 55 }],
  },
  {
    vault: "0x36c1B84a0dE9725f13A0c6eB47D5028fA1e0b9C4",
    name: "Gold carry",
    ticker: "cwXAUT",
    asset: "XAUT",
    kind: "assets",
    mark: "AU",
    description:
      "Tokenized gold lent against overcollateralised stables. Small book, slow rate, no leverage anywhere in it.",
    creator: "0x1Ac9e08B34D75f26a01Cb9e740D358fa2E6b0491",
    strategy: "0x7E3a19cB05D482f760aE1c94bD35f082a6C1e043",
    strategyLabel: "Lending venue adapter",
    maxDeployBps: 8500,
    performanceFeeBps: 1000,
    depositCap: 0,
    ageMinutes: 15,
    idle: 0,
    deployed: 0,
    pricePerShare: 1,
    totalYield: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    depositors: 0,
    sharesOutstanding: 0,
    history: [1],
    activity: [{ event: "Launch", detail: "deployed by creator", amount: "—", minutesAgo: 15 }],
  },
];

/** The one live source a market can be wired to without naming its own address. */
export const YIELD_SOURCE = {
  name: "Steakhouse USDG",
  standard: "ERC-4626, USDG denominated",
  address: "0xBeEff033F34C046626B8D0A041844C5d1A5409dd",
  held: "448.68M USDG",
  sharePrice: "1.005985 USDG",
  blurb:
    "An ERC-4626 vault holding roughly 450M USDG. Its share price sits above one and climbs as it accrues. The works deploys a thin adapter that you own; your market supplies into the source through it and redeems on demand.",
} as const;
