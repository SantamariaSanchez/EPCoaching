import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Charte EP Coaching (page Notion « Identité visuelle »).
// Rouge profond et noir, aucun ton froid. Interdits : #080808, #DC0A14, Bebas Neue.
export const C = {
  rouge: "#E01E1E",
  rougeMoyen: "#B00202",
  rougeFonce: "#890404",
  rougeNuit: "#270101",
  noir: "#0D0000",
  blanc: "#F5EDED",
  rose: "#FDC4C4", // usage rare
} as const;

export const blancA = (a: number) => `rgba(245, 237, 237, ${a})`;
export const rougeA = (a: number) => `rgba(224, 30, 30, ${a})`;
export const noirA = (a: number) => `rgba(13, 0, 0, ${a})`;

// Montserrat pour tout le texte (titres en 900, letter-spacing négatif).
// Playfair Display Italic Bold : réservé au logo EP (et le logo affiché est le vrai PNG).
export const MONTSERRAT = "Montserrat";
export const PLAYFAIR = "Playfair Display";

// 500 à 800 : fichier variable. 900 : instance statique (contours fusionnés, propre au trait).
loadFont({ family: MONTSERRAT, url: staticFile("fonts/montserrat.woff2"), weight: "500 800", style: "normal" });
loadFont({ family: MONTSERRAT, url: staticFile("fonts/montserrat-900.ttf"), weight: "900", style: "normal" });
loadFont({ family: MONTSERRAT, url: staticFile("fonts/montserrat-italic.woff2"), weight: "800", style: "italic" });
loadFont({ family: MONTSERRAT, url: staticFile("fonts/montserrat-900-italic.ttf"), weight: "900", style: "italic" });
loadFont({ family: PLAYFAIR, url: staticFile("fonts/playfair-italic.woff2"), weight: "700", style: "italic" });

export const W = 1920;
export const H = 1080;
