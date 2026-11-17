import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { FPS, SceneResolue } from "../lib/resolve";
import { PolicesPretes } from "../motion/Polices";
import { Defile, Fond, Progression } from "../v3/core";
import { Typo, debutPage } from "./Texte";
import { Bouton, Boucle, Jour1, Sol, Cartes, Compteur, Courbe, Duo, Offre, PhotoCine, Pilier, Route, Semaine, Telephone, Titre, Trajet, eo } from "./Kit";

// VSL v4 (17/11/2026) : un visuel riche par idée + typographie cinétique toujours présente.
// Caméra avec intention : chaque plan avance lentement vers le sujet et glisse vers la gauche
// (sens dominant du film), coupe en plein mouvement vers la gauche entre deux plans.

const NB_SCENES = 14;
const MOT_FOND: Record<number, string> = { 1: "Recommencer", 2: "Emmanuel", 3: "Excuses", 4: "Imagine", 5: "Au programme", 6: "Ton plan", 7: "Musculation", 8: "Manger plus", 9: "Tendance", 10: "Écart", 11: "Six mois", 12: "Coaching EP", 13: "L'appli", 14: "Ton audit" };

const n = (s: string) =>
  s.toLowerCase().replace(/[’]/g, "'").replace(/[«»".,;:!?()]/g, "").trim();

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

const DUREE = 8;
const Coupe: React.FC<{ at: number; suivant?: number; children: React.ReactNode }> = ({ at, suivant, children }) => {
  const f = useCurrentFrame();
  const e = Math.max(0, Math.min(1, (f - at) / DUREE));
  const entree = 1 - Math.pow(1 - e, 4);
  const s = suivant === undefined ? 0 : Math.max(0, Math.min(1, (f - (suivant - DUREE)) / DUREE));
  const sortie = Math.pow(s, 4);
  const x = 320 * (1 - entree) - 320 * sortie;
  // Caméra : poussée lente vers le sujet pendant tout le plan.
  const fin = suivant ?? at + 240;
  const pousse = eo(f, at, fin, 0, 1);
  return (
    <AbsoluteFill style={{ transform: `translateX(${x - pousse * 30}px) scale(${1 + pousse * 0.045})`, opacity: Math.min(0.2 + 0.8 * Math.min(1, e * 2.2), 1 - Math.min(1, s * 1.3)) }}>
      {children}
    </AbsoluteFill>
  );
};

const Moteur: React.FC<{ scene: SceneResolue; plans: (r: R) => Plan[] }> = ({ scene, plans }) => {
  const f = useCurrentFrame();
  const r = repere(scene);
  const liste = plans(r).sort((a, b) => a.at - b.at);
  const actif = [...liste].reverse().find((p) => f >= p.at);
  const visuel = actif ? actif.v(actif.at) : null;
  const pops = liste.filter((p) => p.v(p.at) !== null).map((p) => p.at);
  const cles = scene.blocs.flatMap((b) => b.mots.filter((m) => m.em).map((m) => Math.round(m.s * FPS) - 2));
  const dernierCle = [...cles].reverse().find((c) => f >= c);
  const energie = dernierCle === undefined ? 0 : Math.max(0, 1 - (f - dernierCle) / 18);
  const pages = scene.pages.map((_, i) => debutPage(scene, i));
  // Flash de coupe : une fine lame de lumière balaie l'écran à chaque nouveau visuel.
  const dernierPlan = [...pops].reverse().find((p) => f >= p);
  const lame = dernierPlan === undefined ? -1 : (f - dernierPlan) / 10;
  return (
    <AbsoluteFill>
      <Fond teinte={scene.num} energie={energie} />
      <Sol />
      <div style={{ position: "absolute", inset: 0, opacity: 0.7 }}><Defile texte={MOT_FOND[scene.num] ?? scene.titre} /></div>
      {visuel ? <Coupe at={actif!.at} suivant={liste.find((p) => p.at > actif!.at)?.at}>{visuel}</Coupe> : null}
      {lame >= 0 && lame <= 1 ? <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-20 + lame * 140}%`, width: 120, background: "linear-gradient(90deg, transparent, rgba(255,220,220,0.10), transparent)", transform: "skewX(-20deg)" }} /> : null}
      {visuel ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: "linear-gradient(180deg, transparent, rgba(13,0,0,0.85) 45%)" }} /> : null}
      <Typo scene={scene} mode={visuel ? "bandeau" : "plein"} />
      <Progression part={(scene.num - 1 + f / scene.dureeFrames) / NB_SCENES} />
      {pops.map((at, i) => (
        <Sequence key={`p${i}`} from={Math.max(0, at)} durationInFrames={30} layout="none">
          <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.09} />
        </Sequence>
      ))}
      {cles.map((at, i) => (
        <Sequence key={`c${i}`} from={Math.max(0, at)} durationInFrames={20} layout="none">
          <Audio src={staticFile("sfx/pop.mp3")} volume={0.1} />
        </Sequence>
      ))}
      {pages.length ? null : null}
    </AbsoluteFill>
  );
};

const scene = (plans: (r: R) => Plan[]): React.FC<SceneProps> =>
  function SceneV4({ num, scene: sc }) {
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

export const SCENES_V4: Record<number, React.FC<SceneProps>> = {
  1: scene((r) => [
    { at: r("Tu as déjà"), v: (t0) => <Jour1 t0={t0} ats={[r("Tu as déjà"), r("Plusieurs fois"), r("Plusieurs fois") + 9, r("Plusieurs fois") + 18]} /> },
    { at: r("Des séances"), v: (t0) => <Boucle t0={t0} centre="Encore ?" etapes={[{ texte: "Je commence", at: r("Des séances") }, { texte: "Semaine chargée", at: r("semaine chargée") }, { texte: "Tout s'arrête", at: r("tout s'est arrêté") }]} /> },
    rien(r("Depuis")),
  ]),
  2: scene((r) => [
    { at: r("Emmanuel"), v: (t0) => <PhotoCine t0={t0} src="img/hero_current.jpg" pos="50% 12%" tag="Emmanuel" badges={[{ texte: "17 ans", at: r("dix-sept ans") }]} /> },
    { at: r("Colombie"), v: (t0) => <Trajet t0={t0} departAt={r("Colombie")} arriveeAt={r("Annecy")} /> },
    { at: r("Il est coach"), v: (t0) => <PhotoCine t0={t0} src="img/gym_pose.jpg" tag="Coach" cote="g" /> },
    { at: r("il accompagne"), v: (t0) => <Cartes t0={t0} items={[{ texte: "Débutantes", at: r("débutantes") }, { texte: "Perdre du gras", at: r("perdre du gras") }, { texte: "Aimer leur corps", at: r("aimer") }]} /> },
  ]),
  3: scene((r) => [
    { at: r("trois choses"), v: (t0) => <Titre t0={t0} texte="3" fantome="3" sous="choses que tu te dis" /> },
    { at: r("Un"), v: (t0) => <Semaine t0={t0} contraintes={[{ texte: "Cours", at: r("Les cours") }, { texte: "Boulot", at: r("le boulot") }, { texte: "Amies", at: r("tes amies") }]} seancesAt={r("vrai emploi du temps")} /> },
    { at: r("Deux"), v: (t0) => <Cartes t0={t0} signe="num" items={[{ texte: "Trop débutante ?", at: r("trop débutante") }, { texte: "Le besoin, c'est au début", at: r("au début") }, { texte: "Quoi faire à la salle", at: r("quoi faire") }]} /> },
    { at: r("Trois"), v: (t0) => <Cartes t0={t0} items={[{ texte: "La régularité se construit", at: r("se construit") }, { texte: "Un plan qui tient", at: r("un plan") }, { texte: "Même quand ça déborde", at: r("déborde") }]} /> },
  ]),
  4: scene((r) => [
    rien(r("Maintenant")),
    { at: r("Tu arrives"), v: (t0) => <Cartes t0={t0} items={[{ texte: "Tu sais quoi faire", at: r("exactement") }, { texte: "Samedi soir, tes amies", at: r("amies") }, { texte: "Lundi, tu continues", at: r("le lundi") }, { texte: "Tu vois ce qui a changé", at: r("a changé") }]} /> },
    { at: r("C'est ce qu'on construit"), v: (t0) => <Compteur t0={t0} valeur={6} unite="mois" sous="étape par étape" /> },
  ]),
  5: scene((r) => [
    { at: r("le cardio"), v: (t0) => <Cartes t0={t0} signe="num" titre="Dans cette vidéo" items={[{ texte: "Cardio et ventre", at: r("le cardio") }, { texte: "Perdre du gras sans faim", at: r("sans avoir faim") }, { texte: "La balance qui ment", at: r("la balance") }, { texte: "La semaine où tu craques", at: r("craquent") }]} /> },
  ]),
  6: scene((r) => [
    { at: r("Trois séances"), v: (t0) => <Cartes t0={t0} signe="non" titre="Le plan de quelqu'un d'autre" items={[{ texte: "Trois séances", at: r("Trois séances"), barre: r("Ça tient") }, { texte: "Zéro sucre", at: r("zéro sucre"), barre: r("Ça tient") + 5 }, { texte: "Plus de soirées", at: r("plus de soirées"), barre: r("Ça tient") + 10 }]} /> },
    { at: r("Il te faut un plan"), v: (t0) => <Titre t0={t0} texte="Ton plan" sous="simple, et que tu tiens" /> },
  ]),
  7: scene((r) => [
    { at: r("Premier pilier"), v: (t0) => <Pilier t0={t0} num={1} titre="La salle, avant le cardio" /> },
    { at: r("Des heures de tapis"), v: (t0) => <Telephone t0={t0} src="img/app/entrainement.jpg" titre="Ce qui dessine tes formes" bulles={[{ texte: "Musculation", at: r("La musculation") }, { texte: "Pas trop massive", at: r("trop massive") }]} /> },
    { at: r("fessiers"), v: (t0) => <Cartes t0={t0} items={[{ texte: "Des fessiers", at: r("fessiers") }, { texte: "Des épaules", at: r("épaules") }, { texte: "Une silhouette équilibrée", at: r("silhouette") }]} /> },
    { at: r("On ne perd pas"), v: (t0) => <Titre t0={t0} texte="Tu choisis" sous="ce que tu construis" /> },
  ]),
  8: scene((r) => [
    { at: r("Deuxième pilier"), v: (t0) => <Pilier t0={t0} num={2} titre="Manger plus, pour perdre plus" /> },
    { at: r("trois fois rien"), v: (t0) => <Cartes t0={t0} signe="non" items={[{ texte: "Tu as faim", at: r("tu as faim") }, { texte: "Tu es fatiguée", at: r("fatiguée") }, { texte: "Tu craques le soir", at: r("craques") }]} /> },
    { at: r("On garde"), v: (t0) => <Telephone t0={t0} src="img/app/nutrition.jpg" titre="Tes repas, déjà prévus" bulles={[{ texte: "Les repas que tu aimes", at: r("On garde") }, { texte: "Protéines à chaque repas", at: r("protéines") }, { texte: "Des aliments qui calent", at: r("calent") }]} /> },
    { at: r("Tu manges à ta faim"), v: (t0) => <Titre t0={t0} texte="À ta faim" sous="et le gras part quand même" /> },
  ]),
  9: scene((r) => [
    { at: r("Troisième pilier"), v: (t0) => <Pilier t0={t0} num={3} titre="La tendance, pas la balance" /> },
    { at: r("Un kilo"), v: (t0) => <Courbe t0={t0} restoAt={r("Un kilo")} tendanceAt={r("la tendance")} /> },
  ]),
  10: scene((r) => [
    { at: r("Quatrième pilier"), v: (t0) => <Pilier t0={t0} num={4} titre="L'écart fait partie du plan" /> },
    { at: r("Elles craquent"), v: (t0) => <Boucle t0={t0} centre="Encore plus fort" etapes={[{ texte: "Je craque", at: r("Elles craquent") }, { texte: "Je me punis", at: r("punissent") }, { texte: "Je saute un repas", at: r("sautent") }]} /> },
    { at: r("Un écart"), v: (t0) => <Cartes t0={t0} items={[{ texte: "Un écart = un repas", at: r("Un écart") }, { texte: "Le suivant s'adapte", at: r("s'adapte") }, { texte: "Tu continues", at: r("tu continues") }]} /> },
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
    { at: r("C'est exactement"), v: (t0) => <Titre t0={t0} texte="Coaching EP" sous="6 mois, ensemble" /> },
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
    {
      at: r("même endroit"),
      v: (t0) => (
        <Telephone
          t0={t0}
          src="img/app/aujourdhui.jpg"
          ecrans={[
            { src: "img/app/aujourdhui.jpg", titre: "Tout au même endroit", at: r("même endroit") },
            { src: "img/app/entrainement.jpg", titre: "Ta séance du jour", at: r("Ta séance") },
            { src: "img/app/nutrition.jpg", titre: "Tes repas", at: r("Tes repas") },
            { src: "img/app/bilan.jpg", titre: "Ton bilan du matin", at: r("Ton bilan") },
          ]}
          bulles={[{ texte: "Exercices en vidéo", at: r("en vidéo") }, { texte: "30 secondes", at: r("trente secondes") }, { texte: "Tu sais quoi faire", at: r("tu sais quoi faire") }]}
        />
      ),
    },
  ]),
  14: scene((r) => [
    { at: r("audit stratégique"), v: (t0) => <Bouton t0={t0} titre="Audit stratégique offert" details={["30 min", "avec Emmanuel", "offert"]} clicAt={r("Il est offert")} /> },
    { at: r("On regarde"), v: (t0) => <Cartes t0={t0} items={[{ texte: "Ta situation", at: r("ta situation") }, { texte: "Ton objectif", at: r("ton objectif") }, { texte: "Ton emploi du temps", at: r("emploi du temps") }]} /> },
    { at: r("Dans le pire"), v: (t0) => <Duo t0={t0} a={{ titre: "Au pire", texte: "Un plan clair", at: r("Dans le pire") }} b={{ titre: "Au mieux", texte: "6 mois ensemble", at: r("Dans le meilleur") }} /> },
    { at: r("Le lien"), v: (t0) => <Bouton t0={t0} titre="Réserve ton audit" details={["lien sous la vidéo"]} clicAt={r("À tout de suite")} /> },
  ]),
};
