import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { C, MONTSERRAT, blancA, noirA, rougeA } from "../lib/brand";
import { clamp, ease, pop } from "./core";

// Visuels de la zone droite (x 1000 à 1840). Chacun reçoit t0 : l'image locale où il apparaît,
// et ses propres repères (images locales de la scène) pour animer ses éléments sur la voix.

const Zone: React.FC<{ t0: number; children: React.ReactNode }> = ({ t0, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(f, fps, t0, 10);
  const clip = ease(f, t0, t0 + 10);
  const d = f - t0;
  return (
    <div
      style={{
        position: "absolute",
        left: 310,
        top: 90,
        width: 1300,
        height: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Entrée : découpe diagonale qui s'ouvre, glissé et rotation qui se pose ; puis flottement.
        clipPath: `polygon(0 ${100 - clip * 140}%, 100% ${140 - clip * 140}%, 100% 100%, 0 100%)`,
        transform: `translate(0px, ${(1 - p) * 60 + Math.sin(d / 28) * 6}px) rotate(${(1 - p) * 3 + Math.sin(d / 45) * 0.4}deg) scale(${(0.9 + 0.1 * p) * 1.15})`,
      }}
    >
      {children}
    </div>
  );
};

const carte: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(245,237,237,0.09), rgba(245,237,237,0.03))",
  border: `1.5px solid ${blancA(0.14)}`,
  borderRadius: 28,
  boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
};

// v3.3 : le texte des visuels est agrandi de 30 % (en dessous de 60 px), pour rester
// lisible quand la vidéo est regardée sur un téléphone (1920 px affichés sur ~390 px).
const LISIBLE = 1.3;
const txt = (size0: number, weight = 800, color: string = C.blanc): React.CSSProperties => {
  const size = size0 < 60 ? Math.round(size0 * LISIBLE) : size0;
  return {
  fontFamily: MONTSERRAT,
  fontWeight: weight,
  fontSize: size,
  color,
  letterSpacing: -size * 0.02,
  lineHeight: 1.15,
  };
};

