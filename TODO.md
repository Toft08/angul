TODO Roadmap

Step 1: Setup

 * Initialize Angular app (ng new angul-it)

 * Add routing and basic navigation

 * Create core components (Home, Captcha, Result)

 * Create service placeholders (StateService, ChallengeService)

Step 2: Home Component

 * Build landing page with a "Start Challenge" button

 * On click → navigate to first challenge (/captcha)

 * Prepare state reset logic

Step 3: Captcha Component (Part 1)

 * Load first challenge from a JSON or service

 * Display image grid or question

 * Implement form validation (disable “Next” until valid)

 * Add navigation logic (Next, Previous)

Step 4: Captcha Component (Part 2)

 * Add multiple challenge types:

 * Image selection

 * Math question

 * Text input

 * Randomize challenge order

 * Implement progress tracking (via StateService)

 * Save progress in localStorage

Step 5: Result Component

 * Redirect to /result after last challenge

 * Display success message and results summary

 * Add “Start New Challenge” button

 * Restrict /result access unless all challenges complete

Step 6: UI & Animations

 * Add animations for transitions between challenges

 * Make layout responsive for mobile

 * Polish visuals using SCSS or Tailwind

Step 7: Testing & Bonus

 * Write unit tests for each component

 * Verify form validation, routing, and state persistence

 * Optimize localStorage handling

 * Final review & polish

Bonus Ideas

 * Add different challenge pools per session.

 * Animate challenge transitions with Angular Animations.

 * Add progress bar for user stages.

 * Support dark mode toggle.

 * Use service workers to persist state offline.

Testing Guidelines

Use Angular’s built-in testing tools:
``` bash
ng test
```

Ensure coverage for:

* Component creation

* Form validation logic

* State persistence and navigation

* Correct redirection to result page

Expected Outcome

By the end of the project:

* Users will complete interactive CAPTCHA stages.

* State will persist across refreshes.

* Final results will show success feedback.

* Codebase will be modular, tested, and maintainable.