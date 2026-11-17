// Les 5 scènes de la VSL v2 (niche : 18-25 ans, perdre du gras sans culpabiliser).
// Chaque visuel est accroché à un mot du script (c.mot), jamais à une seconde fixe.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SceneProps, sceneParDefaut } from "../lib/props";
import { MONTSERRAT } from "../lib/brand";
import { Accent, ACCENT_CLAIR, BLANC, Bulle, clamp, Eclairs, Fond, Photo, Puce, T, Trainee, useRessort, Verre } from "./kit";
import { Bouton, Cycle, Ecran, GraphePesees, Minuteur, Repas } from "./elements";
import { Plan2, ZONES, dans } from "./Plan2";

const useFrame = () => useCurrentFrame();

// Fond qui révèle une photo en noir et blanc derrière le texte pendant une plage.
const FondPhoto: React.FC<{ photo?: string; de?: number; a?: number; intensite?: number }> = ({ photo, de = 0, a = 0, intensite = 1 }) => {
  const f = useFrame();
  const o = photo ? interpolate(f, [de, de + 14, a - 10, a + 4], [0, 0.9, 0.9, 0], clamp) : 0;
  return <Fond photo={photo} photoOpacite={o} intensite={intensite} />;
};

// ─────────────────────────── Scène 1 : ouverture ───────────────────────────
export const S1: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan2
    scene={scene ?? sceneParDefaut(num)}
    fond={(c) => <FondPhoto photo="img/hero_current.jpg" de={c.mot("Tu fais")} a={c.mot("Et pourtant")} intensite={1} />}
    visuels={(c, f) => {
      const resto = c.mot("resto");
      const we = c.mot("week-end");
      const gache = c.mot("tout gâché");
      const age = c.mot("Si tu as");
      const pourToi = c.mot("cette vidéo");
      return (
        <>
          <Eclairs debut={0} duree={20} />
          <Bulle debut={resto - 2} fin={gache + 18} x={1180} y={300} texte="Resto ce soir ?" teinte="sombre" />
          <Bulle debut={we - 2} fin={gache + 18} x={1840} y={470} cote="droite" texte="Week-end en famille" teinte="sombre" />
          <Bulle debut={gache} fin={gache + 18} x={1180} y={650} texte="J'ai tout gâché..." />
          <Verre debut={age - 4} fin={pourToi - 6} x={1130} y={250} w={660} h={560} rot={[30, -34, -6]}>
            <div style={{ position: "absolute", left: 50, top: 50 }}>
              <T taille={44} poids={700} couleur="rgba(245,237,237,0.7)">
                Pour toi si tu as
              </T>
              <T taille={210} poids={900} style={{ marginTop: 10, letterSpacing: "-0.05em" }}>
                18<span style={{ color: ACCENT_CLAIR }}>-</span>25
              </T>
              <T taille={64} poids={800} style={{ marginTop: -6 }}>
                ans
              </T>
            </div>
            <div style={{ position: "absolute", left: 50, bottom: 50, display: "flex", gap: 18 }}>
              <Puce debut={c.mot("débutes")} texte="Tu débutes" actif taille={40} />
              <Puce debut={c.mot("stagnes")} texte="Tu stagnes" actif taille={40} />
            </div>
          </Verre>
          <Trainee debut={c.mot("Reste")} y={520} />
        </>
      );
    }}
    zone={(c, d) => (dans(d, [c.mot("au premier") - 6, c.mot("Et tu culpabilises") - 6], [c.mot("Si tu as") - 6, c.mot("cette vidéo") - 6]) ? ZONES.gauche : d >= c.mot("parce que") - 6 ? ZONES.centre : ZONES.plein)}
    sons={(c) => [
      { at: 0, src: "sfx/riser.mp3", volume: 0.3 },
      { at: c.mot("resto") - 2, src: "sfx/pop.mp3" },
      { at: c.mot("week-end") - 2, src: "sfx/pop.mp3" },
      { at: c.mot("tout gâché"), src: "sfx/impact.mp3", volume: 0.3 },
      { at: c.mot("Si tu as") - 4, src: "sfx/whoosh.mp3", volume: 0.3 },
      { at: c.mot("Reste"), src: "sfx/swoosh.mp3", volume: 0.25 },
    ]}
  />
);

