import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { SceneProvider, useCues } from "../lib/scene";
import { FPS, SceneResolue } from "../lib/resolve";
import { Beat, Beats } from "./Beats";
import { PolicesPretes } from "./Polices";

export type Cues = ReturnType<typeof useCues>;

const Interieur: React.FC<{ construire: (c: Cues) => Beat[]; nom: string }> = ({ construire, nom }) => {
  const c = useCues();
  return <Beats beats={construire(c)} total={c.total} scene={nom} />;
};

// Une scène = sa voix off (calée) + une liste de temps forts.
export const Plan: React.FC<{ scene: SceneResolue; construire: (c: Cues) => Beat[] }> = ({ scene, construire }) => (
  <SceneProvider scene={scene}>
    <AbsoluteFill>
      <PolicesPretes>
        <Interieur construire={construire} nom={`S${scene.num}`} />
      </PolicesPretes>
      {scene.audio ? <Audio src={staticFile(scene.audio)} from={Math.round(scene.lead * FPS)} name={`voix scène ${scene.num}`} /> : null}
    </AbsoluteFill>
  </SceneProvider>
);

// Fabrique de temps forts : `B(début, monde, nom, rendu, sons)` où `début` est un passage du script
// (ou une frame) et où `rendu(c, m)` reçoit `m("mot")` = frame du mot, relative au temps fort.
export const fabrique = (q: Cues) => {
  const B = (
    debut: string | number,
    theme: Beat["theme"],
    nom: string,
    rendu: (c: Parameters<Beat["rendu"]>[0], m: (texte: string, nth?: number) => number) => React.ReactNode,
    sons?: Beat["sons"],
    grille?: boolean,
    flou?: boolean,
  ): Beat => {
    const at = typeof debut === "number" ? debut : q.cue(debut);
    const m = (t: string, n = 0) => {
      const r = q.mot(t, n) - at;
      if (r < -1) console.warn(`[GARDIEN] repère « ${t} » (n°${n}) avant le temps fort « ${nom} » (${r} images) : mauvaise occurrence ?`);
      return r;
    };
    return { at, theme, nom, grille, flou, rendu: (c) => rendu(c, m), sons };
  };
  return B;
};
