import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, MONTSERRAT, blancA, rougeA } from "../lib/brand";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { EASE, EASE_IN, EASE_IO, Layout, kf, prog, useCues } from "../lib/scene";
import { KineticText } from "../components/KineticText";
import { Shell } from "../components/Shell";
import { Chip, Coche, Sfx, SurTitre } from "../components/primitives";
import { Phone } from "../components/Phone";

// Scène 5, la bifurcation : écran partagé pratiquant / coach, puis chaque côté
// prend toute la place à son tour. Ensuite le filtre (pas pour tout le monde)
// et la question des six mois.
const Contenu: React.FC = () => {
  const { cue, mot } = useCues();
  const c = {
    deux: cue("il y a deux cas"),
    lequel: cue("lequel c'est toi"),
    cas1: cue("Premier cas"),
    gras: cue("Perdre du gras"),
    muscle: cue("prendre du muscle"),
    compet: cue("préparer une compétition"),
    moi: cue("je t'accompagne moi-même"),
    plan: cue("On construit ton plan"),
    diete: cue("ta diète, ton training"),
    appli: cue("Tu as l'appli"),
    ajuster: cue("ajuster chaque semaine"),
    seul: cue("plus jamais seul"),
    cas2: cue("Deuxième cas"),
    coach: cue("Tu es coach"),
    connaissances: cue("Tu as les connaissances"),
    clients: cue("pas encore les clients"),
    temps: cue("pas le temps"),
    business: cue("sur ton business"),
    niche: cue("Ta niche"),
    remplir: cue("remplir ton agenda"),
    suivre: cue("suivre tes clients"),
    appliCoach: cue("l'appli coach"),
    premier: cue("du premier contenu"),
    transparent: cue("transparent"),
    pasPour: cue("pas pour tout le monde"),
    miracle: cue("méthode miracle"),
    dix: cue("dix jours"),
    pasIci: cue("c'est pas ici"),
    part: cue("faire ta part"),
    tous: cue("tous les jours", 1),
    tien: cue("vraiment le tien"),
    grandes: cue("grandes choses"),
    hesites: cue("tu hésites encore"),
    six: cue("Dans six mois"),
    continues: cue("tu continues exactement"),
    ou: cue("tu seras où"),
    reponse: cue("la réponse ne te plaît pas"),
    changer: cue("changer quelque chose"),
    pasTout: cue("Pas tout"),
    suivi: cue("dont tu es suivi"),
  };
  const layoutAt = (fr: number): Layout =>
    fr < c.cas1 ? "haut" : fr < c.cas2 ? "droite" : fr < c.transparent ? "gauche" : "haut";

  return (
    <>
      <Split c={c} />

      {/* Premier cas */}
      <Chip texte="Perdre du gras" at={c.gras} x={100} y={640} variante="check" size={38} fin={c.moi - 8} />
      <Chip texte="Prendre du muscle" at={c.muscle} x={100} y={740} variante="check" size={38} fin={c.moi - 8} />
      <Chip texte="Préparer une compétition" at={c.compet} x={100} y={840} variante="check" size={38} fin={c.moi - 8} />
      <Phone x={260} y={640} h={600} tilt={18} enter={mot("ta diète") - 4} sortie={c.appli - 8} ecrans={[{ src: "nutrition", at: mot("ta diète") - 4 }]} />
      <Phone x={500} y={600} h={640} tilt={8} enter={mot("ton training") - 4} sortie={c.appli - 8} ecrans={[{ src: "entrainement", at: mot("ton training") - 4 }]} />
      <Phone x={740} y={640} h={600} tilt={-4} enter={mot("ta road map") - 4} sortie={c.appli - 8} ecrans={[{ src: "road-map", at: mot("ta road map") - 4 }]} />
      <Boucle at={c.appli} ajuster={c.ajuster} fin={c.seul - 8} />
      <Phone x={500} y={580} h={820} tilt={14} enter={c.seul - 4} sortie={c.cas2 - 12} ecrans={[{ src: "messages", at: c.seul - 4, zoom: [[0, 1, 50, 40], [30, 1.25, 50, 45]] }]} />

      {/* Deuxième cas */}
      <Chip texte="Pas encore les clients" at={c.clients} x={1080} y={700} variante="barre" barreAt={c.business - 6} size={38} fin={c.niche - 8} />
      <Chip texte="Pas le temps de tout gérer" at={c.temps} x={1080} y={800} variante="barre" barreAt={c.business - 2} size={38} fin={c.niche - 8} />
      <Chemin at={c.niche} etapes={[mot("Ta niche"), mot("ton offre"), mot("ton contenu"), c.remplir, c.suivre]} fin={c.appliCoach - 8} />
      <Phone x={1280} y={600} h={760} tilt={-6} enter={c.appliCoach - 4} sortie={c.transparent - 10} ecrans={[{ src: "stats-reseaux", at: c.appliCoach - 4 }]} />
      <Phone x={1620} y={580} h={800} tilt={-16} enter={mot("client suivi") - 4} sortie={c.transparent - 10} ecrans={[{ src: "clients", at: mot("client suivi") - 4 }]} />

      {/* Le filtre */}
      <Filtre c={{ at: c.pasPour, miracle: c.miracle, dix: c.dix, pasIci: c.pasIci, part: c.part, tous: c.tous, tien: c.tien, grandes: c.grandes, fin: c.hesites - 8 }} />

      {/* Dans six mois */}
      <SixMois c={{ at: c.six, continues: c.continues, ou: c.ou, reponse: c.reponse, changer: c.changer, pasTout: c.pasTout, suivi: c.suivi }} />

      <KineticText layoutAt={layoutAt} />

      <Sfx at={c.deux} son="whoosh" volume={0.3} />
      <Sfx at={c.lequel} son="impact" volume={0.35} />
      <Sfx at={c.cas1 - 6} son="swoosh" volume={0.4} />
      <Sfx at={c.gras} son="pop" volume={0.25} />
      <Sfx at={c.muscle} son="pop" volume={0.25} />
      <Sfx at={c.compet} son="pop" volume={0.25} />
      <Sfx at={c.ajuster} son="whoosh" volume={0.25} />
      <Sfx at={c.cas2 - 6} son="swoosh" volume={0.4} />
      <Sfx at={c.business - 6} son="tick" volume={0.3} />
      <Sfx at={c.niche} son="click" volume={0.3} />
      <Sfx at={c.suivre} son="click" volume={0.3} />
      <Sfx at={c.pasPour} son="impact" volume={0.35} />
      <Sfx at={c.pasIci} son="thud" volume={0.35} />
      <Sfx at={c.grandes} son="bell" volume={0.25} />
      <Sfx at={c.ou} son="thud" volume={0.35} />
      <Sfx at={c.changer} son="riser" volume={0.25} />
      <Sfx at={c.suivi} son="impact" volume={0.35} />
    </>
  );
};

