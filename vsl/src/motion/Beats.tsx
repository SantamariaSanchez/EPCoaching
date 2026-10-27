import React, { useLayoutEffect } from "react";
import { AbsoluteFill, getInputProps, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { E, p } from "./anim";
import { Fond, Grain } from "./Fond";
import { NUIT, ROUGE, TH, Theme, W } from "./tokens";

// Un « temps fort » : un seul focus à l'écran, de `at` jusqu'au temps fort suivant.
export type Ctx = { f: number; d: number; sortie: number; theme: Theme };
export type Beat = {
  at: number;
  theme: Theme;
  nom: string;
  grille?: boolean;
  flou?: boolean; // flou de caméra à sous-images (@remotion/motion-blur) pour les temps forts très rapides
  rendu: (c: Ctx) => React.ReactNode;
  sons?: { at: number; son: string; volume?: number }[]; // `at` relatif au début du temps fort
};

const SORTIE = 8; // frames de sortie (ease-in) avant le temps fort suivant

// ── Rideau de bandes diagonales (référence Pinterest) : chaque bande a un bord d'attaque et un
// bord de fuite ; la dernière (couleur du nouveau monde) couvre 100 % de l'écran de centre-1 à centre+3.
const balayage = (f: number, s: number, duree = 12) => -0.3 * W + 1.6 * W * p(f, s, s + duree, E.inOut);
export const Rideau: React.FC<{ f: number; centre: number; vers: Theme; sens?: 1 | -1 }> = ({ f, centre, vers, sens = 1 }) => {
  const couleurs = vers === "clair" ? [ROUGE, "#F6C9C4", TH.clair.fond] : [ROUGE, NUIT, TH.sombre.fond];
  const plans = [
    { s: centre - 15, fuite: centre - 9 },
    { s: centre - 13, fuite: centre - 3 },
    { s: centre - 11, fuite: centre + 3 },
  ];
  if (f < centre - 16 || f > centre + 17) return null;
  const biais = 150;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 50, transform: sens === -1 ? "scaleX(-1)" : undefined }}>
      {couleurs.map((c, k) => {
        const { s, fuite } = plans[k];
        const att = balayage(f, s);
        const fu = balayage(f, fuite);
        if (att <= fu + 1) return null;
        const v = Math.max(Math.abs(balayage(f + 0.5, s) - balayage(f - 0.5, s)), Math.abs(balayage(f + 0.5, fuite) - balayage(f - 0.5, fuite)));
        const flou = Math.min(28, v * 0.09);
        const id = `rideau-${centre}-${k}`;
        return (
          <React.Fragment key={k}>
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <filter id={id} x="-10%" y="0" width="120%" height="100%">
                <feGaussianBlur stdDeviation={`${flou} 0`} />
              </filter>
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: c,
                clipPath: `polygon(${fu + biais}px 0, ${att + biais}px 0, ${att - biais}px 1080px, ${fu - biais}px 1080px)`,
                filter: flou > 0.5 ? `url(#${id})` : undefined,
              }}
            />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ── Gardien : mesure le DOM à chaque image et signale tout chevauchement de textes/blocs
// ou tout débordement du cadre. Actif avec --props='{"verifier":true}'.
const verifier = () => {
  try {
    return Boolean((getInputProps() as { verifier?: boolean }).verifier);
  } catch {
    return false;
  }
};

type R = { l: number; t: number; r: number; b: number; nom: string };
const inter = (a: R, b: R) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));

