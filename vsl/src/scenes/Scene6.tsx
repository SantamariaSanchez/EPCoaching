import React from "react";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { fabrique, Plan } from "../motion/Plan";
import { Chapitre, TitreSeul } from "../motion/modules";
import { Boutons, Cadenas, Messagerie } from "../motion/m-ui";
import { Liste } from "../motion/m-listes";
import { Cadran } from "../motion/m-data";

// Scène 6, l'appel : les deux boutons du site, l'appel offert, son déroulé.
// À VALIDER (fondateur) : « ça dure une trentaine de minutes » (cadran ~30 min).
export const Scene6: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan
    scene={scene ?? sceneParDefaut(num)}
    construire={(q) => {
      const B = fabrique(q);
      return [
        B(0, "clair", "chapitre", (c) => <Chapitre c={c} num={6} titre="L'appel" />),
        B("Alors voilà ce que je te propose", "clair", "propose", (c) => <TitreSeul c={c} texte={"Voilà ce que\nje te *propose*."} />),
        B("Juste sous cette vidéo", "clair", "deux-boutons", (c, m) => (
          <Boutons c={c} titre={"Juste sous la vidéo :\n*deux boutons*."} apparitions={[m("Un pour le physique"), m("un pour les coachs")]} />
        ), [{ at: 40, son: "pop", volume: 0.3 }, { at: 76, son: "pop", volume: 0.3 }]),
        B("Tu choisis le tien", "clair", "choisis", (c, m) => (
          <Boutons c={c} titre={"Tu choisis le tien,\ntu *réserves ton appel*."} apparitions={[0, 3]} clic={m("et tu réserves") + 8} />
        ), [{ at: 40, son: "click", volume: 0.5 }]),
        B("Cet appel", "sombre", "offert", (c, m) => <Cadenas c={c} texte={"Cet appel est *offert*,\net sans engagement."} ouvre={m("il est offert") + 4} />, [{ at: 30, son: "bell", volume: 0.3 }]),
        B("On regarde ta situation", "clair", "situation", (c, m) => (
          <Liste
            c={c}
            titre={"On regarde *ensemble* :"}
            items={[
              { texte: "Où tu en es", at: m("où tu en es"), etat: "ok" },
              { texte: "Ce qui bloque", at: m("ce qui bloque"), etat: "ok" },
              { texte: "Ce qu'il faudrait faire", at: m("et ce qu'il faudrait"), etat: "ok" },
            ]}
          />
        )),
        B("Dans le pire des cas", "clair", "pire", (c) => <TitreSeul c={c} texte={"Au pire, tu repars\navec *un plan clair*,\ngratuitement."} />),
        B("Concrètement", "sombre", "duree", (c) => <Cadran c={c} valeur={30} prefixe="~" unite="minutes" titre={"Concrètement,\n*une trentaine\nde minutes*."} />, [{ at: 6, son: "tick", volume: 0.25 }]),
        B("Tu me racontes ton objectif", "sombre", "echange", (c, m) => (
          <Messagerie
            c={c}
            titre={"Tu me racontes,\n*je te dis\nfranchement*."}
            bulles={[
              { at: m("ton objectif"), texte: "Mon objectif", moi: true },
              { at: m("ta semaine"), texte: "Ma semaine", moi: true },
              { at: m("ce que tu as déjà"), texte: "Ce que j'ai déjà essayé", moi: true },
              { at: m("ce que je ferais"), texte: "Ce que je ferais à ta place", moi: false },
            ]}
          />
        ), [{ at: 0, son: "pop", volume: 0.2 }]),
        B("Et si je pense que je ne peux pas", "clair", "honnete", (c) => <TitreSeul c={c} texte={"Si je ne peux pas\nt'aider, *je te\nle dis aussi*."} />),
        B("Et si on voit qu'on peut travailler", "clair", "comment", (c) => <TitreSeul c={c} texte={"Si on peut travailler\nensemble, *je t'explique\nexactement comment*."} />),
      ];
    }}
  />
);
