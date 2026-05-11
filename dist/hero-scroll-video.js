/**
 * Hero scroll-driven video (sin GSAP).
 *
 * - .hero: altura = 100vh + duración × px/s + endHold (inline minHeight).
 * - .hero-stage: sticky 100vh; el viewport se queda fijo mientras recorres el hero.
 * - Adelante: play() + playbackRate (evita seeks bruscos en MP4).
 * - Atrás: seeks en pasos (lerp); nunca play() si target < current.
 */
(() => {
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const hero = document.querySelector(".hero");
  const video = document.querySelector("[data-scroll-video]");
  if (!hero || !(video instanceof HTMLVideoElement)) return;

  const getPixelsPerSecond = () => (window.innerWidth < 769 ? 320 : 460);
  const getEndHold = () => Math.round(window.innerHeight * 0.03);
  const IDLE_BEFORE_PAUSE_MS = 420;
  const MAX_FORWARD_RATE = 6;
  const BACKWARD_LERP = 0.35;
  const BACKWARD_MIN_STEP = 0.012;

  let scrollRaf = 0;
  let driveRaf = 0;
  let maxTime = 0;
  let isReady = false;
  let targetTime = 0;
  let lastScrollAt = 0;

  const computeProgress = () => {
    const rect = hero.getBoundingClientRect();
    const playRange = Math.max(maxTime * getPixelsPerSecond(), 1);
    return clamp(-rect.top / playRange, 0, 1);
  };

  const syncHeroScrollRange = () => {
    if (!isReady || maxTime <= 0) return;
    const playRange = maxTime * getPixelsPerSecond();
    const total = window.innerHeight + playRange + getEndHold();
    hero.style.minHeight = `${Math.ceil(total)}px`;
  };

  const safePlay = () => {
    if (!video.paused) return;
    if (video.ended) return;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  const drive = () => {
    driveRaf = 0;
    if (!isReady || maxTime <= 0) return;

    const current = video.currentTime;
    const diff = targetTime - current;
    const idleMs = performance.now() - lastScrollAt;
    const userActive = idleMs < IDLE_BEFORE_PAUSE_MS;

    if (diff > 0.015) {
      safePlay();
      const desired = clamp(1 + diff * 2.8, 1, MAX_FORWARD_RATE);
      if (Math.abs(video.playbackRate - desired) > 0.04) {
        video.playbackRate = desired;
      }
      driveRaf = window.requestAnimationFrame(drive);
      return;
    }

    if (diff < 0) {
      if (!video.paused) video.pause();
      if (video.playbackRate !== 1) video.playbackRate = 1;
      if (diff > -0.015) {
        video.currentTime = targetTime;
        driveRaf = window.requestAnimationFrame(drive);
        return;
      }
      let step = diff * BACKWARD_LERP;
      if (Math.abs(step) < BACKWARD_MIN_STEP) {
        step = -BACKWARD_MIN_STEP;
      }
      const next = Math.max(current + step, targetTime);
      video.currentTime = next;
      driveRaf = window.requestAnimationFrame(drive);
      return;
    }

    if (userActive) {
      if (diff > 0.001) {
        safePlay();
        if (Math.abs(video.playbackRate - 1) > 0.04) {
          video.playbackRate = 1;
        }
      } else {
        if (!video.paused) video.pause();
      }
      driveRaf = window.requestAnimationFrame(drive);
      return;
    }

    if (!video.paused) video.pause();
    if (video.playbackRate !== 1) video.playbackRate = 1;
    if (Math.abs(current - targetTime) > 0.01) {
      video.currentTime = targetTime;
    }
  };

  const ensureDriveRunning = () => {
    if (driveRaf) return;
    driveRaf = window.requestAnimationFrame(drive);
  };

  const onScroll = () => {
    scrollRaf = 0;
    if (!isReady || maxTime <= 0) return;
    targetTime = computeProgress() * maxTime;
    lastScrollAt = performance.now();
    ensureDriveRunning();
  };

  const requestScroll = () => {
    if (scrollRaf) return;
    scrollRaf = window.requestAnimationFrame(onScroll);
  };

  const onReady = () => {
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    if (isReady) return;
    maxTime = Math.max(duration - 0.05, 0);
    isReady = true;
    video.pause();
    video.currentTime = 0;
    targetTime = 0;
    lastScrollAt = performance.now();
    syncHeroScrollRange();
    onScroll();
    ensureDriveRunning();
  };

  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";

  const kick = video.play();
  if (kick && typeof kick.then === "function") {
    kick
      .then(() => {
        video.pause();
        if (video.readyState >= 1) onReady();
      })
      .catch(() => {
        if (video.readyState >= 1) onReady();
      });
  } else if (video.readyState >= 1) {
    onReady();
  }

  if (!isReady) {
    video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("loadeddata", onReady, { once: true });
  }

  video.addEventListener("ended", () => {
    if (!video.paused) video.pause();
  });

  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", () => {
    syncHeroScrollRange();
    requestScroll();
  });
  window.addEventListener("orientationchange", () => {
    syncHeroScrollRange();
    requestScroll();
  });
})();
