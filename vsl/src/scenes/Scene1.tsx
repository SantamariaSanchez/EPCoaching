import React from "react";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { Plan } from "../motion/Plan";
import { AgendaVide, Courbe, DeuxCas, Lecteur, PhotoTitre, Projecteur, Recherche, TitreSeul } from "../motion/modules";

// Scène 1, ouverture. Monde clair pour le pratiquant, sombre pour le coach, puis les deux réunis.
export const Scene1: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan
    scene={scene ?? sceneParDefaut(num)}
    construire={({ cue }) => [
      { at: 0, theme: "clair", nom: "entraine", rendu: (c) => <TitreSeul c={c} texte={"Tu *t'entraînes*."} point max={190} />, sons: [{ at: 14, son: "pop", volume: 0.3 }] },
      {
        at: cue("Tu fais attention"),
        theme: "clair",
        nom: "manges",
        rendu: (c) => <PhotoTitre c={c} src="food1.jpg" pos="50% 50%" texte={"Tu fais\nattention à\n*ce que tu manges*."} format="carre" />,
        sons: [{ at: 0, son: "whoosh", volume: 0.3 }],
      },
      {
        at: cue("Et pourtant"),
        theme: "clair",
        nom: "miroir",
        rendu: (c) => <PhotoTitre c={c} src="green_front.jpg" pos="50% 30%" texte={"Et pourtant,\ndans le *miroir*…"} reflet cote="gauche" />,
        sons: [{ at: 0, son: "whoosh", volume: 0.3 }, { at: 22, son: "swoosh", volume: 0.18 }],
      },
      { at: cue("rien ne bouge"), theme: "clair", nom: "plat", rendu: (c) => <Courbe c={c} texte={"*Rien* ne bouge vraiment."} mode="plate" />, sons: [{ at: 4, son: "thud", volume: 0.35 }] },
      { at: cue("Ou alors tu es coach"), theme: "sombre", nom: "coach", rendu: (c) => <TitreSeul c={c} texte={"Ou alors,\ntu es *coach*."} max={170} /> },
      { at: cue("Tu connais ton métier"), theme: "sombre", nom: "metier", rendu: (c) => <TitreSeul c={c} texte={"Tu connais ton métier\n*par cœur*."} max={140} /> },
      { at: cue("Mais ton agenda"), theme: "sombre", nom: "agenda", rendu: (c) => <AgendaVide c={c} texte={"Mais ton\nagenda reste\n*vide*."} />, sons: [{ at: 0, son: "whoosh", volume: 0.3 }, { at: 74, son: "impact", volume: 0.3 }] },
      {
        at: cue("Si tu te reconnais"),
        theme: "sombre",
        nom: "deux-cas",
        rendu: (c) => <DeuxCas c={c} gauche="Tu t'entraînes" droite="Tu es coach" photoG="training_deadlift.jpg" photoD="portrait_business.jpg" />,
        sons: [{ at: 0, son: "swoosh", volume: 0.35 }],
      },
      { at: cue("la bonne vidéo"), theme: "clair", nom: "bonne-video", rendu: (c) => <Recherche c={c} requete="la bonne vidéo" resultat="Tu y es." />, sons: [{ at: 12, son: "type", volume: 0.35 }, { at: 46, son: "pop", volume: 0.35 }] },
      { at: cue("Et reste bien"), theme: "clair", nom: "bout", rendu: (c) => <Lecteur c={c} texte={"Reste *jusqu'au bout*."} />, sons: [{ at: 0, son: "whoosh", volume: 0.25 }] },
      { at: cue("la plupart des gens"), theme: "sombre", nom: "jamais", rendu: (c) => <Projecteur c={c} texte={"Ce que la plupart\nne voient *jamais*."} />, sons: [{ at: 6, son: "riser", volume: 0.25 }] },
    ]}
  />
);
