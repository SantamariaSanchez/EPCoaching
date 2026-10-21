import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, MONTSERRAT, blancA, rougeA } from "../lib/brand";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { EASE, EASE_IN, EASE_IO, Layout, hash, prog, useCues } from "../lib/scene";
import { KineticText } from "../components/KineticText";
import { Logo, Shell } from "../components/Shell";
import { LightLeak } from "../components/Fond";
import { Chip, Coche, Croix, Photo, Sfx, SurTitre } from "../components/primitives";
import { Callout, Phone } from "../components/Phone";
import { Cadenas, Fichier, Lune, Vague } from "../components/Icones";

// Scène 4, le système : la visite de l'appli, écran par écran, sur les vraies captures.
const Contenu: React.FC = () => {
  const { cue, mot } = useCues();
  const c = {
    construit: cue("j'ai construit EP Coaching"),
    depart: cue("Au départ"),
    outil: cue("mon outil à moi"),
    coeur: cue("le cœur de tout"),
    regarde: cue("Regarde bien"),
    matin: cue("Le matin, tu ouvres"),
    manges: cue("Tu sais ce que tu manges"),
    gramme: cue("au gramme près"),
    seance: cue("quand est ta séance"),
    faire: cue("ce que tu vas y faire"),
    agenda: cue("Ton agenda te prévient"),
    reflechir: cue("rien à réfléchir"),
    executes: cue("Tu exécutes"),
    pdf: cue("pas un PDF"),
    vit: cue("Elle vit"),
    ecart: cue("Un petit écart"),
    rien: cue("ça ne change rien"),
    sautes: cue("Tu sautes un repas"),
    adapte: cue("Le suivant s'adapte"),
    mange: cue("déjà mangé"),
    base: cue("Ton plan de base"),
    carnet: cue("carnet d'entraînement"),
    charges: cue("Tes charges"),
    progresses: cue("si tu progresses"),
    stagnes: cue("si tu stagnes"),
    chaqueMatin: cue("Chaque matin"),
    trente: cue("trente secondes"),
    poids: cue("Poids, sommeil, ressenti"),
    semaine: cue("Et chaque semaine"),
    checkin: cue("ton check-in"),
    photos: cue("photos, mensurations"),
    vrac: cue("chiffres en vrac"),
    phrase: cue("Une phrase claire"),
    soir: cue("Et le soir"),
    decrocher: cue("décrocher"),
    sons: cue("sons pour t'endormir"),
    respiration: cue("respiration"),
    meditation: cue("méditation guidée"),
    recup: cue("Parce que la récup"),
    moitie: cue("la moitié"),
    courses: cue("liste de courses"),
    roadmap: cue("Ta road map"),
    seul: cue("jamais seul"),
    communaute: cue("la communauté"),
    lives: cue("les lives"),
    messages: cue("les messages avec ton coach"),
    coachs: cue("Et pour les coachs"),
    meme: cue("le même système"),
    autreCote: cue("de l'autre côté"),
    clients: cue("Tes clients"),
    endroit: cue("au même endroit"),
    remontent: cue("remontent tout seuls"),
    agendaCoach: cue("Ton agenda, tes lives"),
    stats: cue("tes stats de contenu"),
    leads: cue("tes leads"),
    studio: cue("un studio"),
    voient: cue("te voient enfin"),
    magie: cue("pas de la magie"),
    principes: cue("principes très simples"),
  };
  const layoutAt = (fr: number): Layout =>
    fr < c.depart
      ? "bas"
      : fr < c.pdf
        ? "gauche"
        : fr < c.carnet
          ? "droite"
          : fr < c.chaqueMatin
            ? "haut"
            : fr < c.soir
              ? "gauche"
              : fr < c.courses
                ? "droite"
                : fr < c.magie
                  ? "gauche"
                  : "plein";

  return (
    <>
      {/* Le logo */}
      <Logo at={c.construit - 16} x={960} y={420} w={560} fin={c.depart - 10} />
      <LeakAt at={c.construit - 10} duree={60} />

      {/* Mon outil à moi */}
      <Photo src="hero_current.jpg" x={1030} y={150} w={430} h={620} at={c.depart - 4} fin={c.regarde - 6} pos="50% 30%" rot={-3} />
      <SurTitre texte="Ma propre prépa" at={c.outil + 10} x={1040} y={800} fin={c.regarde - 8} />

      {/* La journée type : un seul téléphone, les écrans se succèdent */}
      <Phone
        x={1520}
        y={600}
        h={840}
        enter={c.outil - 6}
        sortie={c.pdf - 14}
        tilt={-14}
        ecrans={[
          { src: "aujourdhui", at: c.outil - 6, zoom: [[0, 1, 50, 50]] },
          { src: "nutrition", at: c.manges, zoom: [[0, 1, 50, 50], [c.gramme - c.manges, 1, 50, 70], [c.gramme - c.manges + 24, 1.6, 50, 78]] },
          { src: "entrainement", at: c.seance, zoom: [[0, 1.3, 50, 26], [c.faire - c.seance + 10, 1.3, 50, 50]] },
          { src: "agenda", at: c.agenda, zoom: [[0, 1, 50, 40], [26, 1.45, 42, 56]] },
        ]}
      />
      <Callout at={c.gramme + 8} x={1520} y={830} tx={1040} ty={110} texte="Au gramme près" cote="droite" fin={c.seance - 6} />
      <Callout at={c.agenda + 30} x={1375} y={620} tx={1040} ty={110} texte="À la bonne heure" cote="droite" fin={c.reflechir - 4} />
      <Executer at={c.reflechir} exec={mot("Tu exécutes")} fin={c.pdf - 10} />

      {/* La diète vivante */}
      <PdfMort at={c.pdf} vit={c.vit} fin={c.ecart - 6} />
      <Journee c={{ ecart: c.ecart, banane: mot("une banane"), rien: c.rien, sautes: c.sautes, adapte: c.adapte, mange: c.mange, base: c.base, fin: c.carnet - 10 }} />

      {/* Le carnet d'entraînement */}
      <Phone
        x={560}
        y={720}
        h={640}
        enter={c.carnet - 6}
        sortie={c.chaqueMatin - 14}
        tilt={12}
        ecrans={[{ src: "logbook", at: c.carnet - 6, zoom: [[0, 1, 50, 50], [30, 1.25, 50, 62]] }]}
      />
      <Progression at={c.charges} records={mot("tes records")} progresses={c.progresses} stagnes={c.stagnes} fin={c.chaqueMatin - 10} />

      {/* Bilan, check-in, phrase claire */}
      <Phone
        x={1430}
        y={600}
        h={840}
        enter={c.chaqueMatin - 6}
        sortie={c.soir - 12}
        ecrans={[
          { src: "bilan", at: c.chaqueMatin - 6, zoom: [[0, 1, 50, 50], [c.poids - c.chaqueMatin, 1, 50, 50], [c.poids - c.chaqueMatin + 20, 1.7, 30, 74]] },
          { src: "progression", at: c.checkin, zoom: [[0, 1, 50, 40], [c.photos - c.checkin + 10, 1.35, 50, 72]] },
          { src: "road-map", at: c.vrac - 4, zoom: [[0, 1, 50, 50], [c.phrase - c.vrac + 4, 1, 50, 50], [c.phrase - c.vrac + 30, 1.85, 50, 77]] },
        ]}
      />
      <Chrono at={c.trente} fin={c.semaine - 4} />
      <ChiffresEnVrac at={c.vrac} fin={c.phrase + 6} />
      <Callout at={c.phrase + 40} x={1430} y={820} tx={1040} ty={110} texte="Où tu en es, quoi faire" cote="droite" fin={c.soir - 14} />

      {/* Le soir : récupération */}
      <Nuit at={c.soir} sons={c.sons} respiration={c.respiration} meditation={c.meditation} moitie={c.moitie} fin={c.courses - 10} />

      {/* Courses, road map, jamais seul */}
      <Phone
        x={1430}
        y={600}
        h={840}
        enter={c.courses - 6}
        sortie={c.seul - 4}
        ecrans={[
          { src: "nutrition", at: c.courses - 6, zoom: [[0, 1, 50, 50], [20, 1.9, 82, 30]] },
          { src: "road-map", at: c.roadmap, zoom: [[0, 1.5, 50, 36], [c.roadmap - c.roadmap + 60, 1.5, 50, 40]] },
        ]}
      />
      <Callout at={c.courses + 30} x={1576} y={509} tx={1040} ty={110} texte="Liste de courses" cote="droite" fin={c.roadmap - 4} />
      <Callout at={mot("phase par phase") - 2} x={1301} y={496} tx={1040} ty={110} texte="Phase par phase" cote="droite" fin={c.seul - 6} />
      <Phone x={1150} y={600} h={640} enter={c.communaute - 4} sortie={c.coachs - 10} tilt={-20} ecrans={[{ src: "communaute", at: c.communaute - 4 }]} />
      <Phone x={1440} y={560} h={700} enter={c.lives - 4} sortie={c.coachs - 10} tilt={-8} ecrans={[{ src: "live", at: c.lives - 4 }]} />
      <Phone
        x={1720}
        y={600}
        h={640}
        enter={c.messages - 4}
        flip={[c.autreCote - 6, c.autreCote + 22]}
        sortie={c.clients - 10}
        tilt={4}
        ecrans={[
          { src: "messages", at: c.messages - 4 },
          { src: "coach-accueil", at: c.autreCote - 6 },
        ]}
      />

      {/* Côté coach */}
      <Phone
        x={1430}
        y={600}
        h={840}
        enter={c.clients - 6}
        sortie={c.magie - 10}
        ecrans={[
          { src: "clients", at: c.clients - 6, zoom: [[0, 1, 50, 50], [30, 1.35, 50, 72]] },
          { src: "coach-accueil", at: c.remontent - 4, zoom: [[0, 1, 50, 30], [24, 1.55, 50, 34]] },
          { src: "coach-agenda", at: mot("Ton agenda") },
          { src: "live", at: mot("tes lives") },
          { src: "equipe", at: mot("ton équipe") },
          { src: "stats-reseaux", at: c.stats - 2, zoom: [[0, 1, 50, 40], [20, 1.4, 50, 48], [c.studio - c.stats, 1.4, 50, 48], [c.studio - c.stats + 24, 2.1, 12, 2]] },
        ]}
      />
      <Callout at={c.remontent + 30} x={1290} y={411} tx={1040} ty={110} texte="Alertes urgentes" cote="droite" fin={c.agendaCoach - 4} />
      <Chip texte="Leads" at={c.leads - 2} x={1060} y={760} variante="plein" size={40} fin={c.studio - 4} />
      <Callout at={c.studio + 30} x={1286} y={256} tx={1040} ty={110} texte="Studio créatif" cote="droite" fin={c.magie - 12} />

      {/* Pas de magie : le mur d'écrans */}
      <MurEcrans at={c.magie - 6} />

      <KineticText layoutAt={layoutAt} />

      <Sfx at={c.construit - 16} son="impact" volume={0.45} />
      <Sfx at={c.depart - 4} son="whoosh" volume={0.3} />
      <Sfx at={c.manges} son="swoosh" volume={0.25} />
      <Sfx at={c.gramme + 8} son="pop" volume={0.3} />
      <Sfx at={c.seance} son="swoosh" volume={0.25} />
      <Sfx at={c.agenda} son="swoosh" volume={0.25} />
      <Sfx at={c.agenda + 30} son="bell" volume={0.25} />
      <Sfx at={mot("Tu exécutes")} son="impact" volume={0.35} />
      <Sfx at={c.vit} son="thud" volume={0.35} />
      <Sfx at={mot("une banane")} son="pop" volume={0.3} />
      <Sfx at={c.sautes} son="tick" volume={0.3} />
      <Sfx at={c.adapte} son="whoosh" volume={0.3} />
      <Sfx at={c.base} son="click" volume={0.35} />
      <Sfx at={mot("tes records")} son="bell" volume={0.25} />
      <Sfx at={c.trente} son="tick" volume={0.3} />
      <Sfx at={c.checkin} son="swoosh" volume={0.25} />
      <Sfx at={c.phrase + 30} son="pop" volume={0.3} />
      <Sfx at={c.soir} son="whoosh" volume={0.25} />
      <Sfx at={c.moitie} son="impact" volume={0.3} />
      <Sfx at={c.courses - 6} son="whoosh" volume={0.3} />
      <Sfx at={c.communaute - 4} son="pop" volume={0.25} />
      <Sfx at={c.lives - 4} son="pop" volume={0.25} />
      <Sfx at={c.messages - 4} son="pop" volume={0.25} />
      <Sfx at={c.autreCote - 6} son="whoosh" volume={0.4} />
      <Sfx at={c.remontent + 30} son="bell" volume={0.2} />
      <Sfx at={mot("Ton agenda")} son="click" volume={0.25} />
      <Sfx at={mot("tes lives")} son="click" volume={0.25} />
      <Sfx at={mot("ton équipe")} son="click" volume={0.25} />
      <Sfx at={c.magie - 6} son="impact" volume={0.4} />
    </>
  );
};

