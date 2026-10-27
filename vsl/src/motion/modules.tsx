import React from "react";
import { interpolate } from "remotion";
import { cl, derive, E, hash, logZoom, p, sp } from "./anim";
import { Ctx } from "./Beats";
import { Carte, Coche, LigneLumineuse, Photo, styleSortie, Txt } from "./Kit";
import { Titre } from "./Titre";
import { FONT, Rect, ROUGE, TH, Theme, Z } from "./tokens";
import { Calendrier, Halteres } from "./Icones";

// Petite poussée de caméra continue : aucun plan n'est jamais figé.
export const Camera: React.FC<{ c: Ctx; force?: number; children: React.ReactNode; seed?: number }> = ({ c, force = 1, children, seed = 0 }) => {
  const dr = derive(c.f, force, seed);
  const k = logZoom(Math.min(1, c.f / Math.max(1, c.d)), 1, 1 + 0.035 * force);
  return (
    <div style={{ position: "absolute", inset: 0, scale: `${k}`, translate: `${dr.x}px ${dr.y}px`, rotate: `${dr.r}deg` }}>{children}</div>
  );
};

// ── Titre seul, centré, plein cadre.
export const TitreSeul: React.FC<{ c: Ctx; texte: string; max?: number; surtitre?: string; align?: "left" | "center"; zone?: Rect; style?: "lettres" | "mots" | "impact"; point?: boolean }> = ({
  c,
  texte,
  max = 170,
  surtitre,
  align = "center",
  zone = Z.plein,
  style,
  point,
}) => (
  <Camera c={c}>
    <Titre texte={texte} zone={zone} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align={align} max={max} surtitre={surtitre} style={style} />
    {point ? <Point c={c} /> : null}
  </Camera>
);

// Point rouge qui tombe et rebondit (clin d'œil à la référence Pinterest).
const Point: React.FC<{ c: Ctx }> = ({ c }) => {
  const t = sp(c.f, 16, "rebond");
  const y = interpolate(t, [0, 1], [-300, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 1920 / 2 - 14,
        top: 860 + y,
        width: 28,
        height: 28,
        borderRadius: 28,
        background: TH[c.theme].accent,
        opacity: p(c.f, 16, 20) * (1 - c.sortie),
        boxShadow: c.theme === "sombre" ? "0 0 24px rgba(255,60,48,0.7)" : undefined,
      }}
    />
  );
};

// ── Photo réelle + titre (photo d'un côté, titre de l'autre, zones disjointes).
export const PhotoTitre: React.FC<{
  c: Ctx;
  src: string;
  texte: string;
  pos?: string;
  cote?: "droite" | "gauche";
  surtitre?: string;
  reflet?: boolean;
  etiquette?: string;
  max?: number;
  format?: "portrait" | "carre";
}> = ({ c, src, texte, pos, cote = "droite", surtitre, reflet, etiquette, max = 150, format = "portrait" }) => {
  const w = format === "portrait" ? 560 : 640;
  const h = format === "portrait" ? 760 : 620;
  const zoneV = cote === "droite" ? Z.droite : Z.gaucheVisuel;
  const x = zoneV.x + (zoneV.w - w) / 2;
  const y = zoneV.y + (zoneV.h - h) / 2;
  const zt = cote === "droite" ? Z.gauche : Z.droiteTexte;
  const ry = (cote === "droite" ? -9 : 9) + Math.sin(c.f / 40) * 2;
  const balaye = p(c.f, 22, 52, E.inOut);
  return (
    <Camera c={c} force={0.6}>
      <Carte x={x} y={y} w={w} h={h} f={c.f} at={0} depuis={cote === "droite" ? "droite" : "gauche"} theme={c.theme} ry={ry} rx={3} nom="photo" sortie={c.sortie}>
        <Photo src={src} f={c.f} d={c.d} pos={pos} />
        {reflet ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0) 60%)",
              translate: `${interpolate(balaye, [0, 1], [-700, 700])}px 0`,
            }}
          />
        ) : null}
        {etiquette ? (
          <div
            style={{
              position: "absolute",
              left: 28,
              bottom: 28,
              padding: "14px 22px",
              borderRadius: 40,
              background: c.theme === "clair" ? "rgba(255,255,255,0.92)" : "rgba(20,5,5,0.85)",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 26,
              color: TH[c.theme].encre,
              opacity: p(c.f, 18, 28),
              translate: `0 ${(1 - p(c.f, 18, 30)) * 20}px`,
            }}
          >
            {etiquette}
          </div>
        ) : null}
      </Carte>
      <Titre texte={texte} zone={zt} theme={c.theme} f={c.f} debut={6} sortie={c.sortie} align="left" max={max} surtitre={surtitre} />
    </Camera>
  );
};

