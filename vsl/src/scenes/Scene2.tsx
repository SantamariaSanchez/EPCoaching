import React from "react";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { fabrique, Plan } from "../motion/Plan";
import { Camera, Chapitre, Courbe, PhotoTitre, TitreSeul } from "../motion/modules";
import { p, sp } from "../motion/anim";
import { Ctx } from "../motion/Beats";
import { Titre } from "../motion/Titre";
import { Avalanche, Grille, Pont, Scan } from "../motion/m-fx";
import { Rangee } from "../motion/m-listes";
import { Identite, Competition } from "../motion/m-perso";
import { Calendrier, Fourchette, Halteres, Lune } from "../motion/Icones";
import { FONT, TH } from "../motion/tokens";

const ic = (I: typeof Halteres, theme: "clair" | "sombre" = "sombre") => <I size={84} color={TH[theme].accent} stroke={2} />;

// Scène 2, qui je suis : présentation (photos réelles), le parcours (À VALIDER), la méthode, puis le vrai problème.
export const Scene2: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan
    scene={scene ?? sceneParDefaut(num)}
    construire={(q) => {
      const B = fabrique(q);
      return [
        B(0, "clair", "chapitre", (c) => <Chapitre c={c} num={2} titre="Qui je suis" />),
        B("Alors avant ça", "clair", "presente", (c) => <TitreSeul c={c} texte={"Avant ça,\nje me *présente*."} />),
        B("Moi c'est Santamaria", "clair", "identite", (c) => <Identite c={c} />, [{ at: 0, son: "whoosh", volume: 0.3 }]),
        B("Je suis coach en bodybuilding", "clair", "natural", (c) => (
          <PhotoTitre c={c} src="gym_pose.jpg" pos="50% 30%" texte={"Coach en\nbodybuilding\n*natural*."} surtitre="Mon métier" />
        )),
        B("et je prépare la Heroes Cup", "sombre", "competition", (c, m) => <Competition c={c} classic={m("Classic")} federation={m("fédération")} />, [{ at: 0, son: "impact", volume: 0.3 }]),
        B("J'ai commencé la muscu", "clair", "debut", (c) => <PhotoTitre c={c} src="debut_2022a.jpg" pos="50% 35%" texte={"J'ai commencé\n*comme tout\nle monde*."} cote="gauche" />),
        B("Des programmes trouvés", "clair", "copies", (c, m) => (
          <Avalanche c={c} etapes={[{ at: 0, titre: "Des programmes\n*d'internet*," }, { at: m("diètes"), titre: "des diètes\n*copiées*…" }]} />
        ), [{ at: 0, son: "whoosh", volume: 0.25 }], undefined, true),
        B("des mois sans vraiment savoir", "clair", "sans-savoir", (c) => <Courbe c={c} texte={"Sans savoir\nsi j'*avançais*."} mode="chaos" titreCarte="Mes progrès ?" legende="Des mois au feeling" />),
        B("Et un jour", "sombre", "mesurer", (c) => <Scan c={c} src="gym_locker.jpg" pos="50% 30%" titre={"Un jour,\nj'ai décidé de\ntout *mesurer*."} />, [{ at: 0, son: "riser", volume: 0.2 }]),
        B("de tout structurer", "sombre", "structurer", (c) => (
          <Grille
            c={c}
            titre={"Tout\n*structurer*."}
            range={10}
            items={[
              { texte: "Diète", icone: ic(Fourchette) },
              { texte: "Training", icone: ic(Halteres) },
              { texte: "Sommeil", icone: ic(Lune) },
              { texte: "Agenda", icone: ic(Calendrier) },
            ]}
          />
        ), [{ at: 10, son: "thud", volume: 0.3 }]),
        B("et de ne plus rien laisser au hasard", "sombre", "hasard", (c) => <TitreSeul c={c} texte={"Plus rien\nau *hasard*."} style="impact" max={190} />, [{ at: 2, son: "impact", volume: 0.3 }]),
        B("Ça veut dire une chose", "clair", "simple", (c) => <TitreSeul c={c} texte={"Une chose\n*très simple* :"} />),
        B("tout ce que je vais te dire", "clair", "sur-moi", (c) => (
          <PhotoTitre c={c} src="proof_photo.jpg" pos="50% 30%" texte={"Ce que je te dis,\nje l'applique\n*d'abord sur moi*."} />
        )),
        B("Ma diète, mon training", "sombre", "quatre", (c, m) => (
          <Rangee
            c={c}
            items={[
              { texte: "Ma diète", at: m("diète"), icone: ic(Fourchette) },
              { texte: "Mon training", at: m("training"), icone: ic(Halteres) },
              { texte: "Mon sommeil", at: m("sommeil"), icone: ic(Lune) },
              { texte: "Mon agenda", at: m("agenda"), icone: ic(Calendrier) },
            ]}
          />
        ), [{ at: 0, son: "pop", volume: 0.2 }]),
        B("Tous les jours", "sombre", "tous-les-jours", (c) => <SeptJours c={c} />),
        B("Et à force de coacher", "clair", "un-truc", (c) => <TitreSeul c={c} texte={"À force de coacher,\nj'ai compris\n*un truc*."} />),
        B("Le problème des gens", "clair", "pas-infos", (c) => <TitreSeul c={c} texte={"Le problème,\nce n'est pas\nle *manque d'infos*."} />),
        B("Des infos, il y en a partout", "clair", "partout", (c, m) => (
          <Avalanche
            c={c}
            acceleration={m("Gratuitement")}
            etapes={[
              { at: 0, titre: "Des infos,\n*partout*." },
              { at: m("Gratuitement"), titre: "*Gratuites*." },
              { at: m("Tout le temps"), titre: "*Tout\nle temps*." },
            ]}
          />
        ), [{ at: 0, son: "swoosh", volume: 0.25 }], undefined, true),
        B("Le vrai problème", "clair", "pont", (c, m) => (
          <Pont
            c={c}
            relabel={m("Entre le moment")}
            jours={[m("tous les jours", 1), m("C'est là que presque")]}
            casse={m("lâche")}
            etapes={[
              { at: 0, titre: "Le *vrai* problème :" },
              { at: m("entre l'info"), titre: "ce qui se passe\n*entre les deux*." },
              { at: m("Entre le moment"), titre: "Entre savoir…\net *faire vraiment*." },
              { at: m("tous les jours", 1), titre: "Tous les jours,\n*pendant des mois*." },
              { at: m("C'est là que presque"), titre: "Là, presque tout\nle monde *lâche*." },
            ]}
          />
        ), [{ at: 0, son: "whoosh", volume: 0.25 }]),
        B("Et c'est là que moi", "sombre", "je-travaille", (c) => <TitreSeul c={c} texte={"Et c'est là\nque moi,\n*je travaille*."} max={170} />, [{ at: 0, son: "impact", volume: 0.35 }]),
      ];
    }}
  />
);

