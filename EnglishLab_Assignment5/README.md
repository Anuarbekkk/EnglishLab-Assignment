# EnglishLab — Assignment 5: Advanced JavaScript and DOM Manipulation

**Course:** Web Technologies 1, Astana IT University  
**Team:** Anuarbek Mustafin and Feruza Zhasan  
**Group:** SE-2505  
**Existing website URL:** https://anuarbekkk.github.io/EnglishLab-Assignment/  
**Existing repository:** https://github.com/anuarbekkk/EnglishLab-Assignment

## How to run

Extract the ZIP. Open `index.html`, or use `python -m http.server 8000` in this directory and visit `http://localhost:8000/`. The new interactions are at **`practice-lab.html`** and can be reached from the top navigation or Dashboard. All images, CSS, JavaScript, and Bootstrap assets are local. No accounts, API keys, server, build tool, or internet connection is required.

## Assignment 5 implementation

| Requirement | Where | Demonstration |
|---|---|---|
| DOM selection and content changes | `practice-lab.html`, `js/assignment5.js` | Dynamically created lesson cards; live lesson counts, study tips, and rating feedback |
| Dynamic styles, Day/Night switch | `practice-lab.html`, `css/assignment5.css` | Focused lab theme toggle, animated rating colors, image scale, planner progress |
| Attribute manipulation | `practice-lab.html` | Gallery buttons change main image `src`, `alt`, and caption |
| Button event listener | `practice-lab.html` | `Show current time`, rating, filter, preview, and sound buttons |
| Keyboard navigation | All pages | Arrow keys and Home/End move focus across main menu links |
| Callback-based multi-step form | `practice-lab.html` | `changeStep(direction, callback)` navigates a 3-step study plan |
| Switch statements | `js/assignment5.js` | Category descriptions; keyboard navigation logic |
| Objects and methods | `js/assignment5.js` | `practiceLessons` contains data and `getByCategory`/`totalMinutes` methods |
| Arrays, loops and higher-order functions | `js/assignment5.js` | `filter`, `map`, `forEach`, `reduce`, plus iterable lesson rendering |
| Sound effects | `js/assignment5.js` | Short synthesized Web Audio tone on user click; does not overlap |
| Animations | `css/assignment5.css` | Selected-star animation, preview image transformation, card hover, progress fill |
| Separation of concerns | New HTML/CSS/JS files | Content, styling and interaction are in separate files |

**Optional design choices:** No remote APIs, no fake backend. Rating and study plan are front-end demonstrations; no personal information or credentials are transmitted. Sound is off by default and only plays after a user action. Reduced-motion preferences are respected by CSS.

## Preserved assignments

All eight original HTML pages and features from Assignments 1–4 remain present. `js/assignment4.js` remains connected and handles registration/contact validation, FAQ accordion, subscription popup, background themes, and live clock. CSS Grid and Flexbox demonstrations, Bootstrap carousel and Bootstrap Grid are preserved. `practice-lab.html` is the ninth page added for Assignment 5.

## Contributions

- **Anuarbek Mustafin:** Lesson catalog, filter controls with dynamic DOM generation, interactive image preview, switch-based category logic, responsive presentation.
- **Feruza Zhasan:** Accessible star rating, callback-driven multi-step study planner, original Web Audio feedback, test cases.
- **Both:** Keyboard navigation, integration with existing project, accessibility, report, review.

## Publish on GitHub Pages

Update the content of your existing repository (put `index.html`, `practice-lab.html`, `js/`, `css/`, `images/`, `vendor/` in the repository root), commit and push. Keep the existing Pages settings to retain the same URL. After deployment, **verify** `https://anuarbekkk.github.io/EnglishLab-Assignment/practice-lab.html` and re-test all interactions. Publication is a separate action; local ZIP files alone do not deploy the site.

## Submission

All team members submit the ZIP and Assignment 5 PDF report in Moodle. The report includes the team/group, task descriptions, code extracts, interface previews, publication URL and reflection. Complete the in-class defense; it is worth 40% of the grade.
