import React from "react";
import { useCurrentFrame } from "remotion";
import { C, MONTSERRAT, blancA, rougeA } from "../lib/brand";
import { EASE, EASE_IN, EASE_IO, kf, prog } from "../lib/scene";
import { Fleche, FlecheBas } from "./Icones";

// Les deux boutons qui sont vraiment sous la vidéo sur la page d'accueil du site
// (section « vx-choice » : mêmes textes que tools/home.mjs).
const CARTES = [
  { k: "Premier cas", t: "Je veux transformer mon physique", s: "Perdre du gras, prendre du muscle, préparer une compétition", chaud: true },
  { k: "Deuxième cas", t: "Je suis coach", s: "Plus de clients, plus de temps, un vrai système", chaud: false },
];

export const CartesSite: React.FC<{
  at: number;
  y: number;
  lecteur?: boolean; // affiche le cadre de la vidéo au-dessus
  surligne?: [number, number]; // frames où chaque carte est mise en avant
  clic?: number; // frame du clic sur la première carte
  fleche?: boolean;
  fin?: number;
}> = ({ at, y, lecteur = false, surligne, clic, fleche = false, fin }) => {
  const f = useCurrentFrame();
  const o = fin !== undefined ? prog(f, fin, fin + 12, EASE_IN) : 0;
  if (f < at - 6 || o >= 1) return null;
  const pL = prog(f, at - 6, at + 16, EASE);
  const w = 760;
  const h = 330;
  const gap = 40;
  const x0 = 960 - w - gap / 2;
  const yc = y + (lecteur ? 250 : 0);
  // Curseur : il arrive sur la première carte puis clique.
  const cx = clic !== undefined ? kf(f, [[clic - 50, 1500], [clic - 8, x0 + w * 0.62]], EASE_IO) : 0;
  const cy = clic !== undefined ? kf(f, [[clic - 50, yc + 420], [clic - 8, yc + h - 52]], EASE_IO) : 0;
  const pClic = clic !== undefined ? prog(f, clic, clic + 20, EASE) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {lecteur ? (
        <div className="verre"
          style={{
            position: "absolute",
            left: 960 - 200,
            top: y - 10,
            width: 400,
            height: 225,
            borderRadius: 18,
            background: "linear-gradient(160deg, #3a0606, #0D0000)",
            border: `2px solid ${rougeA(0.5)}`,
            opacity: pL,
            translate: `0 ${(1 - pL) * 40}px`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 200 - 34, top: 112 - 34, width: 68, height: 68, borderRadius: 34, background: C.rouge }} />
          <div style={{ position: "absolute", left: 200 - 8, top: 112 - 14, width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: `22px solid ${C.blanc}` }} />
          <div style={{ position: "absolute", left: 20, right: 20, bottom: 16, height: 6, borderRadius: 3, background: blancA(0.2) }}>
            <div style={{ width: "92%", height: 6, borderRadius: 3, background: C.rouge }} />
          </div>
          <div style={{ position: "absolute", left: 20, top: 16, fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: blancA(0.7) }}>CETTE VIDÉO</div>
        </div>
      ) : null}
      {fleche ? (
        <div
          style={{
            position: "absolute",
            left: 960 - 40,
            top: yc - 110 + Math.abs(Math.sin((f - at) / 9)) * 18,
            opacity: prog(f, at, at + 14, EASE),
          }}
        >
          <FlecheBas size={80} color={C.rouge} stroke={2.6} />
        </div>
      ) : null}
      {CARTES.map((k, i) => {
        const p = prog(f, at + 8 + i * 6, at + 26 + i * 6, EASE);
        let s = 0;
        if (surligne) {
          s =
            i === 0
              ? prog(f, surligne[0], surligne[0] + 12, EASE) * (1 - prog(f, surligne[1], surligne[1] + 12, EASE))
              : prog(f, surligne[1], surligne[1] + 12, EASE) * (clic !== undefined ? 1 - prog(f, clic - 50, clic - 38, EASE) : 1);
        }
        const hot = i === 0 && clic !== undefined ? Math.max(s, prog(f, clic - 20, clic - 6, EASE)) : s;
        return (
          <div className="verre"
            key={i}
            style={{
              position: "absolute",
              left: x0 + i * (w + gap),
              top: yc,
              width: w,
              height: h,
              borderRadius: 24,
              background: k.chaud
                ? `linear-gradient(150deg, rgba(176,2,2,${0.55 + 0.35 * hot}) 0%, rgba(39,1,1,0.96) 70%)`
                : `linear-gradient(150deg, rgba(137,4,4,${0.25 + 0.4 * hot}) 0%, rgba(39,1,1,0.96) 70%)`,
              border: `2px solid ${rougeA(0.3 + 0.7 * hot)}`,
              boxShadow: `0 ${30 + 20 * hot}px ${80 + 40 * hot}px rgba(0,0,0,0.6)`,
              opacity: p,
              translate: `0 ${(1 - p) * 60 - hot * 12}px`,
              scale: `${1 + hot * 0.03 - (i === 0 ? Math.sin(pClic * Math.PI) * 0.025 : 0)}`,
              padding: "36px 44px",
              boxSizing: "border-box",
              fontFamily: MONTSERRAT,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color: k.chaud ? C.rose : C.rouge, textTransform: "uppercase" }}>{k.k}</div>
              <div style={{ marginTop: 12, fontWeight: 900, fontSize: 44, lineHeight: 1.04, letterSpacing: "-0.035em", color: C.blanc }}>{k.t}</div>
              <div style={{ marginTop: 12, fontWeight: 600, fontSize: 24, lineHeight: 1.3, color: blancA(0.65) }}>{k.s}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 800, fontStyle: "italic", fontSize: 28, color: C.blanc }}>
              Réserver mon appel offert
              <Fleche size={30} color={C.blanc} stroke={2.6} />
            </div>
            {i === 0 && pClic > 0 && pClic < 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: cx - (x0) - 200 * pClic,
                  top: cy - yc - 200 * pClic,
                  width: 400 * pClic,
                  height: 400 * pClic,
                  borderRadius: "50%",
                  background: `rgba(245,237,237,${0.25 * (1 - pClic)})`,
                }}
              />
            ) : null}
          </div>
        );
      })}
      {clic !== undefined && f >= clic - 52 ? (
        <svg width={60} height={60} viewBox="0 0 24 24" style={{ position: "absolute", left: cx, top: cy, scale: `${1 - Math.sin(pClic * Math.PI) * 0.15}` }}>
          <path d="M4 2l15 8.5-6.5 1.5-3 6.5z" fill={C.blanc} stroke={C.noir} strokeWidth={1.2} strokeLinejoin="round" />
        </svg>
      ) : null}
    </div>
  );
};
