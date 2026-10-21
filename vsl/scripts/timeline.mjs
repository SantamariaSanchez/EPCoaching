// Génère src/timeline.ts à partir de script/voix-off.txt et script/mise-en-valeur.json.
//   npm run timeline
// Rythme estimé tant que la voix n'est pas enregistrée :
//   2,3 mots par seconde, « / » = 0,35 s, « // » = 1 s, fin de paragraphe = 0,6 s.
// Quand public/voix/scene-N.mp3 existe, la vidéo se cale dessus au moment du rendu
// (voir src/lib/resolve.ts) : ce fichier reste la base, il n'est pas à retoucher à la main.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MOTS_PAR_SECONDE = 2.3;
const PAUSE = { petite: 0.35, vraie: 1.0, paragraphe: 0.6, phrase: 0.3, aucune: 0.12 };
// Temps avant la première parole de la scène (carton de chapitre) et après la dernière.
const LEAD = { 1: 0.5 };
const LEAD_DEFAUT = 1.8;
const QUEUE = 1.1;
// Une page de texte à l'écran : 4 blocs au plus, environ 120 caractères au plus.
const PAGE_BLOCS = 4;
const PAGE_CARACTERES = 120;

const raw = readFileSync(join(ROOT, "script/voix-off.txt"), "utf8");
const valeur = JSON.parse(readFileSync(join(ROOT, "script/mise-en-valeur.json"), "utf8"));

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[«»"“”.,;:!?()]/g, "")
    .trim();

const toSec = (tc) => {
  const [m, s] = tc.split(":").map(Number);
  return m * 60 + s;
};

// 1. Découpage en scènes et paragraphes.
const scenes = [];
let cur = null;
for (const line of raw.split("\n")) {
  if (line.startsWith("#")) continue;
  const head = line.match(/^= Scène (\d+) \| (.+?) \| (\d+:\d+)-(\d+:\d+)\s*$/);
  if (head) {
    cur = { num: Number(head[1]), titre: head[2], cible: [toSec(head[3]), toSec(head[4])], paragraphes: [] };
    scenes.push(cur);
    continue;
  }
  if (!cur) continue;
  if (line.trim() === "") continue;
  cur.paragraphes.push(line.trim());
}

// 2. Pour chaque scène : blocs (entre deux « / »), mots, temps estimés.
const tokenise = (texte) => {
  // Les signes détachés à la française (« ? », « : », « » ») sont collés au mot voisin
  // avec une espace insécable pour ne jamais se retrouver seuls en début de ligne.
  const parts = texte.split(/\s+/).filter(Boolean);
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (/^[?!:;»]$/.test(p) && out.length) {
      out[out.length - 1] += " " + p;
    } else if (p === "«" && i + 1 < parts.length) {
      parts[i + 1] = "« " + parts[i + 1];
    } else {
      out.push(p);
    }
  }
  return out;
};

const affichage = (mot, dernier) => {
  // En fin de bloc, on retire la virgule ou le point (le saut de ligne fait la pause).
  if (dernier) return mot.replace(/[,.]$/, "");
  return mot;
};

