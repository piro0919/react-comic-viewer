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
        alignItems: "center",
        padding: "0 80px",
        background: "#0b0b0f",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: 600,
        }}
      >
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
            marginTop: 48,
            color: "#71717a",
          }}
        >
          kkweb.io
        </div>
      </div>

      {/* 何をするパッケージなのかを右に置く。名前と説明だけだと、
          9件が同じ絵になってタイムラインで見分けが付かない */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {/* 見開き。右綴じなので右のページから読む */}
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1].map((page) => (
            <div
              key={page}
              style={{
                background: "#f4f4f5",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                height: 260,
                padding: 10,
                width: 170,
              }}
            >
              <div
                style={{
                  background: "#d4d4d8",
                  border: "3px solid #0b0b0f",
                  display: "flex",
                  height: 96,
                }}
              />
              <div style={{ display: "flex", flex: 1, gap: 8 }}>
                <div
                  style={{
                    background: page === 1 ? "#f43f5e" : "#e4e4e7",
                    border: "3px solid #0b0b0f",
                    display: "flex",
                    flex: 1,
                  }}
                />
                <div
                  style={{
                    background: "#e4e4e7",
                    border: "3px solid #0b0b0f",
                    display: "flex",
                    flex: 1,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>,
    size,
  );
}
