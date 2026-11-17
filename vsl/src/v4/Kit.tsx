import React from "react";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONTSERRAT, blancA, noirA, rougeA } from "../lib/brand";

// Kit visuel v4 : chaque visuel continue d'agir pendant tout son plan (révélations calées
// sur la voix, caméra qui avance, interface qui vit), jamais d'attente immobile.
// Zone utile : le haut de l'écran (0 à ~740 px), le bas est pour la typographie.

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const eo = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
export const ei = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: Easing.bezier(0.7, 0, 0.84, 0) });
export const ressort = (f: number, fps: number, at: number, raideur = 220) =>
  spring({ frame: f - at, fps, config: { damping: 15, stiffness: raideur, mass: 0.7 } });

const ZONE: React.CSSProperties = { position: "absolute", left: 0, right: 0, top: 40, height: 700, display: "flex", alignItems: "center", justifyContent: "center" };

/** Tracé SVG qui se dessine (longueur normalisée à 1 via pathLength). */
const Trace: React.FC<{ d: string; p: number; color?: string; w?: number; dash?: boolean }> = ({ d, p, color = C.rouge, w = 6, dash }) => (
  <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ? "0.012 0.02" : "1 1"} strokeDashoffset={dash ? 0 : 1 - p} style={dash ? { opacity: p } : undefined} />
);

const Coche: React.FC<{ p: number; size?: number; non?: boolean }> = ({ p, size = 56, non }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: non ? blancA(0.08) : C.rouge, border: non ? `3px solid ${rougeA(0.8)}` : "none", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * Math.min(1, p * 1.4)})`, boxShadow: non ? "none" : `0 0 ${30 * p}px ${rougeA(0.6)}` }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
      {non ? (
        <>
          <Trace d="M6 6 L18 18" p={Math.min(1, p * 2)} color={C.rouge} w={3.4} />
          <Trace d="M18 6 L6 18" p={Math.max(0, p * 2 - 1)} color={C.rouge} w={3.4} />
        </>
      ) : (
        <Trace d="M4.5 12.5 L10 18 L19.5 6.5" p={p} color={C.blanc} w={3.4} />
      )}
    </svg>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
/** Titre géant : lettres qui tombent en cascade, trait de pinceau qui se dessine, chiffre fantôme. */
export const Titre: React.FC<{ t0: number; texte: string; sous?: string; fantome?: string }> = ({ t0, texte, sous, fantome }) => {
  const f = useCurrentFrame();
  const d = f - t0;
  const lettres = [...texte];
  const taille = texte.length <= 4 ? 300 : texte.length <= 8 ? 220 : 150;
  const trait = eo(d, 10, 26);
  return (
    <div style={ZONE}>
      {fantome ? (
        <div style={{ position: "absolute", fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 620, letterSpacing: -40, color: "transparent", WebkitTextStroke: `3px ${rougeA(0.22)}`, transform: `translateX(${-d * 1.4}px) scale(${1.08 - eo(d, 0, 40) * 0.08})`, opacity: eo(d, 0, 10) }}>{fantome}</div>
      ) : null}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", fontFamily: MONTSERRAT, fontWeight: 900, fontSize: taille, letterSpacing: -taille * 0.04, lineHeight: 1, color: C.blanc }}>
          {lettres.map((l, i) => {
            const e = eo(d, i * 1.5, i * 1.5 + 9);
            return (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - e) * -120}px) rotate(${(1 - e) * (i % 2 ? 14 : -14)}deg) scale(${0.6 + 0.4 * e})`, opacity: e, whiteSpace: "pre", textShadow: `0 20px 60px ${noirA(0.6)}` }}>
                {l}
              </span>
            );
          })}
        </div>
        <svg width={taille * texte.length * 0.62} height={60} viewBox="0 0 600 60" preserveAspectRatio="none" style={{ marginTop: -taille * 0.08 }}>
          <Trace d="M8 40 C 120 14, 260 52, 380 26 S 560 30, 592 18" p={trait} w={14} />
        </svg>
        {sous ? (
          <div style={{ marginTop: 18, fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 46, letterSpacing: 1, color: blancA(0.85), opacity: eo(d, 14, 24), transform: `translateY(${(1 - eo(d, 14, 24)) * 30}px)` }}>{sous}</div>
        ) : null}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Pilier : grand numéro creux qui se remplit, titre, jauge des 4 piliers. */