type CS = Record<string, number>;

// L'écran partagé. Intro : deux moitiés. Premier cas : la gauche prend le cadre.
// Deuxième cas : la droite. Un filet rouge vertical marque la frontière.
const Split: React.FC<{ c: CS }> = ({ c }) => {
  const f = useCurrentFrame();
  if (f > c.transparent + 20) return null;
  const pIn = prog(f, c.deux - 10, c.deux + 24, EASE);
  const g1 = prog(f, c.cas1 - 10, c.cas1 + 20, EASE_IO); // la gauche gagne
  const g2 = prog(f, c.cas2 - 10, c.cas2 + 20, EASE_IO); // la droite gagne
  const out = prog(f, c.transparent - 10, c.transparent + 14, EASE_IN);
  const lequel = prog(f, c.lequel, c.lequel + 14, EASE);
  // Largeur du panneau gauche (px) : 960 en intro, 960 au cas 1 (texte à droite), 0 au cas 2.
  const top = 400;
  const introH = 600;
  const H = kf(f, [[c.cas1 - 10, introH], [c.cas1 + 20, 1080]], EASE_IO);
  const Y = kf(f, [[c.cas1 - 10, top], [c.cas1 + 20, 0]], EASE_IO);
  const leftW = 960 * (1 - g2);
  const rightW = 960 * (1 - g1) + 960 * g2;
  const rightX = 1920 - rightW;
  // Quand des éléments passent devant la photo, elle s'assombrit pour les laisser lire.
  const voile = Math.max(prog(f, c.gras - 6, c.gras + 10, EASE) * (1 - g2), prog(f, c.clients - 6, c.clients + 10, EASE)) * 0.55;
  const panneau = (src: string, x: number, w: number, label: string, num: string, actif: number, pos: string) => (
    <div style={{ position: "absolute", left: x, top: Y, width: w, height: H, overflow: "hidden", opacity: pIn * (1 - out) }}>
      <Img
        src={staticFile(`img/${src}`)}
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          height: "100%",
          width: 960,
          translate: "-50% 0",
          objectFit: "cover",
          objectPosition: pos,
          filter: `saturate(0.5) contrast(1.12) brightness(${0.62 + 0.25 * actif})`,
          scale: `${1.08 - 0.06 * pIn}`,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: C.rougeFonce, mixBlendMode: "color", opacity: 0.4 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(13,0,0,0.1) 30%, rgba(13,0,0,0.9) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: C.noir, opacity: voile }} />
      <div style={{ position: "absolute", left: 48, bottom: 40, fontFamily: MONTSERRAT, opacity: 1 - Math.max(g1, g2) * 0.999 }}>
        <div style={{ fontWeight: 900, fontSize: 90, lineHeight: 0.9, letterSpacing: "-0.06em", color: "transparent", backgroundImage: "linear-gradient(170deg, #E01E1E 0%, #B00202 45%, #3d0101 100%)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>{num}</div>
        <div style={{ fontWeight: 900, fontSize: 64, letterSpacing: "-0.04em", color: C.blanc, marginTop: 8 }}>{label}</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      {leftW > 1 ? panneau("portrait_physique.jpg", 0, leftW, "Ton physique", "01", 1 - g2, "50% 25%") : null}
      {rightW > 1 ? panneau("portrait_business.jpg", rightX, rightW, "Tu es coach", "02", 1 - g1 + g2, "50% 25%") : null}
      {/* filet rouge : la frontière */}
      <div
        style={{
          position: "absolute",
          left: (g1 > 0 && g2 === 0 ? 960 : 960 - 960 * g2 * 0) - 3,
          top: Y,
          width: 6,
          height: H * prog(f, c.deux - 6, c.deux + 30, EASE_IO),
          background: C.rouge,
          opacity: (1 - g1) * (1 - out),
        }}
      />
      {/* « lequel c'est toi ? » : losange au centre de la frontière */}
      <div
        style={{
          position: "absolute",
          left: 960 - 50,
          top: top + introH / 2 - 50,
          width: 100,
          height: 100,
          rotate: "45deg",
          background: C.rouge,
          scale: `${lequel * (1 - g1)}`,
          boxShadow: `0 0 0 14px ${rougeA(0.25)}`,
        }}
      />
    </AbsoluteFill>
  );
};

