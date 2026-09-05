"use client";

import { useState } from "react";
import type { Market } from "@/data/markets";
import { amount, price } from "@/lib/format";
import { Label } from "@/components/ui";
import { isLive } from "@/lib/contracts";

/**
 * The order ticket. It does the real arithmetic against the market's own
 * numbers so a depositor can see what a deposit buys — and it cannot send
 * anything, because there is no vault yet. That last fact is printed under the
 * button rather than hidden behind a disabled state.
 */
export function DepositPanel({ market }: { market: Market }) {
  const [side, setSide] = useState<"deposit" | "withdraw">("deposit");
  const [value, setValue] = useState("");

  const pps = market.pricePerShare;
  const parsed = Number.parseFloat(value);
  const n = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;

  const shares = side === "deposit" ? n / pps : n;
  const receives = side === "deposit" ? shares : n * pps;
  const receivesUnit = side === "deposit" ? market.ticker : market.asset;

  const supplyAfter =
    side === "deposit"
      ? market.sharesOutstanding + shares
      : Math.max(market.sharesOutstanding - shares, 0);
  const shareOfVault = supplyAfter > 0 ? shares / supplyAfter : 0;

  // A withdrawal larger than the idle balance reverts rather than queues, so
  // the ticket says that before the wallet does.
  const overIdle = side === "withdraw" && n * pps > market.idle;

  return (
    <div className="panel">
      <div className="grid grid-cols-2 border-b border-[var(--line)]">
        {(["deposit", "withdraw"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className={`h-11 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors ${
              side === s
                ? "brand-fill"
                : "text-low hover:text-hi"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between">
          <Label>Amount</Label>
          <span className="num text-[11px] text-low">
            Wallet — {side === "deposit" ? market.asset : market.ticker}
          </span>
        </div>

        <div className="mt-2 flex gap-2">
          <input
            className="field flex-1"
            inputMode="decimal"
            placeholder="0.00"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^\d.]/g, ""))}
            aria-label={`Amount to ${side}`}
          />
          <span className="num grid h-10 place-items-center border border-[var(--line)] px-3 text-[12px] text-mid">
            {side === "deposit" ? market.asset : market.ticker}
          </span>
        </div>

        <div className="mt-2 flex gap-1.5">
          {["25%", "50%", "Max"].map((p) => (
            <button key={p} type="button" className="chip" disabled>
              {p}
            </button>
          ))}
        </div>

        <dl className="terms mt-5">
          <div>
            <dt>You receive</dt>
            <dd>{n === 0 ? "—" : `${amount(receives)} ${receivesUnit}`}</dd>
          </div>
          <div>
            <dt>Price per share</dt>
            <dd>
              {price(pps)} {market.asset}
            </dd>
          </div>
          <div>
            <dt>Share of the vault</dt>
            <dd>
              {n === 0 || shareOfVault === 0
                ? "—"
                : `${(shareOfVault * 100).toFixed(shareOfVault < 0.001 ? 4 : 2)}%`}
            </dd>
          </div>
        </dl>

        {overIdle ? (
          <p className="mt-4 border border-warn/30 wash px-3 py-2.5 text-[12px] leading-relaxed text-warn">
            More than this vault holds idle ({amount(market.idle, market.asset)}
            ). A withdrawal over the idle balance reverts — it does not queue.
          </p>
        ) : null}

        <button type="button" className="btn btn-brand mt-4 w-full">
          Connect wallet
        </button>

        <p className="mt-3 text-[11.5px] leading-relaxed text-low">
          Deposits are open to anyone. The works takes nothing on the way in —
          its only cut is a fifth of whatever performance fee the creator
          charges, and only on carry.
        </p>
        {!isLive ? (
          <p className="num mt-2 text-[11px] text-warn">
            Awaiting launch — no vault exists to deposit into yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