export const Pilier: React.FC<{ t0: number; num: number; titre: string }> = ({ t0, num, titre }) => {
  const f = useCurrentFrame();
  const d = f - t0;
  const rempli = eo(d, 6, 26);
  const n = String(num).padStart(2, "0");
  return (
    <div style={ZONE}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 70, transform: `translateX(${-d * 0.8}px)` }}>
        <div style={{ position: "relative", fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 420, letterSpacing: -30, lineHeight: 0.8 }}>
          <span style={{ color: "transparent", WebkitTextStroke: `4px ${C.rouge}`, opacity: eo(d, 0, 6) }}>{n}</span>
          <span style={{ position: "absolute", left: 0, top: 0, color: C.rouge, clipPath: `inset(${(1 - rempli) * 100}% 0 0 0)`, textShadow: `0 0 80px ${rougeA(0.5)}` }}>{n}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 30, letterSpacing: 10, color: blancA(0.6), textTransform: "uppercase", opacity: eo(d, 4, 12) }}>Pilier {num} sur 4</div>
          <div style={{ display: "flex", gap: 14 }}>
            {[1, 2, 3, 4].map((k) => {
              const on = k <= num;
              const e = eo(d, 8 + k * 3, 16 + k * 3);
              return <div key={k} style={{ width: 90, height: 14, borderRadius: 7, background: on ? C.rouge : blancA(0.14), transform: `scaleX(${e})`, transformOrigin: "left", boxShadow: on && k === num ? `0 0 24px ${C.rouge}` : "none" }} />;
            })}
          </div>
          <div style={{ maxWidth: 820, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 84, lineHeight: 1.02, letterSpacing: -3, color: C.blanc }}>
            {titre.split(" ").map((w, i) => {
              const e = eo(d, 12 + i * 2.5, 22 + i * 2.5);
              return (
                <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", marginRight: 22 }}>
                  <span style={{ display: "inline-block", transform: `translateY(${(1 - e) * 110}%)` }}>{w}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Photo cinéma : cadre incliné en 3D qui se redresse, zoom lent dans l'image, balayage de
 *  lumière, crochets d'angle et étiquette. */
export const PhotoCine: React.FC<{ t0: number; src: string; tag?: string; pos?: string; cote?: "g" | "d" }> = ({ t0, src, tag, pos = "50% 35%", cote = "d" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = f - t0;
  const r = ressort(f, fps, t0, 170);
  const s = cote === "d" ? 1 : -1;
  const balayage = interpolate(d, [8, 38], [-60, 160], clamp);
  return (
    <div style={{ ...ZONE, perspective: 1800 }}>
      <div style={{ position: "relative", width: 1080, height: 640, transform: `rotateY(${s * (18 - r * 12)}deg) rotateZ(${s * (1 - r) * -3}deg) scale(${0.86 + r * 0.14})`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 34, overflow: "hidden", boxShadow: `0 60px 140px ${noirA(0.8)}, 0 0 0 2px ${rougeA(0.35)}` }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${1.18 - eo(d, 0, 150) * 0.12}) translateX(${-d * 0.25}px)` }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 55%, ${noirA(0.6)} 100%), linear-gradient(90deg, ${rougeA(0.18)}, transparent 35%)` }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 260, left: `${balayage}%`, background: `linear-gradient(100deg, transparent, ${blancA(0.22)}, transparent)`, transform: "skewX(-18deg)" }} />
        </div>
        {[0, 1, 2, 3].map((k) => {
          const e = eo(d, 6 + k * 2, 16 + k * 2);
          const top = k < 2, left = k % 2 === 0;
          return <div key={k} style={{ position: "absolute", width: 70, height: 70, [top ? "top" : "bottom"]: -22, [left ? "left" : "right"]: -22, borderTop: top ? `6px solid ${C.rouge}` : undefined, borderBottom: !top ? `6px solid ${C.rouge}` : undefined, borderLeft: left ? `6px solid ${C.rouge}` : undefined, borderRight: !left ? `6px solid ${C.rouge}` : undefined, opacity: e, transform: `scale(${1.6 - e * 0.6})` }} />;
        })}
        {tag ? (
          <div style={{ position: "absolute", left: 40, bottom: 36, padding: "16px 30px", borderRadius: 18, background: C.rouge, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 44, color: C.blanc, transform: `translateX(${(1 - eo(d, 12, 22)) * -80}px)`, opacity: eo(d, 12, 20), boxShadow: `0 20px 50px ${rougeA(0.5)}` }}>{tag}</div>
        ) : null}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Téléphone 3D : l'écran défile, l'appareil pivote, des bulles reliées par un trait
 *  sortent sur les mots de la voix. */
export const Telephone: React.FC<{ t0: number; src: string; bulles?: { texte: string; at: number }[]; titre?: string }> = ({ t0, src, bulles = [], titre }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = f - t0;
  const r = ressort(f, fps, t0, 150);
  const rot = -26 + r * 14 + eo(d, 20, 160) * 6;
  const defile = eo(d, 18, 150) * 38;
  return (
    <div style={{ ...ZONE, perspective: 2000 }}>
      {titre ? (
        <div style={{ position: "absolute", left: 160, top: 120, width: 560, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 76, lineHeight: 1.02, letterSpacing: -3, color: C.blanc }}>
          {titre.split(" ").map((w, i) => {
            const e = eo(d, 4 + i * 2.5, 14 + i * 2.5);
            return (
              <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", marginRight: 18 }}>
                <span style={{ display: "inline-block", transform: `translateY(${(1 - e) * 110}%)`, color: i === titre.split(" ").length - 1 ? C.rouge : C.blanc }}>{w}</span>
              </span>
            );
          })}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: titre ? 880 : 760, top: 10 + (1 - r) * 120, width: 340, height: 690, scale: "1.08", transform: `rotateY(${rot}deg) rotateX(${6 - r * 4}deg) rotateZ(${(1 - r) * 6}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: -40, borderRadius: 120, background: `radial-gradient(closest-side, ${rougeA(0.5)}, transparent)`, opacity: r }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 52, background: "#140202", boxShadow: `0 60px 120px ${noirA(0.85)}, inset 0 0 0 3px ${blancA(0.12)}`, padding: 12 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 42, overflow: "hidden", position: "relative", background: C.noir }}>
            <Img src={staticFile(src)} style={{ width: "100%", position: "absolute", top: 0, transform: `translateY(-${defile}%)`, filter: "brightness(1.45) contrast(1.08) saturate(1.1)" }} />
            <div style={{ position: "absolute", top: 12, left: "50%", width: 90, height: 24, marginLeft: -45, borderRadius: 14, background: "#000" }} />
          </div>
        </div>
      </div>
      {bulles.map((b, i) => {
        const e = eo(f, b.at, b.at + 10);
        if (f < b.at - 1) return null;
        const y = 150 + i * 150;
        const x = (titre ? 1300 : 1100) + (i % 2) * 60;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", opacity: e, transform: `translateX(${(1 - e) * 60}px)` }}>
            <div style={{ width: 120 * e, height: 4, background: `linear-gradient(90deg, transparent, ${C.rouge})`, marginRight: 14 }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: C.rouge, boxShadow: `0 0 20px ${C.rouge}`, marginRight: 18 }} />
            <div style={{ padding: "18px 28px", borderRadius: 20, background: blancA(0.07), border: `2px solid ${rougeA(0.5)}`, fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 40, color: C.blanc, whiteSpace: "nowrap" }}>{b.texte}</div>
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Cartes : chaque élément arrive sur son mot, distribué comme un jeu de cartes, avec
 *  coche ou croix dessinée. `barre` : ligne qui raye l'élément (ce qui ne tient pas). */
export const Cartes: React.FC<{ t0: number; items: { texte: string; at: number; barre?: number; icone?: React.ReactNode }[]; signe?: "oui" | "non" | "num"; titre?: string }> = ({ t0, items, signe = "oui", titre }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = f - t0;
  const n = items.length;
  const h = n > 3 ? 118 : 140;
  const gap = 24;
  // Nombre de cartes présentes, continu : les cartes déjà là glissent pour faire de la place.
  const k = items.reduce((acc, it) => acc + eo(f, it.at, it.at + 12), 0);
  const centre = 390;
  return (
    <div style={{ ...ZONE, perspective: 1600 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 700, transform: `rotateY(${-7 + eo(d, 0, 150) * 5}deg)` }}>
        {titre ? (
          <div style={{ position: "absolute", left: 410, top: centre - (Math.max(1, k) * (h + gap)) / 2 - 60, fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 30, letterSpacing: 8, textTransform: "uppercase", color: blancA(0.6), opacity: eo(d, 0, 8) }}>{titre}</div>
        ) : null}
        {items.map((it, i) => {
          if (f < it.at - 1) return null;
          const r = ressort(f, fps, it.at, 200);
          const barre = it.barre !== undefined ? eo(f, it.barre, it.barre + 10) : 0;
          const top = centre - (k * (h + gap) - gap) / 2 + i * (h + gap);
          return (
            <div key={i} style={{ position: "absolute", left: 410, width: 1100, top, height: h, display: "flex", alignItems: "center", gap: 34, padding: "0 44px", borderRadius: 32, background: `linear-gradient(100deg, ${rougeA(0.24)}, ${blancA(0.03)} 70%)`, border: `2px solid ${rougeA(0.55)}`, transform: `translateX(${(1 - r) * 560}px) rotateZ(${(1 - r) * 8}deg) scale(${0.92 + 0.08 * r})`, opacity: Math.min(1, r * 1.6), boxShadow: `0 30px 70px ${noirA(0.6)}` }}>
              {signe === "num" ? (
                <div style={{ width: 78, height: 78, borderRadius: 24, background: C.rouge, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 44, color: C.blanc, transform: `scale(${0.5 + 0.5 * r})`, boxShadow: `0 0 30px ${rougeA(0.6)}` }}>{i + 1}</div>
              ) : (
                <Coche p={eo(f, it.at + 4, it.at + 14)} size={78} non={signe === "non"} />
              )}
              {it.icone ? <div style={{ opacity: r }}>{it.icone}</div> : null}
              <div style={{ position: "relative", fontFamily: MONTSERRAT, fontWeight: 900, fontSize: n > 3 ? 60 : 68, letterSpacing: -1.5, color: barre > 0 ? blancA(1 - barre * 0.55) : C.blanc }}>
                {it.texte}
                <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 10, borderRadius: 5, background: C.rouge, transform: `scaleX(${barre})`, transformOrigin: "left", boxShadow: `0 0 20px ${C.rouge}` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Boucle infernale : trois étapes sur un cercle, une comète qui tourne et allume
 *  chaque étape sur son mot ; le cercle accélère (la spirale). */
export const Boucle: React.FC<{ t0: number; etapes: { texte: string; at: number }[]; centre?: string }> = ({ t0, etapes, centre }) => {
  const f = useCurrentFrame();
  const d = f - t0;
  const R = 300;
  const tour = d * (2.2 + eo(d, 0, 200) * 3.5);
  const angles = [-90, 30, 150];
  return (
    <div style={ZONE}>
      <div style={{ position: "relative", width: R * 2, height: R * 2, transform: `scale(${0.9 + eo(d, 0, 20) * 0.1})` }}>
        <svg width={R * 2 + 40} height={R * 2 + 40} style={{ position: "absolute", left: -20, top: -20 }} viewBox={`-20 -20 ${R * 2 + 40} ${R * 2 + 40}`}>
          <circle cx={R} cy={R} r={R} fill="none" stroke={rougeA(0.4)} strokeWidth={6} />
          <circle cx={R} cy={R} r={R - 26} fill="none" stroke={blancA(0.08)} strokeWidth={2} strokeDasharray="4 12" strokeDashoffset={-d * 2} />
          <circle cx={R} cy={R} r={R} fill="none" stroke={C.rouge} strokeWidth={14} pathLength={1} strokeDasharray="0.22 0.78" strokeDashoffset={-tour / 360} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${C.rouge})` }} />
        </svg>
        {centre ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 96, letterSpacing: -3, color: C.blanc, textAlign: "center", lineHeight: 1, opacity: eo(d, 6, 16), transform: `scale(${0.9 + eo(d, 6, 30) * 0.1})` }}>{centre}</div>
        ) : null}
        {etapes.map((e, i) => {
          const a = (angles[i] * Math.PI) / 180;
          const x = R + Math.cos(a) * R;
          const y = R + Math.sin(a) * R;
          const on = eo(f, e.at, e.at + 8);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * on})`, padding: "20px 34px", borderRadius: 22, background: on > 0.5 ? C.rouge : blancA(0.06), border: `2px solid ${on > 0.5 ? C.rouge : blancA(0.12)}`, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 54, color: C.blanc, whiteSpace: "nowrap", opacity: 0.15 + 0.85 * on, boxShadow: on > 0.5 ? `0 0 50px ${rougeA(0.6)}` : "none" }}>{e.texte}</div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Courbe de poids : les pesées du matin sautent dans tous les sens, puis la tendance
 *  (moyenne) se dessine et descend doucement. */
const PESEES = [61.8, 62.4, 61.6, 62.9, 61.9, 61.4, 62.6, 61.3, 61.0, 62.1, 61.2, 60.7, 61.6, 60.6, 60.3, 61.2, 60.1, 59.9, 60.8, 59.7, 59.5];
export const Courbe: React.FC<{ t0: number; tendanceAt: number; restoAt?: number }> = ({ t0, tendanceAt, restoAt }) => {
  const f = useCurrentFrame();
  const d = f - t0;
  const W = 1200, Hh = 480;
  const x = (i: number) => 40 + (i / (PESEES.length - 1)) * (W - 80);
  const y = (v: number) => 40 + ((63.2 - v) / 4) * (Hh - 80);
  const nb = Math.floor(eo(d, 4, 60) * PESEES.length);
  const moy = PESEES.map((_, i) => {
    const a = PESEES.slice(Math.max(0, i - 3), i + 4);
    return a.reduce((s, v) => s + v, 0) / a.length;
  });
  const tendance = "M " + moy.map((v, i) => `${x(i)} ${y(v)}`).join(" L ");
  const tp = eo(f, tendanceAt, tendanceAt + 30);
  const resto = restoAt !== undefined ? eo(f, restoAt, restoAt + 8) : 0;
  return (
    <div style={ZONE}>
      <div style={{ position: "relative", width: W, height: Hh, borderRadius: 30, background: blancA(0.03), border: `2px solid ${blancA(0.08)}`, transform: `scale(${0.94 + eo(d, 0, 30) * 0.06})` }}>
        <svg width={W} height={Hh}>
          {[0, 1, 2, 3].map((k) => <line key={k} x1={40} x2={W - 40} y1={40 + k * 133} y2={40 + k * 133} stroke={blancA(0.07)} strokeWidth={2} />)}
          {PESEES.slice(0, nb).map((v, i) => (
            <g key={i}>
              {i > 0 ? <line x1={x(i - 1)} y1={y(PESEES[i - 1])} x2={x(i)} y2={y(v)} stroke={blancA(0.35 - tp * 0.2)} strokeWidth={3} /> : null}
              <circle cx={x(i)} cy={y(v)} r={9} fill={i === 3 && resto > 0 ? C.rouge : blancA(0.75 - tp * 0.4)} />
            </g>
          ))}
          <path d={tendance} pathLength={1} fill="none" stroke={C.rouge} strokeWidth={12} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - tp} style={{ filter: `drop-shadow(0 0 16px ${C.rouge})` }} />
        </svg>
        {resto > 0 ? (
          <div style={{ position: "absolute", left: x(3) - 110, top: y(62.9) - 110, padding: "12px 22px", borderRadius: 16, background: C.rouge, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 34, color: C.blanc, opacity: resto * (1 - tp), transform: `scale(${0.7 + resto * 0.3})` }}>+1 kg = de l'eau</div>
        ) : null}
        <div style={{ position: "absolute", right: 50, bottom: 50, padding: "14px 26px", borderRadius: 16, border: `3px solid ${C.rouge}`, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 40, color: C.blanc, opacity: tp, transform: `translateY(${(1 - tp) * 20}px)` }}>La tendance</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Semaine réelle : sept colonnes, les contraintes tombent (cours, boulot, amies), puis les
 *  séances trouvent leur place dans les trous. */
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
export const Semaine: React.FC<{ t0: number; contraintes: { texte: string; at: number }[]; seancesAt: number }> = ({ t0, contraintes, seancesAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = f - t0;
  const BLOCS: { j: number; y: number; h: number; k: number }[] = [
    { j: 0, y: 40, h: 150, k: 0 }, { j: 1, y: 40, h: 150, k: 0 }, { j: 3, y: 40, h: 150, k: 0 },
    { j: 2, y: 230, h: 120, k: 1 }, { j: 4, y: 230, h: 120, k: 1 }, { j: 1, y: 230, h: 120, k: 1 },
    { j: 5, y: 300, h: 140, k: 2 }, { j: 4, y: 380, h: 80, k: 2 },
  ];
  const SEANCES = [{ j: 0, y: 380 }, { j: 2, y: 400 }, { j: 6, y: 120 }];
  return (
    <div style={ZONE}>
      <div style={{ display: "flex", gap: 16, transform: `scale(${0.95 + eo(d, 0, 40) * 0.05}) translateX(${-d * 0.3}px)` }}>
        {JOURS.map((j, i) => (
          <div key={j} style={{ position: "relative", width: 168, height: 560, borderRadius: 24, background: blancA(0.035), border: `2px solid ${blancA(0.07)}`, opacity: eo(d, i * 1.5, i * 1.5 + 8), transform: `translateY(${(1 - eo(d, i * 1.5, i * 1.5 + 10)) * 50}px)` }}>
            <div style={{ textAlign: "center", paddingTop: 10, fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 28, color: blancA(0.6) }}>{j}</div>
            {BLOCS.filter((b) => b.j === i).map((b, k) => {
              const c = contraintes[b.k];
              if (!c) return null;
              const r = ressort(f, fps, c.at + k, 240);
              return <div key={k} style={{ position: "absolute", left: 12, right: 12, top: b.y + 20, height: b.h, borderRadius: 16, background: blancA(0.12), border: `2px solid ${blancA(0.18)}`, transform: `translateY(${(1 - r) * -200}px)`, opacity: f >= c.at ? 1 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 24, color: blancA(0.75) }}>{c.texte}</div>;
            })}
            {SEANCES.filter((s) => s.j === i).map((s, k) => {
              const r = ressort(f, fps, seancesAt + i * 3, 200);
              return <div key={`s${k}`} style={{ position: "absolute", left: 12, right: 12, top: s.y + 20, height: 100, borderRadius: 16, background: C.rouge, boxShadow: `0 0 40px ${rougeA(0.7)}`, transform: `scale(${r})`, opacity: f >= seancesAt ? 1 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 26, color: C.blanc }}>Séance</div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Trajet : de Girardota (Colombie) à Annecy, un arc qui se dessine avec un point qui voyage. */
export const Trajet: React.FC<{ t0: number; departAt: number; arriveeAt: number }> = ({ t0, departAt, arriveeAt }) => {
  const f = useCurrentFrame();
  const d = f - t0;
  const p = eo(f, departAt, arriveeAt + 6);
  const A = { x: 360, y: 520 }, B = { x: 1540, y: 260 };
  const ctrl = { x: 950, y: -40 };
  const pt = (t: number) => ({ x: (1 - t) ** 2 * A.x + 2 * (1 - t) * t * ctrl.x + t * t * B.x, y: (1 - t) ** 2 * A.y + 2 * (1 - t) * t * ctrl.y + t * t * B.y });
  const c = pt(p);
  const lieu = (x: number, y: number, nom: string, pays: string, on: number) => (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%)` }}>
      <div style={{ width: 34, height: 34, borderRadius: 17, background: C.rouge, transform: `scale(${0.5 + on * 0.5})`, boxShadow: `0 0 0 ${on * 18}px ${rougeA(0.18)}, 0 0 40px ${C.rouge}` }} />
      <div style={{ position: "absolute", top: 50, left: "50%", transform: `translateX(-50%) translateY(${(1 - on) * 20}px)`, opacity: on, textAlign: "center", whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 56, color: C.blanc, letterSpacing: -1 }}>{nom}</div>
        <div style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: 30, color: blancA(0.6), letterSpacing: 4, textTransform: "uppercase" }}>{pays}</div>
      </div>
    </div>
  );
  return (
    <div style={{ ...ZONE, alignItems: "stretch", justifyContent: "stretch" }}>
      <svg width={1920} height={700} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${1 + eo(d, 0, 200) * 0.05})` }}>
        <path d={`M ${A.x} ${A.y} Q ${ctrl.x} ${ctrl.y} ${B.x} ${B.y}`} fill="none" stroke={rougeA(0.25)} strokeWidth={4} strokeDasharray="4 16" />
        <path d={`M ${A.x} ${A.y} Q ${ctrl.x} ${ctrl.y} ${B.x} ${B.y}`} pathLength={1} fill="none" stroke={C.rouge} strokeWidth={8} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
        {p > 0 && p < 1 ? <circle cx={c.x} cy={c.y} r={16} fill={C.blanc} style={{ filter: `drop-shadow(0 0 18px ${C.rouge})` }} /> : null}
      </svg>
      {lieu(A.x, A.y, "Girardota", "Colombie", eo(f, departAt - 6, departAt + 6))}
      {lieu(B.x, B.y, "Annecy", "France", eo(f, arriveeAt, arriveeAt + 10))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Route des 6 mois : une piste qui se dessine, un curseur qui avance d'étape en étape. */
export const Route: React.FC<{ t0: number; etapes: { titre: string; sous: string; at: number }[] }> = ({ t0, etapes }) => {
  const f = useCurrentFrame();
  const d = f - t0;
  const xs = etapes.map((_, i) => 360 + (i * 1200) / (etapes.length - 1));
  const actifs = etapes.filter((e) => f >= e.at).length;
  const cible = actifs <= 1 ? 0 : (actifs - 1) / (etapes.length - 1);
  const prec = actifs <= 2 ? 0 : (actifs - 2) / (etapes.length - 1);
  const dernier = etapes[Math.max(0, actifs - 1)]?.at ?? t0;
  const prog = prec + (cible - prec) * eo(f, dernier, dernier + 18);
  return (
    <div style={ZONE}>
      <div style={{ position: "relative", width: 1920, height: 520, transform: `translateX(${(0.5 - prog) * 120}px)` }}>
        <div style={{ position: "absolute", left: xs[0], width: xs[xs.length - 1] - xs[0], top: 250, height: 10, borderRadius: 5, background: blancA(0.1), transform: `scaleX(${eo(d, 0, 20)})`, transformOrigin: "left" }} />
        <div style={{ position: "absolute", left: xs[0], width: (xs[xs.length - 1] - xs[0]) * prog, top: 250, height: 10, borderRadius: 5, background: C.rouge, boxShadow: `0 0 26px ${C.rouge}` }} />
        <div style={{ position: "absolute", left: xs[0] + (xs[xs.length - 1] - xs[0]) * prog - 26, top: 229, width: 52, height: 52, borderRadius: 26, background: C.blanc, boxShadow: `0 0 0 10px ${rougeA(0.35)}, 0 0 40px ${C.rouge}` }} />
        {etapes.map((e, i) => {
          const on = eo(f, e.at, e.at + 10);
          const haut = i % 2 === 0;
          return (
            <div key={i} style={{ position: "absolute", left: xs[i], top: haut ? 40 : 320, transform: `translateX(-50%) translateY(${(1 - on) * (haut ? -30 : 30)}px)`, opacity: 0.25 + 0.75 * on, textAlign: "center", width: 420 }}>
              <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: on > 0.5 ? C.rouge : blancA(0.5) }}>{e.sous}</div>
              <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 52, lineHeight: 1.05, letterSpacing: -1.5, color: C.blanc }}>{e.titre}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Offre : une pile de tuiles qui se retournent une à une sur la voix, compteur en haut. */
export const Offre: React.FC<{ t0: number; tuiles: { titre: string; at: number }[] }> = ({ t0, tuiles }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = f - t0;
  const nb = tuiles.filter((t) => f >= t.at).length;
  return (
    <div style={{ ...ZONE, perspective: 1600, flexDirection: "column", gap: 26 }}>
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 40, letterSpacing: 6, color: blancA(0.7), textTransform: "uppercase", opacity: eo(d, 0, 10) }}>
        Coaching EP · <span style={{ color: C.rouge }}>{nb}</span> / {tuiles.length} inclus
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 290px)", gap: 18, transform: `rotateX(${10 - eo(d, 0, 200) * 6}deg) scale(${0.97 + eo(d, 0, 300) * 0.03})` }}>
        {tuiles.map((t, i) => {
          const r = ressort(f, fps, t.at, 210);
          const vu = f >= t.at;
          return (
            <div key={i} style={{ height: 210, borderRadius: 26, background: vu ? `linear-gradient(140deg, ${C.rouge}, ${C.rougeFonce})` : blancA(0.04), border: `2px solid ${vu ? rougeA(0.9) : blancA(0.08)}`, transform: `rotateY(${(1 - r) * 180}deg) translateY(${(1 - r) * 40}px)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center", fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 40, lineHeight: 1.05, color: vu ? C.blanc : "transparent", boxShadow: vu ? `0 30px 60px ${rougeA(0.35)}` : "none", backfaceVisibility: "hidden" }}>{t.titre}</div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Bouton d'appel à l'action : un gros curseur traverse l'écran, clique, onde de choc. */
