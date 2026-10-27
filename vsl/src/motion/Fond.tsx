import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { noise2D } from "@remotion/noise";
import { hash } from "./anim";
import { TH, Theme } from "./tokens";

// Fond clair : papier chaud, grande lumière douce qui dérive, ombre de bord très légère.
const Clair: React.FC<{ f: number; intensite?: number }> = ({ f }) => {
  const lx = 30 + noise2D("lx", f / 400, 0) * 18;
  const ly = 20 + noise2D("ly", 0, f / 420) * 14;
  return (
    <AbsoluteFill style={{ background: TH.clair.fond }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 80% at ${lx}% ${ly}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 50% at ${78 - lx * 0.3}% ${92 - ly * 0.2}%, rgba(215, 21, 28, 0.045) 0%, rgba(215,21,28,0) 70%)`,
        }}
      />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(70, 20, 15, 0.10)" }} />
    </AbsoluteFill>
  );
};

// Fond sombre : noir profond, lueur rouge qui respire, grille de points en perspective, poussière.
const Sombre: React.FC<{ f: number; grille?: boolean }> = ({ f, grille = true }) => {
  const gx = 50 + noise2D("gx", f / 300, 1) * 16;
  const gy = 58 + noise2D("gy", 2, f / 340) * 10;
  return (
    <AbsoluteFill style={{ background: TH.sombre.fond, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 60% at ${gx}% ${gy}%, rgba(150, 12, 8, 0.42) 0%, rgba(60, 4, 2, 0.18) 45%, rgba(11,3,3,0) 75%)`,
        }}
      />
      {grille ? (
        <div
          style={{
            position: "absolute",
            left: -600,
            right: -600,
            top: 560,
            height: 1100,
            transform: "perspective(700px) rotateX(68deg)",
            transformOrigin: "50% 0%",
            backgroundImage: "radial-gradient(circle, rgba(255, 80, 70, 0.55) 1.6px, rgba(0,0,0,0) 2.4px)",
            backgroundSize: "44px 44px",
            backgroundPosition: `0px ${(f * 0.9) % 44}px`,
            maskImage: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0) 85%)",
            WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 25%, rgba(0,0,0,0) 80%)",
            opacity: 0.55,
          }}
        />
      ) : null}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = hash(i * 7) * 1920;
        const vitesse = 0.15 + hash(i * 11) * 0.4;
        const y = ((hash(i * 13) * 1200 - f * vitesse) % 1200 + 1200) % 1200 - 60;
        const r = 2 + hash(i * 17) * 5;
        const o = 0.12 + hash(i * 19) * 0.3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(f / 50 + i) * 12,
              top: y,
              width: r,
              height: r,
              borderRadius: r,
              background: "rgba(255, 110, 90, 1)",
              opacity: o,
              filter: `blur(${r > 5 ? 2 : 0.6}px)`,
            }}
          />
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Fond: React.FC<{ theme: Theme; f: number; grille?: boolean }> = ({ theme, f, grille }) =>
  theme === "clair" ? <Clair f={f} /> : <Sombre f={f} grille={grille} />;

// Grain argentique statique (ne bouge pas : coûte zéro en compression, donne la matière).
export const Grain: React.FC<{ theme: Theme }> = ({ theme }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: theme === "clair" ? "multiply" : "screen", opacity: theme === "clair" ? 0.05 : 0.06 }}>
    <Img src={staticFile("textures/grain.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);
