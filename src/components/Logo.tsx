import clsx from "clsx";
import { siteConfig } from "@/lib/site-config";

/**
 * CARRY set solid, WORKS held inside a glass pill — the works is the container
 * the carry gets put into, which is the whole product in two words.
 */
export function Wordmark({ className }: { className?: string }) {
  const { head, tail } = siteConfig.wordmark;
  return (
    <span
      className={clsx(
        "font-display inline-flex items-center gap-1.5 text-[16px] leading-none font-semibold tracking-[-0.03em]",
        className,
      )}
    >
      <span>{head}</span>
      <span className="rounded-full border border-[var(--rim)] bg-[var(--glass)] px-2 py-[3px] text-[12.5px] tracking-[0.02em] text-cyan">
        {tail}
      </span>
    </span>
  );
}

/**
 * The disclosure, made into an object: a ring of type that turns slowly around
 * the hero. A round seal is what a document gets when someone has checked it —
 * this one says the opposite, in the site's warning ink.
 */
export function RingBadge({
  size = 420,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className={clsx("pointer-events-none select-none", className)}
      role="img"
      aria-label="Not reviewed, not endorsed, not curated"
    >
      <defs>
        <path
          id="ring-arc"
          d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0"
          fill="none"
        />
        <linearGradient id="ring-stroke" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7c5cff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#34e6ff" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <circle
        cx="200"
        cy="200"
        r="192"
        fill="none"
        stroke="url(#ring-stroke)"
        strokeWidth="1"
      />
      <circle
        cx="200"
        cy="200"
        r="163"
        fill="none"
        stroke="url(#ring-stroke)"
        strokeWidth="1"
        strokeDasharray="1 7"
      />

      <g className="spin">
        <text
          className="font-mono"
          fontSize="11"
          letterSpacing="6.4"
          fill="#ff5c7a"
          opacity="0.72"
        >
          <textPath href="#ring-arc" startOffset="0">
            NOT REVIEWED · NOT ENDORSED · NOT CURATED · NOT REVIEWED · NOT
            ENDORSED · NOT CURATED ·
          </textPath>
        </text>
      </g>
    </svg>
  );
}