// ─────────────────────────── Scène 2 : qui je suis ───────────────────────────
const Semaine: React.FC<{ debut: number }> = ({ debut }) => {
  const f = useFrame();
  const jours = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {jours.map((j, i) => {
        const on = f >= debut + i * 3;
        return (
          <div
            key={i}
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: MONTSERRAT,
              fontWeight: 900,
              fontSize: 28,
              color: BLANC,
              background: on ? "linear-gradient(135deg,#FF5A47,#E01E1E)" : "rgba(255,255,255,0.06)",
              boxShadow: on ? "0 10px 30px -8px rgba(224,30,30,0.7)" : undefined,
              transform: `scale(${on ? 1 : 0.85})`,
            }}
          >
            {j}
          </div>
        );
      })}
    </div>
  );
};

export const S2: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan2
    scene={scene ?? sceneParDefaut(num)}
    fond={(c) => <FondPhoto photo="img/training_pulldown.jpg" de={c.mot("Tout ce que")} a={c.total} intensite={0.8} />}
    visuels={(c, f) => {
      const tout = c.mot("Tout ce que");
      const diete = c.mot("Ma diète");
      return (
        <>
          <Verre debut={2} fin={tout - 6} x={1180} y={130} w={560} h={820} rot={[20, -36, 8]} derive={5}>
            <Photo src="img/gym_pose.jpg" couleur style={{ filter: "contrast(1.1) saturate(0.85) brightness(0.92)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(11,3,3,0.92) 100%)" }} />
            <div style={{ position: "absolute", left: 36, bottom: 40 }}>
              <T taille={44} poids={900}>
                Emmanuel Santamaria
              </T>
              <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Puce debut={c.mot("WNBF")} texte="WNBF Classic 2027" actif taille={28} />
                <Puce debut={c.mot("fédération")} texte="Naturel testé" taille={28} />
              </div>
            </div>
          </Verre>
          <Verre debut={diete - 4} x={1110} y={300} w={700} h={480} rot={[24, -30, -6]}>
            <div style={{ position: "absolute", left: 48, top: 44, display: "flex", flexDirection: "column", gap: 18 }}>
              <Puce debut={diete} texte="Ma diète" actif taille={40} />
              <Puce debut={c.mot("mon training")} texte="Mon training" actif taille={40} />
              <Puce debut={c.mot("mon sommeil")} texte="Mon sommeil" actif taille={40} />
            </div>
            <div style={{ position: "absolute", left: 48, bottom: 44 }}>
              <Semaine debut={c.mot("Tous les jours")} />
            </div>
          </Verre>
        </>
      );
    }}
    zone={() => ZONES.gauche}
    sons={(c) => [
      { at: 2, src: "sfx/whoosh.mp3", volume: 0.3 },
      { at: c.mot("Ma diète") - 4, src: "sfx/whoosh.mp3", volume: 0.25 },
      { at: c.mot("Ma diète"), src: "sfx/tick.mp3" },
      { at: c.mot("mon training"), src: "sfx/tick.mp3" },
      { at: c.mot("mon sommeil"), src: "sfx/tick.mp3" },
      { at: c.mot("Tous les jours"), src: "sfx/pop.mp3" },
    ]}
  />
);

