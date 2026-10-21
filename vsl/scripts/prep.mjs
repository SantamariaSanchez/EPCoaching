// Copie les vraies images du site (captures de l'appli, photos, logo) dans public/img/.
// Rien n'est dupliqué dans Git : public/img/ est ignoré, la source reste assets/images/.
//   npm run prep   (lancé automatiquement avant le studio et les rendus)
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "..", "assets", "images");
const DST = join(ROOT, "public", "img");

// Photos d'Emmanuel seul (aucune autre personne reconnaissable).
const PHOTOS = [
  "logo.png",
  "hero_current.jpg",
  "gym_pose.jpg",
  "gym_locker.jpg",
  "portrait_physique.jpg",
  "portrait_business.jpg",
  "proof_photo.jpg",
  "debut_2022a.jpg",
  "debut_2022b.jpg",
  "dark_front.jpg",
  "dark_back.jpg",
  "green_front.jpg",
  "green_side.jpg",
  "training_deadlift.jpg",
  "training_bench.jpg",
  "training_chest.jpg",
  "training_pulldown.jpg",
  "food1.jpg",
  "food2.jpg",
  "school.jpg",
];

if (!existsSync(SRC)) {
  console.error(`Dossier introuvable : ${SRC}. Le projet vsl/ doit rester dans le dépôt du site.`);
  process.exit(1);
}
mkdirSync(join(DST, "app"), { recursive: true });
for (const f of PHOTOS) cpSync(join(SRC, f), join(DST, f));
const app = readdirSync(join(SRC, "app")).filter((f) => f.endsWith(".jpg"));
for (const f of app) cpSync(join(SRC, "app", f), join(DST, "app", f));
console.log(`Images prêtes : ${PHOTOS.length} photos, ${app.length} captures de l'appli.`);
