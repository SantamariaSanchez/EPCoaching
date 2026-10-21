import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { hash } from "../lib/scene";

// Profondeur de la scène : poussières rouges sur trois plans (parallaxe), rails de lumière
// en diagonale et un sol en perspective très discret. Tout dérive lentement, jamais au hasard.
export const Ambiance: React.FC<{ seed?: number; force?: number }> = ({ seed = 0, force = 1 }) => {
  const f = useCurrentFrame();
  const N = 54;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: force }}>
      {/* Sol en perspective */}
      <div style={{ position: "absolute", left: -400, right: -400, bottom: -40, height: 420, perspective: 600, overflow: "hidden", opacity: 0.5 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(72deg)",
            transformOrigin: "50% 100%",
            backgroundImage:
              "linear-gradient(rgba(224,30,30,0.22) 2px, transparent 2px), linear-gradient(90deg, rgba(224,30,30,0.16) 2px, transparent 2px)",
            backgroundSize: "120px 120px",
            backgroundPosition: `0 ${(f * 0.8) % 120}px`,
            WebkitMaskImage: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 85%)",
          }}
        />
      </div>
      {/* Rails de lumière */}
      {[0, 1, 2].map((k) => {
        const x = ((hash(seed * 7 + k) * 2400 + f * (0.6 + k * 0.25)) % 2800) - 500;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x,
              top: -300,
              width: 2,
              height: 1700,
              rotate: "24deg",
              background: "linear-gradient(180deg, rgba(224,30,30,0) 0%, rgba(224,30,30,0.28) 45%, rgba(253,196,196,0.18) 55%, rgba(224,30,30,0) 100%)",
            }}
          />
        );
      })}
      {/* Poussières */}
      {Array.from({ length: N }).map((_, i) => {
        const z = hash(i * 13 + seed) ; // 0 loin, 1 près
        const size = 2 + z * 7;
        const vy = 0.15 + z * 0.55;
        const x0 = hash(i * 31 + seed * 3) * 1920;
        const y0 = hash(i * 17 + 5 + seed) * 1200;
        const y = ((y0 - f * vy) % 1200 + 1200) % 1200 - 60;
        const x = x0 + Math.sin((f + i * 40) / (90 + z * 60)) * (20 + 30 * z);
        const tw = 0.35 + 0.65 * Math.abs(Math.sin((f + i * 23) / (40 + i % 17)));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 9 === 0 ? "rgba(253,196,196,0.9)" : "rgba(224,30,30,0.9)",
              opacity: (0.15 + 0.45 * z) * tw,
              filter: z < 0.35 ? "blur(1.5px)" : z > 0.85 ? "blur(2px)" : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Matière « verre rouge » : reflet diagonal et liseré lumineux, appliqués par la classe .verre.
export const STYLE_VERRE = `
.verre { isolation: isolate; }
.verre::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: -1;
  background:
    linear-gradient(105deg, rgba(255,255,255,0) 42%, rgba(255,232,232,0.11) 50%, rgba(255,255,255,0) 58%),
    linear-gradient(125deg, rgba(255,220,220,0.13) 0%, rgba(255,220,220,0.035) 28%, rgba(255,255,255,0) 46%, rgba(255,255,255,0) 78%, rgba(224,30,30,0.10) 100%);
  background-size: 300% 100%, 100% 100%;
  background-position: var(--reflet, 0%) 0, 0 0;
}
.verre::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  box-shadow: inset 0 1.5px 0 rgba(255,235,235,0.16), inset 0 -18px 36px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,140,140,0.05);
}
`;
