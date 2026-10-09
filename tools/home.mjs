// Page d'accueil : pensée comme une page de vente (Hormozi : nommer la
// douleur, montrer l'équation de valeur, empiler l'offre, retirer le risque ;
// Matis Clouet : un système clair contenu, guide gratuit, appli, appel).
// Uniquement des faits réels : écrans de l'appli (comptes de démo), chiffres
// calculés depuis les données du site, jamais de témoignage inventé.
import { APP, LINKS, BASE, VSL_YOUTUBE_ID } from "./config.mjs";
import { esc, resolve, link, icon, section, faqList, faqJsonLd, phone, logoMarquee, ORG_JSONLD } from "./render.mjs";

export const QUIZ = [
  { icon: "bolt", label: "Perdre du gras sans perdre mon muscle", slug: "guide-rythme-seche" },
  { icon: "dumbbell", label: "Prendre du muscle (enfin) visiblement", slug: "checklist-erreurs-debutant-qui-coutent-le-plus" },
  { icon: "apple", label: "Manger mieux sans tout peser", slug: "checklist-peser-aliments-sans-obseder" },
  { icon: "briefcase", label: "Je suis coach : trouver des clients", slug: "guide-premiers-clients-sans-budget" },
];

export function quizBlock(guides, path, { title = `Quel est ton objectif <span class="accent">en ce moment</span> ?` } = {}) {
  const bySlug = new Map(guides.map((g) => [g.slug, g]));
  const options = QUIZ.map((q) => {
    const g = bySlug.get(q.slug);
    if (!g) throw new Error(`Guide introuvable pour le formulaire : ${q.slug}`);
    return `<button type="button" class="quiz-option" aria-pressed="false" data-slug="${esc(g.slug)}" data-title="${esc(g.title)}" data-hook="${esc(g.hook)}">${icon(q.icon)}<span>${esc(q.label)}</span></button>`;
  }).join("");
  return `<div class="quiz" data-quiz data-endpoint="${APP}/api/public/lead" data-app="${APP}" data-reveal>
      <div class="quiz-head">
        <p class="eyebrow">◆ Guide gratuit</p>
        <h2>${title}</h2>
        <p>Choisis, on t'envoie le guide qui répond exactement à ça. Gratuit, 5 minutes de lecture.</p>
      </div>
      <div class="quiz-options">${options}</div>
      <div class="quiz-result" hidden>
        <div class="quiz-guide"><small>Ton guide</small><h3 data-guide-title></h3><p data-guide-hook></p></div>
        <form class="quiz-form" novalidate>
          <label class="sr-only" for="quiz-email-${path.length}">Ton email</label>
          <input type="text" name="website" class="newsletter-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <input type="email" id="quiz-email-${path.length}" required placeholder="ton@email.com" autocomplete="email" />
          <button type="submit" class="btn-cta-primary">Recevoir le guide</button>
        </form>
        <p class="quiz-fine">Tu reçois aussi le mail de 10h : une chose concrète à appliquer chaque jour. Désinscription en un clic.</p>
        <p class="quiz-feedback" role="status" hidden></p>
      </div>
    </div>`;
}

