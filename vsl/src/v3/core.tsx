import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONTSERRAT, blancA, rougeA } from "../lib/brand";

// VSL v3 (16/11/2026) : moteur volontairement simple et rapide.
// Règles : uniquement des transformations 2D (pas de flou, pas de backdrop-filter, pas de 3D),
// entrées courtes (4 à 9 images), coupes franches, un seul visuel à la fois.

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Ressort rapide et sec (arrive en ~6 images, sans rebond mou). */
export const pop = (f: number, fps: number, delay = 0, dur = 8) =>
  spring({ frame: f - delay, fps, config: { damping: 18, stiffness: 260, mass: 0.6 }, durationInFrames: dur });

export const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

/** Fond : noir chaud, halo rouge qui dérive, grain. Coûte presque rien au rendu. */
export const Fond: React.FC<{ teinte?: number }> = ({ teinte = 0 }) => {
  const f = useCurrentFrame();
  const x = 50 + Math.sin(f / 90 + teinte) * 18;
  const y = 40 + Math.cos(f / 110 + teinte) * 14;
  return (
    <AbsoluteFill style={{ backgroundColor: C.noir }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${x}% ${y}%, ${rougeA(0.22)} 0%, ${rougeA(0.06)} 45%, transparent 75%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${blancA(0.035)} 1px, transparent 1px), linear-gradient(90deg, ${blancA(0.035)} 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `${(f * 0.6) % 120}px 0px`,
        }}
      />
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("textures/grain.png")})`, opacity: 0.08, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)" }} />
    </AbsoluteFill>
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
