import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { E, p, sp } from "./anim";
import { Ctx } from "./Beats";
import { Camera } from "./modules";
import { Carte, Coche, Curseur, styleSortie, Txt } from "./Kit";
import { Titre } from "./Titre";
import { FONT, NUIT, Rect, ROUGE, ROUGE_PROFOND, TH } from "./tokens";

// Étapes de titre successives dans une même zone (jamais deux titres en même temps).
export type Etape = { at: number; titre: string; ecran?: string; notif?: string; surtitre?: string; reperes?: Rect[] };
const etapeCourante = <T extends { at: number }>(f: number, etapes: T[]) => {
  let i = 0;
  etapes.forEach((e, k) => {
    if (f >= e.at) i = k;
  });
  return i;
};

export const TitresEnEtapes: React.FC<{ c: Ctx; etapes: { at: number; titre: string; surtitre?: string }[]; zone: Rect; max?: number; align?: "left" | "center" }> = ({
  c,
  etapes,
  zone,
  max = 130,
  align = "left",
}) => {
  const i = etapeCourante(c.f, etapes);
  const e = etapes[i];
  const fin = i < etapes.length - 1 ? etapes[i + 1].at : c.d;
  const so = i < etapes.length - 1 ? p(c.f, fin - 8, fin, E.in) : c.sortie;
  return <Titre key={i} texte={e.titre} zone={zone} theme={c.theme} f={c.f - e.at} debut={2} sortie={so} max={max} align={align} surtitre={e.surtitre} nom={`titre-${i}`} />;
};

