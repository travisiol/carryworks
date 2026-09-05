import Link from "next/link";
import type { Market } from "@/data/markets";
import { kindLabel } from "@/data/markets";
import { apy, custody, tvl } from "@/lib/markets";
import { age, amount, percent } from "@/lib/format";
import { AssetLogo } from "@/components/AssetLogo";

/**
 * The registry row. Presentational and server-rendered — the filters on
 * /markets live in a client wrapper that hands this an already-filtered list,
 * so the table itself never ships JavaScript.
 */
export function MarketTable({ markets }: { markets: Market[] }) {
  return (
    <div className="-mx-3 overflow-x-auto px-3">
      <table className="tbl min-w-[900px]">
        <thead>
          <tr>
            <th>Market</th>
            <th>Strategy</th>
            <th className="r">APY</th>
            <th className="r">TVL</th>
            <th className="r">Carry paid</th>
            <th className="r">Depositors</th>
            <th className="r">Custody</th>
            <th className="r">Age</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((m) => {
            const a = apy(m);
            const c = custody(m);
            return (
              <tr
                key={m.vault}
                className="group transition-colors hover:bg-surface"
              >
                <td>
                  <Link
                    href={`/market/${m.vault}`}
                    className="flex items-center gap-3"
                  >
                    <AssetLogo asset={m.asset} fallback={m.mark} />
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-medium">
                        {m.name}
                      </span>
                      <span className="num block text-[11px] text-low">
                        {m.ticker} · {m.asset}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="text-[12.5px] text-mid whitespace-nowrap">
                  {kindLabel(m.kind)}
                </td>
                <td className="num r whitespace-nowrap">
                  {a === null ? (
                    <span className="text-low">too new</span>
                  ) : (
                    percent(a)
                  )}
                </td>
                <td className="num r whitespace-nowrap">
                  {amount(tvl(m), m.asset)}
                </td>
                <td className="num r whitespace-nowrap">
                  {m.totalYield === 0 ? (
                    <span className="text-low">0</span>
                  ) : (
                    amount(m.totalYield, m.asset)
                  )}
                </td>
                <td className="num r">{m.depositors}</td>
                <td className="num r whitespace-nowrap text-mid">
                  {c.label}
                </td>
                <td className="num r text-low">{age(m.ageMinutes)}</td>
              </tr>
            );
          })}
          {markets.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-10 text-center text-[13px] text-low">
                No market of this kind has been opened yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
