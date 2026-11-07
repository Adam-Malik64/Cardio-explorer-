# Cardio Explorer

A responsive learning site about heart health, built with Vite, React (JavaScript) and React Router. It teaches cardiovascular anatomy, heart health habits and biometric indicators such as heart rate and ECG basics.

This is the starter scaffold: the layout, navigation and placeholder pages are in place, and the lesson content and full landing page come next.

## Run it

```bash
npm install      # once
npm run dev      # start the dev server, then open the link it prints
npm run build    # build for production into dist/
```

## Folder structure

```
src/
  main.jsx              App entry: router + global styles
  App.jsx               Route table (all pages share the Layout)
  content/
    modules.js          Learning areas and modules ← edit this to change modules
  components/
    layout/             Layout, Header (with mobile menu), Footer
    ModuleCard.jsx      Card shown on the Modules page
  views/                One file per page
    HomeView.jsx        /                 simple shell (landing page to come)
    ModulesView.jsx     /modules          all modules, grouped by learning area
    ModuleView.jsx      /modules/:slug    one module (placeholder content)
    AboutView.jsx       /about
    NotFoundView.jsx    any unknown URL
  styles/global.css     Design tokens (colours, spacing) and all styles
public/                 Static files (favicon)
```

## Changing the modules

Every module is defined in `src/content/modules.js`. The Modules page, each module page and its previous/next links all read from that list, so adding, removing or reordering an entry there updates the whole site.

## Branching workflow

- `main`: production-ready code only
- `test`: staging / QA
- `dev`: integration branch for all feature work
- Feature work goes on `feature/<feature-name>`, branched off `dev`
- Pull requests target `dev` and use [.github/pull_request_template.md](.github/pull_request_template.md)

## Note

The content is for education only and is not medical advice.
