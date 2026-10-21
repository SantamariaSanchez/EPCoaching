// Version web de la VSL pour le site (GitHub Pages, fichiers < 100 Mo) :
//   npm run web -- out/vsl-ep-coaching.mp4
// -> ../assets/video/vsl-ep-coaching.mp4   (1280×720, H.264 2 passes, son normalisé à -16 LUFS)
//    ../assets/video/vsl-ep-coaching.vtt   (sous-titres français, depuis la timeline)
//    ../assets/video/vsl-poster.jpg        (affiche tirée de la vidéo)
import { copyFileSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { ROOT } from "./scenes.mjs";

const source = resolve(process.argv[2] ?? join(ROOT, "out", "vsl-ep-coaching.mp4"));
if (!existsSync(source)) {
  console.error(`Vidéo introuvable : ${source}. Lance d'abord npm run rendu.`);
  process.exit(1);
}
const DEST = join(ROOT, "..", "assets", "video");
mkdirSync(DEST, { recursive: true });
mkdirSync(join(ROOT, "out"), { recursive: true });
const sortie = join(DEST, "vsl-ep-coaching.mp4");
const LIMITE = 95 * 1024 * 1024;
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
const duree = Number(
  execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", source], { encoding: "utf8" }).trim(),
);

// Débit vidéo choisi pour viser ~85 Mo au total (son 96 kb/s compris).
let kbps = Math.min(1400, Math.floor((85 * 8 * 1024) / duree - 96));
const log = join(ROOT, "out", "ffmpeg2pass");
for (let essai = 0; essai < 3; essai++) {
  const v = ["-i", source, "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-b:v", `${kbps}k`, "-maxrate", `${Math.round(kbps * 1.6)}k`, "-bufsize", `${kbps * 3}k`, "-g", "120", "-passlogfile", log];
  ff([...v, "-pass", "1", "-an", "-f", "mp4", "/dev/null"]);
  ff([...v, "-pass", "2", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "96k", "-ar", "48000", "-movflags", "+faststart", sortie]);
  const taille = statSync(sortie).size;
  console.log(`Essai ${essai + 1} : ${kbps} kb/s -> ${(taille / 1024 / 1024).toFixed(1)} Mo`);
  if (taille < LIMITE) break;
  kbps = Math.floor(kbps * 0.85);
}
for (const ext of ["-0.log", "-0.log.mbtree"]) rmSync(log + ext, { force: true });

execFileSync("node", [join(ROOT, "scripts", "vtt.mjs"), join(DEST, "vsl-ep-coaching.vtt")], { stdio: "inherit" });
// Affiche : le partage d'écran « lequel c'est toi ? » (scène 5), une image forte et lisible.
const t = process.env.POSTER_T ?? "497";
ff(["-ss", t, "-i", source, "-frames:v", "1", "-vf", "scale=1280:720:flags=lanczos", "-q:v", "3", join(DEST, "vsl-poster.jpg")]);
copyFileSync(join(DEST, "vsl-poster.jpg"), join(ROOT, "out", "vsl-poster.jpg"));
console.log(`Version web prête dans ${DEST}`);
