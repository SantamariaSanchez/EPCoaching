// Design tokens de la VSL (2 mondes : clair et sombre, une seule couleur d'accent : le rouge EP).
// Contrastes vérifiés (WCAG, texte large ≥ 3:1, texte courant ≥ 4.5:1) :
//   clair : encre #170808 sur papier #F4EFEB = 17.1:1 · rouge #D7151C (titres) = 4.6:1 · rouge texte #A30A0F = 7.1:1
//   sombre : blanc #FBF3F1 sur #0B0303 = 18.7:1 · corail #FF4A3D (titres) = 6.1:1 (ancien rouge sur noir : 4.3:1)
// Charte EP : rouge profond et noir, aucun ton froid. Le corail lumineux n'est utilisé que sur fond sombre.
export type Theme = "clair" | "sombre";

export const TH = {
  clair: {
    fond: "#F4EFEB",
    fond2: "#FFFFFF",
    carte: "#FFFFFF",
    ligne: "rgba(23, 8, 8, 0.10)",
    encre: "#170808",
    doux: "rgba(23, 8, 8, 0.58)",
    accent: "#D7151C",
    accentTexte: "#A30A0F",
    lueur: "rgba(215, 21, 28, 0.0)",
    ombre: "0 30px 60px -20px rgba(60, 10, 10, 0.28), 0 10px 24px -12px rgba(60, 10, 10, 0.18)",
  },
  sombre: {
    fond: "#0B0303",
    fond2: "#160606",
    carte: "#1A0808",
    ligne: "rgba(255, 90, 80, 0.16)",
    encre: "#FBF3F1",
    doux: "rgba(251, 243, 241, 0.62)",
    accent: "#FF4A3D",
    accentTexte: "#FF6B5F",
    lueur: "rgba(255, 60, 48, 0.55)",
    ombre: "0 40px 80px -24px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 90, 80, 0.14)",
  },
} as const;

export const ROUGE = "#E01E1E"; // rouge de marque (aplats, boutons)
export const ROUGE_PROFOND = "#890404";
export const NUIT = "#270101";

export const FONT = "Montserrat";

// Cadre de sécurité (marges broadcast) et grille.
export const W = 1920;
export const H = 1080;
export const SAFE = { x: 140, y: 110, w: 1640, h: 860 };
export type Rect = { x: number; y: number; w: number; h: number };

// Zones de composition récurrentes : jamais deux éléments dans la même zone.
export const Z = {
  plein: { x: 160, y: 200, w: 1600, h: 680 } as Rect,
  haut: { x: 160, y: 120, w: 1600, h: 250 } as Rect, // titre au-dessus d'un visuel
  basVisuel: { x: 160, y: 400, w: 1600, h: 580 } as Rect,
  gauche: { x: 150, y: 170, w: 900, h: 740 } as Rect, // titre à gauche
  droite: { x: 1110, y: 110, w: 670, h: 860 } as Rect, // visuel à droite
  gaucheVisuel: { x: 140, y: 110, w: 670, h: 860 } as Rect,
  droiteTexte: { x: 870, y: 170, w: 900, h: 740 } as Rect,
};
