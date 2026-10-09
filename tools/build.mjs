// Générateur du site vitrine EP Coaching.
//   node tools/build.mjs
// Écrit toutes les pages de contenu en HTML statique, régénère sitemap.xml,
// et remet à jour le header/footer des pages écrites à la main (accueil,
// physique, business, 404) pour que tout le site partage la même navigation.
// Aucune dépendance : Node 18+ suffit.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BASE, APP, LINKS, BUILD_DATE, SOCIALS } from "./config.mjs";
import {
  esc, resolve, link, icon, pageHtml, hero, section, cardGrid, steps, faqList, faqJsonLd, ctaBand,
  headerHtml, footerHtml, canonical, ORG_JSONLD, phone, logoMarquee,
} from "./render.mjs";
import { buildHome, quizBlock } from "./home.mjs";
import { readdirSync } from "node:fs";
import { FEATURES, FEATURE_GROUPS, FEATURE_BY_SLUG } from "./content/features.mjs";
import { HELP_CATEGORIES, HELP_ARTICLES, HELP_BY_SLUG } from "./content/help.mjs";
import { FAQ_GROUPS, FAQ_ALL } from "./content/faq.mjs";
import { NEWS_SORTED, NEWS_CATEGORIES } from "./content/news.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GUIDES = JSON.parse(readFileSync(join(ROOT, "tools/data/guides.json"), "utf8"));
const written = [];

// Logos d'outils (Simple Icons) : titre retiré, masqués aux lecteurs d'écran
// (le nom est écrit à côté).
const SVGS = Object.fromEntries(
  readdirSync(join(ROOT, "assets/images/logos"))
    .filter((f) => f.endsWith(".svg"))
    .map((f) => [f.replace(".svg", ""), readFileSync(join(ROOT, "assets/images/logos", f), "utf8").replace(/<title>[^<]*<\/title>/, "").replace("<svg ", '<svg aria-hidden="true" focusable="false" ')])
);

// Capture d'écran réelle de l'appli montrée pour chaque rubrique.
const SHOT = {
  aujourdhui: "aujourdhui", entrainement: "entrainement", nutrition: "nutrition", bilan: "bilan", progression: "progression",
  "road-map": "road-map", semaine: "semaine", messages: "messages", communaute: "communaute", formations: "formations",
  bibliotheque: "bibliotheque", agenda: "agenda", notes: "notes", recherche: "recherche", "claude-notion": "notes",
  personnalisation: "personnalisation", "appli-mobile": "aujourdhui", clients: "clients", live: "live", studio: "coach-agenda",
  "stats-reseaux": "stats-reseaux", pilotage: "coach-accueil", mailing: "mailing", equipe: "equipe",
};

function fxHero({ eyebrow, title, lead, ctas, path, shot, alt }) {
  const buttons = ctas.map((c, i) => `<a href="${esc(resolve(c.href, path))}" class="${i === 0 ? "btn-cta-primary" : "btn-ghost"}">${esc(c.label)}</a>`).join("");
  return `<section class="fx-hero">
    <div class="hx-copy">
      <p class="eyebrow">◆ ${esc(eyebrow)}</p>
      <h1>${title}</h1>
      <p class="page-lead">${lead}</p>
      <div class="cta-row">${buttons}</div>
      <p class="hx-proof"><span>${icon("shield")} Gratuit, sans carte bancaire</span><span>${icon("phone")} Sur ton téléphone et ton ordinateur</span></p>
    </div>
    <div class="fx-hero-visual">${phone(shot, alt, path, "", "", true)}</div>
  </section>`;
}

