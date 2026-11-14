# Cardio Explorer

A responsive learning site about heart health, built with Vite, React (JavaScript) and React Router. It is built for middle and high school students; see [BRIEF.md](BRIEF.md) for the product brief and its four core features.

The layout, navigation and landing page are in place; each module page is a placeholder until its interactive feature is built.

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
    modules.js          The 4 core modules from BRIEF.md ← edit to change modules
    stats.js            Sourced statistics for the landing page banner
  components/
    layout/             Layout, Header (with mobile menu), Footer
    home/               Landing page sections: Hero, FeatureGrid, StatBanner
    ModuleCard.jsx      Module card (landing page and Modules page)
  views/                One file per page
    HomeView.jsx        /                 landing page: hero, feature grid, stats, footer
    ModulesView.jsx     /modules          all four modules
    ModuleView.jsx      /modules/:slug    one module (placeholder content)
    AboutView.jsx       /about
    NotFoundView.jsx    any unknown URL
  styles/global.css     Design tokens (colours, spacing) and all styles
public/                 Static files (favicon)
```

## Changing the modules

Every module is defined in `src/content/modules.js`. The landing page, the Modules page, each module page, the footer and the previous/next links all read from that list, so adding, removing or reordering an entry there updates the whole site.

## Branching workflow

- `main`: production-ready code only
- `test`: staging / QA
- `dev`: integration branch for all feature work
- Feature work goes on `feature/<feature-name>`, branched off `dev`
- Pull requests target `dev` and use [.github/pull_request_template.md](.github/pull_request_template.md)

## Note

The content is for education only and is not medical advice.
