import clsx from "clsx";

/**
 * The real mark of the asset a market is denominated in.
 *
 * Files live in `public/assets/` rather than being hotlinked, so a market row
 * never depends on someone else's CDN staying up — and so the icons render at
 * all on a page that has no network.
 *
 * `fit` matters: the two token PNGs are circular artwork on transparency and
 * fill the tile, while the Tether Gold mark is 250×203 and has to be contained
 * or it stretches.
 */
const ASSETS: Record<
  string,
  { src: string; name: string; fit: "cover" | "contain" }
> = {
  USDG: { src: "/assets/usdg.png", name: "Global Dollar", fit: "cover" },
  XAUT: { src: "/assets/xaut.png", name: "Tether Gold", fit: "contain" },
  SPY: { src: "/assets/spy.svg", name: "SPDR S&P 500 ETF", fit: "cover" },
  NVDA: { src: "/assets/nvda.svg", name: "NVIDIA", fit: "cover" },
};

export function AssetLogo({
  asset,
  fallback,
  size = 36,
  className,
}: {
  asset: string;
  /** Two-letter monogram, used for an asset with no mark on file. */
  fallback?: string;
  size?: number;
  className?: string;
}) {
  const entry = ASSETS[asset.toUpperCase()];

  const tile = clsx(
    "grid shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--rim)] bg-[var(--glass)]",
    className,
  );

  if (!entry) {
    return (
      <span
        className={clsx(tile, "num text-[11px] tracking-tight text-mid")}
        style={{ width: size, height: size }}
        aria-hidden
      >
        {(fallback ?? asset.slice(0, 2)).toUpperCase()}
      </span>
    );
  }

  return (
    <span className={tile} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 36px
          static icon gains nothing from the image optimizer, and routing an
          SVG through it needs dangerouslyAllowSVG. */}
      <img
        src={entry.src}
        alt={`${entry.name} (${asset})`}
        width={size}
        height={size}
        className={clsx(
          "h-full w-full",
          entry.fit === "cover" ? "object-cover" : "object-contain p-[3px]",
        )}
        /* Eager on purpose: a 36px icon costs nothing to fetch, and lazy
           loading leaves rows blank until the viewport reaches them. */
        decoding="async"
      />
    </span>
  );
}