function write(path, html) {
  const file = join(ROOT, path === "/" ? "index.html" : path.replace(/^\//, "") + "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  written.push(path);
}

// Garde-fou éditorial : aucune page ne part avec un tiret long ou un prix.
function lint(path, html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  if (/[–—]/.test(text)) throw new Error(`Tiret long interdit dans ${path}`);
  // Les accroches des guides peuvent citer le prix d'un objet (un rack, un
  // capteur) : ce ne sont pas des tarifs EP Coaching, elles sont exclues.
  const own = text.replace(/<ul class="guide-list"[\s\S]*?<\/ul>/g, "");
  if (/\d\s?(€|euros?\b)/i.test(own)) throw new Error(`Prix interdit dans ${path}`);
}

function emit(page) {
  const html = pageHtml(page);
  lint(page.path, html);
  write(page.path, html);
}

const dateFr = (iso) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

const HOME = ["Accueil", "/"];

// ── Ressources (guides gratuits) ─────────────────────────────────────────
const GUIDE_CATS = [
  { name: "Nutrition", slug: "nutrition", icon: "apple", desc: "Calories, protéines, repas du quotidien, compléments, sèche et prise de masse, sans régime miracle." },
  { name: "Entraînement", slug: "entrainement", icon: "dumbbell", desc: "Programmes, technique, progression, échec musculaire, volume : ce qui fait vraiment grossir et devenir fort." },
  { name: "Récupération", slug: "recuperation", icon: "heart", desc: "Sommeil, courbatures, repos, stress et blessures : récupérer pour progresser." },
  { name: "Psychologie", slug: "psychologie", icon: "target", desc: "Motivation, régularité, rapport au corps, entourage : le mental qui tient sur la durée." },
  { name: "Steps & activité quotidienne", slug: "pas-et-activite", icon: "map", desc: "Pas, activité hors salle, dépense du quotidien : le levier le plus sous-estimé." },
  { name: "Général", slug: "bases", icon: "book", desc: "Les questions de base qu'on n'ose plus poser, expliquées simplement." },
  { name: "Entrepreneuriat", slug: "business-de-coach", icon: "briefcase", desc: "Pour les coachs : trouver des clients, créer du contenu, vendre, s'organiser." },
];
const guidesOf = (cat) => GUIDES.filter((g) => g.category === cat.name);
const guideUrl = (g) => `${APP}/ressources/${encodeURIComponent(g.slug)}`;

function guideList(list) {
  return `<ul class="guide-list" data-filter-list>${list
    .map((g) => `<li class="guide-item" data-search="${esc((g.title + " " + g.hook).toLowerCase())}"><a href="${guideUrl(g)}" target="_blank" rel="noopener"><span class="guide-title">${esc(g.title)}</span><span class="guide-hook">${esc(g.hook)}</span></a></li>`)
    .join("")}</ul>`;
}

function filterBox(placeholder, target = "") {
  return `<div class="filter-box"><label for="filtre" class="sr-only">${esc(placeholder)}</label>${icon("search")}<input id="filtre" type="search" class="filter-input" placeholder="${esc(placeholder)}" autocomplete="off" data-filter${target ? ` data-filter-target="${target}"` : ""} /><p class="filter-empty" hidden>Aucun résultat. Essaie un autre mot.</p></div>`;
}

// ── Pages fonctionnalités ────────────────────────────────────────────────
function featureCards(slugs, path) {
  return cardGrid(
    slugs.map((s) => FEATURE_BY_SLUG[s]).filter(Boolean).map((f) => ({ icon: f.icon, title: f.name, text: esc(f.summary), href: `/appli/${f.slug}/`, kicker: f.for })),
    path
  );
}

function helpLinks(slugs, path) {
  const arts = slugs.map((s) => HELP_BY_SLUG[s]).filter(Boolean);
  if (!arts.length) return "";
  return `<ul class="link-list">${arts.map((a) => `<li>${link(`/aide/${a.slug}/`, `${icon("help", "icon icon--xs")}<span>${esc(a.title)}</span>`, path)}</li>`).join("")}</ul>`;
}

const isCoachFeature = (f) => f.group === "coach" || (f.group === "business" && f.slug !== "formations");

for (const f of FEATURES) {
  const path = `/appli/${f.slug}/`;
  const group = FEATURE_GROUPS.find((g) => g.id === f.group);
  const coach = isCoachFeature(f);
  const primary = coach ? { label: "Espace coach gratuit", href: "LINK:signupCoach" } : { label: "Essayer gratuitement", href: "LINK:signupMember" };
  const body = [
    fxHero({ eyebrow: f.name, title: f.title, lead: esc(f.lead), path, ctas: [primary, { label: "Voir toute l'appli", href: "/appli/" }], shot: SHOT[f.slug] || "aujourdhui", alt: `Écran ${f.name} de l'appli EP Coaching` }),
    `<div class="meta-strip"><span class="chip">${icon("users", "icon icon--xs")} ${esc(f.for)}</span><span class="chip">${esc(group.title)}</span></div>`,
    section({ eyebrow: "Ce que tu peux faire", title: `${esc(f.name)}, <span class="accent">concrètement</span>`, content: cardGrid(f.points.map((p) => ({ icon: p.icon, title: p.t, text: esc(p.d) })), path) }),
    f.steps ? section({ eyebrow: "Pas à pas", title: esc(f.stepsTitle || "Comment ça marche"), content: steps(f.steps.map((s) => ({ t: s.t, d: esc(s.d) }))), narrow: true }) : "",
    f.coachNote ? section({ content: `<aside class="callout">${icon("users")}<p>${esc(f.coachNote)}</p></aside>`, narrow: true }) : "",
    f.extraCta ? section({ content: `<p class="center">${link(f.extraCta.href, esc(f.extraCta.label), path, "btn-ghost")}</p>`, narrow: true }) : "",
    f.help.length ? section({ eyebrow: "Guides pas à pas", title: "Bien t'en servir", content: helpLinks(f.help, path), narrow: true }) : "",
    f.faq.length ? section({ eyebrow: "Questions fréquentes", title: `${esc(f.name)} : <span class="accent">tes questions</span>`, content: faqList(f.faq), narrow: true }) : "",
    section({ eyebrow: "À découvrir aussi", title: "Ça va bien avec", content: featureCards(f.related, path) }),
    ctaBand({
      title: coach ? `Prêt à <span class="accent">coacher mieux</span> ?` : `Prêt à <span class="accent">t'y mettre</span> ?`,
      text: coach ? "Crée ton espace coach, invite tes clients, et garde tout ton business au même endroit." : "L'inscription est gratuite et sans carte bancaire. Tu peux commencer aujourd'hui.",
      primary,
      secondary: { label: "Questions fréquentes", href: "/faq/" },
      path,
    }),
  ].join("\n");
  emit({
    path,
    title: f.metaTitle,
    description: f.metaDesc,
    body,
    crumbs: [HOME, ["L'appli", "/appli/"], [f.name, path]],
    jsonld: f.faq.length ? [faqJsonLd(f.faq)] : [],
  });
}

// ── /appli/ : vue d'ensemble ─────────────────────────────────────────────
{
  const path = "/appli/";
  const groups = FEATURE_GROUPS.map((g) =>
    section({
      id: g.id,
      eyebrow: g.title,
      title: esc(g.title),
      intro: esc(g.intro),
      content: featureCards(FEATURES.filter((f) => f.group === g.id).map((f) => f.slug), path),
    })
  ).join("\n");
  const body = [
    `<section class="hx">
      <div class="hx-aura" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="hx-copy">
        <p class="eyebrow">◆ L'appli EP Coaching</p>
        <h1>Tout ton suivi. Tout ton coaching. <span class="accent">Une seule appli.</span></h1>
        <p class="page-lead">Entraînement, nutrition, bilan, progression, agenda, notes : pour te suivre toi-même. Clients, contenu, formations, ventes, équipe : pour faire grandir ton activité de coach.</p>
        <div class="cta-row"><a class="btn-cta-primary btn-cta-primary--lg" href="${LINKS.signupMember}">Essayer gratuitement</a><a class="btn-ghost" href="${resolve("/solutions/coachs/", path)}">Je suis coach</a></div>
        <p class="hx-proof"><span>${icon("shield")} Gratuit, sans carte bancaire</span><span>${icon("map")} Données hébergées en Europe</span></p>
      </div>
      <div class="phones">${phone("entrainement", "Écran Programme", path, "p-left", "", true)}${phone("aujourdhui", "Écran Aujourd'hui", path, "p-center", "", true)}${phone("clients", "Écran Clients côté coach", path, "p-right", "", true)}</div>
    </section>`,
    logoMarquee(SVGS),
    section({
      eyebrow: "Trois espaces",
      title: `Une appli, <span class="accent">trois façons</span> de l'utiliser`,
      content: cardGrid(
        [
          { icon: "heart", kicker: "Gratuit", title: "Pour te suivre toi-même", text: "Programme, séances, repas, bilan, photos : tu progresses en autonomie, avec des outils de pro.", href: "/solutions/membres/" },
          { icon: "users", kicker: "Coachs", title: "Pour coacher tes clients", text: "Fiches clients, priorités, boîte de réception, programmes, lives : ton métier dans une seule appli.", href: "/solutions/coachs/" },
          { icon: "briefcase", kicker: "Entreprises", title: "Pour ton équipe", text: "Coachs, setters, closers, monteurs : chacun son espace, et la paie calculée seule.", href: "/solutions/equipes/" },
        ],
        path,
        { cols: "3" }
      ),
    }),
    `<div id="fonctionnalites"></div>`,
    groups,
    section({
      eyebrow: "Partout avec toi",
      title: `Pensée pour <span class="accent">ton téléphone</span>`,
      intro: "Installe-la sur ton écran d'accueil en quelques secondes, sans passer par un store. Elle marche aussi sur ordinateur, avec les mêmes données.",
      content: `<p class="center">${link("/aide/installer-lappli/", "Comment l'installer", path, "btn-ghost")}</p>`,
      narrow: true,
    }),
    ctaBand({ title: `Commence <span class="accent">aujourd'hui</span>`, text: "Inscription gratuite, sans carte bancaire.", primary: { label: "Créer mon compte", href: "LINK:signupMember" }, secondary: { label: "Espace coach gratuit", href: "LINK:signupCoach" }, path }),
  ].join("\n");
  emit({
    path,
    title: "L'appli EP Coaching : suivi sportif, nutrition et logiciel de coaching",
    description: "Découvre toutes les fonctionnalités de l'appli EP Coaching : entraînement, nutrition, bilan du jour, photos, agenda, notes, et pour les coachs : clients, contenu, formations, business et équipe.",
    body,
    crumbs: [HOME, ["L'appli", path]],
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "EP Coaching",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web, iOS, Android",
        url: APP,
        description: "Appli de coaching : suivi d'entraînement, nutrition, bilan quotidien, progression, agenda et notes, avec un espace complet pour les coachs.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        publisher: { "@type": "Organization", name: "EP Coaching", url: BASE },
      },
    ],
  });
}

