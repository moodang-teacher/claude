(function () {
  "use strict";

  if (typeof gsap === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const hasScrollTrigger = typeof ScrollTrigger !== "undefined";
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  gsap.matchMedia().add(
    { isMobile: "(max-width: 768px)", isDesktop: "(min-width: 769px)" },
    (context) => {
      const { isMobile } = context.conditions;
      const dist = isMobile ? 20 : 44;
      const dur = isMobile ? 0.5 : 0.75;
      const stag = isMobile ? 0.06 : 0.12;
      const ease = "power2.out";

      // create the tween/timeline paused (still applies its hidden "from"
      // state immediately) and only .play() it once the element actually
      // scrolls into view — driven by IntersectionObserver instead of
      // pre-computed pixel positions, so a page full of late-loading images
      // or a fast flick-scroll can never make it miss its cue.
      function reveal(el, build) {
        if (!el) return;
        const anim = build();
        anim.pause();
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                anim.play();
                io.unobserve(el);
              }
            });
          },
          { threshold: 0, rootMargin: "0px 0px -12% 0px" }
        );
        io.observe(el);
      }

      // eyebrow -> title -> (optional) supporting text, in sequence — builds anticipation
      function revealHead(section, extra) {
        const eyebrow = section.querySelector(".eyebrow");
        const title = section.querySelector(".section-title");
        reveal(section, () => {
          const tl = gsap.timeline();
          if (eyebrow) tl.from(eyebrow, { opacity: 0, y: dist * 0.5, duration: dur, ease });
          if (title) tl.from(title, { opacity: 0, y: dist, duration: dur, ease }, "-=" + dur * 0.6);
          if (extra) tl.from(extra, { opacity: 0, y: dist, duration: dur, ease }, "-=" + dur * 0.5);
          return tl;
        });
      }

      // ===== worldview =====
      // pinned wipe-reveal slider — each subsequent color layer clip-path
      // sweeps in from the right edge, covering the previous layer whole
      // (bg + copy + image together), which is what produces the
      // overlapping-text "glitch" as the boundary crosses the copy block.
      const worldview = document.getElementById("worldview");
      if (worldview) {
        const slider = worldview.querySelector(".wv-slider");
        const layers = worldview.querySelectorAll(".wv-layer");
        const images = worldview.querySelectorAll(".wv-image img");
        const tabs = worldview.querySelectorAll(".worldview-tab");
        const tabsProgress = worldview.querySelector(".worldview-tabs-progress");
        const n = layers.length;

        // resting "peek" clip per upcoming layer — a thin, nested sliver of
        // each layer stays visible at rest so 3 slides read as 3 slides
        // before any scrolling happens, matching the reference motion.
        const PEEK = { 1: 92, 2: 96 };

        if (!isMobile && hasScrollTrigger && slider && n > 1) {
          if (tabs[0]) tabs[0].classList.add("is-active");
          for (let i = 1; i < n; i++) {
            gsap.set(images[i], { xPercent: 30, scale: 0.5, transformOrigin: "right center" });
          }

          // each item gets a HOLD beat (dwell, no motion) before the next
          // transition kicks in, so the reveal doesn't feel instant —
          // timeline layout: [hold][transition][hold][transition]...[hold]
          const D = 1; // transition duration
          const HOLD = 0.6; // dwell duration per item, in the same units
          const transitionStart = (i) => i * HOLD + (i - 1) * D;
          const totalDuration = n * HOLD + (n - 1) * D;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: slider,
              start: "top top",
              end: () => "+=" + window.innerHeight * totalDuration * 1.15,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (tabsProgress) tabsProgress.style.width = self.progress * 100 + "%";
                const t = self.progress * totalDuration;
                let active = 0;
                for (let i = 1; i < n; i++) {
                  if (t >= transitionStart(i) + D / 2) active = i;
                }
                tabs.forEach((el, idx) => el.classList.toggle("is-active", idx === active));
              },
            },
          });

          for (let i = 1; i < n; i++) {
            const pos = transitionStart(i);
            tl.fromTo(layers[i], { clipPath: `inset(0 0 0 ${PEEK[i]}%)` }, { clipPath: "inset(0 0 0 0%)", duration: D, ease: "none" }, pos)
              .fromTo(images[i], { xPercent: 30, scale: 0.5 }, { xPercent: 0, scale: 1, duration: D, ease: "none" }, pos);
          }
          tl.set({}, {}, totalDuration); // pad the timeline so the trailing hold is part of its duration
        }
      }

      // ===== characters =====
      const characters = document.getElementById("characters");
      if (characters) {
        revealHead(characters);
        const carousel = characters.querySelector(".carousel");
        reveal(carousel, () =>
          gsap.from(carousel.querySelectorAll(".char-panel"), { opacity: 0, y: dist, duration: dur, ease, stagger: stag })
        );
      }

      // ===== highlights =====
      const highlights = document.getElementById("highlights");
      if (highlights) {
        revealHead(highlights);
        const hSwiper = highlights.querySelector(".highlights-swiper");
        reveal(hSwiper, () => gsap.from(hSwiper, { opacity: 0, y: dist, duration: dur, ease }));
      }

      // ===== reviews =====
      const reviews = document.getElementById("reviews");
      if (reviews) {
        revealHead(reviews);
        const reviewsList = reviews.querySelector(".reviews-list");
        const reviewItems = reviewsList.querySelectorAll(".review-item");
        reveal(reviewsList, () =>
          gsap.from(reviewItems, {
            opacity: 0, x: isMobile ? -dist * 0.5 : -dist, duration: dur, ease, stagger: stag,
            onComplete: () => reviewItems.forEach((el) => el.classList.add("is-hover-ready")),
          })
        );
      }

      // ===== pv =====
      const pv = document.getElementById("pv");
      if (pv) {
        reveal(pv, () => {
          const tl = gsap.timeline();
          tl.from(pv.querySelector(".pv-eyebrow"), { opacity: 0, y: dist * 0.5, duration: dur, ease });
          tl.from(pv.querySelector(".pv-play"), { opacity: 0, scale: 0.7, duration: dur, ease: "power3.out" }, "-=" + dur * 0.5);
          tl.from(pv.querySelector(".pv-title"), { opacity: 0, y: dist, duration: dur, ease }, "-=" + dur * 0.5);
          tl.from(pv.querySelector(".pv-sub"), { opacity: 0, y: dist * 0.5, duration: dur, ease }, "-=" + dur * 0.5);
          return tl;
        });
        // .pv-seasons (season tab menu) — no scroll motion, stays plainly visible
      }

      // ===== watch ===== (no scroll motion — content stays plainly visible)

      // ===== final =====
      const final = document.querySelector(".final");
      if (final) {
        const ctaRow = final.querySelector(".final-cta-row");
        reveal(ctaRow, () =>
          gsap.from(ctaRow.querySelector(".btn-cta"), { opacity: 0, scale: 0.85, duration: dur, ease: "power3.out" })
        );
        const footer = final.querySelector(".site-footer");
        reveal(footer, () => gsap.from(footer, { opacity: 0, y: dist * 0.5, duration: dur, ease }));
      }

      // ===== hero exit — scroll-linked fade, not parallax =====
      const hero = document.querySelector(".hero");
      const headline = hero && hero.querySelector(".hero-headline");
      if (!isMobile && hasScrollTrigger && hero && headline) {
        gsap.to(headline, {
          opacity: 0, y: 40, ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        });
      }

      // ===== hero mouse parallax — headline children drift at different depths =====
      if (!isMobile && hero && headline) {
        const layers = [
          { el: headline.querySelector(".hero-title-wipe--1"), strength: 26 },
          { el: headline.querySelector(".hero-title-wipe--2"), strength: 16 },
          { el: headline.querySelector(".hero-sub-row"), strength: 10 },
        ].filter((layer) => layer.el);

        hero.addEventListener("mousemove", (e) => {
          const rect = hero.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          layers.forEach(({ el, strength }) => {
            gsap.to(el, { x: px * strength, y: py * strength * 0.6, duration: 0.6, ease: "power2.out" });
          });
        });

        hero.addEventListener("mouseleave", () => {
          layers.forEach(({ el }) => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "power2.out" }));
        });
      }
    }
  );
})();
