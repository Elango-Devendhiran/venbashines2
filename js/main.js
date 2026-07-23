/* =========================================================
   VENBA SHINES — Main JavaScript
   Loading screen, header, theme, counters, visualizer, etc.
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    initLoadingScreen();
    initAOS();
    initScrollProgress();
    initCursorGlow();
    initHeaderScroll();
    initThemeToggle();
    initSmoothNavActive();
    initCounters();
    initProcessLine();
    initVisualizer();
    initSwiper();
    initRipples();
    initBackToTop();
    initParticles();
    initForms();
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  /* ---------------- Loading Screen ---------------- */
  function initLoadingScreen() {
    const screen = document.getElementById("loading-screen");
    window.addEventListener("load", function () {
      setTimeout(function () {
        screen.classList.add("hide");
      }, 500);
    });
    // Fallback in case load event is delayed
    setTimeout(function () { screen.classList.add("hide"); }, 3500);
  }

  /* ---------------- AOS ---------------- */
  function initAOS() {
    if (window.AOS) {
      AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        once: true,
        offset: 60
      });
    }
  }

  /* ---------------- Scroll Progress Bar ---------------- */
  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    window.addEventListener("scroll", function () {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + "%";
    }, { passive: true });
  }

  /* ---------------- Cursor Glow + Custom Cursor ---------------- */
  function initCursorGlow() {
    const glow = document.getElementById("cursor-glow");
    const dot = document.getElementById("custom-cursor");
    if (!glow || !dot || window.matchMedia("(hover: none)").matches) return;

    window.addEventListener("mousemove", function (e) {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    });

    document.querySelectorAll("a, button, .swatch, .product-card").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        dot.style.width = "28px";
        dot.style.height = "28px";
        dot.style.background = "var(--gold-light)";
      });
      el.addEventListener("mouseleave", function () {
        dot.style.width = "14px";
        dot.style.height = "14px";
        dot.style.background = "var(--gold)";
      });
    });
  }

  /* ---------------- Header Scroll + Sticky ---------------- */
  function initHeaderScroll() {
    const nav = document.getElementById("mainNav");
    function update() {
      if (window.scrollY > 60) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    window.addEventListener("scroll", update, { passive: true });
    update();

    // Close mobile menu after link click
    document.querySelectorAll("#navMenu .nav-link-lux").forEach(function (link) {
      link.addEventListener("click", function () {
        const collapse = document.getElementById("navMenu");
        if (collapse.classList.contains("show") && window.bootstrap) {
          new bootstrap.Collapse(collapse).hide();
        }
      });
    });
  }

  /* ---------------- Active Nav Link on Scroll ---------------- */
  function initSmoothNavActive() {
    const sections = document.querySelectorAll("main section[id]");
    const links = document.querySelectorAll(".nav-link-lux");
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          const active = document.querySelector('.nav-link-lux[href="#' + entry.target.id + '"]');
          if (active) active.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------------- Theme Toggle ---------------- */
  function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    const body = document.body;
    const icon = btn.querySelector("i");
    let saved = "light";
    try { saved = localStorage.getItem("venba-theme") || "light"; } catch (e) {}
    setTheme(saved);

    btn.addEventListener("click", function () {
      const current = body.getAttribute("data-theme");
      setTheme(current === "light" ? "dark" : "light");
    });

    function setTheme(mode) {
      body.setAttribute("data-theme", mode);
      icon.className = mode === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
      try { localStorage.setItem("venba-theme", mode); } catch (e) {}
    }
  }

  /* ---------------- Animated Counters ---------------- */
  function initCounters() {
    const counters = document.querySelectorAll(".counter-item .num, .stat-chip .num");
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { observer.observe(c); });

    function animateCount(el) {
      const target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }
  }

  /* ---------------- Process Line Fill ---------------- */
  function initProcessLine() {
    const fill = document.getElementById("processFill");
    const steps = document.querySelectorAll(".process-step");
    if (!fill) return;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fill.style.width = "100%";
          steps.forEach(function (s, i) {
            setTimeout(function () { s.classList.add("active"); }, i * 220);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });
    observer.observe(document.getElementById("process"));
  }

  /* ---------------- Interactive Wall Color Visualizer ---------------- */
  function initVisualizer() {
    const swatchColors = [
      { name: "Warm Ivory", hex: "#EDE7DA" },
      { name: "Golden Sand", hex: "#D4AF37" },
      { name: "Royal Navy", hex: "#0D2B5B" },
      { name: "Sky Blue", hex: "#2F6FED" },
      { name: "Emerald Green", hex: "#2FA36B" },
      { name: "Amethyst Purple", hex: "#7A5CC7" },
      { name: "Blush Pink", hex: "#E5578A" },
      { name: "Coral Red", hex: "#D8483F" },
      { name: "Sunshine Yellow", hex: "#E8B93A" },
      { name: "Tangerine Orange", hex: "#F2793B" },
      { name: "Misty Grey", hex: "#B8BEC9" },
      { name: "Charcoal", hex: "#374151" },
      { name: "Mint Fresh", hex: "#8FDCC1" },
      { name: "Terracotta", hex: "#C2664A" },
      { name: "Lavender Mist", hex: "#B9A7E0" },
      { name: "Peach Blossom", hex: "#F2B6A0" },
      { name: "Olive Grove", hex: "#7C8B4A" },
      { name: "Powder Blue", hex: "#A9CBEB" },
      { name: "Rose Gold", hex: "#D89A8B" },
      { name: "Pure White", hex: "#FFFFFF" }
    ];

    const swatchRow = document.getElementById("swatchRow");
    const roomTabs = document.querySelectorAll(".viz-tab");
    const roomSvgs = document.querySelectorAll("[data-room-svg]");
    const currentColorName = document.getElementById("currentColorName");
    const compareAfter = document.getElementById("compareAfter");
    const compareBtn = document.getElementById("compareBtn");
    const resetBtn = document.getElementById("resetViz");
    const saveBtn = document.getElementById("saveShot");
    const roomStage = document.getElementById("roomStage");

    if (!swatchRow) return;

    let activeRoom = "living";
    let compareMode = false;
    const defaultColor = "#EDE7DA";

    // Build swatches
    swatchColors.forEach(function (c) {
      const btn = document.createElement("button");
      btn.className = "swatch";
      btn.style.background = c.hex;
      btn.setAttribute("data-hex", c.hex);
      btn.setAttribute("data-name", c.name);
      btn.setAttribute("aria-label", "Apply " + c.name + " color to wall");
      btn.type = "button";
      btn.addEventListener("click", function () { applyColor(c.hex, c.name, btn); });
      swatchRow.appendChild(btn);
    });

    // Room tab switching
    roomTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        roomTabs.forEach(function (t) { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        activeRoom = tab.getAttribute("data-room");
        roomSvgs.forEach(function (svg) {
          svg.style.display = svg.getAttribute("data-room-svg") === activeRoom ? "block" : "none";
        });
        resetWall();
        exitCompare();
      });
    });

    function getActiveWall() {
      const svg = document.querySelector('[data-room-svg="' + activeRoom + '"]');
      return svg ? svg.querySelector('[data-wall="1"]') : null;
    }

    function applyColor(hex, name, btnEl) {
      const wall = getActiveWall();
      if (wall) {
        wall.style.transition = "fill .5s cubic-bezier(.16,.84,.44,1)";
        wall.setAttribute("fill", hex);
      }
      document.querySelectorAll(".swatch").forEach(function (s) { s.classList.remove("active"); });
      if (btnEl) btnEl.classList.add("active");
      currentColorName.textContent = name + " — applied to " + roomLabel(activeRoom);
    }

    function roomLabel(room) {
      return { living: "Living Room", bedroom: "Bedroom", office: "Office", exterior: "Exterior Wall" }[room] || room;
    }

    function resetWall() {
      const wall = getActiveWall();
      if (wall) wall.setAttribute("fill", defaultColor);
      document.querySelectorAll(".swatch").forEach(function (s) { s.classList.remove("active"); });
      currentColorName.textContent = "Warm Ivory — default wall tone";
    }

    resetBtn.addEventListener("click", function () {
      resetWall();
      exitCompare();
    });

    /* ---- Compare Before/After ---- */
    function enterCompare() {
      compareMode = true;
      compareBtn.classList.add("active");
      const wall = getActiveWall();
      const currentFill = wall ? wall.getAttribute("fill") : defaultColor;

      // Approximate wall rect proportions per room (relative to 600x375 viewBox)
      const rects = {
        living:   { top: 0,    left: 0, width: 100, height: 69.3 },
        bedroom:  { top: 0,    left: 0, width: 100, height: 69.3 },
        office:   { top: 0,    left: 0, width: 100, height: 69.3 },
        exterior: { top: 21.3, left: 0, width: 100, height: 78.7 }
      };
      const r = rects[activeRoom];
      compareAfter.style.top = r.top + "%";
      compareAfter.style.left = r.left + "%";
      compareAfter.style.height = r.height + "%";
      compareAfter.style.background = defaultColor;
      compareAfter.style.width = "50%";
      compareAfter.dataset.afterColor = currentFill;

      let slider = document.getElementById("compareRange");
      if (!slider) {
        slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0"; slider.max = "100"; slider.value = "50";
        slider.className = "compare-range";
        slider.id = "compareRange";
        slider.setAttribute("aria-label", "Drag to compare before and after wall color");
        roomStage.appendChild(slider);
        slider.addEventListener("input", function () {
          compareAfter.style.width = slider.value + "%";
          handle.style.left = slider.value + "%";
        });
      }
      slider.style.display = "block";

      let handle = document.getElementById("compareHandle");
      if (!handle) {
        handle = document.createElement("div");
        handle.className = "compare-handle";
        handle.id = "compareHandle";
        roomStage.appendChild(handle);
      }
      handle.style.display = "block";
      handle.style.left = "50%";
      compareAfter.classList.add("active");
    }

    function exitCompare() {
      compareMode = false;
      compareBtn.classList.remove("active");
      compareAfter.classList.remove("active");
      const slider = document.getElementById("compareRange");
      const handle = document.getElementById("compareHandle");
      if (slider) slider.style.display = "none";
      if (handle) handle.style.display = "none";
    }

    compareBtn.addEventListener("click", function () {
      if (compareMode) exitCompare(); else enterCompare();
    });

    /* ---- Save Screenshot (PNG of current room stage) ---- */
    saveBtn.addEventListener("click", function () {
      const svg = document.querySelector('[data-room-svg="' + activeRoom + '"]');
      if (!svg) return;
      const clone = svg.cloneNode(true);
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const svgData = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = 1200; canvas.height = 750;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(26,35,50,0.85)";
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        ctx.fillStyle = "#FDD835";
        ctx.font = "bold 26px DM Sans, sans-serif";
        ctx.fillText("Venba Shines — " + roomLabel(activeRoom), 24, canvas.height - 22);
        URL.revokeObjectURL(url);
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "venba-shines-" + activeRoom + "-wall.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      img.src = url;
    });
  }

  /* ---------------- Swiper (Testimonials) ---------------- */
  function initSwiper() {
    if (window.Swiper) {
      new Swiper(".testimonialSwiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: { delay: 4500, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: {
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 }
        }
      });
    }
  }

  /* ---------------- Ripple Button Effect ---------------- */
  function initRipples() {
    document.querySelectorAll(".btn-lux").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
        ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
        btn.style.position = "relative";
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 650);
      });
    });
  }

  /* ---------------- Back To Top ---------------- */
  function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) btn.classList.add("show");
      else btn.classList.remove("show");
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Floating Paint Bubbles (Hero) ---------------- */
  function initParticles() {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const colors = ["#E8453C", "#F57C20", "#2196F3", "#1B8A5A", "#7B1FA2", "#E91E8A", "#FDD835"];
    for (let i = 0; i < 14; i++) {
      const b = document.createElement("div");
      b.className = "paint-bubble";
      const size = 6 + Math.random() * 16;
      b.style.width = size + "px";
      b.style.height = size + "px";
      b.style.left = Math.random() * 100 + "%";
      b.style.bottom = "-40px";
      b.style.background = colors[Math.floor(Math.random() * colors.length)];
      b.style.animationDuration = (8 + Math.random() * 10) + "s";
      b.style.animationDelay = (Math.random() * 10) + "s";
      hero.appendChild(b);
    }
  }

  /* ---------------- Forms (client-side only, no backend) ---------------- */
  function initForms() {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
        document.getElementById("formSuccess").classList.remove("d-none");
        contactForm.reset();
      });
    }
    const quoteForm = document.getElementById("quoteForm");
    if (quoteForm) {
      quoteForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const modalEl = document.getElementById("quoteModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        quoteForm.reset();
        if (modal) modal.hide();
      });
    }
  }

})();
