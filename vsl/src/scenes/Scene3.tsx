import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, MONTSERRAT, blancA, rougeA } from "../lib/brand";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { EASE, EASE_IN, EASE_IO, Layout, clamp, hash, kf, prog, useCues } from "../lib/scene";
import { KineticText } from "../components/KineticText";
import { Shell } from "../components/Shell";
import { Chip, Coche, Compteur, Croix, Sfx, SurTitre, VoletRouge } from "../components/primitives";
import { CarteNum } from "../components/visuels";
import { Phone, Callout } from "../components/Phone";
import { Balance, Bulle, Fichier, Fourchette, Halteres, Horloge, Lune, Oeil, Tableau } from "../components/Icones";

// Scène 3, le vrai problème : les trois raisons (plan, mesure, ajustement), l'exemple
// chiffré du week-end, puis le même problème vu côté coach.
const Contenu: React.FC = () => {
  const { cue, mot, fin } = useCues();
  const c = {
    question: cue("Laisse-moi te poser"),
    programmes: cue("Combien de programmes"),
    dietes: cue("Combien de diètes"),
    fois: cue("Combien de fois"),
    clair: cue("très clair"),
    motivation: cue("pas de motivation"),
    priorites: cue("Tu manques de priorités"),
    suivi: cue("tu manques de suivi"),
    explique: cue("Je m'explique"),
    trois: cue("trois raisons"),
    p1: cue("Premier point"),
    pasPourToi: cue("pas fait pour toi"),
    autre1: cue("le programme d'un autre"),
    autre2: cue("la diète d'un autre"),
    autre3: cue("les horaires d'un autre"),
    semaines: cue("trois semaines"),
    lache: cue("tu lâches"),
    meilleur: cue("Le meilleur plan"),
    p2: cue("Deuxième point"),
    mesures: cue("Tu ne mesures rien"),
    poids: cue("Ton poids"),
    donnees: cue("Sans données"),
    feeling: cue("tu avances au feeling"),
    histoires: cue("histoires"),
    exemple: cue("un exemple très simple"),
    gars: cue("80 kilos"),
    plutot: cue("plutôt bien"),
    weekend: cue("Sauf que le week-end"),
    famille: cue("repas de famille"),
    verres: cue("deux verres"),
    dessert: cue("un dessert"),
    papier: cue("Sur le papier"),
    enVrai: cue("En vrai"),
    maintenance: cue("à sa maintenance"),
    casse: cue("métabolisme est cassé"),
    pasSon: cue("C'est pas son métabolisme"),
    mesureRien: cue("C'est qu'il ne mesure rien"),
    p3: cue("Et le dernier point"),
    personne: cue("Personne n'ajuste"),
    corps: cue("Ton corps change"),
    bougeJamais: cue("ne bouge jamais"),
    marcher: cue("ne plus marcher"),
    interessant: cue("ce qui est intéressant"),
    coachs: cue("même problème chez les coachs"),
    ville: cue("meilleur coach de ta ville"),
    vivre: cue("ne pas en vivre"),
    voient: cue("ne te voient pas"),
    soirees: cue("tes soirées"),
    systeme: cue("pas de système"),
    pratiquant: cue("Que tu sois pratiquant"),
    vraiSuivi: cue("un vrai suivi"),
  };
  const layoutAt = (fr: number): Layout =>
    fr < c.programmes
      ? "plein"
      : fr < c.clair
        ? "gauche"
        : fr < c.p1
          ? "haut"
          : fr < c.exemple
            ? "gauche"
            : fr < c.p3
              ? "haut"
              : fr < c.interessant
                ? "gauche"
                : fr < c.ville
                  ? "droite"
                  : fr < c.pratiquant
                    ? "gauche"
                    : "haut";

  return (
    <>
      {/* La question */}
      <GrandPoint at={c.question - 10} fin={c.programmes - 8} />
      <Roulettes items={[
        { label: "Programmes commencés", at: c.programmes },
        { label: "Diètes", at: c.dietes },
        { label: "« Cette fois, c'est la bonne »", at: c.fois },
      ]} fin={c.clair - 8} />

      {/* Motivation / priorités / suivi */}
      <CroyanceVsRealite at={c.clair} motivation={fin("pas de motivation") - 6} priorites={mot("priorités")} suivi={mot("suivi")} fin={c.explique - 8} />

      {/* Trois raisons */}
      <TroisRaisons at={c.trois} fin={c.p1 - 4} />
      <VoletRouge at={c.p1 - 12} duree={18} />

      {/* Point 1 : le plan des autres */}
      <CarteNum num="01" titre="Le plan n'est pas fait pour toi" x={1060} y={110} w={760} h={250} at={c.p1 - 4} actif={c.pasPourToi} fin={c.meilleur - 10} />
      <PlansDesAutres at={[c.autre1, c.autre2, c.autre3]} semaines={c.semaines} lache={mot("tu lâches")} fin={c.meilleur - 10} />
      <Phone
        x={1440}
        y={560}
        h={860}
        enter={c.meilleur - 6}
        sortie={c.p2 - 14}
        ecrans={[{ src: "entrainement", at: c.meilleur - 6, zoom: [[0, 1, 50, 20], [40, 1.25, 50, 22]] }]}
      />
      <Callout at={mot("suivre") - 4} x={1330} y={330} tx={1090} ty={250} texte="Fait pour toi" cote="gauche" fin={c.p2 - 16} />
      <VoletRouge at={c.p2 - 12} duree={18} sens={-1} />

      {/* Point 2 : tu ne mesures rien */}
      <CarteNum num="02" titre="Tu ne mesures rien" x={1060} y={110} w={760} h={250} at={c.p2 - 4} actif={c.mesures} fin={c.exemple - 10} />
      <Mesures
        at={[mot("Ton poids"), mot("ton sommeil"), mot("tes charges"), mot("tes repas")]}
        feeling={c.feeling}
        histoires={c.histoires}
        fin={c.exemple - 10}
      />

      {/* L'exemple du week-end */}
      <ExempleWeekend
        c={{
          gars: c.gars,
          kilos: mot("80 kilos"),
          plutot: c.plutot,
          weekend: c.weekend,
          famille: c.famille,
          verres: c.verres,
          dessert: c.dessert,
          papier: c.papier,
          enVrai: c.enVrai,
          maintenance: c.maintenance,
          casse: c.casse,
          pasSon: c.pasSon,
          mesureRien: c.mesureRien,
          fin: c.p3 - 10,
        }}
      />
      <VoletRouge at={c.p3 - 12} duree={18} />

      {/* Point 3 : personne n'ajuste */}
      <CarteNum num="03" titre="Personne n'ajuste" x={1060} y={110} w={760} h={250} at={c.p3 - 4} actif={c.personne} fin={c.interessant - 10} />
      <PlanFige at={c.corps} changes={[mot("Ton corps"), mot("ta semaine"), mot("ta vie")]} bouge={c.bougeJamais} marcher={c.marcher} fin={c.interessant - 10} />

      {/* Même problème chez les coachs : l'autre visage */}
      <DeuxVisages at={c.interessant - 4} flip={c.coachs + 20} fin={c.ville - 8} />

      {/* Le coach invisible */}
      <CoachInvisible
        ville={c.ville}
        vivre={c.vivre}
        voient={c.voient}
        soirees={c.soirees}
        tableaux={mot("des tableaux")}
        messages={mot("des messages")}
        fichiers={mot("des fichiers")}
        systeme={c.systeme}
        fin={c.pratiquant - 8}
      />

      {/* La même solution */}
      <MemeSolution at={c.pratiquant} suivi={c.vraiSuivi} systeme={mot("un système")} />

      <KineticText layoutAt={layoutAt} />

      <Sfx at={c.question - 10} son="impact" volume={0.3} />
      <Sfx at={c.programmes} son="type" volume={0.25} />
      <Sfx at={c.dietes} son="type" volume={0.25} />
      <Sfx at={c.fois} son="type" volume={0.25} />
      <Sfx at={fin("pas de motivation") - 6} son="thud" volume={0.35} />
      <Sfx at={mot("priorités")} son="pop" volume={0.3} />
      <Sfx at={mot("suivi")} son="pop" volume={0.3} />
      <Sfx at={c.trois} son="whoosh" volume={0.3} />
      <Sfx at={c.p1 - 12} son="swoosh" volume={0.45} />
      <Sfx at={mot("tu lâches")} son="thud" volume={0.4} />
      <Sfx at={c.meilleur - 6} son="whoosh" volume={0.3} />
      <Sfx at={c.p2 - 12} son="swoosh" volume={0.45} />
      <Sfx at={c.feeling} son="whoosh" volume={0.2} />
      <Sfx at={mot("80 kilos")} son="tick" volume={0.3} />
      <Sfx at={c.weekend} son="riser" volume={0.25} />
      <Sfx at={c.famille} son="pop" volume={0.3} />
      <Sfx at={c.verres} son="pop" volume={0.3} />
      <Sfx at={c.dessert} son="pop" volume={0.3} />
      <Sfx at={c.maintenance} son="impact" volume={0.35} />
      <Sfx at={c.pasSon + 20} son="thud" volume={0.3} />
      <Sfx at={c.p3 - 12} son="swoosh" volume={0.45} />
      <Sfx at={c.marcher} son="thud" volume={0.35} />
      <Sfx at={c.coachs + 20} son="whoosh" volume={0.35} />
      <Sfx at={c.vivre} son="thud" volume={0.3} />
      <Sfx at={c.systeme} son="impact" volume={0.3} />
      <Sfx at={c.vraiSuivi} son="bell" volume={0.25} />
    </>
  );
};

