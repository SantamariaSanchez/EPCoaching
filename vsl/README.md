# VSL EP Coaching (motion design, Remotion)

La vidéo de vente du site, en motion design : 7 scènes, 1920×1080, 30 images/s.
Tout est du code (React + [Remotion](https://www.remotion.dev)) : chaque animation est calée
sur le texte de la voix off, donc quand tu enregistres ta voix, la vidéo se recale toute seule.

## Ce que tu dois faire : enregistrer ta voix

1. Lis le script **mot pour mot** (page Notion « VSL EP Coaching (site) : script voix off »,
   copie exacte dans `script/voix-off.txt`). « / » = petite pause, « // » = vraie pause.
   Corrige d'abord les 2 phrases marquées ⚠️ À VALIDER (voir plus bas).
2. Un fichier par scène, au calme, téléphone près de la bouche. Dépose-les dans
   `vsl/public/voix/` avec ces noms exacts :

   | Fichier        | Scène                | Commence par                                  |
   | -------------- | -------------------- | --------------------------------------------- |
   | `scene-1.mp3`  | Ouverture            | « Tu t'entraînes. »                           |
   | `scene-2.mp3`  | Qui je suis          | « Alors avant ça, je vais me présenter. »     |
   | `scene-3.mp3`  | Le vrai problème     | « Laisse-moi te poser une question. »         |
   | `scene-4.mp3`  | Le système           | « C'est pour ça que j'ai construit EP Coaching. » |
   | `scene-5.mp3`  | Lequel c'est toi ?   | « Maintenant, il y a deux cas. »              |
   | `scene-6.mp3`  | L'appel              | « Alors voilà ce que je te propose. »         |
   | `scene-7.mp3`  | En résumé            | « Donc si je devais récapituler cette vidéo. » |

   `.wav` et `.m4a` marchent aussi. Coupe le silence au début et à la fin de chaque fichier.
3. Relance le rendu **en une commande** (depuis le dossier `vsl/`) :

   ```bash
   npm install          # la première fois seulement
   npm run rendu        # -> out/vsl-ep-coaching.mp4 (1080p)
   npm run web          # -> ../assets/video/ (version web du site + sous-titres + affiche)
   ```

   Chaque scène prend alors la durée exacte de ton fichier, et les mots clés, les écrans de
   l'appli et les graphiques s'étirent sur ton rythme. La musique et les sous-titres sont
   régénérés pour la nouvelle durée.

4. Option recommandée, calage **mot à mot** : `npm run caler` avant `npm run rendu`.
   Whisper (gratuit, en local) transcrit chaque fichier et écrit `public/voix/scene-N.json` :
   chaque mot clé tombe alors pile sur ta parole. Le premier lancement télécharge whisper.cpp
   et le modèle (environ 1,5 Go, une seule fois).

Si tu changes le texte du script : modifie `script/voix-off.txt` (et la page Notion), puis
`npm run timeline`. Les images sont accrochées aux phrases par leur texte : si une phrase
disparaît, le rendu s'arrête en te disant laquelle.

## Les 2 phrases à valider

- Scène 2 : « J'ai commencé la muscu comme tout le monde. Des programmes trouvés sur internet,
  des diètes copiées, des mois sans vraiment savoir si j'avançais. Et un jour, j'ai décidé de
  tout mesurer, de tout structurer, et de ne plus rien laisser au hasard. » (ton vrai parcours)
- Scène 6 : « ça dure une trentaine de minutes » (la vraie durée de ton appel Calendly ; le
  cadran « ~30 MINUTES » de la scène 6 est à changer avec, dans `src/scenes/Scene6.tsx`).

## Musique et sons

- `npm run musique` compose une musique originale en code (Ré mineur, 92 BPM, aucun droit
  d'auteur tiers), à la longueur exacte de la vidéo, plus dense pendant le problème et le
  système, plus légère à la bifurcation. Elle est jouée bas sous la voix.
- Pour mettre ta propre musique (libre de droits), dépose `public/musique.mp3` : elle passe
  avant la musique générée, en boucle si elle est plus courte.
- `npm run sons` synthétise les sons d'habillage (whoosh, impacts, ticks…) dans `public/sfx/`.
- Aucune voix de synthèse : la voix off sera la tienne.

## Commandes

| Commande             | Effet                                                                 |
| -------------------- | --------------------------------------------------------------------- |
| `npm run dev`        | Remotion Studio (aperçu interactif, une composition par scène + `VSL`) |
| `npm run rendu`      | Prépare tout puis rend la VSL complète en 1080p (`out/`)               |
| `npm run rendu:720`  | Pareil en 1280×720 (plus rapide)                                       |
| `npm run web`        | Version web compressée + `.vtt` + affiche dans `../assets/video/`     |
| `npm run stills`     | Quelques images fixes de contrôle dans `out/stills/`                  |
| `npm run timeline`   | Régénère `src/timeline.ts` depuis `script/voix-off.txt`                |
| `npm run vtt`        | Sous-titres seuls (`out/vsl-ep-coaching.vtt`)                          |

Rendu complet 1080p : environ 1 h sur une machine 4 cœurs.

## Comment c'est construit

- `script/voix-off.txt` : le script exact. `script/mise-en-valeur.json` : les mots clés qui
  s'affichent en grand (le reste du texte est dans les sous-titres, pas à l'image).
- `src/timeline.ts` (généré) : chaque bloc et chaque mot avec son temps estimé
  (2,3 mots/s, « / » 0,35 s, « // » 1 s, fin de paragraphe 0,6 s).
- `src/lib/resolve.ts` : recale cette timeline sur la voix (durée du fichier, ou mot à mot).
- `src/scenes/Scene1.tsx` … `Scene7.tsx` : une composition par scène (dossier « Scenes » du
  Studio) ; `src/VSL.tsx` les enchaîne avec la transition losange (le ◆ du logo).
- Les captures de l'appli et les photos viennent de `../assets/images/` (copiées par
  `npm run prep`, jamais dupliquées dans Git). Rien n'est inventé : les écrans sont les vrais.
- Charte : rouge profond et noir uniquement, Montserrat (900 pour les titres, letter-spacing
  négatif), logo EP en vrai PNG. Polices sous licence SIL OFL dans `public/fonts/`.

## Machine sans accès au téléchargement de Chrome

Remotion télécharge son navigateur au premier rendu. S'il est bloqué, indique un Chromium
local : `REMOTION_CHROME=/chemin/vers/chrome npm run rendu`.
