import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { C } from "../lib/brand";
import { hash } from "../lib/scene";

// Fond « matière » : noir profond, une lueur rouge qui respire et dérive lentement,
// un vignettage chaud. Jamais de dégradé froid.
export const Fond: React.FC<{ x?: number; y?: number; force?: number; seed?: number }> = ({
  x = 70,
  y = 30,
  force = 1,
  seed = 0,
}) => {
  const f = useCurrentFrame();
  const dx = Math.sin((f + seed * 97) / 210) * 6;
  const dy = Math.cos((f + seed * 61) / 260) * 5;
  const respire = 0.85 + Math.sin((f + seed * 13) / 95) * 0.08;
  return (
    <AbsoluteFill style={{ backgroundColor: C.noir }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 62% 70% at ${x + dx}% ${y + dy}%, rgba(137,4,4,${0.62 * force * respire}) 0%, rgba(39,1,1,${0.55 * force}) 42%, rgba(13,0,0,0) 78%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 40% 45% at ${100 - x - dx * 0.6}% ${100 - y + dy}%, rgba(176,2,2,${0.16 * force}) 0%, rgba(13,0,0,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse 85% 85% at 50% 50%, rgba(13,0,0,0) 55%, rgba(5,0,0,0.75) 100%)" }}
      />
    </AbsoluteFill>
  );
};

// Grain argentique léger. Il ne bouge que 6 fois par seconde et reste discret :
// un grain qui change à chaque image rend la vidéo incompressible pour le web.
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.32 }) => {
  const f = useCurrentFrame();
  const pas = Math.floor(f / 5);
  const ox = Math.floor(hash(pas) * 256);
  const oy = Math.floor(hash(pas + 991) * 256);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: -256,
          backgroundImage: `url(${staticFile("textures/grain.png")})`,
          backgroundSize: "256px 256px",
          backgroundPosition: `${ox}px ${oy}px`,
        }}
      />
    </AbsoluteFill>
  );
};

// Fuite de lumière rouge : deux halos qui traversent l'image en mode « screen ».
export const LightLeak: React.FC<{ p: number; sens?: 1 | -1; force?: number }> = ({ p, sens = 1, force = 1 }) => {
  const a = Math.sin(Math.min(1, Math.max(0, p)) * Math.PI);
  if (a <= 0.001) return null;
  const x = sens === 1 ? -20 + p * 140 : 120 - p * 140;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none", opacity: a * force }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 38% 85% at ${x}% 40%, rgba(224,30,30,0.55) 0%, rgba(176,2,2,0.25) 40%, rgba(0,0,0,0) 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 16% 50% at ${x + 8 * sens}% 55%, rgba(253,196,196,0.28) 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
