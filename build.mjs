
import { build } from "esbuild";
import { cp, mkdir } from "node:fs/promises";

await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });

await build({
  entryPoints: {
  content: "src/content.js",
  background: "src/background.js",
  popup: "src/popup.js",
  dashboard: "src/dashboard.js"
},
  bundle: true,
  outdir: "dist",
  format: "iife",
  target: "chrome120",
  logLevel: "info"
});
