// Actus : annonces et nouveautés de l'appli, datées d'après l'historique réel
// du dépôt de l'appli (date de mise en ligne). Jamais une fonctionnalité
// annoncée avant d'exister.

export const NEWS_CATEGORIES = { produit: "Produit", annonce: "Annonce", coachs: "Pour les coachs" };

export const NEWS = [
  {
    slug: "une-seule-appli-pour-progresser-et-pour-coacher",
    date: "2026-09-30",
    cat: "annonce",
    title: "Une seule appli pour progresser et pour coacher",
    summary: "Pourquoi EP Coaching réunit dans la même appli le suivi des membres et tout le métier du coach, et ce que ça change pour toi.",
    body: [
      "La plupart des coachs en ligne jonglent avec six outils : un tableur pour les clients, une appli de messagerie, un outil de programmes, un agenda, un outil d'emailing, un carnet pour les idées de contenu. Et leurs clients, eux, jonglent avec trois applis de plus.",
      "EP Coaching part d'une idée simple : le client et le coach regardent les mêmes données. Quand un membre remplit son bilan, son coach le voit. Quand le coach ajuste un programme, le membre le retrouve dans Training. Rien à exporter, rien à recopier.",
      "Et comme un coach est aussi un sportif, il a son propre espace Moi, avec exactement les mêmes outils de suivi que ses clients. Il sait ce qu'il fait vivre à ses clients parce qu'il le vit lui-même.",
      "L'ambition est claire : devenir la référence du coaching en ligne, sur les quatre fronts qui comptent. Le contenu qui fait venir les clients, la qualité du suivi, le développement du business, et ton propre suivi.",
    ],
    related: ["/appli/", "/solutions/coachs/", "/solutions/membres/"],
  },
  {
    slug: "notes-facon-obsidian",
    date: "2026-09-30",
    cat: "produit",
    title: "Des notes façon Obsidian, pour tout le monde",
    summary: "Tags qui rangent seuls, liens entre notes, captures d'écran et recherche instantanée : les notes arrivent dans EP Coaching.",
    body: [
      "Une idée de reel dans la file d'attente, une remarque sur un client pendant un appel, une sensation bizarre à l'épaule pendant le développé couché : tout ça mérite d'être noté, et surtout retrouvé.",
      "Les notes EP Coaching fonctionnent comme les meilleurs outils de prise de notes. Tu écris ou tu dictes, tu ajoutes un #tag et la note se range toute seule. Une note qui parle d'un tag existant le reçoit automatiquement.",
      "Tu relies deux notes avec [[Titre de la note]], tu colles une capture d'écran, et la recherche retrouve tout, y compris depuis la loupe de l'appli. Un bouton de note rapide est disponible partout.",
    ],
    related: ["/appli/notes/", "/aide/prendre-des-notes/"],
  },
  {
    slug: "connecteur-claude",
    date: "2026-09-30",
    cat: "produit",
    title: "EP Coaching se branche à Claude (et à Notion)",
    summary: "Ajoute EP Coaching comme connecteur personnalisé dans Claude : import de pages Notion, recherche dans tes notes, chiffres de la semaine.",
    body: [
      "Beaucoup de coachs organisent déjà leur business dans Notion et travaillent avec Claude. Le connecteur EP Coaching relie les trois.",
      "Tu génères ton adresse de connecteur dans Notes, tu l'ajoutes dans les réglages de Claude, et Claude peut désormais ajouter des notes dans ton appli, chercher dedans, lister tes notes récentes et lire tes chiffres de la semaine.",
      "Exemple : « importe ma page Notion Idées dans mes notes EP Coaching ». La clé est personnelle, jamais stockée en clair, et tu peux la révoquer à tout moment.",
    ],
    related: ["/appli/claude-notion/", "/aide/relier-claude-et-notion/"],
  },
  {
    slug: "agenda-vivant",
    date: "2026-09-30",
    cat: "produit",
    title: "Un agenda qui suit ta vraie journée",
    summary: "Un retard ? Décale un bloc et toute la suite de la journée suit. Et chaque bloc t'emmène au bon endroit de l'appli.",
    body: [
      "Une semaine type, c'est parfait sur le papier. Puis le réveil sonne en retard, une réunion déborde, et tout le reste de la journée n'a plus de sens.",
      "L'agenda EP Coaching se réorganise avec toi : touche le bloc qui a sauté, choisis « Commencer maintenant » ou décale de 15, 30 ou 60 minutes, et toute la suite se décale avec. « Aujourd'hui seulement » ne touche pas à ta semaine type.",
      "Et chaque bloc est relié à la bonne page : un repas ouvre ta nutrition, une séance ton programme, un bloc contenu tes scripts.",
    ],
    related: ["/appli/agenda/", "/aide/reorganiser-sa-journee/"],
  },
  {
    slug: "reponses-rapides",
    date: "2026-09-30",
    cat: "produit",
    title: "Ton poids, tes calories, tes leads : en un geste",
    summary: "La loupe de l'appli répond directement : tape « poids », « calories » ou « leads » et le chiffre s'affiche.",
    body: [
      "Combien je pèse en moyenne cette semaine ? Combien de calories en moyenne ? Combien de leads m'a rapporté ma dernière vidéo ? Ces questions demandaient d'ouvrir trois menus.",
      "Désormais, tu touches la loupe et tu tapes un mot. « poids », « calories », « sommeil », « pas », « séances » : le chiffre s'affiche tout de suite. Côté coach : « clients », « bilans », « leads », « paie ».",
    ],
    related: ["/appli/recherche/", "/aide/trouver-une-info/"],
  },
  {
    slug: "equipe-et-paie",
    date: "2026-09-30",
    cat: "coachs",
    title: "Équipe et paie : la paie du mois se calcule seule",
    summary: "Tout coach peut maintenant monter son équipe dans EP Coaching, avec la rémunération de chacun calculée à partir des vraies ventes.",
    body: [
      "Passer de coach solo à entreprise, c'est souvent le moment où tout se complique : qui a vendu quoi, combien payer le closer, qui s'occupe de quel client.",
      "Dans Mon équipe, tu choisis « Mon entreprise, avec une équipe », tu invites tes coachs ou tu donnes un accès métier (setter, closer, monteur et d'autres). Chacun a un espace adapté à son poste.",
      "Tu règles la rémunération de chacun une fois (fixe, commissions, paiement à la pièce), et chaque mois la paie se calcule à partir des ventes et livraisons réelles. Pour la voir : tape « paie » dans la loupe.",
    ],
    related: ["/appli/equipe/", "/solutions/equipes/", "/aide/monter-son-equipe/"],
  },
  {
    slug: "formations-pour-tous-les-coachs",
    date: "2026-09-30",
    cat: "coachs",
    title: "Crée et vends ta formation dans l'appli",
    summary: "Tous les coachs peuvent créer leur formation vidéo, la donner à leurs clients ou la vendre avec leur propre lien de paiement.",
    body: [
      "Une formation, c'est souvent le premier produit qui permet à un coach de ne plus vendre uniquement son temps.",
      "Dans Business, Mes formations, tu crées ta formation en sections, avec tes vidéos YouTube (même non répertoriées). Tu choisis ensuite : incluse pour tes clients, ou payante avec ton lien de paiement. Après un achat, tu donnes l'accès en un clic.",
    ],
    related: ["/appli/formations/", "/aide/creer-sa-formation/"],
  },
  {
    slug: "stats-reseaux-pour-tous-les-coachs",
    date: "2026-09-30",
    cat: "coachs",
    title: "Stats réseaux et leads par publication, pour tous les coachs",
    summary: "Note tes chiffres chaque semaine, relie tes publications à leurs scripts et vois les leads qu'elles apportent.",
    body: [
      "Les vues ne paient pas les factures. Ce qui compte, c'est de savoir quel contenu fait venir des gens intéressés.",
      "Mes stats réseaux te permet de noter tes chiffres chaque semaine (le bouton « Où trouver ces chiffres ? » te montre où les lire), d'ajouter tes publications et de les relier au script du Studio qui les a produites. Les leads captés sur le guide lié à un script remontent sur la publication.",
    ],
    related: ["/appli/stats-reseaux/", "/aide/suivre-ses-stats/"],
  },
  {
    slug: "forme-du-jour",
    date: "2026-09-30",
    cat: "produit",
    title: "Forme du jour : énergie, moral, hydratation et plus",
    summary: "Le bilan du jour peut maintenant suivre ton énergie, ton moral, ton hydratation, tes courbatures, ta fréquence cardiaque au repos et ta VFC.",
    body: [
      "Le poids ne raconte qu'une partie de l'histoire. Une semaine où tu dors mal, où l'énergie est basse et où les courbatures ne passent pas, c'est une information précieuse pour ajuster.",
      "Le bilan propose désormais une carte Forme du jour : énergie, moral, hydratation, courbatures, et si tu as une montre, fréquence cardiaque au repos et variabilité cardiaque. Tout est optionnel, à activer dans Mon appli.",
    ],
    related: ["/appli/bilan/", "/aide/remplir-son-bilan/"],
  },
  {
    slug: "navigation-et-centre-daide",
    date: "2026-09-30",
    cat: "produit",
    title: "Nouvelle navigation téléphone et centre d'aide",
    summary: "Cinq onglets clairs, une page Plus, une visite guidée à la première connexion et un centre d'aide avec des tutoriels pas à pas.",
    body: [
      "L'appli a beaucoup grandi, il fallait qu'elle reste simple à prendre en main. La navigation téléphone tient maintenant en cinq onglets : côté membre Aujourd'hui, Training, Suivi, Coach et Plus ; côté coach Aujourd'hui, Clients, Business, Moi et Plus.",
      "À la première connexion, une visite guidée présente l'essentiel en quelques écrans. Et la rubrique Aide et tutoriels regroupe des guides pas à pas pour installer l'appli, activer les notifications, relier Claude, monter son équipe et bien plus.",
    ],
    related: ["/aide/", "/aide/premiers-pas-membre/"],
  },
  {
    slug: "mon-appli-personnalisation",
    date: "2026-09-29",
    cat: "produit",
    title: "Mon appli : l'appli s'adapte à toi",
    summary: "Quelques questions, et EP Coaching ne garde que ce qui te sert : menu, bilan et accueil se règlent sur tes réponses.",
    body: [
      "Tu ne suis pas ta masse grasse ? Tu ne prépares pas de compétition ? Tu n'as pas besoin de voir ces rubriques.",
      "Mon appli te pose quelques questions sur ce que tu suis et, si tu es coach, sur ta façon de travailler. Le menu, ton bilan et ton accueil ne gardent que ce que tu as choisi. Tu peux changer d'avis à tout moment.",
    ],
    related: ["/appli/personnalisation/", "/aide/choisir-ses-suivis/"],
  },
  {
    slug: "seance-guidee",
    date: "2026-09-29",
    cat: "produit",
    title: "Une séance guidée, série par série",
    summary: "Cibles série par série, repos qui ne bloque jamais, records justes et historique complet : le logbook a été repensé.",
    body: [
      "Le logbook est le cœur de l'entraînement : s'il est pénible, on arrête de noter, et on arrête de progresser.",
      "La séance te guide maintenant exercice par exercice avec des cibles série par série. Le temps de repos démarre seul sans bloquer l'écran, la séance précédente est affichée à côté, tes records sont calculés proprement et ton historique est complet.",
    ],
    related: ["/appli/entrainement/", "/aide/lancer-sa-seance/"],
  },
  {
    slug: "road-map-et-phases",
    date: "2026-09-28",
    cat: "produit",
    title: "Road Map : ton objectif découpé en phases",
    summary: "La Road Map met en évidence ta phase active et ce qui vient ensuite.",
    body: [
      "Un objectif sans étapes, c'est un vœu. La Road Map découpe le tien en phases (prise de muscle, sèche, maintien, reprise), avec la phase active résumée en haut et tes objectifs associés.",
    ],
    related: ["/appli/road-map/"],
  },
  {
    slug: "tracker-nutrition-bati-sur-le-plan",
    date: "2026-09-27",
    cat: "produit",
    title: "Un tracker nutrition bâti sur ton plan",
    summary: "Tes repas prévus sont déjà là : tu valides, tu remplaces, et tes calories remontent seules dans ton bilan.",
    body: [
      "Le tracker nutrition classique te met face à une page blanche et te demande de tout chercher. Ça ne tient pas plus de deux semaines.",
      "Le nouveau tracker part de ton plan. Un repas mangé comme prévu se valide en un geste, un repas différent se remplace facilement, et les totaux du jour remontent dans ton bilan. Les bilans des jours passés peuvent aussi être rattrapés.",
    ],
    related: ["/appli/nutrition/", "/aide/suivre-sa-nutrition/"],
  },
  {
    slug: "accessibilite",
    date: "2026-09-26",
    cat: "produit",
    title: "Accessibilité : taille du texte et animations",
    summary: "Une rubrique Accessibilité dans les paramètres pour agrandir le texte et réduire les animations.",
    body: [
      "Une appli qu'on ouvre tous les jours doit être confortable pour tout le monde. La nouvelle rubrique Accessibilité permet d'agrandir le texte et de réduire les animations.",
    ],
    related: ["/aide/accessibilite/"],
  },
  {
    slug: "espaces-metier-equipe",
    date: "2026-09-25",
    cat: "coachs",
    title: "Un espace de travail pour chaque métier de l'équipe",
    summary: "Setter, closer, monteur et les autres postes ont leur espace : tâches, rendez-vous, livrables, messagerie d'équipe et parcours de formation.",
    body: [
      "Une équipe qui travaille dans des outils éparpillés, c'est de l'information perdue à chaque passage de relais.",
      "Chaque poste a désormais son espace dans EP Coaching : un accueil qui montre les priorités du jour, les outils propres au métier (prospects, rendez-vous, livrables, campagnes), la messagerie d'équipe, les documents et un parcours de formation pour les premières semaines.",
    ],
    related: ["/appli/equipe/", "/solutions/equipes/"],
  },
  {
    slug: "pilotage-business",
    date: "2026-09-22",
    cat: "coachs",
    title: "Le pilotage business du coach",
    summary: "Non-négociables du jour et chiffres de la semaine : le tableau de bord pour piloter ton activité comme une entreprise.",
    body: [
      "Beaucoup de coachs savent combien de clients ils ont, rarement combien d'appels ils ont bookés cette semaine ou combien leur coûte un lead.",
      "Le pilotage rassemble tes non-négociables quotidiens et tes chiffres hebdomadaires par catégorie, avec un repère sur les appels bookés. Il s'appuie sur les autres outils de l'appli (appels de vente, leads, publicité, compta) pour éviter les doubles saisies.",
    ],
    related: ["/appli/pilotage/"],
  },
  {
    slug: "prompteur-avec-camera",
    date: "2026-09-17",
    cat: "coachs",
    title: "Un prompteur avec caméra dans le Studio créatif",
    summary: "Le prompteur enchaîne tes scripts prêts à tourner et peut enregistrer directement.",
    body: [
      "Tourner une vidéo, c'est souvent trois applis : les notes pour le texte, un prompteur, la caméra. Le Studio créatif réunit les trois.",
      "Le prompteur enchaîne tes scripts prêts à tourner, du plus ancien au plus récent, et peut enregistrer directement. Tu marques ensuite « J'ai tourné », puis « J'ai posté ».",
    ],
    related: ["/appli/studio/", "/aide/ecrire-et-tourner/"],
  },
  {
    slug: "masterclass-et-publicite",
    date: "2026-09-16",
    cat: "coachs",
    title: "Masterclass business et suivi de la publicité",
    summary: "Des tutoriels pas à pas avec un résultat concret à produire, et un outil pour piloter tes campagnes publicitaires.",
    body: [
      "Les masterclass sont des tutoriels complets, de A à Z, sur un outil ou un système business : à la fin, tu as un résultat réel produit, pas seulement une lecture.",
      "Le suivi publicitaire te permet de reporter les chiffres de tes campagnes (Google, Meta, TikTok) : l'appli calcule le coût par lead, le taux de clic et le retour sur dépense publicitaire.",
    ],
    related: ["/appli/pilotage/"],
  },
];

export const NEWS_SORTED = [...NEWS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
