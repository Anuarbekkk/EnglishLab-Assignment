"use strict";

// Common controls for all nine pages. No framework is needed for Assignment 5.
(function () {
  const THEME_KEY = "englishlab-theme";
  const SOUND_KEY = "englishlab-sound";
  function remember(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* Private browsing can block storage. */ }
  }
  function recall(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  let theme = recall(THEME_KEY) === "light" ? "light" : "dark";
  let soundEnabled = recall(SOUND_KEY) === "on";
  let audioContext = null;
  let lastSound = 0;
  document.documentElement.dataset.theme = theme;

  function updateControls() {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll(".a5-lab").forEach(lab => lab.classList.toggle("a5-day", theme === "light"));
    const themeButton = document.getElementById("siteThemeToggle");
    if (themeButton) {
      themeButton.textContent = theme === "dark" ? "☀ Day mode" : "☾ Night mode";
      themeButton.setAttribute("aria-pressed", String(theme === "light"));
    }
    const labTheme = document.getElementById("a5ThemeToggle");
    if (labTheme) {
      labTheme.textContent = theme === "dark" ? "Switch to day mode" : "Switch to night mode";
      labTheme.setAttribute("aria-pressed", String(theme === "light"));
    }
    const soundLabel = `Sound: ${soundEnabled ? "On" : "Off"}`;
    for (const id of ["siteSoundToggle", "a5SoundToggle"]) {
      const control = document.getElementById(id);
      if (control) {
        control.textContent = id === "siteSoundToggle" ? `♫ ${soundLabel}` : soundLabel;
        control.setAttribute("aria-pressed", String(soundEnabled));
      }
    }
  }

  function setTheme(next) {
    theme = next === "light" ? "light" : "dark";
    remember(THEME_KEY, theme);
    // A4's separate background-color demo must not override the chosen theme.
    document.body.style.removeProperty("--site-bg");
    updateControls();
    document.dispatchEvent(new CustomEvent("englishlab:settings", { detail: { theme, soundEnabled } }));
  }
  function setSound(enabled) {
    soundEnabled = Boolean(enabled);
    remember(SOUND_KEY, soundEnabled ? "on" : "off");
    updateControls();
    document.dispatchEvent(new CustomEvent("englishlab:settings", { detail: { theme, soundEnabled } }));
    if (soundEnabled) playSound();
  }

  function playSound(force = false) {
    if (!soundEnabled && !force) return;
    if (performance.now() - lastSound < 140) return; // Avoid overlapping clicks.
    lastSound = performance.now();
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    try {
      audioContext ||= new Context();
      if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(680, start);
      oscillator.frequency.setValueAtTime(850, start + 0.07);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.035, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.16);
    } catch (_) { /* Unsupported sound must never break the site. */ }
  }

  window.EnglishLabSite = {
    setTheme, setSound, playSound,
    toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    toggleSound: () => setSound(!soundEnabled),
    getTheme: () => theme,
    soundEnabled: () => soundEnabled
  };

  function initializeSite() {
    updateControls();
    document.getElementById("siteThemeToggle")?.addEventListener("click", () => {
      window.EnglishLabSite.toggleTheme();
      playSound();
    });
    document.getElementById("siteSoundToggle")?.addEventListener("click", () => window.EnglishLabSite.toggleSound());
    // Subtle sound feedback on links and buttons; works on every page.
    document.addEventListener("click", (event) => {
      const control = event.target.closest('a[href],button');
      if (control && !control.matches('#siteThemeToggle,#siteSoundToggle,#a5ThemeToggle,#a5SoundToggle,#a5SoundButton')) {
        playSound();
      }
    });
    initializeQuiz();
    showLatestQuiz();
  }

  function initializeQuiz() {
    const form = document.getElementById("grammarQuiz");
    if (!form) return;
    const answers = { q1: "b", q2: "b", q3: "b", q4: "b", q5: "b" };
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const selected = new FormData(form);
      const missing = Object.keys(answers).find(key => !selected.get(key));
      if (missing) {
        document.getElementById("quizFeedback").textContent = "Please answer all five questions.";
        form.querySelector(`input[name="${missing}"]`)?.focus();
        return;
      }
      let score = 0;
      Object.keys(answers).forEach(key => { if (selected.get(key) === answers[key]) score++; });
      remember("englishlab-last-quiz", JSON.stringify({ score, total: 5 }));
      document.getElementById("quizFeedback").textContent = `Your result: ${score}/5 correct. Open Results to review your score.`;
      document.getElementById("quizResultLink").hidden = false;
      playSound();
    });
  }

  function showLatestQuiz() {
    const panel = document.getElementById("latestQuizResult");
    if (!panel) return;
    try {
      const result = JSON.parse(recall("englishlab-last-quiz") || "null");
      if (result && Number.isInteger(result.score) && result.total === 5) {
        panel.hidden = false;
        panel.querySelector("strong").textContent = `${result.score}/5 correct`;
      }
    } catch (_) { /* Ignore corrupt saved data. */ }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeSite);
  else initializeSite();
})();
