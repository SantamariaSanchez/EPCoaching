import React from "react";
import { E, p, sp } from "./anim";
import { Ctx } from "./Beats";
import { Camera } from "./modules";
import { Coche, compte, Croix, LigneLumineuse, Pastille, styleSortie, Txt } from "./Kit";
import { Titre } from "./Titre";
import { FONT, Rect, TH } from "./tokens";

// ── Point numéroté : grand numéro au trait + titre (structure « Premier point, deuxième… »).
export const Point: React.FC<{ c: Ctx; num: string; texte: string; max?: number }> = ({ c, num, texte, max = 140 }) => {
  const th = TH[c.theme];
  const t = sp(c.f, 0, "lourd");
  const so = styleSortie(c.sortie, "gauche");
  const trait = p(c.f, 6, 26, E.out);
  return (
    <Camera c={c}>
      <div data-zone="point-num" style={{ position: "absolute", left: 150, top: 300, width: 470, height: 420, ...so }}>
        <div
          data-texte
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 380,
            lineHeight: 1,
            letterSpacing: "-0.05em",
            color: "transparent",
            WebkitTextStroke: `4px ${th.accent}`,
            translate: `${(1 - t) * -160}px 0`,
            opacity: Math.min(1, t * 2),
            textShadow: c.theme === "sombre" ? `0 0 40px rgba(255,60,48,${0.35 * trait})` : undefined,
          }}
        >
          {num}
        </div>
      </div>
      <div style={{ position: "absolute", left: 640, top: 330, width: 5, height: 420 * trait, background: th.accent, borderRadius: 4, boxShadow: c.theme === "sombre" ? "0 0 18px rgba(255,60,48,0.7)" : undefined, opacity: 1 - c.sortie }} />
      <Titre texte={texte} zone={{ x: 700, y: 220, w: 1080, h: 640 }} theme={c.theme} f={c.f} debut={8} sortie={c.sortie} max={max} />
    </Camera>
  );
};

