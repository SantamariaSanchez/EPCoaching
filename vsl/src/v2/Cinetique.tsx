// Typographie cinétique empilée, calée mot à mot sur la voix (référence : « WHO CLAIMS THAT I AM THE one »).
// Chaque groupe de phrases devient une « page » : les mots tombent un par un au moment où ils sont dits,
// en capitales Montserrat 900 ; le mot mis en valeur (script/mise-en-valeur.json) passe en Playfair
// italique rouge, plus grand. La page précédente sort en flou avant que la suivante entre.
import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { useScene } from "../lib/scene";
import { FPS } from "../lib/resolve";
import { MONTSERRAT, PLAYFAIR } from "../lib/brand";
import { ACCENT_CLAIR, BLANC, clamp } from "./kit";

export type Zone = { x: number; y: number; w: number; h: number; align?: "gauche" | "centre" };

type MotP = { t: string; s: number; em: boolean };
type Page = { mots: MotP[]; debut: number; fin: number };

const MAX_MOTS = 7;
const ESP = 0.28; // espace entre mots (en em)

// Regroupe les blocs de la scène en pages courtes (une idée à l'écran à la fois).
const pages = (blocs: ReturnType<typeof useScene>["blocs"]): Page[] => {
  const out: { mots: MotP[] }[] = [];
  let cur: MotP[] = [];
  blocs.forEach((b, i) => {
    const mots = b.mots.map((m) => ({ t: m.t.replace(/[«»"]/g, "").trim(), s: m.s, em: m.em })).filter((m) => m.t.length > 0);
    if (cur.length > 0 && cur.length + mots.length > MAX_MOTS) {
      out.push({ mots: cur });
      cur = [];
    }
    cur.push(...mots);
    const coupe = b.pause === "vraie" || b.pause === "paragraphe" || i === blocs.length - 1;
    if (coupe || cur.length >= MAX_MOTS - 1) {
      out.push({ mots: cur });
      cur = [];
    }
  });
  if (cur.length) out.push({ mots: cur });
  return out.map((p, i) => {
    const debut = Math.round(p.mots[0].s * FPS) - 3;
    const suivant = out[i + 1];
    const fin = suivant ? Math.round(suivant.mots[0].s * FPS) - 5 : 1e7;
    return { mots: p.mots, debut, fin };
  });
};

const police = (m: MotP, taille: number) =>
  m.em
    ? { fontFamily: PLAYFAIR, fontWeight: "700", fontSize: taille * 1.12, fontStyle: "italic" as const, letterSpacing: "-0.01em" }
    : { fontFamily: MONTSERRAT, fontWeight: "900", fontSize: taille, fontStyle: "normal" as const, letterSpacing: "-0.035em" };

const texte = (m: MotP) => (m.em ? m.t : m.t.toUpperCase());

// Coupe la page en lignes à la taille donnée.
const lignes = (mots: MotP[], taille: number, largeur: number) => {
  const espace = taille * ESP;
  const out: { mots: (MotP & { w: number })[]; w: number }[] = [];
  let cur: (MotP & { w: number })[] = [];
  let w = 0;
  mots.forEach((m) => {
    const p = police(m, taille);
    const mw = measureText({ text: texte(m), fontFamily: p.fontFamily, fontSize: p.fontSize, fontWeight: p.fontWeight, letterSpacing: p.letterSpacing, fontVariantNumeric: "normal" }).width;
    if (cur.length > 0 && w + espace + mw > largeur) {
      out.push({ mots: cur, w });
      cur = [];
      w = 0;
    }
    w += (cur.length ? espace : 0) + mw;
    cur.push({ ...m, w: mw });
  });
  if (cur.length) out.push({ mots: cur, w });
  return out;
};

// Plus grande taille où la page tient en `maxLignes` lignes dans la zone.
const ajuster = (mots: MotP[], zone: Zone) => {
  for (const taille of [250, 226, 206, 188, 172, 158, 144, 132, 120, 108, 96, 86, 76]) {
    const l = lignes(mots, taille, zone.w);
    const haut = l.length * taille * 1.02;
    if (l.length <= 4 && haut <= zone.h && l.every((x) => x.w <= zone.w)) return { taille, l };
  }
  const taille = 70;
  return { taille, l: lignes(mots, taille, zone.w) };
};

export const Cinetique: React.FC<{
  zone: (debutPage: number) => Zone | null; // null : pas de texte pendant ce passage
}> = ({ zone }) => {
  const sc = useScene();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ps = useMemo(() => pages(sc.blocs), [sc.blocs]);
  const actives = ps.filter((p) => f >= p.debut - 2 && f <= p.fin + 12);
  return (
    <>
      {actives.map((p) => {
        const z = zone(p.debut);
        if (!z) return null;
        const { taille, l } = ajuster(p.mots, z);
        const hauteur = l.length * taille * 1.02;
        const y0 = z.y + (z.h - hauteur) / 2;
        const sortie = interpolate(f, [p.fin, p.fin + 10], [0, 1], clamp);
        return (
          <div
            key={p.debut}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              opacity: 1 - sortie,
              filter: sortie > 0 ? `blur(${sortie * 22}px)` : undefined,
              transform: `translateY(${-sortie * 50}px) scale(${1 - sortie * 0.05})`,
              perspective: 1200,
            }}
          >
            {l.map((ligne, li) => {
              const espace = taille * ESP;
              let x = z.align === "centre" ? z.x + (z.w - ligne.w) / 2 : z.x;
              return ligne.mots.map((m, mi) => {
                const debut = Math.round(m.s * FPS) - 3;
                const pr = spring({ frame: f - debut, fps, config: { damping: 13, mass: 0.55, stiffness: 170 } });
                const p = police(m, taille);
                const left = x;
                x += m.w + espace;
                if (f < debut - 1) return null;
                const flou = interpolate(pr, [0, 0.7, 1], [16, 3, 0], clamp);
                return (
                  <div
                    key={`${li}-${mi}`}
                    style={{
                      position: "absolute",
                      left,
                      top: y0 + li * taille * 1.02,
                      height: taille * 1.02,
                      display: "flex",
                      alignItems: "flex-end",
                      whiteSpace: "nowrap",
                      lineHeight: 1,
                      color: m.em ? ACCENT_CLAIR : BLANC,
                      ...p,
                      fontWeight: Number(p.fontWeight),
                      opacity: interpolate(pr, [0, 0.3], [0, 1], clamp),
                      filter: flou > 0.2 ? `blur(${flou}px)` : undefined,
                      transformOrigin: "50% 100%",
                      transform: `translateY(${interpolate(pr, [0, 1], [taille * 0.45, 0])}px) rotateX(${interpolate(pr, [0, 1], [55, 0])}deg) scale(${interpolate(pr, [0, 1], [m.em ? 1.4 : 1.18, 1])})`,
                      textShadow: m.em ? "0 0 50px rgba(255,60,48,0.55), 0 0 12px rgba(255,90,71,0.35)" : "0 6px 30px rgba(0,0,0,0.55)",
                    }}
                  >
                    {texte(m)}
                  </div>
                );
              });
            })}
          </div>
        );
      })}
    </>
  );
};
