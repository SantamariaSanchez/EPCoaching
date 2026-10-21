// Sous-titres WebVTT de la VSL complète, générés depuis la timeline (calée sur la voix si elle existe).
//   npm run vtt -- [sortie.vtt]      (par défaut : out/vsl-ep-coaching.vtt)
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ROOT, FPS, debutsScenes, scenesResolues } from "./scenes.mjs";

const sortie = process.argv[2] ?? join(ROOT, "out", "vsl-ep-coaching.vtt");
const scenes = scenesResolues();
const { debuts } = debutsScenes(scenes);
const ts = (s) => {
  const ms = Math.max(0, Math.round(s * 1000));
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;
};
const cues = [];
scenes.forEach((sc, i) => {
  const off = debuts[i] / FPS;
  // Un sous-titre par phrase (coupée si elle dépasse ~84 caractères), deux lignes au plus.
  let groupe = [];
  const flush = () => {
    if (!groupe.length) return;
    const texte = groupe.map((b) => b.texte).join(" ").replace(/\s+/g, " ").trim();
    const s = off + groupe[0].s;
    const e = off + groupe[groupe.length - 1].e + 0.25;
    cues.push({ s, e, texte });
    groupe = [];
  };
  sc.blocs.forEach((b, k) => {
    const long = groupe.reduce((a, g) => a + g.texte.length + 1, 0);
    if (groupe.length && (groupe[groupe.length - 1].phrase !== b.phrase || long + b.texte.length > 84)) flush();
    groupe.push(b);
    if (k === sc.blocs.length - 1) flush();
  });
});
// Jamais deux sous-titres à l'écran en même temps.
cues.forEach((c, i) => {
  if (cues[i + 1]) c.e = Math.min(c.e, cues[i + 1].s - 0.04);
});
const lignes = ["WEBVTT", "", "NOTE VSL EP Coaching, sous-titres générés depuis script/voix-off.txt", ""];
cues.forEach((c, i) => lignes.push(String(i + 1), `${ts(c.s)} --> ${ts(c.e)}`, c.texte, ""));
const n = cues.length + 1;
mkdirSync(dirname(sortie), { recursive: true });
writeFileSync(sortie, lignes.join("\n"));
console.log(`Sous-titres : ${sortie} (${n - 1} répliques)`);
