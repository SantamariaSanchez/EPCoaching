// Mesure de texte avec @remotion/layout-utils (measureText). Les polices sont garanties chargées
// avant toute mesure (PolicesPretes), sinon le cache de measureText retiendrait la police de repli.
import { measureText } from "@remotion/layout-utils";
import { FONT } from "./tokens";

export const largeur = (texte: string, taille: number, graisse = 800, espacement = 0) =>
  measureText({ text: texte, fontFamily: FONT, fontSize: taille, fontWeight: String(graisse), letterSpacing: `${espacement}em`, validateFontIsLoaded: true }).width;

// Plus grande taille telle que chaque ligne tient dans w, et le bloc dans h (équivalent fitText, multi-lignes).
export const ajuster = (
  lignes: string[],
  w: number,
  h: number,
  { max = 160, min = 24, graisse = 800, espacement = -0.03, interligne = 1.02 } = {},
) => {
  const ref = 100;
  const plusLarge = Math.max(...lignes.map((l) => largeur(l, ref, graisse, espacement)));
  const parLargeur = (w / plusLarge) * ref * 0.985;
  const parHauteur = h / (lignes.length * interligne);
  return Math.max(min, Math.min(max, parLargeur, parHauteur));
};
