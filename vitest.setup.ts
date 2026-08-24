import "@testing-library/jest-dom/vitest";

// jsdom has neither the Fullscreen API nor ResizeObserver, and the viewer
// reaches for both on mount.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}
