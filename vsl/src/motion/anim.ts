import { Easing, interpolate, spring } from "remotion";

export const FPS = 30;
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Courbes (entrées ease-out, sorties ease-in, transitions in-out).
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  outDoux: Easing.bezier(0.22, 1, 0.36, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  expo: Easing.bezier(0.87, 0, 0.13, 1),
};

// Ressorts nommés (physique réelle : rebond léger, inertie).
export const RESSORT = {
  vif: { damping: 16, stiffness: 180, mass: 0.7 },
  souple: { damping: 20, stiffness: 120, mass: 0.9 },
  lourd: { damping: 26, stiffness: 90, mass: 1.4 },
  rebond: { damping: 11, stiffness: 160, mass: 0.6 },
  sec: { damping: 200, stiffness: 200, mass: 1 },
};

export const sp = (f: number, at = 0, cfg: keyof typeof RESSORT | (typeof RESSORT)["vif"] = "vif") =>
  spring({ frame: f - at, fps: FPS, config: typeof cfg === "string" ? RESSORT[cfg] : cfg });

export const p = (f: number, a: number, b: number, ease: (t: number) => number = E.out) =>
  interpolate(f, [a, b], [0, 1], { ...cl, easing: ease });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mix = (t: number, a: number, b: number) => a + (b - a) * t;

// Zoom à vitesse constante (espace logarithmique).
export const logZoom = (t: number, a: number, b: number) => a * Math.pow(b / a, t);

// Bruit déterministe.
export const hash = (i: number) => {
  let t = (i + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Dérive lente continue (aucun plan figé) : petite respiration de caméra.
export const derive = (f: number, amp = 1, seed = 0) => ({
  x: Math.sin(f / 47 + seed) * 6 * amp,
  y: Math.cos(f / 61 + seed * 1.7) * 4 * amp,
  r: Math.sin(f / 83 + seed * 0.7) * 0.25 * amp,
});
