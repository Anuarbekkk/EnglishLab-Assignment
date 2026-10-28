"use strict";

const practiceLessons = {
  items: [
    { title: "Present Simple", category: "grammar", level: "Beginner", minutes: 8, image: "images/grammar.svg", description: "Build clear sentences about everyday routines.", tip: "Use the base verb with I, you, we and they; add -s with he, she and it." },
    { title: "Past Tense", category: "grammar", level: "Intermediate", minutes: 12, image: "images/slide-grammar.svg", description: "Talk about events and experiences in the past.", tip: "Start with regular -ed verbs, then practise irregular past forms in complete sentences." },
    { title: "Travel Words", category: "vocabulary", level: "Beginner", minutes: 9, image: "images/vocabulary.svg", description: "Learn useful words for trips and airports.", tip: "Make a sentence using ticket, luggage, boarding pass, arrival and departure." },
    { title: "Work Vocabulary", category: "vocabulary", level: "Intermediate", minutes: 11, image: "images/slide-vocabulary.svg", description: "Use English more confidently at work.", tip: "Practise deadline, meeting, schedule and feedback in a short work dialogue." },
    { title: "Reading for Gist", category: "reading", level: "Beginner", minutes: 10, image: "images/reading.svg", description: "Identify the topic of a passage quickly.", tip: "Read the title and first line of every paragraph before examining details." },
    { title: "Reading for Detail", category: "reading", level: "Advanced", minutes: 15, image: "images/slide-reading.svg", description: "Find evidence and answer tricky questions.", tip: "Underline keywords from the question, then locate supporting words in the text." },
    { title: "Daily Conversation", category: "speaking", level: "Beginner", minutes: 7, image: "images/slide-speaking.svg", description: "Start conversations with natural expressions.", tip: "Try a short exchange about your day, then ask one follow-up question." },
    { title: "Fluent Answers", category: "speaking", level: "Advanced", minutes: 14, image: "images/slide-pronunciation.svg", description: "Organize answers with examples and reasons.", tip: "Respond using the structure: answer, reason, example, and conclusion." }
  ],
  getByCategory(category) {
    return category === "all" ? this.items : this.items.filter((lesson) => lesson.category === category);
  },
  totalMinutes() {
    return this.items.reduce((sum, lesson) => sum + lesson.minutes, 0);
  }
};

const practiceSound = { enabled: false, context: null, activeOscillator: null, lastAt: -1000 };

function playPracticeSound(force = false) {
  if (!practiceSound.enabled && !force) return;
  const time = performance.now();
  if (time - practiceSound.lastAt < 130) return;
  practiceSound.lastAt = time;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    if (!practiceSound.context) practiceSound.context = new AudioContextClass();
    const context = practiceSound.context;
    if (context.state === "suspended") context.resume().catch(() => {});
    if (practiceSound.activeOscillator) {
      try { practiceSound.activeOscillator.stop(); } catch (_) { }
    }
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    const start = context.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(660, start);
    oscillator.frequency.setValueAtTime(880, start + 0.075);
    volume.gain.setValueAtTime(0.0001, start);
    volume.gain.exponentialRampToValueAtTime(0.055, start + 0.012);
    volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.17);
    oscillator.connect(volume);
    volume.connect(context.destination);
    practiceSound.activeOscillator = oscillator;
    oscillator.onended = () => { if (practiceSound.activeOscillator === oscillator) practiceSound.activeOscillator = null; };
    oscillator.start(start);
    oscillator.stop(start + 0.18);
  } catch (_) { }
}

function initializeKeyboardMenu() {
  const selectors = [".navbar-nav > .nav-item > .nav-link", ".legacy-nav > li > a"];
  const links = Array.from(document.querySelectorAll(selectors.join(", ")));
  if (!links.length) return;
  links.forEach((link, index) => {
    link.addEventListener("keydown", (event) => {
      let nextIndex;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown": nextIndex = (index + 1) % links.length; break;
        case "ArrowLeft":
        case "ArrowUp": nextIndex = (index - 1 + links.length) % links.length; break;
        case "Home": nextIndex = 0; break;
        case "End": nextIndex = links.length - 1; break;
        default: return;
      }
      event.preventDefault();
      links[nextIndex].focus();
    });
  });
}

function getCategoryDescription(category) {
  switch (category) {
    case "grammar": return "Understand sentence patterns and become more accurate.";
    case "vocabulary": return "Learn useful expressions you can use every day.";
    case "reading": return "Read faster and support your answers with evidence.";
    case "speaking": return "Build confidence with short, practical conversations.";
    default: return "Browse all eight mini lessons and pick something new to learn.";
  }
}