// ── Courbe de progression (plate ou montante), carte UI.
export const Courbe: React.FC<{ c: Ctx; texte: string; mode?: "plate" | "monte" | "chaos"; titreCarte?: string; legende?: string }> = ({
  c,
  texte,
  mode = "plate",
  titreCarte = "Progression",
  legende = "8 dernières semaines",
}) => {
  const th = TH[c.theme];
  const X = 360;
  const Y = 420;
  const Wc = 1200;
  const Hc = 520;
  const gx = 90;
  const gy = 150;
  const gw = Wc - 180;
  const gh = 280;
  const pts = Array.from({ length: 33 }).map((_, i) => {
    const u = i / 32;
    const bruit = (hash(i * 3) - 0.5) * (mode === "chaos" ? 0.9 : 0.08);
    const v = mode === "monte" ? 0.15 + 0.7 * Math.pow(u, 1.2) + bruit * 0.3 : mode === "chaos" ? 0.5 + bruit : 0.5 + bruit;
    return [X + gx + u * gw, Y + gy + gh - v * gh] as const;
  });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const tr = p(c.f, 14, 14 + 40, E.inOut);
  const fin = pts[Math.min(32, Math.floor(tr * 32))];
  return (
    <Camera c={c} force={0.5}>
      <Titre texte={texte} zone={Z.haut} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align="center" max={120} />
      <Carte x={X} y={Y} w={Wc} h={Hc} f={c.f} at={4} depuis="bas" theme={c.theme} rx={8} nom="courbe" sortie={c.sortie}>
        <div style={{ position: "absolute", left: 44, top: 36 }}>
          <Txt taille={30} graisse={800} couleur={th.encre}>
            {titreCarte}
          </Txt>
          <Txt taille={22} graisse={600} couleur={th.doux} style={{ marginTop: 8 }}>
            {legende}
          </Txt>
        </div>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} style={{ position: "absolute", left: gx, right: gx, top: gy + (k * gh) / 3, height: 1, background: th.ligne }} />
        ))}
      </Carte>
      <div style={{ position: "absolute", inset: 0, opacity: p(c.f, 12, 18) * (1 - p(c.sortie, 0, 0.6)) }}>
        <LigneLumineuse d={d} prog={tr} theme={c.theme} epaisseur={6} />
        <div
          style={{
            position: "absolute",
            left: fin[0] - 12,
            top: fin[1] - 12,
            width: 24,
            height: 24,
            borderRadius: 24,
            background: th.accent,
            boxShadow: `0 0 0 ${8 + Math.sin(c.f / 4) * 4}px ${c.theme === "clair" ? "rgba(215,21,28,0.18)" : "rgba(255,74,61,0.25)"}`,
          }}
        />
      </div>
    </Camera>
  );
};

