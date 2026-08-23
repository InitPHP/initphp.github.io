# InitPHP.org — Astro Migration Design

**Date:** 2026-08-23
**Status:** Approved
**Repo:** `InitPHP/initphp.github.io` (serves https://initphp.org)

## 1. Problem

The site is a single hand-maintained `index.html` (1378 lines) with 770 lines of
inline CSS and 28 lines of inline JavaScript. Three problems follow from that shape:

1. **Repeated markup.** 27 library cards, 6 category cards, and 4 featured cards are
   written out by hand. Adding a library means editing markup in three places, and the
   hero copy plus the stats block both hard-code the number "27".
2. **Dead weight.** `assets/css/bootstrap.min.css`, `assets/js/bootstrap.bundle.min.js`,
   and all of `assets/img/` have zero references in `index.html`. `assets/fontawesome/`
   ships 13 MB and 2000+ files to serve 43 icons. The repository is ~16 MB.
3. **No build step.** There is no way to introduce components, type-checked data, or
   asset optimisation without a build pipeline.

## 2. Goal and non-goals

**Goal:** port the site to Astro with a byte-for-byte equivalent rendered result,
componentised markup, data-driven cards, and a Tailwind CSS v4 stylesheet, deployed
through GitHub Actions to GitHub Pages on the same domain.

**Non-goals** (explicitly out of scope for this migration):

- New pages, per-library detail pages, docs, or a blog.
- Internationalisation.
- Any change to visual design, copy, colours, spacing, or layout.
- Any change to the domain, DNS, or hosting provider.

## 3. Decisions

| Area | Decision | Rationale |
| --- | --- | --- |
| Framework | Astro 5, `output: 'static'` | Zero client JS by default; static HTML output matches the current hosting model. |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` | Chosen by the project owner over keeping hand-written CSS. In v4 the `@astrojs/tailwind` integration is no longer the supported path; the Vite plugin is. |
| Icons | `astro-icon` with `@iconify-json/fa6-solid` and `@iconify-json/fa6-brands` | Icons inline as SVG at build time. Removes 13 MB of webfonts and every icon network request, and eliminates icon-font FOUT. |
| Fonts | `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono` | Self-hosted, removing the two `fonts.googleapis.com` preconnects and the render-blocking stylesheet. |
| Deployment | GitHub Actions building to GitHub Pages | Keeps the existing repository and domain. Source stays at the repo root; the built `dist/` is published as a Pages artifact. |
| Sitemap / RSS | Not added | Single-page site; YAGNI. |

### 3.1 Known defect carried in

`fa-grid-2`, used on the hero's "Browse Libraries" button, is a FontAwesome **Pro**
icon. It is absent from the bundled free set, so it renders as nothing on the live
site today. It is likewise absent from the Iconify free FA6 sets. It will be replaced
with `fa6-solid:table-cells-large`. This is a bug fix, not a design change; all other
42 icons map one-to-one.

## 4. Target structure

```
.github/workflows/deploy.yml
astro.config.mjs
package.json
tsconfig.json
public/
  CNAME                     # "initphp.org" — copied verbatim to dist root
  license.txt               # linked from the footer as ./license.txt
  logos/
    initphp-icon-700.png
    initorm-icon.png
    initorm-icon-profile.png
    parameterbag.png
src/
  data/
    libraries.ts            # the 27 entries behind the "All Libraries" grid
    featured.ts             # the 4 featured cards
    categories.ts           # the 6 category cards
  styles/
    global.css              # @import "tailwindcss"; @theme tokens; custom utilities
  layouts/
    BaseLayout.astro        # <head>: title, meta, Open Graph, Twitter, canonical, JSON-LD
  components/
    Navbar.astro
    Hero.astro
    Stats.astro
    FeaturedCard.astro
    LibCard.astro
    CategoryCard.astro
    Install.astro
    Footer.astro
    ScrollTop.astro
  pages/
    index.astro
```

`astro.config.mjs` sets `site: 'https://initphp.org'` so that canonical and Open Graph
URLs resolve correctly. `base` stays at the default `/`.

## 5. Data model

Three modules under `src/data/`, each exporting a typed array. The page maps over them.

```ts
// src/data/libraries.ts
export interface Library {
  name: string;
  repo: string;
  icon: string;   // Iconify name, e.g. "fa6-solid:database"
  desc: string;
}

export const libraries: Library[] = [
  { name: 'Database', repo: 'https://github.com/InitPHP/Database',
    icon: 'fa6-solid:database', desc: 'DBAL, Data Mapper, Query Builder, ORM' },
  // ... 27 entries, in the order they appear on the current page
];
```

`featured.ts` adds `stars: number` and `tag: string` (e.g. `"PHP 8.1+"`) plus a `docs`
URL. `categories.ts` holds `{ icon, title, desc, items: { label, repo }[] }`.

The stats block derives its library count from `libraries.length` rather than the
hard-coded `27`, so the number cannot drift from the grid. The hero paragraph does the
same.

## 6. Styling

`src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg-primary: #0a0e17;
  --color-bg-secondary: #111827;
  --color-bg-card: #1a2236;
  --color-bg-card-hover: #1f2a42;
  --color-text-primary: #e2e8f0;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
  --color-accent: #7c6ef0;
  --color-accent-light: #9d91f5;
  --color-php-blue: #4f8cc9;
  --color-green: #34d399;
  --color-border: rgba(148, 163, 184, 0.1);
  --radius-card: 12px;
  --radius-chip: 8px;
  --breakpoint-xs: 30rem;
  --font-sans: 'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono Variable', 'Fira Code', ui-monospace, monospace;
}
```

Tailwind v4 generates `bg-bg-card`, `text-text-secondary`, `border-accent`, `font-mono`
and the rest from these tokens.

The two existing breakpoints map onto Tailwind's mobile-first model: the current
`@media (max-width: 768px)` block becomes the base styles with the desktop rules moved
behind `md:`, and `@media (max-width: 480px)` becomes the custom `xs` breakpoint
declared in the `@theme` block above.

Three rules do not express cleanly as utilities and stay as hand-written CSS in
`global.css`, declared with `@utility` so Tailwind still orders them correctly:

- `.hero::before` — the radial-gradient glow behind the hero.
- `.gradient-text` — a `background-clip: text` gradient on the headline span.
- `.category-list a::before` — the arrow marker on category list items.

Everything else (roughly 57 of the 60 rules) becomes utility classes on the components.

## 7. Client-side JavaScript

The 28 lines of inline script split into two component-scoped `<script>` blocks, which
Astro bundles and hashes:

- `Navbar.astro` — mobile menu toggle, `aria-expanded` sync, close-on-link-click.
- `ScrollTop.astro` — show the button past 400 px of scroll (passive listener), smooth
  scroll to top on click.

Behaviour is unchanged. No framework runtime is added; the page ships only these two
small scripts.

## 8. Deployment

`.github/workflows/deploy.yml`, triggered on push to `main` and on `workflow_dispatch`:

```
actions/checkout
actions/setup-node (Node 24, npm cache)
npm ci
npm run build
actions/upload-pages-artifact  (path: ./dist)
actions/deploy-pages
```

with `permissions: { contents: read, pages: write, id-token: write }` and a
`concurrency` group so overlapping pushes do not race.

**Manual step required from the repository owner, once:** in GitHub, *Settings →
Pages → Build and deployment → Source* must be switched from **Deploy from a branch**
to **GitHub Actions**. Until this is done the workflow will build but the site will
continue to serve the old branch contents. This cannot be automated from the codebase.

`public/CNAME` keeps `initphp.org` in the published artifact, so DNS and the custom
domain are untouched.

## 9. Removals

| Path | Size | Reason |
| --- | --- | --- |
| `assets/fontawesome/` | 13 MB | Replaced by build-time inline SVG. |
| `assets/css/` (Bootstrap) | 608 KB | Zero references in `index.html`. |
| `assets/js/` (Bootstrap) | 404 KB | Zero references in `index.html`. |
| `assets/img/` | 772 KB | Zero references in `index.html`. |
| `logos/index.html` | — | An empty placeholder page with only an `<h1>`. |
| `index.html` | 53 KB | Superseded by `src/pages/index.astro`. |

`.idea/` and `dist/` and `node_modules/` are added to `.gitignore`.

Expected repository size after migration: roughly 2 MB.

## 10. Verification

The migration is complete only when all of the following hold:

1. `npm run build` completes with no errors or warnings.
2. **Visual parity.** The pre-migration `index.html` and the built `dist/index.html`
   are screenshotted side by side at 1440 px, 768 px, and 375 px viewport widths and
   compared. Any difference other than the `fa-grid-2` fix is a defect to correct.
3. **Head parity.** `dist/index.html` contains the same `<title>`, description,
   keywords, author, robots, canonical, all seven Open Graph properties, all four
   Twitter Card properties, the favicon link, and the JSON-LD `Organization` block,
   with identical values.
4. **Link parity.** All 27 library links, 4 featured card link pairs, 6 category card
   lists, the "View All Repositories" link, the three footer social links, and the
   `./license.txt` link resolve to the same targets as before.
5. **Behaviour.** The mobile menu toggle and the scroll-to-top button work in a real
   browser at 375 px.

### Risk

Rewriting hand-tuned CSS as Tailwind utilities is the highest-risk part of this
migration; visual regression is the likely failure mode. Verification step 2 is the
control for it, and its screenshot comparison will be reviewed before the work is
considered done.
