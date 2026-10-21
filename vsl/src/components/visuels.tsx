import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { C, MONTSERRAT, blancA, rougeA } from "../lib/brand";
import { EASE, EASE_IN, EASE_IO, logZoom, prog } from "../lib/scene";

// ── Panneau photo plein cadre sur un côté, bord fondu dans le noir (plan « cinéma »).
export const Panneau: React.FC<{
  src: string;
  at?: number;
  fin?: number;
  cote?: "droite" | "gauche";
  largeur?: number;
  pos?: string;
  zoom?: [number, number];
  duree?: number;
  entree?: "volet" | "fondu" | "monte";
  grade?: number;
}> = ({ src, at = 0, fin, cote = "droite", largeur = 960, pos = "50% 30%", zoom = [1.18, 1.04], duree = 300, entree = "volet", grade = 1 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 24, EASE);
  const o = fin !== undefined ? prog(f, fin, fin + 14, EASE_IN) : 0;
  if (p <= 0 || o >= 1) return null;
  const k = Math.min(1, Math.max(0, (f - at) / duree));
  const s = logZoom(k, zoom[0], zoom[1]);
  const x = cote === "droite" ? 1920 - largeur : 0;
  const clip =
    entree === "volet"
      ? cote === "droite"
        ? `inset(0 0 0 ${(1 - p) * 100}%)`
        : `inset(0 ${(1 - p) * 100}% 0 0)`
      : entree === "monte"
        ? `inset(${(1 - p) * 100}% 0 0 0)`
        : undefined;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 0,
        width: largeur,
        height: 1080,
        clipPath: clip,
        opacity: (entree === "fondu" ? p : 1) * (1 - o),
        WebkitMaskImage:
          cote === "droite"
            ? "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 28%)"
            : "linear-gradient(270deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 28%)",
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(`img/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          scale: `${s}`,
          filter: `saturate(${1 - 0.5 * grade}) contrast(${1 + 0.15 * grade}) brightness(${1 - 0.12 * grade})`,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: C.rougeFonce, mixBlendMode: "color", opacity: 0.38 * grade }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(13,0,0,0.35) 0%, rgba(13,0,0,0) 30%, rgba(13,0,0,0) 60%, rgba(13,0,0,0.85) 100%)",
        }}
      />
    </div>
  );
};

// ── Courbe qui se dessine (poids, progression, rétention…).
export const Courbe: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  points: number[]; // valeurs 0..1 (0 = bas)
  at: number;
  duree?: number;
  fin?: number;
  labels?: string[];
  couleur?: string;
  epaisseur?: number;
  aire?: boolean;
  grille?: boolean;
  point?: boolean;
}> = ({ x, y, w, h, points, at, duree = 40, fin, labels, couleur = C.rouge, epaisseur = 7, aire = true, grille = true, point = true }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + duree, EASE_IO);
  const g = prog(f, at - 10, at + 10, EASE);
  const o = fin !== undefined ? prog(f, fin, fin + 12, EASE_IN) : 0;
  if (g <= 0 || o >= 1) return null;
  const pts = points.map((v, i) => [(i / (points.length - 1)) * w, h - v * h] as const);
  // Longueur cumulée pour tracer jusqu'à p.
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const L = seg.reduce((a, b) => a + b, 0);
  let reste = L * p;
  let tete = pts[0] as readonly [number, number];
  const vis: (readonly [number, number])[] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (reste >= seg[i]) {
      vis.push(pts[i + 1]);
      reste -= seg[i];
      tete = pts[i + 1];
    } else {
      const r = reste / seg[i];
      tete = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
      vis.push(tete);
      break;
    }
  }
  const d = vis.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
  const da = `${d} L${tete[0].toFixed(1)},${h} L0,${h} Z`;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h + 60, opacity: g * (1 - o) }}>
      <svg width={w} height={h} style={{ overflow: "visible", position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id={`aire-${x}-${y}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={couleur} stopOpacity={0.35} />
            <stop offset="100%" stopColor={couleur} stopOpacity={0} />
          </linearGradient>
        </defs>
        {grille
          ? [0, 0.25, 0.5, 0.75, 1].map((v) => (
              <line key={v} x1={0} x2={w} y1={h * v} y2={h * v} stroke={blancA(0.07)} strokeWidth={2} />
            ))
          : null}
        {aire ? <path d={da} fill={`url(#aire-${x}-${y})`} /> : null}
        <path d={d} fill="none" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" strokeLinejoin="round" />
        {point && p > 0 ? (
          <>
            <circle cx={tete[0]} cy={tete[1]} r={epaisseur * 3.2} fill={rougeA(0.25)} />
            <circle cx={tete[0]} cy={tete[1]} r={epaisseur * 1.5} fill={C.blanc} />
          </>
        ) : null}
      </svg>
      {labels ? (
        <div style={{ position: "absolute", left: 0, top: h + 18, width: w, display: "flex", justifyContent: "space-between" }}>
          {labels.map((l, i) => (
            <span key={i} style={{ fontFamily: MONTSERRAT, fontWeight: 700, fontSize: 24, color: blancA(0.45), letterSpacing: "0.04em" }}>
              {l}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

// ── Agenda de la semaine, vide (scène 1) ou qui se remplit (scènes 5 et 6).
export const Agenda: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  fin?: number;
  creneaux?: { j: number; h0: number; h1: number; at: number; label?: string }[];
  scan?: [number, number];
}> = ({ x, y, w, h, at, fin, creneaux = [], scan }) => {
  const f = useCurrentFrame();
  const jours = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
  const heures = ["8h", "10h", "12h", "14h", "16h", "18h", "20h"];
  const o = fin !== undefined ? prog(f, fin, fin + 12, EASE_IN) : 0;
  const g = prog(f, at, at + 12, EASE);
  if (g <= 0 || o >= 1) return null;
  const gx = 90;
  const gy = 70;
  const cw = (w - gx) / 7;
  const ch = (h - gy) / (heures.length - 1);
  const sx = scan ? prog(f, scan[0], scan[1], EASE_IO) : -1;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: g * (1 - o), fontFamily: MONTSERRAT }}>
      {jours.map((j, i) => {
        const p = prog(f, at + i * 3, at + i * 3 + 16, EASE);
        return (
          <div
            key={j}
            style={{
              position: "absolute",
              left: gx + i * cw,
              top: 0,
              width: cw,
              textAlign: "center",
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: "0.12em",
              color: blancA(0.55),
              opacity: p,
              translate: `0 ${(1 - p) * 20}px`,
            }}
          >
            {j}
          </div>
        );
      })}
      {heures.map((hh, i) => {
        const p = prog(f, at + 4 + i * 2, at + 4 + i * 2 + 22, EASE_IO);
        return (
          <React.Fragment key={hh}>
            <div style={{ position: "absolute", left: 0, top: gy + i * ch - 14, fontWeight: 700, fontSize: 22, color: blancA(0.35), opacity: p }}>
              {hh}
            </div>
            <div
              style={{
                position: "absolute",
                left: gx,
                top: gy + i * ch,
                width: w - gx,
                height: 2,
                background: blancA(0.1),
                transformOrigin: "left",
                scale: `${p} 1`,
              }}
            />
          </React.Fragment>
        );
      })}
      {jours.map((j, i) => {
        const p = prog(f, at + 6 + i * 2, at + 30 + i * 2, EASE_IO);
        return (
          <div
            key={`v${j}`}
            style={{
              position: "absolute",
              left: gx + i * cw,
              top: gy,
              width: 2,
              height: h - gy,
              background: blancA(0.07),
              transformOrigin: "top",
              scale: `1 ${p}`,
            }}
          />
        );
      })}
      {creneaux.map((c, i) => {
        const p = prog(f, c.at, c.at + 12, EASE);
        if (p <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: gx + c.j * cw + 6,
              top: gy + ((c.h0 - 8) / 2) * ch + 4,
              width: cw - 12,
              height: ((c.h1 - c.h0) / 2) * ch - 8,
              borderRadius: 10,
              background: `linear-gradient(160deg, ${C.rouge}, ${C.rougeMoyen})`,
              scale: `${0.6 + 0.4 * p}`,
              opacity: p,
              padding: "10px 12px",
              fontWeight: 800,
              fontSize: 20,
              color: C.blanc,
              overflow: "hidden",
            }}
          >
            {c.label}
          </div>
        );
      })}
      {sx >= 0 && sx < 1 ? (
        <div
          style={{
            position: "absolute",
            left: gx + sx * (w - gx),
            top: gy - 10,
            width: 4,
            height: h - gy + 10,
            background: `linear-gradient(180deg, ${rougeA(0)}, ${C.rouge}, ${rougeA(0)})`,
          }}
        />
      ) : null}
    </div>
  );
};

// ── Carte numérotée (01, 02, 03…) : la colonne vertébrale des listes du script.
export const CarteNum: React.FC<{
  num: string;
  titre: string;
  sous?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  fin?: number;
  actif?: number; // frame à partir de laquelle la carte est mise en avant
  eteint?: number; // frame à partir de laquelle elle redescend
  icone?: React.ReactNode;
}> = ({ num, titre, sous, x, y, w, h, at, fin, actif, eteint, icone }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 18, EASE);
  const o = fin !== undefined ? prog(f, fin, fin + 12, EASE_IN) : 0;
  const a = actif !== undefined ? prog(f, actif, actif + 12, EASE) * (eteint !== undefined ? 1 - prog(f, eteint, eteint + 12, EASE) : 1) : 0;
  if (p <= 0 || o >= 1) return null;
  return (
    <div className="verre"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 22,
        background: `linear-gradient(160deg, rgba(137,4,4,${0.35 + 0.4 * a}) 0%, rgba(39,1,1,0.92) 55%, rgba(13,0,0,0.95) 100%)`,
        border: `2px solid ${a > 0.01 ? rougeA(0.25 + 0.75 * a) : "rgba(245,237,237,0.08)"}`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.55)`,
        opacity: p * (1 - o),
        translate: `0 ${(1 - p) * 60 - a * 14}px`,
        scale: `${1 + a * 0.03}`,
        transform: `perspective(1400px) rotateY(${(1 - p) * 28}deg) rotateX(${(1 - p) * -12}deg)`,
        padding: 40,
        boxSizing: "border-box",
        fontFamily: MONTSERRAT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 96,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            color: "transparent", backgroundImage: "linear-gradient(170deg, #E01E1E 0%, #B00202 45%, #3d0101 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", opacity: 0.55 + 0.45 * a,
          }}
        >
          {num}
        </div>
        {icone}
      </div>
      <div>
        <div style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.blanc }}>{titre}</div>
        {sous ? <div style={{ marginTop: 12, fontWeight: 600, fontSize: 26, lineHeight: 1.25, color: blancA(0.6) }}>{sous}</div> : null}
      </div>
    </div>
  );
};

// ── Barre de progression de la vidéo (« reste jusqu'au bout »).
export const BarreVideo: React.FC<{ at: number; a: number; x: number; y: number; w: number; fin?: number }> = ({ at, a, x, y, w, fin }) => {
  const f = useCurrentFrame();
  const g = prog(f, at - 6, at + 10, EASE);
  const p = prog(f, at, a, EASE_IO);
  const o = fin !== undefined ? prog(f, fin, fin + 10, EASE_IN) : 0;
  if (g <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 60, opacity: g * (1 - o) }}>
      <div style={{ position: "absolute", left: 0, top: 26, width: w, height: 8, borderRadius: 4, background: blancA(0.12) }} />
      <div style={{ position: "absolute", left: 0, top: 26, width: w * p, height: 8, borderRadius: 4, background: C.rouge }} />
      <div
        style={{
          position: "absolute",
          left: w * p - 15,
          top: 15,
          width: 30,
          height: 30,
          rotate: "45deg",
          background: C.blanc,
          boxShadow: `0 0 0 6px ${rougeA(0.35)}`,
        }}
      />
      <div style={{ position: "absolute", right: 0, top: -30, fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: blancA(0.5) }}>
        FIN
      </div>
    </div>
  );
};
