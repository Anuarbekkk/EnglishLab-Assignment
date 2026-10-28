# EnglishLab Assignment 5 — Defense Quick Guide

## Where to demonstrate

- `practice-lab.html`: every new interactive feature.
- `js/assignment5.js`: all new event listeners, DOM operations, data structures, and callbacks.
- `css/assignment5.css`: visuals, animation, responsive behavior, day/night appearance.
- Existing files stay in place: `js/assignment4.js` keeps the five Assignment 4 features.

## Short presentation (English)

Our EnglishLab Assignment 5 adds an interactive Practice Lab using vanilla JavaScript and DOM manipulation. We dynamically generate and filter eight mini lessons with an object, arrays, filter, map and forEach. A switch statement changes the category explanation. Users can select gallery thumbnails to update image attributes, rate their session with interactive stars, and create a three-step study plan. The planner uses event listeners and a callback to change steps without losing inputs. We added arrow-key navigation, original short feedback sounds using the Web Audio API, and CSS animations. HTML, CSS and JavaScript are separated. We preserved all features from the previous assignments.

## Common live changes

| Teacher asks | Where | Change |
|---|---|---|
| Add a ninth lesson | `practiceLessons.items` | Add a new lesson object with the same fields |
| Add a new lesson category | `getCategoryDescription`, HTML filters, items | Add a `case`, a button, and category objects |
| Show only reading lessons | `.a5-filter` or `renderLessons` | Set category to `reading` |
| Change lesson count | `renderLessons` | `count.textContent` uses `filtered.length` |
| Make rating stars blue | `initializeSessionRating` + CSS | Change `#ffc855` and `.a5-star.is-active` color |
| Change gallery photo | `data-image` in HTML | Choose another existing local image |
| Make preview animation slower | `.a5-preview-frame img` | Change transition duration `.38s` |
| Make navigation use Up/Down only | `initializeKeyboardMenu` | Modify `switch(event.key)` cases |
| Change minimum study session to 15 minutes | `validateCurrentStep` + HTML input | Change `10` and input `min`; update error/help text |
| Add a fourth planner step | HTML + `steps` and validation | Add fieldset and validation; the progress bar derives length |
| Make a sound quieter | `playPracticeSound` | Change gain peak `.055` to `.02` |
| Change sound frequency | `playPracticeSound` | Adjust the `660` / `880` Hz values |
| Turn sound off by default | `practiceSound.enabled` | Already `false` |
| Make day mode the default | `.a5-day` + button initial state | Add class and update button label/ARIA |
| Change current-time format | `initializeInstantTools` | Edit `toLocaleTimeString("en-US")` options |

## What the code means

`document.querySelectorAll` selects multiple elements; `getElementById` selects one. `textContent` changes displayed text. `setAttribute` updates attributes such as `src`, `alt`, `aria-pressed`. `classList.toggle` adds/removes classes. `addEventListener("click",...)` runs a callback when a button is clicked. `switch` chooses behavior by category or key. Arrays hold ordered lessons; `.filter` narrows data; `.map` converts data into DOM cards; `.forEach` attaches handlers; `.reduce` computes total minutes. `changeStep(direction, callback)` is an explicit function accepting another function. `AudioContext` produces original short sounds upon click; the gain is kept low and previous oscillators are stopped to prevent overlapping. The day-mode button toggles a class, while direct style changes demonstrate DOM styling.

## Practice demonstration order

1. Open Practice Lab and filter from All to Speaking, then open a study tip.
2. Click different thumbnails; explain `src`, `alt`, `textContent` updates.
3. Rate four stars; explain `querySelectorAll`, loops, style changes, ARIA.
4. Switch day/night and play a sound by clicking.
5. Complete study planner: Goal → Level → Minutes → Summary; show invalid minutes and Back preserving answers.
6. Put focus on the Dashboard navbar link and press ArrowRight and End.
7. Show previous Assignment 4 form and accordion still work.

## Honest limitations

The study planner, rating, form validation, and subscription are browser-side demonstrations only. They do not save profiles or send information to a server. Sound requires an audio-capable browser and a user gesture. This is expected for a static GitHub Pages site.
