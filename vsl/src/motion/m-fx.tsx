import React from "react";
import { interpolate } from "remotion";
import { cl, E, hash, p, sp } from "./anim";
import { Ctx } from "./Beats";
import { Camera } from "./modules";
import { TitresEnEtapes } from "./m-ui";
import { Carte, Coche, FlouMouvement, Photo, styleSortie, Txt } from "./Kit";
import { Titre } from "./Titre";
import { FONT, ROUGE, TH } from "./tokens";

const TYPES = ["Vidéo", "PDF", "Podcast", "Reel", "Article", "Forum", "Programme", "Diète", "Live", "Story", "Ebook", "Thread"];

// ── Avalanche de contenus (référence Pinterest : cartes qui tombent, profondeur de champ, flou de mouvement)
// dans deux colonnes latérales ; le titre vit seul au centre.
export const Avalanche: React.FC<{ c: Ctx; etapes: { at: number; titre: string }[]; acceleration?: number }> = ({ c, etapes, acceleration = 9999 }) => {
  const so = styleSortie(c.sortie, "fond");
  const N = 30;
  const vit = 1 + 1.4 * p(c.f, acceleration, acceleration + 20);
  return (
    <Camera c={c} force={0.3}>
      <div style={{ position: "absolute", inset: 0, ...so }}>
        {Array.from({ length: N }).map((_, k) => {
          const col = k % 2 === 0 ? 0 : 1;
          const z = hash(k * 7);
          const w = 170 + z * 120;
          const h = w * (0.8 + hash(k * 11) * 0.7);
          const xBase = col === 0 ? 70 + hash(k * 3) * (520 - w) : 1330 + hash(k * 3) * (520 - w);
          const v = (6 + z * 10) * vit;
          const t0 = hash(k * 13) * 1600;
          const y = ((t0 + c.f * v) % 1800) - 400;
          const entre = p(c.f, hash(k * 17) * 10, hash(k * 17) * 10 + 8);
          const flou = (1 - z) * 7;
          const type = TYPES[k % TYPES.length];
          return (
            <FlouMouvement key={k} id={`av-${k}`} vx={0} vy={v * (0.6 + z)} style={{ position: "absolute", left: xBase, top: y, width: w, height: h, opacity: entre * (0.5 + 0.5 * z) }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 22,
                  background: c.theme === "clair" ? "#fff" : "rgba(40,12,10,0.9)",
                  boxShadow: c.theme === "clair" ? "0 18px 40px -16px rgba(60,10,10,0.35)" : "0 0 0 1px rgba(255,120,100,0.25)",
                  filter: `blur(${flou.toFixed(1)}px)`,
                  scale: `${0.7 + 0.3 * z}`,
                  rotate: `${(hash(k * 19) - 0.5) * 14}deg`,
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "55%", background: `linear-gradient(135deg, ${["#F3D3CF", "#E8C1BB", "#F0E1DC", "#D9A6A0"][k % 4]}, ${["#E9B9B2", "#F6E7E3", "#D48C84", "#F2D9D4"][k % 4]})` }} />
                <div style={{ position: "absolute", left: 16, bottom: 16, padding: "6px 14px", borderRadius: 20, background: ROUGE }}>
                  <Txt taille={18} graisse={800} couleur="#fff">
                    {type}
                  </Txt>
                </div>
              </div>
            </FlouMouvement>
          );
        })}
      </div>
      <TitresEnEtapes c={c} etapes={etapes} zone={{ x: 610, y: 240, w: 700, h: 600 }} max={140} align="center" />
    </Camera>
  );
};

