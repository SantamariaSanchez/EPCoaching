import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONTSERRAT, blancA } from "../lib/brand";
import { FPS, SceneResolue } from "../lib/resolve";
import { pop } from "./core";

// Typographie cinétique calée mot à mot sur la voix.
// Une « page » (groupe de blocs, calculé par npm run timeline) à la fois : coupe franche
// d'une page à l'autre, chaque mot arrive au moment exact où il est dit.

const ANTICIPE = 2; // le mot apparaît 2 images avant d'être dit (perçu « en même temps »)

export const pageActive = (sc: SceneResolue, f: number) => {
  let idx = 0;
  sc.pages.forEach((p, i) => {
    if (sc.blocs[p[0]].s * FPS - ANTICIPE <= f) idx = i;
  });
  return idx;
};

export const TexteCinetique: React.FC<{ scene: SceneResolue; zone: "plein" | "gauche"; offset?: number }> = ({ scene, zone, offset = 0 }) => {
  const frame = useCurrentFrame() + offset;
  const { fps } = useVideoConfig();
  const pi = pageActive(scene, frame);
  const page = scene.pages[pi];
  const blocs = page.map((i) => scene.blocs[i]);
  const debut = blocs[0].s * FPS - ANTICIPE;
  const chars = blocs.reduce((n, b) => n + b.texte.length, 0);
  const plein = zone === "plein";
  // Taille selon la longueur de la page : gros quand c'est court (impact), lisible quand c'est long.
  const base = plein ? (chars < 28 ? 132 : chars < 55 ? 104 : chars < 85 ? 84 : 70) : chars < 30 ? 92 : chars < 60 ? 74 : 60;
  const entree = pop(frame, fps, debut, 6);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: plein ? 160 : 110,
        width: plein ? 1600 : 860,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: plein ? "center" : "flex-start",
        textAlign: plein ? "center" : "left",
        transform: `scale(${1.04 - 0.04 * entree})`,
      }}
    >
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 900, fontSize: base, lineHeight: 1.08, letterSpacing: -base * 0.03, color: C.blanc }}>
        {blocs.map((b) => (
          <span key={b.id}>
            {b.mots.map((m, k) => {
              const t = m.s * FPS - ANTICIPE;
              const p = pop(frame, fps, t, 6);
              const dit = frame >= t;
              const surligne = m.em ? pop(frame, fps, t + 2, 7) : 0;
              return (
                <span key={k} style={{ display: "inline-block", position: "relative", marginRight: base * 0.24, opacity: dit ? 1 : 0.0, transform: `translateY(${(1 - p) * base * 0.35}px)` }}>
                  {m.em && (
                    <span
                      style={{
                        position: "absolute",
                        left: -base * 0.08,
                        right: -base * 0.08,
                        top: "12%",
                        bottom: "6%",
                        background: C.rouge,
                        transformOrigin: "left center",
                        transform: `scaleX(${surligne}) skewX(-8deg)`,
                        zIndex: 0,
                      }}
                    />
                  )}
                  <span style={{ position: "relative", zIndex: 1, color: m.em ? C.blanc : dit ? C.blanc : blancA(0.2) }}>{m.t}</span>
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
};
