// Éléments composés de la VSL v2 : écran d'appli, graphe de pesées, cycle, minuteur, repas, bouton.
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { evolvePath } from "@remotion/paths";
import { MONTSERRAT } from "../lib/brand";
import { ACCENT, ACCENT_CLAIR, BLANC, clamp, useRessort, Verre } from "./kit";

// Écran de l'appli dans une coque de verre, l'image change aux frames données.
export const Ecran: React.FC<{
  debut: number;
  fin?: number;
  x: number;
  y: number;
  ecrans: { at: number; src: string }[];
  largeur?: number;
  rot?: [number, number, number];
}> = ({ debut, fin, x, y, ecrans, largeur = 430, rot = [18, -32, 8] }) => {
  const f = useCurrentFrame();
  const h = (largeur * 1328) / 780;
  return (
    <Verre debut={debut} fin={fin} x={x} y={y} w={largeur + 28} h={h + 28} rayon={64} rot={rot} derive={5}>
      <div style={{ position: "absolute", inset: 14, borderRadius: 52, overflow: "hidden", background: "#000" }}>
        {ecrans.map((e, i) => {
          const suivant = ecrans[i + 1];
          const visible = f >= e.at - 1 && (!suivant || f < suivant.at + 12);
          if (!visible) return null;
          const p = i === 0 ? 1 : interpolate(f, [e.at, e.at + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <Img
              key={e.src}
              src={staticFile(e.src)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: p,
                transform: `translateY(${(1 - p) * 60}px) scale(${1 + (1 - p) * 0.06})`,
                filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
              }}
            />
          );
        })}
      </div>
    </Verre>
  );
};

// Pesées : la courbe du jour (bruitée, grise) contre la moyenne sur 14 jours (lisse, rouge).
export const GraphePesees: React.FC<{ debut: number; fin: number; pic: number; eau: number }> = ({ debut, fin, pic, eau }) => {
  const f = useCurrentFrame();
  const W = 760;
  const H = 360;
  const jours = 14;
  // valeurs illustratives (pas des données réelles) : tendance douce + bruit de l'eau
  const bruit = [0.3, -0.2, 0.5, 0.1, -0.4, 0.2, 1.1, 0.4, -0.3, 0.1, -0.5, 0.0, -0.2, -0.6];
  const pts = bruit.map((b, i) => ({ x: (i / (jours - 1)) * W, y: H * 0.35 + i * 7 - b * 70 }));
  const moy = pts.map((p, i) => ({ x: p.x, y: H * 0.38 + i * 7 }));
  const chemin = (ps: { x: number; y: number }[]) => ps.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const tJour = interpolate(f, [debut + 8, debut + 50], [0, 1], clamp);
  const tMoy = interpolate(f, [eau, eau + 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const dJour = evolvePath(tJour, chemin(pts));
  const dMoy = evolvePath(tMoy, chemin(moy));
  const picP = useRessort(pic, { damping: 10 });
  return (
    <Verre debut={debut} fin={fin} x={1010} y={250} w={820} h={560} rot={[24, -30, -4]}>
      <div style={{ position: "absolute", left: 30, top: 26, fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 40, color: BLANC, letterSpacing: "-0.02em" }}>Ta balance, sur 2 semaines</div>
      <svg width={W} height={H} style={{ position: "absolute", left: 30, top: 110, overflow: "visible" }}>
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={0} x2={W} y1={(k * H) / 3} y2={(k * H) / 3} stroke="rgba(255,255,255,0.07)" strokeWidth={2} />
        ))}
        <path d={chemin(pts)} stroke="rgba(245,237,237,0.55)" strokeWidth={4} fill="none" strokeDasharray={dJour.strokeDasharray} strokeDashoffset={dJour.strokeDashoffset} strokeLinejoin="round" />
        {pts.map((p, i) =>
          tJour * (jours - 1) >= i ? <circle key={i} cx={p.x} cy={p.y} r={i === 6 ? 9 : 6} fill={i === 6 ? ACCENT_CLAIR : "rgba(245,237,237,0.8)"} /> : null,
        )}
        <path
          d={chemin(moy)}
          stroke={ACCENT}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={dMoy.strokeDasharray}
          strokeDashoffset={dMoy.strokeDashoffset}
          style={{ filter: "drop-shadow(0 0 14px rgba(224,30,30,0.8))" }}
        />
      </svg>
      {f >= pic ? (
        <div
          style={{
            position: "absolute",
            left: 30 + pts[6].x - 70,
            top: 110 + pts[6].y - 110,
            padding: "10px 22px",
            borderRadius: 30,
            background: "linear-gradient(135deg,#FF6A55,#E01E1E)",
            color: BLANC,
            fontFamily: MONTSERRAT,
            fontWeight: 900,
            fontSize: 46,
            transform: `scale(${picP})`,
            boxShadow: "0 16px 40px -10px rgba(224,30,30,0.7)",
          }}
        >
          +1 kg ?
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 30, bottom: 26, display: "flex", gap: 36, fontFamily: MONTSERRAT, fontWeight: 700, fontSize: 32, color: "rgba(245,237,237,0.75)" }}>
        <span>● chaque matin</span>
        <span style={{ color: ACCENT_CLAIR, opacity: tMoy > 0 ? 1 : 0.3 }}>━ moyenne</span>
      </div>
    </Verre>
  );
};

