import React from "react";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { fabrique, Plan } from "../motion/Plan";
import { Chapitre, TitreSeul } from "../motion/modules";
import { AppEtapes, Boutons, Cadenas, Fin } from "../motion/m-ui";
import { Arbre } from "../motion/m-listes";
import { Bulle, Cible, Graphique } from "../motion/Icones";
import { TH } from "../motion/tokens";

const ic = (I: typeof Bulle) => <I size={44} color={TH.sombre.accent} stroke={2.2} />;

// Scène 7, en résumé : ce qui manque, le système, l'appel offert, le bouton, la carte de fin.
export const Scene7: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan
    scene={scene ?? sceneParDefaut(num)}
    construire={(q) => {
      const B = fabrique(q);
      return [
        B(0, "sombre", "chapitre", (c) => <Chapitre c={c} num={7} titre="En résumé" />),
        B("Donc si je devais récapituler", "sombre", "resume", (c) => <TitreSeul c={c} texte={"En *résumé*."} style="impact" max={200} />, [{ at: 2, son: "thud", volume: 0.3 }]),
        B("Tu ne manques pas d'infos", "sombre", "manque", (c, m) => (
          <Arbre
            c={c}
            titre={"*Pas* d'infos en plus."}
            moyeu={{ texte: "Il te manque", at: m("Tu manques de") }}
            pastilles={[
              { valeur: "Des priorités", legende: "", at: m("priorités"), icone: ic(Cible) },
              { valeur: "Du suivi", legende: "", at: m("de suivi"), icone: ic(Graphique) },
              { valeur: "Un système", legende: "", at: m("et d'un système"), icone: ic(Bulle) },
            ]}
          />
        ), [{ at: 30, son: "pop", volume: 0.25 }]),
        B("Le système, il existe", "sombre", "existe", (c) => <AppEtapes c={c} vivant={0.6} etapes={[{ at: 0, titre: "Le système,\nil *existe*.", ecran: "aujourdhui.jpg" }]} max={160} />),
        B("Le premier appel", "sombre", "offert", (c) => <Cadenas c={c} texte={"Le premier appel :\n*je te l'offre*."} ouvre={18} />, [{ at: 18, son: "bell", volume: 0.3 }]),
        B("Il te reste juste", "clair", "une-chose", (c) => <TitreSeul c={c} texte={"Il te reste\n*une seule chose*\nà faire."} />),
        B("Choisis ton bouton", "clair", "bouton", (c, m) => (
          <Boutons c={c} titre={"Choisis ton bouton,\n*juste en dessous*."} apparitions={[4, 8]} fleche clic={m("et réserve") + 6} />
        ), [{ at: 0, son: "whoosh", volume: 0.3 }], undefined, true),
        B("Je te dis à très vite", "sombre", "fin", (c) => <Fin c={c} />, [{ at: 0, son: "impact", volume: 0.35 }]),
      ];
    }}
  />
);