// ── Téléphone 3D avec les vraies captures de l'appli.
const PW = 440;
const PH = Math.round(PW * (1328 / 780)) + 28;
export const Telephone3D: React.FC<{
  f: number;
  at?: number;
  ecrans: { at: number; src: string }[];
  x: number;
  y: number;
  echelle?: number;
  ry?: number;
  rx?: number;
  notif?: { at: number; texte: string } | null;
  retourne?: { at: number; src: string } | null;
  reperes?: { at: number; fin: number; r: Rect }[];
  sortie?: number;
  nom?: string;
  vivant?: number; // pulsation d'écran (0..1)
}> = ({ f, at = 0, ecrans, x, y, echelle = 1, ry = -16, rx = 5, notif, retourne, reperes = [], sortie = 0, nom = "telephone", vivant = 0 }) => {
  const t = sp(f, at, "souple");
  const flou = (1 - t) * 12;
  const flot = Math.sin(f / 36) * 10;
  const i = etapeCourante(f, ecrans);
  const cur = ecrans[i];
  const prev = i > 0 ? ecrans[i - 1] : null;
  const tr = prev ? p(f, cur.at, cur.at + 14, E.out) : 1;
  const flip = retourne ? p(f, retourne.at, retourne.at + 26, E.inOut) : 0;
  const rot = ry + Math.sin(f / 70) * 4 + flip * 180;
  const so = styleSortie(sortie, "fond");
  const sw = PW - 28;
  const sh = PH - 28;
  const ecran = (src: string, dy: number, o = 1) => (
    <Img src={staticFile(`img/app/${src}`)} style={{ position: "absolute", left: 0, top: dy, width: sw, height: sh, objectFit: "cover", objectPosition: "50% 0%", opacity: o, filter: "brightness(1.18) contrast(1.05)" }} />
  );
  const nt = notif ? sp(f, notif.at, "vif") : 0;
  const ntOut = notif ? p(f, notif.at + 70, notif.at + 82, E.in) : 0;
  return (
    <div data-zone={nom} style={{ position: "absolute", left: x, top: y, width: PW * echelle, height: PH * echelle, perspective: 2000, ...so }}>
      <div
        data-bloc
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: PW,
          height: PH,
          transformOrigin: "50% 50%",
          scale: `${echelle}`,
          transformStyle: "preserve-3d",
          transform: `translate3d(0, ${(1 - t) * 260 + flot}px, ${(1 - t) * -800}px) rotateY(${rot}deg) rotateX(${rx + (1 - t) * 20}deg)`,
          opacity: Math.min(1, t * 2),
          filter: flou > 0.3 ? `blur(${flou}px)` : undefined,
        }}
      >
        {/* face avant */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 64,
            background: "linear-gradient(145deg, #3a1210 0%, #120404 40%, #2a0b09 100%)",
            boxShadow: "0 60px 120px -30px rgba(0,0,0,0.85), 0 0 0 2px rgba(255,120,100,0.25), inset 0 0 0 3px rgba(255,255,255,0.06), 0 0 90px -20px rgba(255,50,40,0.35)",
            backfaceVisibility: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 14, top: 14, width: sw, height: sh, borderRadius: 52, overflow: "hidden", background: "#0B0303" }}>
            {prev ? ecran(prev.src, -tr * sh * 0.35, 1 - tr) : null}
            {ecran(cur.src, (1 - tr) * sh * 0.6)}
            {vivant > 0 ? (
              <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 ${60 + Math.sin(f / 5) * 30}px rgba(255,60,48,${0.35 * vivant})` }} />
            ) : null}
            {reperes.map((r, k) => {
              const o = p(f, r.at, r.at + 8) * (1 - p(f, r.fin - 6, r.fin));
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: r.r.x * sw,
                    top: r.r.y * sh,
                    width: r.r.w * sw,
                    height: r.r.h * sh,
                    borderRadius: 18,
                    border: `3px solid ${TH.sombre.accent}`,
                    boxShadow: "0 0 24px rgba(255,60,48,0.7), inset 0 0 20px rgba(255,60,48,0.25)",
                    opacity: o,
                    scale: `${1.08 - 0.08 * sp(f, r.at, "vif")}`,
                  }}
                />
              );
            })}
            {notif ? (
              <div
                style={{
                  position: "absolute",
                  left: 16,
                  right: 16,
                  top: 18,
                  padding: "16px 18px",
                  borderRadius: 22,
                  background: "rgba(40, 12, 10, 0.92)",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,120,100,0.3)",
                  translate: `0 ${(1 - nt) * -140 - ntOut * 140}px`,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: ROUGE, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Txt taille={18} graisse={900} couleur="#fff">
                    EP
                  </Txt>
                </div>
                <Txt taille={19} graisse={700} couleur="#FBF3F1" style={{ whiteSpace: "normal" }}>
                  {notif.texte}
                </Txt>
              </div>
            ) : null}
            {/* reflet */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)",
                pointerEvents: "none",
              }}
            />
          </div>
          <div style={{ position: "absolute", left: PW / 2 - 60, top: 26, width: 120, height: 32, borderRadius: 20, background: "#000" }} />
        </div>
        {/* face arrière (retournement) */}
        {retourne ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 64,
              background: "linear-gradient(145deg, #3a1210 0%, #120404 40%, #2a0b09 100%)",
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              boxShadow: "0 0 0 2px rgba(255,120,100,0.25), 0 0 90px -20px rgba(255,50,40,0.35)",
            }}
          >
            <div style={{ position: "absolute", left: 14, top: 14, width: sw, height: sh, borderRadius: 52, overflow: "hidden" }}>{ecran(retourne.src, 0)}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Téléphone à droite + titres en étapes à gauche (le module le plus utilisé de la scène 4).
export const AppEtapes: React.FC<{
  c: Ctx;
  etapes: Etape[];
  notif?: { at: number; texte: string } | null;
  retourne?: { at: number; src: string } | null;
  vivant?: number;
  cote?: "droite" | "gauche";
  max?: number;
}> = ({ c, etapes, notif, retourne, vivant, cote = "droite", max = 120 }) => {
  const ecrans = etapes.filter((e) => e.ecran).map((e) => ({ at: e.at, src: e.ecran as string }));
  const reperes = etapes.flatMap((e, k) => (e.reperes ?? []).map((r) => ({ at: e.at + 10, fin: k < etapes.length - 1 ? etapes[k + 1].at : c.d, r })));
  const echelle = 1.12;
  const x = cote === "droite" ? 1230 : 200;
  return (
    <Camera c={c} force={0.4}>
      <Telephone3D f={c.f} ecrans={ecrans} x={x} y={(1080 - PH * echelle) / 2} echelle={echelle} ry={cote === "droite" ? -16 : 16} notif={notif} retourne={retourne} reperes={reperes} sortie={c.sortie} vivant={vivant} />
      <TitresEnEtapes c={c} etapes={etapes} zone={cote === "droite" ? { x: 150, y: 170, w: 980, h: 740 } : { x: 800, y: 170, w: 970, h: 740 }} max={max} />
    </Camera>
  );
};

// ── Calques 3D éclatés : plusieurs écrans de l'appli s'écartent en profondeur (référence 2).
export const Calques: React.FC<{ c: Ctx; ecrans: string[]; texte?: string; zoneTexte?: Rect; centreX?: number }> = ({ c, ecrans, texte, zoneTexte = { x: 150, y: 200, w: 700, h: 680 }, centreX = 1320 }) => {
  const ouvre = sp(c.f, 4, "lourd");
  const tourne = Math.sin(c.f / 60) * 6;
  const so = styleSortie(c.sortie, "fond");
  const n = ecrans.length;
  const w = 330;
  const h = Math.round(w * (1328 / 780));
  return (
    <Camera c={c} force={0.4}>
      <div data-zone="calques" style={{ position: "absolute", left: centreX - 420, top: 90, width: 840, height: 900, perspective: 1800, ...so }}>
        <div
          data-bloc
          style={{
            position: "absolute",
            left: 420 - w / 2,
            top: 450 - h / 2,
            width: w,
            height: h,
            transformStyle: "preserve-3d",
            transform: `rotateX(${48 - 6 * ouvre}deg) rotateZ(${-32 + tourne}deg)`,
          }}
        >
          {ecrans.map((src, k) => {
            const t = sp(c.f, 2 + k * 3, "souple");
            const z = (k - (n - 1) / 2) * 120 * ouvre;
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 34,
                  overflow: "hidden",
                  transform: `translateZ(${z}px) translateY(${(1 - t) * 600}px)`,
                  opacity: Math.min(1, t * 2),
                  boxShadow: `0 0 0 2px rgba(255,90,80,${0.25 + 0.3 * (k === n - 1 ? 1 : 0)}), 0 40px 80px -20px rgba(0,0,0,0.9), 0 0 50px -10px rgba(255,50,40,0.35)`,
                }}
              >
                <Img src={staticFile(`img/app/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} />
              </div>
            );
          })}
        </div>
      </div>
      {texte ? <Titre texte={texte} zone={zoneTexte} theme={c.theme} f={c.f} debut={8} sortie={c.sortie} max={130} /> : null}
    </Camera>
  );
};

