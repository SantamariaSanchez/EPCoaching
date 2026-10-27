import React from "react";
import { cl, E, p, sp } from "./anim";
import { ajuster } from "./mesure";
import { FONT, Rect, TH, Theme } from "./tokens";
import { interpolate } from "remotion";

// Titre kinétique. Syntaxe : lignes séparées par « \n », mot(s) accent entre *astérisques*.
// - chaque lettre monte d'un masque en 3D, floue -> nette, graisse 500 -> 800 en atterrissant
// - le mot accent prend la couleur d'accent + un surligné qui se dessine (clair) ou une lueur (sombre)
// - la taille est calculée pour tenir dans la zone (aucun débordement possible)
export type Style = "lettres" | "mots" | "impact";

type Seg = { t: string; acc: boolean };
// Découpe en lignes et segments ; un accent *…* peut s'étendre sur plusieurs lignes.
const parseTout = (texte: string): Seg[][] => {
  let acc = false;
  return texte.split("\n").map((ligne) => {
    const out: Seg[] = [];
    let cur = "";
    for (const ch of ligne) {
      if (ch === "*") {
        if (cur) out.push({ t: cur, acc });
        cur = "";
        acc = !acc;
      } else cur += ch;
    }
    if (cur) out.push({ t: cur, acc });
    return out;
  });
};

export const Titre: React.FC<{
  texte: string;
  zone: Rect;
  theme: Theme;
  f: number;
  debut?: number;
  sortie?: number; // 0..1
  align?: "left" | "center" | "right";
  v?: "top" | "center" | "bottom";
  max?: number;
  style?: Style;
  pas?: number; // décalage entre lettres (frames)
  surtitre?: string;
  nom?: string;
  italique?: boolean;
}> = ({ texte, zone, theme, f, debut = 0, sortie = 0, align = "left", v = "center", max = 150, style = "lettres", pas, surtitre, nom = "titre", italique = false }) => {
  const th = TH[theme];
  const lignes = parseTout(texte);
  const brut = lignes.map((l) => l.map((s) => s.t).join(""));
  const hSur = surtitre ? 54 : 0;
  const taille = ajuster(brut, zone.w, zone.h - hSur, { max, graisse: 800 });
  const nbLettres = brut.reduce((a, l) => a + l.length, 0);
  const step = pas ?? (style === "mots" ? 0 : Math.max(0.45, Math.min(1.1, 26 / Math.max(1, nbLettres))));
  let idx = 0;
  let mot = 0;
  const sortieL = (i: number) => interpolate(sortie * 1.5 - (i / Math.max(1, nbLettres)) * 0.5, [0, 1], [0, 1], { ...cl, easing: E.in });

  const surOp = surtitre ? p(f, debut - 2, debut + 10) * (1 - p(sortie, 0, 0.6)) : 0;

  return (
    <div
      data-zone={nom}
      style={{
        position: "absolute",
        left: zone.x,
        top: zone.y,
        width: zone.w,
        height: zone.h,
        display: "flex",
        flexDirection: "column",
        justifyContent: v === "top" ? "flex-start" : v === "bottom" ? "flex-end" : "center",
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        pointerEvents: "none",
      }}
    >
      {surtitre ? (
        <div
          data-texte
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: th.accentTexte,
            height: hSur,
            opacity: surOp,
            translate: `${(1 - surOp) * -24}px 0`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ width: 44 * surOp, height: 3, background: th.accent, display: "inline-block", borderRadius: 2 }} />
          {surtitre}
        </div>
      ) : null}
      <div
        data-texte
        style={{
          fontFamily: FONT,
          fontStyle: italique ? "italic" : "normal",
          fontSize: taille,
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
          color: th.encre,
          textAlign: align,
          perspective: 900,
          whiteSpace: "pre",
        }}
      >
        {lignes.map((segs, li) => (
          <div key={li} style={{ display: "block", whiteSpace: "pre" }}>
            {segs.map((s, si) => {
              const lettres = [...s.t].map((ch) => {
                const i = idx++;
                if (ch === " ") mot++;
                const at = debut + (style === "mots" ? mot * 2.2 : i * step);
                const t = sp(f, at, style === "impact" ? "rebond" : "vif");
                const o = Math.min(1, t * 1.8) * (1 - sortieL(i));
                const e = sortieL(i);
                const graisse = Math.round(interpolate(t, [0, 1], [500, 800], cl));
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      whiteSpace: "pre",
                      fontWeight: graisse,
                      opacity: o,
                      transformOrigin: "50% 100%",
                      translate: `0 ${(1 - t) * 0.55 * taille - e * 0.35 * taille}px`,
                      rotate: style === "impact" ? `${(1 - t) * -8}deg` : undefined,
                      transform: style === "impact" ? `scale(${1 + (1 - t) * 0.6})` : `rotateX(${(1 - t) * -75}deg)`,
                      filter: `blur(${Math.max(0, (1 - t) * 9 + e * 10).toFixed(2)}px)`,
                    }}
                  >
                    {ch}
                  </span>
                );
              });
              if (!s.acc) return <React.Fragment key={si}>{lettres}</React.Fragment>;
              // Mot accent : couleur + surligné qui se dessine après l'arrivée du mot.
              const finMot = debut + (idx - 1) * step + 6;
              const trait = p(f, finMot, finMot + 12, E.out) * (1 - p(sortie, 0, 0.5, E.in));
              return (
                <span key={si} style={{ position: "relative", display: "inline-block", color: th.accent, whiteSpace: "pre" }}>
                  {theme === "clair" ? (
                    <span
                      style={{
                        position: "absolute",
                        left: "-0.04em",
                        right: "-0.04em",
                        bottom: "0.04em",
                        height: "0.26em",
                        background: "rgba(215, 21, 28, 0.16)",
                        transformOrigin: "0 50%",
                        scale: `${trait} 1`,
                        borderRadius: "0.04em",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "-0.06em",
                        height: Math.max(3, taille * 0.045),
                        background: th.accent,
                        boxShadow: `0 0 18px ${th.lueur}`,
                        transformOrigin: "0 50%",
                        scale: `${trait} 1`,
                        borderRadius: 4,
                      }}
                    />
                  )}
                  <span
                    style={{
                      position: "relative",
                      textShadow: theme === "sombre" ? `0 0 ${24 * trait}px rgba(255, 60, 48, ${0.45 * trait})` : undefined,
                    }}
                  >
                    {lettres}
                  </span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