// ── Solutions ────────────────────────────────────────────────────────────
const SOLUTIONS = [
  {
    slug: "membres",
    name: "Pour te suivre toi-même",
    metaTitle: "Appli de musculation et de nutrition gratuite pour progresser seul",
    metaDesc: "Programme, séance guidée, suivi nutrition, bilan du jour, photos et agenda : EP Coaching te donne les outils d'un coach pour progresser en autonomie, gratuitement.",
    eyebrow: "Membres",
    title: `Les outils d'un coach, <span class="accent">pour toi</span>`,
    lead: "Tu veux prendre du muscle, perdre du gras ou simplement tenir le rythme. EP Coaching te donne un programme, un suivi nutrition, un bilan quotidien et une vraie vision de ta progression. Gratuitement.",
    primary: { label: "Créer mon compte gratuit", href: "LINK:signupMember" },
    pains: [
      { icon: "target", title: "Tu t'entraînes sans savoir si tu progresses", text: "Le logbook garde chaque série et repère tes records. Tu sais quoi battre à chaque séance." },
      { icon: "apple", title: "Compter les calories te saoule", text: "Le tracker part de ton plan : un repas prévu se valide en un geste." },
      { icon: "chart", title: "La balance te démotive", text: "Tendance du poids, photos guidées et mensurations : tu vois la vraie progression." },
      { icon: "calendar", title: "Tes journées partent dans tous les sens", text: "Ta semaine type dans l'agenda, et un retard se rattrape en un geste." },
    ],
    shot: "aujourdhui",
    features: ["aujourdhui", "entrainement", "nutrition", "bilan", "progression", "agenda", "semaine", "communaute"],
    faq: ["Est-ce que l'appli est gratuite ?", "L'appli propose-t-elle des programmes d'entraînement ?", "Faut-il peser tous ses aliments ?", "Comment être accompagné par un coach ?"],
  },
  {
    slug: "coachs",
    name: "Pour les coachs",
    metaTitle: "Logiciel de coaching sportif en ligne : clients, contenu et business",
    metaDesc: "EP Coaching, le logiciel du coach sportif en ligne : suivi client, programmes, nutrition, check-ins, lives, studio de contenu, stats réseaux, formations, ventes et équipe.",
    eyebrow: "Coachs",
    title: `Ton métier de coach, <span class="accent">dans une seule appli</span>`,
    lead: "Suivre tes clients, produire ton contenu, vendre, gérer ton équipe : EP Coaching remplace la pile d'outils éparpillés par une seule appli pensée pour le coaching en ligne.",
    primary: { label: "Espace coach gratuit", href: "LINK:signupCoach" },
    pains: [
      { icon: "users", title: "Tu perds le fil de tes clients", text: "Fiches complètes, priorités et une boîte de réception unique : tu sais qui suivre en premier." },
      { icon: "sparkles", title: "Le contenu te prend un temps fou", text: "Scripts par plateforme, prompteur avec caméra, suivi du tournage à la publication." },
      { icon: "chart", title: "Tu ne sais pas ce qui te ramène des clients", text: "Stats réseaux et leads par publication : tu doubles ce qui marche." },
      { icon: "briefcase", title: "Ton business tient dans ta tête", text: "Pilotage, appels de vente, pipeline de leads, publicité, compta : tes chiffres, enfin clairs." },
    ],
    shot: "coach-accueil",
    features: ["clients", "live", "studio", "stats-reseaux", "formations", "pilotage", "mailing", "equipe"],
    faq: ["Que peut faire un coach dans EP Coaching ?", "Mes clients doivent-ils payer l'appli ?", "Comment inviter mes clients ?", "Les autres coachs peuvent-ils voir mes clients ?", "Je débute comme coach, c'est pour moi ?"],
    extra: { title: `Tu veux être <span class="accent">accompagné</span> sur ton business ?`, text: "En plus de l'appli, Santamaria Sanchéz accompagne en 1-to-1 les coachs qui veulent structurer et faire grandir leur activité.", link: { label: "Découvrir l'accompagnement business", href: "/business/" } },
  },
  {
    slug: "equipes",
    name: "Pour les équipes",
    metaTitle: "Gérer une équipe de coaching en ligne : coachs, setters, closers, paie",
    metaDesc: "Un espace par métier, une messagerie d'équipe, des contrats et la paie du mois calculée à partir des vraies ventes : EP Coaching pour les entreprises de coaching.",
    eyebrow: "Équipes",
    title: `Quand ton coaching <span class="accent">devient une entreprise</span>`,
    lead: "Plusieurs coachs, un setter, un closer, un monteur : EP Coaching donne à chacun son espace de travail, et te donne la vision d'ensemble.",
    primary: { label: "Espace coach gratuit", href: "LINK:signupCoach" },
    pains: [
      { icon: "users", title: "Chacun dans son outil", text: "Chaque poste a son espace dans la même appli : tâches, rendez-vous, prospects, livrables." },
      { icon: "message", title: "L'info se perd", text: "Messagerie d'équipe et documents centralisés, pour que rien ne se perde entre deux personnes." },
      { icon: "chart", title: "La paie, un casse-tête", text: "Fixe, commissions, paiement à la pièce : le mois se calcule à partir des ventes réelles." },
      { icon: "lock", title: "Les accès, un risque", text: "Chaque coach ne voit que ses clients, chaque métier ne voit que ce dont il a besoin." },
    ],
    shot: "equipe",
    features: ["equipe", "clients", "pilotage", "recherche"],
    faq: ["Je travaille avec un setter et un closer, c'est géré ?", "Les autres coachs peuvent-ils voir mes clients ?"],
  },
];

for (const s of SOLUTIONS) {
  const path = `/solutions/${s.slug}/`;
  const faq = s.faq.map((q) => FAQ_ALL.find((f) => f.q === q)).filter(Boolean);
  const body = [
    fxHero({ eyebrow: s.eyebrow, title: s.title, lead: esc(s.lead), path, ctas: [s.primary, { label: "Voir toute l'appli", href: "/appli/" }], shot: s.shot, alt: `Aperçu de l'appli EP Coaching pour ${s.name.toLowerCase()}` }),
    logoMarquee(SVGS),
    section({ eyebrow: "Tu te reconnais ?", title: `Ce qu'on <span class="accent">règle pour toi</span>`, content: cardGrid(s.pains.map((p) => ({ icon: p.icon, title: p.title, text: esc(p.text) })), path, { cols: "2" }) }),
    section({ eyebrow: "Les outils", title: "Ce que tu as dans l'appli", content: featureCards(s.features, path) }),
    s.extra ? section({ content: `<aside class="callout callout--big"><div><h2>${s.extra.title}</h2><p>${esc(s.extra.text)}</p><p>${link(s.extra.link.href, esc(s.extra.link.label), path, "btn-ghost")}</p></div></aside>`, narrow: true }) : "",
    faq.length ? section({ eyebrow: "Questions fréquentes", title: "Tes questions", content: faqList(faq), narrow: true }) : "",
    ctaBand({ title: `On <span class="accent">commence</span> ?`, text: "Inscription gratuite, en moins d'une minute.", primary: s.primary, secondary: { label: "Centre d'aide", href: "/aide/" }, path }),
  ].join("\n");
  emit({ path, title: s.metaTitle, description: s.metaDesc, body, crumbs: [HOME, ["Solutions", "/solutions/"], [s.name, path]], jsonld: faq.length ? [faqJsonLd(faq)] : [] });
}

