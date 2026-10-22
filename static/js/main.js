document.addEventListener("DOMContentLoaded", () => {
  typewriteHero();
  setupNav();
  setupSectionDialogue();
  setupSkymap();
  setupContactForm();
  setupCertificates();
});


function typewriteHero() {
  const el = document.getElementById("heroTyped");
  if (!el) return;
  const full = "I'm " + (document.title.split(" — ")[0] || "");
  let i = 0;
  const speed = 45;
  (function tick() {
    if (i <= full.length) {
      el.textContent = full.slice(0, i);
      i++;
      setTimeout(tick, speed);
    }
  })();
}


function setupNav() {
  const links = document.querySelectorAll(".nav__links a");
  const sections = document.querySelectorAll(".section[id]");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.toggle("active", l.dataset.nav === entry.target.id));
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  sections.forEach((s) => obs.observe(s));
}


function setupSectionDialogue() {
  const sections = document.querySelectorAll(".section[data-context]");
  const seen = new Set();

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
          const ctx = entry.target.dataset.context;
          if (!seen.has(ctx)) {
            seen.add(ctx);
            Ada.say(ctx, { forceFetch: true });
          }
        }
      });
    },
    { threshold: [0.45] }
  );
  sections.forEach((s) => obs.observe(s));
}


function setupSkymap() {
  const stars = document.querySelectorAll(".star");
  const readoutText = document.getElementById("skillReadoutText");
  const readoutFill = document.getElementById("skillReadoutFill");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      stars.forEach((s) => s.classList.remove("is-active"));
      star.classList.add("is-active");
      const label = star.dataset.label;
      const level = star.dataset.level;
      const group = star.dataset.group;
      readoutText.textContent = `${label} (${group}) — ${level}% comfortable calling it a strength.`;
      readoutFill.style.width = `${level}%`;
    });
  });
}



function setupCertificates() {
  const cards = document.querySelectorAll(".achieve-card");
  const modal = document.getElementById("certificateModal");
  const modalContent = modal?.querySelector(".certificate-content");
  const certificateImage = document.getElementById("certificateImage");
  const closeButton = document.getElementById("closeCertificate");

  if (!cards.length || !modal || !modalContent ||
      !certificateImage || !closeButton) {
    return;
  }

  let activeCard = null;
  let previousFocus = null;
  let openTimer = null;
  let closeTimer = null;

  function openCertificate(card) {
    if (activeCard || openTimer !== null) return;

    const certificateUrl = card.dataset.certificate;

    if (!certificateUrl) {
      console.warn("Certificate file is missing for:", card);
      return;
    }

    activeCard = card;
    previousFocus = card;

    card.classList.add("is-flipped");

    openTimer = window.setTimeout(() => {
      certificateImage.src = certificateUrl;

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      modalContent.focus();
      openTimer = null;
    }, 450);
  }

  function closeCertificate() {
    if (!activeCard) return;

    if (openTimer !== null) {
      window.clearTimeout(openTimer);
      openTimer = null;
    }

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    const cardToRestore = activeCard;
    const focusTarget = previousFocus;

    cardToRestore.classList.remove("is-flipped");

    activeCard = null;
    previousFocus = null;

    if (closeTimer !== null) {
      window.clearTimeout(closeTimer);
    }

    closeTimer = window.setTimeout(() => {
      if (!modal.classList.contains("is-open")) {
        certificateImage.removeAttribute("src");
      }
      closeTimer = null;
    }, 300);

    if (focusTarget) {
      focusTarget.focus({ preventScroll: true });
    }
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      openCertificate(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCertificate(card);
      }
    });
  });

  closeButton.addEventListener("click", closeCertificate);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeCertificate();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeCard) {
      closeCertificate();
    }
  });
}




function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const status = document.getElementById("cf-status");
  const submitBtn = document.getElementById("cf-submit");

  const fields = ["name", "email", "message"];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    fields.forEach((f) => (document.getElementById(`err-${f}`).textContent = ""));
    status.textContent = "";

    const payload = {
      name: document.getElementById("cf-name").value,
      email: document.getElementById("cf-email").value,
      message: document.getElementById("cf-message").value,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        Object.entries(data.errors || {}).forEach(([field, msg]) => {
          const el = document.getElementById(`err-${field}`);
          if (el) el.textContent = msg;
        });
        status.textContent = "";
      } else {
        form.reset();
        status.textContent = data.reply;
        Ada.say("contact", { forceFetch: false, fallback: data.reply });
      }
    } catch (err) {
      status.textContent = "Something drifted off course — try again in a moment.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }
  });
}
