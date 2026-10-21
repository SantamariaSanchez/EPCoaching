import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, MONTSERRAT, blancA } from "../lib/brand";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { EASE, Layout, prog, useCues } from "../lib/scene";
import { KineticText } from "../components/KineticText";
import { Shell } from "../components/Shell";
import { Coche, Compteur, Sfx, VoletRouge } from "../components/primitives";
import { Agenda, BarreVideo, Courbe, Panneau } from "../components/visuels";
import { Calendrier, Halteres } from "../components/Icones";

// Scène 1, ouverture : on parle d'abord au pratiquant (photos réelles d'entraînement,
// courbe plate du miroir), puis au coach (agenda vide), puis on promet la suite.
const Contenu: React.FC = () => {
  const { cue, mot, fin, total } = useCues();
  const c = {
    entraine: cue("Tu t'entraînes"),
    mange: cue("Tu fais attention"),
    miroir: cue("quand tu te regardes"),
    bouge: cue("rien ne bouge"),
    coach: cue("Ou alors tu es coach"),
    metier: cue("Tu connais ton métier"),
    vide: cue("il reste vide"),
    deux: cue("deux cas"),
    bonne: cue("la bonne vidéo"),
    bout: cue("jusqu'au bout"),
    jamais: cue("ne le voient jamais"),
  };
  const layoutAt = (fr: number): Layout => (fr < c.coach ? "gauche" : fr < c.deux ? "droite" : fr < c.bout ? "haut" : "plein");

  return (
    <>
      {/* 1. Pratiquant : entraînement, assiette, miroir */}
      <Panneau src="training_deadlift.jpg" at={0} fin={c.mange + 8} pos="50% 40%" zoom={[1.22, 1.06]} />
      <Panneau src="food1.jpg" at={c.mange - 4} fin={c.miroir + 6} pos="50% 50%" entree="monte" zoom={[1.15, 1.02]} />
      <Panneau src="green_front.jpg" at={c.miroir - 2} fin={c.bouge + 4} pos="50% 30%" zoom={[1.05, 1.2]} duree={120} />
      {/* « rien ne bouge » : la courbe reste désespérément plate */}
      <ChartPlat at={c.bouge} fin={c.coach - 6} />

      {/* 2. Coach : la ligne plate devient la grille de l'agenda */}
      <Agenda x={120} y={210} w={830} h={640} at={c.coach - 6} fin={c.deux - 8} scan={[c.vide, c.vide + 50]} />
      <RendezVous at={c.vide + 14} fin={c.deux - 8} />

      {/* 3. Deux cas */}
      <DeuxCas at={c.deux} coche={c.bonne + 6} fin={c.bout - 6} />

      {/* 4. Jusqu'au bout */}
      <BarreVideo at={mot("jusqu'au bout")} a={fin("ne le voient jamais")} x={190} y={930} w={1540} fin={total - 14} />
      <VoletRouge at={c.coach - 10} duree={18} />

      <KineticText layoutAt={layoutAt} />

      <Sfx at={0} son="impact" volume={0.5} />
      <Sfx at={c.mange - 4} son="whoosh" volume={0.3} />
      <Sfx at={c.miroir - 2} son="whoosh" volume={0.3} />
      <Sfx at={c.bouge} son="tick" volume={0.35} />
      <Sfx at={c.coach - 10} son="swoosh" volume={0.45} />
      <Sfx at={c.vide + 14} son="impact" volume={0.4} />
      <Sfx at={c.deux} son="whoosh" volume={0.3} />
      <Sfx at={c.bonne + 6} son="pop" volume={0.35} />
      <Sfx at={c.bout} son="riser" volume={0.3} />
    </>
  );
};

