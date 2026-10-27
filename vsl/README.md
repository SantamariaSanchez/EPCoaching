# VSL EP Coaching (motion design, Remotion)

La vidéo de vente du site, en motion design 2026 : 7 scènes, 1920×1080, 30 images/s, environ 8 min 50.
Tout est du code (React + [Remotion](https://www.remotion.dev)) : chaque animation est calée **au mot près**
sur la voix off, donc si la voix change, la vidéo se recale toute seule.

## Direction artistique

- **Deux mondes qui se répondent** : clair (papier chaud, encre noire, rouge de marque : le pratiquant,
  le parcours, le problème, inspiré de la référence Pinterest) et sombre (noir profond, corail lumineux,
  lueurs, grille de points en perspective : le coach, l'appli, l'appel, inspiré de la référence 2).
  On passe de l'un à l'autre par un rideau de bandes diagonales (couverture totale au point de coupe).
- **Une seule couleur d'accent**, contrastes vérifiés (WCAG) : titres corail #FF4A3D sur noir = 6,1:1
  (l'ancien rouge sur noir faisait 4,3:1), rouge #D7151C sur papier = 4,6:1, texte 17:1 et plus.
- **Un seul focus à l'écran** : chaque phrase clé est un « temps fort » ; le précédent sort (ease-in,
  flou) avant que le suivant entre. Titres kinétiques lettre par lettre (rotation 3D, flou, graisse
  variable 500 → 800 qui s'épaissit à l'atterrissage), mot accent souligné qui se dessine.
- **Vrai motion design** : ressorts physiques, entrées en profondeur avec profondeur de champ, flou de
  mouvement directionnel (SVG) et flou de caméra à sous-images (`@remotion/motion-blur`) sur les temps
  forts rapides, compteurs, lignes lumineuses qui se tracent, téléphone 3D avec les **vraies captures**
  de l'appli (changement d'écran, notification, retournement côté coach), calques 3D éclatés, pastilles
  incandescentes reliées, cadenas qui se déverrouille, boutons métal du site, carte de fin rouge.
- **Rien d'inventé de chiffré** : seuls les chiffres du script (80 kg, 3 raisons, 30 secondes,
  une trentaine de minutes, 6 mois) apparaissent ; aucun résultat client ni nombre de membres.

## Voix off

Voix IA française (ElevenLabs « Liam », générée via le connecteur vidIQ voiceover) en 3 prises
(`public/voix/brut/`, non versionnées). `npm run voix-ia` (scripts/voix-ia.mjs) :
1. détecte les silences de chaque prise et retrouve où chaque bloc du script est dit (programmation
   dynamique sur la durée attendue de chaque bloc, aucune transcription nécessaire) ;
2. découpe une piste par scène, ajoute les respirations du script (« / », « // », paragraphes) ;
3. écrit `public/voix/scene-N.mp3` et le temps de chaque mot dans `public/voix/scene-N.json`.

Pour mettre ta propre voix : dépose `public/voix/scene-N.mp3` (un fichier par scène), supprime les
`scene-N.json`, puis `npm run caler` (Whisper, optionnel) et `npm run rendu`.

## Commandes

| Commande                          | Effet                                                                   |
| --------------------------------- | ----------------------------------------------------------------------- |
| `npm run dev`                     | Remotion Studio (une composition par scène + `VSL`)                     |
| `npm run rendu`                   | Prépare tout (timeline, images, sons, musique, .vtt) puis rend en 1080p |
| `npm run web`                     | Version web (1080p H.264 2 passes + faststart, < 80 Mo) + .vtt + affiche dans `../assets/video/` |
| `npm run planche -- Scene3 --pas 20` | Planches contact d'une scène + **gardien** anti-chevauchement (voir plus bas) |
| `npm run voix-ia`                 | Recale la voix IA (prises brutes -> scènes + temps des mots)            |
| `npm run timeline`                | Régénère `src/timeline.ts` depuis `script/voix-off.txt`                 |

Rendu complet 1080p : environ 1 h sur une machine 4 cœurs.

## Contrôle qualité automatique (le gardien)

Chaque élément visible porte une zone (`data-zone`). Avec `--props='{"verifier":true}'` (fait par
`npm run planche`), à chaque image le gardien mesure le DOM réel (glyphes visibles, blocs) et signale :
- tout **chevauchement** entre deux textes ou blocs visibles ;
- tout **débordement** du cadre de sécurité (une fois l'entrée de l'élément terminée) ;
- tout **repère de mot** qui tombe avant le début de son temps fort (mauvaise occurrence d'un mot).
Les tailles de titres sont calculées avec `@remotion/layout-utils` (measureText), une fois les polices
chargées, pour qu'aucun texte ne déborde de sa zone.

## Les 2 phrases à valider

- Scène 2 : « J'ai commencé la muscu comme tout le monde. Des programmes trouvés sur internet,
  des diètes copiées, des mois sans vraiment savoir si j'avançais. Et un jour, j'ai décidé de
  tout mesurer, de tout structurer, et de ne plus rien laisser au hasard. » (ton vrai parcours)
- Scène 6 : « ça dure une trentaine de minutes » (la vraie durée de ton appel Calendly ; le
  cadran « ~30 MINUTES » de la scène 6 est à changer avec, dans `src/scenes/Scene6.tsx`).
- Ces deux passages sont dits par la voix IA : si tu les modifies, il faut régénérer la prise de la
  scène concernée (ou enregistrer ta voix) puis relancer `npm run voix-ia` et `npm run rendu`.

## Musique et sons

- `npm run musique` compose une musique originale en code (Ré mineur, 92 BPM, sans droits tiers) à la
  longueur exacte de la vidéo. Elle passe **sous la voix avec un ducking mot à mot** (≈ -21 dB pendant
  la parole, remonte dans les respirations).
- `npm run sons` synthétise les sons d'habillage (whoosh, swoosh des rideaux, impacts, pops, ticks,
  frappe clavier, cloche du cadenas…) déclenchés par chaque temps fort.
- Pour ta propre musique (libre de droits) : `public/musique.mp3`.

## Comment c'est construit

- `script/voix-off.txt` : le script exact. `src/timeline.ts` (généré) : blocs et mots.
- `src/motion/` : le design system. `tokens.ts` (couleurs clair/sombre, zones), `anim.ts` (ressorts,
  courbes), `Titre.tsx` (titres kinétiques), `Beats.tsx` (temps forts, rideaux, gardien), `Kit.tsx`
  (carte 3D, flou de mouvement, pastille, compteur, ligne lumineuse, curseur), `modules.tsx`, `m-ui.tsx`
  (téléphone 3D, calques, mosaïque, logo, boutons, cadenas, messagerie, fin), `m-listes.tsx`,
  `m-data.tsx`, `m-fx.tsx`, `m-perso.tsx`, `TransitionScene.tsx` (rideau entre scènes).
- `src/scenes/Scene1.tsx` … `Scene7.tsx` : chaque scène est une liste de temps forts accrochés au texte
  du script (`B("passage du script", monde, nom, rendu)`), donc au mot près sur la voix.
- Les captures de l'appli et les photos viennent de `../assets/images/` (copiées par `npm run prep`).

## Machine sans accès au téléchargement de Chrome

Remotion télécharge son navigateur au premier rendu. S'il est bloqué, indique un Chromium
local : `REMOTION_CHROME=/chemin/vers/chrome npm run rendu`.