const Boucle: React.FC<{ at: number; ajuster: number; fin: number }> = ({ at, ajuster, fin }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 20, EASE);
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (p <= 0 || o >= 1) return null;
  const R = 210;
  const cx = 480;
  const cy = 600;
  const rot = prog(f, ajuster, ajuster + 90, EASE_IO) * 360;
  const noeuds = ["S1", "S2", "S3", "S4"];
  const pA = prog(f, ajuster - 4, ajuster + 14, EASE);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p * (1 - o) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={cx} cy={cy} r={R} fill="rgba(13,0,0,0.6)" stroke={blancA(0.15)} strokeWidth={4} />
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke={C.rouge}
          strokeWidth={8}
          strokeDasharray={`${2 * Math.PI * R * 0.18} ${2 * Math.PI * R}`}
          transform={`rotate(${-90 + rot} ${cx} ${cy})`}
          strokeLinecap="round"
          opacity={pA}
        />
      </svg>
      {noeuds.map((n, i) => {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
        const actif = Math.abs(((rot / 360) * 4) % 4 - i) < 0.5 ? 1 : 0;
        return (
          <div className="verre"
            key={n}
            style={{
              position: "absolute",
              left: cx + Math.cos(a) * R - 50,
              top: cy + Math.sin(a) * R - 50,
              width: 100,
              height: 100,
              borderRadius: 50,
              background: actif && pA > 0.5 ? C.rouge : "rgba(39,1,1,0.98)",
              border: `3px solid ${rougeA(0.6)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: MONTSERRAT,
              fontWeight: 900,
              fontSize: 32,
              color: C.blanc,
            }}
          >
            {n}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: cx - 160, top: cy - 50, width: 320, textAlign: "center", fontFamily: MONTSERRAT }}>
        <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color: blancA(0.6) }}>CHAQUE SEMAINE</div>
        <div style={{ fontWeight: 900, fontSize: 44, letterSpacing: "-0.03em", color: C.blanc, opacity: pA }}>On ajuste</div>
      </div>
    </div>
  );
};

const Chemin: React.FC<{ at: number; etapes: number[]; fin: number }> = ({ at, etapes, fin }) => {
  const f = useCurrentFrame();
  const o = prog(f, fin, fin + 12, EASE_IN);
  if (f < at - 6 || o >= 1) return null;
  const noms = ["Ta niche", "Ton offre", "Ton contenu", "Ton agenda rempli", "Tes clients suivis"];
  const x0 = 1100;
  const y0 = 170;
  const dy = 170;
  const pl = kf(f, etapes.map((e, i) => [e, i / (noms.length - 1)] as [number, number]), EASE_IO);
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      <div style={{ position: "absolute", left: x0 + 38, top: y0 + 40, width: 6, height: dy * (noms.length - 1), background: blancA(0.12) }} />
      <div style={{ position: "absolute", left: x0 + 38, top: y0 + 40, width: 6, height: dy * (noms.length - 1) * pl, background: C.rouge }} />
      {noms.map((n, i) => {
        const p = prog(f, etapes[i] - 4, etapes[i] + 12, EASE);
        return (
          <div key={n} style={{ position: "absolute", left: x0, top: y0 + i * dy, display: "flex", alignItems: "center", gap: 34, opacity: 0.35 + 0.65 * p }}>
            <div className="verre"
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                background: p > 0.5 ? C.rouge : "rgba(39,1,1,0.98)",
                border: `3px solid ${rougeA(0.6)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONTSERRAT,
                fontWeight: 900,
                fontSize: 32,
                color: C.blanc,
                scale: `${1 + 0.15 * Math.sin(p * Math.PI)}`,
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 58, letterSpacing: "-0.04em", color: C.blanc, translate: `${(1 - p) * 30}px 0` }}>{n}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Filtre: React.FC<{ c: CS }> = ({ c }) => {
  const f = useCurrentFrame();
  const o = prog(f, c.fin, c.fin + 12, EASE_IN);
  if (f < c.at - 6 || o >= 1) return null;
  const pA = prog(f, c.at, c.at + 16, EASE);
  const pB = prog(f, c.part - 6, c.part + 12, EASE);
  return (
    <AbsoluteFill style={{ opacity: 1 - o }}>
      <div style={{ position: "absolute", left: 190, top: 420, width: 740, fontFamily: MONTSERRAT, opacity: pA }}>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: blancA(0.5) }}>PAS ICI</div>
      </div>
      <Chip texte="Une méthode miracle" at={c.miracle} x={190} y={480} variante="barre" barreAt={c.pasIci} size={44} />
      <Chip texte="Des résultats en dix jours" at={c.dix} x={190} y={600} variante="barre" barreAt={c.pasIci + 5} size={44} />
      <Chip texte="Sans effort" at={c.dix + 30} x={190} y={720} variante="barre" barreAt={c.pasIci + 10} size={44} />
      <div style={{ position: "absolute", left: 1000, top: 420, fontFamily: MONTSERRAT, opacity: pB }}>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.24em", color: C.rouge }}>ICI</div>
      </div>
      <div style={{ position: "absolute", left: 958, top: 410, width: 3, height: 440, background: blancA(0.12), transformOrigin: "top", scale: `1 ${pB}` }} />
      <Chip texte="Tu fais ta part" at={c.part + 20} x={1000} y={480} variante="check" size={44} />
      <Chip texte="Tous les jours" at={c.tous} x={1000} y={600} variante="check" size={44} />
      <Chip texte="Un plan vraiment le tien" at={c.tien} x={1000} y={720} variante="check" size={44} />
      <Chip texte="De grandes choses ensemble" at={c.grandes + 10} x={1000} y={860} variante="plein" size={44} />
    </AbsoluteFill>
  );
};

const SixMois: React.FC<{ c: CS }> = ({ c }) => {
  const f = useCurrentFrame();
  if (f < c.at - 6) return null;
  const X = 260;
  const Y = 950;
  const W = 1400;
  const pAx = prog(f, c.at - 4, c.at + 30, EASE_IO);
  const pFlat = prog(f, c.continues, c.continues + 60, EASE_IO);
  const pQ = prog(f, c.ou, c.ou + 14, EASE);
  const dim = prog(f, c.reponse, c.reponse + 20, EASE);
  const pUp = prog(f, c.changer, c.changer + 60, EASE_IO);
  const pLab = prog(f, c.suivi, c.suivi + 14, EASE);
  const mois = ["Aujourd'hui", "", "", "3 mois", "", "", "Dans 6 mois"];
  const y0 = Y - 170;
  const up = (t: number) => y0 - Math.pow(t, 1.6) * 300;
  const N = 40;
  const pts = Array.from({ length: Math.max(2, Math.round(pUp * N)) }, (_, i) => {
    const t = i / (N - 1);
    return [X + t * W, up(t)];
  });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: X, top: Y, width: W * pAx, height: 4, background: blancA(0.3) }} />
      {mois.map((m, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: X + (i / 6) * W,
            top: Y + 24,
            translate: i === 0 ? "0 0" : i === 6 ? "-100% 0" : "-50% 0",
            fontFamily: MONTSERRAT,
            fontWeight: 800,
            fontSize: i === 0 || i === 6 ? 28 : 22,
            letterSpacing: "0.08em",
            color: i === 6 ? C.rouge : blancA(0.5),
            opacity: prog(f, c.at + i * 4, c.at + 12 + i * 4, EASE),
          }}
        >
          <div style={{ position: "absolute", left: i === 0 ? 0 : i === 6 ? "100%" : "50%", top: -34, width: 3, height: 16, background: blancA(0.4) }} />
          {m}
        </div>
      ))}
      {/* comme maintenant : plat */}
      <div style={{ position: "absolute", left: X, top: y0 - 3, width: W * pFlat, height: 6, borderRadius: 3, background: blancA(0.8 - 0.55 * dim) }} />
      <div style={{ position: "absolute", left: X, top: y0 - 50, fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: blancA(0.6 - 0.4 * dim), opacity: pFlat }}>
        COMME MAINTENANT
      </div>
      <div
        style={{
          position: "absolute",
          left: X + W + 30,
          top: y0 - 90,
          fontFamily: MONTSERRAT,
          fontWeight: 900,
          fontSize: 160,
          lineHeight: 1,
          color: C.rouge,
          opacity: pQ * (1 - pLab),
          scale: `${0.6 + 0.4 * pQ}`,
        }}
      >
        ?
      </div>
      {/* la bifurcation : changer la façon d'être suivi */}
      {pUp > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={pts.map((q, i) => `${i ? "L" : "M"}${q[0]},${q[1]}`).join(" ")} fill="none" stroke={C.rouge} strokeWidth={9} strokeLinecap="round" />
          <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={16} fill={C.blanc} />
        </svg>
      ) : null}
      <div style={{ position: "absolute", left: X + W * 0.62, top: up(0.85) - 20, opacity: prog(f, c.pasTout, c.pasTout + 12, EASE), fontFamily: MONTSERRAT }}>
        <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: blancA(0.7) }}>MÊME TOI, MÊME VIE</div>
      </div>
      <div style={{ position: "absolute", left: X + W - 40, top: up(1) - 30, translate: "-100% -100%", opacity: pLab }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 30px", borderRadius: 18, background: C.rouge, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 40, color: C.blanc }}>
          <Coche size={44} p={pLab} color={C.rougeFonce} />
          Un vrai suivi
        </div>
      </div>
      <SurTitre texte="Dans six mois" at={c.at} x={X} y={Y - 380} fin={c.continues} color={blancA(0.5)} size={22} />
    </AbsoluteFill>
  );
};

export const Scene5: React.FC<SceneProps> = ({ scene }) => (
  <Shell scene={scene ?? sceneParDefaut(5)} fond={{ x: 50, y: 20 }}>
    <Contenu />
  </Shell>
);

