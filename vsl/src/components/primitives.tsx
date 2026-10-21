import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { getStaticFiles } from "remotion";
import { C, MONTSERRAT, blancA } from "../lib/brand";
import { EASE, EASE_IN, EASE_IO, clamp, logZoom, prog } from "../lib/scene";

// ── Photo réelle d'Emmanuel, étalonnée rouge et noir, révélée par un masque.
export const Photo: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  at?: number;
  fin?: number;
  pos?: string;
  zoom?: [number, number];
  dir?: "haut" | "gauche" | "droite" | "bas";
  rot?: number;
  grade?: number;
  r?: number;
}> = ({ src, x, y, w, h, at = 0, fin, pos = "50% 30%", zoom = [1.14, 1.0], dir = "haut", rot = 0, grade = 1, r = 8 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 22, EASE);
  const out = fin !== undefined ? prog(f, fin, fin + 12, EASE_IN) : 0;
  if (p <= 0 || out >= 1) return null;
  const k = Math.min(1, Math.max(0, (f - at) / 240));
  const s = logZoom(k, zoom[0], zoom[1]);
  const clip = 100 * (1 - p) + 100 * out;
  const inset =
    dir === "haut"
      ? `${clip}% 0 0 0`
      : dir === "bas"
        ? `0 0 ${clip}% 0`
        : dir === "gauche"
          ? `0 ${clip}% 0 0`
          : `0 0 0 ${clip}%`;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        clipPath: `inset(${inset} round ${r}px)`,
        rotate: `${rot}deg`,
        boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
      }}
    >
      <Img
        src={staticFile(`img/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          scale: `${s}`,
          filter: `saturate(${1 - 0.45 * grade}) contrast(${1 + 0.12 * grade}) brightness(${1 - 0.08 * grade})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(39,1,1,0) 45%, rgba(13,0,0,${0.75 * grade}) 100%)`,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: C.rougeFonce, mixBlendMode: "color", opacity: 0.32 * grade }} />
    </div>
  );
};

// ── Pastille : étiquette, case cochée ou carte barrée (codes des carrousels EP).
export const Chip: React.FC<{
  texte: string;
  at: number;
  x: number;
  y: number;
  variante?: "plein" | "check" | "barre" | "contour" | "sombre";
  size?: number;
  fin?: number;
  barreAt?: number;
  from?: "bas" | "gauche" | "droite";
  anchor?: "left" | "center" | "right";
}> = ({ texte, at, x, y, variante = "sombre", size = 40, fin, barreAt, from = "bas", anchor = "left" }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, EASE);
  const out = fin !== undefined ? prog(f, fin, fin + 10, EASE_IN) : 0;
  if (p <= 0 || out >= 1) return null;
  const barre = barreAt !== undefined ? prog(f, barreAt, barreAt + 10, EASE) : 0;
  const dx = from === "gauche" ? -40 : from === "droite" ? 40 : 0;
  const dy = from === "bas" ? 36 : 0;
  const bg =
    variante === "plein"
      ? C.rouge
      : variante === "check"
        ? "rgba(39,1,1,0.92)"
        : variante === "contour"
          ? "rgba(13,0,0,0.4)"
          : "rgba(39,1,1,0.88)";
  const border =
    variante === "check" || variante === "contour" ? `2px solid ${C.rouge}` : variante === "plein" ? "none" : "2px solid rgba(245,237,237,0.10)";
  const ancre = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0%";
  return (
    <div
      className="verre"
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `calc(${ancre} + ${(1 - p) * dx}px) ${(1 - p) * dy + out * -20}px`,
        transform: `perspective(900px) rotateX(${(1 - p) * -55}deg)`,
        transformOrigin: "50% 100%",
        opacity: p * (1 - out),
        display: "flex",
        alignItems: "center",
        gap: size * 0.4,
        padding: `${size * 0.42}px ${size * 0.7}px`,
        borderRadius: size * 0.4,
        background: bg,
        border,
        fontFamily: MONTSERRAT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.025em",
        color: variante === "barre" ? blancA(0.55 + 0.45 * (1 - barre)) : C.blanc,
        whiteSpace: "nowrap",
        boxShadow: "0 24px 50px rgba(0,0,0,0.45)",
      }}
    >
      {variante === "check" ? <Coche size={size * 0.9} p={prog(f, at + 6, at + 18, EASE)} /> : null}
      {variante === "barre" && barre > 0 ? <Croix size={size * 0.8} p={barre} /> : null}
      <span style={{ position: "relative" }}>
        {texte}
        {variante === "barre" ? (
          <span
            style={{
              position: "absolute",
              left: -6,
              right: -6,
              top: "52%",
              height: Math.max(4, size * 0.09),
              background: C.rouge,
              transformOrigin: "left center",
              scale: `${barre} 1`,
            }}
          />
        ) : null}
      </span>
    </div>
  );
};

export const Coche: React.FC<{ size: number; p: number; color?: string }> = ({ size, p, color = C.rouge }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="11" fill={color} opacity={Math.min(1, p * 2)} />
    <path
      d="M6.5 12.5l3.6 3.6 7.4-8"
      fill="none"
      stroke={C.blanc}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="18"
      strokeDashoffset={18 * (1 - p)}
    />
  </svg>
);

export const Croix: React.FC<{ size: number; p: number }> = ({ size, p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="11" fill="none" stroke={C.rouge} strokeWidth="2" opacity={p} />
    <path d="M8 8l8 8M16 8l-8 8" stroke={C.rouge} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="12" strokeDashoffset={12 * (1 - p)} />
  </svg>
);

// ── Compteur animé (chiffres tabulaires, ne « danse » pas).
export const Compteur: React.FC<{
  de?: number;
  a: number;
  at: number;
  duree?: number;
  size?: number;
  suffixe?: string;
  prefixe?: string;
  decimales?: number;
  couleur?: string;
  style?: React.CSSProperties;
}> = ({ de = 0, a, at, duree = 40, size = 220, suffixe = "", prefixe = "", decimales = 0, couleur = C.blanc, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + duree, EASE_IO);
  const v = de + (a - de) * p;
  const txt = v.toFixed(decimales).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (
    <div
      style={{
        fontFamily: MONTSERRAT,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "-0.05em",
        lineHeight: 0.9,
        color: couleur,
        fontVariantNumeric: "tabular-nums",
        opacity: prog(f, at - 4, at + 6, EASE),
        ...style,
      }}
    >
      {prefixe}
      {txt}
      {suffixe}
    </div>
  );
};

// ── Losange, motif de la marque (le ◆ sous « EP »).
export const Losange: React.FC<{ size: number; x: number; y: number; p?: number; contour?: boolean; color?: string; rot?: number }> = ({
  size,
  x,
  y,
  p = 1,
  contour = false,
  color = C.rouge,
  rot = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      rotate: `${45 + rot}deg`,
      scale: `${p}`,
      background: contour ? "transparent" : color,
      border: contour ? `3px solid ${color}` : undefined,
    }}
  />
);

// ── Entrée/sortie d'un bloc visuel. Chaque entrée a une direction et un poids.
export type Entree = "monte" | "gauche" | "droite" | "zoom" | "volet" | "aucune";
export const Bloc: React.FC<{
  at?: number;
  fin?: number;
  entree?: Entree;
  sortie?: Entree;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at = 0, fin, entree = "monte", sortie = "monte", children, style }) => {
  const f = useCurrentFrame();
  const p = entree === "aucune" ? 1 : prog(f, at, at + 20, EASE);
  const o = fin !== undefined && sortie !== "aucune" ? prog(f, fin, fin + 12, EASE_IN) : 0;
  if (p <= 0 || o >= 1) return null;
  const t = (e: Entree, v: number, s: 1 | -1) =>
    e === "monte" ? `0 ${v * 70 * s}px` : e === "gauche" ? `${-v * 120 * s}px 0` : e === "droite" ? `${v * 120 * s}px 0` : "0 0";
  const sc = (entree === "zoom" ? 0.88 + 0.12 * p : 1) * (sortie === "zoom" ? 1 + 0.08 * o : 1);
  const clip = entree === "volet" ? `inset(0 ${100 - p * 100}% 0 0)` : sortie === "volet" && o > 0 ? `inset(0 0 0 ${o * 100}%)` : undefined;
  const tin = t(entree, 1 - p, 1);
  const tout = t(sortie, o, -1);
  return (
    <AbsoluteFill
      style={{
        opacity: (entree === "volet" ? 1 : p) * (sortie === "volet" ? 1 : 1 - o),
        translate: o > 0 ? tout : tin,
        scale: `${sc}`,
        clipPath: clip,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ── Volet rouge : une lame traverse l'écran et révèle le plan suivant (moments clés).
export const VoletRouge: React.FC<{ at: number; duree?: number; sens?: 1 | -1 }> = ({ at, duree = 16, sens = 1 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + duree], [0, 1], { ...clamp, easing: EASE_IO });
  if (p <= 0 || p >= 1) return null;
  const x = sens === 1 ? -60 + p * 220 : 160 - p * 220;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -200,
          bottom: -200,
          left: `${x}%`,
          width: "34%",
          rotate: "14deg",
          background: `linear-gradient(90deg, rgba(176,2,2,0) 0%, ${C.rougeMoyen} 18%, ${C.rouge} 50%, ${C.rougeMoyen} 82%, rgba(176,2,2,0) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ── Sons d'habillage : joués seulement si le fichier existe dans public/sfx/.
const existe = (nom: string) => {
  try {
    return getStaticFiles().some((f) => f.name === nom);
  } catch {
    return false;
  }
};
export const Sfx: React.FC<{ at: number; son: string; volume?: number }> = ({ at, son, volume = 0.5 }) => {
  const nom = `sfx/${son}.mp3`;
  if (!existe(nom)) return null;
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={150} layout="none" name={`sfx ${son}`}>
      <Audio src={staticFile(nom)} volume={volume} />
    </Sequence>
  );
};
export const fichierPublic = existe;

// ── Petit titre de section (sur-titre) en capitales espacées.
export const SurTitre: React.FC<{ texte: string; at: number; x: number; y: number; fin?: number; color?: string; size?: number }> = ({
  texte,
  at,
  x,
  y,
  fin,
  color = C.rouge,
  size = 26,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, EASE);
  const o = fin !== undefined ? prog(f, fin, fin + 10, EASE_IN) : 0;
  if (p <= 0 || o >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontFamily: MONTSERRAT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color,
        opacity: p * (1 - o),
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
      }}
    >
      <span style={{ width: size * 0.5, height: size * 0.5, background: color, rotate: "45deg", display: "inline-block" }} />
      {texte}
    </div>
  );
};

export const EASES = { EASE, EASE_IN, EASE_IO };
