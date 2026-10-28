
"use strict";

function byId(id) { return document.getElementById(id); }

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function setFieldError(input, errorId, message) {
  const error = byId(errorId);
  if (error) error.textContent = message;
  if (input) {
    input.classList.toggle("is-invalid", Boolean(message));
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }
}
function setFeedback(element, message, error = false) {
  if (!element) return;
  element.textContent = message;
  if (message) element.dataset.state = error ? "error" : "success";
  else delete element.dataset.state;
}

function initializeRegistration() {
  const form = byId("registerForm");
  if (!form) return;
  const name = byId("registerName");
  const email = byId("registerEmail");
  const password = byId("registerPassword");
  const confirm = byId("registerConfirm");
  const feedback = byId("registerFeedback");
  const fields = [
    [name, "registerNameError", () => name.value.trim().length >= 2 ? "" : "Enter your full name (at least 2 characters)."],
    [email, "registerEmailError", () => validEmail(email.value) ? "" : "Enter a valid email address, for example student@example.com."],
    [password, "registerPasswordError", () => password.value.length >= 8 ? "" : "Password must contain at least 8 characters."],
    [confirm, "registerConfirmError", () => !confirm.value ? "Please confirm your password." : confirm.value !== password.value ? "Passwords do not match." : ""]
  ];
  function validate(input, errorId, validator) {
    const message = validator();
    setFieldError(input, errorId, message);
    return !message;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalid = null;
    for (const [input, errorId, validator] of fields) {
      if (!validate(input, errorId, validator) && !firstInvalid) firstInvalid = input;
    }
    if (firstInvalid) {
      setFeedback(feedback, "Please correct the highlighted fields before submitting.", true);
      firstInvalid.focus();
    } else {
      setFeedback(feedback, "All fields are valid! Demo registration passed. No account was created or data sent.");
    }
  });
  for (const [input, errorId, validator] of fields) {
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") validate(input, errorId, validator);
      setFeedback(feedback, "");
      if (input === password && confirm.value) validate(confirm, "registerConfirmError", fields[3][2]);
    });
    input.addEventListener("blur", () => { if (input.value) validate(input, errorId, validator); });
  }
  form.addEventListener("reset", () => {
    for (const [input, errorId] of fields) setFieldError(input, errorId, "");
    setFeedback(feedback, "");
  });
}

function initializeContact() {
  const form = byId("contactForm");
  if (!form) return;
  const name = byId("name"), email = byId("email"), level = byId("level"), message = byId("message");
  const feedback = byId("contactFeedback");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const practiceSelected = Boolean(form.querySelector('input[name="practice"]:checked'));
    const okay = name.value.trim().length >= 2 && validEmail(email.value) && Boolean(level.value)
      && practiceSelected && message.value.trim().length >= 10;
    if (!okay) {
      setFeedback(feedback, "Please enter your name (2+ letters), a valid email, English level, a practice topic and a message (10+ characters).", true);
      const first = name.value.trim().length < 2 ? name : !validEmail(email.value) ? email : !level.value ? level
        : !practiceSelected ? form.querySelector('input[name="practice"]') : message;
      first.focus();
    } else {
      setFeedback(feedback, "Feedback validated successfully! This is a demo; no message was sent.");
    }
  });
  form.addEventListener("reset", () => setFeedback(feedback, ""));
  form.addEventListener("input", () => setFeedback(feedback, ""));
  form.addEventListener("change", () => setFeedback(feedback, ""));
}

function initializeFAQ() {
  document.querySelectorAll(".faq-question").forEach((button) => {
    const answer = byId(button.getAttribute("aria-controls"));
    if (!answer) return;
    button.addEventListener("click", () => {
      const opening = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(opening));
      answer.setAttribute("aria-hidden", String(!opening));
      answer.inert = !opening;
      button.closest(".faq-item").classList.toggle("is-open", opening);
    });
  });
}

function initializePopup() {
  const overlay = byId("subscribeOverlay");
  const open = byId("openSubscribeBtn");
  if (!overlay || !open) return;
  const close = byId("closeSubscribeBtn");
  const cancel = byId("cancelSubscribeBtn");
  const form = byId("subscribeForm");
  const email = byId("subscribeEmail");
  const feedback = byId("subscribeFeedback");
  let previousFocus = null;
  function openDialog() {
    previousFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("a4-dialog-open");
    setFeedback(feedback, "");
    setFieldError(email, "subscribeError", "");
    email.focus();
  }
  function closeDialog() {
    overlay.hidden = true;
    document.body.classList.remove("a4-dialog-open");
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }
  open.addEventListener("click", openDialog);
  close.addEventListener("click", closeDialog);
  cancel.addEventListener("click", closeDialog);
  overlay.addEventListener("click", (event) => { if (event.target === overlay) closeDialog(); });
  document.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;
    if (event.key === "Escape") { event.preventDefault(); closeDialog(); }
    if (event.key === "Tab") {
      const focusable = [...overlay.querySelectorAll('button:not([disabled]), input:not([disabled])')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validEmail(email.value)) {
      setFieldError(email, "subscribeError", "Please enter a valid email address.");
      setFeedback(feedback, "Please correct your email address.", true);
      email.focus();
    } else {
      setFieldError(email, "subscribeError", "");
      setFeedback(feedback, "Email format accepted! This is a demo: no subscription was sent.");
    }
  });
  email.addEventListener("input", () => {
    setFieldError(email, "subscribeError", "");
    setFeedback(feedback, "");
  });
}

function initializeBackgroundChanger() {
  const button = byId("changeBgBtn");
  if (!button) return;
  const status = byId("colorStatus");
  const themes = [
    { color: "#0a122b", name: "Midnight" },
    { color: "#182f40", name: "Ocean" },
    { color: "#30223f", name: "Violet" },
    { color: "#18382e", name: "Forest" }
  ];
  let index = 0;
  button.addEventListener("click", () => {
    index = (index + 1) % themes.length;
    document.body.style.setProperty("--site-bg", themes[index].color);
    if (status) status.textContent = `Theme ${index + 1} of ${themes.length} · ${themes[index].name}`;
  });
}

function initializeClock() {
  const clock = byId("liveClock");
  if (!clock) return;
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "long", day: "numeric", hour: "numeric",
    minute: "2-digit", second: "2-digit", hour12: true
  });
  function updateClock() { clock.textContent = formatter.format(new Date()); }
  updateClock();
  window.setInterval(updateClock, 1000);
}

initializeRegistration();
initializeContact();
initializeFAQ();
initializePopup();
initializeBackgroundChanger();
initializeClock();
