// Calage de la timeline sur la voix off. Aucun import d'exécution : ce fichier est aussi
// lu directement par Node (scripts/vtt.mjs), qui retire les types tout seul.
import type { Bloc, Mot, SceneTimeline } from "../timeline";

export const FPS = 30;
// Durée d'une transition entre deux scènes (les scènes se chevauchent d'autant).
export const TRANSITION = 20;

export type Caption = { text: string; startMs: number; endMs: number };

export type Source = "estimation" | "voix" | "voix+mots";

export type SceneResolue = SceneTimeline & {
  source: Source;
  audio: string | null;
  dureeFrames: number;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

const remap = (sc: SceneTimeline, f: (t: number) => number): SceneTimeline => ({
  ...sc,
  blocs: sc.blocs.map(
    (b): Bloc => ({
      ...b,
      s: f(b.s),
      e: f(b.e),
      mots: b.mots.map((m): Mot => ({ ...m, s: f(m.s), e: f(m.e) })),
    }),
  ),
});

// Aligne chaque mot du script sur la transcription mot à mot (Whisper) quand elle existe.
const aligner = (sc: SceneTimeline, captions: Caption[]): SceneTimeline => {
  const cap = captions
    .map((c) => ({ n: norm(c.text), s: c.startMs / 1000 + sc.lead, e: c.endMs / 1000 + sc.lead }))
    .filter((c) => c.n.length > 0);
  const mots = sc.blocs.flatMap((b) => b.mots);
  const temps: (number | null)[] = mots.map(() => null);
  let j = 0;
  mots.forEach((m, i) => {
    const n = norm(m.t);
    if (!n) return;
    for (let k = j; k < Math.min(cap.length, j + 8); k++) {
      const c = cap[k].n;
      const ok = c === n || (c.length >= 3 && n.length >= 3 && (c.startsWith(n) || n.startsWith(c) || c.endsWith(n) || n.endsWith(c)));
      if (ok) {
        temps[i] = cap[k].s;
        j = k + 1;
        return;
      }
    }
  });
  // Les mots non retrouvés sont placés entre leurs voisins retrouvés.
  const connus = temps.map((t, i) => (t === null ? -1 : i)).filter((i) => i >= 0);
  if (connus.length < 2) return sc;
  const estime = mots.map((m) => m.s);
  const val = (i: number) => temps[i] as number;
  const finale = mots.map((_, i) => {
    if (temps[i] !== null) return val(i);
    const avant = [...connus].reverse().find((k) => k < i);
    const apres = connus.find((k) => k > i);
    if (avant === undefined) return Math.max(sc.lead, val(apres as number) - (estime[apres as number] - estime[i]));
    if (apres === undefined) return val(avant) + (estime[i] - estime[avant]);
    const r = (estime[i] - estime[avant]) / Math.max(0.001, estime[apres] - estime[avant]);
    return val(avant) + r * (val(apres) - val(avant));
  });
  let idx = 0;
  return {
    ...sc,
    blocs: sc.blocs.map((b) => {
      const ms = b.mots.map((m, k) => {
        const s = finale[idx];
        const suivant = idx + 1 < finale.length ? finale[idx + 1] : s + 0.4;
        idx++;
        const e = k === b.mots.length - 1 ? Math.min(suivant, s + 0.6) : suivant;
        return { ...m, s, e: Math.max(e, s + 0.08) };
      });
      return { ...b, mots: ms, s: ms[0].s, e: ms[ms.length - 1].e };
    }),
  };
};

export const resoudreScene = (
  sc: SceneTimeline,
  opts: { audio?: string | null; audioDuree?: number | null; captions?: Caption[] | null } = {},
): SceneResolue => {
  const { audio = null, audioDuree = null, captions = null } = opts;
  if (audio && audioDuree && captions && captions.length > 0) {
    const r = aligner(sc, captions);
    const duree = Math.max(sc.lead + audioDuree + sc.queue, r.blocs[r.blocs.length - 1].e + sc.queue);
    return { ...r, duree, source: "voix+mots", audio, dureeFrames: Math.ceil(duree * FPS) };
  }
  if (audio && audioDuree) {
    // Sans transcription : on étire ou on resserre le rythme estimé sur la durée réelle.
    const fin = sc.blocs[sc.blocs.length - 1].e;
    const k = audioDuree / Math.max(1, fin - sc.lead);
    const r = remap(sc, (t) => sc.lead + (t - sc.lead) * k);
    const duree = sc.lead + audioDuree + sc.queue;
    return { ...r, duree, source: "voix", audio, dureeFrames: Math.ceil(duree * FPS) };
  }
  return { ...sc, source: "estimation", audio: null, dureeFrames: Math.ceil(sc.duree * FPS) };
};

// Début de chaque scène dans la vidéo complète (en frames), transitions comprises.
export const debutsScenes = (scenes: { dureeFrames: number }[]) => {
  const out: number[] = [];
  let t = 0;
  scenes.forEach((s, i) => {
    out.push(t);
    t += s.dureeFrames - (i < scenes.length - 1 ? TRANSITION : 0);
  });
  return { debuts: out, total: t };
};
