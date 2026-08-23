# initphp.org

Source for [initphp.org](https://initphp.org), built with [Astro](https://astro.build).

## Develop

```sh
npm install
npm run dev
```

## Styling conventions

- Use Tailwind utilities for simple layout and spacing on a component's outer
  elements.
- Write a scoped `<style>` rule for anything with more than about four
  declarations, or that deserves a name worth reading.
- Rules shared across multiple files go in `src/styles/global.css`, under
  `@layer components`.
- Never set the same property both ways on the same element. Astro's scoped
  styles are unlayered, so they beat both `@layer base` and Tailwind
  utilities — a utility and a scoped rule targeting the same property do not
  resolve by specificity the way you'd expect; pick one per property.

## Test

```sh
npm run build   # tests/parity.test.mjs reads dist/index.html
npm test
```

The suite has two parts:

- `tests/parity.test.mjs` compares the built `dist/index.html` against
  `tests/fixtures/baseline.html`, a frozen copy of the pre-Astro page, and fails on any
  change to its title, meta tags, canonical/favicon, JSON-LD, headings, anchors, images
  or rendered body text.
- `tests/data.test.mjs` checks `src/data/*.ts` directly, independently of the build —
  entry counts, required fields and their types, Iconify icon id format, that every
  repo URL is on github.com, and uniqueness of library names and repos.

## Deploy

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`. The custom domain comes from `public/CNAME`.
