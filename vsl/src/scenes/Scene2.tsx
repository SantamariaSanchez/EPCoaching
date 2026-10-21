import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, MONTSERRAT, blancA, rougeA } from "../lib/brand";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { EASE, EASE_IN, EASE_IO, Layout, hash, kf, prog, useCues } from "../lib/scene";
import { KineticText } from "../components/KineticText";
import { Shell } from "../components/Shell";
import { Chip, Coche, Photo, Sfx, SurTitre } from "../components/primitives";
import { Courbe, Panneau } from "../components/visuels";
import { Phone } from "../components/Phone";
import { Bulle, Calendrier, Fichier, Fourchette, Halteres, Lune, Micro, Video } from "../components/Icones";

// Scène 2, qui je suis : vraies photos d'Emmanuel, son parcours, puis l'idée centrale
// de la vidéo : le problème n'est pas l'info, c'est l'écart entre l'info et le résultat.
const Contenu: React.FC = () => {
  const { cue, mot } = useCues();
  const c = {
    presente: cue("je vais me présenter"),
    nom: cue("Moi c'est Santamaria"),
    natural: cue("bodybuilding natural"),
    heroes: cue("Heroes Cup"),
    debut: cue("J'ai commencé la muscu"),
    internet: cue("trouvés sur internet"),
    copiees: cue("des diètes copiées"),
    mois: cue("des mois sans vraiment"),
    mesurer: cue("tout mesurer"),
    structurer: cue("de tout structurer"),
    hasard: cue("au hasard"),
    simple: cue("une chose très simple"),
    diete: cue("Ma diète"),
    jours: cue("Tous les jours"),
    coacher: cue("à force de coacher"),
    gens: cue("Le problème des gens"),
    partout: cue("il y en a partout"),
    vrai: cue("Le vrai problème"),
    entre: cue("Entre le moment"),
    lache: cue("tout le monde lâche"),
    moi: cue("Et c'est là que moi"),
  };
  const layoutAt = (fr: number): Layout =>
    fr < c.debut ? "gauche" : fr < c.mesurer ? "droite" : fr < c.simple ? "gauche" : fr < c.diete ? "gauche" : fr < c.coacher ? "haut" : fr < c.gens ? "plein" : fr < c.vrai ? "bas" : "haut";

  return (
    <>
      {/* Présentation */}
      <Panneau src="gym_locker.jpg" at={c.presente - 10} fin={c.heroes - 4} pos="50% 25%" zoom={[1.2, 1.05]} duree={260} />
      <NomCarte at={c.nom} fin={c.heroes - 4} />
      <Chip texte="Bodybuilding natural" at={mot("bodybuilding")} x={1120} y={846} variante="check" size={34} fin={c.heroes - 6} />
      <Panneau src="gym_pose.jpg" at={c.heroes - 4} fin={c.debut - 6} pos="50% 30%" zoom={[1.06, 1.18]} duree={170} entree="monte" />
      <Chip texte="Heroes Cup" at={mot("Heroes")} x={1150} y={640} variante="plein" size={40} fin={c.debut - 8} />
      <Chip texte="Classic Physique" at={mot("Classic")} x={1150} y={745} variante="contour" size={36} fin={c.debut - 8} />
      <Chip texte="Fédération naturelle testée" at={mot("fédération")} x={1150} y={845} variante="check" size={36} fin={c.debut - 8} />

      {/* Les débuts (paragraphe à valider) */}
      <Photo src="debut_2022a.jpg" x={120} y={150} w={430} h={600} at={c.debut - 4} fin={c.mesurer - 8} pos="50% 35%" rot={-3} dir="haut" />
      <Photo src="debut_2022b.jpg" x={470} y={330} w={420} h={300} at={c.debut + 14} fin={c.mesurer - 8} pos="50% 45%" rot={2.5} dir="gauche" />
      <SurTitre texte="Les débuts" at={c.debut + 6} x={130} y={96} fin={c.mesurer - 10} />
      <Chip texte="Programmes d'internet" at={c.internet} x={300} y={690} variante="barre" barreAt={c.internet + 40} size={34} fin={c.mesurer - 10} />
      <Chip texte="Diètes copiées" at={c.copiees} x={360} y={790} variante="barre" barreAt={c.copiees + 26} size={34} fin={c.mesurer - 10} />
      <Chip texte="Des mois sans savoir" at={c.mois} x={240} y={890} variante="barre" barreAt={c.mois + 50} size={34} fin={c.mesurer - 10} />

      {/* Tout mesurer : l'appli entre en jeu */}
      <Phone
        x={1430}
        y={560}
        h={860}
        enter={c.mesurer - 6}
        sortie={c.simple - 10}
        ecrans={[
          { src: "bilan", at: c.mesurer - 6, zoom: [[0, 1, 50, 20], [30, 1.35, 50, 22]] },
          { src: "entrainement", at: c.structurer },
          { src: "agenda", at: c.hasard },
        ]}
      />

      {/* Je l'applique d'abord sur moi */}
      <Panneau src="training_bench.jpg" at={c.simple - 6} fin={c.diete - 6} pos="50% 50%" zoom={[1.15, 1.02]} duree={260} />
      <QuatreTuiles at={c.diete} mots={[mot("diète"), mot("training"), mot("sommeil"), mot("agenda")]} jours={c.jours} fin={c.coacher - 8} />

      {/* Respiration : à force de coacher */}
      <LosangeLent at={c.coacher} fin={c.gens - 6} />

      {/* L'info est partout */}
      <MurInfos at={c.gens + 10} flot={c.partout} fin={c.vrai - 8} />

      {/* L'écart entre l'info et le résultat */}
      <Ecart
        at={c.vrai}
        info={mot("l'info")}
        resultat={mot("le résultat")}
        entre={c.entre}
        jours={mot("tous les jours", 1)}
        mois={mot("pendant des mois")}
        lache={c.lache}
        moi={c.moi}
      />

      <KineticText layoutAt={layoutAt} />

      <Sfx at={c.presente - 10} son="whoosh" volume={0.3} />
      <Sfx at={c.nom} son="impact" volume={0.35} />
      <Sfx at={c.heroes - 4} son="whoosh" volume={0.3} />
      <Sfx at={mot("Heroes")} son="pop" volume={0.3} />
      <Sfx at={c.debut - 4} son="swoosh" volume={0.35} />
      <Sfx at={c.internet + 40} son="tick" volume={0.3} />
      <Sfx at={c.copiees + 26} son="tick" volume={0.3} />
      <Sfx at={c.mesurer - 6} son="swoosh" volume={0.4} />
      <Sfx at={c.diete} son="pop" volume={0.25} />
      <Sfx at={c.jours} son="bell" volume={0.25} />
      <Sfx at={c.partout} son="whoosh" volume={0.3} />
      <Sfx at={c.vrai} son="impact" volume={0.35} />
      <Sfx at={c.lache} son="thud" volume={0.35} />
      <Sfx at={c.moi} son="riser" volume={0.25} />
    </>
  );
};

