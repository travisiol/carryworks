/**
 * Nothing is deployed yet. Every address on the site comes from here, and an
 * address that has not been set renders as "Awaiting launch" rather than as a
 * plausible-looking placeholder — no string on this site should be mistakable
 * for a contract that exists.
 */
const env = {
  factory: process.env.NEXT_PUBLIC_CARRYWORKS_FACTORY,
  lens: process.env.NEXT_PUBLIC_CARRYWORKS_LENS,
  feeCollector: process.env.NEXT_PUBLIC_CARRYWORKS_FEE_COLLECTOR,
} as const;

export type ContractKey = keyof typeof env;

export const AWAITING = "Awaiting launch" as const;

export function contractAddress(key: ContractKey): string | null {
  const value = env[key];
  return value && /^0x[a-fA-F0-9]{40}$/.test(value) ? value : null;
}

/** True only once the factory address is real. Gates every live claim. */
export const isLive = contractAddress("factory") !== null;
