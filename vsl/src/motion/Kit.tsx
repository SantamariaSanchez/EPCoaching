import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { evolvePath } from "@remotion/paths";
import { cl, E, logZoom, p, sp } from "./anim";
import { FONT, ROUGE, TH, Theme } from "./tokens";

// ── Entrées 3D (ressort + profondeur de champ : flou tant que l'objet n'est pas au plan net).
export type Depuis = "profondeur" | "bas" | "haut" | "droite" | "gauche" | "chute" | "aucune";
export const entree = (f: number, at: number, depuis: Depuis, ressort: "vif" | "souple" | "lourd" | "rebond" = "souple") => {
  const t = sp(f, at, ressort);
  const t1 = 1 - t;
  // vitesse (pour le flou de mouvement directionnel)
  const v = sp(f + 0.5, at, ressort) - sp(f - 0.5, at, ressort);
  switch (depuis) {
    case "profondeur":
      return { t, tf: `translate3d(0, ${t1 * 120}px, ${t1 * -900}px) rotateX(${t1 * 28}deg)`, flou: t1 * 14, op: Math.min(1, t * 2.2), vx: 0, vy: v * 120 };
    case "bas":
      return { t, tf: `translate3d(0, ${t1 * 420}px, 0) rotateX(${t1 * -18}deg)`, flou: t1 * 6, op: Math.min(1, t * 2.5), vx: 0, vy: v * 420 };
    case "haut":
      return { t, tf: `translate3d(0, ${t1 * -420}px, 0) rotateX(${t1 * 18}deg)`, flou: t1 * 6, op: Math.min(1, t * 2.5), vx: 0, vy: v * 420 };
    case "droite":
      return { t, tf: `translate3d(${t1 * 520}px, 0, ${t1 * -300}px) rotateY(${t1 * -35}deg)`, flou: t1 * 8, op: Math.min(1, t * 2.5), vx: v * 520, vy: 0 };
    case "gauche":
      return { t, tf: `translate3d(${t1 * -520}px, 0, ${t1 * -300}px) rotateY(${t1 * 35}deg)`, flou: t1 * 8, op: Math.min(1, t * 2.5), vx: v * 520, vy: 0 };
    case "chute":
      return { t, tf: `translate3d(0, ${t1 * -900}px, ${t1 * 200}px) rotateZ(${t1 * 14}deg) rotateX(${t1 * 30}deg)`, flou: t1 * 4, op: Math.min(1, t * 4), vx: 0, vy: v * 900 };
    default:
      return { t: 1, tf: "", flou: 0, op: 1, vx: 0, vy: 0 };
  }
};

// Flou de mouvement directionnel (SVG) : une traînée dans l'axe de la vitesse, sans surcoût de rendu.
export const FlouMouvement: React.FC<{ id: string; vx: number; vy: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  id,
  vx,
  vy,
  children,
  style,
}) => {
  const sx = Math.min(30, Math.abs(vx) * 0.35);
  const sy = Math.min(30, Math.abs(vy) * 0.35);
  const actif = sx > 0.4 || sy > 0.4;
  return (
    <div style={{ ...style, filter: actif ? `url(#${id})` : style?.filter }}>
      {actif ? (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
          </filter>
        </svg>
      ) : null}
      {children}
    </div>
  );
};

// Sortie générique (ease-in) : monte, se floute, s'efface.
export const styleSortie = (s: number, dir: "haut" | "bas" | "gauche" | "droite" | "fond" = "haut"): React.CSSProperties => {
  if (s <= 0) return {};
  const e = interpolate(s, [0, 1], [0, 1], { ...cl, easing: E.in });
  const tr =
    dir === "haut" ? `0 ${-60 * e}px` : dir === "bas" ? `0 ${60 * e}px` : dir === "gauche" ? `${-90 * e}px 0` : dir === "droite" ? `${90 * e}px 0` : "0 0";
  return { opacity: 1 - e, translate: tr, scale: dir === "fond" ? `${1 - 0.12 * e}` : `${1 - 0.04 * e}`, filter: `blur(${10 * e}px)` };
};

