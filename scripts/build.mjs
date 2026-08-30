import { readFileSync, rmSync } from "node:fs";
import * as esbuild from "esbuild";
import cssModulesPlugin from "esbuild-css-modules-plugin";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

// Everything the consumer installs stays external; only our own source and the
// CSS module are bundled.
const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  "react/jsx-runtime",
];

rmSync("dist", { force: true, recursive: true });

const shared = {
  bundle: true,
  entryPoints: ["src/lib/index.tsx"],
  external,
  jsx: "automatic",
  minify: true,
  // Runs before anything else so the class-name map reaches the JS. tsup used
  // to own this build, but its internal CSS handling claimed `.module.css`
  // first and left the map empty, which shipped a viewer with no styles.
  plugins: [cssModulesPlugin()],
  sourcemap: true,
  target: "es2020",
};

await esbuild.build({ ...shared, format: "esm", outfile: "dist/index.mjs" });
await esbuild.build({ ...shared, format: "cjs", outfile: "dist/index.js" });

console.log("built dist/index.mjs, dist/index.js, dist/index.css");
