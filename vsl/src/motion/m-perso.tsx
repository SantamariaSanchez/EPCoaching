import React from "react";
import { Img, staticFile } from "remotion";
import { E, p, sp } from "./anim";
import { Ctx } from "./Beats";
import { Camera } from "./modules";
import { Carte, Coche, Photo, Txt } from "./Kit";
import { Titre } from "./Titre";
import { FONT, TH } from "./tokens";

// ── Identité : la vraie photo + le nom public, en grand.
export const Identite: React.FC<{ c: Ctx }> = ({ c }) => {
  const th = TH[c.theme];
  const puce = sp(c.f, 22, "rebond");
  return (
    <Camera c={c} force={0.5}>
      <Carte x={150} y={110} w={640} h={860} f={c.f} at={0} depuis="gauche" theme={c.theme} ry={9 + Math.sin(c.f / 40) * 2} rx={2} nom="portrait" sortie={c.sortie}>
        <Photo src="hero_current.jpg" f={c.f} d={c.d} pos="50% 25%" zoom={[1.14, 1.02]} />
      </Carte>
      <Titre texte={"Emmanuel\n*Santamaria*\nSanchéz"} zone={{ x: 900, y: 220, w: 870, h: 500 }} theme={c.theme} f={c.f} debut={4} sortie={c.sortie} max={140} surtitre="Moi, c'est" />
      <div data-zone="fondateur" style={{ position: "absolute", left: 900, top: 760, transformOrigin: "0 50%", transform: `scale(${puce})`, opacity: Math.min(1, puce * 2) * (1 - c.sortie) }}>
        <div data-bloc style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "18px 34px", borderRadius: 60, background: "#fff", boxShadow: th.ombre }}>
          <Img src={staticFile("img/logo.png")} style={{ height: 44 }} />
          <Txt taille={36} graisse={800} couleur={th.encre}>
            Fondateur d'EP Coaching
          </Txt>
        </div>
      </div>
    </Camera>
  );
};

// ── Compétition : carte « Heroes Cup » qui se construit, puis les mentions s'y cochent.
export const Competition: React.FC<{ c: Ctx; classic: number; federation: number }> = ({ c, classic, federation }) => {
  const th = TH[c.theme];
  const brille = p(c.f, 10, 40, E.inOut);
  const ligne = (at: number, texte: string, k: number) => {
    const t = sp(c.f, at, "vif");
    return (
      <div key={k} style={{ position: "absolute", left: 60, top: 400 + k * 120, display: "flex", alignItems: "center", gap: 22, opacity: c.f >= at ? Math.min(1, t * 2) : 0, translate: `${(1 - t) * 50}px 0` }}>
        <Coche taille={64} prog={p(c.f, at + 4, at + 18)} fond={th.accent} />
        <Txt taille={40} graisse={800} couleur={th.encre}>
          {texte}
        </Txt>
      </div>
    );
  };
  return (
    <Camera c={c} force={0.5}>
      <Titre texte={"Je prépare\nla *Heroes Cup*."} zone={{ x: 150, y: 200, w: 760, h: 680 }} theme={c.theme} f={c.f} debut={4} sortie={c.sortie} max={130} />
      <Carte x={990} y={170} w={780} h={740} f={c.f} at={0} depuis="profondeur" theme={c.theme} ry={-12} rx={6} nom="heroes" sortie={c.sortie}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,180,160,0.18) 45%, rgba(255,255,255,0) 60%)",
            translate: `${(brille * 2 - 1) * 900}px 0`,
          }}
        />
        <div style={{ position: "absolute", left: 60, top: 60 }}>
          <Txt taille={28} graisse={700} couleur={th.accentTexte} style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Compétition
          </Txt>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 112, color: th.encre, letterSpacing: "-0.03em", lineHeight: 1, marginTop: 18, textShadow: "0 0 40px rgba(255,60,48,0.35)" }}>
            HEROES
            <br />
            <span style={{ color: th.accent }}>CUP</span>
          </div>
        </div>
        {ligne(classic, "Classic Physique", 0)}
        {ligne(federation, "Fédération naturelle testée", 1)}
      </Carte>
    </Camera>
  );
};

