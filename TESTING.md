# Browser testing summary — Assignment 4

Tested with Chromium using local source HTML, CSS, Bootstrap and JS. Because external and local navigation is restricted in the test environment, pages were fed into a Chromium DOM via `set_content` and the exact bundled styles and scripts were inserted in the same order; the same JavaScript code was executed and checked.

Result: **49/49 automated checks passed**. Checks covered live date and time, background cycling, subscription opening and closing via button/backdrop/Escape, modal focus, form errors (missing required fields, bad email, non-matching password), form success and reset, FAQ initial hidden state and toggling, JavaScript runtime errors, presence of team names in all eight footers, and responsive horizontal overflow on mobile-sized Dashboard, Learn and Contact pages.

**Deployment to GitHub Pages was not performed by this build.** After committing the project, retest the published pages in Chrome on desktop/mobile.

### Suggested manual checks after deployment
- Resize browser from 390px to 1440px; verify navbar and cards adapt.
- Open each FAQ and confirm keyboard activation (Enter/Space).
- Open popup, press Escape, and click outside it.
- Submit invalid, then valid example data to the registration form.
- Let clock run for at least 10 seconds; click background-color switch four times.