{
  const path = "/solutions/";
  const body = [
    hero({ eyebrow: "Solutions", title: `Pour qui est <span class="accent">EP Coaching</span> ?`, lead: "Que tu veuilles progresser, coacher ou diriger une équipe, l'appli s'adapte à ton usage.", path }),
    section({
      content: cardGrid(
        SOLUTIONS.map((s) => ({ icon: s.slug === "membres" ? "heart" : s.slug === "coachs" ? "users" : "briefcase", kicker: s.eyebrow, title: s.name, text: esc(s.lead), href: `/solutions/${s.slug}/` }))
          .concat([{ icon: "target", kicker: "Accompagnement", title: "Coaching physique 1-to-1", text: "Un coach qui construit ton plan et l'ajuste avec toi, semaine après semaine.", href: "/physique/" }]),
        path,
        { cols: "2" }
      ),
    }),
  ].join("\n");
  emit({ path, title: "Solutions : membres, coachs et équipes", description: "EP Coaching pour te suivre toi-même, pour coacher tes clients ou pour gérer une entreprise de coaching avec une équipe.", body, crumbs: [HOME, ["Solutions", path]] });
}

// ── Ressources ───────────────────────────────────────────────────────────
for (const c of GUIDE_CATS) {
  const path = `/ressources/${c.slug}/`;
  const list = guidesOf(c);
  const body = [
    hero({ eyebrow: `Guides gratuits · ${c.name}`, title: `${esc(c.name)} : <span class="accent">${list.length} guides gratuits</span>`, lead: esc(c.desc) + " Chaque guide est court, concret et gratuit.", path, compact: true }),
    section({ content: filterBox(`Chercher parmi les guides ${c.name.toLowerCase()}`) + guideList(list) }),
    ctaBand({ title: `Passe de la lecture <span class="accent">à l'action</span>`, text: "L'appli EP Coaching t'aide à appliquer tout ça au quotidien : programme, nutrition, bilan, progression.", primary: { label: "Essayer gratuitement", href: "LINK:signupMember" }, secondary: { label: "Toutes les ressources", href: "/ressources/" }, path }),
  ].join("\n");
  emit({
    path,
    title: `${c.name} : ${list.length} guides gratuits`,
    description: `${list.length} guides gratuits sur ${c.name.toLowerCase()} par EP Coaching. ${c.desc}`.slice(0, 300),
    body,
    crumbs: [HOME, ["Ressources", "/ressources/"], [c.name, path]],
    jsonld: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: `${c.name} : guides gratuits`, url: canonical(path), numberOfItems: list.length }],
  });
}

{
  const path = "/ressources/";
  const cats = cardGrid(GUIDE_CATS.map((c) => ({ icon: c.icon, kicker: `${guidesOf(c).length} guides`, title: c.name, text: esc(c.desc), href: `/ressources/${c.slug}/`, more: "Voir les guides" })), path);
  const picks = GUIDE_CATS.slice(0, 4)
    .map((c) => `<div class="pick"><h3>${esc(c.name)}</h3>${guideList(guidesOf(c).slice(0, 5))}<p>${link(`/ressources/${c.slug}/`, `Tous les guides ${esc(c.name.toLowerCase())} ${icon("arrow", "icon icon--xs")}`, path, "text-link")}</p></div>`)
    .join("");
  const body = [
    hero({ eyebrow: "Ressources", title: `${GUIDES.length} guides gratuits pour <span class="accent">progresser plus vite</span>`, lead: "Entraînement, nutrition, récupération, mental, activité quotidienne, business de coach : des guides courts qui répondent à une vraie question, sans blabla.", path, ctas: [{ label: "Calculer mes calories", href: "LINK:calculator" }] }),
    section({ eyebrow: "Par thème", title: "Choisis ton sujet", content: cats }),
    `<section class="section">${quizBlock(GUIDES, path, { title: `Pas le temps de chercher ? <span class="accent">On choisit pour toi.</span>` })}</section>`,
    section({ eyebrow: "Outils gratuits", title: `Calcule tes besoins <span class="accent">en 1 minute</span>`, intro: "Le calculateur EP Coaching estime ta dépense du jour et tes macros selon ton objectif.", content: `<p class="center">${link("LINK:calculator", "Ouvrir le calculateur de macros", path, "btn-cta-primary")}</p>`, narrow: true }),
    section({ eyebrow: "À lire en premier", title: "Une sélection pour commencer", content: `<div class="picks">${picks}</div>` }),
    ctaBand({ title: `Tout ça, <span class="accent">appliqué à toi</span>`, text: "L'appli transforme ces conseils en plan : programme, repas, bilan et suivi.", primary: { label: "Essayer gratuitement", href: "LINK:signupMember" }, path }),
  ].join("\n");
  emit({
    path,
    title: `Ressources gratuites : ${GUIDES.length} guides musculation, nutrition et coaching`,
    description: `${GUIDES.length} guides gratuits EP Coaching : nutrition, entraînement, récupération, psychologie, activité quotidienne et business de coach. Plus un calculateur de macros.`,
    body,
    crumbs: [HOME, ["Ressources", path]],
  });
}

// ── Actus ────────────────────────────────────────────────────────────────
function newsCard(n, path) {
  return `<a class="card news-card" href="${resolve(`/actus/${n.slug}/`, path)}"><span class="news-meta"><span class="chip chip--sm">${esc(NEWS_CATEGORIES[n.cat])}</span><time datetime="${n.date}">${dateFr(n.date)}</time></span><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p><span class="card-more">Lire ${icon("arrow", "icon icon--xs")}</span></a>`;
}

for (const n of NEWS_SORTED) {
  const path = `/actus/${n.slug}/`;
  const others = NEWS_SORTED.filter((o) => o.slug !== n.slug).slice(0, 3);
  const relatedLinks = n.related
    .map((h) => {
      const f = FEATURES.find((x) => `/appli/${x.slug}/` === h);
      const a = HELP_ARTICLES.find((x) => `/aide/${x.slug}/` === h);
      const label = f ? `La fonctionnalité : ${f.name}` : a ? `Le guide : ${a.title}` : h === "/appli/" ? "Découvrir l'appli" : h.startsWith("/solutions/") ? SOLUTIONS.find((s) => h.includes(s.slug))?.name : h;
      return `<li>${link(h, `${icon("arrow", "icon icon--xs")}<span>${esc(label)}</span>`, path)}</li>`;
    })
    .join("");
  const body = [
    `<article class="article">
      <div class="article-head">
        <p class="news-meta"><span class="chip chip--sm">${esc(NEWS_CATEGORIES[n.cat])}</span><time datetime="${n.date}">${dateFr(n.date)}</time></p>
        <h1>${esc(n.title)}</h1>
        <p class="page-lead">${esc(n.summary)}</p>
      </div>
      <div class="prose">${n.body.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      <aside class="article-links"><p class="eyebrow">◆ Pour aller plus loin</p><ul class="link-list">${relatedLinks}</ul></aside>
    </article>`,
    section({ eyebrow: "Autres actus", title: "À lire aussi", content: `<div class="grid grid--3">${others.map((o) => newsCard(o, path)).join("")}</div>` }),
    ctaBand({ title: `Essaie <span class="accent">par toi-même</span>`, text: "Toutes ces nouveautés sont déjà dans l'appli.", primary: { label: "Ouvrir l'appli", href: "LINK:signupMember" }, path }),
  ].join("\n");
  emit({
    path,
    title: n.title,
    description: n.summary,
    body,
    ogType: "article",
    crumbs: [HOME, ["Actus", "/actus/"], [n.title, path]],
    jsonld: [{ "@context": "https://schema.org", "@type": "NewsArticle", headline: n.title, description: n.summary, datePublished: n.date, dateModified: n.date, author: { "@type": "Organization", name: "EP Coaching", url: BASE }, publisher: { "@type": "Organization", name: "EP Coaching", logo: { "@type": "ImageObject", url: BASE + "assets/images/logo.png" } }, mainEntityOfPage: canonical(path), image: BASE + "assets/images/og-image.png" }],
  });
}

