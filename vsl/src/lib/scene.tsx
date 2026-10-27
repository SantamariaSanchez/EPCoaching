import React, { createContext, useContext } from "react";
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
