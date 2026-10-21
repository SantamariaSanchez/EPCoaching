import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "../lib/brand";
import { EASE, EASE_IO, clamp, kf, prog } from "../lib/scene";

// Vraies captures de l'appli (assets/images/app, 780×1328).
export type Ecran = {
  src: string; // nom de fichier dans img/app, ex. "nutrition"
  at: number; // frame locale où l'écran apparaît
  // Zoom dans l'écran : clés [frame, échelle, x%, y%] (point fixe du zoom).
  zoom?: [number, number, number, number][];
  // Défilement vertical de la capture, en % de sa hauteur : clés [frame, %].
  scroll?: [number, number][];
};

const RATIO = 1328 / 780;

type Props = {
  ecrans: Ecran[];
  h?: number; // hauteur du téléphone
  x: number; // centre
  y: number;
  enter?: number; // frame d'entrée
  sortie?: number; // frame de sortie (optionnelle)
  tilt?: number; // rotation Y de base (deg)
  flip?: [number, number]; // retournement complet (frames de début/fin) : face B = dernier écran
  depth?: number; // parallaxe
  style?: React.CSSProperties;
};

const Screen: React.FC<{ e: Ecran; f: number; w: number; h: number }> = ({ e, f, w, h }) => {
  const lf = f - e.at;
  const z = e.zoom
    ? {
        s: kf(lf, e.zoom.map((k) => [k[0], k[1]] as [number, number]), EASE_IO),
        x: kf(lf, e.zoom.map((k) => [k[0], k[2]] as [number, number]), EASE_IO),
        y: kf(lf, e.zoom.map((k) => [k[0], k[3]] as [number, number]), EASE_IO),
      }
    : { s: 1, x: 50, y: 50 };
  const sc = e.scroll ? kf(lf, e.scroll, EASE_IO) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Img
        src={staticFile(`img/app/${e.src}.jpg`)}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: w,
          height: w * RATIO,
          translate: `0 ${-sc}%`,
          scale: `${z.s}`,
          transformOrigin: `${z.x}% ${z.y}%`,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: w * RATIO, height: Math.max(0, h - w * RATIO), background: C.noir }} />
    </div>
  );
};