// ── Mosaïque d'écrans qui s'assemblent, avec une légende sous chacun (calée sur la voix).
export const Mosaique: React.FC<{ c: Ctx; items: { src: string; label: string; at: number }[] }> = ({ c, items }) => {
  const n = items.length;
  const w = 250;
  const h = Math.round(w * (1328 / 780));
  const gap = 56;
  const total = n * w + (n - 1) * gap;
  const x0 = (1920 - total) / 2;
  const so = styleSortie(c.sortie, "fond");
  return (
    <Camera c={c} force={0.4}>
      <div style={{ position: "absolute", inset: 0, perspective: 2200, ...so }}>
        {items.map((it, k) => {
          const t = sp(c.f, it.at, "souple");
          const allume = p(c.f, it.at, it.at + 10);
          const ry = (k - (n - 1) / 2) * -7;
          return (
            <div key={k} data-zone={`ecran-${k}`} style={{ position: "absolute", left: x0 + k * (w + gap), top: 150, width: w, height: h + 130 }}>
              <div
                data-bloc
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: w,
                  height: h,
                  borderRadius: 30,
                  overflow: "hidden",
                  transform: `translate3d(0, ${(1 - t) * 500}px, ${(1 - t) * -600}px) rotateY(${ry}deg) rotateX(${(1 - t) * 30}deg)`,
                  opacity: Math.min(1, t * 2),
                  boxShadow: `0 0 0 ${2 + allume}px rgba(255,90,80,${0.2 + 0.6 * allume}), 0 30px 70px -20px rgba(0,0,0,0.9), 0 0 ${50 * allume}px -6px rgba(255,50,40,${0.5 * allume})`,
                  filter: `blur(${(1 - t) * 8}px)`,
                }}
              >
                <Img src={staticFile(`img/app/${it.src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} />
              </div>
              <div
                data-texte
                style={{
                  position: "absolute",
                  left: -20,
                  right: -20,
                  top: h + 34,
                  textAlign: "center",
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 38,
                  color: TH[c.theme].encre,
                  opacity: allume,
                  translate: `0 ${(1 - allume) * 20}px`,
                  whiteSpace: "nowrap",
                }}
              >
                {it.label}
              </div>
            </div>
          );
        })}
      </div>
    </Camera>
  );
};

// ── Logo EP (le vrai PNG) qui se construit : halo, éclat, nom.
export const LogoReveal: React.FC<{ c: Ctx; sousTitre?: string }> = ({ c, sousTitre }) => {
  const t = sp(c.f, 2, "lourd");
  const eclat = p(c.f, 8, 30, E.out);
  const so = styleSortie(c.sortie, "fond");
  return (
    <Camera c={c}>
      <div style={{ position: "absolute", inset: 0, ...so }}>
        <div
          style={{
            position: "absolute",
            left: 960 - 500,
            top: 430 - 500,
            width: 1000,
            height: 1000,
            borderRadius: 1000,
            background: "radial-gradient(circle, rgba(255,60,40,0.35) 0%, rgba(255,60,40,0) 60%)",
            scale: `${0.4 + eclat}`,
            opacity: 1 - eclat * 0.4,
          }}
        />
        <div data-zone="logo" style={{ position: "absolute", left: 960 - 260, top: 430 - 206, width: 520, height: 412 }}>
          <Img
            data-bloc
            src={staticFile("img/logo.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              scale: `${0.6 + 0.4 * t}`,
              opacity: Math.min(1, t * 2),
              filter: `blur(${(1 - t) * 14}px) drop-shadow(0 0 ${30 * eclat}px rgba(255,60,48,0.6))`,
            }}
          />
        </div>
        {sousTitre ? <Titre texte={sousTitre} zone={{ x: 260, y: 730, w: 1400, h: 150 }} theme={c.theme} f={c.f} debut={16} align="center" max={86} /> : null}
      </div>
    </Camera>
  );
};

// ── Deux boutons d'appel (libellés du site), curseur qui clique, carte qui devient bouton.
export const Boutons: React.FC<{ c: Ctx; titre?: string; clic?: number; fleche?: boolean; libelles?: [string, string]; apparitions?: [number, number] }> = ({
  c,
  titre,
  clic,
  fleche,
  libelles = ["Je veux transformer mon physique", "Je suis coach"],
  apparitions = [8, 13],
}) => {
  const so = styleSortie(c.sortie, "bas");
  const BW = 1180;
  const BH = 150;
  const x = (1920 - BW) / 2;
  const ys = [titre ? 470 : 360, titre ? 670 : 560];
  const metal = (k: number) =>
    k === 0
      ? "linear-gradient(180deg, #FF5A4C 0%, #E01E1E 45%, #A80B0B 100%)"
      : c.theme === "clair"
        ? "linear-gradient(180deg, #2a0d0b 0%, #170808 100%)"
        : "linear-gradient(180deg, #4a1714 0%, #250807 100%)";
  return (
    <Camera c={c} force={0.4}>
      {titre ? <Titre texte={titre} zone={{ x: 160, y: 140, w: 1600, h: 260 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align="center" max={120} /> : null}
      {libelles.map((l, k) => {
        const t = c.f >= apparitions[k] - 1 ? sp(c.f, apparitions[k], "rebond") : 0;
        const presse = clic !== undefined && k === 0 ? 1 - 0.05 * Math.sin(Math.min(1, Math.max(0, (c.f - clic) / 7)) * Math.PI) : 1;
        const reflet = interpolate((c.f + k * 20) % 90, [0, 40, 90], [-0.3, 1.3, 1.3]);
        const valide = clic !== undefined && k === 0 ? p(c.f, clic + 4, clic + 16) : 0;
        return (
          <div key={k} data-zone={`bouton-${k}`} style={{ position: "absolute", left: x, top: ys[k], width: BW, height: BH, ...so }}>
            <div
              data-bloc
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: BH,
                background: metal(k),
                boxShadow:
                  k === 0
                    ? `0 24px 60px -18px rgba(200,20,20,0.75), inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -3px 0 rgba(0,0,0,0.25), 0 0 ${40 + valide * 40}px rgba(255,60,48,${0.25 + valide * 0.4})`
                    : "0 24px 60px -24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,180,160,0.25), 0 0 0 2px rgba(255,90,80,0.35)",
                transform: `translateY(${(1 - t) * 160}px) scale(${(0.7 + 0.3 * t) * presse})`,
                opacity: Math.min(1, t * 2),
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 64px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(105deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.28) 45%, rgba(255,255,255,0) 60%)",
                  translate: `${reflet * BW - BW / 2}px 0`,
                }}
              />
              <div style={{ position: "relative" }}>
                <Txt taille={26} graisse={700} couleur="rgba(255,240,236,0.8)" style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {k === 0 ? "Premier cas" : "Deuxième cas"}
                </Txt>
                <Txt taille={52} graisse={800} couleur="#FFFFFF" style={{ marginTop: 6 }}>
                  {l}
                </Txt>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
                {valide > 0 ? <Coche taille={64} prog={valide} fond="#fff" couleur={ROUGE} /> : (
                  <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {fleche ? (
        <div style={{ position: "absolute", left: 960 - 30, top: 880 + Math.abs(Math.sin(c.f / 8)) * 26, opacity: p(c.f, 20, 30) * (1 - c.sortie) }}>
          <svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke={TH[c.theme].accent} strokeWidth={2.6} strokeLinecap="round">
            <path d="M12 4v15M6 13l6 6 6-6" />
          </svg>
        </div>
      ) : null}
      {clic !== undefined ? (
        <Curseur f={c.f} theme={c.theme} points={[{ at: clic - 30, x: 1500, y: 900 }, { at: clic - 4, x: 1500, y: ys[0] + 90 }, { at: clic, x: 1500, y: ys[0] + 90, clic: true }, { at: clic + 40, x: 1520, y: ys[0] + 110 }]} />
      ) : null}
    </Camera>
  );
};

// ── Cadenas qui se déverrouille (référence 2), avec titre dessous.
export const Cadenas: React.FC<{ c: Ctx; texte: string; ouvre?: number }> = ({ c, texte, ouvre = 20 }) => {
  const t = sp(c.f, 0, "rebond");
  const o = sp(c.f, ouvre, "rebond");
  const halo = p(c.f, ouvre, ouvre + 20);
  const so = styleSortie(c.sortie, "fond");
  const S = 260;
  return (
    <Camera c={c}>
      <div style={{ position: "absolute", inset: 0, ...so }}>
        <div
          style={{
            position: "absolute",
            left: 960 - 400,
            top: 360 - 400,
            width: 800,
            height: 800,
            borderRadius: 800,
            background: "radial-gradient(circle, rgba(255,60,40,0.4) 0%, rgba(255,60,40,0) 62%)",
            opacity: halo,
            scale: `${0.6 + 0.6 * halo}`,
          }}
        />
        <div data-zone="cadenas" style={{ position: "absolute", left: 960 - S / 2, top: 360 - S / 2 - 40, width: S, height: S + 80, scale: `${0.4 + 0.6 * t}`, opacity: Math.min(1, t * 2) }}>
          <div
            data-bloc
            style={{
              position: "absolute",
              left: S * 0.22,
              top: -o * 40,
              width: S * 0.56,
              height: S * 0.6,
              borderRadius: `${S * 0.3}px ${S * 0.3}px 0 0`,
              border: `${S * 0.08}px solid #FFB3A8`,
              borderBottom: "none",
              transformOrigin: "85% 100%",
              rotate: `${o * -28}deg`,
              boxShadow: `0 0 ${30 * halo}px rgba(255,90,70,0.6)`,
            }}
          />
          <div
            data-bloc
            style={{
              position: "absolute",
              left: 0,
              top: S * 0.45,
              width: S,
              height: S * 0.78,
              borderRadius: S * 0.18,
              background: "linear-gradient(180deg, #FF6A5C 0%, #E01E1E 50%, #9A0A0A 100%)",
              boxShadow: `inset 0 3px 0 rgba(255,255,255,0.4), 0 30px 70px -20px rgba(200,20,20,0.8), 0 0 ${60 * halo}px rgba(255,60,48,0.7)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: S * 0.14, height: S * 0.26, borderRadius: S * 0.07, background: NUIT, opacity: 1 - halo }} />
            <div style={{ position: "absolute" }}>{halo > 0 ? <Coche taille={S * 0.36} prog={halo} fond="rgba(0,0,0,0)" couleur="#fff" /> : null}</div>
          </div>
        </div>
        <Titre texte={texte} zone={{ x: 160, y: 690, w: 1600, h: 240 }} theme={c.theme} f={c.f} debut={6} sortie={c.sortie} align="center" max={110} />
      </div>
    </Camera>
  );
};

// ── Messagerie : bulles qui arrivent (toi à droite, le coach à gauche), calées sur la voix.
export const Messagerie: React.FC<{ c: Ctx; bulles: { at: number; texte: string; moi: boolean }[]; titre?: string }> = ({ c, bulles, titre }) => {
  const x0 = titre ? 860 : 460;
  const W0 = 900;
  // empilement : chaque bulle pousse les précédentes vers le haut
  const hauteur = 136;
  return (
    <Camera c={c} force={0.4}>
      {titre ? <Titre texte={titre} zone={{ x: 150, y: 200, w: 640, h: 680 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} max={110} /> : null}
      <Carte x={x0} y={120} w={W0} h={840} f={c.f} at={0} depuis="droite" theme="sombre" ry={-8} nom="messagerie" sortie={c.sortie}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 100, borderBottom: "1px solid rgba(255,120,100,0.18)", display: "flex", alignItems: "center", gap: 18, padding: "0 32px" }}>
          <div style={{ width: 56, height: 56, borderRadius: 56, background: ROUGE, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Txt taille={22} graisse={900} couleur="#fff">
              EP
            </Txt>
          </div>
          <div>
            <Txt taille={28} graisse={800} couleur={TH.sombre.encre}>
              Appel découverte
            </Txt>
            <Txt taille={20} graisse={600} couleur={TH.sombre.doux}>
              Emmanuel Santamaria Sanchéz
            </Txt>
          </div>
        </div>
        <div style={{ position: "absolute", left: 32, right: 32, top: 120, bottom: 30, overflow: "hidden" }}>
          {bulles.map((b, k) => {
            const t = sp(c.f, b.at, "vif");
            if (c.f < b.at - 1) return null;
            const decal = bulles.slice(k + 1).reduce((a, x) => a + sp(c.f, x.at, "souple") * hauteur, 0);
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  bottom: decal,
                  [b.moi ? "right" : "left"]: 0,
                  maxWidth: 700,
                  padding: "26px 36px",
                  borderRadius: 34,
                  borderBottomRightRadius: b.moi ? 8 : 30,
                  borderBottomLeftRadius: b.moi ? 30 : 8,
                  background: b.moi ? "linear-gradient(180deg, #FF4A3D, #D7151C)" : "rgba(255,255,255,0.08)",
                  boxShadow: b.moi ? "0 0 30px -6px rgba(255,60,48,0.6)" : "inset 0 0 0 1px rgba(255,140,120,0.2)",
                  transform: `translateY(${(1 - t) * 60}px) scale(${0.85 + 0.15 * t})`,
                  transformOrigin: b.moi ? "100% 100%" : "0% 100%",
                  opacity: Math.min(1, t * 2),
                }}
              >
                <Txt taille={44} graisse={800} couleur="#fff">
                  {b.texte}
                </Txt>
              </div>
            );
          })}
        </div>
      </Carte>
    </Camera>
  );
};

// ── Carte de fin (référence Pinterest : fond rouge profond -> noir, logo, nom, réseau).
export const Fin: React.FC<{ c: Ctx }> = ({ c }) => {
  const fond = p(c.f, 0, 30, E.inOut);
  const t = sp(c.f, 6, "lourd");
  const sombre = p(c.f, c.d - 30, c.d, E.in);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 90% 90% at ${70 - fond * 20}% ${80 - fond * 20}%, ${ROUGE} 0%, ${ROUGE_PROFOND} 40%, #1a0101 85%)`,
          opacity: fond,
        }}
      />
      <div data-zone="fin-logo" style={{ position: "absolute", left: 960 - 190, top: 250, width: 380, height: 302 }}>
        <Img
          data-bloc
          src={staticFile("img/logo.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain", scale: `${0.7 + 0.3 * t}`, opacity: t, filter: `blur(${(1 - t) * 10}px) brightness(1.1)` }}
        />
      </div>
      <Titre texte={"Je te dis\nà très vite."} zone={{ x: 260, y: 590, w: 1400, h: 230 }} theme="sombre" f={c.f} debut={14} align="center" max={110} nom="fin-titre" />
      <div data-zone="fin-signature" style={{ position: "absolute", left: 960, top: 880, transform: "translateX(-50%)", opacity: p(c.f, 46, 60), whiteSpace: "nowrap" }}>
        <div data-texte style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#FFF4F1", letterSpacing: "0.01em" }}>
          Emmanuel Santamaria Sanchéz · @santamariasanchezep_
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: sombre * 0.85 }} />
    </div>
  );
};