const LeakAt: React.FC<{ at: number; duree: number }> = ({ at, duree }) => {
  const f = useCurrentFrame();
  return <LightLeak p={(f - at) / duree} force={0.8} />;
};

const Executer: React.FC<{ at: number; exec: number; fin: number }> = ({ at, exec, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, exec - 4, exec + 14, EASE);
  const o = prog(f, fin, fin + 10, EASE_IN);
  if (f < at || p <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 1150, top: 200, opacity: 1 - o, scale: `${0.6 + 0.4 * p}` }}>
      <Coche size={140} p={p} />
    </div>
  );
};

const PdfMort: React.FC<{ at: number; vit: number; fin: number }> = ({ at, vit, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 18, EASE);
  const x = prog(f, vit, vit + 12, EASE);
  const o = prog(f, fin, fin + 10, EASE_IN);
  if (p <= 0 || o >= 1) return null;
  return (
    <div className="verre"
      style={{
        position: "absolute",
        left: 230,
        top: 200,
        width: 520,
        height: 680,
        borderRadius: 20,
        background: "linear-gradient(170deg, #2a1515, #160808)",
        border: "2px solid rgba(245,237,237,0.08)",
        boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
        opacity: p * (1 - o) * (1 - 0.4 * x),
        rotate: `${-4 + (1 - p) * -8 + x * 6}deg`,
        filter: `grayscale(${0.8}) brightness(${1 - x * 0.4})`,
        fontFamily: MONTSERRAT,
        padding: 50,
        boxSizing: "border-box",
      }}
    >
      <Fichier size={120} color={blancA(0.45)} stroke={1.5} />
      <div style={{ marginTop: 30, fontWeight: 900, fontSize: 48, color: blancA(0.7), letterSpacing: "-0.03em" }}>diete_v3_finale.pdf</div>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <div key={k} style={{ marginTop: 26, height: 16, width: `${90 - (k % 3) * 18}%`, borderRadius: 8, background: blancA(0.1) }} />
      ))}
      <div style={{ position: "absolute", right: 40, bottom: 40 }}>
        <Croix size={110} p={x} />
      </div>
    </div>
  );
};