// ─────────────────────────── Scène 3 : les trois pièges ───────────────────────────
const MOTS_INFOS = ["Jeûne", "Cardio à jeun", "Keto", "Brûle-graisse", "Détox", "Zéro sucre", "Macros", "Abdos tous les jours", "Sans glucides", "Coupe-faim"];
const Nuage: React.FC<{ debut: number; fin: number }> = ({ debut, fin }) => {
  const f = useFrame();
  if (f < debut - 2 || f > fin + 14) return null;
  const s = interpolate(f, [fin, fin + 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ perspective: 1400, opacity: 1 - s, filter: s ? `blur(${s * 16}px)` : undefined }}>
      {MOTS_INFOS.map((m, i) => {
        const p = interpolate(f, [debut + i * 2, debut + i * 2 + 14], [0, 1], clamp);
        const x = 120 + ((i * 397) % 1600);
        const y = 120 + ((i * 263) % 820);
        const z = -400 + ((i * 173) % 600);
        return (
          <div
            key={m}
            style={{
              position: "absolute",
              left: x,
              top: y + Math.sin((f + i * 20) / 30) * 14,
              transform: `translateZ(${z + (1 - p) * -600}px) rotateY(${(i % 2 ? -1 : 1) * 18}deg)`,
              opacity: p * 0.55,
              padding: "14px 28px",
              borderRadius: 30,
              background: "rgba(40,14,14,0.85)",
              border: "1.5px solid rgba(255,140,130,0.2)",
              color: "rgba(245,237,237,0.8)",
              fontFamily: MONTSERRAT,
              fontWeight: 700,
              fontSize: 34,
              whiteSpace: "nowrap",
            }}
          >
            {m}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const NumeroPiege: React.FC<{ debut: number; fin: number; n: string }> = ({ debut, fin, n }) => {
  const f = useFrame();
  const p = useRessort(debut, { damping: 12 });
  if (f < debut - 1 || f > fin + 12) return null;
  const s = interpolate(f, [fin, fin + 10], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        top: 70,
        fontFamily: MONTSERRAT,
        fontWeight: 900,
        fontSize: 120,
        letterSpacing: "-0.05em",
        color: "transparent",
        WebkitTextStroke: `3px ${ACCENT_CLAIR}`,
        opacity: p * (1 - s),
        transform: `translateX(${(1 - p) * -80}px)`,
      }}
    >
      {n}
    </div>
  );
};

const PlanDunAutre: React.FC<{ debut: number; fin: number; lache: number }> = ({ debut, fin, lache }) => {
  const f = useFrame();
  const tampon = useRessort(lache, { damping: 10, stiffness: 220 });
  const lignes = ["Le programme d'un autre", "La diète d'un autre", "Les horaires d'un autre"];
  return (
    <Verre debut={debut} fin={fin} x={1060} y={240} w={740} h={560} rot={[22, -32, 6]}>
      <div style={{ position: "absolute", left: 44, top: 40 }}>
        <T taille={38} poids={700} couleur="rgba(245,237,237,0.65)">
          PLAN TÉLÉCHARGÉ
        </T>
      </div>
      <div style={{ position: "absolute", left: 44, top: 120, display: "flex", flexDirection: "column", gap: 22 }}>
        {lignes.map((l, i) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 18, opacity: interpolate(f, [debut + 8 + i * 6, debut + 18 + i * 6], [0, 1], clamp) }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "rgba(245,237,237,0.4)" }} />
            <T taille={50} poids={800}>
              {l}
            </T>
          </div>
        ))}
      </div>
      {f >= lache ? (
        <div
          style={{
            position: "absolute",
            right: 40,
            bottom: 50,
            padding: "14px 34px",
            border: `6px solid ${ACCENT_CLAIR}`,
            borderRadius: 18,
            color: ACCENT_CLAIR,
            fontFamily: MONTSERRAT,
            fontWeight: 900,
            fontSize: 76,
            letterSpacing: "0.04em",
            transform: `rotate(-10deg) scale(${interpolate(tampon, [0, 1], [2.2, 1])})`,
            opacity: tampon,
          }}
        >
          ABANDON
        </div>
      ) : null}
    </Verre>
  );
};