// ── Liste : titre + éléments qui arrivent sur la voix (coche, croix ou puce).
export type Item = { texte: string; at: number; etat?: "ok" | "non" | "neutre"; icone?: React.ReactNode; barre?: boolean };
export const Liste: React.FC<{ c: Ctx; titre?: string; items: Item[]; zoneTitre?: Rect; zoneListe?: Rect; taille?: number; tampon?: { at: number; texte: string } }> = ({
  c,
  titre,
  items,
  zoneTitre,
  zoneListe,
  taille = 78,
  tampon,
}) => {
  const th = TH[c.theme];
  const zt = zoneTitre ?? { x: 150, y: 140, w: 1620, h: 220 };
  const zl = zoneListe ?? (titre ? { x: 300, y: 420, w: 1320, h: 560 } : { x: 300, y: 220, w: 1320, h: 640 });
  const pas = Math.min(170, zl.h / Math.max(1, items.length));
  const so = styleSortie(c.sortie, "haut");
  return (
    <Camera c={c} force={0.5}>
      {titre ? <Titre texte={titre} zone={zt} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} max={120} align="left" /> : null}
      {items.map((it, k) => {
        const t = sp(c.f, it.at, "vif");
        const marque = p(c.f, it.at + 6, it.at + 22);
        const barre = it.barre || it.etat === "non" ? p(c.f, it.at + 10, it.at + 24, E.inOut) : 0;
        return (
          <div
            key={k}
            data-zone={`item-${k}`}
            style={{
              position: "absolute",
              left: zl.x,
              top: zl.y + k * pas + (pas - taille * 1.5) / 2,
              display: "flex",
              alignItems: "center",
              gap: 34,
              opacity: Math.min(1, t * 2) * (c.f < it.at ? 0 : 1),
              translate: `${(1 - t) * -80}px 0`,
              filter: `blur(${(1 - t) * 8}px)`,
              ...so,
            }}
          >
            {it.etat === "ok" ? (
              <Coche taille={taille * 1.2} prog={marque} fond={th.accent} />
            ) : it.etat === "non" ? (
              <div style={{ width: taille * 1.2, height: taille * 1.2, borderRadius: taille, border: `3px solid ${th.accent}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Croix taille={taille * 0.7} prog={marque} couleur={th.accent} />
              </div>
            ) : (
              <div style={{ width: taille * 1.2, height: taille * 1.2, borderRadius: taille, background: c.theme === "clair" ? "#fff" : "rgba(255,90,80,0.12)", boxShadow: c.theme === "clair" ? th.ombre : "0 0 0 2px rgba(255,90,80,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {it.icone ?? <div style={{ width: taille * 0.3, height: taille * 0.3, borderRadius: taille, background: th.accent }} />}
              </div>
            )}
            <div data-texte style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontSize: taille, color: it.etat === "non" ? th.doux : th.encre, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
              {it.texte}
              {barre > 0 ? (
                <div style={{ position: "absolute", left: -6, top: "54%", height: Math.max(5, taille * 0.09), width: `calc(${barre * 100}% + 12px)`, background: th.accent, borderRadius: 4 }} />
              ) : null}
            </div>
          </div>
        );
      })}
      {tampon ? <Tampon c={c} at={tampon.at} texte={tampon.texte} x={1470} y={zl.y + zl.h / 2} /> : null}
    </Camera>
  );
};

// Tampon (cachet qui s'abat, avec rebond).
export const Tampon: React.FC<{ c: Ctx; at: number; texte: string; x: number; y: number }> = ({ c, at, texte, x, y }) => {
  const t = sp(c.f, at, "rebond");
  if (c.f < at) return null;
  const th = TH[c.theme];
  return (
    <div data-zone="tampon" style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(-12deg) scale(${1.6 - 0.6 * t})`, opacity: Math.min(1, t * 3) * (1 - c.sortie) }}>
      <div
        data-bloc
        style={{
          padding: "20px 40px",
          border: `8px solid ${th.accent}`,
          borderRadius: 20,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 76,
          color: th.accent,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        {texte}
      </div>
    </div>
  );
};

// ── Arbre de pastilles (référence 2) : un moyeu en haut, des pastilles reliées par des lignes lumineuses.
export const Arbre: React.FC<{
  c: Ctx;
  moyeu: { texte: string; at: number; compteur?: [number, number] };
  pastilles: { valeur: React.ReactNode; legende: string; at: number; icone?: React.ReactNode }[];
  titre?: string;
}> = ({ c, moyeu, pastilles, titre }) => {
  const th = TH[c.theme];
  const n = pastilles.length;
  const yHub = titre ? 450 : 330;
  const yP = titre ? 780 : 720;
  const largeur = Math.min(1600, n * 520);
  const xs = pastilles.map((_, k) => 960 - largeur / 2 + (largeur / n) * (k + 0.5));
  const so = styleSortie(c.sortie, "fond");
  const th0 = sp(c.f, moyeu.at, "rebond");
  return (
    <Camera c={c} force={0.4}>
      {titre ? <Titre texte={titre} zone={{ x: 160, y: 110, w: 1600, h: 220 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align="center" max={110} /> : null}
      <div style={{ position: "absolute", inset: 0, ...so }}>
        {pastilles.map((pa, k) => {
          const d = `M960 ${yHub + 60} L960 ${(yHub + yP) / 2} L${xs[k]} ${(yHub + yP) / 2} L${xs[k]} ${yP - 60}`;
          return <LigneLumineuse key={k} d={d} prog={p(c.f, pa.at - 10, pa.at + 4, E.inOut)} theme={c.theme} epaisseur={4} />;
        })}
        <div data-zone="moyeu" style={{ position: "absolute", left: 960, top: yHub, transform: `translate(-50%, -50%) scale(${th0})`, opacity: Math.min(1, th0 * 2) }}>
          <div
            data-texte
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 110,
              color: th.encre,
              textShadow: c.theme === "sombre" ? "0 0 40px rgba(255,60,48,0.45)" : undefined,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
              letterSpacing: "-0.03em",
            }}
          >
            {moyeu.compteur ? compte(c.f, moyeu.at, 24, moyeu.compteur[0], moyeu.compteur[1]) : null}
            {moyeu.compteur ? " " : null}
            <span style={{ color: th.accent }}>{moyeu.texte}</span>
          </div>
        </div>
        {pastilles.map((pa, k) => (
          <Pastille key={k} x={xs[k]} y={yP} f={c.f} at={pa.at} theme={c.theme} valeur={pa.valeur} icone={pa.icone} legende={pa.legende} allume={p(c.f, pa.at, pa.at + 12)} nom={`pastille-${k}`} taille={1.35} />
        ))}
      </div>
    </Camera>
  );
};

// ── Rangée de pastilles (une par mot) : « ma diète, mon training, mon sommeil, mon agenda ».
export const Rangee: React.FC<{ c: Ctx; titre?: string; items: { texte: string; at: number; icone?: React.ReactNode; valeur?: string }[]; inconnu?: boolean }> = ({
  c,
  titre,
  items,
  inconnu,
}) => {
  const th = TH[c.theme];
  const n = items.length;
  const w = Math.min(400, 1640 / n - 30);
  const gap = 30;
  const total = n * w + (n - 1) * gap;
  const x0 = (1920 - total) / 2;
  const y = titre ? 470 : 320;
  const so = styleSortie(c.sortie, "haut");
  return (
    <Camera c={c} force={0.5}>
      {titre ? <Titre texte={titre} zone={{ x: 160, y: 130, w: 1600, h: 240 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align="center" max={120} /> : null}
      {items.map((it, k) => {
        const t = sp(c.f, it.at, "rebond");
        const allume = p(c.f, it.at, it.at + 10);
        const flotte = Math.sin((c.f + k * 17) / 22) * 8;
        return (
          <div key={k} data-zone={`tuile-${k}`} style={{ position: "absolute", left: x0 + k * (w + gap), top: y + flotte, width: w, height: 440, ...so }}>
            <div
              data-bloc
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 40,
                background: c.theme === "clair" ? "#fff" : "linear-gradient(180deg, #2A0B09 0%, #150505 100%)",
                boxShadow:
                  c.theme === "clair"
                    ? `${th.ombre}, 0 0 0 ${3 * allume}px rgba(215,21,28,${0.8 * allume})`
                    : `0 0 0 ${2 + allume * 1.5}px rgba(255,74,61,${0.25 + 0.7 * allume}), 0 0 ${50 * allume}px rgba(255,60,48,${0.45 * allume}), inset 0 0 30px rgba(255,60,48,${0.2 * allume})`,
                transform: `translateY(${(1 - t) * 200}px) scale(${0.7 + 0.3 * t})`,
                opacity: Math.min(1, t * 2),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 26,
              }}
            >
              <div style={{ scale: `${1.1 + 0.3 * allume}` }}>{it.icone}</div>
              <div data-texte style={{ fontFamily: FONT, fontWeight: 800, fontSize: Math.min(54, (w - 56) / (Math.max(...it.texte.split("\n").map((l) => l.length)) * 0.6)), lineHeight: 1.08, color: th.encre, textAlign: "center", whiteSpace: "pre-line" }}>
                {it.texte}
              </div>
              {inconnu || it.valeur ? (
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: th.accent, opacity: p(c.f, it.at + 8, it.at + 16), lineHeight: 1 }}>{it.valeur ?? "?"}</div>
              ) : null}
            </div>
          </div>
        );
      })}
    </Camera>
  );
};

// ── Chemin : étapes reliées par une ligne lumineuse, un point lumineux voyage de l'une à l'autre.
export const Chemin: React.FC<{ c: Ctx; titre?: string; etapes: { texte: string; at: number; sous?: string }[]; vertical?: boolean; final?: { at: number; texte: string } }> = ({
  c,
  titre,
  etapes,
  vertical,
  final,
}) => {
  const th = TH[c.theme];
  const n = etapes.length;
  const so = styleSortie(c.sortie, "fond");
  const pos = etapes.map((_, k) =>
    vertical ? { x: 900, y: 170 + (k * 740) / Math.max(1, n - 1) } : { x: 360 + (k * 1200) / Math.max(1, n - 1), y: titre ? 640 : 540 },
  );
  const d = pos.map((q, k) => `${k ? "L" : "M"}${q.x} ${q.y}`).join(" ");
  // progression : jusqu'à l'étape courante
  let prog = 0;
  etapes.forEach((e, k) => {
    if (k > 0) prog = Math.max(prog, ((k - 1) + p(c.f, e.at - 12, e.at, E.inOut)) / Math.max(1, n - 1));
  });
  const dernier = etapes.filter((e) => c.f >= e.at - 12).length - 1;
  return (
    <Camera c={c} force={0.4}>
      {titre ? (
        <Titre
          texte={titre}
          zone={vertical ? { x: 150, y: 200, w: 640, h: 680 } : { x: 160, y: 130, w: 1600, h: 240 }}
          theme={c.theme}
          f={c.f}
          debut={2}
          sortie={c.sortie}
          align={vertical ? "left" : "center"}
          max={vertical ? 110 : 120}
        />
      ) : null}
      <div style={{ position: "absolute", inset: 0, ...so }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={d} fill="none" stroke={c.theme === "clair" ? "rgba(23,8,8,0.12)" : "rgba(255,120,100,0.18)"} strokeWidth={4} strokeDasharray="10 12" />
        </svg>
        <LigneLumineuse d={d} prog={prog} theme={c.theme} epaisseur={5} />
        {etapes.map((e, k) => {
          const t = sp(c.f, e.at, "rebond");
          const actif = k === Math.max(0, dernier);
          const q = pos[k];
          return (
            <React.Fragment key={k}>
              <div
                style={{
                  position: "absolute",
                  left: q.x - 34,
                  top: q.y - 34,
                  width: 68,
                  height: 68,
                  borderRadius: 68,
                  background: c.f >= e.at ? th.accent : c.theme === "clair" ? "#fff" : "#1a0606",
                  boxShadow: `0 0 0 4px ${th.accent}, 0 0 ${actif ? 40 : 0}px rgba(255,60,48,0.6)`,
                  scale: `${0.6 + 0.4 * Math.max(0.3, t)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Txt taille={28} graisse={900} couleur={c.f >= e.at ? "#fff" : th.accent}>
                  {k + 1}
                </Txt>
              </div>
              <div
                data-zone={`etape-${k}`}
                style={{
                  position: "absolute",
                  left: vertical ? q.x + 70 : q.x,
                  top: vertical ? q.y - 32 : q.y + 70,
                  transform: vertical ? undefined : "translateX(-50%)",
                  textAlign: vertical ? "left" : "center",
                  opacity: p(c.f, e.at, e.at + 10),
                }}
              >
                <div data-texte style={{ fontFamily: FONT, fontWeight: 800, fontSize: vertical ? 54 : 44, color: th.encre, whiteSpace: "nowrap" }}>
                  {e.texte}
                </div>
                {e.sous ? (
                  <div data-texte style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, color: th.doux, whiteSpace: "nowrap", marginTop: 6 }}>
                    {e.sous}
                  </div>
                ) : null}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {final ? (
        <div
          data-zone="chemin-final"
          style={{
            position: "absolute",
            left: 960,
            top: titre ? 790 : 760,
            transform: `translate(-50%, 0) scale(${sp(c.f, final.at, "rebond")})`,
            opacity: c.f >= final.at ? 1 - c.sortie : 0,
          }}
        >
          <div data-texte style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, letterSpacing: "-0.03em", color: th.accent, whiteSpace: "nowrap", textShadow: c.theme === "sombre" ? "0 0 40px rgba(255,60,48,0.5)" : undefined }}>
            {final.texte}
          </div>
        </div>
      ) : null}
    </Camera>
  );
};

// ── Équation : A + B = C (pratiquant + coach = la même solution).
export const Equation: React.FC<{ c: Ctx; gauche: { texte: string; at: number }[]; droite: { texte: string; at: number }[]; egal: number; titre?: string }> = ({
  c,
  gauche,
  droite,
  egal,
  titre,
}) => {
  const th = TH[c.theme];
  const so = styleSortie(c.sortie, "fond");
  const bloc = (txt: string, at: number, x: number, y: number, accent: boolean, nom: string) => {
    const t = sp(c.f, at, "rebond");
    return (
      <div key={nom} data-zone={nom} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${t})`, opacity: c.f >= at ? Math.min(1, t * 2) : 0 }}>
        <div
          data-bloc
          style={{
            padding: "30px 56px",
            borderRadius: 90,
            background: accent ? th.accent : c.theme === "clair" ? "#fff" : "rgba(255,90,80,0.1)",
            boxShadow: accent ? "0 20px 50px -14px rgba(200,20,20,0.6)" : c.theme === "clair" ? th.ombre : "0 0 0 2px rgba(255,90,80,0.4)",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 74,
            color: accent ? "#fff" : th.encre,
            whiteSpace: "nowrap",
          }}
        >
          {txt}
        </div>
      </div>
    );
  };
  const e = sp(c.f, egal, "rebond");
  return (
    <Camera c={c} force={0.4}>
      {titre ? <Titre texte={titre} zone={{ x: 160, y: 120, w: 1600, h: 220 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align="center" max={110} /> : null}
      <div style={{ position: "absolute", inset: 0, ...so }}>
        {gauche.map((g, k) => bloc(g.texte, g.at, 470, 500 + k * 220, false, `eq-g-${k}`))}
        <div style={{ position: "absolute", left: 960 - 80, top: 610 - 80, width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center", scale: `${e}`, opacity: c.f >= egal ? 1 : 0 }}>
          <Txt taille={180} graisse={900} couleur={th.accent}>
            =
          </Txt>
        </div>
        {droite.map((g, k) => bloc(g.texte, g.at, 1420, 500 + k * 220, true, `eq-d-${k}`))}
      </div>
    </Camera>
  );
};