/** Photo d'Emmanuel ou d'ambiance, cadre incliné, léger zoom continu. */
export const Photo: React.FC<{ t0: number; src: string; legende?: string; incline?: number }> = ({ t0, src, legende, incline = -3 }) => {
  const f = useCurrentFrame();
  const z = interpolate(f - t0, [0, 300], [1.0, 1.08], clamp);
  return (
    <Zone t0={t0}>
      <div style={{ ...carte, padding: 14, transform: `rotate(${incline}deg)`, background: C.blanc }}>
        <div style={{ width: 520, height: 650, overflow: "hidden", borderRadius: 16 }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />
        </div>
        {legende && <div style={{ ...txt(30, 900, C.noir), padding: "16px 8px 4px", textAlign: "center" }}>{legende}</div>}
      </div>
    </Zone>
  );
};

/** Capture de l'appli dans un téléphone. */
export const Telephone: React.FC<{ t0: number; src: string; label?: string }> = ({ t0, src, label }) => {
  const f = useCurrentFrame();
  const y = interpolate(f - t0, [0, 240], [0, -120], clamp);
  return (
    <Zone t0={t0}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <div style={{ width: 380, height: 700, borderRadius: 56, padding: 14, background: "#1a0a0a", border: `2px solid ${blancA(0.18)}`, boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 44, overflow: "hidden" }}>
            <Img src={staticFile(src)} style={{ width: "100%", transform: `translateY(${y}px)` }} />
          </div>
        </div>
        {label && <div style={{ ...txt(30, 800, blancA(0.8)) }}>{label}</div>}
      </div>
    </Zone>
  );
};

/** Liste de cartes qui arrivent une à une sur la voix (coche, croix ou numéro). */
export const Liste: React.FC<{ t0: number; items: { texte: string; at: number; barre?: number }[]; signe?: "ok" | "non" | "num" }> = ({ t0, items, signe = "ok" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Zone t0={t0}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 1000 }}>
        {items.map((it, i) => {
          const p = pop(f, fps, it.at, 7);
          const b = it.barre !== undefined ? ease(f, it.barre, it.barre + 8) : 0;
          const on = f >= it.at;
          return (
            <div
              key={i}
              style={{
                ...carte,
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "26px 32px",
                opacity: on ? 1 : 0.18,
                transform: `translateX(${(1 - p) * 50}px)`,
                borderColor: on && b === 0 ? rougeA(0.6) : blancA(0.12),
              }}
            >
              <div style={{ width: 58, height: 58, flexShrink: 0, borderRadius: 16, background: signe === "non" || b > 0 ? noirA(0.6) : C.rouge, border: `2px solid ${C.rouge}`, display: "flex", alignItems: "center", justifyContent: "center", ...txt(32, 900) }}>
                {signe === "num" ? i + 1 : signe === "non" || b > 0 ? "✕" : "✓"}
              </div>
              <div style={{ position: "relative", ...txt(40, 800, b > 0 ? blancA(0.45) : C.blanc) }}>
                {it.texte}
                <div style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 6, background: C.rouge, transformOrigin: "left", transform: `scaleX(${b})` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Zone>
  );
};

/** Le cycle « je commence, j'arrête, j'y repense » qui tourne en boucle. */
export const Cycle: React.FC<{ t0: number; labels: { texte: string; at: number }[] }> = ({ t0, labels }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = 290;
  const rot = (f - t0) * 1.4;
  return (
    <Zone t0={t0}>
      <div style={{ position: "relative", width: 760, height: 760 }}>
        <svg width={760} height={760} style={{ position: "absolute", inset: 0, transform: `rotate(${rot}deg)` }}>
          <circle cx={380} cy={380} r={R} fill="none" stroke={rougeA(0.5)} strokeWidth={6} strokeDasharray="30 22" />
        </svg>
        {labels.map((l, i) => {
          const a = (-90 + i * (360 / labels.length)) * (Math.PI / 180);
          const p = pop(f, fps, l.at, 7);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 380 + Math.cos(a) * R - 210,
                top: 380 + Math.sin(a) * R - 48,
                width: 420,
                ...carte,
                background: f >= l.at ? C.rouge : "#1a0606",
                padding: "20px 10px",
                textAlign: "center",
                ...txt(34, 900),
                transform: `scale(${0.6 + 0.4 * p})`,
                opacity: p,
              }}
            >
              {l.texte}
            </div>
          );
        })}
      </div>
    </Zone>
  );
};

/** Très gros mot ou chiffre, avec un sous-titre. */
export const Gros: React.FC<{ t0: number; texte: string; sous?: string }> = ({ t0, texte, sous }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(f, fps, t0, 9);
  return (
    <Zone t0={t0}>
      <div style={{ textAlign: "center" }}>
        <div style={{ ...txt(Math.min(220, Math.round(1150 / Math.max(1, texte.length))), 900, C.rouge), letterSpacing: -6, transform: `scale(${1.3 - 0.3 * p})`, lineHeight: 1 }}>{texte}</div>
        {sous && <div style={{ ...txt(44, 800, blancA(0.75)), marginTop: 20 }}>{sous}</div>}
      </div>
    </Zone>
  );
};

