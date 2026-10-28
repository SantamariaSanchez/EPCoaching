import React from "react";
import { interpolate } from "remotion";
import { cl, E, hash, p, sp } from "./anim";
import { Ctx } from "./Beats";
import { Camera } from "./modules";
import { Carte, Coche, compte, Croix, LigneLumineuse, styleSortie, Txt } from "./Kit";
import { Titre } from "./Titre";
import { FONT, TH } from "./tokens";

// ── Cadran : un anneau qui se remplit pendant que le chiffre compte (30 s, ~30 min…).
export const Cadran: React.FC<{
  c: Ctx;
  valeur: number;
  prefixe?: string;
  unite: string;
  titre: string;
  pastilles?: { texte: string; at: number }[];
  duree?: number;
}> = ({ c, valeur, prefixe = "", unite, titre, pastilles = [], duree = 40 }) => {
  const th = TH[c.theme];
  const R = 230;
  const prog = interpolate(c.f, [6, 6 + duree], [0, 1], { ...cl, easing: E.outDoux });
  const circ = 2 * Math.PI * R;
  const t = sp(c.f, 0, "souple");
  const so = styleSortie(c.sortie, "fond");
  const cx = 560;
  const cy = 540;
  return (
    <Camera c={c} force={0.4}>
      <div data-zone="cadran" style={{ position: "absolute", left: cx - R - 40, top: cy - R - 40, width: 2 * R + 80, height: 2 * R + 80, scale: `${0.6 + 0.4 * t}`, opacity: Math.min(1, t * 2), ...so }}>
        <svg data-bloc width={2 * R + 80} height={2 * R + 80} style={{ position: "absolute", inset: 0, rotate: "-90deg" }}>
          <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={c.theme === "clair" ? "rgba(23,8,8,0.08)" : "rgba(255,120,100,0.14)"} strokeWidth={26} />
          {c.theme === "sombre" ? (
            <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={th.accent} strokeWidth={50} strokeLinecap="round" strokeDasharray={`${circ * prog} ${circ}`} opacity={0.25} style={{ filter: "blur(10px)" }} />
          ) : null}
          <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={th.accent} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${circ * prog} ${circ}`} />
          {Array.from({ length: 60 }).map((_, k) => {
            const a = (k / 60) * Math.PI * 2;
            const r1 = R - 44;
            const r2 = R - (k % 5 === 0 ? 66 : 56);
            return (
              <line
                key={k}
                x1={R + 40 + Math.cos(a) * r1}
                y1={R + 40 + Math.sin(a) * r1}
                x2={R + 40 + Math.cos(a) * r2}
                y2={R + 40 + Math.sin(a) * r2}
                stroke={k / 60 <= prog ? th.accent : c.theme === "clair" ? "rgba(23,8,8,0.15)" : "rgba(255,140,120,0.2)"}
                strokeWidth={k % 5 === 0 ? 4 : 2}
              />
            );
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div data-texte style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: th.encre, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.04em" }}>
            {prefixe}
            {compte(c.f, 6, duree, 0, valeur)}
          </div>
          <div data-texte style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: th.accentTexte, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8 }}>
            {unite}
          </div>
        </div>
      </div>
      <Titre texte={titre} zone={{ x: 980, y: pastilles.length ? 180 : 250, w: 800, h: pastilles.length ? 380 : 580 }} theme={c.theme} f={c.f} debut={6} sortie={c.sortie} max={120} />
      {pastilles.map((pa, k) => {
        const t2 = sp(c.f, pa.at, "rebond");
        return (
          <div key={k} data-zone={`cad-p-${k}`} style={{ position: "absolute", left: 980, top: 620 + k * 110, transformOrigin: "0 50%", transform: `scale(${t2})`, opacity: c.f >= pa.at ? 1 - c.sortie : 0 }}>
            <div
              data-bloc
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 30px",
                borderRadius: 60,
                background: c.theme === "clair" ? "#fff" : "rgba(255,90,80,0.1)",
                boxShadow: c.theme === "clair" ? th.ombre : "0 0 0 2px rgba(255,90,80,0.45), 0 0 30px rgba(255,60,48,0.25)",
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 44,
                color: th.encre,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: 16, height: 16, borderRadius: 16, background: th.accent }} />
              {pa.texte}
            </div>
          </div>
        );
      })}
    </Camera>
  );
};

// ── Semaine de calories : 5 jours en déficit, le week-end explose, la moyenne remonte à la maintenance.
export const SemaineCalories: React.FC<{
  c: Ctx;
  ecarts: { texte: string; at: number }[];
  weekend: number;
  papier: number;
  vrai: number;
}> = ({ c, ecarts, weekend, papier, vrai }) => {
  const th = TH[c.theme];
  const X = 150;
  const Y = 170;
  const Wc = 1060;
  const Hc = 760;
  const jours = ["L", "M", "M", "J", "V", "S", "D"];
  const base = Y + Hc - 110;
  const hMaint = 420;
  const hDef = 330;
  const hauteurs = jours.map((_, k) => {
    if (k < 5) return hDef * sp(c.f, 6 + k * 3, "souple");
    const t = sp(c.f, weekend + (k - 5) * 6, "rebond");
    return hDef + (k === 5 ? 250 : 210) * t;
  });
  const moy = interpolate(c.f, [vrai, vrai + 30], [hDef, hMaint], { ...cl, easing: E.inOut });
  const lignePapier = p(c.f, papier, papier + 18);
  const colW = 78;
  const gap = 24;
  const xL = 60 + 7 * colW + 6 * gap + 30; // colonne d'étiquettes, à droite des barres
  return (
    <Camera c={c} force={0.4}>
      <Carte x={X} y={Y} w={Wc} h={Hc} f={c.f} at={0} depuis="bas" theme={c.theme} rx={4} nom="graphique" sortie={c.sortie}>
        <div style={{ position: "absolute", left: 50, top: 40 }}>
          <Txt taille={34} graisse={800} couleur={th.encre}>
            Sa semaine
          </Txt>
          <Txt taille={24} graisse={600} couleur={th.doux} style={{ marginTop: 6 }}>
            Calories, jour par jour
          </Txt>
        </div>
        {/* barres */}
        {jours.map((j, k) => (
          <React.Fragment key={k}>
            <div
              style={{
                position: "absolute",
                left: 60 + k * (colW + gap),
                top: base - Y - hauteurs[k],
                width: colW,
                height: hauteurs[k],
                borderRadius: "18px 18px 6px 6px",
                background: k >= 5 ? `linear-gradient(180deg, ${th.accent}, ${c.theme === "clair" ? "#9C0A0F" : "#8A1410"})` : c.theme === "clair" ? "rgba(23,8,8,0.14)" : "rgba(255,140,120,0.22)",
                boxShadow: k >= 5 && c.theme === "sombre" ? "0 0 30px rgba(255,60,48,0.45)" : undefined,
              }}
            />
            <div style={{ position: "absolute", left: 60 + k * (colW + gap), width: colW, top: base - Y + 20, textAlign: "center" }}>
              <Txt taille={30} graisse={800} couleur={k >= 5 ? th.accentTexte : th.doux}>
                {j}
              </Txt>
            </div>
          </React.Fragment>
        ))}
        {/* ligne maintenance */}
        <div style={{ position: "absolute", left: 40, width: xL - 50, top: base - Y - hMaint, height: 0, borderTop: `3px dashed ${th.doux}`, opacity: p(c.f, 10, 20) }} />
        <div style={{ position: "absolute", left: xL, top: base - Y - hMaint - 18, opacity: p(c.f, 10, 20) }}>
          <Txt taille={28} graisse={800} couleur={th.doux}>
            Maintenance
          </Txt>
        </div>
        {/* moyenne de la semaine */}
        <div
          style={{
            position: "absolute",
            left: 40,
            width: xL - 50,
            top: base - Y - moy,
            height: 6,
            borderRadius: 6,
            background: th.accent,
            transformOrigin: "0 50%",
            scale: `${lignePapier} 1`,
            boxShadow: c.theme === "sombre" ? "0 0 20px rgba(255,60,48,0.7)" : undefined,
          }}
        />
        <div style={{ position: "absolute", left: xL, top: base - Y - moy + 20, opacity: lignePapier }}>
          <Txt taille={28} graisse={800} couleur={th.accentTexte} style={{ whiteSpace: "pre" }}>
            {c.f < vrai ? "Moyenne\nsur le papier :\ndéficit" : "Moyenne\nréelle"}
          </Txt>
        </div>
      </Carte>
      {/* les écarts du week-end, en liste à droite (jamais sur le graphique) */}
      <div style={{ position: "absolute", left: 1290, top: 220, width: 480 }}>
        {ecarts.map((e, k) => {
          const t = sp(c.f, e.at, "rebond");
          return (
            <div key={k} data-zone={`ecart-${k}`} style={{ position: "absolute", left: 0, top: k * 130, transformOrigin: "0 50%", transform: `scale(${t})`, opacity: c.f >= e.at ? 1 - c.sortie : 0 }}>
              <div
                data-bloc
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "20px 32px",
                  borderRadius: 60,
                  background: c.theme === "clair" ? "#fff" : "rgba(255,90,80,0.12)",
                  boxShadow: c.theme === "clair" ? th.ombre : "0 0 0 2px rgba(255,90,80,0.45)",
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 42,
                  color: th.encre,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontWeight: 900, color: th.accent }}>+</span>
                {e.texte}
              </div>
            </div>
          );
        })}
        <div
          data-zone="verdict"
          style={{ position: "absolute", left: 0, top: 470, opacity: p(c.f, vrai + 10, vrai + 22) * (1 - c.sortie), translate: `0 ${(1 - p(c.f, vrai + 10, vrai + 26)) * 30}px` }}
        >
          <div data-texte style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: th.encre, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            Résultat :
            <br />
            <span style={{ color: th.accent }}>maintenance.</span>
          </div>
        </div>
      </div>
    </Camera>
  );
};

// ── Fiche exemple : « un gars de 80 kilos qui veut sécher, il mange plutôt bien ».
export const Fiche: React.FC<{ c: Ctx; poids: number; poidsAt: number; objectifAt: number; citationAt: number }> = ({ c, poids, poidsAt, objectifAt, citationAt }) => {
  const th = TH[c.theme];
  const so = styleSortie(c.sortie, "fond");
  const ligne = (at: number, label: string, valeur: React.ReactNode, k: number) => {
    const t = sp(c.f, at, "vif");
    return (
      <div key={k} style={{ position: "absolute", left: 60, right: 60, top: 200 + k * 150, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: c.f >= at ? Math.min(1, t * 2) : 0, translate: `${(1 - t) * 60}px 0` }}>
        <Txt taille={36} graisse={700} couleur={th.doux}>
          {label}
        </Txt>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: th.encre, fontVariantNumeric: "tabular-nums" }}>{valeur}</div>
      </div>
    );
  };
  return (
    <Camera c={c} force={0.4}>
      <Titre texte={"Un exemple\n*très simple*."} zone={{ x: 150, y: 220, w: 640, h: 640 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} max={120} />
      <div style={{ ...so }}>
        <Carte x={880} y={180} w={880} h={720} f={c.f} at={4} depuis="droite" theme={c.theme} ry={-10} nom="fiche">
          <div style={{ position: "absolute", left: 60, top: 54, display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 90, height: 90, borderRadius: 90, background: c.theme === "clair" ? "rgba(23,8,8,0.08)" : "rgba(255,120,100,0.15)", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
              <svg width={70} height={70} viewBox="0 0 24 24" fill={th.doux}>
                <circle cx="12" cy="8" r="4.2" />
                <path d="M3.5 22c0-5 3.8-8 8.5-8s8.5 3 8.5 8z" />
              </svg>
            </div>
            <div>
              <Txt taille={40} graisse={800} couleur={th.encre}>
                L'exemple
              </Txt>
              <Txt taille={26} graisse={600} couleur={th.doux}>
                Un pratiquant comme les autres
              </Txt>
            </div>
          </div>
          {ligne(poidsAt, "Poids", <>{compte(c.f, poidsAt, 26, 60, poids)} kg</>, 0)}
          {ligne(objectifAt, "Objectif", <span style={{ color: th.accent }}>Sécher</span>, 1)}
          {ligne(citationAt, "Son alimentation", <span style={{ fontStyle: "italic", fontSize: 54 }}>« plutôt bien »</span>, 2)}
        </Carte>
      </div>
    </Camera>
  );
};

// ── Deux courbes qui divergent : toi (qui bouges) et ton plan (figé). L'écart se creuse.
export const Ecart: React.FC<{ c: Ctx; titre: string; casse: number }> = ({ c, titre, casse }) => {
  const th = TH[c.theme];
  const X0 = 260;
  const X1 = 1660;
  const yPlan = 720;
  const pts = Array.from({ length: 41 }).map((_, i) => {
    const u = i / 40;
    const y = yPlan - Math.sin(u * 7) * 40 * u - u * u * 230;
    return [X0 + u * (X1 - X0), y] as const;
  });
  const dVie = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const dPlan = `M${X0} ${yPlan} L${X1} ${yPlan}`;
  const tr = p(c.f, 8, 8 + 60, E.inOut);
  const k = Math.min(40, Math.floor(tr * 40));
  const fin = pts[k];
  const crack = p(c.f, casse, casse + 14);
  return (
    <Camera c={c} force={0.4}>
      <Titre texte={titre} zone={{ x: 160, y: 120, w: 1600, h: 240 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align="center" max={110} />
      <div style={{ position: "absolute", inset: 0, ...styleSortie(c.sortie, "fond") }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={dPlan} stroke={th.doux} strokeWidth={6} strokeDasharray="1 0" opacity={0.7 * p(c.f, 4, 12)} strokeLinecap="round" />
          <line x1={fin[0]} y1={fin[1]} x2={fin[0]} y2={yPlan} stroke={th.accent} strokeWidth={3} strokeDasharray="8 8" opacity={p(c.f, 30, 40)} />
        </svg>
        <LigneLumineuse d={dVie} prog={tr} theme={c.theme} epaisseur={6} />
        <div data-zone="label-toi" style={{ position: "absolute", left: X1 - 40, top: pts[40][1] - 110, opacity: p(c.f, 56, 66) }}>
          <Txt taille={40} graisse={800} couleur={th.accentTexte} style={{ textAlign: "right", transform: "translateX(-100%)" }}>
            <span data-texte>Toi, ta vie</span>
          </Txt>
        </div>
        <div data-zone="label-plan" style={{ position: "absolute", left: X0, top: yPlan + 30, opacity: p(c.f, 6, 16) }}>
          <Txt taille={40} graisse={800} couleur={th.doux}>
            <span data-texte>Ton plan, figé</span>
          </Txt>
        </div>
        {crack > 0 ? (
          <div data-zone="casse" style={{ position: "absolute", left: 1000, top: yPlan - 60, display: "flex", alignItems: "center", gap: 12, transform: `scale(${sp(c.f, casse, "rebond")})` }}>
            <Croix taille={80} prog={crack} couleur={th.accent} />
            <Txt taille={44} graisse={900} couleur={th.accent}>
              <span data-texte>Ne marche plus</span>
            </Txt>
          </div>
        ) : null}
      </div>
    </Camera>
  );
};

// ── Trois semaines : les jours se cochent… puis la série casse en semaine 3.
export const Serie: React.FC<{ c: Ctx; titre: string; lache: number }> = ({ c, titre, lache }) => {
  const th = TH[c.theme];
  const so = styleSortie(c.sortie, "fond");
  const cases = Array.from({ length: 21 });
  const taille = 104;
  const gap = 20;
  const x0 = 960 - (7 * taille + 6 * gap) / 2;
  const coupure = 17;
  return (
    <Camera c={c} force={0.4}>
      <Titre texte={titre} zone={{ x: 160, y: 110, w: 1600, h: 240 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align="center" max={120} />
      <div style={{ position: "absolute", inset: 0, ...so }}>
        {[0, 1, 2].map((s) => (
          <div key={s} style={{ position: "absolute", left: x0 - 230, top: 420 + s * (taille + 36) + taille / 2 - 20, opacity: p(c.f, 4 + s * 4, 12 + s * 4) }}>
            <Txt taille={32} graisse={800} couleur={th.doux}>
              Semaine {s + 1}
            </Txt>
          </div>
        ))}
        {cases.map((_, i) => {
          const s = Math.floor(i / 7);
          const j = i % 7;
          const at = 6 + i * Math.max(0.8, (lache - 10) / 21);
          const fait = i < coupure && c.f >= at;
          const rate = i >= coupure && c.f >= lache;
          const t = sp(c.f, at, "vif");
          const chute = i >= coupure ? sp(c.f, lache + (i - coupure) * 2, "lourd") : 0;
          return (
            <div
              key={i}
              data-zone={`jour-${i}`}
              style={{
                position: "absolute",
                left: x0 + j * (taille + gap),
                top: 420 + s * (taille + 36) + chute * 380,
                width: taille,
                height: taille,
                borderRadius: 26,
                background: fait ? th.accent : c.theme === "clair" ? "#fff" : "rgba(255,120,100,0.08)",
                boxShadow: fait ? (c.theme === "sombre" ? "0 0 26px rgba(255,60,48,0.5)" : "0 12px 30px -10px rgba(200,20,20,0.5)") : c.theme === "clair" ? th.ombre : "inset 0 0 0 2px rgba(255,120,100,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                scale: `${0.6 + 0.4 * Math.min(1, t + (fait ? 0 : 1))}`,
                rotate: `${chute * (i % 2 ? 24 : -18)}deg`,
                opacity: (rate ? 1 - chute : 1) * p(c.f, 2 + i * 0.6, 8 + i * 0.6),
              }}
            >
              {fait ? <Coche taille={60} prog={p(c.f, at, at + 10)} fond="rgba(0,0,0,0)" couleur="#fff" /> : null}
            </div>
          );
        })}
      </div>
    </Camera>
  );
};

// ── Anneaux nutrition : un écart (+1 banane) ne change rien au plan.
export const Anneaux: React.FC<{ c: Ctx; titre: string; banane: number; rien: number }> = ({ c, titre, banane, rien }) => {
  const th = TH[c.theme];
  const so = styleSortie(c.sortie, "fond");
  const anneaux = [
    { label: "Calories", base: 0.72 },
    { label: "Protéines", base: 0.8 },
    { label: "Glucides", base: 0.64 },
    { label: "Lipides", base: 0.7 },
  ];
  const bump = sp(c.f, banane, "rebond") * (1 - p(c.f, rien, rien + 20, E.inOut));
  return (
    <Camera c={c} force={0.4}>
      <Titre texte={titre} zone={{ x: 160, y: 110, w: 1600, h: 220 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align="center" max={110} />
      <div style={{ position: "absolute", inset: 0, ...so }}>
        {anneaux.map((a, k) => {
          const R = 120;
          const circ = 2 * Math.PI * R;
          const v = a.base * p(c.f, 6 + k * 3, 30 + k * 3, E.outDoux) + (k < 3 ? 0.06 : 0.02) * bump;
          const cx = 960 - 3 * 190 + k * 380;
          return (
            <div key={k} data-zone={`anneau-${k}`} style={{ position: "absolute", left: cx - R - 30, top: 420, width: 2 * R + 60, height: 2 * R + 140 }}>
              <svg data-bloc width={2 * R + 60} height={2 * R + 60} style={{ rotate: "-90deg" }}>
                <circle cx={R + 30} cy={R + 30} r={R} fill="none" stroke={c.theme === "clair" ? "rgba(23,8,8,0.08)" : "rgba(255,120,100,0.14)"} strokeWidth={24} />
                <circle cx={R + 30} cy={R + 30} r={R} fill="none" stroke={th.accent} strokeWidth={24} strokeLinecap="round" strokeDasharray={`${circ * v} ${circ}`} />
              </svg>
              <div style={{ position: "absolute", left: 0, right: 0, top: R + 30 - 34, textAlign: "center" }}>
                <Txt taille={52} graisse={900} couleur={th.encre} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {Math.round(v * 100)}%
                </Txt>
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 2 * R + 84, textAlign: "center" }}>
                <Txt taille={32} graisse={800} couleur={th.doux}>
                  <span data-texte>{a.label}</span>
                </Txt>
              </div>
            </div>
          );
        })}
        <div
          data-zone="banane"
          style={{ position: "absolute", left: 960, top: 845, transform: `translate(-50%, 0) scale(${sp(c.f, banane, "rebond")})`, opacity: c.f >= banane ? 1 : 0, display: "flex", gap: 30, alignItems: "center" }}
        >
          <div data-bloc style={{ padding: "16px 30px", borderRadius: 60, background: c.theme === "clair" ? "#fff" : "rgba(255,90,80,0.12)", boxShadow: c.theme === "clair" ? th.ombre : "0 0 0 2px rgba(255,90,80,0.45)", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: th.encre, whiteSpace: "nowrap" }}>
            + 1 banane
          </div>
          {c.f >= rien ? (
            <div data-bloc style={{ display: "flex", alignItems: "center", gap: 14, opacity: p(c.f, rien, rien + 10) }}>
              <Coche taille={64} prog={p(c.f, rien, rien + 16)} fond={th.accent} />
              <Txt taille={44} graisse={900} couleur={th.encre}>
                Le plan tient
              </Txt>
            </div>
          ) : null}
        </div>
      </div>
    </Camera>
  );
};

// ── Repas de la journée : un repas sauté, le suivant s'adapte, le déjà-mangé est verrouillé.
export const Repas: React.FC<{ c: Ctx; saute: number; adapte: number; verrou: number; base: number; titre?: string }> = ({ c, saute, adapte, verrou, base, titre }) => {
  const th = TH[c.theme];
  const so = styleSortie(c.sortie, "fond");
  const repas = ["Repas 1", "Repas 2", "Repas 3", "Repas 4"];
  const w = 330;
  const gap = 40;
  const x0 = 960 - (4 * w + 3 * gap) / 2;
  const hs = [260, 300, 280, 240];
  return (
    <Camera c={c} force={0.4}>
      {titre ? <Titre texte={titre} zone={{ x: 160, y: 100, w: 1600, h: 220 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align="center" max={110} /> : null}
      <div style={{ position: "absolute", inset: 0, ...so }}>
        {repas.map((r, k) => {
          const t = sp(c.f, 4 + k * 3, "souple");
          const estSaute = k === 1 && c.f >= saute;
          const grandit = k === 2 ? sp(c.f, adapte, "rebond") : 0;
          const lock = k === 0 ? p(c.f, verrou, verrou + 12) : 0;
          const h = hs[k] * (estSaute ? 1 - 0.55 * p(c.f, saute, saute + 14) : 1) + grandit * 140;
          return (
            <div key={k} data-zone={`repas-${k}`} style={{ position: "absolute", left: x0 + k * (w + gap), top: 360, width: w, height: 520 }}>
              <div
                data-bloc
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 120,
                  height: h,
                  borderRadius: 30,
                  background: estSaute ? "transparent" : k === 2 && grandit > 0 ? `linear-gradient(180deg, ${th.accent}, ${c.theme === "clair" ? "#A30A0F" : "#8A1410"})` : c.theme === "clair" ? "#fff" : "rgba(255,120,100,0.12)",
                  border: estSaute ? `3px dashed ${th.doux}` : "none",
                  boxShadow: estSaute ? undefined : c.theme === "clair" ? th.ombre : "inset 0 0 0 2px rgba(255,120,100,0.3)",
                  transform: `translateY(${(1 - t) * 300}px)`,
                  opacity: Math.min(1, t * 2),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {estSaute ? <Croix taille={90} prog={p(c.f, saute, saute + 14)} couleur={th.accent} /> : null}
                {k === 0 ? (
                  <svg width={70} height={70} viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth={2.2} strokeLinecap="round" style={{ opacity: lock }}>
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                ) : null}
                {k === 2 && grandit > 0 ? (
                  <Txt taille={36} graisse={900} couleur="#fff">
                    s'adapte
                  </Txt>
                ) : null}
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", opacity: Math.min(1, t * 2) }}>
                <Txt taille={36} graisse={800} couleur={estSaute ? th.doux : th.encre}>
                  <span data-texte>{r}</span>
                </Txt>
              </div>
            </div>
          );
        })}
        <div data-zone="plan-base" style={{ position: "absolute", left: x0, top: 930, width: 4 * w + 3 * gap, opacity: p(c.f, base, base + 12), translate: `0 ${(1 - p(c.f, base, base + 16)) * 30}px` }}>
          <div data-bloc style={{ display: "flex", alignItems: "center", gap: 18, justifyContent: "center" }}>
            <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth={2.4} strokeLinecap="round">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <Txt taille={46} graisse={900} couleur={th.encre}>
              Plan de base : <span style={{ color: th.accent }}>il ne bouge jamais</span>
            </Txt>
          </div>
        </div>
      </div>
    </Camera>
  );
};

// ── Chiffres en vrac qui se rangent en une phrase claire (morphing).
export const ChiffresPhrase: React.FC<{ c: Ctx; range: number; titre: string }> = ({ c, range, titre }) => {
  const th = TH[c.theme];
  const r = p(c.f, range, range + 26, E.inOut);
  const so = styleSortie(c.sortie, "fond");
  const N = 24;
  return (
    <Camera c={c} force={0.4}>
      <div style={{ position: "absolute", inset: 0, ...so }}>
        {Array.from({ length: N }).map((_, k) => {
          // grille 4 × 6 avec un léger désordre : « en vrac » mais jamais l'un sur l'autre
          const col = k % 4;
          const lig = Math.floor(k / 4);
          const x = 1080 + col * 190 + (hash(k * 3) - 0.5) * 40;
          const y = 200 + lig * 128 + (hash(k * 5) - 0.5) * 30;
          const v = (10 + hash(k * 7) * 90).toFixed(hash(k) > 0.5 ? 1 : 0).replace(".", ",");
          const tx = 1320;
          const ty = 540;
          const flot = Math.sin((c.f + k * 13) / 18) * 6 * (1 - r);
          const z = hash(k * 9);
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: x + (tx - x) * r,
                top: y + (ty - y) * r + flot,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 34 + z * 22,
                color: th.doux,
                opacity: (0.35 + z * 0.45) * (1 - r) * p(c.f, k * 0.6, 8 + k * 0.6),
                filter: `blur(${(1 - z) * 2 + r * 8}px)`,
                translate: "-50% -50%",
              }}
            >
              {v}
            </div>
          );
        })}
        <Carte x={1010} y={330} w={660} h={420} f={c.f} at={range + 14} depuis="profondeur" theme={c.theme} nom="phrase-claire">
          <div style={{ position: "absolute", left: 44, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
            <Coche taille={56} prog={p(c.f, range + 26, range + 40)} fond={th.accent} />
            <Txt taille={34} graisse={800} couleur={th.encre}>
              Ton point de la semaine
            </Txt>
          </div>
          {[0.92, 0.84, 0.6].map((wl, k) => (
            <div key={k} style={{ position: "absolute", left: 44, top: 150 + k * 66, width: (660 - 88) * wl * p(c.f, range + 22 + k * 4, range + 36 + k * 4, E.out), height: 26, borderRadius: 14, background: k === 2 ? th.accent : c.theme === "clair" ? "rgba(23,8,8,0.12)" : "rgba(255,140,120,0.2)" }} />
          ))}
        </Carte>
      </div>
      <Titre texte={titre} zone={{ x: 150, y: 200, w: 760, h: 680 }} theme={c.theme} f={c.f} debut={4} sortie={c.sortie} max={120} />
    </Camera>
  );
};

