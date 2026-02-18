import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CustomSnap — Custom websites, built fast.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 40%, #dc2626 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle dot pattern like the landing page hero */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.08,
            backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
          {/* Grid icon */}
          <svg
            width="96"
            height="96"
            viewBox="0 0 72 72"
            fill="none"
          >
            <rect width="72" height="72" rx="12" fill="white" />
            <rect x="14" y="14" width="17" height="17" rx="3" fill="#0f172a" />
            <rect x="14" y="41" width="17" height="17" rx="3" fill="#0f172a" opacity="0.6" />
            <rect x="41" y="14" width="17" height="17" rx="3" fill="#0f172a" opacity="0.6" />
            <rect x="41" y="41" width="17" height="17" rx="3" fill="#0f172a" opacity="0.3" />
          </svg>

          {/* Brand text — thicker via layered shadow */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span
              style={{
                fontSize: 92,
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "0.06em",
                textShadow: "1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff",
              }}
            >
              CUSTOM
            </span>
            <span
              style={{
                fontSize: 92,
                fontWeight: 900,
                color: "#2563eb",
                letterSpacing: "0.06em",
                textShadow: "1px 0 0 #2563eb, -1px 0 0 #2563eb, 0 1px 0 #2563eb, 0 -1px 0 #2563eb, 1px 1px 0 #2563eb, -1px -1px 0 #2563eb, 1px -1px 0 #2563eb, -1px 1px 0 #2563eb",
              }}
            >
              SNAP
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.9)",
            marginTop: 36,
            position: "relative",
          }}
        >
          Custom websites for small businesses — built by real humans.
        </p>

        {/* Domain */}
        <p
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.55)",
            marginTop: 14,
            position: "relative",
            letterSpacing: "0.1em",
          }}
        >
          customsnap.io
        </p>
      </div>
    ),
    { ...size }
  );
}
