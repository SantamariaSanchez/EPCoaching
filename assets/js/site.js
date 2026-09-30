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

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  // ── Origine réelle du visiteur (pour créditer le lead au bon réseau) ──
  // Gardée pour toute la visite : un visiteur venu d'Instagram qui navigue
  // trois pages avant de laisser son email reste un lead Instagram.
  try {
    var ref = document.referrer ? new URL(document.referrer).hostname : "";
    if (ref && ref !== location.hostname && !sessionStorage.getItem("ep-ref")) sessionStorage.setItem("ep-ref", ref);
  } catch (e) {}

  // ── Apparitions au défilement ─────────────────────────────────────────
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  // ── Compteurs (uniquement des chiffres réels, écrits dans le HTML) ────
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var fmt = function (n) { return n.toLocaleString("fr-FR"); };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, target = parseInt(el.getAttribute("data-count"), 10), suffix = el.getAttribute("data-suffix") || "";
        if (reduce) { el.textContent = fmt(target) + suffix; return; }
        var start = performance.now(), dur = 1400;
        (function tick(now) {
          var p = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(Math.round(target * eased)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  // ── Halo qui suit la souris + légère inclinaison des cartes ───────────
  if (finePointer && !reduce) {
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".spot");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
      if (card.classList.contains("tilt")) {
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -6, ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
      }
    }, { passive: true });
    document.addEventListener("pointerout", function (e) {
      var card = e.target.closest && e.target.closest(".tilt");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    });
  }

  // ── Parallaxe des téléphones du hero ──────────────────────────────────
  var phones = document.querySelector(".phones");
  if (phones && !reduce) {
    if (finePointer) {
      window.addEventListener("pointermove", function (e) {
        phones.style.setProperty("--px", ((e.clientX / window.innerWidth) - 0.5).toFixed(3));
        phones.style.setProperty("--py", ((e.clientY / window.innerHeight) - 0.5).toFixed(3));
      }, { passive: true });
    }
    var onScroll = function () {
      var p = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
      phones.style.setProperty("--sy", p.toFixed(3));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ── Visite produit : le téléphone collant suit l'étape lue ────────────
  var stage = document.querySelector(".tour-stage");
  if (stage && "IntersectionObserver" in window) {
    var shots = stage.querySelectorAll("img[data-step]");
    var dots = stage.querySelectorAll(".tour-dots i");
    var setStep = function (i) {
      shots.forEach(function (img) { img.classList.toggle("is-active", img.getAttribute("data-step") === String(i)); });
      dots.forEach(function (d, k) { d.classList.toggle("is-active", k === i); });
    };
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setStep(parseInt(e.target.getAttribute("data-step"), 10)); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    document.querySelectorAll(".tour-step[data-step]").forEach(function (s) { tio.observe(s); });
  }

  // ── Capture de leads : choisis ton objectif, reçois le bon guide ──────
  document.querySelectorAll("[data-quiz]").forEach(function (quiz) {
    var options = quiz.querySelectorAll(".quiz-option");
    var result = quiz.querySelector(".quiz-result");
    var title = quiz.querySelector("[data-guide-title]");
    var hook = quiz.querySelector("[data-guide-hook]");
    var form = quiz.querySelector("form");
    var feedback = quiz.querySelector(".quiz-feedback");
    var slug = "";
    options.forEach(function (opt) {
      opt.addEventListener("click", function () {
        options.forEach(function (o) { o.setAttribute("aria-pressed", o === opt ? "true" : "false"); });
        slug = opt.getAttribute("data-slug");
        title.textContent = opt.getAttribute("data-title");
        hook.textContent = opt.getAttribute("data-hook");
        result.hidden = false;
        var input = form.querySelector('input[type="email"]');
        if (finePointer) input.focus();
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button");
      var email = form.querySelector('input[type="email"]').value.trim();
      var trap = form.querySelector('input[name="website"]').value;
      if (!slug || !email) return;
      btn.disabled = true;
      btn.textContent = "...";
      feedback.hidden = true;
      var direct = quiz.getAttribute("data-app") + "/ressources/" + slug;
      var referrer = "";
      try { referrer = sessionStorage.getItem("ep-ref") || ""; } catch (err) {}
      fetch(quiz.getAttribute("data-endpoint"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slug, email: email, website: trap, referrer: referrer }),
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data.ok) throw new Error(data.error || "erreur");
          btn.textContent = "C'est parti";
          window.location.href = data.url || direct;
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = "Recevoir le guide";
          feedback.textContent = "Petit souci d'envoi. ";
          var a = document.createElement("a");
          a.className = "text-link";
          a.href = direct;
          a.textContent = "Ouvre le guide directement ici";
          feedback.appendChild(a);
          feedback.hidden = false;
        });
    });
  });

  // ── Barre d'action collante (mobile), après le hero ──────────────────
  var sticky = document.querySelector(".sticky-cta");
  var heroEl = document.querySelector(".hx");
  if (sticky && heroEl) {
    var toggleSticky = function () {
      var past = heroEl.getBoundingClientRect().bottom < 0;
      var nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 600;
      sticky.classList.toggle("is-visible", past && !nearEnd);
    };
    window.addEventListener("scroll", toggleSticky, { passive: true });
    toggleSticky();
  }

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
