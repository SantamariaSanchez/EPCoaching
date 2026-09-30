// Gabarit commun à toutes les pages générées : <head> SEO complet, header
// avec navigation, fil d'Ariane, pied de page complet (colonnes + barre du
// bas façon Instagram desktop). Aucune dépendance, uniquement des chaînes.
import { BASE, APP, LINKS, SOCIALS, NAV, FOOTER_COLUMNS, FOOTER_BAR } from "./config.mjs";

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Profondeur d'une page : "/" → 0, "/appli/" → 1, "/appli/notes/" → 2.
export function depthOf(path) {
  return path.split("/").filter(Boolean).length;
}

// Résout un lien pour la page courante : chemin de site ("/aide/") → relatif,
// "LINK:clé" → lien de l'appli, URL externe → inchangée.
export function resolve(href, fromPath) {
  if (href.startsWith("LINK:")) return LINKS[href.slice(5)];
  if (/^https?:|^mailto:/.test(href)) return href;
  const up = "../".repeat(depthOf(fromPath));
  const [p, hash] = href.split("#");
  const target = p === "/" ? "" : p.slice(1);
  const rel = (up + target) || "./";
  return hash ? `${rel}#${hash}` : rel;
}

export function isExternal(href) {
  return href.startsWith("LINK:") || /^https?:/.test(href);
}

export function link(href, label, fromPath, cls = "") {
  const ext = isExternal(href);
  const attrs = ext && !href.startsWith("LINK:") ? ' target="_blank" rel="noopener noreferrer"' : "";
  return `<a href="${esc(resolve(href, fromPath))}"${cls ? ` class="${cls}"` : ""}${attrs}>${label}</a>`;
}

export function canonical(path) {
  return BASE + path.replace(/^\//, "");
}

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
  apple: '<path d="M12 7c-1-2-3-3-5-2.5C4 5.5 3.5 9 4.5 12.5 5.5 16 8 20 10 20c1 0 1.2-.5 2-.5s1 .5 2 .5c2 0 4.5-4 5.5-7.5 1-3.5.5-7-2.5-8C15 4 13 5 12 7z"/><path d="M12 7c0-2 1-3.5 3-4"/>',
  clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="m9 13 2 2 4-4"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-8 8"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  week: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
  note: '<path d="M5 3h10l4 4v14H5z"/><path d="M9 11h6M9 15h6M9 7h3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
  sliders: '<path d="M4 6h10M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  message: '<path d="M4 5h16v11H9l-5 4z"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c2.8 0 5 2.2 5 5"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  book: '<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.6 1.6 1.6.6-1.6.6L19 20.4l-.6-1.6-1.6-.6 1.6-.6z"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7v.5M12 17h.01"/>',
  news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
};

