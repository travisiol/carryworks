import { ImageResponse } from "next/og";
import { chain, siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

/** The card is the hero: void, nebula, one lit line of type. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#eceef6",
          padding: 64,
          background:
            "radial-gradient(900px 620px at 6% -8%, rgba(124,92,255,0.42), transparent 62%), radial-gradient(760px 540px at 98% 2%, rgba(52,230,255,0.24), transparent 60%), #06060c",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 4,
            color: "#6a6c86",
          }}
        >
          <div style={{ display: "flex" }}>
            CARRY MARKETS · {chain.name.toUpperCase()}
          </div>
          <div style={{ display: "flex", color: "#ff5c7a" }}>
            NOT REVIEWED · NOT ENDORSED
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: 190,
              height: 3,
              borderRadius: 3,
              background: "linear-gradient(90deg,#7c5cff,#34e6ff)",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -3.5,
              lineHeight: 1.04,
              marginTop: 34,
              maxWidth: 920,
            }}
          >
            Any carry, made into a market.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#a3a5bd",
              marginTop: 24,
              maxWidth: 840,
              lineHeight: 1.4,
            }}
          >
            Name a return, point it at a strategy, and the factory casts a vault
            anyone can deposit into.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700, alignItems: "center" }}>
            CARRY
            <span
              style={{
                display: "flex",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 999,
                padding: "4px 12px",
                marginLeft: 8,
                fontSize: 20,
                color: "#34e6ff",
              }}
            >
              WORKS
            </span>
          </div>
          <div style={{ display: "flex", color: "#6a6c86" }}>
            0.001 ETH · NO OWNER · NO PAUSE
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
