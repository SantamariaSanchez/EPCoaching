// Affiche les blocs d'une scène avec leur frame de début (aide au montage).
//   node scripts/cues.mjs 3
import { TIMELINE } from "../src/timeline.ts";
const n = Number(process.argv[2] ?? 1);
const sc = TIMELINE[n - 1];
console.log(`Scène ${n} « ${sc.titre} » : ${Math.ceil(sc.duree * 30)} frames`);
for (const b of sc.blocs) console.log(String(Math.round(b.s * 30)).padStart(5), "→", String(Math.round(b.e * 30)).padStart(5), b.texte);
