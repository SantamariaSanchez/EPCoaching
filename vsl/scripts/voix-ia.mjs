// Voix off IA : découpe les prises longues (public/voix/brut/chunkN.mp3) en une piste par scène,
// cale chaque bloc du script sur la parole (silences + programmation dynamique) et écrit
//   public/voix/scene-N.mp3   la voix de la scène, pauses du script respectées
//   public/voix/scene-N.json  le temps de chaque mot (même format que npm run caler / Whisper)
//   npm run voix-ia
// Aucune transcription requise : le texte est connu, on retrouve seulement OÙ il est dit.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { TIMELINE } from "../src/timeline.ts";
import { PUBLIC } from "./scenes.mjs";

const BRUT = join(PUBLIC, "voix", "brut");
// Prises générées (vidIQ voiceover, voix ElevenLabs « Liam », multilingue) : scènes par prise.
const PRISES = [
  { fichier: "chunk1.mp3", scenes: [1, 2, 3] },
  { fichier: "chunk2.mp3", scenes: [4, 5, 6] },
  { fichier: "chunk3.mp3", scenes: [7] },
];
const SR = 44100;
// Respirations ajoutées au montage (en s), selon la pause notée dans le script.
const AIR = { aucune: 0, petite: 0.04, phrase: 0.1, vraie: 0.38, paragraphe: 0.32 };
const MARGE = 0.06; // garde avant/après la parole

const decode = (f) => {
  const buf = execFileSync("ffmpeg", ["-v", "error", "-i", f, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], {
    maxBuffer: 1 << 30,
  });
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
};

// Enveloppe RMS par pas de 10 ms -> intervalles de silence.
const silences = (pcm, seuilDb = -40, minDur = 0.13) => {
  const pas = SR / 100;
  const n = Math.floor(pcm.length / pas);
  const db = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let k = 0; k < pas; k++) {
      const v = pcm[i * pas + k];
      s += v * v;
    }
    db[i] = 10 * Math.log10(s / pas + 1e-12);
  }
  const out = [];
  let a = -1;
  for (let i = 0; i <= n; i++) {
    const calme = i < n && db[i] < seuilDb;
    if (calme && a < 0) a = i;
    if (!calme && a >= 0) {
      if ((i - a) / 100 >= minDur || a === 0 || i === n) out.push({ s: a / 100, e: i / 100 });
      a = -1;
    }
  }
  return out;
};

// Poids d'un mot ≈ nombre de syllabes (groupes de voyelles) : la parole dure à peu près ça.
const syl = (w) => Math.max(1, (w.toLowerCase().match(/[aeiouyàâäéèêëîïôöûùüœ]+/g) || []).length);
const poids = (b) => b.mots.reduce((a, m) => a + syl(m.t) + 0.35, 0);

const aligner = (blocs, sil, total) => {
  // Bornes candidates : début (-1), chaque silence k, fin (K).
  const K = sil.length;
  const t0 = sil.length && sil[0].s === 0 ? sil[0].e : 0;
  const tFin = sil.length && sil[K - 1].e >= total - 0.02 ? sil[K - 1].s : total;
  const parole = sil.reduce((a, x) => a - (x.e - x.s), total);
  const W = blocs.reduce((a, b) => a + poids(b), 0);
  const rate = parole / W; // s par unité de poids (approx.)
  const fin = (k) => (k < 0 ? t0 : k >= K ? tFin : sil[k].s);
  const deb = (k) => (k < 0 ? t0 : sil[k].e);
  const m = blocs.length;
  // dp[j][k] : blocs 0..j alignés, bloc j se termine au silence k.
  const INF = 1e18;
  const dp = Array.from({ length: m }, () => new Float64Array(K + 1).fill(INF));
  const prv = Array.from({ length: m }, () => new Int32Array(K + 1).fill(-9));
  const pj = Array.from({ length: m }, () => new Int32Array(K + 1).fill(-9));
  const penBord = { aucune: 0.05, petite: 0.4, phrase: 0.6, vraie: 1.6, paragraphe: 2.2 };
  const coutSpan = (ja, jb, ka, kb) => {
    // blocs ja..jb entre la fin du silence ka et le début du silence kb
    let w = 0;
    for (let j = ja; j <= jb; j++) w += poids(blocs[j]);
    let dur = fin(kb) - deb(ka);
    for (let k = ka + 1; k < kb; k++) dur -= sil[k].e - sil[k].s;
    if (dur <= 0.05) return INF;
    const r = Math.log(dur / (w * rate));
    let c = r * r * 6 * Math.sqrt(w);
    for (let j = ja; j < jb; j++) c += penBord[blocs[j].pause] ?? 0.5; // bornes sans silence
    for (let k = ka + 1; k < kb; k++) c += Math.max(0, (sil[k].e - sil[k].s) - 0.18) * 9; // long silence au milieu
    return c;
  };
  for (let j = 0; j < m; j++) {
    for (let jb = j; jb >= Math.max(0, j - 3); jb--) {
      // bloc jb..j forment un span; précédent span se termine au bloc jb-1
      for (let kb = 0; kb <= K; kb++) {
        if (j === m - 1 && kb !== K) continue;
        if (j < m - 1 && kb === K) continue;
        const kas = jb === 0 ? [-1] : [];
        if (jb > 0) for (let ka = Math.max(0, kb - 8); ka < kb; ka++) kas.push(ka);
        for (const ka of kas) {
          const base = jb === 0 ? 0 : dp[jb - 1][ka];
          if (base >= INF) continue;
          const c = base + coutSpan(jb, j, ka, kb);
          if (c < dp[j][kb]) {
            dp[j][kb] = c;
            prv[j][kb] = ka;
            pj[j][kb] = jb;
          }
        }
      }
    }
  }
  // Remonte le chemin -> pour chaque bloc, [début, fin] de parole.
  const spans = [];
  let j = m - 1;
  let kb = K;
  while (j >= 0) {
    const ka = prv[j][kb];
    const jb = pj[j][kb];
    spans.unshift({ ja: jb, jb: j, s: deb(ka), e: fin(kb) });
    j = jb - 1;
    kb = ka;
  }
  // Découpe chaque span en blocs, puis en mots, au prorata du poids sur le temps de parole.
  const res = blocs.map(() => null);
  for (const sp of spans) {
    const internes = sil.filter((x) => x.s > sp.s + 0.01 && x.e < sp.e - 0.01);
    const morceaux = [];
    let a = sp.s;
    for (const x of internes) {
      morceaux.push([a, x.s]);
      a = x.e;
    }
    morceaux.push([a, sp.e]);
    const tot = morceaux.reduce((s, [x, y]) => s + (y - x), 0);
    const at = (u) => {
      // u en secondes de parole depuis le début du span -> temps réel
      let r = u;
      for (const [x, y] of morceaux) {
        if (r <= y - x + 1e-9) return x + r;
        r -= y - x;
      }
      return sp.e;
    };
    const mots = [];
    for (let k = sp.ja; k <= sp.jb; k++) blocs[k].mots.forEach((mo) => mots.push({ k, mo, w: syl(mo.t) + 0.35 }));
    const W2 = mots.reduce((s, x) => s + x.w, 0);
    let u = 0;
    for (const x of mots) {
      const s = at((u / W2) * tot);
      u += x.w;
      const e = at((u / W2) * tot);
      (res[x.k] ??= []).push({ text: x.mo.t, s, e });
    }
  }
  return { res, spans };
};

