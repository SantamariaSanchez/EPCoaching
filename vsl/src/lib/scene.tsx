import React, { createContext, useContext } from "react";
import { Easing, interpolate } from "remotion";
import { FPS, SceneResolue } from "./resolve";

// ── Contexte de scène : donne accès aux temps de parole (calés sur la voix si elle existe).
const Ctx = createContext<SceneResolue | null>(null);
export const SceneProvider: React.FC<{ scene: SceneResolue; children: React.ReactNode }> = ({ scene, children }) => (
  <Ctx.Provider value={scene}>{children}</Ctx.Provider>
);
export const useScene = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useScene() hors d'une scène");
  return s;
};

const n = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[ \s]+/g, " ")
    .replace(/[«»".,;:!?()]/g, "")
    .trim();

// Repères visuels : on vise un passage du script par son texte, pas par un numéro.
// Si le script change, l'image suit la phrase ; si la phrase disparaît, l'erreur le dit.
export const useCues = () => {
  const sc = useScene();
  const trouve = (texte: string, nth = 0) => {
    const t = n(texte);
    const hits = sc.blocs.filter((b) => n(b.mots.map((m) => m.t).join(" ")).includes(t));
    const b = hits[nth];
    if (!b) throw new Error(`Scène ${sc.num} : repère « ${texte} » introuvable dans le script.`);
    return b;
  };
  // Début (en frames) du bloc qui contient le texte.
  const cue = (texte: string, nth = 0) => Math.round(trouve(texte, nth).s * FPS);
  // Fin du bloc.
  const fin = (texte: string, nth = 0) => Math.round(trouve(texte, nth).e * FPS);
  // Début exact d'un mot ou d'une expression à l'intérieur de son bloc.
  const mot = (texte: string, nth = 0) => {
    const t = n(texte);
    let count = 0;
    for (const b of sc.blocs) {
      const ws = b.mots.map((m) => n(m.t));
      const first = t.split(" ");
      for (let i = 0; i + first.length <= ws.length; i++) {
        if (first.every((w, k) => ws[i + k] === w)) {
          if (count === nth) return Math.round(b.mots[i].s * FPS);
          count++;
        }
      }
    }
    throw new Error(`Scène ${sc.num} : mot « ${texte} » introuvable dans le script.`);
  };
  return { cue, fin, mot, total: sc.dureeFrames, lead: Math.round(sc.lead * FPS) };
};

// ── Mises en page : où va le texte, où va l'image.
export type Layout = "plein" | "gauche" | "droite" | "bas" | "haut" | "centre" | "pied";
export type Rect = { x: number; y: number; w: number; h: number };

export const TEXTE: Record<Layout, Rect & { max: number; align: "left" | "center"; v: "center" | "end" | "start" }> = {
  plein: { x: 190, y: 190, w: 1540, h: 660, max: 150, align: "left", v: "center" },
  centre: { x: 230, y: 230, w: 1460, h: 620, max: 140, align: "center", v: "center" },
  gauche: { x: 150, y: 170, w: 820, h: 740, max: 122, align: "left", v: "center" },
  droite: { x: 1010, y: 170, w: 790, h: 740, max: 122, align: "left", v: "center" },
  bas: { x: 190, y: 800, w: 1540, h: 200, max: 76, align: "left", v: "end" },
  haut: { x: 190, y: 84, w: 1540, h: 290, max: 92, align: "left", v: "start" },
  pied: { x: 260, y: 820, w: 1400, h: 170, max: 76, align: "center", v: "end" },
};

export const ZONE: Record<Layout, Rect> = {
  plein: { x: 0, y: 0, w: 1920, h: 1080 },
  centre: { x: 0, y: 0, w: 1920, h: 1080 },
  gauche: { x: 1010, y: 70, w: 840, h: 940 },
  droite: { x: 70, y: 70, w: 880, h: 940 },
  bas: { x: 110, y: 70, w: 1700, h: 700 },
  haut: { x: 110, y: 390, w: 1700, h: 640 },
  pied: { x: 110, y: 70, w: 1700, h: 700 },
};

// ── Courbes.
export const EASE = Easing.bezier(0.16, 1, 0.3, 1); // sortie douce, attaque franche
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const SPRING = Easing.spring({ damping: 200 });
export const BOUNCE = Easing.spring({ damping: 14, mass: 0.6 });

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Progression 0→1 entre deux frames, avec courbe.
export const prog = (f: number, a: number, b: number, easing = EASE) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing });

// Clés successives [frame, valeur] avec la même courbe entre chaque clé.
export const kf = (f: number, keys: [number, number][], easing = EASE_IO) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) {
      const [a, va] = keys[i - 1];
      const [b, vb] = keys[i];
      return interpolate(f, [a, b], [va, vb], { ...clamp, easing });
    }
  }
  return keys[keys.length - 1][1];
};

// Zoom en espace logarithmique : vitesse de travelling constante.
export const logZoom = (p: number, a: number, b: number) => a * Math.pow(b / a, p);

// Bruit déterministe (jamais Math.random : chaque frame doit être reproductible).
export const hash = (i: number) => {
  let t = (i + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
