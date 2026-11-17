// VSL v2 : kit de motion design (référence fondateur du 13/11/2026 : typographie cinétique empilée,
// mot accent en italique serif coloré, cartes en verre inclinées en 3D, bulles, flou de mouvement).
// Charte EP : noir profond, rouge de marque, aucun ton froid ; Montserrat pour le texte,
// Playfair Display italique (police du logo EP) pour le mot accent.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { noise2D } from "@remotion/noise";
import { C, MONTSERRAT, PLAYFAIR } from "../lib/brand";

export const ACCENT = C.rouge;
export const ACCENT_CLAIR = "#FF4A3D"; // corail lumineux, contraste 6,1:1 sur noir
export const BLANC = C.blanc;
export const NOIR = "#0B0303";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Ressort d'entrée standard (frame relative au déclenchement).
export const useRessort = (debut: number, config: { damping?: number; mass?: number; stiffness?: number } = {}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - debut, fps, config: { damping: 15, mass: 0.7, stiffness: 140, ...config } });
};

// Sortie : 0 -> 1 sur `duree` frames à partir de `fin`.
export const useSortie = (fin: number, duree = 10) => {
  const f = useCurrentFrame();
  return interpolate(f, [fin, fin + duree], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
};

// ── Fond : noir profond, lueurs rouges qui dérivent lentement, grain et vignette.
export const Fond: React.FC<{ intensite?: number; photo?: string; photoOpacite?: number }> = ({ intensite = 1, photo, photoOpacite = 0 }) => {
  const f = useCurrentFrame();
  const orbes = [
    { x: 0.22, y: 0.3, r: 900, a: 0.32, s: 1 },
    { x: 0.78, y: 0.72, r: 1100, a: 0.22, s: 2 },
    { x: 0.6, y: 0.15, r: 700, a: 0.14, s: 3 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: NOIR, overflow: "hidden" }}>
      {photo ? (
        <AbsoluteFill style={{ opacity: photoOpacite }}>
          <Img
            src={staticFile(photo)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(1) contrast(1.25) brightness(0.55) blur(2px)",
              transform: `scale(${1.08 + f * 0.0004}) translateX(${-f * 0.06}px)`,
            }}
          />
          <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,3,3,0.92) 0%, rgba(11,3,3,0.55) 55%, rgba(11,3,3,0.85) 100%)" }} />
        </AbsoluteFill>
      ) : null}
      {orbes.map((o, i) => {
        const dx = noise2D(`x${o.s}`, f / 260, 0) * 160;
        const dy = noise2D(`y${o.s}`, 0, f / 260) * 120;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: o.x * 1920 - o.r / 2 + dx,
              top: o.y * 1080 - o.r / 2 + dy,
              width: o.r,
              height: o.r,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(224,30,30,${o.a * intensite}) 0%, rgba(137,4,4,${o.a * 0.4 * intensite}) 38%, rgba(0,0,0,0) 70%)`,
              filter: "blur(40px)",
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("textures/grain.png")})`,
          opacity: 0.07,
          mixBlendMode: "screen",
          backgroundPosition: `${(f * 37) % 300}px ${(f * 53) % 300}px`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};

// ── Carte en verre : coins très arrondis, dégradé sombre, liseré lumineux, entrée 3D inclinée.
export const Verre: React.FC<{
  debut: number;
  fin?: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: [number, number, number]; // inclinaison d'entrée (deg) X, Y, Z
  teinte?: "sombre" | "rouge" | "clair";
  rayon?: number;
  children?: React.ReactNode;
  derive?: number; // amplitude de la dérive 3D après l'entrée
  style?: React.CSSProperties;
}> = ({ debut, fin, x, y, w, h, rot = [28, -24, -6], teinte = "sombre", rayon = 44, children, derive = 4, style }) => {
  const f = useCurrentFrame();
  const p = useRessort(debut, { damping: 17, mass: 0.9, stiffness: 110 });
  const sRaw = useSortie(fin ?? 1e9, 12);
  const s = fin === undefined ? 0 : sRaw;
  if (f < debut - 1 || (fin !== undefined && f > fin + 14)) return null;
  const rx = interpolate(p, [0, 1], [rot[0], 0]) + Math.sin((f - debut) / 40) * derive * 0.6 + s * 20;
  const ry = interpolate(p, [0, 1], [rot[1], 0]) + Math.cos((f - debut) / 47) * derive + s * -30;
  const rz = interpolate(p, [0, 1], [rot[2], 0]);
  const ty = interpolate(p, [0, 1], [220, 0]) + s * -60;
  const sc = interpolate(p, [0, 1], [0.7, 1]) * (1 - s * 0.15);
  const flou = interpolate(p, [0, 0.6, 1], [22, 4, 0], clamp) + s * 18;
  const fonds = {
    sombre: "linear-gradient(145deg, rgba(48,20,20,0.92) 0%, rgba(22,8,8,0.94) 55%, rgba(14,4,4,0.96) 100%)",
    rouge: "linear-gradient(140deg, #FF5A47 0%, #E01E1E 45%, #8E0606 100%)",
    clair: "linear-gradient(150deg, #FFF6F4 0%, #F1E3E0 100%)",
  } as const;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        perspective: 1600,
        opacity: interpolate(p, [0, 0.25], [0, 1], clamp) * (1 - s),
        filter: flou > 0.2 ? `blur(${flou}px)` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: rayon,
          background: fonds[teinte],
          transform: `translateY(${ty}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
          boxShadow:
            teinte === "rouge"
              ? "0 40px 120px -20px rgba(224,30,30,0.65), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -20px 60px rgba(80,0,0,0.35)"
              : "0 50px 120px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,120,110,0.14), inset 0 1px 0 rgba(255,255,255,0.12)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* reflet qui balaie la carte */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(115deg, rgba(255,255,255,0) ${interpolate(f - debut, [0, 60], [-40, 120], clamp)}%, rgba(255,255,255,${teinte === "clair" ? 0.5 : 0.13}) ${interpolate(f - debut, [0, 60], [-30, 130], clamp)}%, rgba(255,255,255,0) ${interpolate(f - debut, [0, 60], [-20, 140], clamp)}%)`,
            pointerEvents: "none",
          }}
        />
        {children}
      </div>
    </div>
  );
};

