import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, MONTSERRAT, blancA } from "../lib/brand";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { EASE, EASE_IN, Layout, prog, useCues } from "../lib/scene";
import { KineticText } from "../components/KineticText";
import { Logo, Shell } from "../components/Shell";
import { LightLeak } from "../components/Fond";
import { Chip, Sfx } from "../components/primitives";
import { CartesSite } from "../components/CartesSite";
import { Phone } from "../components/Phone";

// Scène 7, fin : le récapitulatif, le système, l'appel offert, les boutons, le logo.
const Contenu: React.FC = () => {
  const { cue, mot, total } = useCues();
  const c = {
    recap: cue("récapituler"),
    infos: cue("pas d'infos"),
    priorites: cue("Tu manques de priorités"),
    suivi: cue("de suivi"),
    systeme: cue("et d'un système"),
    existe: cue("il existe"),
    offre: cue("je te l'offre"),
    chose: cue("une chose à faire"),
    bouton: cue("Choisis ton bouton"),
    dessous: cue("juste en dessous"),
    reserve: cue("réserve ton appel"),
    vite: cue("à très vite"),
  };
  const layoutAt = (fr: number): Layout =>
    fr < c.infos ? "plein" : fr < c.chose ? "gauche" : fr < c.bouton ? "plein" : fr < c.vite ? "haut" : "pied";

  return (
    <>
      <Chip texte="Des infos" at={c.infos} x={1080} y={250} variante="barre" barreAt={mot("d'infos") + 8} size={60} fin={c.existe - 8} />
      <Chip texte="Des priorités" at={c.priorites + 6} x={1080} y={420} variante="check" size={60} fin={c.existe - 8} />
      <Chip texte="Du suivi" at={c.suivi} x={1080} y={570} variante="check" size={60} fin={c.existe - 8} />
      <Chip texte="Un système" at={c.systeme} x={1080} y={720} variante="plein" size={60} fin={c.existe - 8} />

      <Phone x={1180} y={600} h={620} tilt={-20} enter={c.existe - 4} sortie={c.chose - 10} ecrans={[{ src: "aujourdhui", at: c.existe - 4 }]} />
      <Phone x={1450} y={560} h={700} tilt={-8} enter={c.existe + 4} sortie={c.chose - 10} ecrans={[{ src: "nutrition", at: c.existe + 4 }]} />
      <Phone x={1720} y={600} h={620} tilt={4} enter={c.existe + 12} sortie={c.chose - 10} ecrans={[{ src: "coach-accueil", at: c.existe + 12 }]} />
      <Chip texte="Premier appel offert" at={c.offre} x={1450} y={960} variante="plein" size={44} anchor="center" fin={c.chose - 10} />

      <CartesSite at={c.bouton} y={470} fleche surligne={[c.dessous, c.dessous + 20]} fin={c.vite - 10} />

      <Fin at={c.vite - 6} total={total} />

      <KineticText layoutAt={layoutAt} />

      <Sfx at={mot("d'infos") + 8} son="thud" volume={0.3} />
      <Sfx at={c.priorites + 6} son="pop" volume={0.3} />
      <Sfx at={c.suivi} son="pop" volume={0.3} />
      <Sfx at={c.systeme} son="pop" volume={0.35} />
      <Sfx at={c.existe - 4} son="whoosh" volume={0.3} />
      <Sfx at={c.offre} son="bell" volume={0.3} />
      <Sfx at={c.bouton} son="whoosh" volume={0.3} />
      <Sfx at={c.vite - 6} son="impact" volume={0.45} />
    </>
  );
};

const Fin: React.FC<{ at: number; total: number }> = ({ at, total }) => {
  const f = useCurrentFrame();
  if (f < at - 2) return null;
  const p = prog(f, at + 14, at + 34, EASE);
  const o = prog(f, total - 16, total, EASE_IN);
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      <LightLeak p={(f - at) / 70} force={0.9} />
      <Logo at={at} x={960} y={400} w={520} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: MONTSERRAT, opacity: p, translate: `0 ${(1 - p) * 20}px` }}>
        <div style={{ fontWeight: 900, fontSize: 44, letterSpacing: "-0.03em", color: C.blanc }}>Emmanuel Santamaria Sanchéz</div>
        <div style={{ marginTop: 12, fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: blancA(0.6) }}>COACH, FONDATEUR D'EP COACHING</div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene7: React.FC<SceneProps> = ({ scene }) => (
  <Shell scene={scene ?? sceneParDefaut(7)} fond={{ x: 50, y: 45 }}>
    <Contenu />
  </Shell>
);