const ChartPlat: React.FC<{ at: number; fin: number }> = ({ at, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at + 30, at + 44, EASE);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 1040,
          top: 0,
          width: 880,
          height: 1080,
          background: "linear-gradient(90deg, rgba(13,0,0,0) 0%, rgba(13,0,0,0.82) 22%)",
          opacity: prog(f, at - 4, at + 10, EASE) * (1 - prog(f, fin, fin + 12, EASE)),
        }}
      />
      <Courbe
        x={1120}
        y={330}
        w={680}
        h={360}
        at={at}
        duree={46}
        fin={fin}
        points={[0.52, 0.55, 0.5, 0.53, 0.51, 0.54, 0.52, 0.5, 0.53, 0.51, 0.52, 0.52]}
        labels={["S1", "S3", "S6", "S9", "S12"]}
      />
      <div style={{ position: "absolute", left: 1120, top: 240, opacity: prog(f, at, at + 12, EASE) * (1 - prog(f, fin, fin + 10, EASE)) }}>
        <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 26, letterSpacing: "0.22em", color: blancA(0.5) }}>TON MIROIR, 12 SEMAINES</div>
      </div>
      <div style={{ position: "absolute", left: 1120, top: 790, opacity: p * (1 - prog(f, fin, fin + 10, EASE)), translate: `0 ${(1 - p) * 30}px` }}>
        <Compteur a={0} de={0} at={at + 30} size={120} suffixe=" kg" decimales={1} couleur={C.rouge} />
      </div>
    </>
  );
};

const RendezVous: React.FC<{ at: number; fin: number }> = ({ at, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, EASE);
  const o = prog(f, fin, fin + 10, EASE);
  if (p <= 0 || o >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 330,
        top: 400,
        padding: "34px 52px",
        borderRadius: 26,
        background: "rgba(13,0,0,0.9)",
        border: `2px solid ${C.rouge}`,
        boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
        opacity: p * (1 - o),
        scale: `${0.9 + 0.1 * p}`,
        fontFamily: MONTSERRAT,
        textAlign: "center",
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 150, lineHeight: 0.9, letterSpacing: "-0.05em", color: C.rouge }}>0</div>
      <div style={{ marginTop: 10, fontWeight: 800, fontSize: 30, letterSpacing: "0.16em", color: blancA(0.75) }}>RENDEZ-VOUS</div>
    </div>
  );
};

const DeuxCas: React.FC<{ at: number; coche: number; fin: number }> = ({ at, coche, fin }) => {
  const f = useCurrentFrame();
  const cartes = [
    { n: "01", t: "Tu t'entraînes", s: "Pratiquant", i: <Halteres size={70} color={C.rouge} stroke={2.2} /> },
    { n: "02", t: "Tu es coach", s: "Coach", i: <Calendrier size={70} color={C.rouge} stroke={2.2} /> },
  ];
  return (
    <>
      {cartes.map((k, i) => {
        const p = prog(f, at + i * 6, at + i * 6 + 20, EASE);
        const o = prog(f, fin, fin + 12, EASE);
        const pc = prog(f, coche + i * 5, coche + i * 5 + 14, EASE);
        if (p <= 0 || o >= 1) return null;
        return (
          <div className="verre"
            key={k.n}
            style={{
              position: "absolute",
              left: 190 + i * 790,
              top: 430,
              width: 750,
              height: 470,
              borderRadius: 28,
              background: `linear-gradient(155deg, rgba(137,4,4,${0.35 + pc * 0.3}) 0%, rgba(39,1,1,0.95) 50%, rgba(13,0,0,0.96) 100%)`,
              border: `2px solid rgba(224,30,30,${0.2 + pc * 0.8})`,
              boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
              opacity: p * (1 - o),
              translate: `${(1 - p) * (i ? 80 : -80)}px ${o * -40}px`,
              padding: 50,
              boxSizing: "border-box",
              fontFamily: MONTSERRAT,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 900, fontSize: 120, lineHeight: 0.85, letterSpacing: "-0.06em", color: "transparent", backgroundImage: "linear-gradient(170deg, #E01E1E 0%, #B00202 45%, #3d0101 100%)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>
                {k.n}
              </div>
              {k.i}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.22em", color: C.rouge, textTransform: "uppercase" }}>{k.s}</div>
                <div style={{ marginTop: 10, fontWeight: 900, fontSize: 72, lineHeight: 1, letterSpacing: "-0.045em", color: C.blanc }}>{k.t}</div>
              </div>
              <div style={{ opacity: pc, scale: `${0.6 + 0.4 * pc}` }}>
                <Coche size={86} p={pc} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export const Scene1: React.FC<SceneProps> = ({ scene }) => (
  <Shell scene={scene ?? sceneParDefaut(1)} fond={{ x: 72, y: 34 }}>
    <AbsoluteFill>
      <Contenu />
    </AbsoluteFill>
  </Shell>
);
