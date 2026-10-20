# EnglishLab — Assignment 4: Introduction to JavaScript

**University:** Astana IT University (AITU)  
**Course:** Web Technologies 1  
**Team:** Anuarbek Mustafin and Feruza Zhasan  
**Group:** SE-2505

## Run the website
1. Unzip the complete project.
2. Open `index.html` in Chrome, Firefox or Edge; alternatively run a local HTTP server in this directory: `python -m http.server 8000`.
3. Open `http://localhost:8000/` if using the local server. All Bootstrap assets, CSS and JS are included locally. No downloads or backend are required.

## Assignment 4 features and code locations
| Task | Page | JavaScript function |
|---|---|---|
| 1. Form validation | `contact.html` | `initializeRegistration()` validates required name, email, 8-character password and confirmation; `initializeContact()` also validates the existing feedback form |
| 2. FAQ accordion | `learn.html` | `initializeFAQ()` toggles `aria-expanded` and `.is-open`; CSS grid animation produces smooth opening and closing |
| 3. Popup form | `index.html` | `initializePopup()` opens/closes a subscription dialog via buttons, background click, and Escape, with basic focus management |
| 4. Background color | `index.html` | `initializeBackgroundChanger()` cycles four theme colors by setting `--site-bg` on the body |
| 5. Date and time | `index.html` | `initializeClock()` uses `new Date()`, `Intl.DateTimeFormat` and `setInterval(..., 1000)` |

**All JavaScript is in `js/assignment4.js`, linked using `defer` in the HTML files.**

## Important limitation
Both registration and subscription/contact forms are front-end demonstrations of JavaScript validation. They **do not** create accounts, store credentials, send email or send information to a server. Do not use real passwords when demonstrating the form.

## Assignment progression
- Assignment 1: HTML and CSS fundamentals.
- Assignment 2: CSS Flexbox and CSS Grid (preserved in `gallery.html` and `grid-layout.html`).
- Assignment 3: CSS Media Queries and Bootstrap (preserved in the main site).
- Assignment 4: Vanilla JavaScript interactive features, without removing earlier work.

## Team contributions (Assignment 4)
- **Anuarbek Mustafin:** FAQ accordion on Learn, subscription popup, background switcher, and live clock on Dashboard.
- **Feruza Zhasan:** Registration/contact form validation and error messages on Contact, input tests.
- **Both:** code review, responsive testing, accessibility, report and final integration.

## Files
- `index.html` – Dashboard, background colors, clock, popup.
- `learn.html` – FAQ accordion and existing carousel.
- `contact.html` – validation forms.
- `js/assignment4.js` – original JavaScript logic for Tasks 1–5.
- `css/style.css` – original site design, media queries, and Task 2 animation.
- `vendor/bootstrap/` – locally bundled Bootstrap 5 files.

## Deploy to GitHub Pages
1. Commit/push the files (including the new `js/` folder) to the existing project repository.
2. Keep GitHub Pages configured for the correct branch/folder (usually `main` and `/root`).
3. Visit the project URL, refresh, and test all 5 tasks on the published site.
4. Put the verified, updated live URL in your LMS submission and final report.

**Existing project repository:** https://github.com/anuarbekkk/EnglishLab-Assignment  
**Existing GitHub Pages URL:** https://anuarbekkk.github.io/EnglishLab-Assignment/  
The local Assignment 4 files are complete, but publishing them to the repository is a separate step.
