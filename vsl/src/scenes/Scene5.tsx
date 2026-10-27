import React from "react";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { fabrique, Plan } from "../motion/Plan";
import { Camera, Chapitre, Courbe, DeuxCas, PhotoTitre, TitreSeul } from "../motion/modules";
import { AppEtapes, TitresEnEtapes } from "../motion/m-ui";
import { Chemin, Liste, Point, Rangee } from "../motion/m-listes";
import { Balance, Cible, Halteres } from "../motion/Icones";
import { TH, Z } from "../motion/tokens";

const ic = (I: typeof Halteres) => <I size={84} color={TH.clair.accent} stroke={2} />;

// Scène 5, lequel c'est toi : les deux accompagnements, pour qui ce n'est pas, et la question des 6 mois.
export const Scene5: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan
    scene={scene ?? sceneParDefaut(num)}
    construire={(q) => {
      const B = fabrique(q);
      return [
        B(0, "clair", "chapitre", (c) => <Chapitre c={c} num={5} titre="Lequel c'est toi ?" />),
        B("Maintenant", "sombre", "deux-cas", (c, m) => (
          <DeuxCas c={c} gauche="Ton physique" droite="Tu es coach" photoG="gym_pose.jpg" photoD="portrait_business.jpg" question={m("lequel c'est toi")} />
        ), [{ at: 0, son: "swoosh", volume: 0.35 }]),
        B("Premier cas", "clair", "cas-1", (c) => <Point c={c} num="01" texte={"Tu veux transformer\nton *physique*."} />, [{ at: 0, son: "whoosh", volume: 0.3 }]),
        B("Perdre du gras", "clair", "objectifs", (c, m) => (
          <Rangee
            c={c}
            items={[
              { texte: "Perdre\ndu gras", at: 2, icone: ic(Balance) },
              { texte: "Prendre\ndu muscle", at: m("prendre du muscle"), icone: ic(Halteres) },
              { texte: "Préparer une\ncompétition", at: m("préparer une compétition"), icone: ic(Cible) },
            ]}
          />
        ), [{ at: 2, son: "pop", volume: 0.25 }]),
        B("Là, je t'accompagne moi-même", "clair", "moi-meme", (c) => <PhotoTitre c={c} src="portrait_physique.jpg" pos="50% 25%" texte={"Là, je\nt'accompagne\n*moi-même*."} />),
        B("On construit ton plan", "clair", "plan", (c, m) => (
          <Liste
            c={c}
            titre={"On construit *ton plan*,\nensemble :"}
            items={[
              { texte: "Ta diète", at: m("ta diète"), etat: "ok" },
              { texte: "Ton training", at: m("ton training"), etat: "ok" },
              { texte: "Ta road map", at: m("ta road map"), etat: "ok" },
            ]}
          />
        )),
        B("Tu as l'appli pour l'exécuter", "sombre", "appli", (c, m) => (
          <AppEtapes
            c={c}
            etapes={[
              { at: 0, titre: "L'appli pour\n*exécuter*,\nchaque jour.", ecran: "aujourdhui.jpg" },
              { at: m("et moi derrière"), titre: "Et moi derrière,\npour *ajuster*\nchaque semaine.", ecran: "messages.jpg" },
            ]}
          />
        ), [{ at: 0, son: "whoosh", volume: 0.3 }]),
        B("Tu n'es plus jamais seul", "clair", "stagnation", (c) => (
          <Courbe c={c} texte={"Plus jamais seul\nface à une *stagnation*."} mode="monte" titreCarte="Ta progression" legende="Ajustée chaque semaine" />
        )),
        B("Deuxième cas", "sombre", "cas-2", (c) => <Point c={c} num="02" texte={"Tu es\n*coach*."} />, [{ at: 0, son: "whoosh", volume: 0.3 }]),
        B("Tu as les connaissances", "sombre", "depart", (c, m) => (
          <Liste
            c={c}
            titre={"Tu as…"}
            items={[
              { texte: "Les connaissances", at: 6, etat: "ok" },
              { texte: "Pas encore les clients", at: m("pas encore les clients"), etat: "non" },
              { texte: "Pas le temps de tout gérer", at: m("pas le temps"), etat: "non" },
            ]}
          />
        )),
        B("Là, je t'accompagne sur ton business", "sombre", "business", (c) => <PhotoTitre c={c} src="portrait_business.jpg" pos="50% 30%" texte={"Je t'accompagne\nsur ton\n*business*."} cote="gauche" />),
        B("Ta niche, ton offre", "sombre", "etapes", (c, m) => (
          <Chemin
            c={c}
            vertical
            titre={"Ce qu'on\nconstruit\n*ensemble* :"}
            etapes={[
              { texte: "Ta niche", at: 2 },
              { texte: "Ton offre", at: m("ton offre") },
              { texte: "Ton contenu", at: m("ton contenu") },
              { texte: "Un agenda rempli", at: m("comment remplir") },
              { texte: "Des clients suivis", at: m("et comment suivre") },
            ]}
          />
        )),
        B("Avec l'appli coach", "sombre", "pipeline", (c, m) => (
          <Chemin
            c={c}
            titre={"L'appli coach\n*comme système*"}
            etapes={[
              { texte: "Premier contenu", at: m("du premier contenu") },
              { texte: "Prospects", at: m("du premier contenu") + 12 },
              { texte: "Appel", at: m("du premier contenu") + 24 },
              { texte: "Client suivi", at: m("client suivi") },
            ]}
          />
        )),
        B("Et je vais être transparent", "clair", "transparent", (c, m) => (
          <Camera c={c}>
            <TitresEnEtapes
              c={c}
              zone={Z.plein}
              align="center"
              max={150}
              etapes={[
                { at: 0, titre: "Je vais être\n*transparent*." },
                { at: m("C'est pas pour tout le monde"), titre: "Ce n'est *pas pour\ntout le monde*." },
              ]}
            />
          </Camera>
        )),
        B("Si tu cherches une méthode miracle", "clair", "pas-ici", (c, m) => (
          <Liste
            c={c}
            items={[
              { texte: "Méthode miracle", at: 4, etat: "non" },
              { texte: "Résultat en 10 jours", at: m("un résultat"), etat: "non" },
              { texte: "Sans effort", at: m("sans effort"), etat: "non" },
            ]}
            zoneListe={{ x: 200, y: 220, w: 1000, h: 640 }}
            tampon={{ at: m("c'est pas ici"), texte: "Pas ici" }}
          />
        ), [{ at: 60, son: "impact", volume: 0.3 }]),
        B("Par contre", "sombre", "pret", (c, m) => (
          <Liste
            c={c}
            titre={"Par contre, si tu es *prêt* :"}
            items={[
              { texte: "À faire ta part", at: m("faire ta part"), etat: "ok" },
              { texte: "Tous les jours", at: m("tous les jours", 1), etat: "ok" },
              { texte: "Avec un plan vraiment à toi", at: m("un plan qui est"), etat: "ok" },
            ]}
          />
        )),
        B("alors on peut faire de grandes choses", "sombre", "grandes-choses", (c) => <TitreSeul c={c} texte={"On peut faire\nde *grandes choses*\nensemble."} />, [{ at: 4, son: "impact", volume: 0.3 }]),
        B("Et si tu hésites encore", "clair", "hesites", (c) => <TitreSeul c={c} texte={"Si tu hésites,\npose-toi *une seule\nquestion*."} />),
        B("Dans six mois", "sombre", "six-mois", (c, m) => (
          <Chemin
            c={c}
            titre={"Si tu continues\n*exactement comme maintenant*…"}
            etapes={[
              { texte: "Aujourd'hui", at: 4 },
              { texte: "Dans 6 mois", at: m("tu seras où") - 18 },
            ]}
            final={{ at: m("tu seras où"), texte: "Tu seras où ?" }}
          />
        ), [{ at: 4, son: "riser", volume: 0.2 }]),
        B("Si la réponse ne te plaît pas", "clair", "changer", (c, m) => (
          <Camera c={c}>
            <TitresEnEtapes
              c={c}
              zone={Z.plein}
              align="center"
              max={160}
              etapes={[
                { at: 0, titre: "Si la réponse\nne te plaît pas…" },
                { at: m("alors il est temps"), titre: "Il est temps de\nchanger *quelque chose*." },
                { at: m("Pas tout"), titre: "*Pas tout.*" },
                { at: m("Juste la façon"), titre: "Juste la façon\ndont tu es *suivi*." },
              ]}
            />
          </Camera>
        )),
      ];
    }}
  />
);
