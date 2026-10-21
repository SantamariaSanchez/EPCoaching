import { getStaticFiles, staticFile } from "remotion";
import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { TIMELINE } from "../timeline";
import { Caption, SceneResolue, resoudreScene } from "./resolve";

const existe = (nom: string) => {
  try {
    return getStaticFiles().some((f) => f.name === nom);
  } catch {
    return false;
  }
};

const dureeAudio = async (nom: string) => {
  const input = new Input({ formats: ALL_FORMATS, source: new UrlSource(staticFile(nom)) });
  return input.computeDuration();
};

// Pour une scène : cherche public/voix/scene-N.(mp3|wav|m4a) et, si elle existe,
// la transcription mot à mot public/voix/scene-N.json (npm run caler).
export const chargerScene = async (num: number): Promise<SceneResolue> => {
  const sc = TIMELINE[num - 1];
  const audio = ["mp3", "wav", "m4a"].map((ext) => `voix/scene-${num}.${ext}`).find(existe) ?? null;
  if (!audio) return resoudreScene(sc);
  const audioDuree = await dureeAudio(audio);
  let captions: Caption[] | null = null;
  const json = `voix/scene-${num}.json`;
  if (existe(json)) {
    const r = await fetch(staticFile(json));
    captions = (await r.json()) as Caption[];
  }
  return resoudreScene(sc, { audio, audioDuree, captions });
};

export const chargerToutes = () => Promise.all(TIMELINE.map((s) => chargerScene(s.num)));

// public/musique.mp3 (ta musique) passe avant public/musique-generee.mp3 (npm run musique).
export const musique = () => (existe("musique.mp3") ? "musique.mp3" : existe("musique-generee.mp3") ? "musique-generee.mp3" : null);
export const voixPresente = (scenes: SceneResolue[]) => scenes.some((s) => s.audio);
