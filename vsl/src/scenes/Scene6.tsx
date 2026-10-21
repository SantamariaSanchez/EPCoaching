import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, MONTSERRAT, blancA, rougeA } from "../lib/brand";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { EASE, EASE_IN, EASE_IO, Layout, prog, useCues } from "../lib/scene";
import { KineticText } from "../components/KineticText";
import { Shell } from "../components/Shell";
import { Chip, Coche, Losange, Sfx } from "../components/primitives";
import { CartesSite } from "../components/CartesSite";
import { Panneau } from "../components/visuels";
import { Calendrier, Cible, Fichier, Halteres } from "../components/Icones";

// Scène 6, l'appel : les deux boutons sous la vidéo, ce qui se passe pendant l'appel.
const Contenu: React.FC = () => {
  const { cue, mot } = useCues();
  const c = {
    propose: cue("ce que je te propose"),
    sous: cue("Juste sous cette vidéo"),
    boutons: cue("deux boutons"),
    physique: cue("Un pour le physique"),
    coachs: cue("un pour les coachs"),
    choisis: cue("Tu choisis le tien"),
    reserves: cue("tu réserves un appel"),
    cetAppel: cue("Cet appel"),
    offert: cue("il est offert"),
    engagement: cue("sans engagement"),
    situation: cue("On regarde ta situation"),
    ou: cue("où tu en es"),
    bloque: cue("ce qui bloque"),
    faire: cue("ce qu'il faudrait faire"),
    pire: cue("Dans le pire des cas"),
    plan: cue("un plan clair"),
    gratuit: cue("gratuitement"),
    concretement: cue("Concrètement"),
    trentaine: cue("trentaine de minutes"),
    racontes: cue("Tu me racontes"),
    semaine: cue("ta semaine"),
    essaye: cue("déjà essayé"),
    franchement: cue("je te dis franchement"),
    aider: cue("je ne peux pas t'aider"),
    aussi: cue("je te le dirai aussi"),
    ensemble: cue("travailler ensemble"),
    comment: cue("exactement comment"),
  };
  const layoutAt = (fr: number): Layout =>
    fr < c.sous ? "plein" : fr < c.cetAppel ? "haut" : fr < c.franchement ? "gauche" : fr < c.ensemble ? "gauche" : "plein";

  return (
    <>
      {/* Les deux boutons */}
      <CartesSite at={c.sous} y={400} lecteur fleche surligne={[c.physique, c.coachs]} clic={mot("tu réserves") + 6} fin={c.cetAppel - 8} />

      {/* Offert, sans engagement, le déroulé */}
      <Chip texte="Offert" at={mot("offert") - 2} x={1060} y={180} variante="plein" size={64} fin={c.pire - 8} />
      <Chip texte="Sans engagement" at={mot("sans engagement") - 2} x={1360} y={180} variante="check" size={44} fin={c.pire - 8} />
      <Deroule at={c.situation} etapes={[c.ou, c.bloque, c.faire]} fin={c.pire - 8} />
      <PlanClair at={c.pire} plan={c.plan} gratuit={c.gratuit} fin={c.concretement - 8} />

      {/* La durée (à valider) et ce qu'on se dit */}
      <Minutes at={c.concretement} trentaine={c.trentaine} fin={c.racontes - 8} />
      <TroisSujets at={[mot("ton objectif"), mot("ta semaine"), c.essaye]} fin={c.franchement - 8} />

      {/* Franchise */}
      <Panneau src="school.jpg" at={c.franchement - 6} fin={c.ensemble - 8} pos="50% 30%" zoom={[1.16, 1.03]} duree={300} />
      <Chip texte="Si je ne peux pas t'aider, je te le dis" at={c.aussi} x={1020} y={880} variante="check" size={30} fin={c.ensemble - 10} />

      {/* Ensemble */}
      <DeuxLosanges at={c.ensemble} comment={c.comment} />

      <KineticText layoutAt={layoutAt} />

      <Sfx at={c.sous} son="whoosh" volume={0.3} />
      <Sfx at={c.physique} son="click" volume={0.3} />
      <Sfx at={c.coachs} son="click" volume={0.3} />
      <Sfx at={mot("tu réserves") + 6} son="pop" volume={0.35} />
      <Sfx at={mot("offert") - 2} son="impact" volume={0.3} />
      <Sfx at={c.ou} son="tick" volume={0.3} />
      <Sfx at={c.bloque} son="tick" volume={0.3} />
      <Sfx at={c.faire} son="tick" volume={0.3} />
      <Sfx at={c.plan} son="bell" volume={0.25} />
      <Sfx at={c.trentaine} son="tick" volume={0.3} />
      <Sfx at={c.franchement - 6} son="whoosh" volume={0.3} />
      <Sfx at={c.ensemble} son="riser" volume={0.25} />
      <Sfx at={c.comment + 10} son="impact" volume={0.35} />
    </>
  );
};

