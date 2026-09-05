import { price } from "@/lib/format";

/**
 * Price per share since launch, drawn as a plotted line on graph paper.
 *
 * Deliberately flat ink: no gradient fill, no glow. The baseline at 1.0 is the
 * only reference that matters — everything above it is carry that actually
 * arrived, and a market sitting on the line is saying so honestly.
 */
export function PriceChart({
  history,
  asset,
  height = 200,
}: {
  history: number[];
  asset: string;
  height?: number;
}) {
  const W = 720;
  const H = height;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 22;

  const flat = history.length < 2 || Math.max(...history) <= 1;
  const max = Math.max(...history, 1.0001);
  const min = 1;
  const span = Math.max(max - min, 0.0004);

  const x = (i: number) =>
    padL + (i / Math.max(history.length - 1, 1)) * (W - padL - padR);
  const y = (v: number) =>
    padT + (1 - (v - min) / span) * (H - padT - padB);

  const d = history.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  /* The area under the line, closed along the baseline. */
  const area = `${d} L${x(history.length - 1).toFixed(1)},${(H - padB).toFixed(1)} L${x(0).toFixed(1)},${(H - padB).toFixed(1)} Z`;
  const last = history[history.length - 1];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`Price per share since launch, currently ${price(last)} ${asset}`}
      >
        {/* userSpaceOnUse, not the default objectBoundingBox: a flat line has a
            zero-height bounding box and a gradient defined against it does not
            render at all. */}
        <defs>
          <linearGradient
            id="line-grad"
            x1={padL}
            y1="0"
            x2={W - padR}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#7c5cff" />
            <stop offset="1" stopColor="#34e6ff" />
          </linearGradient>
          <linearGradient
            id="area-grad"
            x1="0"
            y1={padT}
            x2="0"
            y2={H - padB}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#34e6ff" stopOpacity="0.24" />
            <stop offset="1" stopColor="#34e6ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Graph-paper ground: four horizontal rules, drawn under the line. */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padL}
            x2={W - padR}
            y1={padT + t * (H - padT - padB)}
            y2={padT + t * (H - padT - padB)}
            stroke="var(--line-soft)"
            strokeWidth="1"
          />
        ))}

        {/* The 1.0 baseline: dotted, because it is a reference, not data. */}
        <line
          x1={padL}
          x2={W - padR}
          y1={y(1)}
          y2={y(1)}
          stroke="var(--line-strong)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />

        {!flat ? (
          <>
            <path d={area} fill="url(#area-grad)" stroke="none" />
            <path
              d={d}
              fill="none"
              stroke="url(#line-grad)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle
              cx={x(history.length - 1)}
              cy={y(last)}
              r="4"
              fill="#34e6ff"
            />
            <circle
              cx={x(history.length - 1)}
              cy={y(last)}
              r="9"
              fill="#34e6ff"
              opacity="0.18"
            />
          </>
        ) : (
          <line
            x1={padL}
            x2={W - padR}
            y1={y(1)}
            y2={y(1)}
            stroke="var(--color-cyan)"
            strokeWidth="1.75"
          />
        )}

        <text
          className="font-mono"
          x={padL}
          y={H - 6}
          fontSize="10"
          letterSpacing="1.4"
          fill="var(--color-low)"
        >
          LAUNCH
        </text>
        <text
          className="font-mono"
          x={W - padR}
          y={H - 6}
          fontSize="10"
          letterSpacing="1.4"
          textAnchor="end"
          fill="var(--color-low)"
        >
          NOW
        </text>
        <text
          className="font-mono"
          x={W - padR}
          y={y(1) - 6}
          fontSize="10"
          letterSpacing="1.4"
          textAnchor="end"
          fill="var(--color-low)"
        >
          1.0 {asset}
        </text>
      </svg>
      <figcaption className="mt-2 text-[12px] text-low">
        {flat
          ? "No carry recognised yet. The line lifts the first time this vault is worth more than it was."
          : `Price per share since launch, ${price(last)} ${asset} now.`}
      </figcaption>
    </figure>
  );
}
