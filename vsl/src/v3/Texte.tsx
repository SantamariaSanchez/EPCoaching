import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONTSERRAT, blancA } from "../lib/brand";
import { FPS, SceneResolue } from "../lib/resolve";
import { ease, pop } from "./core";

// Typographie cinétique calée mot à mot sur la voix (v3.1, 2026-11-17).
// - Chaque mot sort d'un masque (glisse depuis le bas de sa ligne), comme les titres modernes.
// - Les pages très courtes passent en « slam » : énormes, centrées, chaque mot claque.
// - Les mots clés prennent un dégradé rouge-rose et un léger rebond.
// - Coupe franche d'une page à l'autre, avec un petit zoom d'impact.

const ANTICIPE = 2;

export const pageActive = (sc: SceneResolue, f: number) => {
  let idx = 0;
  sc.pages.forEach((p, i) => {
    if (sc.blocs[p[0]].s * FPS - ANTICIPE <= f) idx = i;
  });
  return idx;
};

export const debutPage = (sc: SceneResolue, i: number) => sc.blocs[sc.pages[i][0]].s * FPS - ANTICIPE;

export const TexteCinetique: React.FC<{ scene: SceneResolue; zone: "plein" | "gauche" }> = ({ scene, zone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pi = pageActive(scene, frame);
  const blocs = scene.pages[pi].map((i) => scene.blocs[i]);
  const debut = debutPage(scene, pi);
  const mots = blocs.flatMap((b) => b.mots);
  const chars = blocs.reduce((n, b) => n + b.texte.length, 0);
  const plein = zone === "plein";
  const slam = plein && chars <= 26;
  const base = slam
    ? chars < 12 ? 190 : 150
    : plein
      ? chars < 45 ? 112 : chars < 75 ? 90 : 74
      : chars < 30 ? 92 : chars < 60 ? 74 : 60;
  const impact = pop(frame, fps, debut, 7);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: plein ? 140 : 110,
        width: plein ? 1640 : 860,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: plein ? "center" : "flex-start",
        textAlign: plein ? "center" : "left",
        transform: `scale(${1.06 - 0.06 * impact})`,
      }}
    >
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: base, lineHeight: 1.04, letterSpacing: -base * 0.035, color: C.blanc }}>
        {mots.map((m, k) => {
          const t = m.s * FPS - ANTICIPE;
          const dit = frame >= t;
          const p = ease(frame, t, t + (slam ? 7 : 6));
          const rebond = m.em ? pop(frame, fps, t, 9) : 1;
          const scaleSlam = slam ? 1.8 - 0.8 * pop(frame, fps, t, 8) : 1;
          return (
            <span key={k} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: base * 0.08, marginRight: base * 0.22 }}>
              <span
                style={{
                  display: "inline-block",
                  opacity: dit ? 1 : 0,
                  transform: `translateY(${(1 - p) * 105}%) scale(${(m.em ? 1.12 - 0.12 * rebond : 1) * scaleSlam})`,
                  transformOrigin: "50% 80%",
                  ...(m.em
                    ? { background: `linear-gradient(100deg, ${C.rouge} 0%, #FF5A5A 45%, #FDC4C4 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                    : { color: C.blanc }),
                }}
              >
                {m.t}
              </span>
            </span>
          );
        })}
      </div>
      {slam && (
        <div style={{ marginTop: 30, height: 8, width: 220 * ease(frame, debut + 4, debut + 16), borderRadius: 8, background: `linear-gradient(90deg, ${C.rouge}, #FDC4C4)` }} />
      )}
      {!slam && blocs.length > 0 && (
        <div style={{ marginTop: 26, height: 5, width: 120 * ease(frame, debut, debut + 12), borderRadius: 5, background: blancA(0.25) }} />
      )}
    </div>
  );
};

// v3.2 (2026-11-17, retour d'Emmanuel : « trop verbeux », « double sous-titre ») :
// on n'écrit plus la narration. Seuls les mots clés de la page (mise-en-valeur.json)
// apparaissent, en grand, au moment exact où ils sont dits. Pas de mot clé : rien.
export const MotsCles: React.FC<{ scene: SceneResolue }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pi = pageActive(scene, frame);
  const mots = scene.pages[pi].flatMap((i) => scene.blocs[i].mots);
  // Regroupe les mots clés consécutifs en expressions (« perdre du gras »).
  const groupes: (typeof mots)[] = [];
  mots.forEach((m, k) => {
    if (!m.em) return;
    if (k > 0 && mots[k - 1].em && groupes.length) groupes[groupes.length - 1].push(m);
    else groupes.push([m]);
  });
  if (!groupes.length) return null;
  const longueur = groupes.reduce((n, g) => n + g.map((m) => m.t).join(" ").length, 0);
  const base = longueur < 10 ? 210 : longueur < 18 ? 170 : longueur < 28 ? 130 : 104;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: base * 0.12, padding: "0 140px", textAlign: "center" }}>
      {groupes.map((g, gi) => {
        const t = g[0].s * FPS - ANTICIPE;
        if (frame < t) return null;
        const p = pop(frame, fps, t, 8);
        return (
          <div key={gi} style={{ overflow: "hidden", paddingBottom: base * 0.08 }}>
            <div
              style={{
                fontFamily: MONTSERRAT,
                fontWeight: 900,
                fontSize: base,
                lineHeight: 1,
                letterSpacing: -base * 0.04,
                transform: `translateY(${(1 - ease(frame, t, t + 7)) * 100}%) scale(${1.25 - 0.25 * p})`,
                background: gi % 2 === 0 ? `linear-gradient(100deg, ${C.blanc} 0%, #FDC4C4 100%)` : `linear-gradient(100deg, ${C.rouge} 0%, #FF5A5A 50%, #FDC4C4 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {g.map((m) => m.t).join(" ")}
            </div>
          </div>
        );
      })}
    </div>
  );
};
