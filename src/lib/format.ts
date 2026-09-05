export function shortAddress(address: string, lead = 6, tail = 4) {
  if (address.length <= lead + tail + 1) return address;
  return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export function amount(value: number, symbol?: string) {
  const body =
    value === 0
      ? "0"
      : value < 1
        ? value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")
        : value >= 1_000_000
          ? compact.format(value)
          : value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return symbol ? `${body} ${symbol}` : body;
}

export function price(value: number) {
  return value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

export function percent(value: number, digits = 2) {
  return `${value.toFixed(digits)}%`;
}

export function bps(value: number) {
  return `${value / 100}%`;
}

/** Ages are rendered from a fixed reference so prerendered HTML stays stable. */
export function age(minutes: number) {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / (60 * 24))}d`;
}

export function launchedOn(minutesAgo: number, now = Date.UTC(2026, 8, 5)) {
  const d = new Date(now - minutesAgo * 60_000);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
