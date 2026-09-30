/* ═══════════════════════════════════════════════════════════════════════
   EP Coaching, comportements communs à tout le site (sans dépendance)
   ═══════════════════════════════════════════════════════════════════════
   Menu mobile, header compacté au scroll quand GSAP n'est pas chargé
   (pages de contenu), filtres instantanés (aide, guides) et filtre des
   actus. Tout fonctionne sans ce script : il ne fait qu'ajouter du confort. */

(function () {
  // ── Menu mobile ──────────────────────────────────────────────────────
  var toggle = document.querySelector(".site-nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.querySelector(".sr-only").textContent = open ? "Fermer le menu" : "Ouvrir le menu";
    };
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) setOpen(false);
    });
  }

  // ── Header compacté au scroll (si main.js n'a pas ScrollTrigger) ─────
  var header = document.querySelector(".site-header");
  if (header && typeof window.ScrollTrigger === "undefined") {
    var ticking = false;
    var update = function () {
      header.classList.toggle("header--scrolled", window.scrollY > 80);
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  // ── Filtre instantané (aide, guides) ─────────────────────────────────
  var normalize = function (s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  };
  document.querySelectorAll("[data-filter]").forEach(function (input) {
    var scope = input.closest("section") || document;
    var items = Array.prototype.slice.call(scope.querySelectorAll(".guide-item"));
    var groups = Array.prototype.slice.call(scope.querySelectorAll(".help-cat"));
    var empty = scope.querySelector(".filter-empty");
    var index = items.map(function (el) {
      return normalize(el.getAttribute("data-search") || el.textContent);
    });
    input.addEventListener("input", function () {
      var words = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
      var shown = 0;
      items.forEach(function (el, i) {
        var ok = words.every(function (w) {
          return index[i].indexOf(w) !== -1;
        });
        el.hidden = !ok;
        if (ok) shown++;
      });
      groups.forEach(function (g) {
        g.classList.toggle("is-empty", !g.querySelector(".guide-item:not([hidden])"));
      });
      if (empty) empty.hidden = shown !== 0;
    });
  });

  // ── Filtre des actus par catégorie ───────────────────────────────────
  var newsButtons = document.querySelectorAll("[data-news-filter]");
  var newsList = document.querySelector("[data-news-list]");
  if (newsButtons.length && newsList) {
    newsButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-news-filter");
        newsButtons.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        newsList.querySelectorAll("[data-cat]").forEach(function (card) {
          card.hidden = cat !== "" && card.getAttribute("data-cat") !== cat;
        });
      });
    });
  }
})();
