import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, MONTSERRAT } from "../lib/brand";
import { FPS } from "../lib/resolve";
import { EASE, EASE_IN, Layout, TEXTE, clamp, prog, useScene } from "../lib/scene";

// Mots clés en surimpression : seuls les mots clés du script (script/mise-en-valeur.json)
// apparaissent à l'écran, en grande capitale, au moment exact où ils sont dits.
// Le texte complet vit dans les sous-titres (.vtt) ; l'image porte le reste.

const KMAX: Record<Layout, number> = {
  plein: 230,
  centre: 210,
  gauche: 158,
  droite: 158,
  haut: 128,
  bas: 120,
  pied: 96,
};
const LS = -0.035;
const LH = 0.98;

const largeur = (ch: string) => {
  if (ch === " " || ch === " ") return 0.28;
  if (/[.,;:!'’]/.test(ch)) return 0.28;
  if (/[?]/.test(ch)) return 0.62;
  if (/[MW]/.test(ch)) return 1.0;
  if (/[I]/.test(ch)) return 0.34;
  if (/[0-9]/.test(ch)) return 0.7;
  return 0.78;
};
const mesure = (mot: string) => [...mot].reduce((a, c) => a + largeur(c) + LS, 0);
const lignes = (texte: string, size: number, w: number) => {
  let n = 1;
  let x = 0;
  for (const m of texte.split(" ")) {
    const mw = mesure(m) * size * 1.05;
    const sp = 0.28 * size;
    if (x > 0 && x + sp + mw > w) {
      n++;
      x = mw;
    } else x += (x > 0 ? sp : 0) + mw;
  }
  return n;
};
const taille = (kws: string[], z: { w: number; h: number }, max: number) => {
  for (let size = max; size >= 40; size -= 2) {
    const gap = size * 0.2;
    // Le mot le plus long doit tenir seul sur une ligne.
    const tropLarge = kws.some((k) => k.split(" ").some((m) => mesure(m) * size * 1.05 > z.w));
    const h = kws.reduce((a, k) => a + lignes(k, size, z.w) * size * LH, 0) + gap * (kws.length - 1);
    if (!tropLarge && h <= z.h) return size;
  }
  return 40;
};

type MotCle = { texte: string; s: number; e: number; mots: { t: string; s: number }[] };

const nettoie = (t: string) => t.replace(/^[«\s ]+/, "").replace(/[\s ]*[,;:.»]+$/, "");

export const KineticText: React.FC<{ layoutAt: (frame: number) => Layout }> = ({ layoutAt }) => {
  const frame = useCurrentFrame();
  const sc = useScene();
  const out: React.ReactNode[] = [];

  const pages = sc.pages.map((idx) => {
    const blocs = idx.map((i) => sc.blocs[i]);
    const kws: MotCle[] = [];
    for (const b of blocs) {
      let run: { t: string; s: number }[] = [];
      const push = () => {
        if (!run.length) return;
        const texte = nettoie(run.map((r) => r.t).join(" ")).toUpperCase();
        kws.push({ texte, s: run[0].s, e: run[run.length - 1].s, mots: run });
        run = [];
      };
      for (const m of b.mots) {
        if (m.em) run.push({ t: m.t, s: m.s });
        else push();
      }
      push();
    }
    return { debut: blocs[0].s, kws };
  });

  pages.forEach((pg, p) => {
    if (!pg.kws.length) return;
    const debut = Math.round(pg.kws[0].s * FPS);
    const suivante = (() => {
      for (let q = p + 1; q < pages.length; q++) if (pages[q].kws.length) return Math.round(pages[q].kws[0].s * FPS);
      return 1e7;
    })();
    // Le mot clé reste jusqu'au suivant (6 s au plus), pour ne jamais laisser le cadre à moitié vide.
    const layout = layoutAt(Math.round(pg.debut * FPS));
    // …et jamais au-delà d'un changement de mise en page (l'image prendrait sa place).
    let rupture = 1e7;
    for (let q = p + 1; q < pages.length; q++) {
      const fq = Math.round(pages[q].debut * FPS);
      if (layoutAt(fq) !== layout) {
        rupture = fq;
        break;
      }
    }
    const finPage = Math.min(suivante - 4, rupture - 6, Math.round((pg.kws[pg.kws.length - 1].s + 6) * FPS));
    if (frame < debut - 4 || frame > finPage + 14) return;
    const z = TEXTE[layout];
    const size = taille(
      pg.kws.map((k) => k.texte),
      z,
      KMAX[layout],
    );
    out.push(
      <div
        key={p}
        style={{
          position: "absolute",
          left: z.x,
          top: z.y,
          width: z.w,
          height: z.h,
          display: "flex",
          flexDirection: "column",
          justifyContent: z.v === "center" ? "center" : z.v === "end" ? "flex-end" : "flex-start",
          alignItems: z.align === "center" ? "center" : "flex-start",
          textAlign: z.align,
          gap: size * 0.2,
          fontFamily: MONTSERRAT,
          fontWeight: 900,
          fontSize: size,
          lineHeight: LH,
          letterSpacing: `${LS}em`,
        }}
      >
        {pg.kws.map((k, ki) => {
          const s0 = Math.round(k.s * FPS) - 3;
          const suivantKw = ki < pg.kws.length - 1 ? Math.round(pg.kws[ki + 1].s * FPS) - 3 : 1e7;
          // Le mot clé précédent passe au trait quand le suivant arrive.
          const trait = interpolate(frame, [suivantKw, suivantKw + 10], [0, 1], clamp);
          const barre = prog(frame, s0 + 4, s0 + 16, EASE) * (1 - trait) * (1 - prog(frame, finPage - 6, finPage + 4, EASE_IN));
          let lettre = 0;
          return (
            <div key={ki} style={{ position: "relative", display: "inline-block", maxWidth: z.w }}>
              {/* Lame rouge sous le mot clé : une surface, pas un soulignement fin. */}
              <div
                style={{
                  position: "absolute",
                  left: "-0.06em",
                  right: "-0.06em",
                  bottom: "0.02em",
                  height: "0.3em",
                  background: `linear-gradient(90deg, ${C.rougeMoyen}, ${C.rouge} 60%, rgba(224,30,30,0.6))`,
                  transformOrigin: "left center",
                  scale: `${barre} 1`,
                  opacity: 0.85,
                }}
              />
              <span style={{ position: "relative" }}>
                {k.texte.split(" ").map((mot, mi, arr) => (
                  <React.Fragment key={mi}>
                    <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                      {[...mot].map((ch, ci) => {
                        const i = lettre++;
                        const pIn = prog(frame, s0 + i * 0.9, s0 + i * 0.9 + 12, EASE);
                        const pOut = prog(frame, finPage - 4 + i * 0.5, finPage + 6 + i * 0.5, EASE_IN);
                        return (
                          <span
                            key={ci}
                            style={{
                              display: "inline-block",
                              overflow: "hidden",
                              verticalAlign: "top",
                              paddingBottom: "0.1em",
                              marginBottom: "-0.1em",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                translate: `0 ${(1 - pIn) * 110 - pOut * 110}%`,
                                rotate: `${(1 - pIn) * 8}deg`,
                                // Le mot clé précédent s'efface en rouge sombre (pas de contour : la police en a des chevauchements).
                                color: `rgb(${245 - 108 * trait}, ${237 - 233 * trait}, ${237 - 233 * trait})`,
                                opacity: 1 - 0.45 * trait,
                              }}
                            >
                              {ch}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                    {mi < arr.length - 1 ? " " : null}
                  </React.Fragment>
                ))}
              </span>
            </div>
          );
        })}
      </div>,
    );
  });

  return <AbsoluteFill style={{ pointerEvents: "none" }}>{out}</AbsoluteFill>;
};
