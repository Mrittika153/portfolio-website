
const Ada = (() => {
  let adaEl, bubbleEl, bubbleTextEl, glowEl;
  let pupils = [];
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let glowPos = { x: mouse.x, y: mouse.y };
  let bubbleTimer = null;
  let talkTimer = null;
  let lastContext = null;

  function init() {
    adaEl = document.getElementById("nova");
    bubbleEl = document.getElementById("novaBubble");
    bubbleTextEl = document.getElementById("novaBubbleText");
    glowEl = document.getElementById("lanternGlow");
    pupils = document.querySelectorAll(".nova__pupil");

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    adaEl.addEventListener("click", onAdaClick);
    adaEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onAdaClick(); }
    });

    startBlinking();
    animateGlow();
    onScroll(); 
  }

  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    updateEyes(e.clientX, e.clientY);
  }

  function onTouchMove(e) {
    if (!e.touches || !e.touches[0]) return;
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }

  function updateEyes(mx, my) {
    if (!adaEl) return;
    const rect = adaEl.getBoundingClientRect();
    const originX = rect.left + rect.width * 0.5;
    const originY = rect.top + rect.height * 0.32;
    const dx = mx - originX;
    const dy = my - originY;
    const angle = Math.atan2(dy, dx);
    const dist = Math.min(2.4, Math.hypot(dx, dy) / 60);
    const ex = Math.cos(angle) * dist;
    const ey = Math.sin(angle) * dist;
    pupils.forEach((p) => {
      p.style.transform = `translate(${ex}px, ${ey}px)`;
    });
  }

  function animateGlow() {
    
    glowPos.x += (mouse.x - glowPos.x) * 0.12;
    glowPos.y += (mouse.y - glowPos.y) * 0.12;
    if (glowEl) {
      glowEl.style.transform = `translate(${glowPos.x}px, ${glowPos.y}px)`;
    }
    requestAnimationFrame(animateGlow);
  }

  function startBlinking() {
    const blink = () => {
      adaEl.classList.add("nova--blink");
      setTimeout(() => adaEl.classList.remove("nova--blink"), 140);
      const next = 2200 + Math.random() * 3200;
      setTimeout(blink, next);
    };
    setTimeout(blink, 1800);
  }

  function onScroll() {
    
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
    const minTop = 140;
    const maxTop = window.innerHeight - 340;
    const top = minTop + (maxTop - minTop) * Math.min(progress * 1.15, 1);
    adaEl.style.top = `${top}px`;
  }

  function onAdaClick() {
    say("click");
  }

  async function say(context, { forceFetch = true, fallback = null } = {}) {
    if (context === lastContext && !forceFetch) return;
    lastContext = context;
    try {
      const res = await fetch(`/api/dialogue?context=${encodeURIComponent(context)}`);
      const data = await res.json();
      showBubble(data.line || fallback || "...");
    } catch (err) {
      showBubble(fallback || "...");
    }
  }

  function showBubble(text) {
    if (!bubbleEl) return;
    clearTimeout(bubbleTimer);
    clearTimeout(talkTimer);

    bubbleTextEl.textContent = text;
    bubbleEl.classList.add("is-visible");
    adaEl.classList.add("nova--talking");

    const readTime = Math.max(2200, text.length * 55);
    talkTimer = setTimeout(() => adaEl.classList.remove("nova--talking"), Math.min(1800, readTime - 400));
    bubbleTimer = setTimeout(() => bubbleEl.classList.remove("is-visible"), readTime);
  }

  return { init, say };
})();

document.addEventListener("DOMContentLoaded", Ada.init);
