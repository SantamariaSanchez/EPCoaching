import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, MONTSERRAT } from "../lib/brand";
import { FPS, SceneResolue } from "../lib/resolve";
import { EASE, EASE_IN, EASE_IO, SceneProvider, clamp, prog } from "../lib/scene";
import { Fond, Grain } from "./Fond";
import { Ambiance, STYLE_VERRE } from "./Ambiance";

// Carton de chapitre : grand numéro au trait, titre, filet rouge. Il occupe le temps
// avant la première parole (le « lead » de la scène) puis s'efface vers le haut.
export const Chapitre: React.FC<{ num: number; titre: string; lead: number }> = ({ num, titre, lead }) => {
  const f = useCurrentFrame();
  const L = Math.round(lead * FPS);
  const fin = L - 12;
  if (f > fin + 14) return null;
  const pN = prog(f, 0, 18, EASE);
  const pT = prog(f, 5, 24, EASE);
  const pL = prog(f, 8, 34, EASE_IO);
  const o = prog(f, fin, fin + 12, EASE_IN);
  return (
    <AbsoluteFill style={{ fontFamily: MONTSERRAT }}>
      <div style={{ position: "absolute", left: 190, top: 250, overflow: "hidden", paddingBottom: 10 }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 330,
            lineHeight: 0.9,
            letterSpacing: "-0.06em",
            color: "transparent", backgroundImage: "linear-gradient(170deg, #E01E1E 0%, #B00202 45%, #3d0101 100%)", WebkitBackgroundClip: "text", backgroundClip: "text",
            translate: `0 ${(1 - pN) * 100 - o * 100}%`,
          }}
        >
          {String(num - 1).padStart(2, "0")}
        </div>
      </div>
      <div style={{ position: "absolute", left: 196, top: 590, overflow: "hidden", paddingBottom: 14 }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 124,
            lineHeight: 1,
            letterSpacing: "-0.045em",
            color: C.blanc,
            translate: `0 ${(1 - pT) * 110 - o * 110}%`,
          }}
        >
          {titre}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 770,
          width: 520,
          height: 6,
          background: C.rouge,
          transformOrigin: "left center",
          scale: `${pL * (1 - o)} 1`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Logo: React.FC<{ at: number; x: number; y: number; w: number; fin?: number }> = ({ at, x, y, w, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 30, EASE);
  const o = fin !== undefined ? prog(f, fin, fin + 14, EASE_IN) : 0;
  if (p <= 0 || o >= 1) return null;
  const h = (w * 394) / 496;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        opacity: Math.min(1, p * 1.6) * (1 - o),
        scale: `${0.86 + 0.14 * p + o * 0.08}`,
        filter: `blur(${(1 - p) * 10}px)`,
      }}
    >
      <Img src={staticFile("img/logo.png")} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

type ShellProps = {
  scene: SceneResolue;
  fond?: { x?: number; y?: number; force?: number };
  chapitre?: boolean;
  children: React.ReactNode;
};

export const Shell: React.FC<ShellProps> = ({ scene, fond, chapitre = true, children }) => {
  const f = useCurrentFrame();
  const L = Math.round(scene.lead * FPS);
  // Sortie de scène : léger recul de caméra pendant la queue (la transition prend le relais).
  const recul = interpolate(f, [scene.dureeFrames - 30, scene.dureeFrames], [1, 0.985], { ...clamp, easing: EASE_IO });
  return (
    <SceneProvider scene={scene}>
      <AbsoluteFill
        style={{
          backgroundColor: C.noir,
          overflow: "hidden",
          // Reflet qui balaie toutes les surfaces en verre (classe .verre), un passage toutes les 7 s.
          ["--reflet" as string]: `${160 - ((f % 210) / 210) * 220}%`,
        }}
      >
        <style>{STYLE_VERRE}</style>
        <Fond {...fond} seed={scene.num} />
        <Ambiance seed={scene.num} />
        <AbsoluteFill style={{ scale: `${recul}` }}>{children}</AbsoluteFill>
        {chapitre && scene.num > 1 ? <Chapitre num={scene.num} titre={scene.titre} lead={scene.lead} /> : null}
        <Grain />
        {/* Voix off de la scène : elle démarre après le carton de chapitre (le « lead »). */}
        {scene.audio ? <Audio src={staticFile(scene.audio)} from={L} volume={1} name={`voix scène ${scene.num}`} /> : null}
      </AbsoluteFill>
    </SceneProvider>
  );
};