export const Bouton: React.FC<{ t0: number; titre: string; details: string[]; clicAt?: number }> = ({ t0, titre, details, clicAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = f - t0;
  const r = ressort(f, fps, t0, 180);
  const clic = clicAt ?? t0 + 30;
  const cur = eo(f, clic - 22, clic);
  const enfonce = f >= clic ? 1 - ressort(f, fps, clic, 400) : 0;
  const onde = eo(f, clic, clic + 24);
  return (
    <div style={{ ...ZONE, flexDirection: "column", gap: 40 }}>
      <div style={{ position: "relative" }}>
        {f >= clic ? <div style={{ position: "absolute", left: "50%", top: "50%", width: 900, height: 900, marginLeft: -450, marginTop: -450, borderRadius: "50%", border: `${10 * (1 - onde)}px solid ${rougeA(0.8 * (1 - onde))}`, transform: `scale(${0.2 + onde * 0.9})` }} /> : null}
        <div style={{ padding: "48px 90px", borderRadius: 999, background: `linear-gradient(120deg, ${C.rouge}, ${C.rougeMoyen})`, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 84, letterSpacing: -2, color: C.blanc, transform: `scale(${(0.6 + r * 0.4) * (1 - enfonce * 0.08)})`, boxShadow: `0 0 0 ${8 + Math.sin(d / 6) * 0}px ${rougeA(0.25)}, 0 40px 100px ${rougeA(0.5)}` }}>{titre}</div>
        <svg width={110} height={110} viewBox="0 0 24 24" style={{ position: "absolute", left: `${70 + (1 - cur) * 40}%`, top: `${60 + (1 - cur) * 120}%`, opacity: eo(f, clic - 26, clic - 18), filter: `drop-shadow(0 10px 20px ${noirA(0.8)})`, transform: `scale(${1 - enfonce * 0.15})` }}>
          <path d="M4 3 L19 11 L12 13 L9 20 Z" fill={C.blanc} stroke={C.noir} strokeWidth={1.2} strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        {details.map((t, i) => {
          const e = eo(d, 8 + i * 4, 18 + i * 4);
          return <div key={i} style={{ padding: "16px 34px", borderRadius: 999, border: `2px solid ${rougeA(0.6)}`, background: blancA(0.05), fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 40, color: C.blanc, opacity: e, transform: `translateY(${(1 - e) * 30}px)` }}>{t}</div>;
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Duo : au pire / au mieux, deux panneaux qui s'ouvrent comme des portes. */
export const Duo: React.FC<{ t0: number; a: { titre: string; texte: string; at: number }; b: { titre: string; texte: string; at: number } }> = ({ a, b }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const carte = (c: typeof a, fort: boolean, k: number) => {
    const r = ressort(f, fps, c.at, 170);
    return (
      <div style={{ width: 640, height: 400, borderRadius: 36, padding: 50, background: fort ? `linear-gradient(140deg, ${C.rouge}, ${C.rougeFonce})` : blancA(0.05), border: `2px solid ${fort ? C.rouge : blancA(0.12)}`, transform: `rotateY(${(1 - r) * (k ? -70 : 70)}deg) scale(${fort ? 1 + r * 0.04 : 1})`, opacity: f >= c.at ? 1 : 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, boxShadow: fort ? `0 40px 120px ${rougeA(0.5)}` : "none" }}>
        <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 34, letterSpacing: 8, textTransform: "uppercase", color: fort ? blancA(0.85) : blancA(0.55) }}>{c.titre}</div>
        <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 78, lineHeight: 1, letterSpacing: -2, color: C.blanc }}>{c.texte}</div>
      </div>
    );
  };
  return (
    <div style={{ ...ZONE, perspective: 1800, gap: 50 }}>
      {carte(a, false, 0)}
      {carte(b, true, 1)}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Compteur : un nombre qui défile jusqu'à sa valeur, anneau qui se remplit. */
export const Compteur: React.FC<{ t0: number; valeur: number; unite: string; sous?: string }> = ({ t0, valeur, unite, sous }) => {
  const f = useCurrentFrame();
  const d = f - t0;
  const p = eo(d, 2, 32);
  const R = 250;
  return (
    <div style={ZONE}>
      <div style={{ position: "relative", width: R * 2, height: R * 2, transform: `scale(${0.9 + eo(d, 0, 60) * 0.1})` }}>
        <svg width={R * 2} height={R * 2} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
          <circle cx={R} cy={R} r={R - 16} fill="none" stroke={blancA(0.08)} strokeWidth={18} />
          <circle cx={R} cy={R} r={R - 16} fill="none" stroke={C.rouge} strokeWidth={18} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 16px ${C.rouge})` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 220, lineHeight: 0.9, letterSpacing: -10, color: C.blanc }}>{Math.round(p * valeur)}</div>
          <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 64, color: C.rouge, letterSpacing: -1 }}>{unite}</div>
        </div>
      </div>
      {sous ? <div style={{ position: "absolute", left: 1320, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 64, lineHeight: 1.05, color: C.blanc, width: 460, opacity: eo(d, 14, 24), transform: `translateX(${(1 - eo(d, 14, 24)) * 50}px)` }}>{sous}</div> : null}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
/** Recommencements : des fiches « Jour 1 » qui tombent l'une sur l'autre, chacune barrée
 *  d'un trait rouge avant que la suivante arrive. */
export const Jour1: React.FC<{ t0: number; ats: number[] }> = ({ ats }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...ZONE, perspective: 1600 }}>
      {ats.map((at, i) => {
        if (f < at - 1) return null;
        const r = ressort(f, fps, at, 230);
        const suivant = ats[i + 1];
        const barre = suivant !== undefined ? eo(f, suivant - 10, suivant - 2) : 0;
        const rot = [-8, 5, -3, 7][i % 4];
        const dx = [-260, 40, 300, -60][i % 4];
        return (
          <div key={i} style={{ position: "absolute", left: 960 - 230 + dx, top: 120 + i * 18, width: 460, height: 440, borderRadius: 36, background: `linear-gradient(160deg, ${C.blanc}, #E7D9D9)`, boxShadow: `0 50px 120px ${noirA(0.7)}`, transform: `translateY(${(1 - r) * -500}px) rotate(${rot + (1 - r) * 20}deg) scale(${1.15 - 0.15 * r})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 90, background: C.rouge }} />
            <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.rougeFonce, textTransform: "uppercase", marginTop: 50 }}>Jour</div>
            <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 230, lineHeight: 0.9, letterSpacing: -10, color: C.noir }}>1</div>
            <svg width={460} height={440} viewBox="0 0 460 440" style={{ position: "absolute", inset: 0 }}>
              <Trace d="M 60 380 L 400 80" p={barre} w={22} />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
