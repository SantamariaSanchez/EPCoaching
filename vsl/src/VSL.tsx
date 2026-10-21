import React from "react";
import { AbsoluteFill, interpolate, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { C } from "./lib/brand";
import { SceneResolue, TRANSITION } from "./lib/resolve";
import { losange } from "./components/Transitions";
import { SCENES } from "./scenes";

export type VSLProps = { scenes: SceneResolue[]; musique: string | null; voix: boolean };

// La VSL complète : 7 scènes enchaînées par la transition « losange ».
export const VSL: React.FC<VSLProps> = ({ scenes, musique, voix }) => {
  const { durationInFrames } = useVideoConfig();
  // Musique optionnelle (public/musique.mp3), basse sous la voix, en fondu au début et à la fin.
  const base = voix ? 0.1 : 0.32;
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
                presentation={losange({ sens: i % 2 === 0 ? 1 : -1 })}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
      {musique ? (
        <Audio
          src={staticFile(musique)}
          loop
          name="musique"
          volume={(f) =>
            interpolate(f, [0, 60, durationInFrames - 120, durationInFrames - 1], [0, base, base, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
