# Voix off gratuite (Microsoft Edge TTS, voix « Rémy », multilingue) pour la VSL.
#   python3 scripts/voix-edge.py            (toutes les scènes)
# Écrit public/voix/scene-N.mp3 et public/voix/scene-N.json (temps de chaque mot, en ms),
# même format que npm run caler. Les pauses du script sont respectées :
#   « // » = vraie pause, ligne vide = paragraphe ; « / » reste une respiration naturelle.
import asyncio, json, os, re, subprocess, sys, tempfile
import edge_tts

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
VOIX = "fr-FR-RemyMultilingualNeural"
RYTHME = "+6%"
PAUSE = {"vraie": 0.55, "paragraphe": 0.45}
SR = 24000
# Ce que la voix doit lire à la place de certains mots (le texte affiché ne change pas).
LECTURE = {"WNBF": "W.N.B.F.", "EP Coaching": "E.P. Coaching"}

def segments(texte):
    """Découpe une scène en segments séparés par une pause (vraie ou paragraphe)."""
    out = []
    for p_i, para in enumerate([p for p in re.split(r"\n\s*\n", texte) if p.strip()]):
        morceaux = [m.strip() for m in para.split("//") if m.strip()]
        for m_i, m in enumerate(morceaux):
            pause = "vraie" if m_i < len(morceaux) - 1 else "paragraphe"
            out.append((re.sub(r"\s*/\s*", " ", m).strip(), pause))
    return out

async def synth(texte, mp3):
    lu = texte
    for a, b in LECTURE.items():
        lu = lu.replace(a, b)
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    com = edge_tts.Communicate(lu, VOIX, rate=RYTHME, boundary="WordBoundary", proxy=proxy)
    mots = []
    with open(mp3, "wb") as f:
        async for c in com.stream():
            if c["type"] == "audio":
                f.write(c["data"])
            elif c["type"] == "WordBoundary":
                mots.append({"text": c["text"], "s": c["offset"] / 1e7, "e": (c["offset"] + c["duration"]) / 1e7})
    return mots

def pcm(mp3):
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", mp3, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], check=True, capture_output=True).stdout
    return b

def scenes():
    raw = open(os.path.join(ROOT, "script/voix-off.txt"), encoding="utf8").read()
    raw = "\n".join(l for l in raw.splitlines() if not l.startswith("#"))
    raw = re.sub(r"\[\[[^\]]*\]\]", "", raw)
    parts = re.split(r"^= Scène (\d+).*$", raw, flags=re.M)
    return {int(parts[i]): parts[i + 1].strip() for i in range(1, len(parts), 2)}

async def main():
    seules = {int(a) for a in sys.argv[1:]}
    for num, texte in scenes().items():
        if seules and num not in seules:
            continue
        buf = bytearray()
        caps = []
        t = 0.0
        with tempfile.TemporaryDirectory() as d:
            for k, (seg, pause) in enumerate(segments(texte)):
                f = os.path.join(d, f"{k}.mp3")
                mots = await synth(seg, f)
                p = pcm(f)
                for m in mots:
                    caps.append({"text": m["text"], "startMs": round((t + m["s"]) * 1000), "endMs": round((t + m["e"]) * 1000)})
                # on coupe la fin silencieuse du segment juste après le dernier mot
                fin = mots[-1]["e"] + 0.12 if mots else len(p) / 2 / SR
                n = min(len(p), int(fin * SR) * 2)
                buf += p[:n]
                t += n / 2 / SR
                silence = int(PAUSE[pause] * SR) * 2
                buf += b"\x00" * silence
                t += silence / 2 / SR
        wav = os.path.join(ROOT, f"public/voix/scene-{num}.wav")
        mp3 = os.path.join(ROOT, f"public/voix/scene-{num}.mp3")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", "-af", "loudnorm=I=-16:TP=-1.5:LRA=7", "-ar", "44100", "-b:a", "160k", mp3], input=bytes(buf), check=True)
        json.dump(caps, open(os.path.join(ROOT, f"public/voix/scene-{num}.json"), "w"), ensure_ascii=False)
        print(f"scène {num} : {t:.1f} s, {len(caps)} mots")

asyncio.run(main())
