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

// The web component is for pages without React, so nothing stays external.
// React is swapped for Preact, which runs the same component at a fraction of
// the size, and the CSS is injected from the JS so one script tag is enough.
await esbuild.build({
  ...shared,
  alias: {
    react: "preact/compat",
    "react-dom": "preact/compat",
    "react-dom/client": "preact/compat/client",
    "react/jsx-runtime": "preact/jsx-runtime",
  },
  define: { "process.env.NODE_ENV": '"production"' },
  entryPoints: ["src/lib/web-component.tsx"],
  external: [],
  format: "esm",
  metafile: true,
  outfile: "dist/web-component.js",
  plugins: [cssModulesPlugin({ inject: true })],
  // The map would carry all of Preact's source and outweigh the bundle.
  sourcemap: false,
});
// The CSS already lives in the JS; the plugin still writes a copy.
rmSync("dist/web-component.css", { force: true });

console.log(
  "built dist/index.mjs, dist/index.js, dist/index.css, dist/web-component.js",
);
