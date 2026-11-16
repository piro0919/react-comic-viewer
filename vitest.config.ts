import { defineConfig } from "vitest/config";

export default defineConfig({
  // vite 8 transforms with oxc, not esbuild. tsconfig.json keeps jsx: "preserve" for the editor
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
});