// Sept jours qui s'allument (L à D).
const SeptJours: React.FC<{ c: Ctx }> = ({ c }) => {
  const th = TH[c.theme];
  const jours = ["L", "M", "M", "J", "V", "S", "D"];
  const T = 150;
  const gap = 36;
  const x0 = 960 - (7 * T + 6 * gap) / 2;
  return (
    <Camera c={c}>
      <Titre texte={"*Tous* les jours."} zone={{ x: 160, y: 170, w: 1600, h: 220 }} theme={c.theme} f={c.f} debut={0} sortie={c.sortie} align="center" max={150} />
      {jours.map((j, k) => {
        const at = 6 + k * 3;
        const t = sp(c.f, at, "rebond");
        const on = p(c.f, at, at + 6);
        return (
          <div key={k} data-zone={`j-${k}`} style={{ position: "absolute", left: x0 + k * (T + gap), top: 560, width: T, height: T, opacity: (1 - c.sortie) * Math.min(1, t * 2), transform: `translateY(${(1 - t) * 80}px)` }}>
            <div
              data-bloc
              style={{
                width: T,
                height: T,
                borderRadius: T,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: on > 0.5 ? th.accent : "transparent",
                boxShadow: `0 0 0 4px ${th.accent}, 0 0 ${40 * on}px rgba(255,60,48,${0.6 * on})`,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 60,
                color: on > 0.5 ? "#fff" : th.accent,
              }}
            >
              {j}
            </div>
          </div>
        );
      })}
    </Camera>
  );
};
