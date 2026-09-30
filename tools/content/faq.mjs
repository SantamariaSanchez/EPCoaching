// Questions fréquentes, visibles sur /faq/ et balisées en FAQPage. Chaque
// réponse reprend uniquement des faits vérifiés dans l'appli ou sur ce site.

export const FAQ_GROUPS = [
  {
    id: "general",
    title: "EP Coaching en général",
    items: [
      { q: "Qu'est-ce qu'EP Coaching ?", a: "EP Coaching, c'est une appli de coaching et un accompagnement humain. L'appli sert à la fois aux personnes qui veulent progresser en musculation et en nutrition, et aux coachs qui veulent suivre leurs clients et faire grandir leur activité. Le tout a été fondé par Santamaria Sanchéz." },
      { q: "Qui est derrière EP Coaching ?", a: "Santamaria Sanchéz, coach en musculation et en nutrition, athlète naturel, fondateur d'EP Coaching. Il accompagne des personnes qui veulent transformer leur physique et des coachs qui veulent structurer leur activité." },
      { q: "À qui s'adresse l'appli ?", a: "À trois profils : les membres qui veulent se suivre eux-mêmes, les clients accompagnés par un coach, et les coachs (seuls ou avec une équipe) qui gèrent leurs clients et leur business." },
      { q: "Est-ce que l'appli est gratuite ?", a: "Oui, l'inscription et le suivi en autonomie sont gratuits, sans carte bancaire. L'accompagnement par un coach et l'espace coach sont des offres payantes." },
      { q: "Pourquoi le site n'affiche-t-il pas de prix ?", a: "Parce que chaque accompagnement commence par un échange : on regarde ta situation avant de te proposer quoi que ce soit. Pour l'espace coach, les offres sont présentées au moment de l'inscription." },
      { q: "EP Coaching remplace-t-il un médecin ou un diététicien ?", a: "Non. EP Coaching accompagne l'entraînement, la nutrition du sportif et les habitudes. Pour une pathologie, une blessure ou un besoin médical, un professionnel de santé reste la référence." },
    ],
  },
  {
    id: "appli",
    title: "L'appli au quotidien",
    items: [
      { q: "Qu'est-ce que je peux suivre dans l'appli ?", a: "Ton entraînement (programme, séances, records), ta nutrition (repas, calories, macros), ton bilan du jour (poids, sommeil, pas, énergie, moral, hydratation, courbatures), tes photos et mensurations, ta semaine et tes objectifs. Tu choisis ce que tu suis dans Mon appli." },
      { q: "Combien de temps ça prend par jour ?", a: "Le bilan du jour prend environ 30 secondes, matin et soir. Les repas prévus se valident en un geste, et la séance se note pendant que tu t'entraînes." },
      { q: "Faut-il peser tous ses aliments ?", a: "Non. Le tracker part de ton plan : un repas mangé comme prévu se valide en un geste. Peser reste utile au début pour apprendre les portions." },
      { q: "L'appli propose-t-elle des programmes d'entraînement ?", a: "Oui. Sans coach, l'appli peut te proposer un programme adapté à ton niveau et à ton matériel. Avec un coach, c'est lui qui construit ton programme." },
      { q: "Ça marche si je m'entraîne à la maison ?", a: "Oui, le programme tient compte du matériel que tu as, en salle comme à la maison." },
      { q: "Est-ce qu'il y a des recettes ?", a: "Oui, une base de recettes du monde et de terroir, filtrables par temps et par budget, avec les portions pour cuisiner à l'avance." },
      { q: "Je peux retrouver mon poids de la semaine rapidement ?", a: "Oui : touche la loupe et tape « poids ». Même chose pour « calories », « sommeil », « pas » ou « séances »." },
      { q: "L'appli a-t-elle un agenda ?", a: "Oui. Tu construis ta semaine type, et quand un bloc saute, tu le décales : toute la suite de la journée suit. Chaque bloc ouvre la bonne page de l'appli." },
      { q: "Est-ce qu'il y a une prise de notes ?", a: "Oui, des notes façon Obsidian : #tags qui rangent tout seuls, liens entre notes avec [[Titre]], captures d'écran, dictée et recherche instantanée." },
      { q: "Peut-on relier l'appli à Claude ou à Notion ?", a: "Oui, EP Coaching s'ajoute comme connecteur personnalisé dans Claude. Claude peut alors importer une page Notion dans tes notes, chercher dedans et lire tes chiffres de la semaine." },
    ],
  },
  {
    id: "coaching",
    title: "Coaching et accompagnement",
    items: [
      { q: "Comment être accompagné par un coach ?", a: "Si un coach t'a envoyé un lien d'invitation, crée ton compte avec ce lien. Sinon, parcours l'annuaire des coachs, ou réserve un appel pour l'accompagnement physique de Santamaria Sanchéz." },
      { q: "Comment se passe l'accompagnement physique 1-to-1 ?", a: "On commence par un appel gratuit pour faire le point sur ta situation. Si l'accompagnement est adapté, ton coach construit ton plan (entraînement, nutrition, objectifs), puis l'ajuste en continu avec toi." },
      { q: "Qu'est-ce qu'un check-in hebdomadaire ?", a: "Une fois par semaine, ton bilan de la semaine part à ton coach, qui te répond directement dans l'appli pour ajuster la suite." },
      { q: "Je prépare une compétition, EP Coaching peut m'aider ?", a: "Oui : poses de ta catégorie, guide de posing, compte à rebours et suivi précis. L'accompagnement est pensé par un athlète naturel qui prépare lui-même la compétition." },
      { q: "Les coachs d'EP Coaching sont-ils de vraies personnes ?", a: "Oui. L'accompagnement est assuré par des coachs humains, qui lisent tes bilans et te répondent." },
    ],
  },
  {
    id: "coachs",
    title: "Pour les coachs",
    items: [
      { q: "Que peut faire un coach dans EP Coaching ?", a: "Suivre ses clients (bilans, programmes, nutrition, messages, check-ins, lives), créer et publier son contenu (Studio créatif, stats réseaux), vendre ses formations, piloter son business (ventes, leads, publicité, compta) et gérer une équipe avec la paie calculée." },
      { q: "Mes clients doivent-ils payer l'appli ?", a: "Non, tes clients utilisent l'appli dans le cadre de ton accompagnement." },
      { q: "Comment inviter mes clients ?", a: "Ton lien d'invitation personnel est dans tes paramètres. Un client qui s'inscrit avec ce lien arrive directement dans ton espace." },
      { q: "Les autres coachs peuvent-ils voir mes clients ?", a: "Non, jamais. Chaque coach n'a accès qu'à ses propres clients." },
      { q: "Je peux vendre ma formation avec EP Coaching ?", a: "Oui. Tu crées ta formation (sections et vidéos YouTube), puis tu choisis : incluse pour tes clients, ou payante avec ton propre lien de paiement. Après un achat, tu donnes l'accès en un clic." },
      { q: "L'appli m'aide à trouver des clients ?", a: "Elle t'aide à produire ton contenu (scripts, prompteur, suivi de publication), à mesurer ce qui marche (stats réseaux, leads par publication), à relancer tes prospects (pipeline de leads, appels de vente) et à envoyer tes emails. Le travail de fond reste le tien, l'appli le rend plus simple." },
      { q: "Je travaille avec un setter et un closer, c'est géré ?", a: "Oui. Chaque membre de ton équipe a un espace adapté à son métier, et la paie du mois se calcule à partir des vraies ventes." },
      { q: "Je débute comme coach, c'est pour moi ?", a: "Oui. Mon appli masque ce qui ne te sert pas encore, et les masterclass business partent de zéro. Tu peux aussi être accompagné en 1-to-1 sur ton business." },
    ],
  },
  {
    id: "compte",
    title: "Compte, données et sécurité",
    items: [
      { q: "Mes données sont-elles privées ?", a: "Oui. Tes données de suivi ne sont visibles que par toi, et par ton coach si tu es accompagné. Tes photos et tes notes sont stockées dans des espaces privés." },
      { q: "Puis-je exporter mes données ?", a: "Oui, depuis Plus, Paramètres, « Exporter mes données »." },
      { q: "Comment supprimer mon compte ?", a: "Depuis Plus, Paramètres, « Supprimer mon compte ». La suppression est définitive." },
      { q: "J'ai oublié mon mot de passe, je fais comment ?", a: "Sur la page de connexion, touche « Mot de passe oublié » et suis l'email reçu." },
      { q: "Qui héberge mes données ?", a: "L'appli est hébergée par Vercel et la base de données par Supabase. Les paiements passent par Stripe. Le détail est dans la politique de confidentialité." },
    ],
  },
  {
    id: "technique",
    title: "Téléphone et technique",
    items: [
      { q: "Faut-il télécharger l'appli sur l'App Store ou Google Play ?", a: "Pas besoin : EP Coaching s'installe directement depuis ton navigateur sur ton écran d'accueil (Safari sur iPhone, Chrome sur Android)." },
      { q: "L'appli fonctionne-t-elle sur ordinateur ?", a: "Oui, dans n'importe quel navigateur récent, avec les mêmes données que sur ton téléphone." },
      { q: "Je ne reçois pas les notifications, pourquoi ?", a: "Sur iPhone, l'appli doit être installée sur ton écran d'accueil. Vérifie ensuite que les notifications sont activées dans Paramètres et autorisées dans les réglages de ton téléphone." },
      { q: "Peut-on agrandir le texte ?", a: "Oui, dans Paramètres, rubrique Accessibilité : taille du texte et animations réglables." },
      { q: "Comment contacter l'assistance ?", a: "Depuis la page Assistance de l'appli. Une vraie personne te répond sous 48 heures ouvrées." },
    ],
  },
];

export const FAQ_ALL = FAQ_GROUPS.flatMap((g) => g.items);