const out = [];
for (const sc of scenes) {
  const lead = LEAD[sc.num] ?? LEAD_DEFAUT;
  let t = lead;
  const blocs = [];
  const aValider = [];
  let phraseIdx = 0;
  sc.paragraphes.forEach((para, pIdx) => {
    let note = null;
    let texte = para;
    const m = texte.match(/^\[\[À VALIDER : (.+?)\]\]\s*/);
    if (m) {
      note = { note: m[1], portee: "paragraphe" };
      texte = texte.slice(m[0].length);
    }
    const inline = [];
    texte = texte.replace(/\s*\[\[À VALIDER : (.+?)\]\]/g, (_, n) => {
      inline.push(n);
      return "§AV§";
    });
    // Découpe sur « // » puis « / » en gardant la nature de la pause.
    const morceaux = [];
    const re = /\s*(\/\/|\/)\s*/g;
    let last = 0;
    let mm;
    while ((mm = re.exec(texte))) {
      morceaux.push({ texte: texte.slice(last, mm.index), pause: mm[1] === "//" ? "vraie" : "petite" });
      last = re.lastIndex;
    }
    morceaux.push({ texte: texte.slice(last), pause: pIdx === sc.paragraphes.length - 1 ? "aucune" : "paragraphe" });

    morceaux.forEach((mc, mIdx) => {
      let tx = mc.texte.trim();
      let noteBloc = note ? note.note : null;
      if (tx.includes("§AV§")) {
        noteBloc = inline.shift();
        tx = tx.replace("§AV§", "");
      }
      // Un bloc peut contenir plusieurs phrases sans « / » (rare) : on le garde entier.
      const mots = tokenise(tx);
      const poids = mots.map((w) => norm(w).replace(/[^\p{L}\p{N}]/gu, "").length + 3);
      const total = poids.reduce((a, b) => a + b, 0);
      const duree = mots.length / MOTS_PAR_SECONDE;
      let tt = t;
      const motsT = mots.map((w, i) => {
        const d = (poids[i] / total) * duree;
        const r = { t: affichage(w, i === mots.length - 1), s: +tt.toFixed(3), e: +(tt + d).toFixed(3), em: false };
        tt += d;
        return r;
      });
      const finPhrase = /[.?!»]$/.test(tx) || mc.pause === "paragraphe" || mc.pause === "aucune";
      blocs.push({
        id: `s${sc.num}b${blocs.length + 1}`,
        texte: tx,
        s: +t.toFixed(3),
        e: +tt.toFixed(3),
        mots: motsT,
        pause: mc.pause,
        phrase: phraseIdx,
        paragraphe: pIdx,
        ...(noteBloc ? { aValider: noteBloc } : {}),
      });
      if (noteBloc) aValider.push({ note: noteBloc, texte: tx });
      t = tt + PAUSE[mc.pause];
      if (finPhrase) phraseIdx++;
      void mIdx;
    });
  });

  // 3. Mise en valeur : on marque les suites de mots qui correspondent.
  const flat = blocs.flatMap((b) => b.mots);
  const flatN = flat.map((w) => norm(w.t));
  for (const expr of valeur[String(sc.num)] ?? []) {
    const target = expr.split(/\s+/).map(norm);
    let found = false;
    for (let i = 0; i + target.length <= flat.length; i++) {
      if (target.every((w, k) => flatN[i + k] === w)) {
        for (let k = 0; k < target.length; k++) flat[i + k].em = true;
        found = true;
      }
    }
    if (!found) console.warn(`  ! scène ${sc.num} : « ${expr} » introuvable dans le script (mise en valeur ignorée)`);
  }

  // 4. Pages d'affichage : une phrase = une page, coupée si elle est trop longue.
  const pages = [];
  let page = null;
  blocs.forEach((b, i) => {
    const nouvellePhrase = !page || blocs[i - 1].phrase !== b.phrase;
    const tropLong =
      page && (page.blocs.length >= PAGE_BLOCS || page.car + b.texte.length > PAGE_CARACTERES);
    if (nouvellePhrase || tropLong) {
      page = { blocs: [], car: 0 };
      pages.push(page);
    }
    page.blocs.push(i);
    page.car += b.texte.length;
  });

  const fin = blocs[blocs.length - 1].e + QUEUE;
  out.push({
    num: sc.num,
    titre: sc.titre,
    cible: sc.cible,
    lead,
    queue: QUEUE,
    duree: +fin.toFixed(3),
    mots: flat.length,
    blocs,
    pages: pages.map((p) => p.blocs),
    aValider,
  });
}

// Un bloc par ligne : le fichier reste lisible et les diffs Git courts.
const serialise = (sc) => {
  const { blocs, ...rest } = sc;
  const head = JSON.stringify(rest).slice(0, -1);
  return ` ${head},"blocs":[\n${blocs.map((b) => "  " + JSON.stringify(b)).join(",\n")}\n ]}`;
};

const ts = `// FICHIER GÉNÉRÉ par scripts/timeline.mjs à partir de script/voix-off.txt.
// Ne pas modifier à la main : modifie le script puis lance « npm run timeline ».
// Temps en secondes depuis le début de la scène (rythme estimé, recalé sur la voix au rendu).

export type Mot = { t: string; s: number; e: number; em: boolean };
export type Bloc = {
  id: string;
  texte: string;
  s: number;
  e: number;
  mots: Mot[];
  pause: "petite" | "vraie" | "paragraphe" | "aucune";
  phrase: number;
  paragraphe: number;
  aValider?: string;
};
export type SceneTimeline = {
  num: number;
  titre: string;
  cible: [number, number];
  lead: number;
  queue: number;
  duree: number;
  mots: number;
  blocs: Bloc[];
  pages: number[][];
  aValider: { note: string; texte: string }[];
};

export const RYTHME = ${JSON.stringify({ motsParSeconde: MOTS_PAR_SECONDE, pauses: PAUSE })};

export const TIMELINE: SceneTimeline[] = [
${out.map(serialise).join(",\n")}
];
`;
writeFileSync(join(ROOT, "src/timeline.ts"), ts);

let total = 0;
console.log("Timeline générée (rythme estimé) :");
for (const s of out) {
  total += s.duree;
  const mmss = (x) => `${Math.floor(x / 60)}:${String(Math.round(x % 60)).padStart(2, "0")}`;
  console.log(
    `  Scène ${s.num} ${s.titre.padEnd(20)} ${String(s.mots).padStart(4)} mots  ${mmss(s.duree).padStart(5)}  (visé ${mmss(s.cible[1] - s.cible[0])})${s.aValider.length ? "  ⚠ à valider" : ""}`
  );
}
console.log(`  Total ${out.reduce((a, s) => a + s.mots, 0)} mots, ${Math.floor(total / 60)} min ${Math.round(total % 60)} s (hors transitions)`);
