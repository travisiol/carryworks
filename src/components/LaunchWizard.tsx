"use client";

import { useMemo, useState } from "react";
import { KINDS, YIELD_SOURCE, type Kind } from "@/data/markets";
import { Label, Terms } from "@/components/ui";
import { AssetLogo } from "@/components/AssetLogo";
import { terms, siteConfig, chain } from "@/lib/site-config";
import { isLive } from "@/lib/contracts";
import { bps, shortAddress } from "@/lib/format";

const STEPS = ["Name the carry", "Set the terms", "Review & open"] as const;

type Wiring = "source" | "address" | "none";

export function LaunchWizard() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [kind, setKind] = useState<Kind>("lending");
  const [description, setDescription] = useState("");
  const [strategyLink, setStrategyLink] = useState("");

  const [wiring, setWiring] = useState<Wiring>("source");
  const [strategyAddress, setStrategyAddress] = useState("");
  const [ceiling, setCeiling] = useState(80);
  const [fee, setFee] = useState(10);
  const [cap, setCap] = useState("");

  const shareTicker = ticker
    ? `${siteConfig.sharePrefix}${ticker.toUpperCase()}`
    : `${siteConfig.sharePrefix}TICKER`;

  const addressLooksValid = /^0x[a-fA-F0-9]{40}$/.test(strategyAddress.trim());

  /**
   * Interlocks, not validation messages. Each one states what has to be true
   * and whether it is — including the one nobody can satisfy today.
   */
  const interlocks = useMemo(
    () => [
      { ok: name.trim().length > 2, text: "The market has a name a depositor could read." },
      { ok: /^[A-Za-z0-9]{2,8}$/.test(ticker), text: "The share ticker is 2–8 letters or digits." },
      { ok: fee <= terms.maxPerformanceFeeBps / 100, text: `Performance fee is at or under ${bps(terms.maxPerformanceFeeBps)}.` },
      {
        ok: wiring === "none" || (wiring === "source") || addressLooksValid,
        text: "The strategy is either a wired source or a valid address.",
      },
      {
        ok: wiring !== "none" || ceiling === 0,
        text: "A market with no strategy has a deploy ceiling of zero.",
      },
      { ok: isLive, text: `The ${siteConfig.name} factory is deployed on ${chain.name}.` },
    ],
    [name, ticker, fee, wiring, addressLooksValid, ceiling],
  );

  const open = interlocks.filter((i) => !i.ok).length;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {/* Step rail, printed as numbered rules rather than a progress bar. */}
        <ol className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)]">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => setStep(i)}
                className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors ${
                  i === step ? "brand-fill" : "bg-transparent hover:bg-surface"
                }`}
              >
                <span className="num text-[10.5px] tracking-[0.14em] opacity-70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[12.5px] leading-tight">{s}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="panel mt-6 p-6">
          {step === 0 ? (
            <div className="grid gap-6">
              <Field
                label="Market name"
                hint="What this market earns from, in the words a depositor would use. Up to 64 characters."
              >
                <input
                  className="field"
                  maxLength={64}
                  value={name}
                  placeholder="Steakhouse USDG passthrough"
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>

              <Field
                label="Share ticker"
                hint={`Depositors hold an ERC-20 receipt. The factory prefixes it — yours would mint as ${shareTicker}.`}
              >
                <input
                  className="field"
                  maxLength={8}
                  value={ticker}
                  placeholder="USDG"
                  onChange={(e) =>
                    setTicker(e.target.value.replace(/[^A-Za-z0-9]/g, ""))
                  }
                />
              </Field>

              <Field label="Where the carry comes from">
                <div className="flex flex-wrap gap-1.5">
                  {KINDS.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      className="chip"
                      data-on={kind === k.id}
                      onClick={() => setKind(k.id)}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field
                label="Description"
                hint={`${description.length}/600 · written into the factory's own storage, alongside the market.`}
              >
                <textarea
                  className="field"
                  rows={4}
                  maxLength={600}
                  value={description}
                  placeholder="Say where the return comes from and what happens when it does not arrive."
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>

              <Field label="Strategy link" hint="Optional. A page a depositor can read before funding you.">
                <input
                  className="field"
                  value={strategyLink}
                  placeholder="https://"
                  onChange={(e) => setStrategyLink(e.target.value)}
                />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-6">
              <Field
                label="What the capital is pointed at"
                hint="Fixed at launch. There is no function to change it afterwards."
              >
                <div className="grid gap-2">
                  <Choice
                    on={wiring === "source"}
                    onClick={() => setWiring("source")}
                    title={`Wire it to ${YIELD_SOURCE.name}`}
                    body={`An ERC-4626 vault already live on ${chain.name}. The works deploys a thin adapter you own; capital supplies in through it and redeems on demand.`}
                  />
                  <Choice
                    on={wiring === "address"}
                    onClick={() => setWiring("address")}
                    title="Name your own strategy address"
                    body="A desk, a contract, a multisig. The market page shows the address, and shows how much of the vault is sitting at it right now."
                  />
                  <Choice
                    on={wiring === "none"}
                    onClick={() => {
                      setWiring("none");
                      setCeiling(0);
                    }}
                    title="Nothing — capital never leaves"
                    body="Deploy ceiling of zero. No address, not even yours, can move capital out. Carry has to be paid in from outside."
                  />
                </div>
              </Field>

              {wiring === "address" ? (
                <Field
                  label="Strategy address"
                  hint={
                    strategyAddress && !addressLooksValid
                      ? "That is not a 20-byte address."
                      : "The only address this vault may ever send capital to."
                  }
                >
                  <input
                    className="field"
                    value={strategyAddress}
                    placeholder="0x…"
                    onChange={(e) => setStrategyAddress(e.target.value)}
                  />
                </Field>
              ) : null}

              <Field
                label={`Deploy ceiling — ${ceiling}% of the vault`}
                hint="The most that may sit at the strategy at once. The rest stays idle and withdrawable."
              >
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={ceiling}
                  disabled={wiring === "none"}
                  onChange={(e) => setCeiling(Number(e.target.value))}
                  className="w-full accent-[var(--color-violet)]"
                />
              </Field>

              <Field
                label={`Performance fee — ${fee}% of carry`}
                hint={`Charged on carry only, never on principal. The works keeps ${bps(terms.protocolCutBps)} of it. Maximum ${bps(terms.maxPerformanceFeeBps)}.`}
              >
                <input
                  type="range"
                  min={0}
                  max={terms.maxPerformanceFeeBps / 100}
                  step={1}
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  className="w-full accent-[var(--color-violet)]"
                />
              </Field>

              <Field label="Deposit cap" hint="Optional. Leave empty for uncapped.">
                <input
                  className="field"
                  inputMode="decimal"
                  value={cap}
                  placeholder="uncapped"
                  onChange={(e) => setCap(e.target.value.replace(/[^\d.]/g, ""))}
                />
              </Field>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-6">
              <div>
                <Label>What the factory will write into the vault</Label>
                <div className="mt-3">
                  <Terms
                    rows={[
                      ["Market name", name || "—"],
                      ["Share token", shareTicker],
                      ["Carry from", KINDS.find((k) => k.id === kind)?.label ?? kind],
                      [
                        "Strategy",
                        wiring === "source"
                          ? `${YIELD_SOURCE.name} adapter`
                          : wiring === "address"
                            ? strategyAddress
                              ? shortAddress(strategyAddress)
                              : "not set"
                            : "none — capital never leaves",
                      ],
                      ["Deploy ceiling", wiring === "none" ? "0%" : `${ceiling}%`],
                      ["Performance fee", `${fee}% of carry`],
                      ["Works' share of that fee", bps(terms.protocolCutBps)],
                      ["Deposit cap", cap ? cap : "uncapped"],
                      ["Owner", "none — cannot be paused or upgraded"],
                      ["Launch fee", `${terms.launchFee} ${terms.launchFeeSymbol}`],
                    ]}
                  />
                </div>
              </div>

              <div>
                <Label>Interlocks — {open === 0 ? "all closed" : `${open} open`}</Label>
                <ul className="mt-3 grid gap-2">
                  {interlocks.map((i) => (
                    <li key={i.text} className="flex items-start gap-3 text-[13px]">
                      <span
                        aria-hidden
                        className={`mt-[5px] inline-block h-[7px] w-[7px] shrink-0 ${
                          i.ok ? "brand-fill" : "bg-warn"
                        }`}
                      />
                      <span className={i.ok ? "text-mid" : "text-warn"}>
                        {i.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button type="button" className="btn btn-brand w-full" disabled={open > 0}>
                  {open > 0 ? `${open} interlock${open > 1 ? "s" : ""} open` : "Open the market"}
                </button>
                <p className="mt-3 text-[12px] leading-relaxed text-low">
                  One transaction to the factory, {terms.launchFee}{" "}
                  {terms.launchFeeSymbol}, and the vault exists. Nobody reviews
                  it, and nobody — including us — can take it down afterwards.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between border-t border-[var(--line)] pt-5">
            <button
              type="button"
              className="btn btn-glass btn-sm"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-brand btn-sm"
              disabled={step === STEPS.length - 1}
              onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* The listing preview: the row exactly as the registry will print it. */}
      <aside className="lg:col-span-5">
        <Label>How it will list</Label>
        <div className="panel mt-3 p-5">
          <div className="flex items-start gap-3">
            <AssetLogo
              asset={wiring === "source" ? "USDG" : "—"}
              fallback={(ticker || "··").slice(0, 2)}
            />
            <div className="min-w-0">
              <div className="truncate text-[14px] font-medium">
                {name || "Untitled market"}
              </div>
              <div className="num text-[11px] text-low">
                {shareTicker} · {wiring === "source" ? "USDG" : "asset"}
              </div>
            </div>
          </div>

          <p className="mt-4 min-h-[42px] text-[13px] leading-relaxed text-mid">
            {description ||
              "Your description prints here, on the market page and in the factory's own storage."}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="chip">{KINDS.find((k) => k.id === kind)?.label}</span>
            <span className="chip">
              {wiring === "none" ? "locked" : `${ceiling}% ceiling`}
            </span>
            <span className="chip">{fee}% of carry</span>
          </div>

          <div className="perf my-5" />

          <Terms
            rows={[
              ["Price per share at launch", "1.000000"],
              ["Depositors", "0"],
              ["Carry paid", "0"],
              ["APY", "too new"],
            ]}
          />
        </div>

        <div id="mine" className="mt-10 scroll-mt-28">
          <Label>Markets you opened</Label>
          <div className="panel-tint mt-3 px-5 py-8 text-center">
            <p className="text-[13px] text-mid">
              Connect a wallet to see the markets you have opened.
            </p>
            <button type="button" className="btn btn-glass btn-sm mt-4">
              Connect wallet
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2.5">{children}</div>
      {hint ? (
        <p className="mt-2 text-[12px] leading-relaxed text-low">{hint}</p>
      ) : null}
    </div>
  );
}

function Choice({
  on,
  onClick,
  title,
  body,
}: {
  on: boolean;
  onClick: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border p-4 text-left transition-colors ${
        on
          ? "border-violet bg-surface"
          : "border-[var(--line)] hover:border-[var(--line-strong)]"
      }`}
    >
      <span className="flex items-center gap-2.5 text-[13.5px] font-medium">
        <span
          aria-hidden
          className={`inline-block h-[9px] w-[9px] shrink-0 border ${
            on ? "brand-fill border-transparent" : "border-[var(--line-strong)]"
          }`}
        />
        {title}
      </span>
      <span className="mt-1.5 block pl-[19px] text-[12.5px] leading-relaxed text-mid">
        {body}
      </span>
    </button>
  );
}