// ── Invisible : ton profil de coach s'efface (« tes clients ne te voient pas »).
export const Invisible: React.FC<{ c: Ctx; titre: string }> = ({ c, titre }) => {
  const th = TH[c.theme];
  const efface = p(c.f, 18, 44, E.inOut);
  const oeil = sp(c.f, 30, "rebond");
  return (
    <Camera c={c} force={0.4}>
      <Titre texte={titre} zone={{ x: 150, y: 200, w: 780, h: 680 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} max={120} />
      <Carte x={1040} y={210} w={700} h={660} f={c.f} at={0} depuis="droite" theme={c.theme} ry={-10} nom="profil" sortie={c.sortie} style={{ opacity: 1 - efface * 0.82, filter: `blur(${efface * 6}px)` }}>
        <div style={{ position: "absolute", left: 50, top: 50, display: "flex", gap: 28, alignItems: "center" }}>
          <div style={{ width: 130, height: 130, borderRadius: 130, background: "rgba(255,120,100,0.2)" }} />
          <div>
            <Txt taille={44} graisse={800} couleur={th.encre}>
              Ton profil
            </Txt>
            <Txt taille={28} graisse={600} couleur={th.doux}>
              Coach
            </Txt>
          </div>
        </div>
        <div style={{ position: "absolute", left: 50, right: 50, top: 230, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {Array.from({ length: 9 }).map((_, k) => (
            <div key={k} style={{ height: 120, borderRadius: 16, background: "rgba(255,120,100,0.14)" }} />
          ))}
        </div>
      </Carte>
      <div data-zone="oeil" style={{ position: "absolute", left: 1390, top: 540, transform: `translate(-50%, -50%) scale(${oeil})`, opacity: c.f >= 30 ? 1 - c.sortie : 0 }}>
        <svg data-bloc width={200} height={200} viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth={1.6} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 20px rgba(255,60,48,0.7))" }}>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
          <path d="M3 3l18 18" />
        </svg>
      </div>
    </Camera>
  );
};

// ── Soirées : l'heure avance, les fenêtres s'empilent (tableaux, messages, fichiers).
export const Soirees: React.FC<{ c: Ctx; titre: string; fenetres: { texte: string; at: number }[] }> = ({ c, titre, fenetres }) => {
  const th = TH[c.theme];
  const minutes = Math.round(21 * 60 + Math.min(1, c.f / Math.max(1, c.d - 10)) * (2 * 60 + 47));
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return (
    <Camera c={c} force={0.4}>
      <Titre texte={titre} zone={{ x: 150, y: 150, w: 780, h: 380 }} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} max={120} />
      <div data-zone="horloge" style={{ position: "absolute", left: 150, top: 600, opacity: p(c.f, 6, 14) * (1 - c.sortie), display: "flex", alignItems: "center", gap: 26 }}>
        <svg width={90} height={90} viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth={2} strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d={`M12 12 L${12 + 5 * Math.sin((((minutes / 60) % 12) / 12) * Math.PI * 2)} ${12 - 5 * Math.cos((((minutes / 60) % 12) / 12) * Math.PI * 2)}`} />
          <path d={`M12 12 L${12 + 7 * Math.sin(((minutes % 60) / 60) * Math.PI * 2)} ${12 - 7 * Math.cos(((minutes % 60) / 60) * Math.PI * 2)}`} />
        </svg>
        <div data-texte style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: th.encre, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em", textShadow: "0 0 40px rgba(255,60,48,0.3)" }}>
          {hh}:{mm}
        </div>
      </div>
      {fenetres.map((fe, k) => (
        <Carte key={k} x={1020 + k * 50} y={170 + k * 230} w={680} h={200} f={c.f} at={fe.at} depuis="droite" ressort="vif" theme={c.theme} ry={-12} nom={`fenetre-${k}`} sortie={c.sortie}>
          <div style={{ position: "absolute", left: 30, top: 26, display: "flex", gap: 10 }}>
            {[0, 1, 2].map((j) => (
              <div key={j} style={{ width: 16, height: 16, borderRadius: 16, background: j === 0 ? th.accent : "rgba(255,140,120,0.3)" }} />
            ))}
          </div>
          <Txt taille={46} graisse={800} couleur={th.encre} style={{ position: "absolute", left: 30, top: 74 }}>
            {fe.texte}
          </Txt>
          <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, height: 14, borderRadius: 8, background: "rgba(255,140,120,0.18)" }} />
        </Carte>
      ))}
    </Camera>
  );
};