// ── Bulle de message (pilule), entrée en pop avec léger dépassement.
export const Bulle: React.FC<{
  debut: number;
  fin?: number;
  x: number;
  y: number;
  texte: string;
  taille?: number;
  teinte?: "rouge" | "sombre" | "clair";
  cote?: "gauche" | "droite";
}> = ({ debut, fin, x, y, texte, taille = 58, teinte = "rouge", cote = "gauche" }) => {
  const f = useCurrentFrame();
  const p = useRessort(debut, { damping: 11, mass: 0.6, stiffness: 180 });
  const sRaw = useSortie(fin ?? 1e9, 8);
  const s = fin === undefined ? 0 : sRaw;
  if (f < debut - 1 || (fin !== undefined && f > fin + 10)) return null;
  const fond =
    teinte === "rouge"
      ? "linear-gradient(135deg, #FF6A55 0%, #E01E1E 60%, #B00202 100%)"
      : teinte === "clair"
        ? "linear-gradient(135deg, #FFFFFF 0%, #F3E6E3 100%)"
        : "linear-gradient(135deg, #3A1717 0%, #1E0909 100%)";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transformOrigin: cote === "gauche" ? "0% 100%" : "100% 100%",
        transform: `translate(${cote === "droite" ? "-100%" : "0"}, 0) scale(${interpolate(p, [0, 1], [0.3, 1]) * (1 - s * 0.3)}) rotate(${interpolate(p, [0, 1], [cote === "gauche" ? -8 : 8, 0])}deg)`,
        opacity: interpolate(p, [0, 0.2], [0, 1], clamp) * (1 - s),
        filter: s > 0 ? `blur(${s * 10}px)` : undefined,
        padding: `${taille * 0.38}px ${taille * 0.7}px`,
        borderRadius: taille * 1.2,
        borderBottomLeftRadius: cote === "gauche" ? taille * 0.25 : taille * 1.2,
        borderBottomRightRadius: cote === "droite" ? taille * 0.25 : taille * 1.2,
        background: fond,
        color: teinte === "clair" ? "#170808" : BLANC,
        fontFamily: MONTSERRAT,
        fontWeight: 800,
        fontSize: taille,
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
        boxShadow: teinte === "rouge" ? "0 24px 60px -12px rgba(224,30,30,0.6), inset 0 2px 0 rgba(255,255,255,0.35)" : "0 24px 60px -16px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      {texte}
    </div>
  );
};