// « ? » géant au trait, qui tourne doucement derrière la question.
const GrandPoint: React.FC<{ at: number; fin: number }> = ({ at, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 30, EASE);
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (p <= 0 || o >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 120,
        top: 60,
        fontFamily: MONTSERRAT,
        fontWeight: 900,
        fontSize: 900,
        lineHeight: 1,
        color: "transparent", backgroundImage: "linear-gradient(170deg, #E01E1E 0%, #B00202 45%, #3d0101 100%)", WebkitBackgroundClip: "text", backgroundClip: "text",
        opacity: p * (1 - o) * 0.4,
        rotate: `${8 - p * 8 + (f - at) * 0.02}deg`,
        translate: `${(1 - p) * 120}px 0`,
      }}
    >
      ?
    </div>
  );
};

// Compteurs qui défilent… et s'arrêtent sur « ? » : la réponse t'appartient.
const Roulettes: React.FC<{ items: { label: string; at: number }[]; fin: number }> = ({ items, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < items[0].at - 6 || o >= 1) return null;
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {items.map((it, i) => {
        const p = prog(f, it.at - 4, it.at + 14, EASE);
        if (p <= 0) return null;
        const stop = it.at + 40;
        const tournant = f < stop;
        const chiffre = String(Math.floor(hash(Math.floor(f / 2) + i * 31) * 10));
        return (
          <div className="verre"
            key={i}
            style={{
              position: "absolute",
              left: 1060,
              top: 190 + i * 250,
              width: 760,
              height: 210,
              borderRadius: 26,
              background: "linear-gradient(160deg, rgba(137,4,4,0.4), rgba(39,1,1,0.95) 60%)",
              border: `2px solid ${rougeA(tournant ? 0.25 : 0.8)}`,
              opacity: p,
              translate: `${(1 - p) * 80}px 0`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 50px",
              boxSizing: "border-box",
              fontFamily: MONTSERRAT,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 36, letterSpacing: "-0.02em", color: C.blanc, maxWidth: 480, lineHeight: 1.15 }}>{it.label}</div>
            <div
              style={{
                width: 130,
                height: 150,
                borderRadius: 18,
                background: C.noir,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 110,
                color: tournant ? blancA(0.8) : C.rouge,
                fontVariantNumeric: "tabular-nums",
                overflow: "hidden",
              }}
            >
              <span style={{ translate: `0 ${tournant ? ((f % 2) - 0.5) * 30 : 0}px`, filter: tournant ? "blur(2px)" : undefined }}>{tournant ? chiffre : "?"}</span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const CroyanceVsRealite: React.FC<{ at: number; motivation: number; priorites: number; suivi: number; fin: number }> = ({ at, motivation, priorites, suivi, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < at - 4 || o >= 1) return null;
  const col = (x: number, titre: string, p: number) => (
    <div style={{ position: "absolute", left: x, top: 430, opacity: p }}>
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: blancA(0.5) }}>{titre}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {col(190, "CE QUE TU CROIS", prog(f, at, at + 14, EASE))}
      {col(1000, "CE QUI MANQUE VRAIMENT", prog(f, priorites - 10, priorites + 4, EASE))}
      <Chip texte="Motivation" at={at + 20} x={190} y={500} variante="barre" barreAt={motivation} size={72} />
      <Chip texte="Priorités" at={priorites - 4} x={1000} y={500} variante="check" size={72} />
      <Chip texte="Suivi" at={suivi - 4} x={1000} y={680} variante="check" size={72} />
      <div
        style={{
          position: "absolute",
          left: 920,
          top: 470,
          width: 3,
          height: 380,
          background: blancA(0.12),
          transformOrigin: "top",
          scale: `1 ${prog(f, priorites - 14, priorites + 10, EASE_IO)}`,
        }}
      />
    </AbsoluteFill>
  );
};

const TroisRaisons: React.FC<{ at: number; fin: number }> = ({ at, fin }) => {
  const cartes = [
    { n: "01", t: "Le plan", s: "Fait pour un autre", i: <Fichier size={60} color={C.rouge} /> },
    { n: "02", t: "La mesure", s: "Tu avances au feeling", i: <Balance size={60} color={C.rouge} /> },
    { n: "03", t: "L'ajustement", s: "Personne ne le fait", i: <Horloge size={60} color={C.rouge} /> },
  ];
  return (
    <>
      {cartes.map((k, i) => (
        <CarteNum key={k.n} num={k.n} titre={k.t} sous={k.s} x={190 + i * 525} y={440} w={490} h={460} at={at + i * 8} fin={fin} icone={k.i} />
      ))}
    </>
  );
};

const PlansDesAutres: React.FC<{ at: number[]; semaines: number; lache: number; fin: number }> = ({ at, semaines, lache, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < at[0] - 6 || o >= 1) return null;
  const docs = [
    { t: "Le programme", s: "d'un autre", i: Halteres },
    { t: "La diète", s: "d'un autre", i: Fourchette },
    { t: "Les horaires", s: "d'un autre", i: Horloge },
  ];
  const chute = prog(f, lache, lache + 22, EASE_IN);
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {docs.map((d, i) => {
        const p = prog(f, at[i] - 4, at[i] + 14, EASE);
        if (p <= 0) return null;
        const Ic = d.i;
        return (
          <div className="verre"
            key={i}
            style={{
              position: "absolute",
              left: 1080 + i * 40,
              top: 410 + i * 120,
              width: 560,
              height: 150,
              borderRadius: 20,
              background: "rgba(39,1,1,0.95)",
              border: "2px solid rgba(245,237,237,0.1)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "0 34px",
              boxSizing: "border-box",
              fontFamily: MONTSERRAT,
              opacity: p,
              translate: `${(1 - p) * 100}px ${chute * (400 + i * 120)}px`,
              rotate: `${(i - 1) * 2 + chute * (i - 1) * 18}deg`,
            }}
          >
            <Ic size={64} color={blancA(0.6)} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 40, color: C.blanc, letterSpacing: "-0.03em" }}>{d.t}</div>
              <div style={{ fontWeight: 700, fontSize: 28, color: C.rouge, fontStyle: "italic" }}>{d.s}</div>
            </div>
          </div>
        );
      })}
      {/* trois semaines puis la rupture */}
      <div style={{ position: "absolute", left: 1080, top: 820, display: "flex", gap: 16 }}>
        {["S1", "S2", "S3", "S4", "S5"].map((s, i) => {
          const p = prog(f, semaines + i * 8, semaines + 10 + i * 8, EASE);
          const casse = i >= 3;
          const v = casse ? prog(f, lache, lache + 10, EASE) : p;
          return (
            <div className="verre"
              key={s}
              style={{
                width: 132,
                height: 80,
                borderRadius: 16,
                background: casse ? "transparent" : i < 3 && p > 0.5 ? C.rougeMoyen : "rgba(39,1,1,0.9)",
                border: `2px ${casse ? "dashed" : "solid"} ${casse ? rougeA(0.6) : rougeA(0.4)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONTSERRAT,
                fontWeight: 900,
                fontSize: 32,
                color: casse ? blancA(0.35) : C.blanc,
                opacity: casse ? v : p,
              }}
            >
              {casse ? <Croix size={44} p={v} /> : s}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Mesures: React.FC<{ at: number[]; feeling: number; histoires: number; fin: number }> = ({ at, feeling, histoires, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < at[0] - 6 || o >= 1) return null;
  const items = [
    { t: "Poids", i: Balance },
    { t: "Sommeil", i: Lune },
    { t: "Charges", i: Halteres },
    { t: "Repas", i: Fourchette },
  ];
  const pf = prog(f, feeling, feeling + 40, EASE_IO);
  // Une courbe « au feeling » : elle part dans tous les sens.
  const N = 40;
  const pts = Array.from({ length: N }, (_, i) => {
    const x = (i / (N - 1)) * 700;
    const y = 120 + Math.sin(i * 0.9) * 50 + (hash(i * 3) - 0.5) * 90;
    return [x, y];
  });
  const vis = pts.slice(0, Math.max(1, Math.round(pf * N)));
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {items.map((it, i) => {
        const p = prog(f, at[i] - 4, at[i] + 12, EASE);
        if (p <= 0) return null;
        const Ic = it.i;
        return (
          <div className="verre"
            key={it.t}
            style={{
              position: "absolute",
              left: 1060 + (i % 2) * 390,
              top: 400 + Math.floor(i / 2) * 190,
              width: 370,
              height: 170,
              borderRadius: 22,
              background: "rgba(39,1,1,0.92)",
              border: "2px solid rgba(245,237,237,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 30px",
              boxSizing: "border-box",
              fontFamily: MONTSERRAT,
              opacity: p * (1 - 0.6 * pf),
              translate: `0 ${(1 - p) * 40}px`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Ic size={52} color={blancA(0.7)} />
              <span style={{ fontWeight: 800, fontSize: 36, color: C.blanc }}>{it.t}</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 70, color: C.rouge }}>?</span>
          </div>
        );
      })}
      {pf > 0 ? (
        <svg width={760} height={260} style={{ position: "absolute", left: 1080, top: 790, overflow: "visible" }}>
          <path
            d={vis.map((q, i) => `${i ? "L" : "M"}${q[0]},${q[1]}`).join(" ")}
            fill="none"
            stroke={C.rouge}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x={0} y={0} fill={blancA(0.55)} fontFamily={MONTSERRAT} fontWeight={800} fontSize={24} letterSpacing="0.2em">
            AU FEELING
          </text>
        </svg>
      ) : null}
      <Chip texte="On se raconte des histoires" at={histoires} x={1460} y={970} variante="plein" size={30} anchor="center" />
    </AbsoluteFill>
  );
};

type CW = {
  gars: number;
  kilos: number;
  plutot: number;
  weekend: number;
  famille: number;
  verres: number;
  dessert: number;
  papier: number;
  enVrai: number;
  maintenance: number;
  casse: number;
  pasSon: number;
  mesureRien: number;
  fin: number;
};

// L'exemple chiffré : la semaine d'un gars de 80 kg qui sèche.
// Semaine à 2 050 kcal, samedi 3 800, dimanche 3 750 : moyenne 2 543, sa maintenance est à 2 550.
const ExempleWeekend: React.FC<{ c: CW }> = ({ c }) => {
  const f = useCurrentFrame();
  const o = prog(f, c.fin, c.fin + 12, EASE_IN);
  if (f < c.gars - 8 || o >= 1) return null;
  const jours = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
  const kcal = [2050, 2050, 2050, 2050, 2050, 3800, 3750];
  const X = 640;
  const Y = 420;
  const Wc = 1100;
  const Hc = 520;
  const max = 4200;
  const bw = 110;
  const gap = (Wc - 7 * bw) / 6;
  const yv = (v: number) => Y + Hc - (v / max) * Hc;
  const pM = prog(f, c.papier + 10, c.papier + 30, EASE_IO);
  const pMoy = prog(f, c.enVrai, c.maintenance + 10, EASE_IO);
  const moy = 2050 + (2543 - 2050) * pMoy;
  const extras = [
    { at: c.famille, t: "Repas de famille", j: 5 },
    { at: c.verres, t: "Deux verres", j: 6 },
    { at: c.dessert, t: "Un dessert", j: 6 },
  ];
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {/* profil */}
      <div style={{ position: "absolute", left: 190, top: 430, fontFamily: MONTSERRAT, opacity: prog(f, c.gars - 6, c.gars + 8, EASE) }}>
        <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: blancA(0.5) }}>EXEMPLE</div>
        <Compteur de={70} a={80} at={c.kilos - 8} duree={24} size={150} suffixe=" kg" style={{ marginTop: 10 }} />
        <div style={{ marginTop: 14, fontWeight: 800, fontSize: 34, color: C.rouge }}>Objectif : sécher</div>
        <div style={{ marginTop: 50, opacity: prog(f, c.enVrai, c.enVrai + 12, EASE) }}>
          <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: "0.22em", color: blancA(0.5) }}>MOYENNE RÉELLE</div>
          <div style={{ fontWeight: 900, fontSize: 84, letterSpacing: "-0.04em", color: C.blanc, fontVariantNumeric: "tabular-nums" }}>
            {Math.round(moy).toLocaleString("fr-FR").replace(/\s/g, " ")}
            <span style={{ fontSize: 36, color: blancA(0.6) }}> kcal</span>
          </div>
        </div>
      </div>
      {/* barres */}
      {jours.map((j, i) => {
        const we = i >= 5;
        const pIn = prog(f, c.plutot - 6 + i * 3, c.plutot + 12 + i * 3, EASE);
        const pWe = we ? prog(f, i === 5 ? c.famille - 4 : c.verres - 4, (i === 5 ? c.famille : c.dessert) + 16, EASE) : 1;
        const v = we ? 2050 + (kcal[i] - 2050) * pWe : kcal[i];
        const top = yv(v * pIn);
        return (
          <React.Fragment key={j}>
            <div
              style={{
                position: "absolute",
                left: X + i * (bw + gap),
                top,
                width: bw,
                height: Y + Hc - top,
                borderRadius: "14px 14px 4px 4px",
                background: we && pWe > 0.05 ? `linear-gradient(180deg, ${C.rouge}, ${C.rougeMoyen})` : "linear-gradient(180deg, rgba(245,237,237,0.30), rgba(245,237,237,0.12))",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: X + i * (bw + gap),
                top: Y + Hc + 16,
                width: bw,
                textAlign: "center",
                fontFamily: MONTSERRAT,
                fontWeight: 800,
                fontSize: 24,
                letterSpacing: "0.1em",
                color: we ? C.rouge : blancA(0.5),
                opacity: pIn,
              }}
            >
              {j}
            </div>
          </React.Fragment>
        );
      })}
      {extras.map((e, k) => (
        <Chip key={k} texte={e.t} at={e.at} x={X + 4 * (bw + gap) + bw} y={440 + k * 78} variante="sombre" size={28} anchor="right" fin={c.casse + 10} from="gauche" />
      ))}
      {/* maintenance */}
      <div style={{ position: "absolute", left: X - 20, top: yv(2550), width: (Wc + 40) * pM, height: 0, borderTop: `3px dashed ${blancA(0.6)}` }} />
      <div style={{ position: "absolute", left: X + Wc + 30, top: yv(2550) - 20, fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 24, color: blancA(0.8), opacity: pM }}>
        MAINTENANCE
      </div>
      <div
        style={{
          position: "absolute",
          left: X + 2 * (bw + gap),
          top: yv(2300) - 20,
          fontFamily: MONTSERRAT,
          fontWeight: 900,
          fontSize: 30,
          color: C.blanc,
          opacity: pM * (1 - prog(f, c.enVrai, c.enVrai + 10, EASE)),
        }}
      >
        Déficit
      </div>
      {/* moyenne qui remonte */}
      {pMoy > 0 ? (
        <div style={{ position: "absolute", left: X - 20, top: yv(moy) - 3, width: Wc + 40, height: 6, background: C.rouge, borderRadius: 3 }} />
      ) : null}
      {/* métabolisme cassé ? */}
      <Chip texte="Métabolisme cassé" at={c.casse + 30} x={X + 4 * (bw + gap) + bw} y={450} variante="barre" barreAt={c.pasSon + 20} size={40} anchor="right" fin={c.mesureRien - 6} />
      <Chip texte="Il ne mesure rien" at={c.mesureRien} x={X + 4 * (bw + gap) + bw} y={450} variante="plein" size={40} anchor="right" />
    </AbsoluteFill>
  );
};

const PlanFige: React.FC<{ at: number; changes: number[]; bouge: number; marcher: number; fin: number }> = ({ at, changes, bouge, marcher, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < at - 6 || o >= 1) return null;
  const labels = ["Ton corps", "Ta semaine", "Ta vie"];
  const pR = prog(f, at, marcher + 30, EASE_IO);
  const pP = prog(f, bouge - 6, bouge + 30, EASE_IO);
  const casse = prog(f, marcher + 10, marcher + 30, EASE);
  const W = 720;
  const N = 60;
  const reel = Array.from({ length: N }, (_, i) => {
    const x = (i / (N - 1)) * W;
    const y = 200 - i * 2.4 + Math.sin(i / 4) * 40;
    return [x, y];
  });
  const vis = reel.slice(0, Math.max(2, Math.round(pR * N)));
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {labels.map((l, i) => (
        <Chip key={l} texte={`${l} change`} at={changes[i] - 4} x={1080} y={410 + i * 96} variante="contour" size={38} />
      ))}
      <svg width={W + 40} height={320} style={{ position: "absolute", left: 1080, top: 730, overflow: "visible" }}>
        <path d={vis.map((q, i) => `${i ? "L" : "M"}${q[0]},${q[1]}`).join(" ")} fill="none" stroke={C.blanc} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
        <line x1={0} x2={W * pP} y1={200} y2={200} stroke={casse > 0 ? interpolate(casse, [0, 1], [0, 1]) > 0.5 ? blancA(0.3) : C.rouge : C.rouge} strokeWidth={7} strokeDasharray={casse > 0.5 ? "16 14" : undefined} />
        <text x={0} y={250} fill={C.rouge} fontFamily={MONTSERRAT} fontWeight={800} fontSize={24} letterSpacing="0.18em" opacity={pP}>
          TON PLAN
        </text>
        <text x={W - 180} y={-10} fill={blancA(0.7)} fontFamily={MONTSERRAT} fontWeight={800} fontSize={24} letterSpacing="0.18em" opacity={pR}>
          TA RÉALITÉ
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// « Avec un autre visage » : la carte du pratiquant se retourne sur celle du coach.
const DeuxVisages: React.FC<{ at: number; flip: number; fin: number }> = ({ at, flip, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 20, EASE);
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (p <= 0 || o >= 1) return null;
  const r = interpolate(f, [flip, flip + 24], [0, 180], { ...clamp, easing: EASE_IO });
  const face = r < 90;
  const W = 560;
  const H = 720;
  return (
    <div style={{ position: "absolute", left: 230, top: 180, width: W, height: H, perspective: 2000, opacity: p * (1 - o), translate: `0 ${(1 - p) * 60}px` }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotateY(${r}deg)`, transformStyle: "preserve-3d" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 30,
            overflow: "hidden",
            transform: face ? undefined : "rotateY(180deg)",
            boxShadow: "0 50px 120px rgba(0,0,0,0.6)",
            border: `2px solid ${rougeA(0.5)}`,
          }}
        >
          <Img
            src={staticFile(face ? "img/portrait_physique.jpg" : "img/portrait_business.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", filter: "saturate(0.55) contrast(1.1) brightness(0.9)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: C.rougeFonce, mixBlendMode: "color", opacity: 0.35 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(13,0,0,0) 50%, rgba(13,0,0,0.92) 100%)" }} />
          <div style={{ position: "absolute", left: 40, bottom: 40, fontFamily: MONTSERRAT }}>
            <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.rouge }}>{face ? "PRATIQUANT" : "COACH"}</div>
            <div style={{ fontWeight: 900, fontSize: 52, letterSpacing: "-0.04em", color: C.blanc, marginTop: 6 }}>{face ? "Pas de résultat" : "Pas de clients"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoachInvisible: React.FC<{
  ville: number;
  vivre: number;
  voient: number;
  soirees: number;
  tableaux: number;
  messages: number;
  fichiers: number;
  systeme: number;
  fin: number;
}> = ({ ville, vivre, voient, soirees, tableaux, messages, fichiers, systeme, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < ville - 6 || o >= 1) return null;
  const pN = prog(f, ville, ville + 20, EASE);
  const barreN = prog(f, vivre + 10, vivre + 24, EASE);
  const sortN = prog(f, voient - 8, voient + 6, EASE_IN);
  const pV = prog(f, voient, voient + 16, EASE);
  const sortV = prog(f, soirees - 8, soirees + 4, EASE_IN);
  const heure = Math.round(kf(f, [[soirees, 20 * 60 + 12], [systeme, 23 * 60 + 47]], EASE_IO));
  const hh = `${Math.floor(heure / 60)}:${String(heure % 60).padStart(2, "0")}`;
  const fen = [
    { at: tableaux, t: "Tableau clients", i: Tableau, x: 1080, y: 470 },
    { at: messages, t: "Messages", i: Bulle, x: 1260, y: 590 },
    { at: fichiers, t: "Fichiers", i: Fichier, x: 1150, y: 720 },
  ];
  const pS = prog(f, systeme, systeme + 14, EASE);
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {/* N°1 de ta ville */}
      {sortN < 1 ? (
        <div style={{ position: "absolute", left: 1100, top: 260, fontFamily: MONTSERRAT, opacity: pN * (1 - sortN), translate: `0 ${(1 - pN) * 50 - sortN * 40}px` }}>
          <div style={{ fontWeight: 900, fontSize: 380, lineHeight: 0.9, letterSpacing: "-0.06em", color: "transparent", backgroundImage: "linear-gradient(170deg, #E01E1E 0%, #B00202 45%, #3d0101 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", position: "relative" }}>
            N°1
            <div
              style={{
                position: "absolute",
                left: -20,
                right: -20,
                top: "48%",
                height: 16,
                background: C.rouge,
                rotate: "-8deg",
                transformOrigin: "left",
                scale: `${barreN} 1`,
              }}
            />
          </div>
          <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: "0.2em", color: blancA(0.7), marginTop: 20 }}>DE TA VILLE</div>
        </div>
      ) : null}
      {/* invisible */}
      {sortV < 1 && pV > 0 ? (
        <div style={{ position: "absolute", left: 1120, top: 360, fontFamily: MONTSERRAT, opacity: pV * (1 - sortV) }}>
          <Oeil size={200} color={C.rouge} stroke={1.4} />
          <div style={{ marginTop: 30, width: 600, height: 18, borderRadius: 9, background: blancA(0.1) }}>
            <div style={{ width: 600 * 0.07 * prog(f, voient + 10, voient + 30, EASE), height: 18, borderRadius: 9, background: C.rouge }} />
          </div>
          <div style={{ marginTop: 16, fontWeight: 800, fontSize: 28, letterSpacing: "0.2em", color: blancA(0.6) }}>VISIBILITÉ</div>
        </div>
      ) : null}
      {/* les soirées */}
      {f >= soirees - 4 ? (
        <>
          <div style={{ position: "absolute", left: 1080, top: 250, display: "flex", alignItems: "center", gap: 24, opacity: prog(f, soirees - 4, soirees + 10, EASE) }}>
            <Horloge size={90} color={C.rouge} />
            <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 110, letterSpacing: "-0.04em", color: C.blanc, fontVariantNumeric: "tabular-nums" }}>{hh}</div>
          </div>
          {fen.map((w, i) => {
            const p = prog(f, w.at - 4, w.at + 12, EASE);
            if (p <= 0) return null;
            const Ic = w.i;
            return (
              <div className="verre"
                key={i}
                style={{
                  position: "absolute",
                  left: w.x,
                  top: w.y,
                  width: 520,
                  height: 230,
                  borderRadius: 18,
                  background: "rgba(39,1,1,0.96)",
                  border: "2px solid rgba(245,237,237,0.1)",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.7)",
                  opacity: p,
                  scale: `${0.85 + 0.15 * p}`,
                  fontFamily: MONTSERRAT,
                  overflow: "hidden",
                }}
              >
                <div style={{ height: 44, background: "rgba(245,237,237,0.06)", display: "flex", alignItems: "center", gap: 10, padding: "0 18px" }}>
                  {[0, 1, 2].map((k) => (
                    <div key={k} style={{ width: 12, height: 12, borderRadius: 6, background: k === 0 ? C.rouge : blancA(0.2) }} />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "40px 30px" }}>
                  <Ic size={70} color={C.rouge} />
                  <span style={{ fontWeight: 900, fontSize: 40, color: C.blanc }}>{w.t}</span>
                </div>
              </div>
            );
          })}
          {pS > 0 ? (
            <div style={{ position: "absolute", left: 1100, top: 960, opacity: pS }}>
              <Chip texte="Aucun système" at={systeme} x={0} y={-20} variante="plein" size={36} />
            </div>
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const MemeSolution: React.FC<{ at: number; suivi: number; systeme: number }> = ({ at, suivi, systeme }) => {
  const f = useCurrentFrame();
  if (f < at - 6) return null;
  const pA = prog(f, at, at + 18, EASE);
  const merge = prog(f, suivi - 20, suivi + 10, EASE_IO);
  const cols = [
    { t: "Pratiquant", x: 330 },
    { t: "Coach", x: 1150 },
  ];
  return (
    <AbsoluteFill>
      {cols.map((k, i) => {
        const x = k.x + (960 - 220 - k.x) * merge;
        return (
          <div className="verre"
            key={k.t}
            style={{
              position: "absolute",
              left: x,
              top: 470,
              width: 440,
              height: 130,
              borderRadius: 24,
              background: "rgba(39,1,1,0.92)",
              border: `2px solid ${rougeA(0.4)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: MONTSERRAT,
              fontWeight: 900,
              fontSize: 52,
              letterSpacing: "-0.03em",
              color: C.blanc,
              opacity: pA * (1 - merge * 0.9),
              translate: `0 ${(1 - pA) * 40 + (i ? -1 : 1) * 0}px`,
            }}
          >
            {k.t}
          </div>
        );
      })}
      <div className="verre"
        style={{
          position: "absolute",
          left: 960 - 380,
          top: 430,
          width: 760,
          borderRadius: 30,
          background: "linear-gradient(160deg, rgba(176,2,2,0.7), rgba(39,1,1,0.96) 60%)",
          border: `2px solid ${C.rouge}`,
          boxShadow: "0 50px 120px rgba(0,0,0,0.6)",
          padding: "44px 56px",
          boxSizing: "border-box",
          fontFamily: MONTSERRAT,
          opacity: merge,
          scale: `${0.9 + 0.1 * merge}`,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: blancA(0.7) }}>LA MÊME SOLUTION</div>
        {[
          { t: "Un vrai suivi", at: suivi },
          { t: "Un système qui travaille pour toi", at: systeme },
        ].map((l, i) => {
          const p = prog(f, l.at - 2, l.at + 14, EASE);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 30, opacity: p, translate: `${(1 - p) * 30}px 0` }}>
              <Coche size={58} p={p} />
              <span style={{ fontWeight: 900, fontSize: 48, letterSpacing: "-0.03em", color: C.blanc }}>{l.t}</span>
            </div>
          );
        })}
      </div>
      <SurTitre texte="Que tu sois" at={at} x={190} y={410} fin={suivi - 20} color={blancA(0.5)} size={22} />
    </AbsoluteFill>
  );
};

export const Scene3: React.FC<SceneProps> = ({ scene }) => (
  <Shell scene={scene ?? sceneParDefaut(3)} fond={{ x: 75, y: 25 }}>
    <Contenu />
  </Shell>
);