// ── Le pont : de l'info au résultat. La ligne se trace, un point voyage (les jours défilent),
// puis la ligne casse au milieu (« presque tout le monde lâche »).
export const Pont: React.FC<{ c: Ctx; etapes: { at: number; titre: string }[]; relabel: number; jours: [number, number]; casse: number }> = ({ c, etapes, relabel, jours, casse }) => {
  const th = TH[c.theme];
  const so = styleSortie(c.sortie, "fond");
  const xa = 330;
  const xb = 1590;
  const y = 700;
  const trace = p(c.f, 8, 30, E.inOut);
  const lab = p(c.f, relabel - 6, relabel + 6, E.inOut);
  const voyage = interpolate(c.f, jours, [0, 0.5], { ...cl, easing: E.inOut });
  const nJours = Math.round(interpolate(c.f, jours, [1, 90], { ...cl, easing: E.inOut }));
  const ch = sp(c.f, casse, "lourd");
  const mid = (xa + xb) / 2;
  const noeud = (x: number, a: string, b: string, nom: string) => (
    <div data-zone={nom} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}>
      <div
        data-bloc
        style={{
          padding: "26px 40px",
          borderRadius: 70,
          background: c.theme === "clair" ? "#fff" : "rgba(255,90,80,0.12)",
          boxShadow: c.theme === "clair" ? `${th.ombre}, 0 0 0 3px ${th.accent}` : "0 0 0 3px rgba(255,74,61,0.9), 0 0 40px rgba(255,60,48,0.4)",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 54,
          color: th.encre,
          whiteSpace: "nowrap",
          position: "relative",
          minWidth: 300,
          textAlign: "center",
          scale: `${sp(c.f, 0, "rebond")}`,
        }}
      >
        <span style={{ opacity: 1 - lab }}>{a}</span>
        <span style={{ position: "absolute", left: 0, right: 0, opacity: lab }}>{b}</span>
      </div>
    </div>
  );
  const seg = (x1: number, x2: number, rot: number, dy: number) => (
    <div
      style={{
        position: "absolute",
        left: x1,
        top: y - 4 + dy,
        width: Math.max(0, x2 - x1),
        height: 8,
        borderRadius: 8,
        background: th.accent,
        boxShadow: c.theme === "sombre" ? "0 0 20px rgba(255,60,48,0.7)" : undefined,
        transformOrigin: "0 50%",
        rotate: `${rot}deg`,
      }}
    />
  );
  return (
    <Camera c={c} force={0.4}>
      <TitresEnEtapes c={c} etapes={etapes} zone={{ x: 160, y: 120, w: 1600, h: 300 }} max={110} align="center" />
      <div style={{ position: "absolute", inset: 0, ...so }}>
        {/* ligne : un seul segment avant la casse, deux après (la moitié droite tombe) */}
        {ch <= 0.001 ? (
          seg(xa + 150, xa + 150 + (xb - xa - 300) * trace, 0, 0)
        ) : (
          <>
            {seg(xa + 150, mid - 30, 0, 0)}
            <div style={{ position: "absolute", left: 0, top: 0, translate: `0 ${ch * 260}px`, opacity: 1 - ch * 0.6 }}>{seg(mid + 30, xb - 150, ch * 24, 0)}</div>
          </>
        )}
        {noeud(xa, "L'info", "Savoir", "noeud-a")}
        <div style={{ position: "absolute", inset: 0, translate: `0 ${ch * 260}px`, rotate: `${ch * 4}deg`, transformOrigin: "60% 65%", opacity: 1 - ch * 0.6 }}>{noeud(xb, "Le résultat", "Faire", "noeud-b")}</div>
        {c.f >= jours[0] && c.f < casse ? (
          <>
            <div
              style={{
                position: "absolute",
                left: xa + 150 + (xb - xa - 300) * voyage - 18,
                top: y - 18,
                width: 36,
                height: 36,
                borderRadius: 36,
                background: "#fff",
                boxShadow: `0 0 0 6px ${th.accent}, 0 0 30px rgba(255,60,48,0.8)`,
              }}
            />
            <div data-zone="jours" style={{ position: "absolute", left: xa + 150 + (xb - xa - 300) * voyage, top: y + 60, transform: "translateX(-50%)", opacity: p(c.f, jours[0], jours[0] + 8) }}>
              <Txt taille={40} graisse={900} couleur={th.encre} style={{ fontVariantNumeric: "tabular-nums" }}>
                <span data-texte>Jour {nJours}</span>
              </Txt>
            </div>
          </>
        ) : null}
        {c.f >= casse ? (
          <div data-zone="lache" style={{ position: "absolute", left: mid, top: y + 90, transform: `translateX(-50%) scale(${sp(c.f, casse + 4, "rebond")})` }}>
            <Txt taille={56} graisse={900} couleur={th.accent}>
              <span data-texte>Abandon</span>
            </Txt>
          </div>
        ) : null}
      </div>
    </Camera>
  );
};