export function buildHome({ path, guides, features, news, faqAll, svgs, newsCard }) {
  const feat = (slug) => features.find((f) => f.slug === slug);
  const r = (h) => resolve(h, path);

  const hero = `<section class="hx">
    <div class="hx-aura" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="hx-grid" aria-hidden="true"></div>
    <div class="hx-copy">
      <a class="pill" href="${r("/actus/")}"><b>Nouveau</b> Notes, agenda vivant et connecteur Claude ${icon("arrow", "icon icon--xs")}</a>
      <h1>Le suivi d'un vrai coach. <span class="accent">Dans ta poche.</span></h1>
      <p class="page-lead">Programme, nutrition, bilan en 30 secondes et progrès enfin visibles. Et si tu es coach : tes clients, ton contenu et ton business au même endroit.</p>
      <div class="cta-row">
        <a href="${LINKS.signupMember}" class="btn-cta-primary btn-cta-primary--lg">Commencer gratuitement</a>
        <a href="${r("/solutions/coachs/")}" class="btn-ghost">Je suis coach</a>
      </div>
      <p class="hx-proof"><span>${icon("shield")} Gratuit, sans carte bancaire</span><span>${icon("map")} Données hébergées en Europe</span><span>${icon("book")} ${guides.length} guides offerts</span></p>
    </div>
    <div class="phones" aria-label="Aperçu de l'appli EP Coaching">
      ${phone("nutrition", "Écran Nutrition de l'appli EP Coaching", path, "p-left", "", true)}
      ${phone("aujourdhui", "Écran Aujourd'hui de l'appli EP Coaching", path, "p-center", "", true)}
      ${phone("road-map", "Écran Road Map de l'appli EP Coaching", path, "p-right", "", true)}
      <div class="float-chip c1">${icon("clipboard")}<div><strong>Bilan du jour</strong>30 secondes, matin et soir</div></div>
      <div class="float-chip c2">${icon("search")}<div><strong>Tape « poids »</strong>ta moyenne s'affiche</div></div>
      <div class="float-chip c3">${icon("dumbbell")}<div><strong>Séance guidée</strong>série par série</div></div>
    </div>
  </section>`;

  // VSL (2026-10-09) : la vidéo de présentation, puis le choix du chemin.
  // Tant que la vidéo n'est pas en ligne, le cadre l'annonce honnêtement.
  const vsl = `<section class="vx" id="video">
    <div class="vx-head" data-reveal><p class="eyebrow">◆ À regarder avant de réserver</p><h2>Pourquoi tu stagnes, <span class="accent">et comment on règle ça</span></h2><p class="section-intro">10 minutes. Que tu veuilles transformer ton physique ou remplir ton agenda de coach.</p></div>
    <div class="vx-frame" data-reveal>
      <div class="vx-glow" aria-hidden="true"></div>
      <div class="vsl-placeholder vx-player${VSL_YOUTUBE_ID ? "" : " vx-player--soon"}" id="vsl-placeholder" data-youtube-id="${VSL_YOUTUBE_ID || "VIDEO_ID_A_REMPLACER"}" data-poster="1" style="background-image:url(${r("/assets/images/vsl-poster.jpg")})">
        ${VSL_YOUTUBE_ID ? `<span class="vsl-play vx-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="34" height="34"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span><span class="vx-duration">10 min</span>` : `<span class="vx-soon">La vidéo arrive très bientôt</span>`}
      </div>
    </div>
    <div class="vx-choice" data-reveal>
      <a class="vx-card vx-card--hot" href="${LINKS.prequalification}"><span class="vx-kicker">Premier cas</span><strong>Je veux transformer mon physique</strong><span>Perdre du gras, prendre du muscle, préparer une compétition</span><em>Réserver mon appel offert ${icon("arrow", "icon icon--xs")}</em></a>
      <a class="vx-card" href="${r("/business/")}"><span class="vx-kicker">Deuxième cas</span><strong>Je suis coach</strong><span>Plus de clients, plus de temps, un vrai système</span><em>Réserver mon appel offert ${icon("arrow", "icon icon--xs")}</em></a>
    </div>
    <p class="vx-proof">Appel offert, sans engagement. Dans le pire des cas, tu repars avec un plan clair.</p>
  </section>`;

  const counters = `<div class="counters">
    <div class="counter" data-reveal style="--i:0"><strong data-count="${guides.length}">${guides.length}</strong><span>guides gratuits</span></div>
    <div class="counter" data-reveal style="--i:1"><strong data-count="${features.length}">${features.length}</strong><span>rubriques dans l'appli</span></div>
    <div class="counter" data-reveal style="--i:2"><strong data-count="7">7</strong><span>formats de coaching live</span></div>
    <div class="counter" data-reveal style="--i:3"><strong data-count="30" data-suffix=" s">30 s</strong><span>pour remplir ton bilan</span></div>
  </div>`;

  const pains = section({
    eyebrow: "Le vrai problème",
    title: `Tu ne manques pas de motivation. <span class="accent">Tu manques de système.</span>`,
    content: `<div class="pains">${[
      ["01", "Tu t'entraînes au feeling", "Pas de programme écrit, pas de charges notées. Chaque séance repart de zéro, et tu ne sais jamais si tu progresses vraiment."],
      ["02", "Tu manges à l'estime", "Tu fais « attention », mais tu ne sais pas ce que tu manges vraiment. Du coup, tu ne sais pas quoi ajuster quand ça bloque."],
      ["03", "Tu ne vois pas tes progrès", "La balance fait le yoyo, le miroir ne dit rien. Après six semaines sans preuve, presque tout le monde lâche."],
    ].map(([n, t, d], i) => `<article class="pain spot" data-reveal style="--i:${i}"><span class="pain-num">${n}</span><h3>${t}</h3><p>${d}</p></article>`).join("")}</div>
    <p class="pain-verdict" data-reveal>Le problème n'est pas toi. C'est l'absence d'un suivi qui te montre, chaque jour, <span class="accent">quoi faire et si ça marche.</span></p>`,
  });

  const levers = section({
    eyebrow: "Pourquoi ça marche",
    title: `Une appli construite sur <span class="accent">4 leviers</span>`,
    intro: "La valeur d'un accompagnement tient en une équation : plus de résultat et de certitude, moins de délai et d'effort. Chaque écran de l'appli pousse l'un de ces leviers.",
    content: `<div class="equation" data-reveal aria-label="Valeur égale résultat visé fois certitude d'y arriver, divisé par temps pour y arriver fois effort demandé"><span>Valeur</span><span>=</span><span class="frac"><span>Résultat × Certitude</span><span>Délai × Effort</span></span></div>
    <div class="levers">${[
      ["up", "Plus de résultat", "Ton objectif découpé en phases dans ta Road Map, avec un programme et un plan nutrition qui y mènent vraiment."],
      ["up", "Plus de certitude", "Des preuves chaque semaine : tendance du poids, records, photos et mensurations. Tu vois que ça avance."],
      ["down", "Moins de délai", "Bilan en 30 secondes, repas prévus validés en un geste, séance déjà prête. Tu n'organises plus, tu exécutes."],
      ["down", "Moins d'effort", "Rappels, agenda qui se réorganise seul, loupe qui répond. Et un coach humain si tu veux aller plus vite."],
    ].map(([dir, t, d], i) => `<article class="lever spot tilt" data-reveal style="--i:${i}"><span class="lever-dir ${dir === "down" ? "down" : ""}">${dir === "up" ? "▲ Augmente" : "▼ Diminue"}</span><h3>${t}</h3><p>${d}</p></article>`).join("")}</div>`,
  });

  const STEPS = [
    ["aujourdhui", "07:00", "Tu sais quoi faire.", ["Bilan, repas et séance du jour, dans l'ordre", "Tu coches au fur et à mesure", "Rien d'autre à retenir"], "aujourdhui"],
    ["bilan", "07:05", "Ton bilan en 30 secondes.", ["Poids, nuit, pas, énergie", "Les calories remontent seules", "Un jour oublié se rattrape"], "bilan"],
    ["nutrition", "12:30", "Tes repas sont déjà prévus.", ["Construits à partir de ton plan", "Un repas mangé tel quel : un geste", "Calories et macros calculées pour toi"], "nutrition"],
    ["entrainement", "18:00", "Ta séance, série par série.", ["Programme prêt, matériel indiqué", "La dernière séance à côté pour savoir quoi battre", "Records repérés tout seuls"], "entrainement"],
    ["road-map", "Dimanche", "Tes progrès, enfin visibles.", ["Tendance du poids semaine après semaine", "Ta phase actuelle et la suivante", "Photos et mensurations pour trancher"], "road-map"],
    ["recherche", "N'importe quand", "Une question ? Tape un mot.", ["« poids », « calories », « séances »", "Le chiffre s'affiche tout de suite", "Côté coach : « leads », « paie »"], "recherche"],
  ];
  const tour = `<section class="section" id="visite">
    <div class="section-head"><p class="eyebrow">◆ Visite guidée</p><h2>Une journée avec <span class="accent">EP Coaching</span></h2><p class="section-intro">Pas une liste de fonctionnalités : ce que ça change, du réveil au coucher.</p></div>
    <div class="tour">
      <div class="tour-steps">${STEPS.map(([shot, time, title, bullets, slug], i) => {
        const f = feat(slug);
        return `<article class="tour-step" data-step="${i}" data-reveal><span class="step-index">${esc(time)}</span><h3>${esc(title)}</h3><ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>${f ? `<p>${link(`/appli/${f.slug}/`, `En savoir plus sur ${esc(f.name)} ${icon("arrow", "icon icon--xs")}`, path, "text-link")}</p>` : ""}${phone(shot, `Écran ${title}`, path)}</article>`;
      }).join("")}</div>
      <div class="tour-stage" aria-hidden="true"><div class="phone">${STEPS.map(([shot], i) => `<img src="${r(`/assets/images/app/${shot}.jpg`)}" alt="" data-step="${i}" class="${i === 0 ? "is-active" : ""}" width="390" height="844" loading="lazy" decoding="async" />`).join("")}</div><div class="tour-dots">${STEPS.map((_, i) => `<i class="${i === 0 ? "is-active" : ""}"></i>`).join("")}</div></div>
    </div>
  </section>`;

  const paths = section({
    eyebrow: "Choisis ton chemin",
    title: `Trois façons <span class="accent">d'avancer</span>`,
    content: `<div class="paths">
      <article class="path path--hot spot" data-reveal style="--i:0"><span class="path-tag">Gratuit</span><h3>Te suivre toi-même</h3><ul><li>Programme et séance guidée</li><li>Nutrition construite sur un plan</li><li>Bilan, photos et Road Map</li><li>${guides.length} guides pratiques</li></ul><a class="btn-cta-primary" href="${LINKS.signupMember}">Créer mon compte gratuit</a><div class="path-shot">${phone("bilan", "Écran Bilan", path)}</div></article>
      <article class="path spot" data-reveal style="--i:1"><span class="path-tag">Accompagnement</span><h3>Coaching physique 1-to-1</h3><ul><li>Un appel gratuit pour faire le point</li><li>Un plan construit pour toi</li><li>Ajusté avec toi chaque semaine</li><li>Messagerie et check-in dans l'appli</li></ul><a class="btn-ghost" href="${LINKS.prequalification}">Réserver mon appel gratuit</a><div class="path-shot">${phone("messages", "Écran Messages avec le coach", path)}</div></article>
      <article class="path spot" data-reveal style="--i:2"><span class="path-tag">Coachs</span><h3>Faire grandir ton activité</h3><ul><li>Clients, programmes et check-ins</li><li>Studio de contenu et stats réseaux</li><li>Formations et ventes</li><li>Équipe et paie calculée</li></ul><a class="btn-ghost" href="${LINKS.signupCoach}">Créer mon espace coach</a><div class="path-shot">${phone("coach-accueil", "Accueil coach", path)}</div></article>
    </div>`,
  });

  const BENTO = [
    ["coach-accueil", "Ton poste de pilotage", "Alertes clients, messages non lus, ta journée et tes raccourcis, dès l'ouverture.", "clients"],
    ["clients", "Qui a besoin de toi", "Fiches complètes et priorités : les clients qui décrochent remontent en premier.", "clients"],
    ["live", "Tes lives", "1-to-1, audits, ateliers, questions-réponses : planifiés dans l'appli.", "live"],
    ["stats-reseaux", "Ce qui marche", "Tes chiffres réseaux et les leads apportés par chaque publication.", "stats-reseaux"],
    ["equipe", "Ton équipe", "Coachs, setters, closers : un espace chacun et la paie calculée.", "equipe"],
    ["formations", "Ta formation", "Crée-la, donne-la à tes clients ou vends-la avec ton lien.", "formations"],
    ["mailing", "Tes emails", "Newsletter, annonces, relances, avec une centaine de modèles.", "mailing"],
  ];
  const coachs = section({
    eyebrow: "Pour les coachs",
    title: `Remplace 6 outils <span class="accent">par une seule appli</span>`,
    intro: "Un système clair, du premier contenu au client fidèle. Sans jongler entre les onglets.",
    content: `<div class="compare">
      <div class="compare-col before" data-reveal><h3>Aujourd'hui</h3><ul>${["Un tableur pour suivre les clients", "WhatsApp pour recevoir les bilans", "Un PDF pour chaque programme", "Une appli de calories à côté", "Un outil d'emailing en plus", "Des notes éparpillées pour le contenu"].map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div class="compare-col after" data-reveal style="--i:1"><h3>Avec EP Coaching</h3><ul>${["Fiches clients avec priorités", "Boîte de réception unique", "Programmes et plans nutrition assignés", "Bilans et nutrition qui remontent seuls", "Mailing intégré avec modèles", "Studio créatif et stats réseaux"].map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    </div>
    <div class="bento" style="margin-top: var(--space-xl)">${BENTO.map(([shot, t, d, slug], i) => `<a class="bento-card spot" href="${r(`/appli/${slug}/`)}" data-reveal style="--i:${i % 3}"><h3>${esc(t)}</h3><p>${esc(d)}</p><span class="card-more bento-link">Découvrir ${icon("arrow", "icon icon--xs")}</span>${phone(shot, t, path)}</a>`).join("")}</div>
    <div class="cta-row cta-row--center" style="margin-top: var(--space-lg)"><a class="btn-cta-primary btn-cta-primary--lg" href="${LINKS.signupCoach}">Créer mon espace coach</a><a class="btn-ghost" href="${r("/solutions/coachs/")}">Voir la plateforme coach</a></div>`,
  });

  const founder = `<section class="section"><div class="founder">
    <figure class="founder-photo" data-reveal><img src="${r("/assets/images/portrait_physique.jpg")}" alt="Santamaria Sanchéz, fondateur d'EP Coaching" loading="lazy" /><figcaption><strong>Santamaria Sanchéz</strong>Fondateur d'EP Coaching, athlète naturel</figcaption></figure>
    <div data-reveal style="--i:1">
      <p class="eyebrow">◆ Qui est derrière</p>
      <h2>Construit par un coach, <span class="accent">testé sur lui-même</span></h2>
      <blockquote>Je prends les gens motivés, et je fais en sorte qu'ils aillent plus vite que s'ils étaient seuls.</blockquote>
      <p>Coach en musculation et en nutrition, athlète naturel, je prépare la Heroes Cup WNBF France en Classic Physique. Chaque outil de l'appli, je l'utilise d'abord sur moi. Ce que je sais, je l'ai appris en le faisant.</p>
      <div class="badges"><span class="chip">Athlète naturel WNBF</span><span class="chip">Classic Physique</span><span class="chip">Coach musculation et nutrition</span></div>
      <div class="cta-row" style="margin-top: var(--space-md)"><a class="btn-ghost" href="${r("/physique/")}">Découvrir l'accompagnement</a>${link("/a-propos/", `Mon histoire ${icon("arrow", "icon icon--xs")}`, path, "text-link")}</div>
    </div>
  </div></section>`;

  const guarantees = section({
    eyebrow: "Zéro risque",
    title: `Tu n'as <span class="accent">rien à perdre</span>`,
    content: `<div class="guarantees">${[
      ["Gratuit", "Sans carte bancaire, sans engagement. Tu commences aujourd'hui."],
      ["Tes données te suivent", "Export de toutes tes données en un clic, quand tu veux."],
      ["Tu pars quand tu veux", "Suppression du compte en un clic, sans demander à personne."],
      ["Hébergé en Europe", "Base de données dans l'Union européenne, accès cloisonnés."],
      ["Un humain répond", "Une vraie personne à l'assistance, sous 48 heures ouvrées."],
    ].map(([t, d], i) => `<div class="guarantee" data-reveal style="--i:${i}"><strong>${icon("shield", "icon icon--xs")} ${esc(t)}</strong><span>${esc(d)}</span></div>`).join("")}</div>`,
  });

  const faqQs = ["Qu'est-ce qu'EP Coaching ?", "Est-ce que l'appli est gratuite ?", "Faut-il peser tous ses aliments ?", "Que peut faire un coach dans EP Coaching ?", "Mes données sont-elles privées ?", "Faut-il télécharger l'appli sur l'App Store ou Google Play ?"];
  const faq = faqAll.filter((f) => faqQs.includes(f.q));

  const finalCta = `<section class="cta-band"><div class="cta-band-inner">
    <span class="diamond diamond--lg" aria-hidden="true"></span>
    <h2>Ton premier bilan prend <span class="accent">30 secondes</span></h2>
    <p>Crée ton compte, réponds à trois questions, et l'appli se règle sur toi. Gratuit, sans carte bancaire.</p>
    <div class="cta-row cta-row--center"><a class="btn-cta-primary btn-cta-primary--lg" href="${LINKS.signupMember}">Commencer gratuitement</a><a class="btn-ghost" href="${LINKS.signupCoach}">Je suis coach</a></div>
  </div></section>`;

  const body = [
    hero,
    vsl,
    logoMarquee(svgs),
    counters,
    pains,
    levers,
    tour,
    paths,
    coachs,
    `<section class="section" id="guide-gratuit">${quizBlock(guides, path)}</section>`,
    founder,
    guarantees,
    section({ eyebrow: "Actus", title: "Ce qui vient de sortir", content: `<div class="grid grid--3">${news.slice(0, 3).map((n) => newsCard(n, path)).join("")}</div><p class="center">${link("/actus/", "Toutes les actus", path, "btn-ghost")}</p>` }),
    section({ eyebrow: "FAQ", title: "Questions fréquentes", content: faqList(faq) + `<p class="center">${link("/faq/", "Toutes les questions", path, "btn-ghost")}</p>`, narrow: true }),
    finalCta,
    `<div class="sticky-cta" aria-hidden="false"><span>Ton suivi, gratuit</span><a class="btn-cta-primary" href="${LINKS.signupMember}">Commencer</a></div>`,
  ].join("\n");

  return {
    path,
    title: "EP Coaching : appli de suivi musculation et nutrition, et logiciel pour coachs sportifs",
    description: "Programme, nutrition, bilan en 30 secondes et progrès visibles : le suivi d'un vrai coach dans ta poche, gratuitement. Et pour les coachs : clients, contenu, formations et équipe dans une seule appli.",
    body,
    bodyClass: "page-home",
    jsonld: [
      ORG_JSONLD,
      { "@context": "https://schema.org", "@type": "WebSite", name: "EP Coaching", url: BASE, inLanguage: "fr-FR" },
      { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "EP Coaching", applicationCategory: "HealthApplication", operatingSystem: "Web, iOS, Android", url: APP, offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" } },
      faqJsonLd(faq),
    ],
  };
}
