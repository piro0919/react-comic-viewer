"use client";

import { ChangeEventHandler, useCallback, useState } from "react";
import ComicViewer from "@/lib";

export default function Home() {
  const [direction, setDirection] = useState<"rtl" | "ltr">("rtl");
  const [showPageIndicator, setShowPageIndicator] = useState(true);

  const handleDirectionChange = useCallback<
    ChangeEventHandler<HTMLSelectElement>
  >((e) => {
    setDirection(e.target.value as "rtl" | "ltr");
  }, []);

  return (
    <main
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          backgroundColor: "#222",
          borderBottom: "1px solid #333",
          color: "#fff",
          padding: "16px 24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
          react-comic-viewer
        </h1>
        <p
          style={{
            color: "#888",
            fontSize: "14px",
            margin: "8px 0 0",
          }}
        >
          A comic/manga viewer component for React
        </p>
      </header>

      <ComicViewer
        direction={direction}
        initialCurrentPage={0}
        initialIsExpansion={false}
        onChangeCurrentPage={(currentPage) => {
          console.log("Page changed:", currentPage);
        }}
        onChangeExpansion={(isExpansion) => {
          console.log("Expansion changed:", isExpansion);
        }}
        pages={[
          "/comics/0.jpg",
          "/comics/1.jpg",
          "/comics/2.jpg",
          "/comics/3.jpg",
          "/comics/4.jpg",
          "/comics/5.jpg",
          "/comics/6.jpg",
        ]}
        showPageIndicator={showPageIndicator}
        switchingRatio={0.75}
      />

      <section
        style={{
          backgroundColor: "#222",
          borderTop: "1px solid #333",
          color: "#fff",
          padding: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: "0 0 16px",
          }}
        >
          Options
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <label
            style={{
              alignItems: "center",
              display: "flex",
              gap: "8px",
            }}
          >
            <span style={{ color: "#aaa" }}>Direction:</span>
            <select
              value={direction}
              onChange={handleDirectionChange}
              style={{
                backgroundColor: "#333",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "#fff",
                padding: "6px 12px",
              }}
            >
              <option value="rtl">RTL (Manga)</option>
              <option value="ltr">LTR (Comic)</option>
            </select>
          </label>

          <label
            style={{
              alignItems: "center",
              cursor: "pointer",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={showPageIndicator}
              onChange={(e) => setShowPageIndicator(e.target.checked)}
              style={{ accentColor: "#666", cursor: "pointer" }}
            />
            <span style={{ color: "#aaa" }}>Show page indicator</span>
          </label>
        </div>

        <div
          style={{
            borderTop: "1px solid #333",
            color: "#666",
            fontSize: "14px",
            marginTop: "24px",
            paddingTop: "24px",
          }}
        >
          <h3 style={{ color: "#888", fontSize: "14px", margin: "0 0 12px" }}>
            Features
          </h3>
          <ul
            style={{
              display: "grid",
              gap: "8px",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            <li>Swipe to navigate</li>
            <li>Keyboard navigation (Arrow keys)</li>
            <li>Double-tap to zoom</li>
            <li>Tap to show/hide UI</li>
            <li>Fullscreen mode</li>
            <li>Thumbnail navigation</li>
            <li>Loading indicator</li>
            <li>Responsive single/double page</li>
          </ul>
        </div>
      </section>

      <footer
        style={{
          backgroundColor: "#1a1a1a",
          borderTop: "1px solid #333",
          color: "#666",
          fontSize: "14px",
          padding: "16px 24px",
          textAlign: "center",
        }}
      >
        <a
          href="https://github.com/piro0919/react-comic-viewer"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#888", textDecoration: "none" }}
        >
          GitHub
        </a>
        {" | "}
        <a
          href="https://www.npmjs.com/package/react-comic-viewer"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#888", textDecoration: "none" }}
        >
          npm
        </a>
      </footer>
    </main>
  );
}