// Cycle de la culpabilité : écart -> punition -> craquage -> écart.
export const Cycle: React.FC<{ debut: number; fin: number; etapes: { at: number; t: string }[] }> = ({ debut, fin, etapes }) => {
  const f = useCurrentFrame();
  const cx = 380;
  const cy = 300;
  const r = 205;
  const angle = interpolate(f, [debut, fin], [0, 300]);
  return (
    <Verre debut={debut} fin={fin} x={1040} y={210} w={760} h={620} rot={[26, -28, 6]}>
      <svg width={760} height={620} style={{ position: "absolute", inset: 0 }}>
        <circle cx={cx} cy={cy} r={r} stroke="rgba(255,120,110,0.18)" strokeWidth={3} fill="none" strokeDasharray="10 14" />
        <g transform={`rotate(${angle} ${cx} ${cy})`}>
          <circle cx={cx + r} cy={cy} r={14} fill={ACCENT_CLAIR} style={{ filter: "drop-shadow(0 0 16px rgba(255,90,71,0.9))" }} />
        </g>
      </svg>
      {etapes.map((e, i) => {
        const a = (-90 + i * 120) * (Math.PI / 180);
        const p = interpolate(f, [e.at - 2, e.at + 10], [0, 1], clamp);
        return (
          <div
            key={e.t}
            style={{
              position: "absolute",
              left: cx + Math.cos(a) * r,
              top: cy + Math.sin(a) * r,
              transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * p})`,
              opacity: p,
              padding: "16px 30px",
              borderRadius: 40,
              background: i === 1 ? "linear-gradient(135deg,#FF6A55,#E01E1E)" : "rgba(40,14,14,0.95)",
              border: "1.5px solid rgba(255,140,130,0.35)",
              color: BLANC,
              fontFamily: MONTSERRAT,
              fontWeight: 900,
              fontSize: 46,
              whiteSpace: "nowrap",
              boxShadow: "0 20px 40px -12px rgba(0,0,0,0.7)",
            }}
          >
            {e.t}
          </div>
        );
      })}
    </Verre>
  );
};

// Minuteur circulaire 0 -> 30 s (le bilan du matin).
export const Minuteur: React.FC<{ debut: number; fin: number; x: number; y: number }> = ({ debut, fin, x, y }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [debut + 6, debut + 50], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const R = 120;
  const L = 2 * Math.PI * R;
  return (
    <Verre debut={debut} fin={fin} x={x} y={y} w={330} h={330} rayon={165} rot={[0, 40, -10]} teinte="sombre">
      <svg width={330} height={330} style={{ position: "absolute", inset: 0 }}>
        <circle cx={165} cy={165} r={R} stroke="rgba(255,255,255,0.08)" strokeWidth={18} fill="none" />
        <circle
          cx={165}
          cy={165}
          r={R}
          stroke={ACCENT}
          strokeWidth={18}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - t)}
          transform="rotate(-90 165 165)"
          style={{ filter: "drop-shadow(0 0 12px rgba(224,30,30,0.8))" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: MONTSERRAT, color: BLANC }}>
        <div style={{ fontWeight: 900, fontSize: 96, letterSpacing: "-0.04em", lineHeight: 1 }}>{Math.round(t * 30)}</div>
        <div style={{ fontWeight: 700, fontSize: 24, opacity: 0.7, letterSpacing: "0.2em" }}>SECONDES</div>
      </div>
    </Verre>
  );
};

// Repas de la journée : un repas sauté, le suivant s'adapte (sans toucher aux repas déjà pris).
export const Repas: React.FC<{ debut: number; fin: number; saute: number; adapte: number }> = ({ debut, fin, saute, adapte }) => {
  const f = useCurrentFrame();
  const cartes = ["Matin", "Midi", "Goûter", "Soir"];
  return (
    <>
      {cartes.map((nom, i) => {
        const etat = i === 0 ? "pris" : i === 1 ? (f >= saute ? "saute" : "prevu") : i === 2 && f >= adapte ? "adapte" : "prevu";
        const glow = etat === "adapte" ? interpolate(f, [adapte, adapte + 14], [0, 1], clamp) : 0;
        return (
          <Verre
            key={nom}
            debut={debut + i * 4}
            fin={fin}
            x={210 + i * 390}
            y={600}
            w={340}
            h={300}
            rot={[30, 0, i % 2 ? 4 : -4]}
            teinte={etat === "adapte" ? "rouge" : "sombre"}
            derive={2}
            style={{ transform: `translateY(${-glow * 30}px) scale(${1 + glow * 0.06})` }}
          >
            <div style={{ position: "absolute", left: 30, top: 28, fontFamily: MONTSERRAT, fontWeight: 900, fontSize: 54, color: BLANC }}>{nom}</div>
            <div
              style={{
                position: "absolute",
                left: 30,
                bottom: 30,
                fontFamily: MONTSERRAT,
                fontWeight: 700,
                fontSize: 38,
                color: etat === "saute" ? "rgba(245,237,237,0.45)" : BLANC,
                textDecoration: etat === "saute" ? "line-through" : undefined,
              }}
            >
              {etat === "pris" ? "✓ pris" : etat === "saute" ? "sauté" : etat === "adapte" ? "s'adapte" : "prévu"}
            </div>
          </Verre>
        );
      })}
    </>
  );
};

// Bouton d'appel à l'action (même vocabulaire que le site).
export const Bouton: React.FC<{ debut: number; fin?: number; x: number; y: number; w: number; texte: string; sous?: string; principal?: boolean }> = ({
  debut,
  fin,
  x,
  y,
  w,
  texte,
  sous,
  principal = true,
}) => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.max(0, Math.sin((f - debut) / 9)) * 0.015;
  return (
    <Verre debut={debut} fin={fin} x={x} y={y} w={w} h={sous ? 190 : 150} rayon={95} teinte={principal ? "rouge" : "sombre"} rot={[40, 0, -3]} derive={1.5} style={{ transform: `scale(${pulse})` }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: MONTSERRAT, color: BLANC }}>
        <div style={{ fontWeight: 900, fontSize: 56, letterSpacing: "-0.025em" }}>{texte}</div>
        {sous ? <div style={{ fontWeight: 700, fontSize: 32, opacity: 0.85, marginTop: 8 }}>{sous}</div> : null}
      </div>
    </Verre>
  );
};