const NomCarte: React.FC<{ at: number; fin: number }> = ({ at, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 18, EASE);
  const p2 = prog(f, at + 8, at + 26, EASE);
  const o = prog(f, fin, fin + 10, EASE_IN);
  if (p <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 1120, top: 660, fontFamily: MONTSERRAT, opacity: 1 - o }}>
      <div style={{ width: 90 * p, height: 6, background: C.rouge, marginBottom: 20 }} />
      <div style={{ overflow: "hidden" }}>
        <div style={{ fontWeight: 900, fontSize: 64, lineHeight: 1.0, letterSpacing: "-0.04em", color: C.blanc, translate: `0 ${(1 - p) * 105}%` }}>
          Emmanuel Santamaria Sanchéz
        </div>
      </div>
      <div style={{ overflow: "hidden", marginTop: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color: blancA(0.7), translate: `0 ${(1 - p2) * 105}%`, textTransform: "uppercase" }}>
          Fondateur d'EP Coaching
        </div>
      </div>
    </div>
  );
};

const QuatreTuiles: React.FC<{ at: number; mots: number[]; jours: number; fin: number }> = ({ at, mots, jours, fin }) => {
  const f = useCurrentFrame();
  const items = [
    { t: "Diète", i: Fourchette },
    { t: "Training", i: Halteres },
    { t: "Sommeil", i: Lune },
    { t: "Agenda", i: Calendrier },
  ];
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < at - 4 || o >= 1) return null;
  const J = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {items.map((it, i) => {
        const p = prog(f, mots[i] - 3, mots[i] + 14, EASE);
        const pc = prog(f, jours + i * 4, jours + i * 4 + 14, EASE);
        const Ic = it.i;
        return (
          <div className="verre"
            key={it.t}
            style={{
              position: "absolute",
              left: 190 + i * 395,
              top: 420,
              width: 360,
              height: 330,
              borderRadius: 26,
              background: `linear-gradient(160deg, rgba(137,4,4,${0.3 + 0.35 * pc}), rgba(39,1,1,0.95) 60%)`,
              border: `2px solid ${rougeA(0.15 + 0.7 * pc)}`,
              opacity: p,
              translate: `0 ${(1 - p) * 80}px`,
              padding: 36,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              fontFamily: MONTSERRAT,
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Ic size={74} color={C.rouge} stroke={2} />
              <div style={{ opacity: pc, scale: `${0.5 + 0.5 * pc}` }}>
                <Coche size={60} p={pc} />
              </div>
            </div>
            <div style={{ fontWeight: 900, fontSize: 56, letterSpacing: "-0.04em", color: C.blanc }}>{it.t}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 190, top: 810, display: "flex", gap: 20 }}>
        {J.map((j, i) => {
          const p = prog(f, jours + 4 + i * 4, jours + 14 + i * 4, EASE);
          return (
            <div className="verre"
              key={i}
              style={{
                width: 196,
                height: 92,
                borderRadius: 18,
                background: p > 0.5 ? C.rouge : "rgba(39,1,1,0.9)",
                border: `2px solid ${rougeA(0.3 + 0.7 * p)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONTSERRAT,
                fontWeight: 900,
                fontSize: 40,
                color: C.blanc,
                opacity: prog(f, at + 10 + i * 2, at + 22 + i * 2, EASE),
                scale: `${1 + 0.08 * Math.sin(Math.min(1, p) * Math.PI)}`,
              }}
            >
              {j}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const LosangeLent: React.FC<{ at: number; fin: number }> = ({ at, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at - 10, at + 30, EASE);
  const o = prog(f, fin, fin + 14, EASE_IN);
  if (p <= 0 || o >= 1) return null;
  const r = (f - at) * 0.08;
  return (
    <AbsoluteFill style={{ opacity: p * (1 - o) }}>
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: 1360 - (260 + k * 150) / 2,
            top: 540 - (260 + k * 150) / 2,
            width: 260 + k * 150,
            height: 260 + k * 150,
            border: `${3 - k}px solid ${rougeA(0.55 - k * 0.15)}`,
            rotate: `${45 + r * (k % 2 ? -1 : 1)}deg`,
            scale: `${0.9 + 0.1 * p}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Les infos arrivent de partout : tuiles qui envahissent l'écran.
const MurInfos: React.FC<{ at: number; flot: number; fin: number }> = ({ at, flot, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < at || o >= 1) return null;
  const types = [
    { t: "Vidéo", i: Video },
    { t: "PDF", i: Fichier },
    { t: "Podcast", i: Micro },
    { t: "Forum", i: Bulle },
    { t: "Reel", i: Video },
    { t: "Article", i: Fichier },
  ];
  const N = 30;
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {Array.from({ length: N }).map((_, k) => {
        const debut = k < 4 ? at + k * 8 : flot + (k - 4) * 2.2;
        const p = prog(f, debut, debut + 16, EASE);
        if (p <= 0) return null;
        const col = k % 6;
        const row = Math.floor(k / 6);
        const x = 130 + col * 285 + (hash(k) - 0.5) * 60;
        const y = 90 + row * 135 + (hash(k + 50) - 0.5) * 30;
        const ty = types[(k * 7) % types.length];
        const Ic = ty.i;
        const derive = Math.sin((f + k * 20) / 40) * 6;
        return (
          <div className="verre"
            key={k}
            style={{
              position: "absolute",
              left: x,
              top: y + derive,
              width: 250,
              height: 108,
              borderRadius: 18,
              background: "rgba(39,1,1,0.92)",
              border: `2px solid ${k % 5 === 0 ? rougeA(0.6) : "rgba(245,237,237,0.08)"}`,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "0 24px",
              boxSizing: "border-box",
              opacity: p * (0.55 + 0.45 * hash(k + 9)),
              scale: `${0.7 + 0.3 * p}`,
              rotate: `${(hash(k + 3) - 0.5) * 6}deg`,
              fontFamily: MONTSERRAT,
              fontWeight: 800,
              fontSize: 30,
              color: C.blanc,
            }}
          >
            <Ic size={44} color={C.rouge} />
            {ty.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// L'écart entre l'info et le résultat : deux bornes, un vide, une courbe qui chute, un pont.
const Ecart: React.FC<{ at: number; info: number; resultat: number; entre: number; jours: number; mois: number; lache: number; moi: number }> = ({
  at,
  info,
  resultat,
  entre,
  jours,
  mois,
  lache,
  moi,
}) => {
  const f = useCurrentFrame();
  if (f < at - 4) return null;
  const pA = prog(f, info - 4, info + 14, EASE);
  const pB = prog(f, resultat - 4, resultat + 14, EASE);
  const swap = prog(f, entre, entre + 16, EASE_IO);
  const pGap = prog(f, at, at + 30, EASE_IO);
  const pont = prog(f, moi, moi + 30, EASE_IO);
  const Y = 700;
  const A = 380;
  const B = 1540;
  const borne = (x: number, p: number, l1: string, l2: string) => (
    <div style={{ position: "absolute", left: x - 170, top: Y - 120, width: 340, height: 240, opacity: p, translate: `0 ${(1 - p) * 40}px` }}>
      <div className="verre"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          background: "linear-gradient(160deg, rgba(137,4,4,0.55), rgba(39,1,1,0.95) 60%)",
          border: `2px solid ${rougeA(0.6)}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      />
      {[l1, l2].map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: MONTSERRAT,
            fontWeight: 900,
            fontSize: 54,
            letterSpacing: "-0.04em",
            color: C.blanc,
            opacity: i === 0 ? 1 - swap : swap,
            translate: `0 ${i === 0 ? -swap * 30 : (1 - swap) * 30}px`,
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
  const nbJours = Math.round(kf(f, [[jours, 1], [mois, 30], [mois + 40, 180]], EASE_IO));
  return (
    <AbsoluteFill>
      {/* le vide */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line
          x1={A + 170}
          x2={A + 170 + (B - A - 340) * pGap}
          y1={Y}
          y2={Y}
          stroke={blancA(0.25)}
          strokeWidth={4}
          strokeDasharray="14 14"
          strokeDashoffset={-f * 0.6}
        />
      </svg>
      {borne(A, pA, "L'info", "Savoir")}
      {borne(B, pB, "Le résultat", "Faire")}
      {/* durée */}
      <div
        style={{
          position: "absolute",
          left: 960 - 300,
          top: Y - 230,
          width: 600,
          textAlign: "center",
          fontFamily: MONTSERRAT,
          opacity: prog(f, jours - 4, jours + 10, EASE) * (1 - prog(f, lache - 6, lache + 6, EASE)),
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: blancA(0.55) }}>JOUR</div>
        <div style={{ fontWeight: 900, fontSize: 120, letterSpacing: "-0.05em", color: C.blanc, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {nbJours}
        </div>
      </div>
      {/* la courbe de ceux qui tiennent */}
      <Courbe
        x={A + 190}
        y={Y - 250}
        w={B - A - 380}
        h={230}
        at={lache}
        duree={50}
        fin={moi - 4}
        points={[1, 0.97, 0.9, 0.72, 0.5, 0.33, 0.22, 0.15, 0.11, 0.09, 0.08]}
        grille={false}
      />
      {/* le pont : le suivi */}
      <div
        style={{
          position: "absolute",
          left: A + 170,
          top: Y - 9,
          width: (B - A - 340) * pont,
          height: 18,
          borderRadius: 9,
          background: `linear-gradient(90deg, ${C.rougeMoyen}, ${C.rouge})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 960 - 200,
          top: Y + 40,
          width: 400,
          textAlign: "center",
          fontFamily: MONTSERRAT,
          fontWeight: 900,
          fontSize: 64,
          letterSpacing: "0.12em",
          color: C.rouge,
          opacity: prog(f, moi + 20, moi + 34, EASE),
          translate: `0 ${(1 - prog(f, moi + 20, moi + 34, EASE)) * 20}px`,
        }}
      >
        LE SUIVI
      </div>
      <SurTitre texte="Là où presque tout le monde lâche" at={lache} x={A - 170} y={Y + 170} fin={moi - 4} color={blancA(0.6)} size={24} />
    </AbsoluteFill>
  );
};

export const Scene2: React.FC<SceneProps> = ({ scene }) => (
  <Shell scene={scene ?? sceneParDefaut(2)} fond={{ x: 30, y: 30 }}>
    <Contenu />
  </Shell>
);
