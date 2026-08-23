# initphp.org

Source for [initphp.org](https://initphp.org), built with [Astro](https://astro.build).

## Develop

```sh
npm install
npm run dev
```

## Styling conventions

- Two approaches exist today, split by component rather than by rule
  complexity: `Navbar.astro` and `Hero.astro` put Tailwind utilities on
  their outer markup; the other seven components (`Stats`, `FeaturedCard`,
  `CategoryCard`, `LibCard`, `Footer`, `Install`, `ScrollTop`) and the page
  section shells in `index.astro` are scoped-CSS-only, even for
  one-declaration rules. The codebase is not uniform.
- For new sections, follow the majority pattern: a scoped `<style>` rule per
  component, named for what it styles. Reserve utilities for one-off
  arbitrary values on an element that doesn't need a named rule.
- Rules shared across multiple files go in `src/styles/global.css`, under
  `@layer components`.
- Never set the same property both ways on the same element. Astro's scoped
  styles are unlayered, so they beat both `@layer base` and Tailwind
  utilities — a utility and a scoped rule targeting the same property
  resolve by rule type, not by specificity the way you'd expect.
  `Hero.astro`'s utility padding (`pt-40 pb-24`) overridden by a scoped
  `@media` rule for mobile is the one deliberate use of that pattern here;
  keep it commented if you add another.

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
