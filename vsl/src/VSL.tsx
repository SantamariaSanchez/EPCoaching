import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { C } from "./lib/brand";
import { debutsScenes, FPS, SceneResolue, TRANSITION } from "./lib/resolve";
import { rideauScene } from "./motion/TransitionScene";
import { Theme } from "./motion/tokens";

// Monde (clair / sombre) du premier plan de chaque scène : le rideau prend sa couleur.
const ENTREE: Record<number, Theme> = { 1: "clair", 2: "clair", 3: "clair", 4: "sombre", 5: "clair", 6: "clair", 7: "sombre" };
import { SCENES } from "./scenes";

export type VSLProps = { scenes: SceneResolue[]; musique: string | null; voix: boolean };

// La VSL complète : 7 scènes enchaînées par le rideau de bandes.
export const VSL: React.FC<VSLProps> = ({ scenes, musique, voix }) => {
  const { durationInFrames } = useVideoConfig();
  const { debuts } = debutsScenes(scenes);
  // Ducking : la musique descend sous chaque phrase et remonte dans les respirations (mot à mot).
  const enveloppe = useMemo(() => {
    const parle = new Float32Array(durationInFrames + 1);
    scenes.forEach((sc, i) => {
      if (!sc.audio) return;
      sc.blocs.forEach((b) => {
        const a = Math.max(0, Math.floor(debuts[i] + b.s * FPS) - 4);
        const z = Math.min(durationInFrames, Math.ceil(debuts[i] + b.e * FPS) + 6);
        for (let k = a; k <= z; k++) parle[k] = 1;
      });
    });
    // lissage (attaque ~0,15 s, relâche ~0,5 s)
    const out = new Float32Array(durationInFrames + 1);
    let v = 0;
    for (let k = 0; k <= durationInFrames; k++) {
      v += (parle[k] - v) * (parle[k] > v ? 0.25 : 0.07);
      out[k] = v;
    }
    return out;
  }, [scenes, debuts, durationInFrames]);
  const base = voix ? 0.2 : 0.32; // musique ≈ -21 dB sous la voix pendant la parole, ≈ -15 dB dans les respirations
  return (
    <AbsoluteFill style={{ backgroundColor: C.noir }}>
      <TransitionSeries>
        {scenes.flatMap((sc, i) => {
          const Comp = SCENES[sc.num];
          const items = [
            <TransitionSeries.Sequence key={`s${sc.num}`} durationInFrames={sc.dureeFrames} name={`Scène ${sc.num} · ${sc.titre}`}>
              <Comp num={sc.num} scene={sc} />
            </TransitionSeries.Sequence>,
          ];
          if (i < scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`t${sc.num}`}
                presentation={rideauScene({ vers: ENTREE[scenes[i + 1].num], sens: i % 2 === 0 ? 1 : -1, duree: TRANSITION })}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
      {debuts.slice(1).map((d, k) => (
        <Sequence key={`t${k}`} from={Math.max(0, d + TRANSITION / 2 - 14)} durationInFrames={60} layout="none">
          <Audio src={staticFile("sfx/swoosh.mp3")} volume={0.35} />
        </Sequence>
      ))}
      {musique ? (
        <Audio
          src={staticFile(musique)}
          loop
          name="musique"
          volume={(f) =>
            interpolate(f, [0, 30, durationInFrames - 120, durationInFrames - 1], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) *
            base *
            (1 - 0.55 * (enveloppe[Math.min(enveloppe.length - 1, Math.max(0, Math.round(f)))] ?? 0))
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