function initializeLessonExplorer() {
  const grid = document.getElementById("a5LessonGrid");
  if (!grid) return;
  const filterButtons = Array.from(document.querySelectorAll(".a5-filter"));
  const count = document.getElementById("a5FilterCount");
  const copy = document.getElementById("a5CategoryDescription");
  const message = document.getElementById("a5LessonFeedback");
  const tip = document.getElementById("a5LessonTip");
  const title = document.getElementById("a5TipTitle");
  const tipText = document.getElementById("a5TipText");
  document.getElementById("a5LessonsCount").textContent = practiceLessons.items.length;

  function makeLessonCard(lesson) {
    const card = document.createElement("article");
    card.className = "a5-lesson";
    const image = document.createElement("img");
    image.className = "a5-lesson-img";
    image.src = lesson.image;
    image.alt = `${lesson.title} learning illustration`;
    const body = document.createElement("div");
    body.className = "a5-lesson-body";
    const meta = document.createElement("span");
    meta.className = "a5-lesson-meta";
    meta.textContent = `${lesson.category} · ${lesson.minutes} min`;
    const heading = document.createElement("h3");
    heading.textContent = lesson.title;
    const description = document.createElement("p");
    description.textContent = lesson.description;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-sm btn-outline-light";
    button.textContent = "Show study tip";
    button.addEventListener("click", () => {
      tip.hidden = false;
      title.textContent = `${lesson.title} · ${lesson.level}`;
      tipText.textContent = lesson.tip;
      message.textContent = `Opened a study tip for ${lesson.title}.`;
      playPracticeSound();
      tip.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    });
    body.append(meta, heading, description, button);
    card.append(image, body);
    return card;
  }

  function renderLessons(category) {
    const filtered = practiceLessons.getByCategory(category);
    grid.replaceChildren(...filtered.map(makeLessonCard));
    count.textContent = `${filtered.length} ${filtered.length === 1 ? "lesson" : "lessons"}`;
    copy.textContent = getCategoryDescription(category);
    tip.hidden = true;
    message.textContent = `Showing ${filtered.length} of ${practiceLessons.items.length} lessons · ${filtered.reduce((sum, lesson) => sum + lesson.minutes, 0)} total minutes.`;
    filterButtons.forEach((button) => {
      const selected = button.dataset.category === category;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderLessons(button.dataset.category);
      playPracticeSound();
    });
  });
  renderLessons("all");
}

