// Contrôle visuel + automatique d'une composition :
//   node scripts/planche.mjs Scene1 [--pas 10] [--echelle 0.5] [--de 0] [--a 900] [--frames 10,20,30]
// - rend des images fixes (gardien anti-chevauchement actif) dans out/planches/<comp>/
// - assemble des planches contact légendées (numéro d'image + temps)
// - affiche toutes les alertes du gardien (chevauchements, débordements)
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { ROOT } from "./scenes.mjs";

const args = process.argv.slice(2);
const comp = args[0] ?? "Scene1";
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : d;
};
const pas = Number(opt("pas", 10));
const echelle = Number(opt("echelle", 0.5));
const chrome = process.env.REMOTION_CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const out = join(ROOT, "out", "planches", comp);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const serveUrl = await bundle({ entryPoint: join(ROOT, "src", "index.ts"), publicDir: join(ROOT, "public"), rspack: true });
const inputProps = { verifier: true };
const browser = await openBrowser("chrome", { browserExecutable: chrome });
const composition = await selectComposition({ serveUrl, id: comp, inputProps, puppeteerInstance: browser });
const de = Number(opt("de", 0));
const a = Number(opt("a", composition.durationInFrames - 1));
const frames = opt("frames", null)
  ? opt("frames").split(",").map(Number)
  : Array.from({ length: Math.floor((a - de) / pas) + 1 }, (_, k) => de + k * pas);
const alertes = [];
const fichiers = [];
let n = 0;
for (const frame of frames) {
  const f = join(out, `${String(n++).padStart(4, "0")}.jpg`);
  await renderStill({
    serveUrl,
    composition,
    frame,
    output: f,
    imageFormat: "jpeg",
    jpegQuality: 80,
    scale: echelle,
    inputProps,
    puppeteerInstance: browser,
    onBrowserLog: (l) => {
      if (l.text.includes("[GARDIEN")) alertes.push(l.text);
    },
  });
  // légende
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", f, "-vf", `drawtext=text='${frame} (${(frame / 30).toFixed(1)}s)':x=10:y=10:fontsize=${Math.round(28 * echelle * 2)}:fontcolor=white:box=1:boxcolor=black@0.6`, f + ".l.jpg"]);
  fichiers.push(f + ".l.jpg");
}
await browser.close({ silent: true });
// Planches 4×4
const parPlanche = 16;
for (let k = 0; k < fichiers.length; k += parPlanche) {
  const lot = fichiers.slice(k, k + parPlanche);
  const liste = join(out, `lot${k}.txt`);
  writeFileSync(liste, lot.map((x) => `file '${x}'`).join("\n"));
  execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", liste, "-vf", `scale=640:-1,tile=4x4:padding=6:color=gray`, "-frames:v", "1", join(out, `planche-${String(k / parPlanche + 1).padStart(2, "0")}.jpg`)]);
}
const uniques = [...new Set(alertes)];
writeFileSync(join(out, "gardien.txt"), uniques.join("\n"));
console.log(`${frames.length} images, ${Math.ceil(fichiers.length / parPlanche)} planche(s) dans ${out}`);
console.log(uniques.length ? `GARDIEN : ${uniques.length} alerte(s)\n${uniques.slice(0, 60).join("\n")}` : "GARDIEN : aucune alerte");