// ── Carte (surface) : blanche et ombrée sur clair, verre sombre à liseré lumineux sur sombre.
export const Carte: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  f: number;
  at?: number;
  depuis?: Depuis;
  ressort?: "vif" | "souple" | "lourd" | "rebond";
  theme: Theme;
  rx?: number;
  ry?: number;
  rz?: number;
  rayon?: number;
  nom?: string;
  bloc?: boolean;
  fondu?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  sortie?: number;
  pad?: number;
}> = ({ x, y, w, h, f, at = 0, depuis = "profondeur", ressort = "souple", theme, rx = 0, ry = 0, rz = 0, rayon = 28, nom, bloc = true, children, style, sortie = 0, pad = 0 }) => {
  const th = TH[theme];
  const en = entree(f, at, depuis, ressort);
  const id = `mb-${nom ?? "c"}-${x}-${y}`;
  const so = styleSortie(sortie, "fond");
  return (
    <div
      data-zone={nom}
      style={{ position: "absolute", left: x, top: y, width: w, height: h, perspective: 1600, pointerEvents: "none", ...so }}
    >
      <FlouMouvement
        id={id}
        vx={en.vx}
        vy={en.vy}
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `${en.tf} rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
          opacity: en.op,
        }}
      >
        <div
          data-bloc={bloc ? "" : undefined}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: rayon,
            background:
              theme === "clair"
                ? th.carte
                : "linear-gradient(160deg, rgba(48, 14, 12, 0.92) 0%, rgba(22, 6, 6, 0.94) 55%, rgba(14, 4, 4, 0.96) 100%)",
            boxShadow:
              theme === "clair"
                ? th.ombre
                : "0 40px 90px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255, 140, 120, 0.22), 0 0 0 1px rgba(255, 90, 80, 0.18), 0 0 60px -10px rgba(255, 50, 40, 0.18)",
            overflow: "hidden",
            filter: en.flou > 0.3 ? `blur(${en.flou.toFixed(2)}px)` : undefined,
            padding: pad,
            boxSizing: "border-box",
            ...style,
          }}
        >
          {children}
        </div>
      </FlouMouvement>
    </div>
  );
};

// ── Photo réelle dans une carte, avec zoom lent (Ken Burns en espace log).
export const Photo: React.FC<{ src: string; f: number; d: number; pos?: string; zoom?: [number, number]; style?: React.CSSProperties }> = ({
  src,
  f,
  d,
  pos = "50% 40%",
  zoom = [1.12, 1.0],
  style,
}) => (
  <Img
    src={staticFile(`img/${src}`)}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: pos,
      scale: `${logZoom(Math.min(1, Math.max(0, f / Math.max(1, d))), zoom[0], zoom[1])}`,
      ...style,
    }}
  />
);

// ── Pastille lumineuse (référence 2) : capsule à contour incandescent, icône + valeur.
export const Pastille: React.FC<{
  x: number;
  y: number;
  f: number;
  at: number;
  theme: Theme;
  valeur: React.ReactNode;
  icone?: React.ReactNode;
  legende?: string;
  allume?: number; // 0..1 intensité de la lueur
  taille?: number;
  nom?: string;
  sortie?: number;
}> = ({ x, y, f, at, theme, valeur, icone, legende, allume = 1, taille = 1, nom, sortie = 0 }) => {
  const t = sp(f, at, "rebond");
  const th = TH[theme];
  const h = 92 * taille;
  const so = styleSortie(sortie, "fond");
  return (
    <div data-zone={nom} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * t})`, opacity: Math.min(1, t * 2), ...so }}>
      <div
        data-bloc
        style={{
          height: h,
          padding: `0 ${30 * taille}px`,
          borderRadius: h,
          display: "flex",
          alignItems: "center",
          gap: 14 * taille,
          background: theme === "sombre" ? "linear-gradient(180deg, #2A0B09 0%, #160505 100%)" : "#FFFFFF",
          boxShadow:
            theme === "sombre"
              ? `0 0 0 ${3 * taille}px rgba(255, 74, 61, ${0.35 + 0.65 * allume}), 0 0 ${40 * allume * taille}px rgba(255, 60, 48, ${0.55 * allume}), inset 0 0 ${24 * taille}px rgba(255, 60, 48, ${0.25 * allume})`
              : `0 0 0 ${3 * taille}px rgba(215, 21, 28, ${0.25 + 0.75 * allume}), 0 18px 40px -14px rgba(80, 10, 10, 0.35)`,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 50 * taille,
          color: th.encre,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {icone}
        <span>{valeur}</span>
      </div>
      {legende ? (
        <div
          data-texte
          style={{
            marginTop: 14 * taille,
            textAlign: "center",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 30 * taille,
            color: theme === "sombre" ? th.encre : th.encre,
            opacity: p(f, at + 6, at + 16),
            whiteSpace: "nowrap",
          }}
        >
          {legende}
        </div>
      ) : null}
    </div>
  );
};

// ── Compteur : chiffres qui défilent (ease-out), largeur fixe (chiffres tabulaires).
export const compte = (f: number, at: number, duree: number, de: number, a: number, dec = 0) => {
  const v = interpolate(f, [at, at + duree], [de, a], { ...cl, easing: E.outDoux });
  return v.toFixed(dec).replace(".", ",");
};