// ── Respiration : un cercle qui inspire / expire, et les outils du soir qui s'allument.
export const Respiration: React.FC<{ c: Ctx; titre: string; items: { texte: string; at: number }[]; titre2?: { at: number; texte: string } }> = ({ c, titre, items, titre2 }) => {
  const th = TH[c.theme];
  const souffle = 0.5 - 0.5 * Math.cos((c.f / 30) * ((2 * Math.PI) / 4.5));
  const t = sp(c.f, 0, "souple");
  const so = styleSortie(c.sortie, "fond");
  const etapes = [{ at: 0, titre }, ...(titre2 ? [{ at: titre2.at, titre: titre2.texte }] : [])];
  return (
    <Camera c={c} force={0.3}>
      <div style={{ position: "absolute", inset: 0, ...so }}>
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: 560 - 300,
              top: 540 - 300,
              width: 600,
              height: 600,
              borderRadius: 600,
              border: `2px solid rgba(255,90,80,${0.5 - k * 0.15})`,
              scale: `${(0.55 + 0.35 * souffle) * (1 + k * 0.18) * t}`,
              boxShadow: k === 0 ? `0 0 ${60 + 60 * souffle}px rgba(255,60,48,0.35), inset 0 0 ${60 * souffle}px rgba(255,60,48,0.3)` : undefined,
            }}
          />
        ))}
        <div data-zone="souffle" style={{ position: "absolute", left: 560, top: 540, transform: "translate(-50%, -50%)", opacity: t }}>
          <Txt taille={44} graisse={800} couleur={th.encre} style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>
            <span data-texte>{souffle > 0.5 ? "Inspire" : "Expire"}</span>
          </Txt>
        </div>
        <div style={{ position: "absolute", left: 120, top: 120, opacity: p(c.f, 4, 14) }}>
          <svg width={70} height={70} viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth={2} strokeLinecap="round">
            <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
          </svg>
        </div>
      </div>
      <TitresEnEtapes c={c} etapes={etapes} zone={{ x: 1000, y: 140, w: 780, h: 380 }} max={110} />
      {items.map((it, k) => {
        const t2 = sp(c.f, it.at, "rebond");
        const visible = c.f >= it.at && (!titre2 || c.f < titre2.at - 8);
        const out = titre2 ? p(c.f, titre2.at - 8, titre2.at, E.in) : 0;
        return (
          <div key={k} data-zone={`soir-${k}`} style={{ position: "absolute", left: 1000, top: 590 + k * 115, transformOrigin: "0 50%", transform: `scale(${t2})`, opacity: visible ? (1 - out) * (1 - c.sortie) : 0 }}>
            <div data-bloc style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "18px 32px", borderRadius: 60, background: "rgba(255,90,80,0.1)", boxShadow: "0 0 0 2px rgba(255,90,80,0.45), 0 0 30px rgba(255,60,48,0.2)", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: th.encre, whiteSpace: "nowrap" }}>
              <Coche taille={44} prog={p(c.f, it.at + 4, it.at + 16)} fond={th.accent} />
              {it.texte}
            </div>
          </div>
        );
      })}
    </Camera>
  );
};

