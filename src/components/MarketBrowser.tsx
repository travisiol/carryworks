"use client";

import { useMemo, useState } from "react";
import { MARKETS, KINDS, type Kind } from "@/data/markets";
import { SORTS, sortMarkets, type SortKey } from "@/lib/markets";
import { MarketTable } from "@/components/MarketTable";
import { Label } from "@/components/ui";

/**
 * The ?kind= deep link is resolved on the server and handed down as
 * `initialKind`, not read here with `useSearchParams`. That hook suspends on a
 * prerendered page, and the whole control strip then sits inside a Suspense
 * fallback that never resolves — the filters simply never appear. Taking it as
 * a prop means server and client render the same rows on the first pass.
 */
export function MarketBrowser({
  initialKind = "all",
}: {
  initialKind?: Kind | "all";
}) {
  const [kind, setKind] = useState<Kind | "all">(initialKind);
  const [sort, setSort] = useState<SortKey>("newest");

  /** Keep the URL shareable as the filter changes, without a navigation. */
  function chooseKind(next: Kind | "all") {
    setKind(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("kind");
    else url.searchParams.set("kind", next);
    window.history.replaceState(null, "", url);
  }

  const rows = useMemo(() => {
    const filtered =
      kind === "all" ? MARKETS : MARKETS.filter((m) => m.kind === kind);
    return sortMarkets(filtered, sort);
  }, [kind, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Label>Filter by where the carry comes from</Label>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <button
              type="button"
              className="chip"
              data-on={kind === "all"}
              onClick={() => chooseKind("all")}
            >
              All
            </button>
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                className="chip"
                data-on={kind === k.id}
                onClick={() => chooseKind(k.id)}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:text-right">
          <Label>Order</Label>
          <div className="mt-2.5 flex flex-wrap gap-1.5 lg:justify-end">
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="chip"
                data-on={sort === s.id}
                onClick={() => setSort(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between pb-2">
        <Label>
          {rows.length} {rows.length === 1 ? "market" : "markets"}
        </Label>
        <Label>read in the order you asked for</Label>
      </div>

      <MarketTable markets={rows} />
    </div>
  );
}