{
  const path = "/actus/";
  const body = [
    hero({ eyebrow: "Actus", title: `Les nouveautés <span class="accent">EP Coaching</span>`, lead: "Ce qui arrive dans l'appli, ce qui change pour les membres et pour les coachs, et où on va.", path }),
    section({ content: `<div class="chips" role="list">${Object.entries(NEWS_CATEGORIES).map(([k, v]) => `<button type="button" class="chip chip--btn" data-news-filter="${k}" role="listitem">${esc(v)}</button>`).join("")}<button type="button" class="chip chip--btn is-active" data-news-filter="" role="listitem">Tout</button></div><div class="grid grid--3" data-news-list>${NEWS_SORTED.map((n) => newsCard(n, path).replace('class="card news-card"', `class="card news-card" data-cat="${n.cat}"`)).join("")}</div>` }),
  ].join("\n");
  emit({ path, title: "Actus et nouveautés de l'appli", description: "Toutes les nouveautés de l'appli EP Coaching : fonctionnalités pour les membres, outils pour les coachs, annonces.", body, crumbs: [HOME, ["Actus", path]] });
}

// ── Aide ─────────────────────────────────────────────────────────────────
for (const a of HELP_ARTICLES) {
  const path = `/aide/${a.slug}/`;
  const cat = HELP_CATEGORIES.find((c) => c.id === a.cat);
  const siblings = HELP_ARTICLES.filter((x) => x.cat === a.cat && x.slug !== a.slug);
  const related = [...new Set([...(a.related || []), ...siblings.map((s) => s.slug)])].slice(0, 5);
  const body = `<article class="article">
      <div class="article-head">
        <p class="eyebrow">◆ ${esc(cat.title)}</p>
        <h1>${esc(a.title)}</h1>
        <p class="page-lead">${esc(a.intro)}</p>
      </div>
      <div class="prose">
        <h2>Étapes</h2>
        <ol class="howto">${a.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
        ${a.tips ? `<aside class="callout">${icon("bolt")}<div>${a.tips.map((t) => `<p>${esc(t)}</p>`).join("")}</div></aside>` : ""}
        ${a.cta || a.extraLink ? `<p class="cta-row">${a.cta ? link(a.cta.href, esc(a.cta.label), path, "btn-cta-primary") : ""}${a.extraLink ? link(a.extraLink.href, esc(a.extraLink.label), path, "btn-ghost") : ""}</p>` : ""}
      </div>
      <aside class="article-links"><p class="eyebrow">◆ Articles liés</p>${helpLinks(related, path)}</aside>
      <aside class="help-contact"><p>Tu ne trouves pas ta réponse ?</p>${link("LINK:support", "Écrire à l'assistance", path, "text-link")}</aside>
    </article>`;
  emit({
    path,
    title: a.title,
    description: a.desc,
    body,
    ogType: "article",
    crumbs: [HOME, ["Aide", "/aide/"], [cat.title, `/aide/#${cat.id}`], [a.title, path]],
    jsonld: [{
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: a.title,
      description: a.desc,
      step: a.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s.replace(/<[^>]+>/g, "") })),
    }],
  });
}

{
  const path = "/aide/";
  const cats = HELP_CATEGORIES.map((c) => {
    const arts = HELP_ARTICLES.filter((a) => a.cat === c.id);
    return `<section class="help-cat" id="${c.id}"><div class="help-cat-head">${icon(c.icon)}<div><h2>${esc(c.title)}</h2><p>${esc(c.intro)}</p></div></div><ul class="link-list link-list--cols" data-filter-list>${arts
      .map((a) => `<li class="guide-item" data-search="${esc((a.title + " " + a.desc).toLowerCase())}">${link(`/aide/${a.slug}/`, `${icon("arrow", "icon icon--xs")}<span>${esc(a.title)}</span>`, path)}</li>`)
      .join("")}</ul></section>`;
  }).join("");
  const body = [
    hero({ eyebrow: "Centre d'aide", title: `Comment peut-on <span class="accent">t'aider</span> ?`, lead: "Des réponses courtes et des tutoriels pas à pas pour tout faire dans l'appli.", path, compact: true }),
    section({ content: filterBox("Cherche : notifications, mot de passe, bilan, équipe...") + `<div class="help-cats">${cats}</div>` }),
    section({
      eyebrow: "Aller plus loin",
      title: "Pas trouvé ?",
      content: cardGrid(
        [
          { icon: "help", title: "Questions fréquentes", text: "Les réponses aux questions qu'on nous pose le plus.", href: "/faq/" },
          { icon: "message", title: "Écrire à l'assistance", text: "Une vraie personne te répond sous 48 heures ouvrées.", href: "LINK:support" },
          { icon: "book", title: "Découvrir les fonctionnalités", text: "Chaque rubrique de l'appli, expliquée en détail.", href: "/appli/" },
        ],
        path,
        { cols: "3" }
      ),
    }),
  ].join("\n");
  emit({ path, title: "Centre d'aide", description: "Le centre d'aide EP Coaching : installer l'appli, notifications, compte, bilan, nutrition, séances, agenda, notes, et tous les tutoriels pour les coachs.", body, crumbs: [HOME, ["Aide", path]] });
}

// ── FAQ ──────────────────────────────────────────────────────────────────
{
  const path = "/faq/";
  const toc = `<nav class="toc" aria-label="Thèmes"><ul>${FAQ_GROUPS.map((g) => `<li><a href="#${g.id}">${esc(g.title)}</a></li>`).join("")}</ul></nav>`;
  const groups = FAQ_GROUPS.map((g) => `<section class="faq-group" id="${g.id}"><h2>${esc(g.title)}</h2>${faqList(g.items)}</section>`).join("");
  const body = [
    hero({ eyebrow: "FAQ", title: `Questions <span class="accent">fréquentes</span>`, lead: "Tout ce qu'on nous demande sur l'appli, le coaching, les données et le téléphone.", path, compact: true }),
    section({ content: toc + groups, narrow: true }),
    ctaBand({ title: `Une autre <span class="accent">question</span> ?`, text: "Le centre d'aide détaille chaque rubrique pas à pas, et l'assistance te répond sous 48 heures ouvrées.", primary: { label: "Centre d'aide", href: "/aide/" }, secondary: { label: "Écrire à l'assistance", href: "LINK:support" }, path }),
  ].join("\n");
  emit({ path, title: "Questions fréquentes", description: "FAQ EP Coaching : l'appli est-elle gratuite, que peut-on suivre, comment être accompagné, que peut faire un coach, données et confidentialité, installation sur téléphone.", body, crumbs: [HOME, ["FAQ", path]], jsonld: [faqJsonLd(FAQ_ALL)] });
}