type JC = { ecart: number; banane: number; rien: number; sautes: number; adapte: number; mange: number; base: number; fin: number };

// La diète qui vit : 4 repas, 2 300 kcal (le plan de la capture « Sèche douce, 2 300 kcal »).
// Banane en plus : rien ne change. Repas sauté : le suivant s'adapte, le total ne bouge pas.
const Journee: React.FC<{ c: JC }> = ({ c }) => {
  const f = useCurrentFrame();
  const o = prog(f, c.fin, c.fin + 12, EASE_IN);
  if (f < c.ecart - 6 || o >= 1) return null;
  const saute = prog(f, c.sautes + 10, c.sautes + 24, EASE);
  const adapte = prog(f, c.adapte, c.adapte + 30, EASE_IO);
  const lock = prog(f, c.mange, c.mange + 14, EASE);
  const base = prog(f, c.base, c.base + 16, EASE);
  const repas = [
    { t: "Repas 1", k: 600, etat: "mangé" },
    { t: "Repas 2", k: 380, etat: "" },
    { t: "Repas 3", k: 560, etat: "" },
    { t: "Repas 4", k: 760, etat: "" },
  ];
  const kcal = (i: number) => (i === 1 ? 380 * (1 - saute) : i === 2 ? 560 + 380 * adapte : repas[i].k);
  const H = 520;
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      <SurTitre texte="Ta journée" at={c.ecart} x={110} y={150} color={blancA(0.55)} size={24} />
      {repas.map((r, i) => {
        const p = prog(f, c.ecart + i * 5, c.ecart + 18 + i * 5, EASE);
        const h = (kcal(i) / 940) * H * 0.9 + 60;
        const x = 110 + i * 205;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 210 + H - h, width: 180, height: h, opacity: p, translate: `0 ${(1 - p) * 60}px` }}>
            <div className="verre"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 20,
                background: i === 1 && saute > 0.5 ? "transparent" : i === 2 ? `linear-gradient(180deg, ${C.rouge}, ${C.rougeMoyen})` : "rgba(39,1,1,0.95)",
                border: `2px ${i === 1 && saute > 0.5 ? "dashed" : "solid"} ${i === 2 ? C.rouge : rougeA(0.35)}`,
                opacity: i === 1 ? 1 - saute * 0.5 : 1,
              }}
            />
            <div style={{ position: "absolute", left: 0, right: 0, top: 20, textAlign: "center", fontFamily: MONTSERRAT }}>
              <div style={{ fontWeight: 900, fontSize: 40, color: C.blanc, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>{Math.round(kcal(i))}</div>
              <div style={{ fontWeight: 700, fontSize: 20, color: blancA(0.6), letterSpacing: "0.1em" }}>KCAL</div>
            </div>
            {i === 0 ? (
              <div style={{ position: "absolute", left: 60, bottom: 20, opacity: lock, scale: `${0.6 + 0.4 * lock}` }}>
                <Cadenas size={60} color={C.rouge} />
              </div>
            ) : null}
            {i === 1 && saute > 0 ? (
              <div style={{ position: "absolute", left: 50, top: h / 2 - 40, opacity: saute }}>
                <Croix size={80} p={saute} />
              </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, top: h + 18, textAlign: "center", fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 24, color: blancA(0.7) }}>
              {i === 1 && saute > 0.5 ? "Sauté" : i === 0 && lock > 0.5 ? "Déjà mangé" : r.t}
            </div>
          </div>
        );
      })}
      <Chip texte="+ 1 banane" at={c.banane} x={315} y={220 + H - (380 / 940) * H * 0.9 - 150} variante="contour" size={28} fin={c.sautes} />
      <Chip texte="Ça ne change rien" at={c.rien + 4} x={110} y={100} variante="check" size={28} fin={c.sautes} />
      {/* total et plan de base */}
      <div className="verre"
        style={{
          position: "absolute",
          left: 110,
          top: 860,
          width: 795,
          height: 110,
          borderRadius: 22,
          background: base > 0.5 ? "linear-gradient(90deg, rgba(176,2,2,0.8), rgba(39,1,1,0.95))" : "rgba(39,1,1,0.95)",
          border: `2px solid ${rougeA(0.3 + 0.7 * base)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 36px",
          boxSizing: "border-box",
          fontFamily: MONTSERRAT,
          opacity: prog(f, c.ecart + 20, c.ecart + 34, EASE),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ opacity: base }}>
            <Cadenas size={50} color={C.blanc} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 30, color: C.blanc, letterSpacing: "-0.01em" }}>{base > 0.5 ? "Plan de base" : "Total du jour"}</span>
        </div>
        <span style={{ fontWeight: 900, fontSize: 50, color: C.blanc, letterSpacing: "-0.04em" }}>2&#8239;300 kcal</span>
      </div>
    </AbsoluteFill>
  );
};

const Progression: React.FC<{ at: number; records: number; progresses: number; stagnes: number; fin: number }> = ({ at, records, progresses, stagnes, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < at - 6 || o >= 1) return null;
  const vals = [70, 72.5, 75, 77.5, 80, 80, 80];
  const X = 1000;
  const Y = 470;
  const W = 800;
  const Hh = 400;
  const bw = 80;
  const gap = (W - 7 * bw) / 6;
  const stag = prog(f, stagnes, stagnes + 14, EASE);
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      <SurTitre texte="Développé couché, 7 semaines" at={at} x={X} y={Y - 50} color={blancA(0.6)} size={22} />
      {vals.map((v, i) => {
        const p = prog(f, at + i * 5, at + 18 + i * 5, EASE);
        const h = ((v - 60) / 25) * Hh * p;
        const plat = i >= 4;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: X + i * (bw + gap),
                top: Y + Hh - h,
                width: bw,
                height: h,
                borderRadius: "12px 12px 4px 4px",
                background: plat && stag > 0.5 ? blancA(0.25) : `linear-gradient(180deg, ${C.rouge}, ${C.rougeMoyen})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: X + i * (bw + gap) - 10,
                top: Y + Hh - h - 44,
                width: bw + 20,
                textAlign: "center",
                fontFamily: MONTSERRAT,
                fontWeight: 800,
                fontSize: 24,
                color: C.blanc,
                opacity: p,
              }}
            >
              {String(v).replace(".", ",")}
            </div>
          </React.Fragment>
        );
      })}
      <Chip texte="Record" at={records} x={X + 4 * (bw + gap) + bw / 2} y={Y - 30} variante="plein" size={26} anchor="center" />
      <svg width={W} height={Hh} style={{ position: "absolute", left: X, top: Y, overflow: "visible", opacity: prog(f, progresses, progresses + 12, EASE) }}>
        <path
          d={`M${bw / 2},${Hh - ((70 - 60) / 25) * Hh - 70} L${4 * (bw + gap) + bw / 2},${Hh - ((80 - 60) / 25) * Hh - 70}`}
          stroke={C.blanc}
          strokeWidth={5}
          strokeDasharray="1000"
          strokeDashoffset={1000 * (1 - prog(f, progresses, progresses + 30, EASE_IO))}
          fill="none"
        />
      </svg>
      <Chip texte="Ça stagne : on ajuste" at={stagnes + 10} x={X + 5 * (bw + gap)} y={Y + Hh + 40} variante="contour" size={26} anchor="center" />
    </AbsoluteFill>
  );
};

