import { ImageResponse } from "next/og";

export const alt = "react-comic-viewer";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

const TITLE = "react-comic-viewer";
const DESCRIPTION = "A comic and manga viewer component for React.";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 90px",
        background: "#0b0b0f",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 120,
          height: 10,
          borderRadius: 999,
          marginBottom: 44,
          background: "linear-gradient(90deg, #fb7185 0%, #e11d48 100%)",
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 68,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        {TITLE}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          marginTop: 28,
          lineHeight: 1.4,
          color: "#a1a1aa",
        }}
      >
        {DESCRIPTION}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 26,
          marginTop: 56,
          color: "#71717a",
        }}
      >
        kkweb.io
      </div>
    </div>,
    size,
  );
}
