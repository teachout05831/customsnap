import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 72 72"
        fill="none"
      >
        <rect width="72" height="72" rx="14" fill="#ea580c" />
        <rect x="14" y="14" width="17" height="17" rx="3" fill="white" />
        <rect x="14" y="41" width="17" height="17" rx="3" fill="white" opacity="0.6" />
        <rect x="41" y="14" width="17" height="17" rx="3" fill="white" opacity="0.6" />
        <rect x="41" y="41" width="17" height="17" rx="3" fill="white" opacity="0.3" />
      </svg>
    ),
    { ...size }
  );
}
