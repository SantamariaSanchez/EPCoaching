import React from "react";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { fabrique, Plan } from "../motion/Plan";
import { Camera, Chapitre, TitreSeul } from "../motion/modules";
import { AppEtapes, Calques, LogoReveal, Mosaique, TitresEnEtapes } from "../motion/m-ui";
import { Arbre, Chemin, Liste } from "../motion/m-listes";
import { PdfEndormi, Respiration, Studio } from "../motion/m-fx";
import { Anneaux, Cadran, ChiffresPhrase, Repas } from "../motion/m-data";
import { Bulle, Utilisateurs, Video } from "../motion/Icones";
import { TH, Z } from "../motion/tokens";

const ic = (I: typeof Bulle) => <I size={46} color={TH.sombre.accent} stroke={2.2} />;

// Scène 4, le système : l'appli EP Coaching (vraies captures) qui se construit en 3D, fonction par fonction.
export const Scene4: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan
    scene={scene ?? sceneParDefaut(num)}
    construire={(q) => {
      const B = fabrique(q);
      return [
        B(0, "sombre", "chapitre", (c) => <Chapitre c={c} num={4} titre="Le système" />),
        B("C'est pour ça que j'ai construit", "sombre", "logo", (c) => <LogoReveal c={c} sousTitre={"J'ai construit *EP Coaching*."} />, [{ at: 4, son: "impact", volume: 0.35 }], undefined, true),
        B("Au départ", "sombre", "mon-outil", (c, m) => (
          <AppEtapes
            c={c}
            etapes={[
              { at: 0, titre: "Au départ,\n*mon outil\nà moi*.", ecran: "aujourdhui.jpg" },
              { at: m("Celui que"), titre: "Pour ma\n*propre prépa*.", ecran: "progression.jpg" },
            ]}
          />
        ), [{ at: 0, son: "whoosh", volume: 0.3 }]),
        B("Et aujourd'hui", "sombre", "coeur", (c) => (
          <Calques c={c} ecrans={["agenda.jpg", "bilan.jpg", "entrainement.jpg", "nutrition.jpg", "aujourdhui.jpg"]} texte={"Aujourd'hui,\nle *cœur*\nde tout."} />
        ), [{ at: 2, son: "swoosh", volume: 0.3 }], undefined, true),
        B("Regarde bien", "sombre", "regarde", (c) => <TitreSeul c={c} texte={"Regarde *bien*."} style="impact" max={200} />, [{ at: 2, son: "thud", volume: 0.3 }]),
        B("Le matin, tu ouvres", "sombre", "matin", (c, m) => (
          <AppEtapes
            c={c}
            notif={{ at: m("Ton agenda te prévient") + 12, texte: "C'est l'heure de ta séance" }}
            etapes={[
              { at: 0, titre: "Le matin,\ntu ouvres\nl'*appli*.", ecran: "aujourdhui.jpg" },
              { at: m("Tu sais ce que tu manges"), titre: "Ce que tu manges,\n*au gramme près*.", ecran: "nutrition.jpg" },
              { at: m("Tu sais quand"), titre: "Ta séance,\net *ce que tu\nvas y faire*.", ecran: "entrainement.jpg" },
              { at: m("Ton agenda te prévient"), titre: "Ton agenda te\nprévient à la\n*bonne heure*.", ecran: "agenda.jpg" },
              { at: m("Tu n'as rien"), titre: "Rien à\n*réfléchir*.", ecran: "aujourdhui.jpg" },
              { at: m("Tu exécutes"), titre: "Tu *exécutes*." },
            ]}
          />
        ), [{ at: 0, son: "whoosh", volume: 0.3 }]),
        B("Ta diète n'est pas un PDF", "clair", "pdf", (c) => <PdfEndormi c={c} titre={"Ta diète n'est pas\nun PDF qui *dort*."} />, [{ at: 6, son: "thud", volume: 0.3 }]),
        B("Elle vit", "sombre", "vit", (c) => <AppEtapes c={c} vivant={1} etapes={[{ at: 0, titre: "Elle *vit*.", ecran: "nutrition.jpg" }]} max={200} />, [{ at: 0, son: "impact", volume: 0.3 }]),
        B("Un petit écart", "sombre", "ecart", (c, m) => <Anneaux c={c} titre={"Un petit écart ?\n*Ça ne change rien.*"} banane={m("banane")} rien={m("ça ne change rien")} />, [{ at: 20, son: "pop", volume: 0.3 }]),
        B("Tu sautes un repas", "sombre", "repas", (c, m) => (
          <Repas c={c} titre={"Tu sautes un repas ?\nLe suivant *s'adapte*."} saute={10} adapte={m("Le suivant")} verrou={m("sans toucher")} base={m("Ton plan de base")} />
        ), [{ at: 10, son: "thud", volume: 0.25 }]),
        B("Ta séance, tu la notes", "sombre", "carnet", (c, m) => (
          <AppEtapes
            c={c}
            etapes={[
              { at: 0, titre: "Ton carnet\n*d'entraînement*.", ecran: "logbook.jpg" },
              { at: m("Tes charges"), titre: "Charges, reps,\n*records*." },
              { at: m("Tu vois tout de suite"), titre: "Tu vois si tu\n*progresses*…", ecran: "progression.jpg" },
              { at: m("ou si tu stagnes"), titre: "…ou si tu\n*stagnes*." },
            ]}
          />
        ), [{ at: 0, son: "whoosh", volume: 0.3 }]),
        B("Chaque matin", "sombre", "bilan", (c, m) => (
          <Cadran
            c={c}
            valeur={30}
            unite="secondes"
            titre={"Ton bilan\ndu *matin*."}
            pastilles={[
              { texte: "Poids", at: m("Poids") },
              { texte: "Sommeil", at: m("sommeil") },
              { texte: "Ressenti", at: m("ressenti") },
            ]}
          />
        ), [{ at: 6, son: "tick", volume: 0.25 }]),
        B("Et chaque semaine", "sombre", "check-in", (c, m) => (
          <AppEtapes
            c={c}
            etapes={[
              { at: 0, titre: "Chaque semaine,\nton *check-in*.", ecran: "bilan.jpg" },
              { at: m("photos"), titre: "Photos,\nmensurations,\n*tendances*.", ecran: "progression.jpg" },
            ]}
          />
        ), [{ at: 0, son: "whoosh", volume: 0.25 }]),
        B("Pas des chiffres en vrac", "sombre", "phrase", (c, m) => <ChiffresPhrase c={c} range={m("Une phrase claire")} titre={"Pas des chiffres\nen vrac :\n*une phrase\nclaire*."} />),
        B("Et le soir", "sombre", "soir", (c, m) => (
          <Respiration
            c={c}
            titre={"Le soir, quand\ntu ne *décroches\npas*…"}
            items={[
              { texte: "Sons pour dormir", at: m("des sons") },
              { texte: "Respiration", at: m("respiration") },
              { texte: "Méditation guidée", at: m("méditation") },
            ]}
            titre2={{ at: m("Parce que la récup"), texte: "La récup :\n*la moitié* de\ntes résultats." }}
          />
        ), [{ at: 0, son: "swoosh", volume: 0.2 }]),
        B("Ta liste de courses", "clair", "courses", (c) => (
          <Liste
            c={c}
            titre={"Ta liste de courses,\n*tirée de ta diète*."}
            items={[
              { texte: "Protéines", at: 18, etat: "ok" },
              { texte: "Féculents", at: 26, etat: "ok" },
              { texte: "Légumes et fruits", at: 34, etat: "ok" },
            ]}
          />
        ), [{ at: 18, son: "tick", volume: 0.25 }, { at: 26, son: "tick", volume: 0.25 }, { at: 34, son: "tick", volume: 0.25 }]),
        B("Ta road map", "sombre", "road-map", (c, m) => (
          <Chemin
            c={c}
            titre={"Ta *road map*,\nphase par phase."}
            etapes={[
              { texte: "Phase 1", at: 8 },
              { texte: "Phase 2", at: m("phase par phase") },
              { texte: "Phase 3", at: m("phase par phase") + 12 },
              { texte: "Objectif", at: m("phase par phase") + 24 },
            ]}
          />
        )),
        B("Et tu n'es jamais seul", "sombre", "jamais-seul", (c, m) => (
          <Arbre
            c={c}
            moyeu={{ texte: "Jamais seul", at: 4 }}
            pastilles={[
              { valeur: "Communauté", legende: "", at: m("communauté"), icone: ic(Utilisateurs) },
              { valeur: "Lives", legende: "", at: m("les lives"), icone: ic(Video) },
              { valeur: "Messages", legende: "", at: m("messages"), icone: ic(Bulle) },
            ]}
          />
        ), [{ at: 4, son: "pop", volume: 0.25 }]),
        B("Et pour les coachs", "sombre", "coachs", (c, m) => (
          <AppEtapes
            c={c}
            retourne={{ at: m("de l'autre côté") - 6, src: "coach-accueil.jpg" }}
            etapes={[
              { at: 0, titre: "Et pour\nles *coachs* :", ecran: "aujourdhui.jpg" },
              { at: m("c'est le même"), titre: "le même système,\n*de l'autre côté*\nde l'écran." },
            ]}
          />
        ), [{ at: 30, son: "swoosh", volume: 0.3 }]),
        B("Tes clients, leurs bilans", "sombre", "clients", (c, m) => (
          <AppEtapes
            c={c}
            etapes={[
              { at: 0, titre: "Tes clients,\nleurs bilans,\n*au même endroit*.", ecran: "clients.jpg" },
              { at: m("Ceux qui ont besoin"), titre: "Ceux qui ont\nbesoin de toi\n*remontent seuls*.", ecran: "coach-accueil.jpg", reperes: [{ x: 0.03, y: 0.17, w: 0.94, h: 0.42 }] },
            ]}
          />
        )),
        B("Ton agenda, tes lives", "sombre", "mosaique", (c, m) => (
          <Mosaique
            c={c}
            items={[
              { src: "coach-agenda.jpg", label: "Agenda", at: m("Ton agenda, tes lives") },
              { src: "live.jpg", label: "Lives", at: m("tes lives") },
              { src: "equipe.jpg", label: "Équipe", at: m("ton équipe") },
              { src: "stats-reseaux.jpg", label: "Stats", at: m("tes stats") },
              { src: "mailing.jpg", label: "Leads", at: m("tes leads") },
            ]}
          />
        ), [{ at: 0, son: "swoosh", volume: 0.25 }], undefined, true),
        B("Et un studio", "sombre", "studio", (c) => <Studio c={c} titre={"Un studio pour\n*écrire tes vidéos*."} />),
        B("Ce n'est pas de la magie", "clair", "magie", (c, m) => (
          <Camera c={c}>
            <TitresEnEtapes
              c={c}
              zone={Z.plein}
              align="center"
              max={150}
              etapes={[
                { at: 0, titre: "Ce n'est pas\nde la *magie*." },
                { at: m("C'est juste"), titre: "Des principes simples,\n*tous les jours*,\nsans y penser." },
              ]}
            />
          </Camera>
        )),
      ];
    }}
  />
);