// ── PDF qui dort dans les fichiers (gris, « zzz »).
export const PdfEndormi: React.FC<{ c: Ctx; titre: string }> = ({ c, titre }) => {
  const th = TH[c.theme];
  const so = styleSortie(c.sortie, "fond");
  return (
    <Camera c={c} force={0.4}>
      <Carte x={1130} y={190} w={560} h={720} f={c.f} at={0} depuis="chute" ressort="lourd" theme={c.theme} rz={-8} rx={14} nom="pdf" sortie={c.sortie} style={{ filter: "grayscale(1)" }}>
        <div style={{ position: "absolute", left: 50, top: 50, padding: "10px 20px", borderRadius: 12, background: "#8a8282" }}>
          <Txt taille={30} graisse={900} couleur="#fff">
            PDF
          </Txt>
        </div>
        <Txt taille={34} graisse={800} couleur={th.doux} style={{ position: "absolute", left: 50, top: 130 }}>
          diete_v3_finale.pdf
        </Txt>
        {Array.from({ length: 8 }).map((_, k) => (
          <div key={k} style={{ position: "absolute", left: 50, top: 220 + k * 56, height: 20, width: 460 * (0.55 + hash(k) * 0.45), borderRadius: 10, background: "rgba(23,8,8,0.10)" }} />
        ))}
      </Carte>
      {[0, 1, 2].map((k) => {
        const cyc = ((c.f + k * 18) % 54) / 54;
        return (
          <div key={k} style={{ position: "absolute", left: 1640 + cyc * 60 + k * 10, top: 180 - cyc * 120, opacity: Math.sin(cyc * Math.PI) * (1 - c.sortie) * p(c.f, 20, 30), fontFamily: FONT, fontWeight: 900, fontSize: 40 + k * 14, color: th.doux }}>
            z
          </div>
        );
      })}
      <Titre texte={titre} zone={{ x: 150, y: 200, w: 860, h: 680 }} theme={c.theme} f={c.f} debut={6} sortie={c.sortie} max={130} />
      <div style={{ ...so }} />
    </Camera>
  );
};

// ── Studio : un script de vidéo s'écrit tout seul (accroche, contenu, appel à l'action).
export const Studio: React.FC<{ c: Ctx; titre: string; ecrit?: number }> = ({ c, titre, ecrit = 10 }) => {
  const th = TH[c.theme];
  const sections = ["Accroche", "Contenu", "Appel à l'action"];
  return (
    <Camera c={c} force={0.4}>
      <Titre texte={titre} zone={{ x: 150, y: 200, w: 760, h: 680 }} theme={c.theme} f={c.f} debut={4} sortie={c.sortie} max={120} />
      <Carte x={990} y={160} w={780} h={760} f={c.f} at={0} depuis="droite" theme={c.theme} ry={-10} nom="studio" sortie={c.sortie}>
        <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 16, height: 16, borderRadius: 16, background: th.accent, boxShadow: `0 0 12px ${th.accent}`, opacity: 0.5 + 0.5 * Math.sin(c.f / 5) }} />
          <Txt taille={30} graisse={800} couleur={th.encre}>
            Studio créatif · nouveau script
          </Txt>
        </div>
        {sections.map((s, k) => {
          const at = ecrit + k * 14;
          return (
            <div key={k} style={{ position: "absolute", left: 40, right: 40, top: 120 + k * 200, opacity: p(c.f, at, at + 6) }}>
              <Txt taille={30} graisse={900} couleur={th.accentTexte} style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {s}
              </Txt>
              {[0.95, 0.8, 0.55].map((w, j) => (
                <div key={j} style={{ marginTop: 18, height: 20, borderRadius: 10, width: `${w * 100 * p(c.f, at + 4 + j * 3, at + 14 + j * 3, E.out)}%`, background: c.theme === "clair" ? "rgba(23,8,8,0.12)" : "rgba(255,140,120,0.22)" }} />
              ))}
            </div>
          );
        })}
      </Carte>
    </Camera>
  );
};

// ── Copies « d'un autre » : programme, diète, horaires, chacun tamponné.
export const Copies: React.FC<{ c: Ctx; titre: string; items: { texte: string; at: number }[] }> = ({ c, titre, items }) => {
  const th = TH[c.theme];
  const w = 440;
  const gap = 60;
  const x0 = 960 - (3 * w + 2 * gap) / 2;
  return (
    <Camera c={c} force={0.4}>
      <Titre texte={titre} zone={{ x: 160, y: 110, w: 1600, h: 220 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align="center" max={110} />
      {items.map((it, k) => {
        const tp = sp(c.f, it.at + 8, "rebond");
        return (
          <React.Fragment key={k}>
            <Carte x={x0 + k * (w + gap)} y={380} w={w} h={520} f={c.f} at={it.at - 4} depuis="profondeur" theme={c.theme} rz={(k - 1) * 4} nom={`copie-${k}`} sortie={c.sortie}>
              <div style={{ position: "absolute", left: 40, top: 40 }}>
                <Txt taille={44} graisse={900} couleur={th.encre}>
                  {it.texte}
                </Txt>
              </div>
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} style={{ position: "absolute", left: 40, top: 130 + j * 52, height: 18, width: (w - 80) * (0.5 + hash(j + k * 9) * 0.5), borderRadius: 9, background: c.theme === "clair" ? "rgba(23,8,8,0.10)" : "rgba(255,140,120,0.2)" }} />
              ))}
              <div
                style={{
                  position: "absolute",
                  left: w / 2,
                  bottom: 70,
                  transform: `translateX(-50%) rotate(-10deg) scale(${2.2 - 1.2 * tp})`,
                  opacity: c.f >= it.at + 8 ? Math.min(1, tp * 3) : 0,
                  padding: "12px 26px",
                  border: `6px solid ${th.accent}`,
                  borderRadius: 14,
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 40,
                  color: th.accent,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                D'un autre
              </div>
            </Carte>
          </React.Fragment>
        );
      })}
    </Camera>
  );
};

