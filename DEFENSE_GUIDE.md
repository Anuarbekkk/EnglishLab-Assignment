# Assignment 4 — Quick Defense Guide (Anuarbek & Feruza, SE-2505)

## 30-second introduction (English)
“In Assignment 4 we used vanilla JavaScript to make EnglishLab interactive. We implemented form validation, an animated FAQ accordion, a subscription popup, a background color switcher, and a live clock. The logic is in `js/assignment4.js`, which is linked in HTML with `defer`. We kept the HTML, CSS, Bootstrap, Grid and Flexbox from our previous assignments. Every feature uses DOM elements and events, and the forms are local demonstrations, not a real registration service.”

## Which page shows each unique JavaScript task?
- `contact.html` — Task 1, form validation; `initializeRegistration()` and `initializeContact()`.
- `learn.html` — Task 2, accordion; `initializeFAQ()`.
- `index.html` — Task 3, popup; `initializePopup()`.
- `index.html` — Task 4, background color; `initializeBackgroundChanger()`.
- `index.html` — Task 5, clock; `initializeClock()`.
- `css/style.css` — FAQ transition and dialog styling.

## Common live coding requests (what you modify)

1. **Change minimum password length from 8 to 10:** In `js/assignment4.js` inside `initializeRegistration()`, change `password.value.length >= 8` to `>= 10`; in `contact.html` change `minlength="8"` to `minlength="10"` and update visible label/error text.
2. **Change the email error text:** In the `email` validator, replace the string “Enter a valid email address...”.
3. **Make the accordion open a different answer by default:** Add `.is-open` to the FAQ item, set button `aria-expanded="true"`, and set its panel `aria-hidden="false"`, remove `inert` (these attributes must agree).
4. **Change the FAQ transition speed:** In `css/style.css`, edit `.faq-answer` from `.32s` to `.6s`.
5. **Add an accordion question:** Copy one `.faq-item` in `learn.html`; assign **new** unique IDs on button and answer; ensure `aria-controls` references the new answer ID and `aria-labelledby` the new button ID.
6. **Close popup by pressing Escape:** Already implemented in the `keydown` listener inside `initializePopup()`; explain the condition `event.key === "Escape"`.
7. **Change which button opens popup:** Change the `id` in HTML AND corresponding `byId("openSubscribeBtn")` in the JS.
8. **Add another background color:** Add an entry to the `themes` array in `initializeBackgroundChanger()`; `themes.length` adjusts automatically.
9. **Change clock to 24-hour format:** Change `hour12: true` to `hour12: false` in `initializeClock()`.
10. **Update the clock every 5 seconds:** Change `window.setInterval(updateClock, 1000)` to `5000` (milliseconds).
11. **Change from click to mouseover:** Change `addEventListener("click", ...)` to `addEventListener("mouseover", ...)` only if explicitly requested.
12. **Why `event.preventDefault()`?** It stops the form's default submission/reload and lets JavaScript show validation feedback.
13. **Why `textContent`?** It inserts text safely without interpreting HTML.
14. **Why `const` vs `let`?** `const` prevents reassignment of a variable binding; `let` is used for the changing theme index.
15. **What is DOM?** The Document Object Model, the representation of page elements JavaScript can find and update.
16. **What is `addEventListener`?** It attaches a callback to an event, e.g. `click`, `submit`, `input` or `keydown`.
17. **Why `defer`?** The external script is downloaded without blocking HTML parsing and runs after the HTML is parsed.
18. **Difference between HTML required and JavaScript validation?** `required` is a browser hint/constraint; JavaScript adds custom conditions and shows task-specific messages.
19. **Why `new Date()`?** It retrieves the current local date/time from the browser environment.
20. **How is the accordion animated?** JavaScript adds `.is-open`; CSS transitions `grid-template-rows` from `0fr` to `1fr`.

## Demo sequence on practice lesson
1. Dashboard: show clock running and click “Change background color” twice.
2. Dashboard: open popup, type an invalid email, type a correct email, close with X/Escape/outside.
3. Learn: open and close at least two FAQ questions.
4. Contact: submit empty registration; enter incorrect email and unmatched passwords; then fix and submit successfully.
5. Show `js/assignment4.js` in VS Code. Explain the event listeners, variables, `if`, functions and DOM selectors.

## Important
The registration, contact and subscribe forms validate locally. No backend is connected. Do not claim the site sends emails or creates accounts. After pushing files to GitHub, confirm the live URL and test it.
