document.addEventListener("DOMContentLoaded", () => {
  const gate = document.getElementById("openingGate");
  const openButton = document.getElementById("openInvitation");
  const music = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicLabel = document.getElementById("musicLabel");

  let musicOn = false;

  async function tryStartMusic() {
    if (!music) return;
    try {
      music.volume = 0.45;
      await music.play();
      musicOn = true;
      if (musicLabel) musicLabel.textContent = "संगीत सुरू";
    } catch (e) {
      musicOn = false;
      if (musicLabel) musicLabel.textContent = "संगीत बंद";
    }
  }

  function openInvitation() {
    if (!gate || gate.classList.contains("opened")) return;

    gate.classList.add("opened");
    tryStartMusic();

    setTimeout(() => {
      document.body.classList.remove("intro-lock");
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 720);

    setTimeout(() => {
      gate.setAttribute("aria-hidden", "true");
    }, 1500);
  }

  if (openButton) openButton.addEventListener("click", openInvitation);

  if (gate) {
    gate.addEventListener("click", (e) => {
      if (e.target.closest(".seal-button")) return;
      openInvitation();
    });
  }

  if (musicToggle && music) {
    musicToggle.addEventListener("click", async () => {
      if (musicOn) {
        music.pause();
        musicOn = false;
        if (musicLabel) musicLabel.textContent = "संगीत बंद";
      } else {
        try {
          await music.play();
          musicOn = true;
          if (musicLabel) musicLabel.textContent = "संगीत सुरू";
        } catch (e) {
          console.log("Audio play blocked:", e);
        }
      }
    });
  }

  document.querySelectorAll(".scroll-cue").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.next);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
    });
  }, { threshold: 0.22 });

  reveals.forEach((el) => observer.observe(el));

  const depthLayers = document.querySelectorAll(".depth-layer");
  depthLayers.forEach((layer) => {
    layer.addEventListener("pointermove", (event) => {
      const rect = layer.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      layer.style.transform =
        `perspective(800px) rotateX(${y * -7}deg) rotateY(${x * 9}deg) translateZ(14px)`;
    });

    layer.addEventListener("pointerleave", () => {
      layer.style.transform =
        "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    });
  });

  // gold dust
  const dustLayer = document.getElementById("goldDustLayer");
  if (dustLayer) {
    for (let i = 0; i < 24; i++) {
      const dot = document.createElement("span");
      dot.className = "dust";
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * 8}s`;
      dot.style.animationDuration = `${7 + Math.random() * 7}s`;
      dot.style.opacity = `${0.12 + Math.random() * 0.34}`;
      dustLayer.appendChild(dot);
    }
  }

  const shareButton = document.getElementById("shareButton");
  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      const shareData = {
        title: "समाल परिवार | श्री गणेशोत्सव २०२६",
        text:
          "समाल परिवाराच्या घरी लाडक्या बाप्पाचे १४ सप्टेंबर २०२६ रोजी ५ दिवसांसाठी मंगल आगमन होत आहे. श्रींच्या दर्शनासाठी आपण कुटुंबियांसह आवर्जून उपस्थित राहावे.",
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(window.location.href);
          alert("निमंत्रणाची लिंक कॉपी झाली आहे.");
        } else {
          alert("कृपया वेबसाइटची लिंक कॉपी करून शेअर करा.");
        }
      } catch (error) {
        console.log("Share cancelled:", error);
      }
    });
  }
});