export const S3: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan2
    scene={scene ?? sceneParDefaut(num)}
    fond={() => <Fond intensite={1} />}
    visuels={(c, f) => {
      const p1 = c.mot("Premier piège");
      const p2 = c.mot("Deuxième piège");
      const p3 = c.mot("Troisième piège");
      const finale = c.mot("Le plan parfait");
      return (
        <>
          <Nuage debut={0} fin={c.mot("Le vrai sujet") - 4} />
          <NumeroPiege debut={p1 - 4} fin={p2 - 8} n="01" />
          <PlanDunAutre debut={c.mot("Un plan") - 4} fin={p2 - 8} lache={c.mot("tu lâches")} />
          <NumeroPiege debut={p2 - 4} fin={p3 - 8} n="02" />
          <GraphePesees debut={c.mot("La balance") - 4} fin={p3 - 8} pic={c.mot("Un kilo")} eau={c.mot("Ce qui compte")} />
          <Bulle debut={c.mot("de l'eau") - 2} fin={c.mot("Ce qui compte") + 4} x={1060} y={170} texte="C'est de l'eau" teinte="clair" />
          <NumeroPiege debut={p3 - 4} fin={finale - 8} n="03" />
          <Cycle
            debut={c.mot("Tu fais un écart") - 4}
            fin={finale - 8}
            etapes={[
              { at: c.mot("Tu fais un écart"), t: "Écart" },
              { at: c.mot("tu te punis"), t: "Punition" },
              { at: c.mot("tu craques"), t: "Craquage" },
            ]}
          />
        </>
      );
    }}
    zone={(c, d) => {
      if (d < c.mot("Premier piège") - 6) return ZONES.centre;
      if (d >= c.mot("Le plan parfait") - 6) return ZONES.centre;
      if (dans(d, [c.mot("Premier piège") - 6, c.mot("Un plan") - 6], [c.mot("Deuxième piège") - 6, c.mot("La balance") - 6], [c.mot("Troisième piège") - 6, c.mot("Tu fais un écart") - 6]))
        return ZONES.gauche;
      return ZONES.gauche;
    }}
    sons={(c) => [
      { at: 2, src: "sfx/whoosh.mp3", volume: 0.25 },
      { at: c.mot("Premier piège") - 4, src: "sfx/thud.mp3", volume: 0.3 },
      { at: c.mot("tu lâches"), src: "sfx/impact.mp3", volume: 0.35 },
      { at: c.mot("Deuxième piège") - 4, src: "sfx/thud.mp3", volume: 0.3 },
      { at: c.mot("Un kilo"), src: "sfx/pop.mp3" },
      { at: c.mot("de l'eau") - 2, src: "sfx/pop.mp3" },
      { at: c.mot("Troisième piège") - 4, src: "sfx/thud.mp3", volume: 0.3 },
      { at: c.mot("tu te punis"), src: "sfx/tick.mp3" },
      { at: c.mot("tu craques"), src: "sfx/tick.mp3" },
      { at: c.mot("change tout"), src: "sfx/impact.mp3", volume: 0.3 },
    ]}
  />
);

// ─────────────────────────── Scène 4 : le système ───────────────────────────
const Logo: React.FC<{ debut: number; fin: number }> = ({ debut, fin }) => {
  const f = useFrame();
  const p = useRessort(debut, { damping: 14, mass: 0.8 });
  if (f < debut - 1 || f > fin + 14) return null;
  const s = interpolate(f, [fin, fin + 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: interpolate(p, [0, 0.3], [0, 1], clamp) * (1 - s), filter: s ? `blur(${s * 20}px)` : undefined }}>
      <Img
        src={staticFile("img/logo.png")}
        style={{ width: 560, transform: `scale(${interpolate(p, [0, 1], [1.6, 1]) * (1 + (f - debut) * 0.0012)}) rotateX(${interpolate(p, [0, 1], [40, 0])}deg)`, filter: "drop-shadow(0 0 60px rgba(224,30,30,0.6))" }}
      />
    </AbsoluteFill>
  );
};

const Coach: React.FC<{ debut: number }> = ({ debut }) => (
  <>
    <Bulle debut={debut} x={1180} y={420} texte="Grosse semaine, je fais comment ?" teinte="sombre" taille={38} />
    <Bulle debut={debut + 22} x={1780} y={560} texte="On ajuste ta semaine ensemble." taille={38} cote="droite" />
  </>
);

