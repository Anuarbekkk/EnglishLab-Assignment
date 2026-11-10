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
    // The three cards on Tests must launch the topic they advertise.
    // All modes reuse the same simple five-question HTML form.
    const topic = new URLSearchParams(window.location.search).get("topic");
    const quizType = topic === "vocabulary" || topic === "reading" ? topic : "grammar";
    const quizData = {
      grammar: { label: "grammar", answers: ["b", "b", "b", "b", "b"] },
      vocabulary: {
        label: "vocabulary", answers: ["a", "b", "c", "a", "b"],
        image: "images/study-vocabulary.jpg",
        questions: [
          ["1. Which word means a planned time to finish work?", "Deadline", "Holiday", "Journey", "Suggestion"],
          ["2. What is the opposite of ancient?", "Old", "Modern", "Past", "Distant"],
          ["3. Which phrase means improve?", "Forget", "Reduce", "Make better", "Hide"],
          ["4. Could you ___ this word?", "Explain", "Explained", "Explaining", "Explanation"],
          ["5. Which word is connected to travel?", "Pencil", "Luggage", "Sentence", "Deadline"]
        ]
      },
      reading: {
        label: "reading", answers: ["b", "c", "a", "d", "c"],
        image: "images/study-reading.jpg",
        passage: "Every Saturday, Mira visits the city library. She arrives at ten in the morning and chooses an English book. She usually studies for two hours. After reading, she writes five new words in a notebook. Mira wants to improve her vocabulary before her university exam.",
        questions: [
          ["1. Where does Mira go on Saturdays?", "A cafe", "The library", "A park", "A school"],
          ["2. What time does she arrive?", "Nine", "Eleven", "Ten", "Twelve"],
          ["3. How long does she usually study?", "Two hours", "One hour", "Three hours", "Four hours"],
          ["4. What does Mira do after reading?", "Listens to music", "Calls a friend", "Goes home", "Writes new words"],
          ["5. Why does Mira want to improve?", "A trip", "A new job", "A university exam", "A sports event"]
        ]
      }
    };
    const data = quizData[quizType];
    if (data.questions) {
      document.querySelector("#main-content h1").textContent =
        quizType === "reading" ? "Reading Quiz" : "Vocabulary Quiz";
      const banner = document.querySelector("#main-content .section-banner");
      if (banner) { banner.src = data.image; banner.alt = data.label + " practice illustration"; }
      const questions = form.querySelectorAll("fieldset.question");
      data.questions.forEach((question, index) => {
        if (!questions[index]) return;
        questions[index].querySelector("legend").textContent = question[0];
        questions[index].querySelectorAll(".option-text").forEach((option, i) => {
          option.textContent = question[i + 1];
        });
      });
      if (data.passage) {
        const passage = document.createElement("p");
        passage.className = "a6-reading-passage";
        passage.textContent = data.passage;
        form.before(passage);
      }
    }
    const answers = Object.fromEntries(data.answers.map((answer, i) => ["q" + (i + 1), answer]));
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
      remember("englishlab-last-quiz", JSON.stringify({ score, total: 5, topic: quizType }));
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
        const type = ["grammar", "vocabulary", "reading"].includes(result.topic) ? result.topic : "grammar";
        panel.querySelector("h2").textContent = `Your latest ${type} quiz`;
        panel.querySelector("a").href = type === "grammar" ? "quiz.html" : `quiz.html?topic=${type}`;
        panel.querySelector("strong").textContent = `${result.score}/5 correct`;
      }
    } catch (_) { /* Ignore corrupt saved data. */ }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeSite);
  else initializeSite();
})();
