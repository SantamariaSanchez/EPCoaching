import React from "react";
import { Composition, Folder } from "remotion";
import "./lib/brand";
import { TIMELINE } from "./timeline";
import { FPS, debutsScenes, resoudreScene } from "./lib/resolve";
import { chargerScene, chargerToutes, musique, voixPresente } from "./lib/charger";
import { VSL } from "./VSL";
import { SCENES } from "./scenes";

// Une composition par scène (dossier « Scenes ») + la VSL complète enchaînée.
// La durée de chaque scène vient de la voix off si public/voix/scene-N.mp3 existe,
// sinon du rythme estimé du script (src/timeline.ts).
export const RemotionRoot: React.FC = () => {
  const estimees = TIMELINE.map((s) => resoudreScene(s));
  return (
    <>
      <Folder name="Scenes">
        {TIMELINE.map((s) => (
          <Composition
            key={s.num}
            id={`Scene${s.num}`}
            component={SCENES[s.num]}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={Math.ceil(s.duree * FPS)}
            defaultProps={{ num: s.num }}
            calculateMetadata={async ({ props }) => {
              const scene = await chargerScene(props.num);
              return { durationInFrames: scene.dureeFrames, props: { ...props, scene } };
            }}
          />
        ))}
      </Folder>
      <Composition
        id="VSL"
        component={VSL}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={debutsScenes(estimees).total}
        defaultProps={{ scenes: estimees, musique: null, voix: false }}
        calculateMetadata={async ({ props }) => {
          const scenes = await chargerToutes();
          return {
            durationInFrames: debutsScenes(scenes).total,
            props: { ...props, scenes, musique: musique(), voix: voixPresente(scenes) },
            defaultOutName: "vsl-ep-coaching",
          };
        }}
      />
    </>
  );
};