// ── Ligne lumineuse qui se trace (SVG path), avec halo.
export const LigneLumineuse: React.FC<{ d: string; prog: number; theme: Theme; epaisseur?: number; style?: React.CSSProperties }> = ({
  d,
  prog,
  theme,
  epaisseur = 4,
  style,
}) => {
  const ev = evolvePath(Math.max(0.0001, Math.min(1, prog)), d);
  const c = TH[theme].accent;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}>
      {theme === "sombre" ? (
        <path d={d} fill="none" stroke={c} strokeWidth={epaisseur * 4} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} opacity={0.25} style={{ filter: "blur(8px)" }} />
      ) : null}
      <path d={d} fill="none" stroke={c} strokeWidth={epaisseur} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
    </svg>
  );
};

// ── Coche qui se dessine / croix.
export const Coche: React.FC<{ taille: number; prog: number; couleur?: string; fond?: string }> = ({ taille, prog, couleur = "#fff", fond = ROUGE }) => {
  const ev = evolvePath(Math.max(0.0001, p(prog, 0.3, 1)), "M6 12.5l4 4 8-9");
  const s = sp(prog * 20, 0, "rebond");
  return (
    <div style={{ width: taille, height: taille, borderRadius: taille, background: fond, display: "flex", alignItems: "center", justifyContent: "center", scale: `${s}`, flexShrink: 0 }}>
      <svg width={taille * 0.7} height={taille * 0.7} viewBox="0 0 24 24">
        <path d="M6 12.5l4 4 8-9" fill="none" stroke={couleur} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
      </svg>
    </div>
  );
};

export const Croix: React.FC<{ taille: number; prog: number; couleur?: string }> = ({ taille, prog, couleur = ROUGE }) => {
  const a = evolvePath(Math.max(0.0001, p(prog, 0, 0.55)), "M5 5L19 19");
  const b = evolvePath(Math.max(0.0001, p(prog, 0.45, 1)), "M19 5L5 19");
  return (
    <svg width={taille} height={taille} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d="M5 5L19 19" stroke={couleur} strokeWidth={3} strokeLinecap="round" strokeDasharray={a.strokeDasharray} strokeDashoffset={a.strokeDashoffset} />
      <path d="M19 5L5 19" stroke={couleur} strokeWidth={3} strokeLinecap="round" strokeDasharray={b.strokeDasharray} strokeDashoffset={b.strokeDashoffset} />
    </svg>
  );
};

// ── Curseur (flèche) qui glisse entre des points, avec onde au clic.
export const Curseur: React.FC<{ f: number; points: { at: number; x: number; y: number; clic?: boolean }[]; theme: Theme }> = ({ f, points, theme }) => {
  if (!points.length || f < points[0].at - 6) return null;
  let x = points[0].x;
  let y = points[0].y;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const t = p(f, a.at, b.at, E.inOut);
    if (f >= a.at) {
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t;
    }
  }
  const op = p(f, points[0].at - 6, points[0].at);
  const clic = points.filter((q) => q.clic).map((q) => q.at);
  const dernierClic = clic.filter((c) => c <= f).pop();
  const k = dernierClic !== undefined ? p(f, dernierClic, dernierClic + 14) : 1;
  const press = dernierClic !== undefined ? 1 - 0.18 * Math.sin(Math.min(1, (f - dernierClic) / 6) * Math.PI) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, zIndex: 40, pointerEvents: "none" }}>
      {dernierClic !== undefined && k < 1 ? (
        <div
          style={{
            position: "absolute",
            left: -40,
            top: -40,
            width: 80,
            height: 80,
            borderRadius: 80,
            border: `3px solid ${TH[theme].accent}`,
            opacity: 1 - k,
            scale: `${0.3 + k * 1.2}`,
          }}
        />
      ) : null}
      <svg width={44} height={52} viewBox="0 0 22 26" style={{ scale: `${press}`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))" }}>
        <path d="M2 2 L2 21 L7 16.5 L10.5 24 L14 22.5 L10.6 15 L17.5 15 Z" fill={theme === "clair" ? "#170808" : "#FBF3F1"} stroke={theme === "clair" ? "#fff" : "#170808"} strokeWidth={1.5} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ── Texte courant (UI) : petit, net, jamais animé lettre à lettre.
export const Txt: React.FC<{ children: React.ReactNode; taille?: number; graisse?: number; couleur?: string; style?: React.CSSProperties }> = ({
  children,
  taille = 28,
  graisse = 600,
  couleur,
  style,
}) => (
  <div style={{ fontFamily: FONT, fontSize: taille, fontWeight: graisse, color: couleur, lineHeight: 1.15, whiteSpace: "nowrap", ...style }}>{children}</div>
);
