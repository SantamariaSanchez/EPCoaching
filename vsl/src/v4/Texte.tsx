import React from "react";
import { useCurrentFrame } from "remotion";
import { C, MONTSERRAT, blancA, rougeA } from "../lib/brand";
import { FPS, SceneResolue } from "../lib/resolve";

// VSL v4 (17/11/2026) : typographie cinétique toujours à l'écran, calée mot à mot sur la voix.
// Chaque mot sort de son masque (glisse depuis le bas + légère rotation), les mots clés
// prennent un bloc rouge qui se déroule derrière eux. Deux tailles :
// - « bandeau » sous un visuel (le texte porte le message même sans le son),
// - « plein » quand la scène n'a pas de visuel : énorme, centré, chaque mot claque.

const ANTICIPE = 2;
const easeOut = (x: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 4);

export const pageActive = (sc: SceneResolue, f: number) => {
  let idx = 0;
  sc.pages.forEach((p, i) => {
    if (sc.blocs[p[0]].s * FPS - ANTICIPE <= f) idx = i;
  });
  return idx;
};
export const debutPage = (sc: SceneResolue, i: number) => sc.blocs[sc.pages[i][0]].s * FPS - ANTICIPE;

export const Typo: React.FC<{ scene: SceneResolue; mode: "bandeau" | "plein" }> = ({ scene, mode }) => {
  const f = useCurrentFrame();
  const pi = pageActive(scene, f);
  const blocs = scene.pages[pi].map((i) => scene.blocs[i]);
  const mots = blocs.flatMap((b) => b.mots);
  const chars = blocs.reduce((n, b) => n + b.texte.length, 0);
  const plein = mode === "plein";
  const taille = plein ? (chars < 16 ? 200 : chars < 34 ? 150 : chars < 60 ? 118 : 96) : chars < 40 ? 78 : chars < 75 ? 64 : 54;
  // Sortie de page : la ligne précédente part vers le haut pendant que la nouvelle monte.
  const debut = debutPage(scene, pi);
  const entreePage = easeOut((f - debut) / 8);
  const finPage = pi + 1 < scene.pages.length ? debutPage(scene, pi + 1) : scene.dureeFrames;
  const avance = Math.max(0, Math.min(1, (f - debut) / Math.max(1, finPage - debut)));
  return (
    <div
      style={{
        position: "absolute",
        left: plein ? 150 : 160,
        right: plein ? 150 : 160,
        top: plein ? 0 : 770,
        bottom: plein ? 0 : 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        textAlign: "left",
        transform: plein
          ? `translateY(${(1 - entreePage) * 40}px) scale(${1 + avance * 0.06})`
          : `translateY(${(1 - entreePage) * 24}px)`,
        transformOrigin: "left center",
      }}
    >
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: taille, lineHeight: 1.08, letterSpacing: -taille * 0.03, color: C.blanc }}>
        {mots.map((m, k) => {
          const t = m.s * FPS - ANTICIPE;
          const d = f - t;
          const e = easeOut(d / 7);
          const actif = d >= 0 && f < m.e * FPS + 4;
          const bloc = m.em ? easeOut((d - 2) / 8) : 0;
          return (
            <span key={k} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", padding: "0.04em 0.06em 0.12em", margin: "0 0.2em -0.12em -0.06em" }}>
              <span
                style={{
                  position: "relative",
                  isolation: "isolate",
                  display: "inline-block",
                  transform: `translateY(${(1 - e) * 110}%) rotate(${(1 - e) * 6}deg) scale(${actif && m.em ? 1.04 : 1})`,
                  transformOrigin: "left bottom",
                  color: d < 0 ? "transparent" : m.em ? C.blanc : actif || plein ? C.blanc : blancA(0.82),
                }}
              >
                {m.em ? (
                  <span
                    style={{
                      position: "absolute",
                      left: -taille * 0.08,
                      right: -taille * 0.08,
                      top: "12%",
                      bottom: "4%",
                      background: `linear-gradient(100deg, ${C.rouge}, ${C.rougeMoyen})`,
                      borderRadius: taille * 0.12,
                      transform: `scaleX(${bloc}) skewX(-8deg)`,
                      transformOrigin: "left center",
                      zIndex: -1,
                      boxShadow: `0 ${taille * 0.1}px ${taille * 0.4}px ${rougeA(0.45 * bloc)}`,
                    }}
                  />
                ) : null}
                {m.t}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