export const S4: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan2
    scene={scene ?? sceneParDefaut(num)}
    fond={() => <Fond intensite={1.15} />}
    visuels={(c, f) => {
      const appli = c.mot("Une appli");
      const bilan = c.mot("Chaque matin");
      const saute = c.mot("Tu sautes");
      const coince = c.mot("Et quand");
      return (
        <>
          <Eclairs debut={0} duree={18} />
          <Logo debut={c.mot("EP Coaching") - 6} fin={appli - 8} />
          <Ecran
            debut={appli - 4}
            fin={saute - 8}
            x={1240}
            y={120}
            largeur={440}
            ecrans={[
              { at: appli - 4, src: "img/app/aujourdhui.jpg" },
              { at: c.mot("Ton programme"), src: "img/app/entrainement.jpg" },
              { at: c.mot("ta nutrition"), src: "img/app/nutrition.jpg" },
              { at: bilan, src: "img/app/bilan.jpg" },
            ]}
          />
          <div style={{ position: "absolute", left: 830, top: 770, display: "flex", gap: 14 }}>
            {dans(f, [c.mot("Ton emploi") - 2, bilan - 6]) ? (
              <>
                <Puce debut={c.mot("Ton emploi")} texte="Ton emploi du temps" actif taille={30} />
              </>
            ) : null}
          </div>
          {dans(f, [c.mot("Ton emploi") - 2, bilan - 6]) ? (
            <div style={{ position: "absolute", left: 830, top: 860, display: "flex", gap: 14 }}>
              <Puce debut={c.mot("ta salle")} texte="Ta salle" actif taille={30} />
              <Puce debut={c.mot("ce que tu aimes")} texte="Ce que tu aimes manger" actif taille={30} />
            </div>
          ) : null}
          <Minuteur debut={c.mot("ton bilan")} fin={saute - 8} x={930} y={560} />
          <Repas debut={saute - 4} fin={coince - 8} saute={c.mot("un repas")} adapte={c.mot("Le suivant")} />
          {f >= coince - 4 ? <Coach debut={coince} /> : null}
        </>
      );
    }}
    zone={(c, d) => {
      if (d < c.mot("Une appli") - 6) return null; // le logo occupe l'écran
      if (dans(d, [c.mot("Tu sautes") - 6, c.mot("Et quand") - 6])) return ZONES.haut;
      return { x: 140, y: 150, w: 980, h: 560 };
    }}
    dessus={(c, f) => (f < c.mot("Une appli") - 8 && f >= c.mot("EP Coaching") + 8 ? (
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center" }}>
        <T taille={46} poids={800} couleur="rgba(245,237,237,0.85)">
          Une appli, <Accent>un vrai coach</Accent>
        </T>
      </div>
    ) : null)}
    sons={(c) => [
      { at: 0, src: "sfx/riser.mp3", volume: 0.25 },
      { at: c.mot("EP Coaching") - 6, src: "sfx/impact.mp3", volume: 0.35 },
      { at: c.mot("Une appli") - 4, src: "sfx/whoosh.mp3", volume: 0.3 },
      { at: c.mot("ta nutrition"), src: "sfx/swoosh.mp3", volume: 0.2 },
      { at: c.mot("ton bilan"), src: "sfx/tick.mp3" },
      { at: c.mot("Tu sautes") - 4, src: "sfx/whoosh.mp3", volume: 0.25 },
      { at: c.mot("Le suivant"), src: "sfx/pop.mp3" },
      { at: c.mot("Et quand"), src: "sfx/pop.mp3" },
      { at: c.mot("Et quand") + 22, src: "sfx/pop.mp3" },
    ]}
  />
);

// ─────────────────────────── Scène 5 : à toi de jouer ───────────────────────────
export const S5: React.FC<SceneProps> = ({ num, scene }) => (
  <Plan2
    scene={scene ?? sceneParDefaut(num)}
    fond={() => <Fond intensite={1.2} />}
    visuels={(c, f) => {
      const compte = c.mot("tu peux créer");
      const audit = c.mot("Et si tu veux");
      const fin = c.mot("Pas de culpabilité");
      return (
        <>
          <Bouton debut={compte - 2} fin={fin - 8} x={1050} y={300} w={760} texte="Créer mon compte gratuit" sous="sans carte bancaire" />
          <Bouton debut={audit + 4} fin={fin - 8} x={1050} y={560} w={760} texte="Réserver mon audit" sous="stratégique, offert" principal={false} />
          {f >= fin - 6 ? (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 70 }}>
              <Img src={staticFile("img/logo.png")} style={{ width: 180, opacity: interpolate(f, [fin, fin + 20], [0, 1], clamp) }} />
            </AbsoluteFill>
          ) : null}
        </>
      );
    }}
    zone={(c, d) => (d >= c.mot("Pas de culpabilité") - 6 ? { x: 150, y: 120, w: 1620, h: 640, align: "centre" } : d >= c.mot("tu peux créer") - 6 ? ZONES.gauche : ZONES.centre)}
    sons={(c) => [
      { at: c.mot("tu peux créer") - 2, src: "sfx/whoosh.mp3", volume: 0.3 },
      { at: c.mot("Et si tu veux") + 4, src: "sfx/whoosh.mp3", volume: 0.3 },
      { at: c.mot("offert"), src: "sfx/bell.mp3", volume: 0.25 },
      { at: c.mot("Pas de culpabilité"), src: "sfx/impact.mp3", volume: 0.25 },
    ]}
  />
);
