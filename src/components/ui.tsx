import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

export function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("label", className)}>{children}</div>;
}

/**
 * A section opens the way a prospectus section opens: a small mono label, a
 * rule that runs the whole width, then the heading under it.
 */
export function SectionHead({
  label,
  title,
  lede,
  aside,
  id,
}: {
  label: string;
  title: string;
  lede?: ReactNode;
  aside?: ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex items-end justify-between gap-6 pb-2">
        <Label>{label}</Label>
        {aside}
      </div>
      <hr className="rule-x" />
      <div className="grid gap-5 pt-6 md:grid-cols-12">
        <h2 className="display col-span-12 text-[clamp(28px,4vw,44px)] md:col-span-6">
          {title}
        </h2>
        {lede ? (
          <p className="col-span-12 self-end text-[15px] leading-relaxed text-mid md:col-span-5 md:col-start-8">
            {lede}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function Panel({
  children,
  className,
  tint,
}: {
  children: ReactNode;
  className?: string;
  tint?: boolean;
}) {
  return (
    <div className={clsx(tint ? "panel-tint" : "panel", className)}>
      {children}
    </div>
  );
}

/** A figure with its caption above it, as on a factsheet's summary strip. */
export function Stat({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("px-4 py-4", className)}>
      <Label>{label}</Label>
      <div className="num mt-2 text-[22px] leading-none tracking-tight">
        {value}
      </div>
      {sub ? <div className="mt-1.5 text-[12px] text-low">{sub}</div> : null}
    </div>
  );
}

export function Terms({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <dl className="terms">
      {rows.map((row, i) => (
        <div key={i}>
          <dt>{row[0]}</dt>
          <dd>{row[1]}</dd>
        </div>
      ))}
    </dl>
  );
}

type BtnProps = {
  children: ReactNode;
  href?: string;
  variant?: "brand" | "glass";
  size?: "md" | "sm";
  className?: string;
  external?: boolean;
};

export function Btn({
  children,
  href,
  variant = "brand",
  size = "md",
  className,
  external,
}: BtnProps) {
  const cls = clsx(
    "btn",
    variant === "brand" ? "btn-brand" : "btn-glass",
    size === "sm" && "btn-sm",
    className,
  );
  if (!href) return <span className={cls}>{children}</span>;
  if (external)
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/**
 * Said above every table of sample figures. The site is not deployed; this is
 * the line that keeps a demo from reading as a chain query.
 */
export function SampleNote({ children }: { children?: ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-[12px] leading-relaxed text-warn">
      <span
        aria-hidden
        className="mt-[6px] inline-block h-[5px] w-[5px] shrink-0 bg-warn"
      />
      <span>
        {children ??
          "Sample markets. The factory is not deployed, so none of these figures were read from a chain."}
      </span>
    </p>
  );
}

/** The one place an accent-coloured block of prose is allowed. */
export function ReadThis({
  label = "Read this",
  items,
}: {
  label?: string;
  items: ReactNode[];
}) {
  return (
    <div className="wash rounded-2xl border border-warn/30 p-5">
      <Label className="text-warn">{label}</Label>
      <ul className="mt-3 grid gap-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-[13px] leading-relaxed">
            <span className="num shrink-0 text-[11px] text-warn">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-mid">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Pulse({ live }: { live?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={clsx(
          "inline-block h-[6px] w-[6px] rounded-full",
          live ? "pulse" : "bg-low",
        )}
      />
      <span className="label">{live ? "live" : "awaiting launch"}</span>
    </span>
  );
}