// ── Puce (étiquette arrondie), apparaît en glissant.
export const Puce: React.FC<{ debut: number; texte: string; actif?: boolean; taille?: number; style?: React.CSSProperties }> = ({
  debut,
  texte,
  actif = false,
  taille = 34,
  style,
}) => {
  const f = useCurrentFrame();
  const p = useRessort(debut, { damping: 14, mass: 0.6 });
  if (f < debut - 1) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: `${taille * 0.42}px ${taille * 0.8}px`,
        borderRadius: 999,
        background: actif ? "linear-gradient(135deg, #FF5A47, #E01E1E)" : "rgba(255,255,255,0.06)",
        border: actif ? "none" : "1.5px solid rgba(255,140,130,0.28)",
        color: BLANC,
        fontFamily: MONTSERRAT,
        fontWeight: 700,
        fontSize: taille,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
        boxShadow: actif ? "0 16px 40px -10px rgba(224,30,30,0.6)" : undefined,
        ...style,
      }}
    >
      {texte}
    </div>
  );
};

// ── Texte de carte (Montserrat) et mot accent (Playfair italique).
export const T: React.FC<{ taille: number; poids?: number; couleur?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  taille,
  poids = 800,
  couleur = BLANC,
  children,
  style,
}) => (
  <div style={{ fontFamily: MONTSERRAT, fontWeight: poids, fontSize: taille, color: couleur, letterSpacing: "-0.025em", lineHeight: 1.05, ...style }}>
    {children}
  </div>
);
export const Accent: React.FC<{ children: React.ReactNode; taille?: number; couleur?: string }> = ({ children, taille, couleur = ACCENT_CLAIR }) => (
  <span style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 700, color: couleur, fontSize: taille, letterSpacing: "-0.01em", textShadow: "0 0 40px rgba(255,60,48,0.45)" }}>
    {children}
  </span>
);

// ── Photo en carte (noir et blanc teinté), pour Emmanuel.
export const Photo: React.FC<{ src: string; couleur?: boolean; style?: React.CSSProperties }> = ({ src, couleur = false, style }) => (
  <Img
    src={staticFile(src)}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: couleur ? "contrast(1.08) saturate(0.9)" : "grayscale(1) contrast(1.2) brightness(0.9)",
      ...style,
    }}
  />
);

// ── Éclairs d'ouverture : carrés lumineux qui tournent et fusionnent (référence : formes qui morphent).
export const Eclairs: React.FC<{ debut: number; duree?: number }> = ({ debut, duree = 26 }) => {
  const f = useCurrentFrame() - debut;
  if (f < 0 || f > duree + 6) return null;
  const t = f / duree;
  const carres = [0, 1, 2];
  return (
    <AbsoluteFill style={{ perspective: 1400, opacity: interpolate(f, [0, 3, duree - 4, duree + 6], [0, 1, 1, 0], clamp) }}>
      {carres.map((i) => {
        const a = interpolate(t, [0, 1], [i * 120, i * 120 + 260]);
        const r = interpolate(t, [0, 0.7, 1], [320, 140, 0], clamp);
        const cx = 960 + Math.cos((a * Math.PI) / 180) * r;
        const cy = 540 + Math.sin((a * Math.PI) / 180) * r * 0.6;
        const taille = interpolate(t, [0, 0.8, 1], [260, 200, 420], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx - taille / 2,
              top: cy - taille / 2,
              width: taille,
              height: taille,
              borderRadius: interpolate(t, [0, 1], [30, 210]),
              background: i === 0 ? "rgba(255,90,71,0.95)" : i === 1 ? "rgba(224,30,30,0.85)" : "rgba(255,200,190,0.8)",
              transform: `rotateX(${a * 0.6}deg) rotateY(${a * 0.4}deg) rotateZ(${a}deg)`,
              filter: `blur(${interpolate(t, [0, 0.5, 1], [6, 14, 30], clamp)}px)`,
              mixBlendMode: "screen",
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,240,235,${interpolate(t, [0.75, 1], [0, 0.85], clamp)}) 0%, rgba(255,90,71,0) 45%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ── Traînée lumineuse (référence : trait de lumière qui traverse avant une carte).
export const Trainee: React.FC<{ debut: number; y?: number; angle?: number }> = ({ debut, y = 540, angle = -8 }) => {
  const f = useCurrentFrame() - debut;
  if (f < 0 || f > 16) return null;
  const x = interpolate(f, [0, 16], [-600, 2400], { easing: Easing.inOut(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 500,
        top: y,
        width: 1000,
        height: 6,
        borderRadius: 6,
        transform: `rotate(${angle}deg)`,
        background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,230,225,0.95) 70%, #FFFFFF 100%)",
        boxShadow: "0 0 30px 8px rgba(255,90,71,0.6)",
        filter: "blur(1px)",
      }}
    />
  );
};
