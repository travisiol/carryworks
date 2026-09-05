import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** The monogram in the void, lit by the brand gradient underneath it. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#06060c",
          color: "#eceef6",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        <div style={{ display: "flex", marginTop: 2 }}>CW</div>
        <div
          style={{
            display: "flex",
            width: 18,
            height: 3,
            borderRadius: 2,
            background: "linear-gradient(90deg,#7c5cff,#34e6ff)",
            marginTop: 2,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
