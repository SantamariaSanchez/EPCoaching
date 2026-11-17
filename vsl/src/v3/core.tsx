import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONTSERRAT, blancA, rougeA } from "../lib/brand";
import { noise2D } from "@remotion/noise";

// VSL v3 (16/11/2026) : moteur volontairement simple et rapide.
// Règles : uniquement des transformations 2D (pas de flou, pas de backdrop-filter, pas de 3D),
// entrées courtes (4 à 9 images), coupes franches, un seul visuel à la fois.

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Ressort rapide et sec (arrive en ~6 images, sans rebond mou). */
export const pop = (f: number, fps: number, delay = 0, dur = 8) =>
  spring({ frame: f - delay, fps, config: { damping: 18, stiffness: 260, mass: 0.6 }, durationInFrames: dur });

export const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

/** Fond vivant : trois lumières qui dérivent (bruit organique), poussière lumineuse
 *  qui monte, grille qui défile, grain, vignette. Aucun flou CSS : rendu rapide. */
const PARTICULES = Array.from({ length: 34 }, (_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 61.8) % 100,
  s: 2 + ((i * 7) % 5),
  v: 0.25 + ((i * 13) % 10) / 22,
  a: 0.18 + ((i * 11) % 10) / 28,
}));
export const Fond: React.FC<{ teinte?: number; energie?: number }> = ({ teinte = 0, energie = 0 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const blob = (k: number) => ({
    x: 50 + noise2D(`bx${k}${teinte}`, t * 0.08, 0) * 38,
    y: 50 + noise2D(`by${k}${teinte}`, 0, t * 0.08) * 32,
  });
  const b1 = blob(1), b2 = blob(2), b3 = blob(3);
  return (
    <AbsoluteFill style={{ backgroundColor: C.noir, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(40% 50% at ${b1.x}% ${b1.y}%, ${rougeA(0.34 + energie * 0.2)} 0%, transparent 70%)`,
            `radial-gradient(35% 45% at ${b2.x}% ${b2.y}%, rgba(253,196,196,${0.1 + energie * 0.08}) 0%, transparent 70%)`,
            `radial-gradient(50% 60% at ${b3.x}% ${b3.y}%, rgba(137,4,4,0.45) 0%, transparent 75%)`,
          ].join(","),
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${blancA(0.03)} 1px, transparent 1px), linear-gradient(90deg, ${blancA(0.03)} 1px, transparent 1px)`,
          backgroundSize: "96px 96px",
          backgroundPosition: `0px ${(f * 0.8) % 96}px`,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {PARTICULES.map((p, i) => {
        const y = (p.y - t * p.v * 6 + 200) % 110 - 5;
        const x = p.x + Math.sin(t * 0.6 + i) * 1.2;
        return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: p.s, height: p.s, borderRadius: p.s, background: i % 4 === 0 ? "#FDC4C4" : C.rouge, opacity: p.a, boxShadow: `0 0 ${p.s * 4}px ${rougeA(0.6)}` }} />;
      })}
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("textures/grain.png")})`, opacity: 0.07, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Onde de choc (anneau qui s'ouvre) : ponctue un mot clé. */
export const Onde: React.FC<{ at: number; x?: number; y?: number; taille?: number }> = ({ at, x = 50, y = 50, taille = 900 }) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < 0 || d > 22) return null;
  const p = ease(d, 0, 22);
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: taille, height: taille, marginLeft: -taille / 2, marginTop: -taille / 2, borderRadius: "50%", border: `${6 * (1 - p) + 1}px solid ${rougeA(0.7 * (1 - p))}`, transform: `scale(${0.15 + p * 0.85})` }} />
  );
};

/** Grand mot en contour qui défile derrière la scène (profondeur, rythme). */
export const Defile: React.FC<{ texte: string }> = ({ texte }) => {
  const f = useCurrentFrame();
  const mot = `${texte.toUpperCase()} · `;
  return (
    <div style={{ position: "absolute", top: 610, left: 0, whiteSpace: "nowrap", transform: `translateX(${-((f * 2.2) % 2400)}px) rotate(-4deg)`, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 300, letterSpacing: -10, color: "transparent", WebkitTextStroke: `2px ${rougeA(0.16)}` }}>
      {mot.repeat(8)}
    </div>
  );
};

export const Logo: React.FC<{ size?: number }> = ({ size = 70 }) => (
  <Img src={staticFile("img/logo.png")} style={{ height: size, width: "auto" }} />
);

/** Petite étiquette de chapitre en haut à gauche. */
export const Chapitre: React.FC<{ texte: string; num: number }> = ({ texte, num }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(f, fps, 2);
  return (
    <div style={{ position: "absolute", top: 54, left: 70, display: "flex", alignItems: "center", gap: 16, opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
      <div style={{ width: 10, height: 10, borderRadius: 5, background: C.rouge }} />
      <span style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: blancA(0.55), textTransform: "uppercase" }}>
        {String(num).padStart(2, "0")} · {texte}
      </span>
    </div>
  );
};

/** Barre de progression fine en bas (donne envie de rester). */
export const Progression: React.FC<{ part: number }> = ({ part }) => (
  <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: "100%", background: blancA(0.06) }}>
    <div style={{ height: "100%", width: `${Math.max(0, Math.min(1, part)) * 100}%`, background: C.rouge }} />
  </div>
);
