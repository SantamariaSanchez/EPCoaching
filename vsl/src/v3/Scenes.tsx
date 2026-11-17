import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { FPS, SceneResolue } from "../lib/resolve";
import { PolicesPretes } from "../motion/Polices";
import { Fond, Onde, Progression, pop } from "./core";
import { MotsCles, debutPage, pageActive } from "./Texte";
import { Bouton, Cycle, Duo, Gros, Liste, Offre, Photo, Route, Semaine, Telephone, Tendance } from "./Visuels";

const NB_SCENES = 14;

const n = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[«»".,;:!?()]/g, "")
    .trim();

/** Image (locale à la scène) où commence le mot ou l'expression, n-ième occurrence. */
const repere = (sc: SceneResolue) => (texte: string, nth = 0) => {
  const t = n(texte).split(/\s+/);
  let count = 0;
  for (const b of sc.blocs) {
    const ws = b.mots.map((m) => n(m.t));
    for (let i = 0; i + t.length <= ws.length; i++) {
      if (t.every((w, k) => ws[i + k] === w)) {
        if (count === nth) return Math.round(b.mots[i].s * FPS) - 2;
        count++;
      }
    }
  }
  throw new Error(`Scène ${sc.num} : repère « ${texte} » introuvable.`);
};

type R = ReturnType<typeof repere>;
type Plan = { at: number; v: (t0: number) => React.ReactNode | null };

// v3.3 (cut-the-curve) : changement de visuel = coupe en plein mouvement vers la gauche.
// Sortie 0 -> -230 px en power4.in (7 images), entrée +230 -> 0 en power4.out, mêmes
// distance et durée : la vitesse est identique des deux côtés de la coupe.
const Coupe: React.FC<{ at: number; suivant?: number; children: React.ReactNode }> = ({ at, suivant, children }) => {
  const f = useCurrentFrame();
  const DUREE = 7;
  const e = Math.max(0, Math.min(1, (f - at) / DUREE));
  const entree = 1 - Math.pow(1 - e, 4);
  const s = suivant === undefined ? 0 : Math.max(0, Math.min(1, (f - (suivant - DUREE)) / DUREE));
  const sortie = Math.pow(s, 4);
  const x = 230 * (1 - entree) - 230 * sortie;
  const flou = 8 * (1 - entree) + 8 * sortie;
  const opacite = Math.min(0.35 + 0.65 * Math.min(1, e * 2.5), 1 - Math.min(1, s * 1.4));
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}px)`, opacity: opacite, filter: flou > 0.3 ? `blur(${flou.toFixed(1)}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

const Moteur: React.FC<{ scene: SceneResolue; plans: (r: R) => Plan[]; sons?: (r: R) => number[] }> = ({ scene, plans, sons }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = repere(scene);
  const liste = plans(r).sort((a, b) => a.at - b.at);
  const actif = [...liste].reverse().find((p) => f >= p.at);
  const visuel = actif ? actif.v(actif.at) : null;
  const pops = sons ? sons(r) : liste.filter((p) => p.v(p.at) !== null).map((p) => p.at);
  // Mots clés : onde de choc + coup de lumière dans le fond.
  const cles = scene.blocs.flatMap((b) => b.mots.filter((m) => m.em).map((m) => Math.round(m.s * FPS) - 2));
  const dernierCle = [...cles].reverse().find((c) => f >= c);
  const energie = dernierCle === undefined ? 0 : Math.max(0, 1 - (f - dernierCle) / 18);
  // Caméra : dérive lente + petit choc à chaque nouvelle page.
  const pages = scene.pages.map((_, i) => debutPage(scene, i));
  const pi = pageActive(scene, f);
  const choc = 1 - pop(f, fps, pages[pi], 9);
  const cam = `translate(${Math.sin(f / 70) * 10}px, ${Math.cos(f / 85) * 7}px) scale(${1.02 + Math.sin(f / 120) * 0.012 + choc * 0.025}) rotate(${Math.sin(f / 150) * 0.35}deg)`;
  return (
    <AbsoluteFill>
      <Fond teinte={scene.num} energie={energie} />
      <AbsoluteFill style={{ transform: cam }}>
        {visuel ? null : cles.map((c, i) => <Onde key={i} at={c} x={50} y={50} />)}
        {visuel ? <Coupe at={actif!.at} suivant={liste.find((p) => p.at > actif!.at)?.at}>{visuel}</Coupe> : null}
        {visuel ? null : <MotsCles scene={scene} />}
      </AbsoluteFill>
      <Progression part={(scene.num - 1 + f / scene.dureeFrames) / NB_SCENES} />
      {pops.map((at, i) => (
        <Sequence key={`p${i}`} from={Math.max(0, at)} durationInFrames={30} layout="none">
          <Audio src={staticFile("sfx/pop.mp3")} volume={0.16} />
        </Sequence>
      ))}
      {pages.slice(1).map((at, i) => (
        <Sequence key={`w${i}`} from={Math.max(0, Math.round(at) - 3)} durationInFrames={25} layout="none">
          <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const scene = (plans: (r: R) => Plan[]): React.FC<SceneProps> =>
  function SceneV3({ num, scene: sc }) {
    const s = sc ?? sceneParDefaut(num);
    return (
      <AbsoluteFill>
        <PolicesPretes>
          <Moteur scene={s} plans={plans} />
        </PolicesPretes>
        {s.audio ? (
          <Sequence from={Math.round(s.lead * FPS)} layout="none">
            <Audio src={staticFile(s.audio)} name={`voix scène ${s.num}`} />
          </Sequence>
        ) : null}
      </AbsoluteFill>
    );
  };

const rien = (at: number): Plan => ({ at, v: () => null });

export const SCENES_V3: Record<number, React.FC<SceneProps>> = {
  1: scene((r) => [
    { at: r("Des séances"), v: (t0) => <Cycle t0={t0} labels={[{ texte: "Je commence", at: r("commencé") }, { texte: "J'arrête", at: r("arrêté") }, { texte: "J'y repense", at: r("y penses") }]} /> },
    rien(r("Si c'est toi")),
  ]),
  2: scene((r) => [
    { at: r("Emmanuel"), v: (t0) => <Photo t0={t0} src="img/hero_current.jpg" legende="Emmanuel" /> },
    { at: r("Colombie"), v: (t0) => <Gros t0={t0} texte="Colombie" sous="né à Girardota · vit à Annecy" /> },
    { at: r("Il est coach"), v: (t0) => <Photo t0={t0} src="img/gym_pose.jpg" incline={2} /> },
    { at: r("il accompagne"), v: (t0) => <Liste t0={t0} items={[{ texte: "Débutantes", at: r("débutantes") }, { texte: "Perdre du gras", at: r("perdre du gras") }, { texte: "Aimer leur corps", at: r("aimer") }]} /> },
  ]),
  3: scene((r) => [
    { at: r("trois choses"), v: (t0) => <Gros t0={t0} texte="3" sous="choses que tu te dis" /> },
    { at: r("Un"), v: (t0) => <Semaine t0={t0} at={r("vrai emploi du temps")} /> },
    { at: r("Deux"), v: (t0) => <Liste t0={t0} signe="num" items={[{ texte: "Trop débutante ?", at: r("trop débutante") }, { texte: "C'est au début", at: r("au début") }, { texte: "Quoi faire à la salle", at: r("quoi faire") }]} /> },
    { at: r("Trois"), v: (t0) => <Liste t0={t0} items={[{ texte: "Un plan simple", at: r("un plan") }, { texte: "Qui tient", at: r("qui tient") }, { texte: "Même quand ça déborde", at: r("déborde") }]} /> },
  ]),
  4: scene((r) => [
    { at: r("Tu arrives"), v: (t0) => <Liste t0={t0} items={[{ texte: "Tu sais quoi faire", at: r("exactement") }, { texte: "Samedi soir, tes amies", at: r("amies") }, { texte: "Lundi, tu continues", at: r("le lundi") }, { texte: "Tu vois ce qui a changé", at: r("a changé") }]} /> },
    { at: r("C'est ce qu'on construit"), v: (t0) => <Gros t0={t0} texte="6 mois" sous="étape par étape" /> },
  ]),
  5: scene((r) => [
    { at: r("le cardio"), v: (t0) => <Liste t0={t0} signe="num" items={[{ texte: "Le cardio et le ventre", at: r("le cardio") }, { texte: "Perdre du gras sans faim", at: r("sans avoir faim") }, { texte: "La balance qui ment", at: r("la balance") }, { texte: "La semaine où tu craques", at: r("craquent") }]} /> },
  ]),
  6: scene((r) => [
    { at: r("Trois séances"), v: (t0) => <Liste t0={t0} signe="non" items={[{ texte: "Trois séances", at: r("Trois séances"), barre: r("Ça tient") }, { texte: "Zéro sucre", at: r("zéro sucre"), barre: r("Ça tient") + 4 }, { texte: "Plus de soirées", at: r("plus de soirées"), barre: r("Ça tient") + 8 }]} /> },
    rien(r("Il te faut un plan")),
  ]),
  7: scene((r) => [
    { at: r("Premier pilier"), v: (t0) => <Gros t0={t0} texte="01" sous="la salle, avant le cardio" /> },
    { at: r("Des heures de tapis"), v: (t0) => <Telephone t0={t0} src="img/app/entrainement.jpg" label="Ta séance du jour" /> },
    { at: r("fessiers"), v: (t0) => <Liste t0={t0} items={[{ texte: "Des fessiers", at: r("fessiers") }, { texte: "Des épaules", at: r("épaules") }, { texte: "Une silhouette équilibrée", at: r("silhouette") }]} /> },
  ]),
  8: scene((r) => [
    { at: r("Deuxième pilier"), v: (t0) => <Gros t0={t0} texte="02" sous="manger plus, pour perdre plus" /> },
    { at: r("Tu manges à ta faim"), v: (t0) => <Telephone t0={t0} src="img/app/nutrition.jpg" label="Tes repas, déjà prévus" /> },
    { at: r("trois fois rien"), v: (t0) => <Liste t0={t0} signe="non" items={[{ texte: "Tu as faim", at: r("tu as faim") }, { texte: "Tu es fatiguée", at: r("fatiguée") }, { texte: "Tu craques le soir", at: r("craques") }]} /> },
    { at: r("On garde"), v: (t0) => <Liste t0={t0} items={[{ texte: "Les repas que tu aimes", at: r("On garde") }, { texte: "Des protéines à chaque repas", at: r("protéines") }, { texte: "Des aliments qui calent", at: r("calent") }]} /> },
  ]),
  9: scene((r) => [
    { at: r("Troisième pilier"), v: (t0) => <Gros t0={t0} texte="03" sous="la tendance, pas la balance" /> },
    { at: r("Si tu te pèses"), v: (t0) => <Tendance t0={t0} tendanceAt={r("la tendance")} /> },
  ]),
  10: scene((r) => [
    { at: r("Quatrième pilier"), v: (t0) => <Gros t0={t0} texte="04" sous="l'écart fait partie du plan" /> },
    { at: r("Elles craquent"), v: (t0) => <Cycle t0={t0} labels={[{ texte: "Je craque", at: r("Elles craquent") }, { texte: "Je me punis", at: r("punissent") }, { texte: "Je saute un repas", at: r("sautent") }]} /> },
    { at: r("Un écart"), v: (t0) => <Liste t0={t0} items={[{ texte: "Un écart = un repas", at: r("Un écart") }, { texte: "Le suivant s'adapte", at: r("s'adapte") }, { texte: "Tu continues", at: r("tu continues") }]} /> },
  ]),
  11: scene((r) => [
    {
      at: r("Le premier mois"),
      v: (t0) => (
        <Route
          t0={t0}
          etapes={[
            { titre: "Les bases", sous: "Mois 1", at: r("Le premier mois") },
            { titre: "Confiance à la salle", sous: "Ensuite", at: r("confiance") },
            { titre: "On affine", sous: "Puis", at: r("on affine") },
            { titre: "Tu sais faire seule", sous: "Mois 6", at: r("six mois") },
          ]}
        />
      ),
    },
  ]),
  12: scene((r) => [
    {
      at: r("Un programme"),
      v: (t0) => (
        <Offre
          t0={t0}
          tuiles={[
            { titre: "Programme", at: r("Un programme") },
            { titre: "Diète", at: r("une diète") },
            { titre: "Roadmap", at: r("roadmap") },
            { titre: "Check-in hebdo", at: r("un check-in") },
            { titre: "Corrections vidéo", at: r("on corrige") },
            { titre: "Suivi H24", at: r("n'importe quelle heure") },
            { titre: "7 formats de live", at: r("sept formats") },
            { titre: "5 formations", at: r("cinq formations") },
            { titre: "L'appli complète", at: r("toute l'appli") },
            { titre: "Jamais seule", at: r("jamais seule") },
          ]}
        />
      ),
    },
  ]),
  13: scene((r) => [
    { at: r("même endroit"), v: (t0) => <Telephone t0={t0} src="img/app/aujourdhui.jpg" label="Aujourd'hui" /> },
    { at: r("Ta séance"), v: (t0) => <Telephone t0={t0} src="img/app/entrainement.jpg" label="Ta séance" /> },
    { at: r("Tes repas"), v: (t0) => <Telephone t0={t0} src="img/app/nutrition.jpg" label="Tes repas" /> },
    { at: r("Ton bilan"), v: (t0) => <Telephone t0={t0} src="img/app/bilan.jpg" label="Ton bilan" /> },
  ]),
  14: scene((r) => [
    { at: r("audit stratégique"), v: (t0) => <Bouton t0={t0} titre="Audit stratégique offert" details={["30 min", "1:1", "offert"]} /> },
    { at: r("On regarde"), v: (t0) => <Liste t0={t0} items={[{ texte: "Ta situation", at: r("ta situation") }, { texte: "Ton objectif", at: r("ton objectif") }, { texte: "Ton emploi du temps", at: r("emploi du temps") }]} /> },
    { at: r("Dans le pire"), v: (t0) => <Duo t0={t0} a={{ titre: "Au pire", texte: "Un plan clair", at: r("Dans le pire") }} b={{ titre: "Au mieux", texte: "6 mois ensemble", at: r("Dans le meilleur") }} /> },
    { at: r("Le lien"), v: (t0) => <Bouton t0={t0} titre="Réserve ton audit" details={["lien sous la vidéo"]} /> },
  ]),
};
