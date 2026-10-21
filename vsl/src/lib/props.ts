import { TIMELINE } from "../timeline";
import { SceneResolue, resoudreScene } from "./resolve";

export type SceneProps = { num: number; scene?: SceneResolue };

// Repli si une scène est montée sans calculateMetadata (ne devrait pas arriver).
export const sceneParDefaut = (num: number) => resoudreScene(TIMELINE[num - 1]);
