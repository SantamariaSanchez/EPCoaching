// Sons d'habillage synthétisés en code (aucune banque de sons, aucun droit) :
//   npm run sons            -> public/sfx/*.mp3
// Les recettes reprennent la palette du skill motion-reel (sfx.mjs), adaptées en fichiers séparés
// que les scènes déclenchent avec <Sfx at={…} son="whoosh" />. Tout est déterministe.
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { PUBLIC } from "./scenes.mjs";

const SR = 48000;
const TAU = Math.PI * 2;

const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
let rnd = mulberry32(1);
const gauss = () => {
  const u = Math.max(rnd(), 1e-12);
  const v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
};
const buf = (sec) => new Float32Array(Math.max(1, Math.round(sec * SR)));
const noise = (n) => Float32Array.from({ length: n }, gauss);
class Biquad {
  constructor(kind, f, q = 0.707) {
    this.kind = kind;
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
    this.set(f, q);
  }
  set(f, q = this.q) {
    this.q = q;
    const w = (TAU * Math.min(Math.max(f, 20), SR * 0.45)) / SR;
    const c = Math.cos(w);
    const al = Math.sin(w) / (2 * q);
    let b0, b1, b2;
    if (this.kind === "lp") [b0, b1, b2] = [(1 - c) / 2, 1 - c, (1 - c) / 2];
    else if (this.kind === "hp") [b0, b1, b2] = [(1 + c) / 2, -(1 + c), (1 + c) / 2];
    else [b0, b1, b2] = [al, 0, -al];
    const a0 = 1 + al;
    [this.b0, this.b1, this.b2, this.a1, this.a2] = [b0 / a0, b1 / a0, b2 / a0, (-2 * c) / a0, (1 - al) / a0];
  }
  tick(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}
const filt = (x, kind, f, q) => {
  const b = new Biquad(kind, f, q);
  for (let i = 0; i < x.length; i++) x[i] = b.tick(x[i]);
  return x;
};
const band = (x, lo, hi) => filt(filt(x, "hp", lo), "lp", hi);
const sweep = (x, kind, fc, q) => {
  const b = new Biquad(kind, fc(0), q);
  for (let i = 0; i < x.length; i++) {
    if (i % 32 === 0) b.set(fc(i / x.length), q);
    x[i] = b.tick(x[i]);
  }
  return x;
};
const add = (dst, src, g = 1, at = 0) => {
  for (let i = 0; i < src.length && at + i < dst.length; i++) dst[at + i] += g * src[i];
  return dst;
};
const mapT = (n, fn) => Float32Array.from({ length: n }, (_, i) => fn(i / SR, i));
const osc = (n, f, amp = () => 1) => {
  let ph = 0;
  return mapT(n, (t) => {
    ph += (TAU * f(t)) / SR;
    return Math.sin(ph) * amp(t);
  });
};

const P = {
  pop: () => {
    const len = 0.12, f0 = 760, f1 = 420;
    const x = osc(buf(len).length, (t) => f1 + (f0 - f1) * Math.exp(-t / (len * 0.25)), (t) => Math.exp(-t / (len * 0.35)));
    return add(x, filt(mapT(x.length, (t) => gauss() * Math.exp(-t / 0.002)), "hp", 2500), 0.3);
  },
  click: () => {
    const x = band(mapT(buf(0.03).length, (t) => gauss() * Math.exp(-t / 0.0025)), 2500, 9000);
    return add(x, osc(x.length, () => 1800, (t) => Math.exp(-t / 0.004)), 0.4);
  },
  tick: () => {
    const x = osc(buf(0.04).length, () => 2400, (t) => Math.exp(-t / 0.005));
    return add(x, filt(mapT(x.length, (t) => gauss() * Math.exp(-t / 0.001)), "hp", 5000), 0.2);
  },
  thud: () => {
    const len = 0.4;
    const x = osc(buf(len).length, (t) => 50 + 110 * Math.exp(-t / 0.04), (t) => Math.exp(-t / (len * 0.4)));
    add(x, band(mapT(x.length, (t) => gauss() * Math.exp(-t / 0.05)), 250, 1400), 0.5);
    return x.map((v) => Math.tanh(2 * v));
  },
  whoosh: () => {
    const len = 0.55, pk = 0.6;
    const x = sweep(noise(buf(len).length), "bp", (p) => 400 * (3000 / 400) ** p, 1.1);
    return x.map((v, i) => {
      const p = i / x.length;
      return v * (p < pk ? (p / pk) ** 2 : ((1 - p) / (1 - pk)) ** 1.5);
    });
  },
  swoosh: () => {
    const len = 0.85, pk = 0.55;
    const x = sweep(noise(buf(len).length), "bp", (p) => 200 * (4500 / 200) ** p, 0.9);
    const sub = osc(x.length, (t) => 60 + 40 * (t / len), (t) => Math.sin(Math.PI * Math.min(1, t / len)) * 0.4);
    return x.map((v, i) => {
      const p = i / x.length;
      return v * (p < pk ? (p / pk) ** 2 : ((1 - p) / (1 - pk)) ** 1.5) + sub[i];
    });
  },
  riser: () => {
    const len = 1.4, n = buf(len).length;
    const nz = sweep(noise(n), "bp", (p) => 250 * 30 ** p, 2);
    const tone = osc(n, (t) => 160 * 5 ** ((t / len) ** 1.6) * 2, () => 0.18);
    return mapT(n, (t, i) => (nz[i] * 0.8 + tone[i]) * (t / len) ** 2.2 * (1 - Math.exp(-(len - t) / 0.004)));
  },
  crash: (len = 1.4) => {
    const n = buf(len).length;
    const x = filt(noise(n), "hp", 3500);
    const fs = [2733, 3471, 4389, 5812, 7123, 8290].map((f) => [f, rnd() * 6]);
    return mapT(n, (t, i) => {
      let v = x[i];
      for (const [f, ph] of fs) v += 0.15 * Math.sin(TAU * f * t + ph) * Math.sin(TAU * f * 1.414 * t);
      return v * Math.exp(-t / (len * 0.45)) * (1 - Math.exp(-t / 0.002));
    });
  },
  impact: () => {
    const sub = osc(buf(1.2).length, (t) => 32 + 45 * Math.exp(-t / 0.25), (t) => Math.exp(-t / 0.5) * (1 - Math.exp(-t / 0.003))).map((v) => Math.tanh(1.8 * v));
    add(sub, P.thud(), 0.6);
    add(sub, P.crash(1.2), 0.18);
    return sub;
  },
  bell: () => {
    const f = 1174.66, len = 1.1;
    const parts = [[1, 1, 0.5], [2.76, 0.4, 0.2], [5.4, 0.2, 0.08]];
    return mapT(buf(len).length, (t) => parts.reduce((s, [r, a, d]) => s + a * Math.sin(TAU * f * r * t) * Math.exp(-t / d), 0) * (1 - Math.exp(-t / 0.0006)));
  },
  type: () => {
    const x = buf(0.6);
    for (let k = 0; k < 9; k++) add(x, P.click(), 0.6 + 0.4 * (k % 3 === 0), Math.round((k / 9) * 0.5 * SR));
    return x;
  },
};

const out = join(PUBLIC, "sfx");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
let k = 0;
for (const [nom, fn] of Object.entries(P)) {
  if (nom === "crash") continue;
  rnd = mulberry32(1000 + k++);
  const x = fn();
  let peak = 0;
  for (const v of x) peak = Math.max(peak, Math.abs(v));
  const g = 0.89 / (peak || 1);
  // Queue de 60 ms et fondu de sortie pour éviter tout clic.
  const n = x.length + Math.round(0.06 * SR);
  const pcm = Buffer.alloc(n * 2);
  for (let i = 0; i < n; i++) {
    const v = i < x.length ? x[i] * g * Math.min(1, (x.length - i) / (0.01 * SR)) : 0;
    pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * 32767))), i * 2);
  }
  const raw = join(out, `${nom}.raw`);
  writeFileSync(raw, pcm);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "s16le", "-ar", String(SR), "-ac", "1", "-i", raw, "-ac", "2", "-b:a", "160k", join(out, `${nom}.mp3`)]);
  rmSync(raw);
}
console.log(`Sons d'habillage prêts dans public/sfx/ (${Object.keys(P).length - 1} fichiers).`);
