// Musique de fond originale, synthétisée en code (aucun droit d'auteur tiers) :
//   npm run musique   -> public/musique-generee.mp3
// Ré mineur, 92 BPM, progression i, VI, III, VII (Dm, Bb, F, C) sur 8 mesures.
// La longueur et l'arrangement suivent les scènes (durées réelles, voix off comprise si
// elle est déposée) : plus dense pendant le problème et le système, plus léger à la bifurcation,
// résolution sur l'accord final. Mixée pour rester sous la voix (la VSL la joue à bas volume).
// Si tu déposes ta propre public/musique.mp3, elle remplace celle-ci.
import { writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { PUBLIC, FPS, debutsScenes, scenesResolues } from "./scenes.mjs";

const SR = 44100;
const TAU = Math.PI * 2;
const BPM = 92;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const LOOP = BAR * 8;
const NL = Math.round(LOOP * SR);

const scenes = scenesResolues();
const { debuts, total } = debutsScenes(scenes);
const DUREE = total / FPS + 1.5;
const N = Math.round(DUREE * SR);

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
// Accords (MIDI) sur 2 mesures chacun.
const ACCORDS = [
  { root: 38, notes: [50, 53, 57, 62] }, // Dm
  { root: 34, notes: [46, 50, 53, 58] }, // Bb
  { root: 41, notes: [48, 53, 57, 60] }, // F
  { root: 36, notes: [48, 52, 55, 60] }, // C
];

let seed = 7;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

// Table de sinus pour aller vite.
const TS = 8192;
const SIN = Float32Array.from({ length: TS + 1 }, (_, i) => Math.sin((i / TS) * TAU));
const sinp = (ph) => SIN[Math.floor((ph - Math.floor(ph)) * TS)];

// Chaque couche est rendue sur 2 boucles puis on garde la seconde : la boucle est sans couture.
const couche = (fn) => {
  const L = new Float32Array(NL * 2);
  const R = new Float32Array(NL * 2);
  fn(L, R, NL * 2);
  // La seconde boucle contient les queues des notes de la première : elle se répète sans couture.
  return [L.slice(NL), R.slice(NL)];
};

const env = (t, a, d, len) => Math.min(1, t / a) * Math.min(1, Math.max(0, (len - t) / d));

// Nappe : harmoniques douces, légèrement désaccordées, attaque lente.
const pad = couche((L, R, n) => {
  const dur = BAR * 2;
  for (let c = 0; c < 16; c++) {
    const ac = ACCORDS[c % 4];
    const t0 = c * dur;
    const len = dur + 1.6;
    const i0 = Math.round(t0 * SR);
    ac.notes.forEach((m, k) => {
      [-5, 5].forEach((cents, v) => {
        const f = hz(m) * 2 ** (cents / 1200);
        const pan = v ? 0.65 : 0.35;
        for (let i = 0; i < len * SR && i0 + i < n; i++) {
          const t = i / SR;
          const e = env(t, 0.9, 1.5, len) * 0.06;
          let s = 0;
          for (let h = 1; h <= 7; h++) s += sinp(f * h * t + k * 0.13 + v * 0.31) / h ** 1.6;
          const val = s * e * (1 + 0.15 * Math.sin(TAU * 0.11 * (t0 + t)));
          L[i0 + i] += val * (1 - pan) * 1.4;
          R[i0 + i] += val * pan * 1.4;
        }
      });
    });
  }
});

// Basse : fondamentale + octave, une note par accord, pompe sur chaque temps.
const basse = couche((L, R, n) => {
  const dur = BAR * 2;
  for (let c = 0; c < 16; c++) {
    const f = hz(ACCORDS[c % 4].root);
    const i0 = Math.round(c * dur * SR);
    for (let i = 0; i < dur * SR && i0 + i < n; i++) {
      const t = i / SR;
      const tb = (t % BEAT) / BEAT;
      const pompe = 0.35 + 0.65 * Math.min(1, tb * 3.2);
      const e = env(t, 0.02, 0.08, dur) * pompe * 0.2;
      const val = (sinp(f * t) + 0.35 * sinp(2 * f * t) + 0.1 * sinp(3 * f * t)) * e;
      L[i0 + i] += val;
      R[i0 + i] += val;
    }
  }
});

// Arpège pincé en croches, panoramique alterné.
const arpege = couche((L, R, n) => {
  const motif = [0, 2, 1, 3, 2, 1, 3, 2];
  const croche = BEAT / 2;
  for (let s = 0; s < 128; s++) {
    const ac = ACCORDS[Math.floor(s / 16) % 4];
    const m = ac.notes[motif[s % 8]] + 12;
    const f = hz(m);
    const t0 = s * croche;
    const i0 = Math.round(t0 * SR);
    const vel = s % 8 === 0 ? 1 : s % 2 === 0 ? 0.75 : 0.55;
    const pan = s % 2 ? 0.7 : 0.3;
    for (let i = 0; i < 0.9 * SR && i0 + i < n; i++) {
      const t = i / SR;
      const e = Math.exp(-t / 0.22) * (1 - Math.exp(-t / 0.002)) * 0.08 * vel;
      const val = (sinp(f * t) + 0.3 * sinp(2 * f * t) * Math.exp(-t / 0.05) + 0.12 * sinp(3.01 * f * t) * Math.exp(-t / 0.03)) * e;
      L[i0 + i] += val * (1 - pan) * 1.4;
      R[i0 + i] += val * pan * 1.4;
    }
  }
});

// Grosse caisse douce sur les temps 1 et 3.
const kick = couche((L, R, n) => {
  for (let b = 0; b < 64; b++) {
    if (b % 2) continue;
    const i0 = Math.round(b * BEAT * SR);
    let ph = 0;
    for (let i = 0; i < 0.45 * SR && i0 + i < n; i++) {
      const t = i / SR;
      ph += (45 + 70 * Math.exp(-t / 0.035)) / SR;
      const val = Math.tanh(1.6 * sinp(ph) * Math.exp(-t / 0.16)) * 0.32;
      L[i0 + i] += val;
      R[i0 + i] += val;
    }
  }
});

// Charleston fermé sur les contretemps (bruit filtré très court).
const hat = couche((L, R, n) => {
  for (let s = 0; s < 128; s++) {
    if (s % 2 === 0) continue;
    const i0 = Math.round(s * (BEAT / 2) * SR);
    let y1 = 0;
    let x1 = 0;
    for (let i = 0; i < 0.05 * SR && i0 + i < n; i++) {
      const t = i / SR;
      const x = rnd() * 2 - 1;
      const y = 0.75 * (y1 + x - x1); // passe-haut simple
      x1 = x;
      y1 = y;
      const val = y * Math.exp(-t / 0.012) * 0.06;
      L[i0 + i] += val * 0.8;
      R[i0 + i] += val * 1.1;
    }
  }
});

// Halo aigu (octave 5) pour les moments forts.
const halo = couche((L, R, n) => {
  const dur = BAR * 2;
  for (let c = 0; c < 16; c++) {
    const ac = ACCORDS[c % 4];
    const i0 = Math.round(c * dur * SR);
    const len = dur + 1.2;
    [ac.notes[1] + 24, ac.notes[2] + 24].forEach((m, k) => {
      const f = hz(m);
      for (let i = 0; i < len * SR && i0 + i < n; i++) {
        const t = i / SR;
        const e = env(t, 1.2, 1.2, len) * 0.022 * (1 + 0.3 * Math.sin(TAU * 4.5 * t));
        const val = sinp(f * t + k * 0.5) * e;
        L[i0 + i] += val * (k ? 0.4 : 1);
        R[i0 + i] += val * (k ? 1 : 0.4);
      }
    });
  }
});

// Intensités par scène : [nappe, basse, arpège, caisse, charleston, halo].
const NIVEAUX = {
  1: [0.8, 0.55, 0.0, 0.0, 0.0, 0.0],
  2: [0.75, 0.7, 0.55, 0.0, 0.0, 0.0],
  3: [0.65, 0.85, 0.7, 0.7, 0.4, 0.0],
  4: [0.7, 0.9, 0.8, 0.85, 0.6, 0.6],
  5: [0.85, 0.6, 0.55, 0.25, 0.0, 0.3],
  6: [0.7, 0.85, 0.7, 0.8, 0.5, 0.45],
  7: [0.9, 0.7, 0.45, 0.35, 0.2, 0.7],
};
const couches = [pad, basse, arpege, kick, hat, halo];
const debutsS = debuts.map((d) => d / FPS);
const niveau = (t, k) => {
  // Fondu de 2 s autour de chaque changement de scène.
  let idx = 0;
  for (let i = 0; i < debutsS.length; i++) if (t >= debutsS[i]) idx = i;
  const cur = NIVEAUX[idx + 1][k];
  const prev = idx > 0 ? NIVEAUX[idx][k] : cur;
  const r = Math.min(1, (t - debutsS[idx]) / 2);
  return prev + (cur - prev) * r;
};

const L = new Float32Array(N);
const R = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const j = i % NL;
  let l = 0;
  let r = 0;
  for (let k = 0; k < couches.length; k++) {
    const g = niveau(t, k);
    if (g <= 0.001) continue;
    l += couches[k][0][j] * g;
    r += couches[k][1][j] * g;
  }
  // Entrée et sortie en fondu.
  const fade = Math.min(1, t / 1.5) * Math.min(1, Math.max(0, (DUREE - t) / 4));
  L[i] = l * fade;
  R[i] = r * fade;
}