mkdirSync(join(PUBLIC, "voix"), { recursive: true });
const rapport = [];
for (const prise of PRISES) {
  const src = join(BRUT, prise.fichier);
  if (!existsSync(src)) {
    console.log(`(absent) ${src}`);
    continue;
  }
  const pcm = decode(src);
  const total = pcm.length / SR;
  const sil = silences(pcm);
  const scenes = prise.scenes.map((n) => TIMELINE[n - 1]);
  const blocs = scenes.flatMap((sc) => sc.blocs.map((b) => ({ ...b, scene: sc.num })));
  const { res } = aligner(blocs, sil, total);
  for (const sc of scenes) {
    const idx = blocs.map((b, i) => (b.scene === sc.num ? i : -1)).filter((i) => i >= 0);
    // Reconstruit la piste : parole de chaque bloc + respiration selon la pause du script.
    const parts = [];
    const captions = [];
    let t = 0; // temps dans la nouvelle piste
    const zeros = (d) => new Float32Array(Math.round(d * SR));
    idx.forEach((i, n) => {
      const mots = res[i];
      const s = Math.max(0, mots[0].s - MARGE);
      const finBloc = mots[mots.length - 1].e;
      const suivant = n < idx.length - 1 ? res[idx[n + 1]][0].s : Math.min(total, finBloc + MARGE);
      // on garde le silence naturel jusqu'au bloc suivant (borné), puis on ajoute l'air du script
      const e = n < idx.length - 1 ? Math.min(suivant - MARGE, finBloc + 0.9) : Math.min(total, finBloc + MARGE + 0.05);
      const debut = t;
      parts.push(pcm.subarray(Math.round(s * SR), Math.round(Math.max(e, finBloc) * SR)));
      for (const mo of mots) captions.push({ text: mo.text, startMs: Math.round((debut + mo.s - s) * 1000), endMs: Math.round((debut + mo.e - s) * 1000) });
      t += Math.max(e, finBloc) - s;
      if (n < idx.length - 1) {
        const air = AIR[blocs[i].pause] ?? 0;
        parts.push(zeros(air));
        t += air;
      }
    });
    const len = parts.reduce((a, p) => a + p.length, 0);
    const out = new Float32Array(len);
    let o = 0;
    for (const p of parts) {
      out.set(p, o);
      o += p.length;
    }
    // micro-fondus aux raccords pour éviter les clics
    const raw = join(BRUT, `scene-${sc.num}.f32`);
    writeFileSync(raw, Buffer.from(out.buffer));
    const mp3 = join(PUBLIC, "voix", `scene-${sc.num}.mp3`);
    execFileSync("ffmpeg", [
      "-y", "-v", "error", "-f", "f32le", "-ar", String(SR), "-ac", "1", "-i", raw,
      "-af", "highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,loudnorm=I=-16:TP=-1.5:LRA=9",
      "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "160k", mp3,
    ]);
    writeFileSync(join(PUBLIC, "voix", `scene-${sc.num}.json`), JSON.stringify(captions));
    rapport.push(`scène ${sc.num} : ${(len / SR).toFixed(1)} s, ${captions.length} mots`);
  }
}
console.log(rapport.join("\n"));
