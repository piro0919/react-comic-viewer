import { defineConfig } from "tsup";
import cssModulesPlugin from "esbuild-css-modules-plugin";

export default defineConfig({
  entry: { index: "src/lib/index.tsx" },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
  sourcemap: true,
  minify: true,
  treeshake: true,
  esbuildPlugins: [cssModulesPlugin()],
  tsconfig: "tsconfig.build.json",
  outDir: "dist",
});
