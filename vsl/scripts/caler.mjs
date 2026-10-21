// Calage mot à mot sur ta voix (optionnel, recommandé) :
//   npm run caler
// Pour chaque public/voix/scene-N.mp3, transcrit l'audio avec Whisper (en local, gratuit) et
// écrit public/voix/scene-N.json (temps de chaque mot). Au rendu, chaque mot clé et chaque
// animation tombent alors exactement sur ta parole. Sans ce fichier, la scène est étirée
// proportionnellement sur la durée de ton enregistrement (déjà correct, un peu moins précis).
// Le premier lancement télécharge whisper.cpp et le modèle (environ 1,5 Go), une seule fois.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { downloadWhisperModel, installWhisperCpp, toCaptions, transcribe } from "@remotion/install-whisper-cpp";
import { PUBLIC, ROOT } from "./scenes.mjs";

const WHISPER = join(ROOT, ".whisper");
const VERSION = "1.5.5";
const MODELE = "medium";

const fichiers = [1, 2, 3, 4, 5, 6, 7]
  .map((n) => ({ n, src: ["mp3", "wav", "m4a"].map((e) => join(PUBLIC, "voix", `scene-${n}.${e}`)).find(existsSync) }))
  .filter((x) => x.src);
if (!fichiers.length) {
  console.log("Aucun enregistrement dans public/voix/ (scene-1.mp3 … scene-7.mp3). Rien à caler.");
  process.exit(0);
}
mkdirSync(WHISPER, { recursive: true });
await installWhisperCpp({ to: WHISPER, version: VERSION });
await downloadWhisperModel({ model: MODELE, folder: WHISPER });
for (const { n, src } of fichiers) {
  const wav = join(WHISPER, `scene-${n}.wav`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-ar", "16000", "-ac", "1", wav]);
  const sortie = await transcribe({
    model: MODELE,
    whisperPath: WHISPER,
    whisperCppVersion: VERSION,
    inputPath: wav,
    tokenLevelTimestamps: true,
    language: "fr",
  });
  const { captions } = toCaptions({ whisperCppOutput: sortie });
  writeFileSync(join(PUBLIC, "voix", `scene-${n}.json`), JSON.stringify(captions, null, 1));
  console.log(`Scène ${n} : ${captions.length} mots calés -> public/voix/scene-${n}.json`);
}