const Chrono: React.FC<{ at: number; fin: number }> = ({ at, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at - 4, at + 12, EASE);
  const o = prog(f, fin, fin + 10, EASE_IN);
  if (p <= 0 || o >= 1) return null;
  const t = prog(f, at, at + 60, EASE_IO);
  const R = 120;
  const L = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", left: 1000, top: 140, width: 300, height: 300, opacity: p * (1 - o), scale: `${0.8 + 0.2 * p}` }}>
      <svg width={300} height={300}>
        <circle cx={150} cy={150} r={R} stroke={blancA(0.12)} strokeWidth={16} fill="rgba(13,0,0,0.85)" />
        <circle cx={150} cy={150} r={R} stroke={C.rouge} strokeWidth={16} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - t)} strokeLinecap="round" transform="rotate(-90 150 150)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: MONTSERRAT }}>
        <div style={{ fontWeight: 900, fontSize: 96, color: C.blanc, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(t * 30)}</div>
        <div style={{ fontWeight: 800, fontSize: 22, color: blancA(0.6), letterSpacing: "0.2em" }}>SECONDES</div>
      </div>
    </div>
  );
};

// Des chiffres en vrac qui flottent… puis disparaissent devant la phrase claire.
const ChiffresEnVrac: React.FC<{ at: number; fin: number }> = ({ at, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 16, EASE_IN);
  if (f < at - 4 || o >= 1) return null;
  const vals = ["81,6", "6,5 h", "80 %", "11 660", "-0,86", "1,04 %", "0,09", "21/20", "2 300", "94 g", "151 g", "19 g", "67 kg", "33 %"];
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      {vals.map((v, i) => {
        const p = prog(f, at + i * 2, at + i * 2 + 12, EASE);
        const x = 1000 + hash(i) * 820;
        const y = 120 + hash(i + 40) * 820;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + Math.sin((f + i * 13) / 18) * 12,
              fontFamily: MONTSERRAT,
              fontWeight: 900,
              fontSize: 40 + hash(i + 7) * 40,
              color: i % 4 === 0 ? C.rouge : blancA(0.75),
              opacity: p * 0.9,
              rotate: `${(hash(i + 3) - 0.5) * 30}deg`,
              letterSpacing: "-0.03em",
            }}
          >
            {v}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Nuit: React.FC<{ at: number; sons: number; respiration: number; meditation: number; moitie: number; fin: number }> = ({ at, sons, respiration, meditation, moitie, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 24, EASE);
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (p <= 0 || o >= 1) return null;
  const souffle = 0.75 + 0.25 * Math.sin(((f - respiration) / 120) * Math.PI * 2);
  const pR = prog(f, respiration - 4, respiration + 16, EASE);
  const pS = prog(f, sons - 4, sons + 12, EASE);
  const pD = prog(f, moitie - 6, moitie + 30, EASE_IO);
  const sortCercle = prog(f, moitie - 10, moitie, EASE);
  const R = 170;
  const L = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ opacity: p * (1 - o) }}>
      <div style={{ position: "absolute", left: 140, top: 130, opacity: 1 - sortCercle }}>
        <Lune size={96} color={C.rose} stroke={1.6} />
      </div>
      {/* onde sonore */}
      <div style={{ position: "absolute", left: 140, top: 860, display: "flex", gap: 10, alignItems: "center", height: 120, opacity: pS * (1 - sortCercle) }}>
        {Array.from({ length: 34 }).map((_, i) => {
          const h = 16 + Math.abs(Math.sin((f + i * 9) / 11) * Math.sin((f * 0.7 + i * 5) / 23)) * 100;
          return <div key={i} style={{ width: 10, height: h, borderRadius: 5, background: i % 6 === 0 ? C.rouge : blancA(0.4) }} />;
        })}
      </div>
      {/* cercle de respiration */}
      <div
        style={{
          position: "absolute",
          left: 520 - 220,
          top: 500 - 220,
          width: 440,
          height: 440,
          borderRadius: "50%",
          border: `3px solid ${rougeA(0.8)}`,
          background: `radial-gradient(circle, ${rougeA(0.28)} 0%, rgba(224,30,30,0) 70%)`,
          scale: `${(0.5 + 0.5 * pR) * souffle}`,
          opacity: pR * (1 - sortCercle),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 320,
          top: 470,
          width: 400,
          textAlign: "center",
          fontFamily: MONTSERRAT,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: "0.24em",
          color: C.blanc,
          opacity: pR * (1 - sortCercle),
        }}
      >
        {Math.sin(((f - respiration) / 120) * Math.PI * 2) > 0 ? "INSPIRE" : "EXPIRE"}
      </div>
      <Chip texte="Sons pour dormir" at={sons} x={140} y={260} variante="sombre" size={30} fin={moitie - 10} />
      <Chip texte="Respiration" at={respiration} x={540} y={260} variante="sombre" size={30} fin={moitie - 10} />
      <Chip texte="Méditation guidée" at={meditation} x={330} y={760} variante="sombre" size={30} fin={moitie - 10} />
      {/* la moitié des résultats */}
      {pD > 0 ? (
        <div style={{ position: "absolute", left: 300, top: 260, width: 440, height: 440 }}>
          <svg width={440} height={440}>
            <circle cx={220} cy={220} r={R} stroke={blancA(0.12)} strokeWidth={44} fill="none" />
            <circle cx={220} cy={220} r={R} stroke={C.rouge} strokeWidth={44} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - 0.5 * pD)} transform="rotate(-90 220 220)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: MONTSERRAT }}>
            <div style={{ fontWeight: 900, fontSize: 110, color: C.blanc, letterSpacing: "-0.05em", lineHeight: 1 }}>{Math.round(50 * pD)} %</div>
            <div style={{ fontWeight: 800, fontSize: 26, color: blancA(0.6), letterSpacing: "0.22em" }}>RÉCUPÉRATION</div>
          </div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 140, top: 860, opacity: pD }}>
        <Vague size={80} color={C.rouge} />
      </div>
    </AbsoluteFill>
  );
};

