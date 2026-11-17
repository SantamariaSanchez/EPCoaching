import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SceneProvider, useCues } from "../lib/scene";
import { FPS, SceneResolue } from "../lib/resolve";
import { PolicesPretes } from "../motion/Polices";
import { Cinetique, Zone } from "./Cinetique";

export type Cues2 = ReturnType<typeof useCues>;

// Zones de texte : plein cadre, ou à gauche quand un visuel occupe la droite, ou en haut.
export const ZONES = {
  plein: { x: 130, y: 110, w: 1660, h: 860 } as Zone,
  centre: { x: 130, y: 110, w: 1660, h: 860, align: "centre" } as Zone,
  gauche: { x: 120, y: 120, w: 900, h: 840 } as Zone,
  haut: { x: 150, y: 90, w: 1620, h: 380 } as Zone,
};

export type Son = { at: number; src: string; volume?: number };

// Une scène v2 : fond + visuels (derrière ou à côté du texte) + typographie cinétique + voix + sons.
export const Plan2: React.FC<{
  scene: SceneResolue;
  fond: (c: Cues2, f: number) => React.ReactNode;
  visuels: (c: Cues2, f: number) => React.ReactNode;
  zone: (c: Cues2, debutPage: number) => Zone | null;
  sons?: (c: Cues2) => Son[];
  dessus?: (c: Cues2, f: number) => React.ReactNode;
}> = ({ scene, ...p }) => (
  <SceneProvider scene={scene}>
    <AbsoluteFill>
      <PolicesPretes>
        <Interieur {...p} />
      </PolicesPretes>
      {scene.audio ? <Audio src={staticFile(scene.audio)} from={Math.round(scene.lead * FPS)} name={`voix scène ${scene.num}`} /> : null}
    </AbsoluteFill>
  </SceneProvider>
);

const Interieur: React.FC<Omit<React.ComponentProps<typeof Plan2>, "scene">> = ({ fond, visuels, zone, sons, dessus }) => {
  const c = useCues();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {fond(c, f)}
      {visuels(c, f)}
      <Cinetique zone={(d) => zone(c, d)} />
      {dessus ? dessus(c, f) : null}
      {(sons ? sons(c) : []).map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.at)} durationInFrames={60} layout="none">
          <Audio src={staticFile(s.src)} volume={s.volume ?? 0.35} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Vrai si la frame f tombe dans l'un des intervalles [a, b).
export const dans = (f: number, ...plages: [number, number][]) => plages.some(([a, b]) => f >= a && f < b);
