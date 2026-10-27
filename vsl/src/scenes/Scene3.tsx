import React from "react";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { fabrique, Plan } from "../motion/Plan";
import { Camera, Chapitre, Pile, TitreSeul } from "../motion/modules";
import { TitresEnEtapes } from "../motion/m-ui";
import { Arbre, Equation, Liste, Point, Rangee } from "../motion/m-listes";
import { Copies, Recherches } from "../motion/m-fx";
import { Ecart, Fiche, SemaineCalories, Serie } from "../motion/m-data";
import { Invisible, Soirees } from "../motion/m-perso";
import { Balance, Fourchette, Graphique, Halteres, Lune, Cible } from "../motion/Icones";
import { Z, TH } from "../motion/tokens";

const ic = (I: typeof Halteres, taille = 84) => <I size={taille} color={TH.sombre.accent} stroke={2} />;

// Scène 3, le vrai problème : les questions, les 3 raisons (plan, mesure, ajustement), l'exemple chiffré
// du script (80 kg), puis le même problème chez les coachs, et la solution commune.
export const Scene3: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan
    scene={scene ?? sceneParDefaut(num)}
    construire={(q) => {
      const B = fabrique(q);
      return [
        B(0, "clair", "chapitre", (c) => <Chapitre c={c} num={3} titre="Le vrai problème" />),
        B("Laisse-moi te poser", "clair", "question", (c) => <TitreSeul c={c} texte={"Laisse-moi te poser\n*une question*."} />),
        B("Combien de programmes", "clair", "recherches", (c, m) => (
          <Recherches
            c={c}
            requetes={[
              { at: 0, texte: "nouveau programme muscu" },
              { at: m("Combien de diètes"), texte: "nouvelle diète sèche" },
              { at: m("Combien de fois"), texte: "cette fois, c'est la bonne" },
            ]}
          />
        ), [{ at: 4, son: "type", volume: 0.3 }]),
        B("Je vais être très clair", "sombre", "clair", (c) => <TitreSeul c={c} texte={"Je vais être\n*très clair*."} />, [{ at: 0, son: "thud", volume: 0.3 }]),
        B("Tu ne manques pas de motivation", "sombre", "manques", (c, m) => (
          <Liste
            c={c}
            titre={"Ce qui te manque *vraiment* :"}
            items={[
              { texte: "La motivation", at: 4, etat: "non" },
              { texte: "Des priorités", at: m("priorités"), etat: "ok" },
              { texte: "Du suivi", at: m("suivi"), etat: "ok" },
            ]}
          />
        ), [{ at: 14, son: "tick", volume: 0.3 }]),
        B("Je m'explique", "sombre", "trois-raisons", (c, m) => (
          <Arbre
            c={c}
            titre={"Pourquoi les gens\n*n'avancent pas*"}
            moyeu={{ texte: "raisons", at: m("trois"), compteur: [0, 3] }}
            pastilles={[
              { valeur: "01", legende: "Le plan", at: m("trois") + 18, icone: ic(Cible, 44) },
              { valeur: "02", legende: "La mesure", at: m("trois") + 30, icone: ic(Graphique, 44) },
              { valeur: "03", legende: "L'ajustement", at: m("trois") + 42, icone: ic(Balance, 44) },
            ]}
          />
        ), [{ at: 30, son: "pop", volume: 0.25 }]),
        B("Premier point", "sombre", "point-1", (c) => <Point c={c} num="01" texte={"Le plan n'est pas\nfait *pour toi*."} />, [{ at: 0, son: "whoosh", volume: 0.3 }]),
        B("Tu as pris le programme", "clair", "copies", (c, m) => (
          <Copies
            c={c}
            titre={"Le plan *d'un autre*."}
            items={[
              { texte: "Programme", at: 4 },
              { texte: "Diète", at: m("la diète") },
              { texte: "Horaires", at: m("horaires") },
            ]}
          />
        ), [{ at: 12, son: "thud", volume: 0.3 }]),
        B("Et au bout de trois semaines", "clair", "trois-semaines", (c, m) => <Serie c={c} titre={"3 semaines…\npuis tu *lâches*."} lache={m("tu lâches")} />, [{ at: 40, son: "thud", volume: 0.3 }]),
        B("Le meilleur plan", "clair", "meilleur-plan", (c) => <TitreSeul c={c} texte={"Le meilleur plan :\ncelui que tu peux\n*suivre*."} />),
        B("Deuxième point", "sombre", "point-2", (c) => <Point c={c} num="02" texte={"Tu ne *mesures*\nrien."} />, [{ at: 0, son: "whoosh", volume: 0.3 }]),
        B("Ton poids, ton sommeil", "sombre", "inconnus", (c, m) => (
          <Rangee
            c={c}
            inconnu
            items={[
              { texte: "Poids", at: m("poids"), icone: ic(Balance) },
              { texte: "Sommeil", at: m("sommeil"), icone: ic(Lune) },
              { texte: "Charges", at: m("charges"), icone: ic(Halteres) },
              { texte: "Repas", at: m("repas"), icone: ic(Fourchette) },
            ]}
          />
        )),
        B("Sans données", "clair", "feeling", (c, m) => (
          <Camera c={c}>
            <TitresEnEtapes
              c={c}
              zone={Z.plein}
              align="center"
              max={150}
              etapes={[
                { at: 0, titre: "Sans données,\ntu avances\n*au feeling*." },
                { at: m("on se raconte"), titre: "Et au feeling,\non se raconte\ndes *histoires*." },
              ]}
            />
          </Camera>
        )),
        B("Je prends un exemple", "sombre", "exemple", (c, m) => <Fiche c={c} poids={80} poidsAt={m("80")} objectifAt={m("sécher")} citationAt={m("plutôt")} />, [{ at: 0, son: "whoosh", volume: 0.3 }]),
        B("Sauf que le week-end", "sombre", "semaine", (c, m) => (
          <SemaineCalories
            c={c}
            weekend={m("week-end")}
            papier={m("Sur le papier")}
            vrai={m("En vrai")}
            ecarts={[
              { texte: "Repas de famille", at: m("repas de famille") },
              { texte: "Deux verres", at: m("deux verres") },
              { texte: "Un dessert", at: m("dessert") },
            ]}
          />
        ), [{ at: 30, son: "pop", volume: 0.25 }]),
        B("Et il se dit que son métabolisme", "clair", "casse", (c) => <TitreSeul c={c} texte={"« Mon métabolisme\nest *cassé*. »"} style="impact" />, [{ at: 4, son: "impact", volume: 0.3 }]),
        B("C'est pas son métabolisme", "clair", "mesure-rien", (c, m) => (
          <Camera c={c}>
            <TitresEnEtapes
              c={c}
              zone={Z.plein}
              align="center"
              max={150}
              etapes={[
                { at: 0, titre: "Ce n'est pas\nson *métabolisme*." },
                { at: m("C'est qu'il"), titre: "C'est qu'il\nne *mesure rien*." },
              ]}
            />
          </Camera>
        )),
        B("Et le dernier point", "sombre", "point-3", (c) => <Point c={c} num="03" texte={"Personne\nn'*ajuste*."} />, [{ at: 0, son: "whoosh", volume: 0.3 }]),
        B("Ton corps change", "clair", "change", (c, m) => (
          <Pile
            c={c}
            lignes={[
              { at: 0, texte: "Ton corps *change*." },
              { at: m("ta semaine"), texte: "Ta semaine *change*." },
              { at: m("ta vie"), texte: "Ta vie *change*." },
            ]}
          />
        )),
        B("Si ton plan, lui", "clair", "ecart", (c, m) => <Ecart c={c} titre={"Si ton plan\nne bouge *jamais*…"} casse={m("ne plus marcher")} />, [{ at: 60, son: "thud", volume: 0.3 }]),
        B("Et tu sais ce qui est intéressant", "clair", "interessant", (c) => <TitreSeul c={c} texte={"Tu sais ce qui est\n*intéressant* ?"} />),
        B("C'est exactement le même problème", "sombre", "coachs", (c) => <TitreSeul c={c} texte={"Chez les coachs :\nle même problème,\n*un autre visage*."} max={140} />, [{ at: 0, son: "whoosh", volume: 0.25 }]),
        B("Tu peux être le meilleur coach", "sombre", "en-vivre", (c, m) => (
          <Camera c={c}>
            <TitresEnEtapes
              c={c}
              zone={Z.plein}
              align="center"
              max={150}
              etapes={[
                { at: 0, titre: "Le *meilleur coach*\nde ta ville…" },
                { at: m("et ne pas"), titre: "…et ne pas\n*en vivre*." },
              ]}
            />
          </Camera>
        )),
        B("Parce que tes clients ne te voient pas", "sombre", "invisible", (c) => <Invisible c={c} titre={"Tes clients\n*ne te voient\npas*."} />),
        B("Parce que tu passes tes soirées", "sombre", "soirees", (c, m) => (
          <Soirees
            c={c}
            titre={"Tes *soirées*,\nsur des…"}
            fenetres={[
              { texte: "Tableaux", at: m("tableaux") },
              { texte: "Messages", at: m("messages") },
              { texte: "Fichiers", at: m("fichiers") },
            ]}
          />
        )),
        B("Parce que tu n'as pas de système", "sombre", "pas-systeme", (c) => <TitreSeul c={c} texte={"Pas de\n*système*."} style="impact" max={200} />, [{ at: 2, son: "impact", volume: 0.35 }]),
        B("Que tu sois pratiquant", "clair", "equation", (c, m) => (
          <Equation
            c={c}
            titre={"*La même* solution :"}
            gauche={[
              { texte: "Pratiquant", at: 6 },
              { texte: "Coach", at: m("ou coach") },
            ]}
            egal={m("la solution")}
            droite={[
              { texte: "Un vrai suivi", at: m("un vrai suivi") },
              { texte: "Un système", at: m("et un système") },
            ]}
          />
        ), [{ at: 4, son: "pop", volume: 0.2 }]),
      ];
    }}
  />
);