const Gardien: React.FC<{ frame: number; scene: string; local: number; reste: number }> = ({ frame, scene, local, reste }) => {
  useLayoutEffect(() => {
    const el = document.querySelector(`[data-racine="${scene}"]`) as HTMLDivElement | null;
    if (!verifier() || !el) return;
    const base = el.getBoundingClientRect();
    // (le scale du rendu passe par deviceScaleFactor : 1 px CSS = 1 px de la compo)
    const k = 1;
    const visibles = (n: Element) => (n as HTMLElement).checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) ?? true;
    const op = (n: Element) => {
      let o = 1;
      let x: Element | null = n;
      while (x && x !== el) {
        o *= Number(getComputedStyle(x).opacity);
        x = x.parentElement;
      }
      return o;
    };
    const rects: R[] = [];
    el.querySelectorAll("[data-zone]").forEach((z) => {
      const nom = z.getAttribute("data-zone") ?? "?";
      const cibles = z.querySelectorAll("[data-texte], [data-bloc]");
      const liste = cibles.length ? Array.from(cibles) : [z];
      let u: R | null = null;
      for (const c of liste) {
        if (!visibles(c) || op(c) < 0.25) continue;
        // union des glyphes réellement visibles
        const spans = c.querySelectorAll("span");
        const parts = c.hasAttribute("data-texte") && spans.length ? Array.from(spans).filter((s) => !s.children.length && s.textContent?.trim()) : [c];
        for (const s of parts) {
          if (op(s) < 0.25) continue;
          const b = s.getBoundingClientRect();
          if (b.width < 1 || b.height < 1) continue;
          const r = { l: (b.left - base.left) / k, t: (b.top - base.top) / k, r: (b.right - base.left) / k, b: (b.bottom - base.top) / k, nom };
          u = u ? { l: Math.min(u.l, r.l), t: Math.min(u.t, r.t), r: Math.max(u.r, r.r), b: Math.max(u.b, r.b), nom } : r;
        }
      }
      if (u) rects.push(u);
    });
    const pbs: string[] = [];
    // hors-cadre : seulement une fois l'entrée finie et avant la sortie (les objets arrivent du hors-champ)
    for (const r of rects) {
      if (local < 16 || reste < 9) break;
      if (r.l < 40 || r.t < 30 || r.r > 1880 || r.b > 1050) pbs.push(`hors-cadre ${r.nom} [${r.l.toFixed(0)},${r.t.toFixed(0)},${r.r.toFixed(0)},${r.b.toFixed(0)}]`);
    }
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        if (rects[i].nom === rects[j].nom) continue; // sous-images du flou de caméra d'un même bloc
        const a = inter(rects[i], rects[j]);
        if (a > 400) pbs.push(`chevauchement ${rects[i].nom} × ${rects[j].nom} (${a.toFixed(0)} px²)`);
      }
    const uniques = [...new Set(pbs)];
    if (uniques.length) console.warn(`[GARDIEN] ${scene} f=${frame} : ${uniques.join(" | ")}`);
    el.querySelectorAll("[data-garde]").forEach((n) => n.remove());
    for (const r of rects) {
      const d = document.createElement("div");
      d.setAttribute("data-garde", "1");
      Object.assign(d.style, {
        position: "absolute",
        left: `${r.l}px`,
        top: `${r.t}px`,
        width: `${r.r - r.l}px`,
        height: `${r.b - r.t}px`,
        outline: pbs.some((x) => x.includes(r.nom)) ? "3px solid #ff00ff" : "1px dashed rgba(0,160,255,0.8)",
        zIndex: "999",
        pointerEvents: "none",
      });
      el.appendChild(d);
    }
  });
  return null;
};

// Sous CameraMotionBlur, l'horloge est relue à l'intérieur (chaque sous-image a son propre temps).
const RenduFlou: React.FC<{ b: Beat; d: number; sortieAvant: boolean }> = ({ b, d, sortieAvant }) => {
  const f = useCurrentFrame() - b.at;
  const sortie = sortieAvant ? p(f, d - SORTIE, d, E.in) : 0;
  return <AbsoluteFill>{b.rendu({ f, d, sortie, theme: b.theme })}</AbsoluteFill>;
};

export const Beats: React.FC<{ beats: Beat[]; total: number; scene: string }> = ({ beats, total, scene }) => {
  const frame = useCurrentFrame();
  const tri = [...beats].sort((a, b) => a.at - b.at);
  let i = 0;
  for (let k = 0; k < tri.length; k++) if (tri[k].at <= frame) i = k;
  const b = tri[i];
  const suivant = tri[i + 1];
  const fin = suivant ? suivant.at : total;
  const f = frame - b.at;
  const d = fin - b.at;
  // Le temps fort suivant change de monde ? Le rideau fait la coupe : pas de sortie animée.
  const rideauApres = suivant && suivant.theme !== b.theme;
  const sortie = suivant && !rideauApres ? p(f, d - SORTIE, d, E.in) : 0;
  // Rideaux : à chaque changement de monde.
  const rideaux = tri
    .map((x, k) => (k > 0 && tri[k - 1].theme !== x.theme ? { at: x.at, vers: x.theme, k } : null))
    .filter(Boolean) as { at: number; vers: Theme; k: number }[];
  return (
    <div data-racine={scene} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Fond theme={b.theme} f={frame} grille={b.grille} />
      <AbsoluteFill key={b.nom + b.at}>
        {b.flou ? (
          <CameraMotionBlur samples={5} shutterAngle={170}>
            <RenduFlou b={b} d={d} sortieAvant={Boolean(suivant && !rideauApres)} />
          </CameraMotionBlur>
        ) : (
          b.rendu({ f, d, sortie, theme: b.theme })
        )}
      </AbsoluteFill>
      <Grain theme={b.theme} />
      {rideaux.map((r) => (
        <Rideau key={r.at} f={frame} centre={r.at} vers={r.vers} sens={r.k % 2 === 0 ? 1 : -1} />
      ))}
      {tri.flatMap((x) =>
        (x.sons ?? []).map((s, k) => (
          <Sequence key={`${x.at}-${k}`} from={Math.max(0, Math.round(x.at + s.at))} durationInFrames={90} layout="none">
            <Audio src={staticFile(`sfx/${s.son}.mp3`)} volume={s.volume ?? 0.4} />
          </Sequence>
        )),
      )}
      {rideaux.map((r) => (
        <Sequence key={`r${r.at}`} from={Math.max(0, r.at - 14)} durationInFrames={60} layout="none">
          <Audio src={staticFile("sfx/swoosh.mp3")} volume={0.32} />
        </Sequence>
      ))}
      <Gardien frame={frame} scene={scene} local={f} reste={d - f} />
    </div>
  );
};