export function icon(name, cls = "icon") {
  const body = ICONS[name] || ICONS.sparkles;
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

export function headerHtml(path) {
  const r = (h) => resolve(h, path);
  const items = NAV.map((n) => {
    const current = path === n.href || (n.href !== "/" && path.startsWith(n.href));
    return `<li><a href="${r(n.href)}"${current ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`;
  }).join("");
  return `<header class="site-header">
    <a href="${r("/")}" class="logo"><img src="${r("/assets/images/logo.png")}" alt="EP Coaching" width="50" height="40" /></a>
    <nav class="site-nav" id="site-nav" aria-label="Navigation principale">
      <ul class="site-nav-links">${items}</ul>
      <div class="site-nav-actions">
        <a href="${LINKS.login}" class="site-nav-login">Se connecter</a>
        <a href="${LINKS.signupMember}" class="btn-cta-primary btn-cta-primary--sm">Essayer gratuitement</a>
      </div>
    </nav>
    <button type="button" class="site-nav-toggle" aria-controls="site-nav" aria-expanded="false">
      <span class="sr-only">Ouvrir le menu</span><span class="site-nav-toggle-bar" aria-hidden="true"></span>
    </button>
  </header>`;
}

export function footerHtml(path) {
  const cols = FOOTER_COLUMNS.map(
    (c) => `<div class="footer-col"><p class="footer-col-title">${esc(c.title)}</p><ul>${c.links
      .map(([label, href]) => `<li>${link(href, esc(label), path)}</li>`)
      .join("")}</ul></div>`
  ).join("");
  const bar = FOOTER_BAR.map(([label, href]) => link(href, esc(label), path)).join("");
  const socials = SOCIALS.map((s) => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a>`).join("");
  return `<footer class="site-footer">
    <div class="footer-top">
      <div class="footer-brand-block">
        <a href="${resolve("/", path)}" class="footer-brand"><img src="${resolve("/assets/images/logo.png", path)}" alt="EP Coaching" width="40" height="32" /></a>
        <p class="footer-tagline">L'appli et le coaching pour progresser, que tu t'entraînes ou que tu coaches.</p>
        <div class="footer-newsletter">
          <p class="footer-newsletter-label">Un mail par jour : entraînement, nutrition, mental</p>
          <form id="newsletter-form" class="newsletter-form" novalidate>
            <label for="newsletter-email" class="sr-only">Ton email</label>
            <input type="text" name="website" class="newsletter-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" />
            <input type="email" id="newsletter-email" name="email" required placeholder="ton@email.com" class="newsletter-input" />
            <button type="submit" class="newsletter-submit">Je m'inscris</button>
          </form>
          <p class="newsletter-feedback" role="status" hidden></p>
        </div>
      </div>
      <nav class="footer-cols" aria-label="Plan du site">${cols}</nav>
    </div>
    <div class="footer-bar">
      <nav class="footer-bar-links" aria-label="Liens utiles et légaux">${bar}</nav>
      <nav class="footer-bar-socials" aria-label="Réseaux sociaux">${socials}</nav>
      <p class="footer-copy"><span>Français</span><span>© 2026 EP Coaching</span></p>
    </div>
  </footer>`;
}

export function crumbsHtml(crumbs, path) {
  if (!crumbs || crumbs.length < 2) return "";
  const items = crumbs
    .map(([label, href], i) =>
      i === crumbs.length - 1
        ? `<li aria-current="page">${esc(label)}</li>`
        : `<li><a href="${resolve(href, path)}">${esc(label)}</a></li>`
    )
    .join("");
  return `<nav class="crumbs" aria-label="Fil d'Ariane"><ol>${items}</ol></nav>`;
}

function crumbsJsonLd(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([label, href], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: label,
      item: canonical(href),
    })),
  };
}

export const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EP Coaching",
  url: BASE,
  logo: BASE + "assets/images/logo.png",
  description: "Appli de coaching et accompagnement en musculation, nutrition et business de coach, fondés par Santamaria Sanchéz.",
  founder: { "@type": "Person", name: "Santamaria Sanchéz" },
  sameAs: SOCIALS.map((s) => s.url).concat([APP]),
};

// Page complète. `body` est le HTML du <main>, déjà rendu.
export function pageHtml({ path, title, description, body, crumbs = [], jsonld = [], ogType = "website", noindex = false, bodyClass = "" }) {
  const r = (h) => resolve(h, path);
  const url = canonical(path);
  const fullTitle = title.includes("EP Coaching") ? title : `${title} · EP Coaching`;
  const ld = [...(crumbs.length > 1 ? [crumbsJsonLd(crumbs)] : []), ...jsonld]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("\n  ");
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}" />
  ${noindex ? '<meta name="robots" content="noindex" />' : ""}
  <link rel="canonical" href="${url}" />
  <meta property="og:title" content="${esc(fullTitle)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${BASE}assets/images/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:site_name" content="EP Coaching" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(fullTitle)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${BASE}assets/images/og-image.png" />
  <meta name="theme-color" content="#E01E1E" />
  <link rel="icon" type="image/svg+xml" href="${r("/favicon.svg")}" />
  <link rel="icon" href="${r("/favicon.ico")}" sizes="any" />
  <link rel="apple-touch-icon" href="${r("/apple-touch-icon.png")}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&family=Playfair+Display:ital,wght@1,700&display=swap" />
  <link rel="stylesheet" href="${r("/assets/css/base.css")}" />
  <link rel="stylesheet" href="${r("/assets/css/site.css")}" />
  ${ld}
</head>
<body class="page-content ${bodyClass}">
  <a href="#contenu" class="skip-link">Aller au contenu</a>
  ${headerHtml(path)}
  <main id="contenu">
    ${crumbsHtml(crumbs, path)}
    ${body}
  </main>
  ${footerHtml(path)}
  <script src="${r("/assets/js/site.js")}" defer></script>
  <script src="${r("/assets/js/main.js")}" defer></script>
</body>
</html>
`;
}

// ── Petits blocs réutilisables ──────────────────────────────────────────

export function hero({ eyebrow, title, lead, ctas = [], path, compact = false }) {
  const buttons = ctas
    .map((c, i) =>
      i === 0
        ? `<a href="${esc(resolve(c.href, path))}" class="btn-cta-primary">${esc(c.label)}</a>`
        : `<a href="${esc(resolve(c.href, path))}" class="btn-ghost">${esc(c.label)}</a>`
    )
    .join("");
  return `<section class="page-hero${compact ? " page-hero--compact" : ""}">
    ${eyebrow ? `<p class="eyebrow">◆ ${esc(eyebrow)}</p>` : ""}
    <h1>${title}</h1>
    ${lead ? `<p class="page-lead">${lead}</p>` : ""}
    ${buttons ? `<div class="cta-row">${buttons}</div>` : ""}
  </section>`;
}

export function section({ id, eyebrow, title, intro, content, narrow = false, cls = "" }) {
  return `<section class="section${narrow ? " section--narrow" : ""}${cls ? " " + cls : ""}"${id ? ` id="${id}"` : ""}>
    ${eyebrow || title ? `<div class="section-head">${eyebrow ? `<p class="eyebrow">◆ ${esc(eyebrow)}</p>` : ""}${title ? `<h2>${title}</h2>` : ""}${intro ? `<p class="section-intro">${intro}</p>` : ""}</div>` : ""}
    ${content}
  </section>`;
}

export function cardGrid(cards, path, { cols = "" } = {}) {
  return `<div class="grid${cols ? " grid--" + cols : ""}">${cards
    .map((c) => {
      const inner = `${c.icon ? icon(c.icon) : ""}${c.kicker ? `<span class="card-kicker">${esc(c.kicker)}</span>` : ""}<h3>${esc(c.title)}</h3>${c.text ? `<p>${c.text}</p>` : ""}${c.href ? `<span class="card-more">${esc(c.more || "En savoir plus")} ${icon("arrow", "icon icon--xs")}</span>` : ""}`;
      return c.href
        ? `<a class="card link-card" href="${esc(resolve(c.href, path))}"${/^https?:/.test(c.href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${inner}</a>`
        : `<div class="card">${inner}</div>`;
    })
    .join("")}</div>`;
}

export function steps(list) {
  return `<ol class="steps">${list.map((s) => `<li><span class="step-mark" aria-hidden="true"></span><div>${typeof s === "string" ? `<p>${s}</p>` : `<h3>${esc(s.t)}</h3><p>${s.d}</p>`}</div></li>`).join("")}</ol>`;
}

export function faqList(items) {
  return `<div class="faq">${items
    .map((f) => `<details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-answer"><p>${f.a}</p></div></details>`)
    .join("")}</div>`;
}

export function faqJsonLd(items) {
  const strip = (s) => String(s).replace(/<[^>]+>/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: strip(f.a) } })),
  };
}

export function ctaBand({ title, text, primary, secondary, path }) {
  return `<section class="cta-band">
    <div class="cta-band-inner">
      <span class="diamond diamond--lg" aria-hidden="true"></span>
      <h2>${title}</h2>
      ${text ? `<p>${text}</p>` : ""}
      <div class="cta-row cta-row--center">
        <a href="${esc(resolve(primary.href, path))}" class="btn-cta-primary btn-cta-primary--lg">${esc(primary.label)}</a>
        ${secondary ? `<a href="${esc(resolve(secondary.href, path))}" class="btn-ghost">${esc(secondary.label)}</a>` : ""}
      </div>
    </div>
  </section>`;
}