const Deroule: React.FC<{ at: number; etapes: number[]; fin: number }> = ({ at, etapes, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < at - 6 || o >= 1) return null;
  const noms = ["Où tu en es", "Ce qui bloque", "Ce qu'il faut faire"];
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      <div style={{ position: "absolute", left: 1060, top: 380, fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: blancA(0.5), opacity: prog(f, at, at + 12, EASE) }}>
        PENDANT L'APPEL
      </div>
      {noms.map((n, i) => {
        const p = prog(f, etapes[i] - 4, etapes[i] + 12, EASE);
        return (
          <div className="verre"
            key={n}
            style={{
              position: "absolute",
              left: 1060,
              top: 440 + i * 160,
              width: 740,
              height: 130,
              borderRadius: 22,
              background: "rgba(39,1,1,0.94)",
              border: `2px solid ${rougeA(0.2 + 0.6 * p)}`,
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "0 36px",
              boxSizing: "border-box",
              opacity: 0.25 + 0.75 * p,
              translate: `${(1 - p) * 40}px 0`,
              fontFamily: MONTSERRAT,
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 64, letterSpacing: "-0.05em", color: "transparent", backgroundImage: "linear-gradient(170deg, #E01E1E 0%, #B00202 45%, #3d0101 100%)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ fontWeight: 900, fontSize: 48, letterSpacing: "-0.035em", color: C.blanc }}>{n}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const PlanClair: React.FC<{ at: number; plan: number; gratuit: number; fin: number }> = ({ at, plan, gratuit, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 18, EASE);
  const pp = prog(f, plan, plan + 16, EASE);
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (p <= 0 || o >= 1) return null;
  return (
    <div className="verre"
      style={{
        position: "absolute",
        left: 1100,
        top: 230,
        width: 640,
        height: 620,
        borderRadius: 28,
        background: "linear-gradient(160deg, rgba(176,2,2,0.5), rgba(39,1,1,0.96) 60%)",
        border: `2px solid ${rougeA(0.3 + 0.7 * pp)}`,
        boxShadow: "0 50px 120px rgba(0,0,0,0.6)",
        opacity: p * (1 - o),
        translate: `0 ${(1 - p) * 60}px`,
        rotate: `${2 - 2 * p}deg`,
        padding: 54,
        boxSizing: "border-box",
        fontFamily: MONTSERRAT,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: blancA(0.6) }}>DANS LE PIRE DES CAS</div>
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 26 }}>
        <Fichier size={110} color={C.rouge} stroke={1.6} />
        <div style={{ fontWeight: 900, fontSize: 64, letterSpacing: "-0.04em", color: C.blanc, lineHeight: 1 }}>Un plan clair</div>
      </div>
      {["Où tu en es", "Ce qui bloque", "Quoi faire"].map((l, i) => {
        const pl = prog(f, plan + 6 + i * 6, plan + 20 + i * 6, EASE);
        return (
          <div key={l} style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18, opacity: pl, translate: `${(1 - pl) * 20}px 0` }}>
            <Coche size={44} p={pl} />
            <span style={{ fontWeight: 800, fontSize: 36, color: C.blanc }}>{l}</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", right: 44, bottom: 40, padding: "12px 24px", borderRadius: 12, background: C.rouge, fontWeight: 900, fontSize: 30, color: C.blanc, opacity: prog(f, gratuit, gratuit + 10, EASE), scale: `${0.8 + 0.2 * prog(f, gratuit, gratuit + 10, EASE)}` }}>
        Gratuit
      </div>
    </div>
  );
};

// Durée de l'appel : « une trentaine de minutes » (phrase à valider avec la vraie durée Calendly).
const Minutes: React.FC<{ at: number; trentaine: number; fin: number }> = ({ at, trentaine, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16, EASE);
  const o = prog(f, fin, fin + 10, EASE_IN);
  if (p <= 0 || o >= 1) return null;
  const t = prog(f, trentaine, trentaine + 50, EASE_IO);
  const R = 200;
  const L = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", left: 1220, top: 290, width: 500, height: 500, opacity: p * (1 - o), scale: `${0.85 + 0.15 * p}` }}>
      <svg width={500} height={500}>
        <circle cx={250} cy={250} r={R} stroke={blancA(0.1)} strokeWidth={22} fill="rgba(13,0,0,0.7)" />
        <circle cx={250} cy={250} r={R} stroke={C.rouge} strokeWidth={22} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - 0.5 * t)} strokeLinecap="round" transform="rotate(-90 250 250)" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={250 + Math.cos(a) * 160} y1={250 + Math.sin(a) * 160} x2={250 + Math.cos(a) * 176} y2={250 + Math.sin(a) * 176} stroke={blancA(0.3)} strokeWidth={3} />;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: MONTSERRAT }}>
        <div style={{ fontWeight: 900, fontSize: 150, color: C.blanc, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>~{Math.round(30 * t)}</div>
        <div style={{ fontWeight: 800, fontSize: 30, color: blancA(0.6), letterSpacing: "0.22em" }}>MINUTES</div>
      </div>
    </div>
  );
};

const TroisSujets: React.FC<{ at: number[]; fin: number }> = ({ at, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < at[0] - 6 || o >= 1) return null;
  const items = [
    { t: "Ton objectif", i: Cible },
    { t: "Ta semaine", i: Calendrier },
    { t: "Ce que tu as essayé", i: Halteres },
  ];
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {items.map((it, i) => {
        const p = prog(f, at[i] - 4, at[i] + 14, EASE);
        if (p <= 0) return null;
        const Ic = it.i;
        return (
          <div className="verre"
            key={it.t}
            style={{
              position: "absolute",
              left: 1060 + (i % 2) * 60,
              top: 250 + i * 210,
              width: 700,
              height: 170,
              borderRadius: 24,
              background: "linear-gradient(150deg, rgba(137,4,4,0.45), rgba(39,1,1,0.95) 60%)",
              border: `2px solid ${rougeA(0.5)}`,
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "0 40px",
              boxSizing: "border-box",
              opacity: p,
              translate: `${(1 - p) * 60}px 0`,
              fontFamily: MONTSERRAT,
              boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
            }}
          >
            <Ic size={80} color={C.rouge} />
            <span style={{ fontWeight: 900, fontSize: 52, letterSpacing: "-0.035em", color: C.blanc }}>{it.t}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Deux losanges (le tien, le mien) qui se rejoignent : on travaille ensemble.
const DeuxLosanges: React.FC<{ at: number; comment: number }> = ({ at, comment }) => {
  const f = useCurrentFrame();
  const p = prog(f, at - 6, at + 20, EASE);
  const m = prog(f, comment - 10, comment + 24, EASE_IO);
  if (p <= 0) return null;
  const ecart = 260 * (1 - m);
  return (
    <AbsoluteFill style={{ opacity: p }}>
      <Losange size={120} x={1640 - ecart} y={960} contour color={C.rouge} p={p} />
      <Losange size={120} x={1640 + ecart} y={960} contour={m < 0.98} color={m > 0.98 ? C.rouge : C.blanc} p={p} />
    </AbsoluteFill>
  );
};

export const Scene6: React.FC<SceneProps> = ({ scene }) => (
  <Shell scene={scene ?? sceneParDefaut(6)} fond={{ x: 50, y: 70 }}>
    <Contenu />
  </Shell>
);
