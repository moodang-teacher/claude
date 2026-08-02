(function () {
  "use strict";

  const CHARS = [
    { no: "NO.01", name: "MIDORIYA", ko: "미도리야 이즈쿠", color: "#00E676", quirk: "원 포 올", quirkEn: "ONE FOR ALL",
      desc: "무개성으로 태어났지만 히어로를 향한 마음만은 누구보다 뜨거웠던 소년. 계승받은 힘을 자신의 것으로 만들어간다.",
      img: "img/1080.jpg",
      stats: [["POW", 88, "A"], ["SPD", 76, "B"], ["TEC", 92, "A+"], ["MND", 96, "S"]] },
    { no: "NO.02", name: "BAKUGO", ko: "바쿠고 카츠키", color: "#FF9500", quirk: "폭파", quirkEn: "EXPLOSION",
      desc: "손바닥의 땀을 폭발시킨다. 압도적 재능과 지지 않겠다는 자존심으로 언제나 최전선에 선다.",
      img: "img/f482034780_1.jpg",
      stats: [["POW", 94, "A+"], ["SPD", 90, "A"], ["TEC", 96, "S"], ["MND", 72, "B"]] },
    { no: "NO.03", name: "TODOROKI", ko: "토도로키 쇼토", color: "#3B9BFF", quirk: "반냉반열", quirkEn: "HALF-COLD HALF-HOT",
      desc: "오른쪽은 얼음, 왼쪽은 화염. 아버지의 그늘에서 벗어나 자신의 힘으로 싸우기 시작한 웅영고 최강급 신입생.",
      img: "img/39138620211025180702.thumb.jpg",
      stats: [["POW", 92, "A"], ["SPD", 78, "B+"], ["TEC", 88, "A"], ["MND", 80, "B+"]] },
    { no: "NO.04", name: "ALL MIGHT", ko: "올마이트", color: "#FFD700", quirk: "평화의 상징", quirkEn: "SYMBOL OF PEACE",
      desc: "'괜찮아, 내가 왔다.' 사람들의 미소를 지켜온 최고의 히어로. 자신의 모든 것을 다음 세대에 건넸다.",
      img: "img/bcfc69cef5e95f99863c7f1ffc9f4ec3.png",
      stats: [["POW", 100, "S+"], ["SPD", 96, "S"], ["TEC", 94, "S"], ["MND", 100, "S+"]] },
    { no: "NO.05", name: "SHIGARAKI", ko: "시가라키 토무라", color: "#FF3B30", quirk: "붕괴", quirkEn: "DECAY",
      desc: "다섯 손가락이 닿은 모든 것을 무너뜨린다. 히어로가 만든 사회의 균열 그 자체로 태어난 빌런 연합의 수장.",
      img: "img/shigaraki3.jpg",
      stats: [["POW", 90, "A"], ["SPD", 74, "B"], ["TEC", 86, "A"], ["MND", 98, "S"]] },
  ];

  const SEASONS = [
    { label: "SEASON 1", img: "img/8c2f2dbfc02a2.jpg" },
    { label: "SEASON 2", img: "img/a75ee10eeb8fb53fa339cf2f043cf480.jpg" },
    { label: "SEASON 3", img: "img/vZcAn5XaBINRb3HUKEuqeQClhhVowGYgE4majiCPpDAVhAMpFr7uxB2Xmy9hnxVUcSqvDZOMdjUOBvmaBbkxdA.webp" },
    { label: "FINAL SEASON", img: "img/w4mvreDjCEY9e9Ra0KGdKItJci9yxqaFYbXrDtONBqzLIp1YAcZZoLlHsV2yv5VbKtwd4S2fuBUTwws3B1w-vg.webp" },
  ];

  const hexA = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  };

  let activeChar = 0;

  const carousel = document.getElementById("carousel");
  const charIndexLabel = document.getElementById("char-index-label");
  const charactersGlow = document.getElementById("characters-glow");

  function buildCarousel() {
    carousel.innerHTML = CHARS.map((c, idx) => {
      const statsHtml = c.stats.map(([label, v, grade]) => `
        <div class="char-stat">
          <span class="char-stat-grade">${grade}</span>
          <span class="char-stat-bar" data-value="${v}"></span>
          <span class="char-stat-label">${label}</span>
        </div>`).join("");

      return `
        <div class="char-panel" data-index="${idx}" style="--char-color:${c.color}; --char-tint:${hexA(c.color, 0.05)};">
          <img class="char-art" src="${c.img}" alt="${c.ko}">
          <div class="char-tint"></div>
          <div class="char-vignette"></div>
          <div class="char-rail-name">${c.name}</div>
          <div class="char-info">
            <div class="char-info-row">
              <div class="char-meta">
                <div class="char-meta-eyebrow">${c.no} / QUIRK — ${c.quirkEn}</div>
                <div class="char-meta-quirk">${c.quirk}</div>
                <div class="char-meta-name">${c.name}</div>
                <p class="char-meta-desc">${c.desc}</p>
              </div>
              <div class="char-stats">${statsHtml}</div>
            </div>
          </div>
        </div>`;
    }).join("");

    carousel.querySelectorAll(".char-panel").forEach((panel) => {
      panel.addEventListener("click", () => {
        activeChar = Number(panel.dataset.index);
        renderCharacters();
      });
    });
  }

  function renderCharacters() {
    const panels = carousel.querySelectorAll(".char-panel");
    panels.forEach((panel) => {
      const idx = Number(panel.dataset.index);
      const on = idx === activeChar;
      const c = CHARS[idx];
      panel.classList.toggle("is-active", on);
      panel.style.setProperty("--char-tint", on ? hexA(c.color, 0.22) : hexA(c.color, 0.05));
      panel.querySelectorAll(".char-stat-bar").forEach((bar) => {
        const v = Number(bar.dataset.value);
        bar.style.height = (on ? v * 0.9 : 0) + "px";
      });
    });

    const active = CHARS[activeChar];
    charactersGlow.style.background =
      `radial-gradient(60% 50% at 50% 60%, ${hexA(active.color, 0.16)}, transparent 70%)`;
    charIndexLabel.textContent =
      String(activeChar + 1).padStart(2, "0") + " / " + String(CHARS.length).padStart(2, "0");
  }

  document.getElementById("char-prev").addEventListener("click", () => {
    activeChar = (activeChar + CHARS.length - 1) % CHARS.length;
    renderCharacters();
  });
  document.getElementById("char-next").addEventListener("click", () => {
    activeChar = (activeChar + 1) % CHARS.length;
    renderCharacters();
  });

  buildCarousel();
  renderCharacters();

  // ===== hero background video — cover fit (16:9 oversize + center-crop) =====
  const heroSection = document.querySelector(".hero");
  const heroVideo = document.querySelector(".hero-key-visual");
  function sizeHeroVideo() {
    if (!heroSection || !heroVideo) return;
    const w = heroSection.clientWidth;
    const h = heroSection.clientHeight;
    const ratio = 16 / 9;
    if (w / h > ratio) {
      heroVideo.style.width = w + "px";
      heroVideo.style.height = w / ratio + "px";
    } else {
      heroVideo.style.width = h * ratio + "px";
      heroVideo.style.height = h + "px";
    }
  }
  window.addEventListener("resize", sizeHeroVideo, { passive: true });
  sizeHeroVideo();

  // ===== highlights swiper carousel =====
  new Swiper(".highlights-swiper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    grabCursor: true,
    keyboard: { enabled: true },
    navigation: {
      nextEl: ".highlights-next",
      prevEl: ".highlights-prev",
    },
    pagination: {
      el: ".highlights-pagination",
      clickable: true,
    },
  });

  // ===== scroll progress bar =====
  const progressFill = document.getElementById("progress-fill");
  function onScroll() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    progressFill.style.width = pct.toFixed(1) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ===== header — hide on scroll down, show on scroll up =====
  const siteHeader = document.getElementById("site-header");
  let lastScrollY = window.scrollY;
  function onHeaderScroll() {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 80) {
      siteHeader.classList.add("is-hidden");
    } else {
      siteHeader.classList.remove("is-hidden");
    }
    lastScrollY = currentY;
  }
  window.addEventListener("scroll", onHeaderScroll, { passive: true });

  // ===== back to top button — shows once the hero section is scrolled past =====
  const toTopBtn = document.getElementById("to-top");
  const heroEl = document.querySelector(".hero");
  function onToTopScroll() {
    const pastHero = heroEl.getBoundingClientRect().bottom <= 0;
    toTopBtn.classList.toggle("is-visible", pastHero);
  }
  window.addEventListener("scroll", onToTopScroll, { passive: true });
  onToTopScroll();
  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ===== PV season selector =====
  const pvTitle = document.getElementById("pv-title");
  const pvArt = document.querySelector(".pv-art");
  const seasonButtons = document.querySelectorAll(".season-btn");
  seasonButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      seasonButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const season = SEASONS[Number(btn.dataset.season)];
      pvTitle.textContent = season.label;
      if (!pvArt.src.endsWith(season.img)) {
        pvArt.style.opacity = "0";
        setTimeout(() => {
          pvArt.src = season.img;
          pvArt.style.opacity = "1";
        }, 260);
      }
    });
  });

  // ===== trailer modal =====
  const TRAILER_YOUTUBE_ID = "KQMZPbHfgNs";
  const trailerModal = document.getElementById("trailer-modal");
  const trailerIframe = document.getElementById("trailer-iframe");
  document.querySelectorAll(".js-open-trailer").forEach((el) => {
    el.addEventListener("click", () => {
      trailerIframe.src = `https://www.youtube.com/embed/${TRAILER_YOUTUBE_ID}?autoplay=1&rel=0`;
      trailerModal.classList.add("is-open");
    });
  });
  trailerModal.addEventListener("click", () => {
    trailerModal.classList.remove("is-open");
    trailerIframe.src = "";
  });
})();
