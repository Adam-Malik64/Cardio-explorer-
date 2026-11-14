# Heart Health Learning App — Project Context

## Overview
An interactive educational web application designed to teach students and general users about cardiovascular anatomy, heart health habits, and biometric indicators (such as heart rate and ECG basics).

## Branching & Workflow Rules
- `main`: Production-ready code only.
- `test`: Staging/QA testing branch.
- `dev`: Main integration branch for all feature work.
- Feature branches: Always branch off `dev` using the naming convention `feature/<feature-name>`.
- All Pull Requests must target `dev` first and use `.github/pull_request_template.md`.

## Coding Conventions
- Write clean, modular, accessible HTML/CSS/JavaScript.
- Use clear semantic markup and responsive layouts.
- Keep components self-contained and well-commented.

## Project notes
- Product brief (audience, the 4 core features, success metrics): `BRIEF.md`. Build features to match it.
- Stack: Vite + React (JavaScript/JSX) + React Router. Run with `npm run dev`, build with `npm run build`.
- The 4 core modules (matching BRIEF.md) are defined only in `src/content/modules.js`; landing-page stats (with sources) in `src/content/stats.js`.
- Simulated/demo data (never real patient data) lives in `src/mocks/`; every cited source lives once in `src/mocks/sources.js`. Module theme labels come from `themeLabels` in `src/content/modules.js`.
- Checks: `npm run lint` (ESLint), `npm test` (Vitest + React Testing Library + jest-axe, jsdom), `npm run build`.
- External links: use `src/components/ExternalLink.jsx` (new tab + screen-reader note).
- CI/CD: `.github/workflows/ci-cd.yml` runs lint, typecheck, test, build and a production `npm audit` on every PR/push to dev/test/main, then deploys to Netlify site `cardio-explorer-adam-malik` (dev → development alias, test → staging alias, main → production). Netlify settings, SPA fallback and security headers (strict CSP: no third-party scripts) are in `netlify.toml`; functions in `netlify/functions/` (only deployable files there; tests go in `netlify/`). Env vars are documented in `.env.example`; never commit real secrets.
- Pages live in `src/views/`, shared layout in `src/components/layout/`, all styles in `src/styles/global.css` (design tokens on `:root`).