function initializeImagePreview() {
  const image = document.getElementById("a5PreviewImage");
  if (!image) return;
  const caption = document.getElementById("a5PreviewCaption");
  const frame = document.getElementById("a5PreviewFrame");
  const choices = Array.from(document.querySelectorAll(".a5-thumbnail"));
  let animationTimer = null;
  choices.forEach((choice) => {
    choice.addEventListener("click", () => {
      window.clearTimeout(animationTimer);
      frame.classList.add("is-transitioning");
      image.setAttribute("src", choice.dataset.image);
      image.setAttribute("alt", choice.dataset.alt);
      caption.textContent = choice.dataset.caption;
      image.style.transform = "scale(0.94)";
      choices.forEach((button) => {
        const selected = button === choice;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      animationTimer = window.setTimeout(() => {
        frame.classList.remove("is-transitioning");
        image.style.transform = "";
      }, 190);
      playPracticeSound();
    });
  });
}

function initializeSessionRating() {
  const stars = Array.from(document.querySelectorAll("#a5RatingStars .a5-star"));
  if (!stars.length) return;
  const message = document.getElementById("a5RatingMessage");
  const ratings = { 1: "Keep going — every session counts!", 2: "Good start. You can build on this.", 3: "Nice progress!", 4: "Great work today!", 5: "Excellent session — well done!" };
  stars.forEach((button) => {
    button.addEventListener("click", () => {
      const rating = Number(button.dataset.rating);
      stars.forEach((star) => {
        const active = Number(star.dataset.rating) <= rating;
        star.classList.toggle("is-active", active);
        star.setAttribute("aria-pressed", String(Number(star.dataset.rating) === rating));
        star.style.color = active ? "#ffc855" : "";
        star.classList.remove("a5-pop");
      });
      void button.offsetWidth;
      button.classList.add("a5-pop");
      message.textContent = `${rating}/5 · ${ratings[rating]}`;
      playPracticeSound();
    });
  });
}

function initializeInstantTools() {
  const timeButton = document.getElementById("a5TimeButton");
  if (!timeButton) return;
  const message = document.getElementById("a5InstantMessage");
  const soundButton = document.getElementById("a5SoundButton");
  const soundToggle = document.getElementById("a5SoundToggle");
  const themeToggle = document.getElementById("a5ThemeToggle");
  const lab = document.querySelector(".a5-lab");
  timeButton.addEventListener("click", () => {
    message.textContent = `Current local time: ${new Date().toLocaleTimeString("en-US")}`;
    playPracticeSound();
  });
  soundButton.addEventListener("click", () => {
    message.textContent = "A short, original notification tone was triggered.";
    playPracticeSound(true);
  });
  soundToggle.addEventListener("click", () => {
    practiceSound.enabled = !practiceSound.enabled;
    soundToggle.textContent = `Sound: ${practiceSound.enabled ? "On" : "Off"}`;
    soundToggle.setAttribute("aria-pressed", String(practiceSound.enabled));
    if (practiceSound.enabled) playPracticeSound(true);
  });
  themeToggle.addEventListener("click", () => {
    const day = lab.classList.toggle("a5-day");
    themeToggle.setAttribute("aria-pressed", String(day));
    themeToggle.textContent = day ? "Switch to night mode" : "Switch to day mode";
    playPracticeSound();
  });
}

function initializeStudyPlanner() {
  const form = document.getElementById("a5PlannerForm");
  if (!form) return;
  const steps = Array.from(form.querySelectorAll(".a5-step"));
  const back = document.getElementById("a5BackButton");
  const next = document.getElementById("a5NextButton");
  const error = document.getElementById("a5PlannerError");
  const label = document.getElementById("a5StepLabel");
  const progress = document.getElementById("a5ProgressTrack");
  const fill = document.getElementById("a5ProgressFill");
  const result = document.getElementById("a5PlanResult");
  const summary = document.getElementById("a5PlanSummary");
  const restart = document.getElementById("a5RestartButton");
  const minutes = document.getElementById("a5StudyMinutes");
  const state = { step: 0, goal: "", level: "", minutes: 20 };

  function renderStep() {
    steps.forEach((element, index) => { element.hidden = index !== state.step; });
    label.textContent = `Step ${state.step + 1} of ${steps.length}`;
    progress.setAttribute("aria-valuenow", String(state.step + 1));
    fill.style.width = `${((state.step + 1) / steps.length) * 100}%`;
    back.disabled = state.step === 0;
    next.textContent = state.step === steps.length - 1 ? "Create my plan" : "Next step";
    error.textContent = "";
  }

  function validateCurrentStep() {
    if (state.step === 0) {
      const selected = form.querySelector('input[name="studyGoal"]:checked');
      if (!selected) return "Choose a study goal to continue.";
      state.goal = selected.value;
    }
    if (state.step === 1) {
      const selected = form.querySelector('input[name="studyLevel"]:checked');
      if (!selected) return "Choose your English level to continue.";
      state.level = selected.value;
    }
    if (state.step === 2) {
      const value = Number(minutes.value);
      if (!minutes.value.trim() || !Number.isInteger(value) || value < 10 || value > 90 || value % 5 !== 0) {
        return "Enter 10–90 minutes in steps of 5.";
      }
      state.minutes = value;
    }
    return "";
  }

  function changeStep(direction, callback) {
    if (direction > 0) {
      const warning = validateCurrentStep();
      if (warning) { error.textContent = warning; return; }
    }
    const target = state.step + direction;
    if (target < 0 || target >= steps.length) return;
    state.step = target;
    renderStep();
    if (typeof callback === "function") callback(state);
  }

  next.addEventListener("click", () => {
    if (state.step < steps.length - 1) {
      changeStep(1, () => playPracticeSound());
      return;
    }
    const warning = validateCurrentStep();
    if (warning) { error.textContent = warning; return; }
    summary.textContent = `${state.minutes} minutes of ${state.goal.toLowerCase()} practice per session · ${state.level} level. Start with a short lesson, then take the quiz and review your results.`;
    form.hidden = true;
    result.hidden = false;
    label.textContent = "Plan complete";
    progress.setAttribute("aria-valuenow", "3");
    fill.style.width = "100%";
    playPracticeSound();
    restart.focus();
  });
  back.addEventListener("click", () => changeStep(-1, () => playPracticeSound()));
  form.addEventListener("change", () => { error.textContent = ""; });
  minutes.addEventListener("input", () => { error.textContent = ""; });
  form.addEventListener("submit", (event) => event.preventDefault());
  restart.addEventListener("click", () => {
    form.reset();
    state.step = 0;
    state.goal = "";
    state.level = "";
    state.minutes = 20;
    form.hidden = false;
    result.hidden = true;
    renderStep();
    form.querySelector('input[name="studyGoal"]').focus();
  });
  renderStep();
}

initializeKeyboardMenu();
initializeLessonExplorer();
initializeImagePreview();
initializeSessionRating();
initializeInstantTools();
initializeStudyPlanner();