// ── Pages institutionnelles ──────────────────────────────────────────────
{
  const path = "/a-propos/";
  const body = [
    hero({ eyebrow: "À propos", title: `On veut que tu ailles <span class="accent">plus vite</span> que seul`, lead: "EP Coaching est né d'une conviction simple : les gens motivés méritent des outils et un accompagnement à la hauteur de leur motivation.", path }),
    section({
      eyebrow: "Le fondateur",
      title: "Santamaria Sanchéz",
      content: `<div class="split-about"><img src="${resolve("/assets/images/portrait_physique.jpg", path)}" alt="Santamaria Sanchéz, fondateur d'EP Coaching" width="480" height="600" loading="lazy" class="about-photo" /><div class="prose"><p>Fondateur d'EP Coaching. J'accompagne des personnes qui veulent progresser en musculation, et des coachs qui veulent structurer leur activité.</p><p>Je suis athlète naturel, objectif Heroes Cup WNBF France en Classic Physique. Je m'applique à moi-même ce que je transmets. Ce que je sais, je l'ai appris en le faisant, et je continue à l'apprendre.</p><p>Mon approche tient en une chose : je prends les gens motivés, et je fais en sorte qu'ils aillent plus vite que s'ils étaient seuls.</p></div></div>`,
    }),
    section({
      eyebrow: "Ce qu'on construit",
      title: `Quatre fronts, <span class="accent">une seule appli</span>`,
      content: cardGrid(
        [
          { icon: "heart", title: "Ton propre suivi", text: "Entraînement, nutrition, bilan et progression, avec des outils de coach." },
          { icon: "users", title: "La qualité du coaching", text: "Des coachs qui voient les bonnes données au bon moment, et qui répondent." },
          { icon: "sparkles", title: "Le contenu", text: "Aider chaque coach à produire et mesurer le contenu qui fait venir ses clients." },
          { icon: "briefcase", title: "Le business", text: "Ventes, équipe, pilotage : faire d'un coaching une vraie entreprise." },
        ],
        path,
        { cols: "2" }
      ),
    }),
    section({
      eyebrow: "Nos principes",
      title: "Ce qu'on ne fera jamais",
      content: `<ul class="principles">${[
        ["Inventer une preuve", "Aucun témoignage, aucun chiffre, aucune transformation inventée. Si on ne peut pas le prouver, on ne le dit pas."],
        ["Remplacer l'humain", "L'accompagnement reste assuré par des coachs qui lisent tes bilans et te répondent."],
        ["Garder tes données", "Tu peux exporter tes données ou supprimer ton compte toi-même, à tout moment."],
        ["Compliquer ta vie", "Si une fonctionnalité ne te sert pas, tu la masques. L'appli doit rester simple."],
      ]
        .map(([t, d]) => `<li><span class="step-mark" aria-hidden="true"></span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`)
        .join("")}</ul>`,
      narrow: true,
    }),
    section({
      eyebrow: "En chiffres",
      title: "Ce qui existe déjà",
      content: `<div class="stats"><div><strong>${GUIDES.length}</strong><span>guides gratuits publiés</span></div><div><strong>${FEATURES.length}</strong><span>rubriques d'appli détaillées sur ce site</span></div><div><strong>7</strong><span>formats de coaching live</span></div></div>`,
      narrow: true,
    }),
    ctaBand({ title: `Rejoins <span class="accent">l'aventure</span>`, text: "Comme membre, comme coach, ou dans l'équipe.", primary: { label: "Essayer l'appli", href: "LINK:signupMember" }, secondary: { label: "Voir les postes ouverts", href: "LINK:careers" }, path }),
  ].join("\n");
  emit({
    path,
    title: "À propos d'EP Coaching et de son fondateur Santamaria Sanchéz",
    description: "EP Coaching, fondé par Santamaria Sanchéz, athlète naturel et coach : une appli et un accompagnement pour progresser en musculation et pour faire grandir son activité de coach.",
    body,
    crumbs: [HOME, ["À propos", path]],
    jsonld: [ORG_JSONLD, { "@context": "https://schema.org", "@type": "AboutPage", name: "À propos d'EP Coaching", url: canonical(path) }],
  });
}

