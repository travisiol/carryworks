import type { Metadata } from "next";
import { LaunchWizard } from "@/components/LaunchWizard";
import { Label, ReadThis } from "@/components/ui";
import { chain, siteConfig, terms } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Open a carry market",
  description: `Name a carry, set the terms, and the ${siteConfig.name} factory casts a vault of your own. One transaction, ${terms.launchFee} ${terms.launchFeeSymbol}, no review and no waitlist.`,
};

export default function LaunchPage() {
  return (
    <div className="shell py-14">
      <Label>
        {siteConfig.name} factory · {chain.name}
      </Label>
      <h1 className="display mt-4 text-[clamp(34px,6vw,58px)]">
        Open a carry market
      </h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-mid">
        Name the carry, set the terms, and the factory casts a vault of your
        own. One transaction. No review, no waitlist, and no way for us to take
        it down afterwards.
      </p>

      <div className="mt-12">
        <LaunchWizard />
      </div>

      <div className="mt-16 max-w-3xl">
        <ReadThis
          label="What you are signing up for"
          items={[
            "You cannot change the terms afterwards. Not the asset, not the ceiling, not the fee, not the strategy address.",
            "You cannot delete the market or stop deposits. Nobody can, including us.",
            "You can only mark a deployed position down, never up — the vault will not let you inflate it.",
            "Your fee is paid in shares, so it is worth nothing until the vault actually earns.",
          ]}
        />
      </div>
    </div>
  );
}