/** Semaine type : des créneaux qui se posent dans un emploi du temps chargé. */
export const Semaine: React.FC<{ t0: number; at: number }> = ({ t0, at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const jours = ["L", "M", "M", "J", "V", "S", "D"];
  const pris = [[0, 1, 2], [0, 1], [0, 2, 3], [0, 1, 2], [0, 1, 3], [2, 3], [1]];
  const seances = [1, 3, 5]; // trois créneaux libres utilisés
  return (
    <Zone t0={t0}>
      <div style={{ ...carte, padding: 34, display: "flex", gap: 16 }}>
        {jours.map((j, d) => (
          <div key={d} style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <div style={{ ...txt(30, 900, blancA(0.6)) }}>{j}</div>
            {[0, 1, 2, 3].map((h) => {
              const occupe = pris[d].includes(h);
              const seance = !occupe && seances.includes(d) && h === [3, 1, 0, 2, 1, 0, 3].find((x) => !pris[d].includes(x));
              const p = seance ? pop(f, fps, at + seances.indexOf(d) * 5, 7) : 1;
              return (
                <div
                  key={h}
                  style={{
                    width: 86,
                    height: 110,
                    borderRadius: 14,
                    background: occupe ? blancA(0.12) : seance ? C.rouge : "transparent",
                    border: `1.5px dashed ${blancA(occupe || seance ? 0 : 0.15)}`,
                    transform: `scale(${seance ? p : 1})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...txt(18, 900),
                  }}
                >
                  {seance ? "45 min" : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Zone>
  );
};

/** Balance au jour le jour (qui saute) contre la tendance (qui descend). */
export const Tendance: React.FC<{ t0: number; tendanceAt: number }> = ({ t0, tendanceAt }) => {
  const f = useCurrentFrame();
  const W = 720, H = 440, n = 28;
  const bruit = [0, 0.8, -0.3, 1.2, 0.2, -0.6, 0.9, 1.5, 0.1, -0.4, 0.7, 0.3, 1.1, -0.2, 0.4, 0.9, -0.5, 0.2, 0.6, -0.3, 0.8, 0.1, -0.2, 0.5, -0.4, 0.3, -0.1, 0.2];
  const val = (i: number) => 1.6 - (i / (n - 1)) * 1.6 + bruit[i] * 0.55;
  const pt = (i: number, v: number) => [30 + (i / (n - 1)) * (W - 60), 40 + (1 - v / 2.6) * (H - 80)];
  const jour = Array.from({ length: n }, (_, i) => pt(i, val(i)));
  const dJour = jour.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [ax, ay] = pt(0, 1.85), [bx, by] = pt(n - 1, 0.25);
  const dTend = `M${ax},${ay} L${bx},${by}`;
  const p1 = ease(f, t0 + 4, t0 + 40);
  const p2 = ease(f, tendanceAt, tendanceAt + 24);
  const e1 = evolvePath(p1, dJour);
  const e2 = evolvePath(p2, dTend);
  return (
    <Zone t0={t0}>
      <div style={{ ...carte, padding: 36 }}>
        <svg width={W} height={H}>
          <path d={dJour} fill="none" stroke={blancA(0.55)} strokeWidth={5} strokeLinejoin="round" strokeDasharray={e1.strokeDasharray} strokeDashoffset={e1.strokeDashoffset} />
          {jour.map(([x, y], i) => (i / (n - 1) <= p1 ? <circle key={i} cx={x} cy={y} r={6} fill={blancA(0.7)} /> : null))}
          <path d={dTend} fill="none" stroke={C.rouge} strokeWidth={12} strokeLinecap="round" strokeDasharray={e2.strokeDasharray} strokeDashoffset={e2.strokeDashoffset} />
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
          <span style={{ ...txt(30, 800, blancA(0.6)) }}>● la balance chaque matin</span>
          <span style={{ ...txt(30, 900, C.rouge), opacity: p2 }}>━ la tendance</span>
        </div>
      </div>
    </Zone>
  );
};

/** Feuille de route sur six mois : quatre étapes qui s'allument. */
export const Route: React.FC<{ t0: number; etapes: { titre: string; sous: string; at: number }[] }> = ({ t0, etapes }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const last = etapes.filter((e) => f >= e.at).length;
  const h = interpolate(last, [0, etapes.length], [0, 100], clamp);
  return (
    <Zone t0={t0}>
      <div style={{ position: "relative", width: 720, display: "flex", flexDirection: "column", gap: 34, paddingLeft: 90 }}>
        <div style={{ position: "absolute", left: 32, top: 20, bottom: 20, width: 6, background: blancA(0.1), borderRadius: 3 }}>
          <div style={{ width: "100%", height: `${h}%`, background: C.rouge, borderRadius: 3 }} />
        </div>
        {etapes.map((e, i) => {
          const p = pop(f, fps, e.at, 7);
          const on = f >= e.at;
          return (
            <div key={i} style={{ position: "relative", opacity: on ? 1 : 0.25, transform: `translateX(${(1 - p) * 40}px)` }}>
              <div style={{ position: "absolute", left: -76, top: 10, width: 40, height: 40, borderRadius: 20, background: on ? C.rouge : C.noir, border: `4px solid ${on ? C.rouge : blancA(0.25)}` }} />
              <div style={{ ...txt(26, 800, C.rouge), letterSpacing: 3, textTransform: "uppercase" }}>{e.sous}</div>
              <div style={{ ...txt(46, 900) }}>{e.titre}</div>
            </div>
          );
        })}
      </div>
    </Zone>
  );
};

/** Grille de l'offre : chaque tuile s'allume quand elle est dite. */
export const Offre: React.FC<{ t0: number; tuiles: { titre: string; at: number }[] }> = ({ t0, tuiles }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Zone t0={t0}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, width: 1080 }}>
        {tuiles.map((t, i) => {
          const p = pop(f, fps, t.at, 7);
          const on = f >= t.at;
          return (
            <div
              key={i}
              style={{
                ...carte,
                height: 118,
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: on ? "linear-gradient(150deg, #8a0d0d, #3a0303)" : "rgba(245,237,237,0.03)",
                borderColor: on ? rougeA(0.8) : blancA(0.08),
                transform: `scale(${on ? 0.9 + 0.1 * p : 0.94})`,
              }}
            >
              <div style={{ ...txt(30, 900, on ? C.blanc : blancA(0.25)) }}>{on ? "✓" : "○"}</div>
              <div style={{ ...txt(36, 900, on ? C.blanc : blancA(0.25)) }}>{t.titre}</div>
            </div>
          );
        })}
      </div>
    </Zone>
  );
};

/** Bouton d'appel à l'action qui pulse, flèche vers le bas. */
export const Bouton: React.FC<{ t0: number; titre: string; details: string[] }> = ({ t0, titre, details }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin((f - t0) / 7) * 0.025;
  const fl = Math.sin((f - t0) / 6) * 14;
  return (
    <Zone t0={t0}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ background: C.rouge, borderRadius: 30, padding: "44px 60px", transform: `scale(${pulse})`, boxShadow: `0 0 0 ${10 + Math.sin((f - t0) / 7) * 6}px ${rougeA(0.25)}, 0 30px 80px rgba(0,0,0,0.6)`, textAlign: "center" }}>
          <div style={{ ...txt(56, 900) }}>{titre}</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {details.map((d, i) => {
            const p = pop(f, fps, t0 + 8 + i * 5, 7);
            return (
              <div key={i} style={{ ...carte, borderRadius: 999, padding: "14px 26px", ...txt(30, 800), opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
                {d}
              </div>
            );
          })}
        </div>
        <div style={{ ...txt(90, 900, C.rouge), transform: `translateY(${fl}px)` }}>↓</div>
      </div>
    </Zone>
  );
};

/** Deux scénarios côte à côte (pire / meilleur cas). */
export const Duo: React.FC<{ t0: number; a: { titre: string; texte: string; at: number }; b: { titre: string; texte: string; at: number } }> = ({ t0, a, b }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bloc = (x: typeof a, rouge: boolean) => {
    const p = pop(f, fps, x.at, 8);
    return (
      <div style={{ ...carte, width: 370, height: 420, padding: 34, display: "flex", flexDirection: "column", justifyContent: "space-between", background: rouge ? "linear-gradient(150deg, #a01010, #3a0303)" : carte.background, opacity: f >= x.at ? 1 : 0.15, transform: `translateY(${(1 - p) * 40}px)` }}>
        <div style={{ ...txt(28, 800, rouge ? C.blanc : blancA(0.6)), textTransform: "uppercase", letterSpacing: 3 }}>{x.titre}</div>
        <div style={{ ...txt(44, 900) }}>{x.texte}</div>
      </div>
    );
  };
  return (
    <Zone t0={t0}>
      <div style={{ display: "flex", gap: 30 }}>
        {bloc(a, false)}
        {bloc(b, true)}
      </div>
    </Zone>
  );
};