{
  const path = "/contact/";
  const body = [
    hero({ eyebrow: "Contact", title: `Parlons-nous`, lead: "Choisis la bonne porte, on te répond vite.", path, compact: true }),
    section({
      content: cardGrid(
        [
          { icon: "help", kicker: "Compte, abonnement, bug", title: "Assistance", text: "Une question sur ton compte ou un souci technique ? Une vraie personne te répond sous 48 heures ouvrées.", href: "LINK:support", more: "Ouvrir l'assistance" },
          { icon: "target", kicker: "Accompagnement physique", title: "Réserver un appel", text: "Réponds à quelques questions, puis réserve ton appel gratuit, sans engagement.", href: "LINK:prequalification", more: "Réserver mon appel" },
          { icon: "briefcase", kicker: "Coachs", title: "Accompagnement business", text: "Tu es coach et tu veux structurer ton activité ? Découvre l'accompagnement 1-to-1.", href: "/business/", more: "Découvrir" },
          { icon: "users", kicker: "Recrutement", title: "Carrières", text: "Setter, closer, monteur, coach : découvre les postes ouverts chez EP Coaching.", href: "LINK:careers", more: "Voir les postes" },
        ],
        path,
        { cols: "2" }
      ),
    }),
    section({ eyebrow: "Réseaux", title: "Suis-nous", content: `<ul class="socials">${SOCIALS.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer" class="btn-ghost">${esc(s.name)}</a></li>`).join("")}</ul>`, narrow: true }),
  ].join("\n");
  emit({ path, title: "Contact", description: "Contacter EP Coaching : assistance, réservation d'un appel d'accompagnement, accompagnement business pour coachs, carrières et réseaux sociaux.", body, crumbs: [HOME, ["Contact", path]], jsonld: [{ "@context": "https://schema.org", "@type": "ContactPage", name: "Contact EP Coaching", url: canonical(path) }] });
}

{
  const path = "/securite/";
  const body = [
    hero({ eyebrow: "Sécurité et données", title: `Tes données, <span class="accent">sous ta main</span>`, lead: "Tes bilans, tes photos, tes notes : ce que tu confies à EP Coaching est protégé, et reste à toi.", path, compact: true }),
    section({
      content: cardGrid(
        [
          { icon: "lock", title: "Accès cloisonnés", text: "Des règles de sécurité appliquées directement dans la base de données : chaque coach ne voit que ses propres clients, chaque membre que ses propres données." },
          { icon: "image", title: "Photos et notes privées", text: "Photos de progression, captures et notes sont stockées dans des espaces privés, accessibles par des liens temporaires." },
          { icon: "shield", title: "Connexion chiffrée", text: "Tous les échanges entre ton appareil et l'appli passent par une connexion chiffrée (HTTPS)." },
          { icon: "plug", title: "Clés de connecteur protégées", text: "Les clés du connecteur Claude ne sont jamais stockées en clair, et tu peux les révoquer à tout moment." },
          { icon: "briefcase", title: "Paiements par Stripe", text: "Les paiements passent par Stripe. EP Coaching ne stocke pas tes coordonnées bancaires." },
          { icon: "map", title: "Données en Europe", text: "La base de données de l'appli est hébergée dans l'Union européenne, en Allemagne." },
        ],
        path
      ),
    }),
    section({
      eyebrow: "Tes droits",
      title: "Tu gardes la main",
      content: steps([
        { t: "Exporter", d: "Télécharge une copie de tes données depuis Plus, Paramètres, « Exporter mes données »." },
        { t: "Supprimer", d: "Supprime ton compte toi-même depuis Plus, Paramètres, « Supprimer mon compte »." },
        { t: "Rester discret", d: "Retire-toi du classement de la communauté depuis la rubrique Confidentialité." },
      ]),
      narrow: true,
    }),
    section({ content: `<p class="center">${link("LINK:privacy", "Lire la politique de confidentialité", path, "btn-ghost")} ${link("/legal/cookies/", "Cookies du site", path, "btn-ghost")}</p><p class="center small">Tu as repéré une faille de sécurité ? Signale-la via ${link("LINK:support", "l'assistance", path, "text-link")}, on la traite en priorité.</p>`, narrow: true }),
  ].join("\n");
  emit({ path, title: "Sécurité et confidentialité des données", description: "Comment EP Coaching protège tes données : accès cloisonnés, photos et notes privées, connexion chiffrée, paiements Stripe, base hébergée en Europe, export et suppression en libre-service.", body, crumbs: [HOME, ["Sécurité", path]] });
}

// ── Légal ────────────────────────────────────────────────────────────────
{
  const path = "/legal/mentions-legales/";
  const body = `<article class="article article--legal">
    <div class="article-head"><p class="eyebrow">◆ Légal</p><h1>Mentions légales</h1><p class="page-lead">Informations sur l'éditeur et l'hébergeur de ce site.</p></div>
    <div class="prose">
      <h2>Éditeur du site</h2>
      <p>EP Coaching, activité exercée par Emmanuel Peccoux, entrepreneur individuel.<br />SIRET : 104 838 172 00013<br />Adresse : 8 Rue de la Jonchère, 74600 Annecy, France.<br />Contact : ${link("LINK:support", "page Assistance", path, "text-link")}.</p>
      <h2>Directeur de la publication</h2>
      <p>Emmanuel Peccoux.</p>
      <h2>Hébergement du site</h2>
      <p>GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.</p>
      <h2>Application EP Coaching</h2>
      <p>L'application accessible à l'adresse ep-coaching.vercel.app est hébergée par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Sa base de données est hébergée par Supabase, dans l'Union européenne. Son utilisation est régie par ses ${link("LINK:cgu", "conditions générales d'utilisation", path, "text-link")}, ses ${link("LINK:cgv", "conditions générales de vente", path, "text-link")} et sa ${link("LINK:privacy", "politique de confidentialité", path, "text-link")}.</p>
      <h2>Propriété intellectuelle</h2>
      <p>L'ensemble des contenus de ce site (textes, photos, logo, éléments graphiques) est la propriété d'EP Coaching, sauf mention contraire. Toute reproduction sans autorisation écrite est interdite.</p>
      <h2>Crédits</h2>
      <p>Photos : Santamaria Sanchéz. Polices : Montserrat et Playfair Display (Google Fonts).</p>
    </div>
  </article>`;
  emit({ path, title: "Mentions légales", description: "Mentions légales du site EP Coaching : éditeur, directeur de la publication, hébergeur et propriété intellectuelle.", body, crumbs: [HOME, ["Légal", "/legal/"], ["Mentions légales", path]] });
}

{
  const path = "/legal/cookies/";
  const body = `<article class="article article--legal">
    <div class="article-head"><p class="eyebrow">◆ Légal</p><h1>Cookies</h1><p class="page-lead">Ce site ne te suit pas. Voici exactement ce qu'il charge.</p></div>
    <div class="prose">
      <h2>Aucun cookie de mesure d'audience ni de publicité</h2>
      <p>Ce site vitrine ne dépose aucun cookie de mesure d'audience, de publicité ou de réseau social. Il n'utilise aucun outil de statistiques.</p>
      <h2>Ce qui est chargé depuis d'autres services</h2>
      <ul>
        <li><strong>Polices d'écriture</strong> : Montserrat et Playfair Display sont chargées depuis Google Fonts. Comme pour toute ressource web, ton adresse IP est transmise à Google pour les afficher.</li>
        <li><strong>Vidéo de présentation</strong> : la vidéo YouTube n'est chargée que si tu cliques dessus, depuis le domaine youtube-nocookie.com.</li>
        <li><strong>Bibliothèques d'animation</strong> : chargées depuis le réseau jsDelivr, sans cookie.</li>
      </ul>
      <h2>Newsletter</h2>
      <p>Si tu t'inscris à la newsletter, ton adresse email est transmise à l'application EP Coaching, qui gère l'envoi. Tu peux te désinscrire à tout moment depuis le lien présent dans chaque email.</p>
      <h2>Dans l'application</h2>
      <p>L'application EP Coaching (ep-coaching.vercel.app) utilise uniquement les cookies nécessaires à ta connexion et au fonctionnement de ton compte. Le détail est dans sa ${link("LINK:privacy", "politique de confidentialité", path, "text-link")}.</p>
    </div>
  </article>`;
  emit({ path, title: "Cookies", description: "Le site EP Coaching ne dépose aucun cookie de mesure d'audience ni de publicité. Détail des services chargés et de la newsletter.", body, crumbs: [HOME, ["Légal", "/legal/"], ["Cookies", path]] });
}

{
  const path = "/legal/";
  const body = [
    hero({ eyebrow: "Légal", title: "Documents légaux", lead: "Tous les documents qui encadrent le site et l'application EP Coaching.", path, compact: true }),
    section({
      content: cardGrid(
        [
          { icon: "note", title: "Mentions légales", text: "Éditeur, directeur de la publication, hébergeur.", href: "/legal/mentions-legales/" },
          { icon: "note", title: "Conditions générales d'utilisation", text: "Les règles d'utilisation de l'application.", href: "LINK:cgu" },
          { icon: "note", title: "Conditions générales de vente", text: "Abonnements, paiements, résiliation.", href: "LINK:cgv" },
          { icon: "lock", title: "Politique de confidentialité", text: "Les données collectées, pourquoi, et tes droits.", href: "LINK:privacy" },
          { icon: "shield", title: "Cookies", text: "Ce que ce site charge, et ce qu'il ne fait pas.", href: "/legal/cookies/" },
          { icon: "shield", title: "Sécurité et données", text: "Comment tes données sont protégées.", href: "/securite/" },
        ],
        path
      ),
    }),
  ].join("\n");
  emit({ path, title: "Documents légaux", description: "Mentions légales, conditions générales d'utilisation et de vente, politique de confidentialité et cookies d'EP Coaching.", body, crumbs: [HOME, ["Légal", path]] });
}

// ── Plan du site ─────────────────────────────────────────────────────────
{
  const path = "/plan-du-site/";
  const block = (title, items) => `<section class="sitemap-block"><h2>${esc(title)}</h2><ul>${items.map(([l, h]) => `<li>${link(h, esc(l), path)}</li>`).join("")}</ul></section>`;
  const body = [
    hero({ eyebrow: "Plan du site", title: "Toutes les pages", path, compact: true }),
    section({
      content: `<div class="sitemap-grid">${[
        block("Principal", [["Accueil", "/"], ["Coaching physique", "/physique/"], ["Accompagnement business", "/business/"], ["À propos", "/a-propos/"], ["Contact", "/contact/"], ["Sécurité et données", "/securite/"]]),
        block("L'appli", [["Vue d'ensemble", "/appli/"], ...FEATURES.map((f) => [f.name, `/appli/${f.slug}/`])]),
        block("Solutions", [["Toutes les solutions", "/solutions/"], ...SOLUTIONS.map((s) => [s.name, `/solutions/${s.slug}/`])]),
        block("Ressources", [["Toutes les ressources", "/ressources/"], ...GUIDE_CATS.map((c) => [c.name, `/ressources/${c.slug}/`])]),
        block("Actus", [["Toutes les actus", "/actus/"], ...NEWS_SORTED.map((n) => [n.title, `/actus/${n.slug}/`])]),
        block("Aide", [["Centre d'aide", "/aide/"], ["Questions fréquentes", "/faq/"], ...HELP_ARTICLES.map((a) => [a.title, `/aide/${a.slug}/`])]),
        block("Légal", [["Documents légaux", "/legal/"], ["Mentions légales", "/legal/mentions-legales/"], ["Cookies", "/legal/cookies/"], ["CGU", "LINK:cgu"], ["CGV", "LINK:cgv"], ["Confidentialité", "LINK:privacy"]]),
      ].join("")}</div>`,
    }),
  ].join("\n");
  emit({ path, title: "Plan du site", description: "Toutes les pages du site EP Coaching : l'appli, les solutions, les ressources, les actus, le centre d'aide et les documents légaux.", body, crumbs: [HOME, ["Plan du site", path]] });
}

// ── Pages écrites à la main : header, footer, sections d'accueil ─────────
function patchBlock(html, startTag, endTag, replacement) {
  const s = html.indexOf(startTag);
  const e = html.indexOf(endTag, s);
  if (s === -1 || e === -1) throw new Error(`Bloc introuvable : ${startTag}`);
  return html.slice(0, s) + replacement + html.slice(e + endTag.length);
}

function ensureHead(html, path) {
  const css = `<link rel="stylesheet" href="${resolve("/assets/css/site.css", path)}" />`;
  if (!html.includes("assets/css/site.css")) html = html.replace("</head>", `  ${css}\n</head>`);
  const exp = `<link rel="stylesheet" href="${resolve("/assets/css/experience.css", path)}" />`;
  if (!html.includes("assets/css/experience.css")) html = html.replace("</head>", `  ${exp}\n</head>`);
  const js = `<script src="${resolve("/assets/js/site.js", path)}" defer></script>`;
  if (!html.includes("assets/js/site.js")) html = html.replace("</body>", `  ${js}\n</body>`);
  html = html.replace(/https:\/\/instagram\.com\/santamariasanchez_/g, "https://instagram.com/santamariasanchezep");
  return html;
}

function homeExtra(path) {
  const featured = ["aujourdhui", "entrainement", "nutrition", "bilan", "agenda", "notes", "clients", "studio"];
  const faq = FAQ_ALL.filter((f) => ["Qu'est-ce qu'EP Coaching ?", "Est-ce que l'appli est gratuite ?", "À qui s'adresse l'appli ?", "Que peut faire un coach dans EP Coaching ?", "Mes données sont-elles privées ?"].includes(f.q));
  return `<!-- @home-extra (généré par tools/build.mjs, ne pas modifier à la main) -->
    ${section({ eyebrow: "L'appli EP Coaching", title: `Tout ton suivi, <span class="accent">dans ta poche</span>`, intro: "Entraînement, nutrition, bilan, agenda, notes : et pour les coachs, les clients, le contenu et le business.", content: featureCards(featured, path) + `<p class="center">${link("/appli/", "Voir toutes les fonctionnalités", path, "btn-ghost")}</p>`, cls: "home-block" })}
    ${section({ eyebrow: "Pour qui", title: `Une appli, <span class="accent">trois usages</span>`, content: cardGrid([
      { icon: "heart", kicker: "Gratuit", title: "Te suivre toi-même", text: "Les outils d'un coach pour progresser en autonomie.", href: "/solutions/membres/" },
      { icon: "users", kicker: "Coachs", title: "Coacher tes clients", text: "Ton métier de coach dans une seule appli.", href: "/solutions/coachs/" },
      { icon: "briefcase", kicker: "Entreprises", title: "Diriger ton équipe", text: "Un espace par métier, la paie calculée seule.", href: "/solutions/equipes/" },
    ], path, { cols: "3" }), cls: "home-block" })}
    ${section({ eyebrow: "Ressources gratuites", title: `${GUIDES.length} guides pour <span class="accent">progresser</span>`, content: cardGrid(GUIDE_CATS.map((c) => ({ icon: c.icon, kicker: `${guidesOf(c).length} guides`, title: c.name, href: `/ressources/${c.slug}/`, more: "Voir les guides" })), path), cls: "home-block" })}
    ${section({ eyebrow: "Actus", title: "Dernières nouveautés", content: `<div class="grid grid--3">${NEWS_SORTED.slice(0, 3).map((n) => newsCard(n, path)).join("")}</div><p class="center">${link("/actus/", "Toutes les actus", path, "btn-ghost")}</p>`, cls: "home-block" })}
    ${section({ eyebrow: "FAQ", title: "Questions fréquentes", content: faqList(faq) + `<p class="center">${link("/faq/", "Toutes les questions", path, "btn-ghost")}</p>`, narrow: true, cls: "home-block" })}
    <!-- /@home-extra -->`;
}

function patchLegacy(file, path, { home = false } = {}) {
  const full = join(ROOT, file);
  let html = readFileSync(full, "utf8");
  html = patchBlock(html, "<header", "</header>", headerHtml(path));
  html = patchBlock(html, "<footer", "</footer>", footerHtml(path));
  if (home) {
    const extra = homeExtra(path);
    if (html.includes("<!-- @home-extra")) html = patchBlock(html, "<!-- @home-extra", "<!-- /@home-extra -->", extra);
    else html = html.replace("  </main>", `    ${extra}\n  </main>`);
    if (!html.includes('"@type":"FAQPage"')) {
      const faq = FAQ_ALL.filter((f) => extra.includes(esc(f.q)));
      html = html.replace("</head>", `  <script type="application/ld+json">${JSON.stringify(faqJsonLd(faq))}</script>\n</head>`);
    }
  }
  html = ensureHead(html, path);
  lint(path, html);
  writeFileSync(full, html);
}

emit(buildHome({ path: "/", guides: GUIDES, features: FEATURES, news: NEWS_SORTED, faqAll: FAQ_ALL, svgs: SVGS, newsCard }));
patchLegacy("physique/index.html", "/physique/");
patchLegacy("business/index.html", "/business/");

// ── sitemap.xml ──────────────────────────────────────────────────────────
{
  const all = ["/", "/physique/", "/business/", ...written.filter((p) => p !== "/")];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Généré par tools/build.mjs. Pour un domaine personnalisé : changer BASE dans tools/config.mjs puis relancer. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...new Set(all)].map((p) => `  <url><loc>${canonical(p)}</loc><lastmod>${BUILD_DATE}</lastmod></url>`).join("\n")}
</urlset>
`;
  writeFileSync(join(ROOT, "sitemap.xml"), xml);
}

console.log(`${written.length} pages générées, 2 pages mises à jour (physique, business), sitemap : ${written.length + 2} URL.`);
