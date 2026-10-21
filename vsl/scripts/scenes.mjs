// Durées réelles des scènes, calculées comme au rendu (voix off si présente, sinon rythme estimé).
// Partagé par scripts/musique.mjs et scripts/vtt.mjs.
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TIMELINE } from "../src/timeline.ts";
import { resoudreScene, debutsScenes, FPS, TRANSITION } from "../src/lib/resolve.ts";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const PUBLIC = join(ROOT, "public");

const duree = (f) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).trim());

export const scenesResolues = () =>
  TIMELINE.map((sc) => {
    const audio = ["mp3", "wav", "m4a"].map((e) => `voix/scene-${sc.num}.${e}`).find((n) => existsSync(join(PUBLIC, n)));
    if (!audio) return resoudreScene(sc);
    const json = join(PUBLIC, `voix/scene-${sc.num}.json`);
    const captions = existsSync(json) ? JSON.parse(readFileSync(json, "utf8")) : null;
    return resoudreScene(sc, { audio, audioDuree: duree(join(PUBLIC, audio)), captions });
  });

export { debutsScenes, FPS, TRANSITION };
