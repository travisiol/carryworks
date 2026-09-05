# CarryWorks

**Any carry, made into a market.**

A permissionless works for carry markets. A creator names a return, points it
at a strategy, and the factory casts a standard vault anyone can deposit into.
Shares are priced in the asset and only move when tokens actually arrive; the
creator's fee is charged on carry and never on principal; there is no owner, no
pause switch and no upgrade path.

Next 16 (App Router) + Tailwind v4 + three.js for the hero object. No wallet
library — every figure on the site comes from `src/data/`.

## Routes

| Route              | What it is                                                       |
| ------------------ | ---------------------------------------------------------------- |
| `/`                | The argument: the flow, what can be a carry, what gets cast      |
| `/markets`         | The registry — filter by kind (`?kind=lending`), five orderings  |
| `/market/[vault]`  | One market: chart, custody, terms, activity, order ticket        |
| `/launch`          | Three-step wizard with a live listing preview and the interlocks |
| `/CarryWorks.sol.txt` | `CarryVault` + `CarryWorks` source, served as plain text       |

## The name

Lives in exactly three strings in `src/lib/site-config.ts` — `name`,
`wordmark` and `ticker`. A rename is those three, plus the
`NEXT_PUBLIC_CARRYWORKS_*` env prefix, `public/CarryWorks.sol.txt`,
`package.json`, `.claude/launch.json` and this file.

## The design rule, do not break it

The violet→cyan gradient marks **what you can act on**: a primary button, an
active filter, a live figure. `--color-warn` (`#ff5c7a`) is the only other
chromatic ink on the site and means exactly one thing: **nobody has vetted
this**. It marks the unreviewed warnings, the open interlocks, and the lines a
depositor is meant to read before parting with money. It never marks a loss and
never decorates.

Everything else is glass in front of a nebula. Only `--color-void` is opaque;
every "surface" above it is a wash of white the background shows through, so a
band frosts the scene rather than covering it. Panels get a top rim light and a
sheen that dies at 40% so they read as objects with thickness; controls lift a
pixel on hover and settle back on `:active`.

Two CSS notes that are easy to undo by accident:

- Element resets live in `@layer base`. An unlayered `a { color: inherit }`
  outranks every layered rule — including Tailwind's own utilities — and
  silently defeats any `text-*` written on a link.
- Write `backdrop-filter` **only** unprefixed. Declaring the `-webkit-` alias
  beside it makes the minifier collapse the pair and keep the prefixed one
  alone, and the glass blur then applies nowhere.

## The hero

`src/components/Hero3D.tsx` is a real three.js scene — a chrome ring (the
works) with a bead of glass suspended in it (the carry) — imported dynamically
inside the effect so the page stays server rendered. It ships **no assets**:
the environment map is painted into a `<canvas>` at runtime and mounted as an
equirectangular reflection, so the chrome is reflecting something real.

## Asset logos

`src/components/AssetLogo.tsx` renders the real mark of the asset a market is
denominated in, falling back to a two-letter monogram for an asset with none on
file. The files are checked into `public/assets/` rather than hotlinked, so a
row never depends on someone else’s CDN:

| Asset  | File        | Source                              |
| ------ | ----------- | ----------------------------------- |
| `USDG` | `usdg.png`  | CoinGecko (Global Dollar)           |
| `XAUT` | `xaut.png`  | CoinGecko (Tether Gold) — 250×203, so it is contained, not cropped |
| `SPY`  | `spy.svg`   | Parqet symbol logos (SPDR S&P 500)  |
| `NVDA` | `nvda.svg`  | Parqet symbol logos (NVIDIA)        |

They are third-party trademarks used to identify the asset, the same way any
DeFi front end labels a vault. Adding an asset means adding one row to the
`ASSETS` map and one file.

## What is placeholder

Three things, deliberately:

1. **Every contract address.** They come from the environment
   (`.env.example`), and an unset address renders as `Awaiting launch` rather
   than as a plausible-looking hex string. `isLive` is false until the factory
   address is set.
2. **Every market in `src/data/markets.ts`.** They are samples so the tables,
   the sorting and a market page have something to render. Each page that shows
   them says so above the numbers (`SampleNote`).
3. **`carryworks.xyz` and `@carryworks`** in `site-config.ts`.

`public/CarryWorks.sol.txt` is written but has never been compiled or deployed.

## Running it

```bash
npm install
npm run dev
```

Build and lint:

```bash
npm run build && npx eslint .
```

`next lint` was removed in Next 16 — it reads `lint` as a directory name.