// ── Agenda de la semaine (UI 3D inclinée qui s'assemble), toutes les cases vides.
export const AgendaVide: React.FC<{ c: Ctx; texte: string }> = ({ c, texte }) => {
  const th = TH[c.theme];
  const jours = ["L", "M", "M", "J", "V", "S", "D"];
  const heures = ["9h", "11h", "14h", "16h", "18h"];
  const W0 = 780;
  const H0 = 720;
  const scan = p(c.f, 40, 80, E.inOut);
  const badge = sp(c.f, 74, "rebond");
  return (
    <Camera c={c} force={0.6}>
      <Titre texte={texte} zone={{ x: 150, y: 170, w: 760, h: 560 }} theme={c.theme} f={c.f} debut={4} sortie={c.sortie} max={150} />
      <Carte x={990} y={170} w={W0} h={H0} f={c.f} at={0} depuis="profondeur" theme={c.theme} rx={14} ry={-16} rz={2} nom="agenda" sortie={c.sortie}>
        <div style={{ position: "absolute", left: 36, top: 30, display: "flex", alignItems: "center", gap: 14 }}>
          <Calendrier size={36} color={th.accent} />
          <Txt taille={36} graisse={800} couleur={th.encre}>
            Mon agenda
          </Txt>
        </div>
        {jours.map((j, k) => (
          <div key={k} style={{ position: "absolute", left: 110 + k * 84, top: 100, width: 70, textAlign: "center", opacity: p(c.f, 6 + k, 14 + k) }}>
            <Txt taille={26} graisse={700} couleur={th.encre}>
              {j}
            </Txt>
          </div>
        ))}
        {heures.map((h, r) => (
          <React.Fragment key={r}>
            <div style={{ position: "absolute", left: 30, top: 160 + r * 100, opacity: p(c.f, 8 + r * 2, 16 + r * 2) }}>
              <Txt taille={22} graisse={700} couleur={th.doux}>
                {h}
              </Txt>
            </div>
            {jours.map((_, k) => {
              const at = 8 + (r + k) * 1.6;
              const t = sp(c.f, at, "vif");
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: 110 + k * 84,
                    top: 148 + r * 100,
                    width: 70,
                    height: 80,
                    borderRadius: 14,
                    border: `2px dashed ${c.theme === "clair" ? "rgba(23,8,8,0.22)" : "rgba(255,130,110,0.42)"}`,
                    background: c.theme === "clair" ? "rgba(23,8,8,0.02)" : "rgba(255,80,60,0.04)",
                    opacity: Math.min(1, t * 1.5),
                    scale: `${0.6 + 0.4 * t}`,
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
        <div
          style={{
            position: "absolute",
            left: 100,
            right: 26,
            top: 140 + scan * 500,
            height: 4,
            background: th.accent,
            boxShadow: `0 0 24px 4px ${c.theme === "sombre" ? "rgba(255,60,48,0.6)" : "rgba(215,21,28,0.3)"}`,
            opacity: scan > 0 && scan < 1 ? 1 : 0,
          }}
        />
      </Carte>
      <div
        data-zone="badge-agenda"
        style={{
          position: "absolute",
          left: 150,
          top: 790,
          transformOrigin: "0 50%",
          transform: `scale(${badge})`,
          opacity: Math.min(1, badge * 2) * (1 - c.sortie),
        }}
      >
        <div
          data-bloc
          style={{
            padding: "18px 34px",
            borderRadius: 60,
            background: th.accent,
            color: "#fff",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 34,
            whiteSpace: "nowrap",
            boxShadow: c.theme === "sombre" ? "0 0 40px rgba(255,60,48,0.55)" : "0 18px 40px -12px rgba(160,10,10,0.5)",
          }}
        >
          0 rendez-vous
        </div>
      </div>
    </Camera>
  );
};

// ── Écran partagé : les deux cas (clair à gauche, sombre à droite).
export const DeuxCas: React.FC<{ c: Ctx; gauche: string; droite: string; photoG?: string; photoD?: string; choix?: "g" | "d" | null; choixAt?: number; question?: number }> = ({
  c,
  gauche,
  droite,
  photoG,
  photoD,
  choix = null,
  choixAt = 9999,
  question,
}) => {
  const tg = sp(c.f, 0, "lourd");
  const td = sp(c.f, 5, "lourd");
  const so = c.sortie;
  const ch = p(c.f, choixAt, choixAt + 18, E.inOut);
  const largeurG = choix === "g" ? 960 + ch * 400 : choix === "d" ? 960 - ch * 400 : 960;
  const Panneau = ({ cote, t }: { cote: "g" | "d"; t: number }) => {
    const theme: Theme = cote === "g" ? "clair" : "sombre";
    const th = TH[theme];
    const x = cote === "g" ? 0 : largeurG;
    const w = cote === "g" ? largeurG : 1920 - largeurG;
    const num = cote === "g" ? "01" : "02";
    const label = cote === "g" ? gauche : droite;
    const photo = cote === "g" ? photoG : photoD;
    const off = (1 - t) * (cote === "g" ? -1100 : 1100);
    return (
      <div style={{ position: "absolute", left: x, top: 0, width: w, height: 1080, overflow: "hidden", translate: `0 ${off}px`, background: th.fond }}>
        {photo ? (
          <div style={{ position: "absolute", inset: 0, opacity: 0.9 }}>
            <Photo src={photo} f={c.f} d={c.d} pos="50% 35%" zoom={[1.18, 1.04]} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  theme === "clair"
                    ? "linear-gradient(180deg, rgba(244,239,235,0.2) 0%, rgba(244,239,235,0.65) 55%, rgba(244,239,235,0.97) 78%)"
                    : "linear-gradient(180deg, rgba(11,3,3,0.25) 0%, rgba(11,3,3,0.7) 55%, rgba(11,3,3,0.97) 78%)",
              }}
            />
          </div>
        ) : null}
        <div
          data-zone={`cas-${cote}`}
          style={{ position: "absolute", left: 90, bottom: 110, opacity: p(c.f, 10 + (cote === "d" ? 5 : 0), 22 + (cote === "d" ? 5 : 0)) }}
        >
          <div data-texte style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: th.accent, lineHeight: 1 }}>
            {num}
          </div>
          <div data-texte style={{ fontFamily: FONT, fontWeight: 800, fontSize: 92, color: th.encre, marginTop: 6, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
            {label}
          </div>
          <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 14 }}>
            {cote === "g" ? <Halteres size={64} color={th.accent} stroke={2.4} /> : <Calendrier size={64} color={th.accent} stroke={2.4} />}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0, ...styleSortie(so, "fond") }}>
      <Panneau cote="g" t={tg} />
      <Panneau cote="d" t={td} />
      <div
        style={{
          position: "absolute",
          left: largeurG - 3,
          top: 0,
          width: 6,
          height: 1080 * p(c.f, 12, 30, E.inOut),
          background: ROUGE,
          boxShadow: "0 0 30px rgba(255,60,48,0.8)",
        }}
      />
      {question !== undefined && c.f >= question ? (
        <div data-zone="question" style={{ position: "absolute", left: largeurG, top: 400, transform: `translate(-50%, -50%) scale(${sp(c.f, question, "rebond")})` }}>
          <div
            data-bloc
            style={{
              width: 220,
              height: 220,
              borderRadius: 220,
              background: ROUGE,
              boxShadow: "0 0 0 10px rgba(255,255,255,0.9), 0 0 80px rgba(255,60,48,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 150,
              color: "#fff",
            }}
          >
            ?
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ── Barre de recherche (référence Pinterest) : la requête se tape, curseur clignotant, résultat.
export const Recherche: React.FC<{ c: Ctx; requete: string; resultat: string; debutFrappe?: number }> = ({ c, requete, resultat, debutFrappe = 12 }) => {
  const th = TH[c.theme];
  const t = sp(c.f, 0, "souple");
  const n = Math.floor(interpolate(c.f, [debutFrappe, debutFrappe + requete.length * 1.6], [0, requete.length], cl));
  const tape = requete.slice(0, n);
  const finFrappe = debutFrappe + requete.length * 1.6;
  const caret = Math.floor(c.f / 8) % 2 === 0 || c.f < finFrappe;
  const ok = sp(c.f, finFrappe + 8, "rebond");
  const W0 = 1320;
  const x = (1920 - W0) / 2;
  const y = 360 - ok * 70;
  return (
    <Camera c={c} force={0.5}>
      <div data-zone="recherche" style={{ position: "absolute", left: x, top: y, width: W0, height: 160, ...styleSortie(c.sortie, "haut") }}>
        <div
          data-bloc
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 70,
            background: th.carte,
            boxShadow: th.ombre,
            transform: `scaleX(${0.2 + 0.8 * t})`,
            opacity: Math.min(1, t * 2),
            display: "flex",
            alignItems: "center",
            padding: "0 48px",
            gap: 28,
            boxSizing: "border-box",
          }}
        >
          <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth={2.6} strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5L21 21" />
          </svg>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 68, color: th.encre, whiteSpace: "pre", letterSpacing: "-0.01em" }}>
            {tape}
            <span style={{ display: "inline-block", width: 4, height: 72, background: th.accent, marginLeft: 4, verticalAlign: "-10px", opacity: caret ? 1 : 0 }} />
          </div>
        </div>
      </div>
      <div
        data-zone="resultat"
        style={{
          position: "absolute",
          left: 960,
          top: 620,
          transform: `translate(-50%, 0) scale(${ok})`,
          opacity: Math.min(1, ok * 2) * (1 - c.sortie),
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Coche taille={96} prog={p(c.f, finFrappe + 8, finFrappe + 24)} fond={th.accent} />
        <div data-texte style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: th.encre, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
          {resultat}
        </div>
      </div>
    </Camera>
  );
};

// ── Lecteur vidéo : la barre de progression file jusqu'au bout.
export const Lecteur: React.FC<{ c: Ctx; texte: string; jusqua?: number }> = ({ c, texte, jusqua = 0.6 }) => {
  const X = 360;
  const Y = 430;
  const Wc = 1200;
  const Hc = 480;
  const prog = interpolate(c.f, [10, c.d - 6], [0.06, 1], { ...cl, easing: E.inOut });
  const verrou = p(c.f, Math.max(20, c.d * jusqua), Math.max(32, c.d * jusqua + 12));
  return (
    <Camera c={c} force={0.5}>
      <Titre texte={texte} zone={Z.haut} theme={c.theme} f={c.f} debut={2} sortie={c.sortie} align="center" max={118} />
      <Carte x={X} y={Y} w={Wc} h={Hc} f={c.f} at={3} depuis="bas" theme="sombre" rx={6} nom="lecteur" sortie={c.sortie}>
        <div
          style={{
            position: "absolute",
            left: Wc / 2 - 56,
            top: Hc / 2 - 90,
            width: 112,
            height: 112,
            borderRadius: 112,
            background: ROUGE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 50px rgba(255,60,48,0.6)",
            scale: `${1 + Math.sin(c.f / 6) * 0.03}`,
          }}
        >
          <svg width={46} height={46} viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" fill="#fff" />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, bottom: 70, height: 10, borderRadius: 10, background: "rgba(255,255,255,0.14)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${prog * 100}%`, borderRadius: 10, background: TH.sombre.accent, boxShadow: "0 0 18px rgba(255,60,48,0.7)" }} />
          {[0.25, 0.5, 0.75].map((m) => (
            <div key={m} style={{ position: "absolute", left: `${m * 100}%`, top: -5, width: 4, height: 20, background: prog > m ? "#fff" : "rgba(255,255,255,0.35)", borderRadius: 2 }} />
          ))}
          <div
            style={{
              position: "absolute",
              left: `calc(${prog * 100}% - 15px)`,
              top: -10,
              width: 30,
              height: 30,
              borderRadius: 30,
              background: "#fff",
              boxShadow: "0 0 20px rgba(255,255,255,0.6)",
            }}
          />
        </div>
        <div style={{ position: "absolute", right: 56, bottom: 104, opacity: verrou, display: "flex", alignItems: "center", gap: 10 }}>
          <Txt taille={24} graisse={700} couleur={TH.sombre.encre}>
            La suite
          </Txt>
          <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={TH.sombre.accent} strokeWidth={2.4} strokeLinecap="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </Carte>
    </Camera>
  );
};

// ── Révélation au projecteur : un faisceau balaie le titre, puis le dévoile en entier.
export const Projecteur: React.FC<{ c: Ctx; texte: string; max?: number }> = ({ c, texte, max = 150 }) => {
  const t = p(c.f, 0, Math.min(c.d - 10, 50), E.inOut);
  const cx = interpolate(t, [0, 1], [10, 60]);
  const r = interpolate(p(c.f, 30, 56, E.inOut), [0, 1], [22, 140]);
  const masque = `radial-gradient(circle ${r}vw at ${cx}% 50%, #000 40%, rgba(0,0,0,0.0) 100%)`;
  return (
    <Camera c={c}>
      <div style={{ position: "absolute", inset: 0, maskImage: masque, WebkitMaskImage: masque }}>
        <Titre texte={texte} zone={Z.plein} theme={c.theme} f={c.f} debut={0} sortie={c.sortie} align="center" max={max} pas={0.3} />
      </div>
      <div
        style={{
          position: "absolute",
          left: `${cx}%`,
          top: "50%",
          width: 900,
          height: 900,
          marginLeft: -450,
          marginTop: -450,
          borderRadius: 900,
          background: "radial-gradient(circle, rgba(255,70,50,0.16) 0%, rgba(255,70,50,0) 65%)",
          opacity: 1 - p(c.f, 40, 60) * 0.6,
        }}
      />
    </Camera>
  );
};

// ── Carton de chapitre (pendant le « lead » de la scène, avant la première phrase).
export const Chapitre: React.FC<{ c: Ctx; num: number; titre: string }> = ({ c, num, titre }) => {
  const th = TH[c.theme];
  const t = sp(c.f, 0, "lourd");
  const so = p(c.f, c.d - 10, c.d, E.in);
  const ligne = p(c.f, 4, 22, E.out);
  return (
    <div style={{ position: "absolute", left: 160, top: 300, width: 1600, height: 480, opacity: 1 - so, translate: `0 ${-40 * so}px`, filter: `blur(${so * 8}px)` }}>
      <div
        data-zone="chapitre-num"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 300,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `3px ${th.accent}`,
          translate: `${(1 - t) * -120}px 0`,
          opacity: t,
          letterSpacing: "-0.04em",
        }}
      >
        {String(num).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", left: 470, top: 150, width: 1000 * ligne, height: 4, background: th.accent, boxShadow: c.theme === "sombre" ? "0 0 16px rgba(255,60,48,0.7)" : undefined }} />
      <Titre texte={titre} zone={{ x: 470, y: 180, w: 1100, h: 150 }} theme={c.theme} f={c.f} debut={6} align="left" max={110} nom="chapitre-titre" />
    </div>
  );
};


// ── Pile : chaque nouvelle ligne arrive en bas et pousse les précédentes vers le haut, qui s'estompent.
export const Pile: React.FC<{ c: Ctx; lignes: { at: number; texte: string }[]; max?: number }> = ({ c, lignes, max = 130 }) => {
  const H = 200;
  const neff = lignes.reduce((a, l) => a + (c.f >= l.at ? sp(c.f, l.at, "souple") : 0), 0);
  return (
    <Camera c={c} force={0.5}>
      {lignes.map((l, k) => {
        if (c.f < l.at) return null;
        const y = 540 + (k - (Math.max(1, neff) - 1) / 2) * H - H / 2;
        const recule = Math.min(1, Math.max(0, neff - 1 - k));
        return (
          <div key={k} style={{ position: "absolute", inset: 0, opacity: 1 - recule * 0.55 }}>
            <Titre texte={l.texte} zone={{ x: 160, y, w: 1600, h: H }} theme={c.theme} f={c.f - l.at} debut={0} sortie={c.sortie} align="center" max={max} nom={`pile-${k}`} />
          </div>
        );
      })}
    </Camera>
  );
};