// Téléphone en 3D légère : entrée en rotation, flottement lent, reflet qui suit l'angle.
export const Phone: React.FC<Props> = ({ ecrans, h = 820, x, y, enter = 0, sortie, tilt = -12, flip, depth = 1, style }) => {
  const f = useCurrentFrame();
  const bez = 13;
  const w = (h - 2 * bez - 40) / RATIO + 2 * bez;
  const sw = w - 2 * bez;
  const sh = h - 2 * bez;
  const pin = prog(f, enter, enter + 26, EASE);
  const pout = sortie !== undefined ? prog(f, sortie, sortie + 14, EASE_IO) : 0;
  const flot = Math.sin(f / 70) * 2.2;
  const flipDeg = flip ? interpolate(f, flip, [0, 180], { ...clamp, easing: EASE_IO }) : 0;
  const ry = tilt + (1 - pin) * -38 + flot + flipDeg + pout * 30;
  const rx = 5 + Math.cos(f / 90) * 1.5;
  const ty = (1 - pin) * 160 + Math.sin(f / 55) * 6 * depth + pout * -60;
  // Écran affiché : le dernier écran arrivé. Le précédent glisse vers la gauche (navigation).
  const actifs = ecrans.filter((e) => f >= e.at - 1);
  const faceB = flip && f > (flip[0] + flip[1]) / 2;
  const liste = faceB ? [ecrans[ecrans.length - 1]] : flip ? actifs.filter((e) => e !== ecrans[ecrans.length - 1]) : actifs;
  const vis = liste.slice(-2);
  const reflet = 30 + ((ry % 360) + 360) % 360 / 3;
  if (pin <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        perspective: 2200,
        opacity: Math.min(1, pin * 2) * (1 - pout),
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `translateY(${ty}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
        }}
      >
        {/* Ombre portée */}
        <div
          style={{
            position: "absolute",
            left: w * 0.08,
            right: w * 0.08,
            bottom: -h * 0.07,
            height: h * 0.1,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.75), rgba(0,0,0,0) 70%)",
            transform: "translateZ(-40px)",
            filter: "blur(6px)",
          }}
        />
        {/* Coque */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 62,
            background: "linear-gradient(145deg, #3a0c0c 0%, #1a0303 35%, #0D0000 60%, #2a0606 100%)",
            boxShadow: "0 50px 120px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(245,237,237,0.07), inset 0 0 0 5px #0D0000",
            transform: faceB ? "rotateY(180deg)" : undefined,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: bez,
              top: bez,
              width: sw,
              height: sh,
              borderRadius: 50,
              overflow: "hidden",
              background: C.noir,
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 40, width: sw, height: sh - 40 }}>
              {vis.map((e, i) => {
                const lf = f - e.at;
                const arrive = vis.length > 1 && i === 1 ? prog(lf, 0, 16, EASE) : 1;
                const part = vis.length > 1 && i === 0 ? prog(f - vis[1].at, 0, 16, EASE) : 0;
                return (
                  <div
                    key={e.src + e.at}
                    style={{
                      position: "absolute",
                      inset: 0,
                      translate: `${(1 - arrive) * 100 - part * 28}% 0`,
                      filter: part > 0 ? `brightness(${1 - part * 0.5})` : undefined,
                      boxShadow: i === 1 ? "-20px 0 40px rgba(0,0,0,0.5)" : undefined,
                    }}
                  >
                    <Screen e={e} f={f} w={sw} h={sh - 40} />
                  </div>
                );
              })}
            </div>
            {/* Barre d'état et îlot */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, background: C.noir }} />
            <div
              style={{
                position: "absolute",
                left: sw / 2 - 52,
                top: 11,
                width: 104,
                height: 26,
                borderRadius: 13,
                background: "#000",
              }}
            />
            {/* Reflet */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(115deg, rgba(255,255,255,0) ${reflet - 18}%, rgba(255,240,240,0.09) ${reflet}%, rgba(255,255,255,0) ${reflet + 14}%)`,
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Étiquette qui pointe une zone précise de l'écran (annotation, pas une fausse interface).
export const Callout: React.FC<{
  at: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  texte: string;
  fin?: number;
  cote?: "gauche" | "droite";
}> = ({ at, x, y, tx, ty, texte, fin, cote = "droite" }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 14, EASE);
  const pl = prog(f, at + 4, at + 20, EASE);
  const out = fin !== undefined ? prog(f, fin, fin + 10, EASE_IO) : 0;
  if (p <= 0 || out >= 1) return null;
  const len = Math.hypot(tx - x, ty - y);
  const ang = (Math.atan2(ty - y, tx - x) * 180) / Math.PI;
  const pulse = 1 + 0.35 * Math.abs(Math.sin((f - at) / 12));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x - 9,
          top: y - 9,
          width: 18,
          height: 18,
          borderRadius: 9,
          background: C.rouge,
          scale: `${p}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 18,
          top: y - 18,
          width: 36,
          height: 36,
          borderRadius: 18,
          border: `2px solid ${C.rouge}`,
          scale: `${p * pulse}`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y - 1.5,
          width: len * pl,
          height: 3,
          background: C.rouge,
          transformOrigin: "0 50%",
          rotate: `${ang}deg`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cote === "droite" ? tx : undefined,
          right: cote === "gauche" ? 1920 - tx : undefined,
          top: ty - 34,
          padding: "16px 26px",
          background: "rgba(13,0,0,0.92)",
          border: `2px solid ${C.rouge}`,
          borderRadius: 14,
          fontFamily: "Montserrat",
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: "-0.02em",
          color: C.blanc,
          whiteSpace: "nowrap",
          opacity: pl,
          translate: `${(1 - pl) * (cote === "droite" ? -20 : 20)}px 0`,
        }}
      >
        {texte}
      </div>
    </div>
  );
};