// Réverbération légère (filtres en peigne), pour fondre le tout.
const verb = (x) => {
  const out = new Float32Array(x.length);
  for (const d of [1557, 1617, 1491, 1422, 1277, 1356]) {
    const b = new Float32Array(d);
    let idx = 0;
    let store = 0;
    for (let i = 0; i < x.length; i++) {
      const o = b[idx];
      store = o * 0.7 + store * 0.3;
      b[idx] = x[i] + store * 0.78;
      out[i] += o * 0.12;
      idx = (idx + 1) % d;
    }
  }
  return out;
};
const vl = verb(L);
const vr = verb(R);
let peak = 0;
for (let i = 0; i < N; i++) {
  L[i] = L[i] * 0.8 + vl[i] * 0.35;
  R[i] = R[i] * 0.8 + vr[i] * 0.35;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const g = 0.7 / (peak || 1);
const pcm = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  pcm.writeInt16LE(Math.round(Math.tanh(L[i] * g) * 32767), i * 4);
  pcm.writeInt16LE(Math.round(Math.tanh(R[i] * g) * 32767), i * 4 + 2);
}
const raw = join(PUBLIC, "musique-generee.raw");
writeFileSync(raw, pcm);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "s16le", "-ar", String(SR), "-ac", "2", "-i", raw, "-b:a", "192k", join(PUBLIC, "musique-generee.mp3")]);
rmSync(raw);
console.log(`Musique prête : public/musique-generee.mp3 (${Math.floor(DUREE / 60)} min ${Math.round(DUREE % 60)} s, ${BPM} BPM, Ré mineur).`);
