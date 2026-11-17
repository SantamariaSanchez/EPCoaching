// Page d'accueil : pensée comme une page de vente (Hormozi : nommer la
// douleur, montrer l'équation de valeur, empiler l'offre, retirer le risque ;
// Matis Clouet : un système clair contenu, guide gratuit, appli, appel).
// Uniquement des faits réels : écrans de l'appli (comptes de démo), chiffres
// calculés depuis les données du site, jamais de témoignage inventé.
import { APP, LINKS, BASE, VSL_YOUTUBE_ID, VSL_VIDEO, FOUNDER_FACTS } from "./config.mjs";
import { esc, resolve, link, icon, section, faqList, faqJsonLd, phone, logoMarquee, ORG_JSONLD, socialCards } from "./render.mjs";

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
      <a class="pill" href="${r("/a-propos/")}"><b>Emmanuel Santamaria Sanchéz</b> coach à Annecy, né en Colombie ${icon("arrow", "icon icon--xs")}</a>
      <h1><span class="w" style="--k:0"><span>Perds</span></span> <span class="w" style="--k:1"><span>du</span></span> <span class="w" style="--k:2"><span>gras</span></span> <span class="w" style="--k:3"><span>et</span></span> <span class="w" style="--k:4"><span>atteins</span></span> <span class="w" style="--k:5"><span>tes</span></span> <span class="w" style="--k:6"><span>objectifs</span></span> <span class="accent"><span class="w" style="--k:7"><span>en</span></span> <span class="w" style="--k:8"><span>6</span></span> <span class="w" style="--k:9"><span>mois.</span></span></span></h1>
      <p class="page-lead">Même si tu pars de zéro. Programme, diète et check-in chaque semaine.</p>
      <div class="cta-row">
        <a href="${LINKS.audit}" class="btn-cta-primary btn-cta-primary--lg">Réserver mon audit offert</a>
        <a href="${LINKS.signupMember}" class="btn-ghost">Essayer l'appli 60 jours</a>
      </div>
      <p class="hx-proof"><span>${icon("target")} Audit 30 min offert</span><span>${icon("heart")} Pour les débutantes</span></p>
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
  // Lecteur : YouTube si un identifiant est fourni (façade, rien ne charge avant le clic),
  // sinon la vidéo auto-hébergée (preload="none", sous-titres français actifs par défaut).
  const minutes = VSL_VIDEO.minutes;
  const player = VSL_YOUTUBE_ID
    ? `<div class="vsl-placeholder vx-player" id="vsl-placeholder" data-youtube-id="${VSL_YOUTUBE_ID}" data-poster="1" style="background-image:url(${r(VSL_VIDEO.poster)})">
        <span class="vsl-play vx-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="34" height="34"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span><span class="vx-duration">${minutes} min</span>
      </div>`
    : `<div class="vx-player vx-player--video" id="vsl-video">
        <video class="vx-video" playsinline preload="none" poster="${r(VSL_VIDEO.poster)}" aria-label="Vidéo de présentation EP Coaching (${minutes} minutes)">
          <source src="${r(VSL_VIDEO.src)}" type="video/mp4" />
          <track kind="subtitles" srclang="fr" label="Français" src="${r(VSL_VIDEO.vtt)}" />
        </video>
        <button type="button" class="vx-start" aria-label="Lire la vidéo de présentation"><span class="vsl-play vx-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="34" height="34"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span><span class="vx-duration">${minutes} min</span></button>
      </div>`;
  const vsl = `<section class="vx" id="video">
    <div class="vx-head" data-reveal><h2>Les 4 piliers, <span class="accent">en ${minutes} minutes</span></h2></div>
    <div class="vx-frame" data-reveal>
      <div class="vx-glow" aria-hidden="true"></div>
      ${player}
    </div>
    <div class="vx-choice" data-reveal>
      <a class="vx-card vx-card--hot" href="${LINKS.audit}"><span class="vx-kicker">Avec Emmanuel</span><strong>Coaching 6 mois</strong><span>Programme, diète, check-in</span><em>Réserver mon audit offert ${icon("arrow", "icon icon--xs")}</em></a>
      <a class="vx-card" href="${LINKS.signupMember}"><span class="vx-kicker">En autonomie</span><strong>L'appli seule</strong><span>Gratuite 60 jours</span><em>Créer mon compte ${icon("arrow", "icon icon--xs")}</em></a>
    </div>
  </section>`;

  const STEPS = [
    ["aujourdhui", "07:00", "Ta journée, prête.", ["Bilan, repas, séance"], "aujourdhui"],
    ["bilan", "07:05", "Bilan en 30 secondes.", ["Poids, nuit, pas"], "bilan"],
    ["nutrition", "12:30", "Repas déjà prévus.", ["Calories et macros calculées"], "nutrition"],
    ["entrainement", "18:00", "Séance guidée.", ["Série par série"], "entrainement"],
    ["road-map", "Dimanche", "Tes progrès.", ["Ta tendance, ta phase"], "road-map"],
  ];
  const tour = `<section class="section" id="visite">
    <div class="section-head"><h2>Une journée dans <span class="accent">l'appli</span></h2></div>
    <div class="tour">
      <div class="tour-steps">${STEPS.map(([shot, time, title, bullets, slug], i) => {
        return `<article class="tour-step" data-step="${i}" data-reveal><span class="step-index">${esc(time)}</span><h3>${esc(title)}</h3><p>${esc(bullets[0])}</p>${phone(shot, `Écran ${title}`, path)}</article>`;
      }).join("")}</div>
      <div class="tour-stage" aria-hidden="true"><div class="phone">${STEPS.map(([shot], i) => `<img src="${r(`/assets/images/app/${shot}.jpg`)}" alt="" data-step="${i}" class="${i === 0 ? "is-active" : ""}" width="390" height="844" loading="lazy" decoding="async" />`).join("")}</div><div class="tour-dots">${STEPS.map((_, i) => `<i class="${i === 0 ? "is-active" : ""}"></i>`).join("")}</div></div>
    </div>
  </section>`;

  // Accueil recentré sur une débutante (2026-11-17) : ce qu'elle vit (page Cible
  // de Notion), ce qu'on lui a fait croire, la méthode en 6 mois, ce qu'elle reçoit.
  const pourToi = section({
    title: `Tu as déjà commencé. <span class="accent">Plusieurs fois.</span>`,
    intro: "Une semaine chargée, et tout s'arrête.",
    content: `<ul class="ck">${[
      "La salle t'intimide",
      "Tu veux perdre du ventre",
      "Tu manques de temps",
      "Un écart, et tout est gâché",
    ].map((x, i) => `<li data-reveal style="--i:${i}">${esc(x)}</li>`).join("")}</ul>`,
    narrow: true,
  });

  const mythes = section({
    title: `Trois idées <span class="accent">fausses</span>`,
    content: `<div class="myths">${[
      ["Des heures de cardio", "La musculation dessine tes formes."],
      ["Trop musclée", "Des fessiers, des épaules, une silhouette équilibrée."],
      ["Manger très peu", "Tu manges à ta faim."],
    ].map(([f, v], i) => `<article class="myth spot" data-reveal style="--i:${i}"><p class="myth-f"><s>${esc(f)}</s></p><p class="myth-v">${esc(v)}</p></article>`).join("")}</div>`,
  });

  const methode = section({
    title: `Six mois, <span class="accent">étape par étape</span>`,
    content: `<ol class="road">${[
      ["Mois 1", "Les bases", "Séances, repas, rythme."],
      ["Mois 2 à 3", "Confiance à la salle", "Tu charges un peu plus."],
      ["Mois 4 à 5", "On affine", "Ventre, fessiers, silhouette."],
      ["Mois 6", "Tu sais faire seule", "Et ça reste."],
    ].map(([m, t, d], i) => `<li class="road-step" data-reveal style="--i:${i}"><span class="road-m">${esc(m)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("")}</ol>`,
  });

  const offre = section({
    title: `Ce que tu reçois <span class="accent">pendant 6 mois</span>`,
    content: `<div class="offer" data-reveal><ul class="ck ck--grid">${[
      "Programme, diète, roadmap",
      "Check-in chaque semaine",
      "Exercices corrigés en vidéo",
      "Suivi à toute heure",
      "Lives et formations",
      "Toute l'appli",
    ].map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="offer-cta"><p>On commence par un audit de 30 minutes, offert.</p><div class="cta-row"><a class="btn-cta-primary btn-cta-primary--lg" href="${LINKS.audit}">Réserver mon audit offert</a></div></div></div>`,
  });

  const coachLine = `<section class="section section--slim"><p class="coach-line" data-reveal>Tu es coach ? L'appli suit aussi tes clients. ${link("/solutions/coachs/", `Découvrir l'espace coach ${icon("arrow", "icon icon--xs")}`, path, "text-link")}</p></section>`;

  const founder = `<section class="section"><div class="founder">
    <figure class="founder-photo" data-reveal><img src="${r("/assets/images/portrait_physique.jpg")}" alt="Emmanuel, coach sportif à Annecy et fondateur d'EP Coaching" loading="lazy" /><figcaption><strong>Emmanuel Santamaria Sanchéz</strong>${FOUNDER_FACTS.age} ans, né à ${FOUNDER_FACTS.naissance} (Colombie), coach à Annecy</figcaption></figure>
    <div data-reveal style="--i:1">
      <h2>Qui est <span class="accent">derrière</span></h2>
      <p>Moi, c'est Emmanuel. ${FOUNDER_FACTS.age} ans, né en Colombie, coach à Annecy. Je prépare la ${FOUNDER_FACTS.objectif}.</p>
      <div class="badges"><span class="chip">${FOUNDER_FACTS.objectif}</span><span class="chip">Annecy · bientôt Paris</span></div>
      <div class="cta-row" style="margin-top: var(--space-md)"><a class="btn-ghost" href="${LINKS.audit}">Réserver mon audit offert</a>${link("/a-propos/", `Mon histoire ${icon("arrow", "icon icon--xs")}`, path, "text-link")}</div>
      ${socialCards()}
    </div>
  </div></section>`;

  const faqQs = ["Qu'est-ce qu'EP Coaching ?", "Faut-il peser tous ses aliments ?", "Mes données sont-elles privées ?"];
  const faq = faqAll.filter((f) => faqQs.includes(f.q));

  const finalCta = `<section class="cta-band"><div class="cta-band-inner">
    <span class="diamond diamond--lg" aria-hidden="true"></span>
    <h2>Cette fois, <span class="accent">on le fait bien</span></h2>
    <p>Audit de 30 minutes avec Emmanuel, offert.</p>
    <div class="cta-row cta-row--center"><a class="btn-cta-primary btn-cta-primary--lg" href="${LINKS.audit}">Réserver mon audit offert</a><a class="btn-ghost" href="${LINKS.signupMember}">Essayer l'appli</a></div>
  </div></section>`;

  const body = [
    hero,
    vsl,
    pourToi,
    mythes,
    methode,
    offre,
    tour,
    founder,
    coachLine,
    section({ title: "Questions fréquentes", content: faqList(faq) + `<p class="center">${link("/faq/", "Toutes les questions", path, "btn-ghost")}</p>`, narrow: true }),
    finalCta,
    `<div class="sticky-cta" aria-hidden="false"><span>Audit 30 min, offert</span><a class="btn-cta-primary" href="${LINKS.audit}">Réserver</a></div>`,
  ].join("\n");

  return {
    path,
    title: "EP Coaching · Emmanuel Santamaria Sanchéz, coach sportif à Annecy : perdre du gras en 6 mois",
    description: "EP Coaching, coach sportif à Annecy : coaching en ligne de 6 mois pour les débutantes qui veulent perdre du gras, et l'appli EP Coaching.",
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