// Le mur d'écrans : toute l'appli, en perspective, qui défile lentement.
const MurEcrans: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 40, EASE);
  if (p <= 0) return null;
  const ecrans = [
    "aujourdhui", "nutrition", "entrainement", "logbook", "bilan", "progression", "road-map", "agenda",
    "semaine", "communaute", "live", "messages", "formations", "bibliotheque", "notes", "recherche",
    "coach-accueil", "clients", "coach-agenda", "equipe", "stats-reseaux", "mailing", "personnalisation", "aujourdhui",
  ];
  const cols = 8;
  const w = 250;
  const h = w * (1328 / 780);
  const d = (f - at) * 0.9;
  return (
    <AbsoluteFill style={{ perspective: 1800, opacity: p }}>
      <div
        style={{
          position: "absolute",
          left: 960 - (cols * (w + 30)) / 2,
          top: -120,
          width: cols * (w + 30),
          transform: `rotateX(28deg) rotateZ(-10deg) translateY(${-d}px) scale(${1.1 - 0.1 * p})`,
          transformOrigin: "50% 30%",
        }}
      >
        {ecrans.map((e, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const pe = prog(f, at + (col + row) * 2, at + (col + row) * 2 + 20, EASE);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: col * (w + 30),
                top: row * (h + 30) + (col % 2) * 120,
                width: w,
                height: h,
                borderRadius: 26,
                overflow: "hidden",
                border: "2px solid rgba(245,237,237,0.08)",
                opacity: pe,
                translate: `0 ${(1 - pe) * 80}px`,
              }}
            >
              <Img src={staticFile(`img/app/${e}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 40% 50%, rgba(13,0,0,0.88) 0%, rgba(13,0,0,0.55) 60%, rgba(13,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Scene4: React.FC<SceneProps> = ({ scene }) => (
  <Shell scene={scene ?? sceneParDefaut(4)} fond={{ x: 50, y: 40 }}>
    <Contenu />
  </Shell>
);
