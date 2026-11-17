// Planche rapide d une scène : node scripts/stills.mjs Scene3 15 70 140 ... (images dans out/v2/)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
const [comp, ...frames] = process.argv.slice(2);
const chrome = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serve = process.env.BUNDLE || (await bundle({ entryPoint: "src/index.ts", rspack: true }));
const c = await selectComposition({ serveUrl: serve, id: comp, browserExecutable: chrome, logLevel: "error" });
const outs = [];
for (const fr of frames.map(Number)) {
  const out = `out/v2/${comp}_${fr}.jpg`;
  await renderStill({ serveUrl: serve, composition: c, frame: Math.min(fr, c.durationInFrames - 1), output: out, imageFormat: "jpeg", browserExecutable: chrome, logLevel: "error", scale: 0.4 });
  outs.push(out);
}
console.log(comp, c.durationInFrames, "frames");
const cols = 4;
execFileSync("ffmpeg", ["-v", "error", "-y", ...outs.flatMap((o) => ["-i", o]), "-filter_complex", `xstack=inputs=${outs.length}:layout=${outs.map((_, i) => `${(i % cols) * 768}_${Math.floor(i / cols) * 432}`).join("|")}:fill=black`, `out/v2/${comp}_planche.jpg`]);
