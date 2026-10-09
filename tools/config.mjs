// Configuration commune du générateur (tools/build.mjs).
// Le site reste 100% statique (GitHub Pages) : ce générateur tourne en local
// avec Node, sans aucune dépendance npm, et écrit des fichiers HTML ordinaires
// qui sont commités. Pour changer de domaine un jour (CNAME), seule BASE est à
// modifier, puis relancer `node tools/build.mjs`.

export const BASE = "https://santamariasanchez.github.io/EPCoaching/";
export const APP = "https://ep-coaching.vercel.app";
export const BUILD_DATE = process.env.SITE_DATE || new Date().toISOString().slice(0, 10);

// Liens d'inscription : toujours nus, sans paramètre (retour direct du
// fondateur le 2026-09-30, l'appli détecte seule d'où vient le visiteur).
export const LINKS = {
  signupMember: `${APP}/auth/client`,
  signupCoach: `${APP}/auth/coach`,
  login: `${APP}/auth/client?mode=login`,
  support: `${APP}/support`,
  careers: `${APP}/carrieres`,
  calculator: `${APP}/outils`,
  guides: `${APP}/ressources`,
  successes: `${APP}/reussites`,
  coachDirectory: `${APP}/coachs`,
  cgu: `${APP}/legal/cgu`,
  cgv: `${APP}/legal/cgv`,
  privacy: `${APP}/legal/confidentialite`,
  prequalification: "https://ep-coaching-formulaires.vercel.app/prequalification",
};

export const SOCIALS = [
  { name: "Instagram", url: "https://instagram.com/santamariasanchezep" },
  { name: "Threads", url: "https://www.threads.net/@santamariasanchezep" },
  { name: "TikTok", url: "https://www.tiktok.com/@santamariasanchez_" },
  { name: "YouTube", url: "https://www.youtube.com/@santamaria_sanchez" },
];

// Navigation principale (header). Les chemins sont absolus au site ; le
// générateur les transforme en chemins relatifs selon la profondeur de la
// page (le site vit sous un sous-chemin GitHub Pages).
export const NAV = [
  { label: "L'appli", href: "/appli/" },
  { label: "Coachs", href: "/solutions/coachs/" },
  { label: "Coaching physique", href: "/physique/" },
  { label: "Ressources", href: "/ressources/" },
  { label: "Actus", href: "/actus/" },
  { label: "Aide", href: "/aide/" },
];

export const FOOTER_COLUMNS = [
  {
    title: "L'appli",
    links: [
      ["Vue d'ensemble", "/appli/"],
      ["Aujourd'hui", "/appli/aujourdhui/"],
      ["Entraînement", "/appli/entrainement/"],
      ["Nutrition", "/appli/nutrition/"],
      ["Bilan du jour", "/appli/bilan/"],
      ["Agenda", "/appli/agenda/"],
      ["Notes", "/appli/notes/"],
      ["Toutes les fonctionnalités", "/appli/#fonctionnalites"],
    ],
  },
  {
    title: "Pour les coachs",
    links: [
      ["La plateforme coach", "/solutions/coachs/"],
      ["Gestion des clients", "/appli/clients/"],
      ["Studio créatif", "/appli/studio/"],
      ["Stats réseaux", "/appli/stats-reseaux/"],
      ["Formations", "/appli/formations/"],
      ["Équipe et paie", "/appli/equipe/"],
      ["Accompagnement business", "/business/"],
    ],
  },
  {
    title: "Solutions",
    links: [
      ["Pour te suivre toi-même", "/solutions/membres/"],
      ["Pour les coachs", "/solutions/coachs/"],
      ["Pour les équipes", "/solutions/equipes/"],
      ["Coaching physique 1-to-1", "/physique/"],
    ],
  },
  {
    title: "Ressources",
    links: [
      ["Guides gratuits", "/ressources/"],
      ["Calculateur de macros", "LINK:calculator"],
      ["Actus et nouveautés", "/actus/"],
      ["Trouver un coach", "LINK:coachDirectory"],
    ],
  },
  {
    title: "Aide",
    links: [
      ["Centre d'aide", "/aide/"],
      ["Questions fréquentes", "/faq/"],
      ["Installer l'appli", "/aide/installer-lappli/"],
      ["Nous écrire", "/contact/"],
    ],
  },
  {
    title: "EP Coaching",
    links: [
      ["À propos", "/a-propos/"],
      ["Carrières", "LINK:careers"],
      ["Sécurité et données", "/securite/"],
      ["Contact", "/contact/"],
    ],
  },
];

// Barre du bas, façon Instagram desktop : une ligne de petits liens.
export const FOOTER_BAR = [
  ["À propos", "/a-propos/"],
  ["Aide", "/aide/"],
  ["FAQ", "/faq/"],
  ["Actus", "/actus/"],
  ["Carrières", "LINK:careers"],
  ["Confidentialité", "LINK:privacy"],
  ["Conditions", "LINK:cgu"],
  ["CGV", "LINK:cgv"],
  ["Mentions légales", "/legal/mentions-legales/"],
  ["Cookies", "/legal/cookies/"],
  ["Plan du site", "/plan-du-site/"],
  ["Contact", "/contact/"],
];

// VSL de la page d'accueil (10 min, motion design). Mettre ici l'identifiant
// YouTube de la vidéo (la partie après v= ou après youtu.be/) une fois en
// ligne : la section affiche alors le lecteur. Vide = « bientôt en ligne ».
export const VSL_YOUTUBE_ID = "";