// ── Tout structurer : quatre tuiles en désordre se rangent dans une grille nette.
export const Grille: React.FC<{ c: Ctx; titre: string; range: number; items: { texte: string; icone: React.ReactNode }[] }> = ({ c, titre, range, items }) => {
  const th = TH[c.theme];
  const r = sp(c.f, range, "souple");
  const so = styleSortie(c.sortie, "fond");
  const tw = 330;
  const gap = 34;
  const gx = 1040;
  const gy = 200;
  return (
    <Camera c={c} force={0.4}>
      <Titre texte={titre} zone={{ x: 150, y: 200, w: 820, h: 680 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} max={140} />
      <div style={{ position: "absolute", inset: 0, ...so }}>
        {items.map((it, k) => {
          const t = sp(c.f, 2 + k * 3, "souple");
          const fx = gx + (k % 2) * (tw + gap);
          const fy = gy + Math.floor(k / 2) * (tw + gap);
          const dx = (hash(k * 5) - 0.5) * 260;
          const dy = (hash(k * 7) - 0.5) * 200;
          const rot = (hash(k * 9) - 0.5) * 40;
          return (
            <div
              key={k}
              data-zone={`tuile-${k}`}
              style={{
                position: "absolute",
                left: fx + dx * (1 - r),
                top: fy + dy * (1 - r) + (1 - t) * 500,
                width: tw,
                height: tw,
                rotate: `${rot * (1 - r)}deg`,
                opacity: Math.min(1, t * 2),
              }}
            >
              <div
                data-bloc
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 36,
                  background: c.theme === "clair" ? "#fff" : "linear-gradient(180deg, #2A0B09, #150505)",
                  boxShadow: c.theme === "clair" ? `${th.ombre}, 0 0 0 ${3 * r}px rgba(215,21,28,${0.8 * r})` : `0 0 0 ${2 + r}px rgba(255,74,61,${0.3 + 0.6 * r}), 0 0 ${40 * r}px rgba(255,60,48,0.4)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                {it.icone}
                <Txt taille={40} graisse={800} couleur={th.encre}>
                  {it.texte}
                </Txt>
              </div>
            </div>
          );
        })}
      </div>
    </Camera>
  );
};

// ── Mesurer : la photo passe au scanner (repères d'angle, ligne de balayage, graduations).
export const Scan: React.FC<{ c: Ctx; src: string; titre: string; pos?: string }> = ({ c, src, titre, pos }) => {
  const X = 1110;
  const Y = 130;
  const w = 560;
  const h = 820;
  const balaye = (c.f % 60) / 60;
  const t = p(c.f, 6, 16);
  return (
    <Camera c={c} force={0.4}>
      <Carte x={X} y={Y} w={w} h={h} f={c.f} at={0} depuis="droite" theme={c.theme} ry={-8} nom="scan" sortie={c.sortie}>
        <Photo src={src} f={c.f} d={c.d} pos={pos} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(40,0,0,0.25)", opacity: t }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: balaye * h, height: 3, background: TH.sombre.accent, boxShadow: "0 0 24px 6px rgba(255,60,48,0.6)", opacity: t }} />
        {[
          [24, 24, 0],
          [w - 84, 24, 90],
          [w - 84, h - 84, 180],
          [24, h - 84, 270],
        ].map(([x, y, r], k) => (
          <div key={k} style={{ position: "absolute", left: x, top: y, width: 60, height: 60, borderTop: `5px solid ${TH.sombre.accent}`, borderLeft: `5px solid ${TH.sombre.accent}`, rotate: `${r}deg`, opacity: t }} />
        ))}
        {Array.from({ length: 24 }).map((_, k) => (
          <div key={k} style={{ position: "absolute", right: 0, top: 40 + k * 31, width: k % 4 === 0 ? 40 : 20, height: 3, background: "rgba(255,255,255,0.8)", opacity: t * p(c.f, 8 + k * 0.6, 12 + k * 0.6) }} />
        ))}
      </Carte>
      <Titre texte={titre} zone={{ x: 150, y: 200, w: 880, h: 680 }} theme={c.theme} f={c.f} debut={4} sortie={c.sortie} max={150} />
    </Camera>
  );
};

// ── Recherches successives (référence Pinterest) : la barre tape plusieurs requêtes,
// chaque nouvelle recherche fait tomber une rangée de résultats.
export const Recherches: React.FC<{ c: Ctx; requetes: { at: number; texte: string }[] }> = ({ c, requetes }) => {
  const th = TH[c.theme];
  let i = 0;
  requetes.forEach((r, k) => {
    if (c.f >= r.at) i = k;
  });
  const r = requetes[i];
  const n = Math.floor(interpolate(c.f, [r.at + 4, r.at + 4 + r.texte.length * 1.1], [0, r.texte.length], cl));
  const caret = Math.floor(c.f / 8) % 2 === 0;
  const W0 = 1320;
  const x = (1920 - W0) / 2;
  const t = sp(c.f, 0, "souple");
  const so = styleSortie(c.sortie, "haut");
  return (
    <Camera c={c} force={0.4}>
      <div data-zone="barre" style={{ position: "absolute", left: x, top: 150, width: W0, height: 150, ...so }}>
        <div
          data-bloc
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 80,
            background: th.carte,
            boxShadow: th.ombre,
            transform: `scaleX(${0.2 + 0.8 * t})`,
            opacity: Math.min(1, t * 2),
            display: "flex",
            alignItems: "center",
            padding: "0 50px",
            gap: 28,
            boxSizing: "border-box",
          }}
        >
          <svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth={2.6} strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5L21 21" />
          </svg>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 62, color: th.encre, whiteSpace: "pre" }}>
            {r.texte.slice(0, n)}
            <span style={{ display: "inline-block", width: 4, height: 66, background: th.accent, marginLeft: 4, verticalAlign: "-10px", opacity: caret ? 1 : 0 }} />
          </div>
        </div>
      </div>
      {/* grille de résultats : une rangée par recherche, qui tombe avec profondeur */}
      <div style={{ position: "absolute", left: x, top: 380, width: W0, height: 620, overflow: "hidden", ...so }}>
        {requetes.map((rq, k) => {
          if (c.f < rq.at + 10) return null;
          return Array.from({ length: 6 }).map((_, j) => {
            const tj = sp(c.f, rq.at + 10 + j * 2, "souple");
            const decal = requetes.filter((q, m) => m > k && c.f >= q.at + 10).length;
            const y = (requetes.filter((_, m) => m <= k).length - 1 - 0) * 0 + decal * 210;
            return (
              <div
                key={`${k}-${j}`}
                style={{
                  position: "absolute",
                  left: j * ((W0 - 5 * 24) / 6 + 24),
                  top: y + (1 - tj) * -300,
                  width: (W0 - 5 * 24) / 6,
                  height: 190,
                  borderRadius: 22,
                  background: `linear-gradient(160deg, ${["#F3D3CF", "#E8C1BB", "#F0E1DC", "#D9A6A0", "#EBCFCA", "#E2B4AD"][(j + k) % 6]}, #fff)`,
                  boxShadow: "0 16px 30px -14px rgba(60,10,10,0.35)",
                  opacity: Math.min(1, tj * 2) * (1 - decal * 0.25),
                  filter: `blur(${(1 - tj) * 8 + decal * 1.5}px)`,
                  scale: `${1 - decal * 0.04}`,
                }}
              />
            );
          });
        })}
      </div>
    </Camera>
  );
};

