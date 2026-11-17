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
      <a class="pill" href="${r("/a-propos/")}"><b>Emmanuel Santamaria Sanchéz</b> coach à Annecy, né en Colombie ${icon("arrow", "icon icon--xs")}</a>
      <h1>Perds du gras et atteins tes objectifs <span class="accent">en 6 mois.</span></h1>
      <p class="page-lead">Même si tu pars de zéro. Un programme, une diète et une roadmap faits pour toi, un check-in chaque semaine, et un coach qui te répond à toute heure.</p>
      <div class="cta-row">
        <a href="${LINKS.audit}" class="btn-cta-primary btn-cta-primary--lg">Réserver mon audit offert</a>
        <a href="${LINKS.signupMember}" class="btn-ghost">Essayer l'appli 60 jours</a>
      </div>
      <p class="hx-proof"><span>${icon("target")} Audit 30 min, gratuit, en tête-à-tête</span><span>${icon("shield")} Appli gratuite 60 jours</span><span>${icon("heart")} Pour les débutantes</span></p>
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
    <div class="vx-head" data-reveal><p class="eyebrow">◆ À regarder avant de réserver</p><h2>Pourquoi tu recommences sans arrêt, <span class="accent">et comment on règle ça</span></h2><p class="section-intro">${minutes} minutes. Les 4 piliers pour perdre du gras quand on débute, sans y passer sa vie.</p></div>
    <div class="vx-frame" data-reveal>
      <div class="vx-glow" aria-hidden="true"></div>
      ${player}
    </div>
    <div class="vx-choice" data-reveal>
      <a class="vx-card vx-card--hot" href="${LINKS.audit}"><span class="vx-kicker">Coaching 6 mois</span><strong>Je veux perdre du gras et me sentir bien</strong><span>Programme, diète, roadmap, check-in chaque semaine</span><em>Réserver mon audit offert ${icon("arrow", "icon icon--xs")}</em></a>
      <a class="vx-card" href="${LINKS.signupMember}"><span class="vx-kicker">En autonomie</span><strong>Je veux d'abord essayer l'appli</strong><span>Séance, repas et bilan du matin, gratuit 60 jours</span><em>Créer mon compte ${icon("arrow", "icon icon--xs")}</em></a>
    </div>
    <p class="vx-proof">Audit de 30 minutes, gratuit, avec Emmanuel. Dans le pire des cas, tu repars avec un plan clair.</p>
  </section>`;

  const STEPS = [
    ["aujourdhui", "07:00", "Tu sais quoi faire.", ["Bilan, repas et séance du jour, dans l'ordre", "Tu coches au fur et à mesure", "Rien d'autre à retenir"], "aujourdhui"],
    ["bilan", "07:05", "Ton bilan en 30 secondes.", ["Poids, nuit, pas, énergie", "Les calories remontent seules", "Un jour oublié se rattrape"], "bilan"],
    ["nutrition", "12:30", "Tes repas sont déjà prévus.", ["Construits à partir de ton plan", "Un repas mangé tel quel : un geste", "Calories et macros calculées pour toi"], "nutrition"],
    ["entrainement", "18:00", "Ta séance, série par série.", ["Programme prêt, matériel indiqué", "La dernière séance à côté pour savoir quoi battre", "Records repérés tout seuls"], "entrainement"],
    ["road-map", "Dimanche", "Tes progrès, enfin visibles.", ["Tendance du poids semaine après semaine", "Ta phase actuelle et la suivante", "Photos et mensurations pour trancher"], "road-map"],
  ];
  const tour = `<section class="section" id="visite">
    <div class="section-head"><p class="eyebrow">◆ Visite guidée</p><h2>Une journée dans <span class="accent">l'appli</span></h2><p class="section-intro">Ce que ça change, du réveil au coucher. Écrans réels, comptes de démonstration.</p></div>
    <div class="tour">
      <div class="tour-steps">${STEPS.map(([shot, time, title, bullets, slug], i) => {
        const f = feat(slug);
        return `<article class="tour-step" data-step="${i}" data-reveal><span class="step-index">${esc(time)}</span><h3>${esc(title)}</h3><ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>${f ? `<p>${link(`/appli/${f.slug}/`, `En savoir plus sur ${esc(f.name)} ${icon("arrow", "icon icon--xs")}`, path, "text-link")}</p>` : ""}${phone(shot, `Écran ${title}`, path)}</article>`;
      }).join("")}</div>
      <div class="tour-stage" aria-hidden="true"><div class="phone">${STEPS.map(([shot], i) => `<img src="${r(`/assets/images/app/${shot}.jpg`)}" alt="" data-step="${i}" class="${i === 0 ? "is-active" : ""}" width="390" height="844" loading="lazy" decoding="async" />`).join("")}</div><div class="tour-dots">${STEPS.map((_, i) => `<i class="${i === 0 ? "is-active" : ""}"></i>`).join("")}</div></div>
    </div>
  </section>`;

  // Accueil recentré sur une débutante (2026-11-17) : ce qu'elle vit (page Cible
  // de Notion), ce qu'on lui a fait croire, la méthode en 6 mois, ce qu'elle reçoit.
  const pourToi = section({
    eyebrow: "C'est pour toi si",
    title: `Tu as déjà commencé. <span class="accent">Plusieurs fois.</span>`,
    intro: "Et à chaque fois, une semaine chargée a tout arrêté. Il te faut un plan qui tient dans ta vraie vie.",
    content: `<ul class="ck">${[
      "La salle t'intimide, tu ne sais pas par où commencer",
      "Tu veux perdre du ventre sans passer ta vie sur le tapis",
      "Tu veux des formes, pas devenir massive",
      "Tu manques de temps, et ta semaine bouge tout le temps",
      "Un écart, et tu as l'impression d'avoir tout gâché",
    ].map((x, i) => `<li data-reveal style="--i:${i}">${esc(x)}</li>`).join("")}</ul>`,
    narrow: true,
  });

  const mythes = section({
    eyebrow: "Ce qu'on t'a fait croire",
    title: `Trois idées <span class="accent">qui te freinent</span>`,
    content: `<div class="myths">${[
      ["Il faut des heures de cardio pour perdre du ventre", "La musculation dessine tes formes. Le cardio aide, il ne fait pas tout."],
      ["La musculation va me rendre trop musclée", "Elle te donne des fessiers, des épaules, une silhouette plus équilibrée."],
      ["Il faut manger très peu pour maigrir", "Tu manges à ta faim, avec des protéines à chaque repas. C'est ce qui tient."],
    ].map(([f, v], i) => `<article class="myth spot" data-reveal style="--i:${i}"><p class="myth-f"><s>${esc(f)}</s></p><p class="myth-v">${esc(v)}</p></article>`).join("")}</div>`,
  });

  const methode = section({
    eyebrow: "La méthode",
    title: `Six mois, <span class="accent">étape par étape</span>`,
    intro: "Pas un défi de 30 jours. Un changement qui reste, découpé en étapes que tu vois passer dans ta roadmap.",
    content: `<ol class="road">${[
      ["Mois 1", "Les bases", "Tes séances, tes repas, ton rythme. Tout tient dans ta semaine."],
      ["Mois 2 à 3", "Confiance à la salle", "Tu sais quoi faire, tu charges un peu plus chaque semaine."],
      ["Mois 4 à 5", "On affine", "Le ventre, les fessiers, la silhouette que tu veux."],
      ["Mois 6", "Tu sais faire seule", "Tu n'as plus besoin de deviner. Et ça reste."],
    ].map(([m, t, d], i) => `<li class="road-step" data-reveal style="--i:${i}"><span class="road-m">${esc(m)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("")}</ol>`,
  });

  const offre = section({
    eyebrow: "Le coaching EP",
    title: `Ce que tu reçois <span class="accent">pendant 6 mois</span>`,
    content: `<div class="offer" data-reveal><ul class="ck ck--grid">${[
      "Programme, diète et roadmap faits pour toi",
      "Un check-in chaque semaine, photos comprises",
      "Tes exercices corrigés en vidéo",
      "Un suivi à toute heure",
      "7 formats de live à réserver",
      "5 formations, et toute l'appli",
    ].map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="offer-cta"><p>On commence par un audit de 30 minutes, gratuit, en tête-à-tête. Tu repars avec un plan clair, que tu travailles avec nous ou non.</p><div class="cta-row"><a class="btn-cta-primary btn-cta-primary--lg" href="${LINKS.audit}">Réserver mon audit offert</a></div></div></div>`,
  });

  const coachLine = `<section class="section section--slim"><p class="coach-line" data-reveal>Tu es coach ? L'appli suit aussi tes clients. ${link("/solutions/coachs/", `Découvrir l'espace coach ${icon("arrow", "icon icon--xs")}`, path, "text-link")}</p></section>`;

  const founder = `<section class="section"><div class="founder">
    <figure class="founder-photo" data-reveal><img src="${r("/assets/images/portrait_physique.jpg")}" alt="Emmanuel, coach sportif à Annecy et fondateur d'EP Coaching" loading="lazy" /><figcaption><strong>Emmanuel Santamaria Sanchéz</strong>${FOUNDER_FACTS.age} ans, né à ${FOUNDER_FACTS.naissance} (Colombie), coach à Annecy</figcaption></figure>
    <div data-reveal style="--i:1">
      <p class="eyebrow">◆ Qui est derrière</p>
      <h2>Qui est <span class="accent">derrière</span></h2>
      <blockquote>Un plan simple, que tu tiens, ça change tout.</blockquote>
      <p>Moi, c'est Emmanuel. J'ai ${FOUNDER_FACTS.age} ans, je suis né à ${FOUNDER_FACTS.naissance}, en Colombie, je vis à Annecy et je pars bientôt à Paris. Je prépare la ${FOUNDER_FACTS.objectif}. J'ai créé EP Coaching et son appli pour aider les débutantes à perdre du gras et à atteindre leurs objectifs en 6 mois.</p>
      <div class="badges"><span class="chip">${FOUNDER_FACTS.objectif}</span><span class="chip">Annecy · bientôt Paris</span></div>
      <div class="cta-row" style="margin-top: var(--space-md)"><a class="btn-ghost" href="${LINKS.audit}">Réserver mon audit offert</a>${link("/a-propos/", `Mon histoire ${icon("arrow", "icon icon--xs")}`, path, "text-link")}</div>
      <p class="founder-follow">Suis-moi au quotidien, conseils et coulisses :</p>
      ${socialCards()}
    </div>
  </div></section>`;

  const faqQs = ["Qu'est-ce qu'EP Coaching ?", "Est-ce que l'appli est gratuite ?", "Faut-il peser tous ses aliments ?", "Mes données sont-elles privées ?", "Faut-il télécharger l'appli sur l'App Store ou Google Play ?"];
  const faq = faqAll.filter((f) => faqQs.includes(f.q));

  const finalCta = `<section class="cta-band"><div class="cta-band-inner">
    <span class="diamond diamond--lg" aria-hidden="true"></span>
    <h2>Cette fois, <span class="accent">on le fait bien</span></h2>
    <p>Audit stratégique avec Emmanuel : 30 minutes, gratuit, en tête-à-tête. Tu repars avec un plan clair.</p>
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
    section({ eyebrow: "FAQ", title: "Questions fréquentes", content: faqList(faq) + `<p class="center">${link("/faq/", "Toutes les questions", path, "btn-ghost")}</p>`, narrow: true }),
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
