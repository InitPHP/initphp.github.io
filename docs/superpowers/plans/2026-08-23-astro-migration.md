# InitPHP.org Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-maintained single-file `index.html` with an Astro 7 project that renders a byte-equivalent page, driven by typed data modules and Tailwind CSS 4, deployed to GitHub Pages by GitHub Actions.

**Architecture:** One static Astro page composed from nine components and three data modules. A snapshot-parity test harness extracts head metadata, links, headings and normalised body text from both the pre-migration HTML and the built output, and asserts they match — this is the red/green cycle the whole migration runs against. Visual equivalence is confirmed separately by screenshot comparison at three viewport widths.

**Tech Stack:** Astro 7.2.4, Tailwind CSS 4.3.3 (`@tailwindcss/vite`), astro-icon 1.2.0 + Iconify FA6 sets, Fontsource variable fonts, `node --test` + node-html-parser for the parity harness, GitHub Actions + GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-23-astro-migration-design.md`

## Global Constraints

- Astro **7.2.4**; `output: 'static'`; `site: 'https://initphp.org'`.
- **`compressHTML: true`** must be set in `astro.config.mjs`. Astro 7 defaults this to `'jsx'`, which strips newline-adjacent whitespace and would glue icons to their labels. Do not remove this setting.
- Node **>= 22.12.0** (Astro 7 `engines`). CI pins Node 24.
- Tailwind **4.3.3** via `@tailwindcss/vite`. Never install `@astrojs/tailwind` — it is the legacy Tailwind 3 path.
- astro-icon **1.2.0**, `@iconify-json/fa6-solid` **1.2.4**, `@iconify-json/fa6-brands` **1.2.6**.
- `@fontsource-variable/inter` **5.3.0**, `@fontsource-variable/jetbrains-mono` **5.3.0**.
- **No visual, copy, colour, spacing, or layout changes.** The only intentional rendered difference in the entire migration is replacing the FontAwesome Pro icon `fa-grid-2` (which renders as nothing today) with `fa6-solid:table-cells-large`.
- **Do not delete `assets/fontawesome/` until Task 4 has confirmed astro-icon works.** It is the fallback icon source.
- Library, featured and category content is authoritative in this plan's Task 5 code blocks. Do not re-derive it.
- No new pages, no i18n, no docs/blog, no sitemap.

## File Structure

| File | Responsibility |
| --- | --- |
| `package.json` | Dependencies and the `dev` / `build` / `preview` / `test` scripts. |
| `astro.config.mjs` | `site`, `output`, `compressHTML`, astro-icon integration, Tailwind Vite plugin. |
| `tsconfig.json` | Extends `astro/tsconfigs/strict`. |
| `tests/fixtures/baseline.html` | Frozen copy of the pre-migration page. The source of truth for every parity assertion and every CSS rule to be translated. |
| `tests/extract.mjs` | `extractSnapshot(html)` — turns an HTML string into a comparable, normalised snapshot object. No assertions. |
| `tests/parity.test.mjs` | Asserts `dist/index.html` matches `tests/fixtures/baseline.html` on head, links, headings and body text. |
| `tests/data.test.mjs` | Asserts the data modules have the expected shape and counts, and that every icon name is a resolvable Iconify id. |
| `src/data/libraries.ts` | The 27 entries behind the "All Libraries" grid. |
| `src/data/featured.ts` | The 6 featured cards. |
| `src/data/categories.ts` | The 6 category cards. |
| `src/styles/global.css` | `@import "tailwindcss"`, the `@theme` token block, and the four rules that cannot be utilities. |
| `src/layouts/BaseLayout.astro` | Everything inside `<head>`, plus `<body>` and the slot. |
| `src/components/Navbar.astro` | Fixed nav, brand, links, mobile toggle and its script. |
| `src/components/Hero.astro` | Badge, headline, description, two buttons. |
| `src/components/Stats.astro` | Three stat cards. |
| `src/components/FeaturedCard.astro` | One featured card. Props from `featured.ts`. |
| `src/components/CategoryCard.astro` | One category card. Props from `categories.ts`. |
| `src/components/LibCard.astro` | One library grid tile. Props from `libraries.ts`. |
| `src/components/Install.astro` | The terminal-styled Composer install box. |
| `src/components/Footer.astro` | Footer brand, copyright, three social links. |
| `src/components/ScrollTop.astro` | Scroll-to-top button and its script. |
| `src/pages/index.astro` | Composes the above; owns the section wrappers and section headers. |
| `public/CNAME`, `public/license.txt`, `public/logos/*` | Static files copied verbatim to the site root. |
| `.github/workflows/deploy.yml` | Build and publish to GitHub Pages. |

### CSS source map

Every Tailwind translation task points at a line range in `tests/fixtures/baseline.html`. That file is created in Task 1 and is a byte-for-byte copy of the current `index.html`, so these line numbers are stable for the whole migration.

| Rules | Location |
| --- | --- |
| Tokens & reset (`:root`, `*`, `html`, `body`, `a`) | `tests/fixtures/baseline.html:61-105` |
| Navbar | `tests/fixtures/baseline.html:110-201` |
| Hero | `tests/fixtures/baseline.html:201-314` |
| Stats | `tests/fixtures/baseline.html:314-349` |
| Section headers | `tests/fixtures/baseline.html:349-372` |
| Featured cards | `tests/fixtures/baseline.html:372-466` |
| Library grid | `tests/fixtures/baseline.html:466-522` |
| Categories | `tests/fixtures/baseline.html:522-600` |
| Install box | `tests/fixtures/baseline.html:600-656` |
| Footer | `tests/fixtures/baseline.html:656-704` |
| Responsive `@media` 768 / 480 | `tests/fixtures/baseline.html:704-786` |
| View-all & scroll-top | `tests/fixtures/baseline.html:786-839` |

### A note on translating CSS to Tailwind

For each component task the procedure is mechanical and identical:

1. Open the line range above and read every rule for the classes in that component.
2. For each declaration, write the equivalent Tailwind utility on the element. Where no utility exists, use an arbitrary value (`bg-[rgba(10,14,23,0.85)]`, `w-[44px]`).
3. The original stylesheet is **desktop-first**: the unprefixed rule is the desktop one and `@media (max-width: 768px)` / `@media (max-width: 480px)` blocks override it downward. **Mirror that structure exactly using Tailwind v4's `max-*` variants** — the desktop declaration stays unprefixed and the override becomes `max-md:` or `max-xs:`. Do **not** invert the stylesheet into mobile-first; inverting is the single most likely defect in this migration and buys nothing here.

   ```
   /* baseline */                          /* Tailwind */
   .stats-grid { grid-template-columns: repeat(3, 1fr) }   grid-cols-3
   @media (max-width: 768px) {
     .stats-grid { grid-template-columns: 1fr }            max-md:grid-cols-1
   }
   ```

   `max-md` is `< 48rem` and `max-xs` is `< 30rem`, against the baseline's `<= 768px` and `<= 480px`. The two differ only at exactly 768.00 and 480.00 CSS pixels. That is accepted.
4. Do not invent, round, or "improve" any value. Copy pixel and colour values exactly.

Correctness of the result is proved by Task 13's screenshot comparison, not by reading the classes.

---

### Task 1: Baseline snapshot and parity harness

Freeze the current page and build the test that every later task is measured against. At the end of this task the test suite exists and **fails**, because there is no build output yet.

**Files:**
- Create: `package.json`
- Create: `tests/fixtures/baseline.html`
- Create: `tests/extract.mjs`
- Create: `tests/parity.test.mjs`
- Create: `.gitignore` (modify existing)

**Interfaces:**
- Consumes: nothing.
- Produces: `extractSnapshot(html: string) => Snapshot` exported from `tests/extract.mjs`, where

  ```ts
  interface Snapshot {
    title: string;
    meta: Record<string, string>;      // name= or property= -> content
    canonical: string | null;
    icon: string | null;               // normalised href of <link rel="icon">
    jsonLd: unknown[];                 // parsed application/ld+json blocks
    anchors: { href: string; text: string }[];
    images: { src: string; alt: string }[];
    headings: { tag: string; text: string }[];
    text: string;                      // whole body, whitespace-normalised
  }
  ```

  Used by `tests/parity.test.mjs` in this task and unchanged thereafter.

- [ ] **Step 1: Freeze the baseline**

```bash
mkdir -p tests/fixtures
cp index.html tests/fixtures/baseline.html
```

Do not edit this file at any point in the migration.

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "initphp-org",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "node --test tests/"
  },
  "devDependencies": {
    "node-html-parser": "^9.0.1"
  }
}
```

- [ ] **Step 3: Install the parser**

```bash
npm install
```

- [ ] **Step 4: Write the extractor**

`tests/extract.mjs`:

```js
import { parse } from 'node-html-parser';

/**
 * Normalise an href/src so that the baseline's relative paths and Astro's
 * root-absolute paths compare equal. "logos/x.png", "./logos/x.png" and
 * "/logos/x.png" all become "logos/x.png". External URLs are untouched.
 */
function normPath(value) {
  if (!value) return value;
  if (/^[a-z]+:/i.test(value) || value.startsWith('#')) return value;
  return value.replace(/^\.?\//, '');
}

const norm = (s) => (s ?? '').replace(/\s+/g, ' ').trim();

export function extractSnapshot(html) {
  const root = parse(html, { blockTextElements: { script: true, style: true } });

  const meta = {};
  for (const el of root.querySelectorAll('meta')) {
    const key = el.getAttribute('name') ?? el.getAttribute('property');
    if (key) meta[key] = norm(el.getAttribute('content'));
  }

  const canonicalEl = root.querySelector('link[rel="canonical"]');
  const iconEl = root.querySelector('link[rel="icon"]');

  const jsonLd = root
    .querySelectorAll('script[type="application/ld+json"]')
    .map((el) => JSON.parse(el.rawText));

  // Strip everything that is not rendered content before reading text.
  for (const el of root.querySelectorAll('script, style, noscript')) el.remove();

  const body = root.querySelector('body');

  return {
    title: norm(root.querySelector('title')?.text),
    meta,
    canonical: canonicalEl ? normPath(canonicalEl.getAttribute('href')) : null,
    icon: iconEl ? normPath(iconEl.getAttribute('href')) : null,
    jsonLd,
    anchors: body.querySelectorAll('a').map((a) => ({
      href: normPath(a.getAttribute('href')),
      text: norm(a.text),
    })),
    images: body.querySelectorAll('img').map((img) => ({
      src: normPath(img.getAttribute('src')),
      alt: norm(img.getAttribute('alt')),
    })),
    headings: body.querySelectorAll('h1, h2, h3, h4').map((h) => ({
      tag: h.tagName.toLowerCase(),
      text: norm(h.text),
    })),
    text: norm(body.text),
  };
}
```

- [ ] **Step 5: Write the failing parity test**

`tests/parity.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { extractSnapshot } from './extract.mjs';

const baseline = extractSnapshot(
  readFileSync(new URL('./fixtures/baseline.html', import.meta.url), 'utf8'),
);

function built() {
  return extractSnapshot(
    readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8'),
  );
}

test('title matches', () => {
  assert.equal(built().title, baseline.title);
});

test('every baseline meta tag survives with the same content', () => {
  const b = built();
  for (const [key, value] of Object.entries(baseline.meta)) {
    assert.equal(b.meta[key], value, `meta "${key}" differs`);
  }
});

test('canonical and favicon match', () => {
  const b = built();
  assert.equal(b.canonical, baseline.canonical);
  assert.equal(b.icon, baseline.icon);
});

test('JSON-LD matches', () => {
  assert.deepEqual(built().jsonLd, baseline.jsonLd);
});

test('headings match in order and text', () => {
  assert.deepEqual(built().headings, baseline.headings);
});

test('anchors match in order, target and label', () => {
  assert.deepEqual(built().anchors, baseline.anchors);
});

test('images match', () => {
  assert.deepEqual(built().images, baseline.images);
});

test('rendered body text matches exactly', () => {
  assert.equal(built().text, baseline.text);
});
```

The last test is the strongest one in the suite. It catches missing content, reordered sections, dropped labels, and — critically — the Astro 7 JSX-whitespace regression described in the Global Constraints, because a glued `GitHubLibraries` would differ from `GitHub Libraries`.

- [ ] **Step 6: Run the suite and confirm it fails for the right reason**

Run: `npm test`
Expected: every test fails with `ENOENT ... dist/index.html`. If any test fails for a different reason, fix the harness before continuing.

- [ ] **Step 7: Update `.gitignore`**

Append to the existing `.gitignore`:

```gitignore
# Build
node_modules/
dist/
.astro/

# Editors
.idea/

# SDD workspace
.superpowers/
```

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .gitignore tests/
git commit -m "test: add HTML parity harness and freeze pre-migration baseline"
```

---

### Task 2: Astro 7 project skeleton

Stand up a buildable Astro project whose output is an empty page. The parity suite will still fail on content, but `dist/index.html` will now exist and the harness will start reporting real differences instead of `ENOENT`.

**Files:**
- Modify: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro`
- Create: `public/CNAME`, `public/license.txt`, `public/logos/*`

**Interfaces:**
- Consumes: `tests/parity.test.mjs` from Task 1.
- Produces: a working `npm run build` writing to `dist/`.

- [ ] **Step 1: Install Astro**

```bash
npm install astro@^7.2.4
```

Do not use `npm create astro` — it scaffolds a template over the existing directory. This project is assembled by hand so nothing is overwritten.

- [ ] **Step 2: Move static files into `public/`**

```bash
mkdir -p public/logos
git mv CNAME public/CNAME
git mv license.txt public/license.txt
git mv logos/initphp-icon-700.png public/logos/
git mv logos/initorm-icon.png public/logos/
git mv logos/initorm-icon-profile.png public/logos/
git mv logos/parameterbag.png public/logos/
git rm logos/index.html
rmdir logos 2>/dev/null || true
```

`public/CNAME` must still contain exactly `initphp.org` with no trailing newline changes — verify with `cat public/CNAME`. Losing it un-points the custom domain on the next deploy.

- [ ] **Step 3: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://initphp.org',
  output: 'static',
  // Astro 7 defaults compressHTML to 'jsx', which strips newline-adjacent
  // whitespace and would glue icons to their labels. Keep v6 behaviour.
  compressHTML: true,
});
```

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 5: Write a placeholder page**

`src/pages/index.astro`:

```astro
---
---

<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <title>InitPHP</title>
  </head>
  <body></body>
</html>
```

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: build succeeds, `dist/index.html` and `dist/CNAME` exist.

Run: `cat dist/CNAME`
Expected: `initphp.org`

- [ ] **Step 7: Run the parity suite**

Run: `npm test`
Expected: still failing, but now on content — e.g. `title matches` reports `'InitPHP' !== 'InitPHP - Open Source PHP Libraries & Components'`. No `ENOENT`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "build: scaffold Astro 7 project and move static assets to public/"
```

---

### Task 3: Tailwind 4 and the design tokens

Bring in Tailwind and port `:root` plus the global reset. Nothing renders differently yet — this task establishes the vocabulary the component tasks use.

**Files:**
- Modify: `package.json`, `astro.config.mjs`
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: the token names `bg-primary`, `bg-secondary`, `bg-card`, `bg-card-hover`, `text-primary`, `text-secondary`, `text-muted`, `accent`, `accent-light`, `php-blue`, `green`, `border` (usable as `bg-*`, `text-*`, `border-*`), the `xs` breakpoint, and the utilities `hero-glow`, `gradient-text`, `bullet-before`.

- [ ] **Step 1: Install Tailwind and the fonts**

```bash
npm install tailwindcss@^4.3.3 @tailwindcss/vite@^4.3.3
npm install @fontsource-variable/inter@^5.3.0 @fontsource-variable/jetbrains-mono@^5.3.0
```

Do **not** run `npx astro add tailwind`; it prompts interactively. The manual wiring below is what it would have produced.

- [ ] **Step 2: Register the Vite plugin**

Edit `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://initphp.org',
  output: 'static',
  // Astro 7 defaults compressHTML to 'jsx', which strips newline-adjacent
  // whitespace and would glue icons to their labels. Keep v6 behaviour.
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Write `src/styles/global.css`**

The token values are copied verbatim from `tests/fixtures/baseline.html:66-88`.

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
  --color-accent-glow: rgba(124, 110, 240, 0.15);
  --color-php-blue: #4f8cc9;
  --color-green: #34d399;
  --color-border: rgba(148, 163, 184, 0.1);

  --radius-card: 12px;
  --radius-chip: 8px;

  --breakpoint-xs: 30rem;

  --font-sans: 'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono Variable', 'Fira Code', ui-monospace, monospace;
}

/* --- global reset and base, from baseline.html:61-105 --- */
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--color-accent-light);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #c4bbfa;
}

/* --- rules with no utility equivalent --- */

/* Radial glow behind the hero. baseline.html:208-218 */
@utility hero-glow {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%);
    pointer-events: none;
  }
}

/* Gradient headline span. baseline.html:251-256 */
@utility gradient-text {
  background: linear-gradient(
    135deg,
    var(--color-accent-light) 0%,
    var(--color-php-blue) 50%,
    var(--color-green) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Dot marker on category list links. baseline.html:584-591 */
@utility bullet-before {
  &::before {
    content: '';
    width: 4px;
    height: 4px;
    background: var(--color-accent);
    border-radius: 50%;
    flex-shrink: 0;
  }
}
```

The three `@utility` blocks above transcribe the original declarations. **Before writing them, open each cited line range and confirm the values match** — if the baseline differs from what is written here, the baseline wins and this file must be corrected.

- [ ] **Step 4: Import the stylesheet and fonts from the page**

`src/pages/index.astro` frontmatter:

```astro
---
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '../styles/global.css';
---
```

- [ ] **Step 5: Build and confirm Tailwind is wired up**

Run: `npm run build`
Expected: build succeeds, and `dist/_astro/` contains a `.css` file.

Run: `grep -c "font-family" dist/_astro/*.css`
Expected: a non-zero count (the Fontsource `@font-face` rules and the base rules are present).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "build: add Tailwind 4 with design tokens and self-hosted fonts"
```

---

### Task 4: Icons

Wire up astro-icon and settle icon sizing before any component depends on it. This task also decides whether the primary or the fallback icon strategy is used, so it must complete before `assets/fontawesome/` is deleted in Task 14.

**Files:**
- Modify: `package.json`, `astro.config.mjs`, `src/styles/global.css`
- Modify: `src/pages/index.astro` (temporary probe, removed at the end of the task)

**Interfaces:**
- Produces: `<Icon name="..." />` from `astro-icon/components`, and the `[data-icon]` sizing rule that every later component relies on.

- [ ] **Step 1: Install**

```bash
npm install astro-icon@^1.2.0
npm install -D @iconify-json/fa6-solid@^1.2.4 @iconify-json/fa6-brands@^1.2.6
```

- [ ] **Step 2: Register the integration**

Add to `astro.config.mjs`:

```js
import icon from 'astro-icon';
```

and inside `defineConfig`:

```js
  integrations: [icon()],
```

- [ ] **Step 3: Add a temporary probe to the page body**

In `src/pages/index.astro`, import the component and render two icons with different aspect ratios:

```astro
---
import { Icon } from 'astro-icon/components';
---
<p>x<Icon name="fa6-brands:github" />x<Icon name="fa6-solid:database" />x</p>
```

- [ ] **Step 4: Build and inspect what astro-icon actually emits**

Run: `npm run build && grep -o '<svg[^>]*>' dist/index.html`

Expected: two inline `<svg>` elements, each carrying `data-icon` and a `viewBox`. Record the `width` and `height` attributes emitted.

**This is the compatibility gate for astro-icon under Astro 7 / Vite 8.** If the build fails or emits no SVG, stop and switch to the fallback:

```bash
mkdir -p src/icons
# copy only the icons the site uses, out of the FontAwesome free set
# that is still present in the repo at this point
cp assets/fontawesome/svgs/solid/database.svg src/icons/
cp assets/fontawesome/svgs/brands/github.svg src/icons/
# ...one per icon in the Task 5 data; astro-icon then resolves them by
# bare filename: <Icon name="database" />
```

Record in the commit message which strategy was taken; everything downstream is otherwise identical.

- [ ] **Step 5: Add the sizing rule**

FontAwesome `<i>` glyphs inherit their size from `font-size` and sit on the text baseline. Inline SVG does neither by default. Append to `src/styles/global.css`:

```css
/* FontAwesome <i> glyphs sized themselves from font-size and sat on the
   baseline. Reproduce that for inline SVG. height:1em with width:auto
   preserves each icon's own aspect ratio — do not set both to 1em, that
   squashes the non-square icons. */
[data-icon] {
  display: inline-block;
  height: 1em;
  width: auto;
  vertical-align: -0.125em;
}
```

- [ ] **Step 6: Rebuild and confirm aspect ratios are not forced square**

Run: `npm run build && grep -o '<svg[^>]*viewBox="[^"]*"' dist/index.html`
Expected: the two icons report different `viewBox` values (FA's `github` and `database` have different widths). Confirm the CSS does not override both dimensions.

- [ ] **Step 7: Remove the probe**

Delete the probe `<p>` and the `Icon` import from `src/pages/index.astro`, leaving the frontmatter imports from Task 3.

Run: `npm run build`
Expected: succeeds; `dist/index.html` contains no `<svg>`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "build: add astro-icon with Iconify FA6 sets and baseline icon sizing"
```

---

### Task 5: Data modules

Move all repeated content out of markup and into three typed modules. The counts asserted here are the counts the rendered page must have.

**Files:**
- Create: `src/data/libraries.ts`, `src/data/featured.ts`, `src/data/categories.ts`
- Create: `tests/data.test.mjs`

**Interfaces:**
- Produces:
  ```ts
  // src/data/libraries.ts
  export interface Library { name: string; repo: string; icon: string; desc: string }
  export const libraries: Library[]            // length 27

  // src/data/featured.ts
  export interface Featured { name: string; stars: number; tag: string; desc: string; code: string; docs: string }
  export const featured: Featured[]            // length 6

  // src/data/categories.ts
  export interface CategoryItem { label: string; repo: string }
  export interface Category { icon: string; title: string; desc: string; items: CategoryItem[] }
  export const categories: Category[]          // length 6
  ```
  Tasks 9, 10 and 11 consume these exact names.

- [ ] **Step 1: Write the failing data test**

`tests/data.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

test('libraries.ts declares 27 entries', () => {
  const src = read('../src/data/libraries.ts');
  assert.equal((src.match(/\{ name: /g) ?? []).length, 27);
});

test('featured.ts declares 6 entries', () => {
  const src = read('../src/data/featured.ts');
  assert.equal((src.match(/^\s{4}name: /gm) ?? []).length, 6);
});

test('categories.ts declares 6 entries with 27 links total', () => {
  const src = read('../src/data/categories.ts');
  assert.equal((src.match(/^\s{4}title: /gm) ?? []).length, 6);
  assert.equal((src.match(/\{ label: /g) ?? []).length, 27);
});

test('every icon id is a namespaced Iconify name', () => {
  for (const file of ['../src/data/libraries.ts', '../src/data/categories.ts']) {
    for (const [, id] of read(file).matchAll(/icon: '([^']+)'/g)) {
      assert.match(id, /^fa6-(solid|brands|regular):[a-z0-9-]+$/, `bad icon id "${id}" in ${file}`);
    }
  }
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm test -- --test-name-pattern="declares|Iconify"`
Expected: FAIL with `ENOENT ... src/data/libraries.ts`.

- [ ] **Step 3: Write `src/data/libraries.ts`**

```ts
export interface Library {
  name: string;
  repo: string;
  icon: string;
  desc: string;
}

export const libraries: Library[] = [
  { name: 'Database', repo: 'https://github.com/InitPHP/Database', icon: 'fa6-solid:database', desc: 'DBAL, Data Mapper, Query Builder, ORM' },
  { name: 'Router', repo: 'https://github.com/InitPHP/Router', icon: 'fa6-solid:route', desc: 'Advanced HTTP routing library' },
  { name: 'Socket', repo: 'https://github.com/InitPHP/Socket', icon: 'fa6-solid:plug', desc: 'TCP, TLS, UDP, SSL Server/Client' },
  { name: 'Events', repo: 'https://github.com/InitPHP/Events', icon: 'fa6-solid:bolt', desc: 'Event hooks for extensible architecture' },
  { name: 'FiberLoops', repo: 'https://github.com/InitPHP/FiberLoops', icon: 'fa6-solid:arrows-spin', desc: 'Async-style PHP Fiber loops' },
  { name: 'Cache', repo: 'https://github.com/InitPHP/Cache', icon: 'fa6-solid:box-archive', desc: 'PSR-16 Simple Cache interface' },
  { name: 'Encryption', repo: 'https://github.com/InitPHP/Encryption', icon: 'fa6-solid:lock', desc: 'OpenSSL & Sodium encryption' },
  { name: 'Validation', repo: 'https://github.com/InitPHP/Validation', icon: 'fa6-solid:check-double', desc: 'Data type & structure verification' },
  { name: 'Translator', repo: 'https://github.com/InitPHP/Translator', icon: 'fa6-solid:language', desc: 'Multi-language support' },
  { name: 'Mailer', repo: 'https://github.com/InitPHP/Mailer', icon: 'fa6-solid:envelope', desc: 'Simple SMTP mail sending' },
  { name: 'Logger', repo: 'https://github.com/InitPHP/Logger', icon: 'fa6-solid:file-lines', desc: 'PSR-3 logging to file or database' },
  { name: 'HTTP', repo: 'https://github.com/InitPHP/HTTP', icon: 'fa6-solid:globe', desc: 'PSR-7 & PSR-17 HTTP Messages' },
  { name: 'Config', repo: 'https://github.com/InitPHP/Config', icon: 'fa6-solid:sliders', desc: 'Configuration file management' },
  { name: 'DotENV', repo: 'https://github.com/InitPHP/DotENV', icon: 'fa6-solid:file-code', desc: 'Load .env environment variables' },
  { name: 'Container', repo: 'https://github.com/InitPHP/Container', icon: 'fa6-solid:cube', desc: 'PSR-11 dependency injection' },
  { name: 'Escaper', repo: 'https://github.com/InitPHP/Escaper', icon: 'fa6-solid:shield', desc: 'HTML, JS, CSS, URL escaping' },
  { name: 'Console', repo: 'https://github.com/InitPHP/Console', icon: 'fa6-solid:terminal', desc: 'CLI application helper' },
  { name: 'Auth', repo: 'https://github.com/InitPHP/Auth', icon: 'fa6-solid:user-shield', desc: 'Authorization library' },
  { name: 'Sessions', repo: 'https://github.com/InitPHP/Sessions', icon: 'fa6-solid:key', desc: 'Session management' },
  { name: 'Cookies', repo: 'https://github.com/InitPHP/Cookies', icon: 'fa6-solid:cookie-bite', desc: 'Secure signed cookies' },
  { name: 'ParameterBag', repo: 'https://github.com/InitPHP/ParameterBag', icon: 'fa6-solid:bag-shopping', desc: 'Key-value data storage' },
  { name: 'Input', repo: 'https://github.com/InitPHP/Input', icon: 'fa6-solid:keyboard', desc: 'User input retrieval & validation' },
  { name: 'PerformanceMeter', repo: 'https://github.com/InitPHP/PerformanceMeter', icon: 'fa6-solid:gauge-high', desc: 'Runtime benchmarking' },
  { name: 'Barbarian', repo: 'https://github.com/InitPHP/Barbarian', icon: 'fa6-solid:arrow-up-from-bracket', desc: 'Database migration library' },
  { name: 'Upload', repo: 'https://github.com/InitPHP/Upload', icon: 'fa6-solid:cloud-arrow-up', desc: 'File upload to local/remote' },
  { name: 'Views', repo: 'https://github.com/InitPHP/Views', icon: 'fa6-solid:eye', desc: 'View/template rendering' },
  { name: 'Queue', repo: 'https://github.com/InitPHP/Queue', icon: 'fa6-solid:list-check', desc: 'Job queue management' },
];
```

- [ ] **Step 4: Write `src/data/featured.ts`**

```ts
export interface Featured {
  name: string;
  stars: number;
  tag: string;
  desc: string;
  code: string;
  docs: string;
}

export const featured: Featured[] = [
  {
    name: 'Socket',
    stars: 10,
    tag: 'PHP 8.1+',
    desc: 'PHP Socket (TCP, TLS, UDP, SSL) Server/Client Library. Build real-time applications with low-level network communication.',
    code: 'https://github.com/InitPHP/Socket',
    docs: 'https://github.com/InitPHP/Socket/wiki',
  },
  {
    name: 'Database',
    stars: 6,
    tag: 'PHP 8.1+',
    desc: 'QueryBuilder, DBAL and ORM facade built on the InitORM stack, plus a server-side DataTables.js helper for paginated, searchable tables.',
    code: 'https://github.com/InitPHP/Database',
    docs: 'https://github.com/InitPHP/Database/wiki',
  },
  {
    name: 'Events',
    stars: 6,
    tag: 'PHP 5.6+',
    desc: 'Powerful event & hook system to plug into your application flow. Now bundles the EventEmitter primitive for building extensible, plugin-based architectures.',
    code: 'https://github.com/InitPHP/Events',
    docs: 'https://github.com/InitPHP/Events/wiki',
  },
  {
    name: 'FiberLoops',
    stars: 6,
    tag: 'PHP 8.1+',
    desc: 'Async-style concurrent programming with PHP Fibers. Run multiple tasks cooperatively without threads.',
    code: 'https://github.com/InitPHP/FiberLoops',
    docs: 'https://github.com/InitPHP/FiberLoops/wiki',
  },
  {
    name: 'Router',
    stars: 3,
    tag: 'PHP 8.1+',
    desc: 'Create and manage advanced routes for HTTP requests with groups, middleware, and named routes.',
    code: 'https://github.com/InitPHP/Router',
    docs: 'https://github.com/InitPHP/Router/wiki',
  },
  {
    name: 'Translator',
    stars: 3,
    tag: 'PHP 8.1+',
    desc: 'Micro library to add multi-language support to your projects. Lightweight and easy to integrate.',
    code: 'https://github.com/InitPHP/Translator',
    docs: 'https://github.com/InitPHP/Translator/wiki',
  },
];
```

- [ ] **Step 5: Write `src/data/categories.ts`**

```ts
export interface CategoryItem {
  label: string;
  repo: string;
}

export interface Category {
  icon: string;
  title: string;
  desc: string;
  items: CategoryItem[];
}

export const categories: Category[] = [
  {
    icon: 'fa6-solid:database',
    title: 'Database & Storage',
    desc: 'ORM, query building, caching, queues, and data persistence.',
    items: [
      { label: 'Database', repo: 'https://github.com/InitPHP/Database' },
      { label: 'Cache', repo: 'https://github.com/InitPHP/Cache' },
      { label: 'Barbarian (Migrations)', repo: 'https://github.com/InitPHP/Barbarian' },
      { label: 'Queue (Jobs)', repo: 'https://github.com/InitPHP/Queue' },
    ],
  },
  {
    icon: 'fa6-solid:route',
    title: 'HTTP & Routing',
    desc: 'Routing, request & response handling, PSR-7/17 messages, uploads, and views.',
    items: [
      { label: 'Router', repo: 'https://github.com/InitPHP/Router' },
      { label: 'HTTP (PSR-7/17)', repo: 'https://github.com/InitPHP/HTTP' },
      { label: 'Upload', repo: 'https://github.com/InitPHP/Upload' },
      { label: 'Views', repo: 'https://github.com/InitPHP/Views' },
    ],
  },
  {
    icon: 'fa6-solid:shield-halved',
    title: 'Security',
    desc: 'Encryption, escaping, validation, and authentication utilities.',
    items: [
      { label: 'Encryption', repo: 'https://github.com/InitPHP/Encryption' },
      { label: 'Escaper', repo: 'https://github.com/InitPHP/Escaper' },
      { label: 'Validation', repo: 'https://github.com/InitPHP/Validation' },
      { label: 'Auth', repo: 'https://github.com/InitPHP/Auth' },
      { label: 'Input', repo: 'https://github.com/InitPHP/Input' },
    ],
  },
  {
    icon: 'fa6-solid:network-wired',
    title: 'Networking',
    desc: 'TCP/UDP sockets, mail sending, and real-time communication.',
    items: [
      { label: 'Socket', repo: 'https://github.com/InitPHP/Socket' },
      { label: 'Mailer', repo: 'https://github.com/InitPHP/Mailer' },
      { label: 'FiberLoops', repo: 'https://github.com/InitPHP/FiberLoops' },
    ],
  },
  {
    icon: 'fa6-solid:gear',
    title: 'Configuration',
    desc: 'Environment, config management, sessions, and cookies.',
    items: [
      { label: 'Config', repo: 'https://github.com/InitPHP/Config' },
      { label: 'DotENV', repo: 'https://github.com/InitPHP/DotENV' },
      { label: 'Sessions', repo: 'https://github.com/InitPHP/Sessions' },
      { label: 'Cookies', repo: 'https://github.com/InitPHP/Cookies' },
      { label: 'Container (PSR-11)', repo: 'https://github.com/InitPHP/Container' },
    ],
  },
  {
    icon: 'fa6-solid:toolbox',
    title: 'Utilities',
    desc: 'Logging, CLI tools, events, i18n, and general-purpose helpers.',
    items: [
      { label: 'Logger (PSR-3)', repo: 'https://github.com/InitPHP/Logger' },
      { label: 'Console', repo: 'https://github.com/InitPHP/Console' },
      { label: 'Events', repo: 'https://github.com/InitPHP/Events' },
      { label: 'Translator (i18n)', repo: 'https://github.com/InitPHP/Translator' },
      { label: 'PerformanceMeter', repo: 'https://github.com/InitPHP/PerformanceMeter' },
      { label: 'ParameterBag', repo: 'https://github.com/InitPHP/ParameterBag' },
    ],
  },
];
```

- [ ] **Step 6: Run the data tests**

Run: `npm test -- --test-name-pattern="declares|Iconify"`
Expected: PASS, all four.

- [ ] **Step 7: Type-check**

Run: `npx astro check`
Expected: 0 errors. (If `astro check` reports a missing dependency, run `npm install -D @astrojs/check typescript` and retry.)

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: extract library, featured and category content into typed data modules"
```

---

### Task 6: BaseLayout and head parity

Port everything inside `<head>`. This is the first task that turns parity tests green.

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `src/styles/global.css` (Task 3).
- Produces: `BaseLayout` — takes no props, renders `<html>`/`<head>`/`<body>` and a default `<slot />`.

- [ ] **Step 1: Read the source**

Open `tests/fixtures/baseline.html:1-60`. Every `<meta>`, the canonical link, the favicon link and the JSON-LD block must be reproduced with identical values. The two `fonts.googleapis.com` `<link rel="preconnect">` tags and the Google Fonts stylesheet are **dropped** — Fontsource replaces them. The FontAwesome stylesheet link is **dropped**.

- [ ] **Step 2: Write `src/layouts/BaseLayout.astro`**

```astro
---
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '../styles/global.css';

const title = 'InitPHP - Open Source PHP Libraries & Components';
const description =
  'InitPHP is an open source project providing modular, standalone PHP libraries for database, routing, caching, encryption, sockets, and more. Build robust PHP applications with lightweight, well-tested components.';
const ogDescription =
  'Modular, standalone PHP libraries for database, routing, caching, encryption, sockets, and more. Build robust PHP applications with lightweight, well-tested components.';
const twitterDescription =
  'Modular, standalone PHP libraries for database, routing, caching, encryption, sockets, and more.';
const image = 'https://initphp.org/logos/initphp-icon-700.png';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'InitPHP',
  url: 'https://initphp.org',
  logo: image,
  description:
    'InitPHP is an open source project providing modular, standalone PHP libraries for database, routing, caching, encryption, sockets, and more.',
  foundingDate: '2022',
  founder: {
    '@type': 'Person',
    name: 'Muhammet SAFAK',
    url: 'https://github.com/muhammetsafak',
  },
  sameAs: ['https://github.com/InitPHP'],
};
---

<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta
      name="keywords"
      content="PHP, open source, PHP libraries, PHP components, database, router, ORM, cache, encryption, socket, PSR"
    />
    <meta name="author" content="Muhammet SAFAK" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://initphp.org/" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://initphp.org/" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={ogDescription} />
    <meta property="og:image" content={image} />
    <meta property="og:site_name" content="InitPHP" />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={twitterDescription} />
    <meta name="twitter:image" content={image} />

    <link rel="icon" type="image/png" href="/logos/initphp-icon-700.png" />

    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)}></script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Use it from the page**

`src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout />
```

The font and stylesheet imports now live in the layout; remove them from the page.

- [ ] **Step 4: Build and run the head half of the suite**

Run: `npm run build && npm test`
Expected: `title matches`, `every baseline meta tag survives...`, `canonical and favicon match` and `JSON-LD matches` all PASS. The heading, anchor, image and body-text tests still fail — the body is empty.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add BaseLayout reproducing the page head, meta and JSON-LD"
```

---

### Task 7: Navbar

**Files:**
- Create: `src/components/Navbar.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 6), `Icon` (Task 4).
- Produces: `Navbar` — no props.

- [ ] **Step 1: Read the source**

Markup: `tests/fixtures/baseline.html:844-864`. CSS: `tests/fixtures/baseline.html:110-201` plus the `.nav-links` / `.mobile-toggle` overrides inside the 768px block at `704-786`. Script: `1351-1368`.

Keep the baseline's desktop-first structure: the horizontal nav stays unprefixed and the drawer override becomes `max-md:`. Do not invert to mobile-first.

- [ ] **Step 2: Write `src/components/Navbar.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
---

<nav
  class="fixed top-0 right-0 left-0 z-[100] flex h-16 items-center border-b border-border bg-[rgba(10,14,23,0.85)] px-6 backdrop-blur-[20px]"
  role="navigation"
  aria-label="Main navigation"
>
  <div class="mx-auto flex w-full max-w-[1200px] items-center justify-between">
    <a href="/" class="flex items-center gap-2 font-bold text-text-primary" aria-label="InitPHP Home">
      <img src="/logos/initphp-icon-700.png" alt="InitPHP Logo" width="32" height="32" />
      <span class="text-accent-light">Init</span>PHP
    </a>

    <ul id="navLinks" class="nav-links">
      <li><a href="#libraries">Libraries</a></li>
      <li><a href="#categories">Categories</a></li>
      <li><a href="#install">Install</a></li>
      <li>
        <a
          href="https://github.com/InitPHP"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-github"
        >
          <Icon name="fa6-brands:github" /> GitHub
        </a>
      </li>
    </ul>

    <button
      id="mobileToggle"
      class="mobile-toggle"
      aria-label="Toggle menu"
      aria-expanded="false"
    >
      <Icon name="fa6-solid:bars" />
    </button>
  </div>
</nav>

<script>
  const toggle = document.getElementById('mobileToggle')!;
  const navLinks = document.getElementById('navLinks')!;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
</script>
```

`.nav-links`, `.nav-github` and `.mobile-toggle` keep class names because the script toggles `.active` on the list and the drawer state is easier to express as a scoped rule than as utilities. Translate their declarations from the cited line ranges into a `<style>` block in this component; everything else on the nav is already expressed as utilities above.

Note `<Icon ... /> GitHub` — the space before `GitHub` is on the same line deliberately. With `compressHTML: true` either form works, but keeping it on one line is a second line of defence.

- [ ] **Step 3: Render it**

`src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/Navbar.astro';
---

<BaseLayout>
  <Navbar />
</BaseLayout>
```

- [ ] **Step 4: Build and check the navbar's contribution to parity**

Run: `npm run build && npm test`
Expected: the four head tests still PASS. `anchors match...` now fails later in the list than before — the first four anchors (`/`, `#libraries`, `#categories`, `#install`, GitHub) should match the baseline's first five. Read the diff and confirm the mismatch is only the *missing* anchors from unported sections, not a wrong href or label in the nav.

- [ ] **Step 5: Eyeball it**

Run: `npm run dev` and open the printed URL. Confirm the nav is fixed to the top, the drawer opens below 768px, and the icon sits on the text baseline next to "GitHub".

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: port navbar with mobile drawer to Astro component"
```

---

### Task 8: Hero and Stats

**Files:**
- Create: `src/components/Hero.astro`, `src/components/Stats.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `libraries` (Task 5), `Icon` (Task 4), the `hero-glow` and `gradient-text` utilities (Task 3).
- Produces: `Hero`, `Stats` — neither takes props.

- [ ] **Step 1: Read the source**

Markup: `tests/fixtures/baseline.html:867-909`. CSS: `201-349`, plus the hero and stats overrides in the responsive block at `704-786`.

- [ ] **Step 2: Write `src/components/Hero.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
import { libraries } from '../data/libraries';
---

<section class="hero-glow overflow-hidden px-6 pt-40 pb-24 text-center">
  <div class="relative z-[1] mx-auto max-w-[780px]">
    <div class="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(124,110,240,0.25)] bg-accent-glow px-4 py-1.5 text-[0.8rem] font-semibold tracking-[0.5px] text-accent-light uppercase">
      <Icon name="fa6-brands:php" /> Open Source PHP Ecosystem
    </div>
    <h1>
      Build with<br />
      <span class="gradient-text">Modular PHP Libraries</span>
    </h1>
    <p class="hero-desc">
      A collection of {libraries.length} lightweight, standalone PHP libraries. From database ORM to socket servers, each component is designed to work independently or together.
    </p>
    <div class="hero-actions">
      <a href="https://github.com/InitPHP" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        <Icon name="fa6-brands:github" /> Explore on GitHub
      </a>
      <a href="#libraries" class="btn btn-secondary">
        <Icon name="fa6-solid:table-cells-large" /> Browse Libraries
      </a>
    </div>
  </div>
</section>
```

`fa6-solid:table-cells-large` replaces the baseline's `fa-grid-2`, which is a FontAwesome Pro icon and renders as nothing on the live site. This is the one deliberate rendered difference in the migration.

The `hero-desc` paragraph is written on a single source line. The baseline wraps it across three lines, and its rendered text is the whitespace-collapsed single line above — the parity test compares normalised text, so both forms pass, but writing it flat removes any doubt.

Translate `.hero h1`, `.hero-desc`, `.hero-actions`, `.btn`, `.btn-primary` and `.btn-secondary` from lines `215-314` into either utilities on these elements or a component `<style>` block. `.btn` is shared with nothing else on the page, so a scoped style block is the simpler choice.

- [ ] **Step 3: Write `src/components/Stats.astro`**

```astro
---
import { libraries } from '../data/libraries';

const stats = [
  { number: String(libraries.length), label: 'Libraries' },
  { number: 'MIT', label: 'License' },
  { number: 'PSR', label: 'Standards' },
];
---

<section class="mx-auto max-w-[900px] px-6 pb-20" aria-label="Project statistics">
  <div class="stats-grid">
    {stats.map((s) => (
      <div class="stat-card">
        <div class="stat-number">{s.number}</div>
        <div class="stat-label">{s.label}</div>
      </div>
    ))}
  </div>
</section>
```

Translate `.stats`, `.stats-grid`, `.stat-card`, `.stat-number` and `.stat-label` from `314-349` and their overrides in the 768px block.

- [ ] **Step 4: Render both**

Add `<Hero />` and `<Stats />` inside `<BaseLayout>` in `src/pages/index.astro`, after `<Navbar />`.

- [ ] **Step 5: Build and test**

Run: `npm run build && npm test`
Expected: `headings match...` now reports the `h1` matching and only later headings missing. Confirm the hero `h1` text is `Build with Modular PHP Libraries`.

Run: `grep -o '>27<' dist/index.html | head -1`
Expected: one match — the stat card, rendered from `libraries.length`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: port hero and stats sections, deriving the library count from data"
```

---

### Task 9: Featured libraries section

**Files:**
- Create: `src/components/FeaturedCard.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `featured` and the `Featured` interface (Task 5), `Icon` (Task 4).
- Produces: `FeaturedCard` with `Props = Featured` — i.e. props `name`, `stars`, `tag`, `desc`, `code`, `docs`.

- [ ] **Step 1: Read the source**

Markup: `tests/fixtures/baseline.html:911-1008`. CSS: `349-466` (this range also covers the shared `.section` and `.section-header` rules used by every remaining section).

- [ ] **Step 2: Write `src/components/FeaturedCard.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
import type { Featured } from '../data/featured';

type Props = Featured;
const { name, stars, tag, desc, code, docs } = Astro.props;
---

<article class="featured-card">
  <div class="featured-card-header">
    <span class="featured-card-name">{name}</span>
    <span class="featured-card-stars"><Icon name="fa6-solid:star" /> {stars}</span>
  </div>
  <p>{desc}</p>
  <div class="featured-card-footer">
    <span class="tag">{tag}</span>
    <div class="featured-card-links">
      <a href={code} target="_blank" rel="noopener noreferrer"><Icon name="fa6-brands:github" /> Code</a>
      <a href={docs} target="_blank" rel="noopener noreferrer"><Icon name="fa6-solid:book" /> Docs</a>
    </div>
  </div>
</article>
```

Translate the `.featured-*` and `.tag` rules from `372-466` into a `<style>` block in this component, and `.featured-grid` into the section wrapper in `index.astro`.

- [ ] **Step 3: Render the section**

In `src/pages/index.astro`:

```astro
---
import FeaturedCard from '../components/FeaturedCard.astro';
import { featured } from '../data/featured';
---

<section class="section featured" id="libraries">
  <div class="section-header">
    <h2>Featured Libraries</h2>
    <p>Most popular and actively maintained components in the InitPHP ecosystem.</p>
  </div>
  <div class="featured-grid">
    {featured.map((f) => <FeaturedCard {...f} />)}
  </div>
</section>
```

- [ ] **Step 4: Build and test**

Run: `npm run build && npm test`
Expected: `headings match...` now includes the `Featured Libraries` h2.

Run: `grep -c 'featured-card"' dist/index.html`
Expected: `6`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: port featured libraries section to data-driven cards"
```

---

### Task 10: Categories section

**Files:**
- Create: `src/components/CategoryCard.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `categories` and the `Category` interface (Task 5), `Icon` (Task 4), the `bullet-before` utility (Task 3).
- Produces: `CategoryCard` with `Props = Category`.

- [ ] **Step 1: Read the source**

Markup: `tests/fixtures/baseline.html:1010-1092`. CSS: `522-600`, plus `.categories-grid` in the 768px block.

- [ ] **Step 2: Write `src/components/CategoryCard.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
import type { Category } from '../data/categories';

type Props = Category;
const { icon, title, desc, items } = Astro.props;
---

<div class="category-card">
  <div class="category-icon"><Icon name={icon} /></div>
  <h3>{title}</h3>
  <p>{desc}</p>
  <ul class="category-list">
    {items.map((item) => (
      <li>
        <a href={item.repo} target="_blank" rel="noopener noreferrer" class="bullet-before">{item.label}</a>
      </li>
    ))}
  </ul>
</div>
```

The `.category-icon` box is a fixed 48×48 flex container with `font-size: 1.25rem`; the `[data-icon]` rule from Task 4 sizes the SVG from that inherited font-size, so no per-icon dimensions are needed. Translate `.category-card`, `.category-icon`, `.category-card h3`, `.category-card p`, `.category-list` and `.category-list a` from `522-600` into a `<style>` block.

- [ ] **Step 3: Render the section**

```astro
<section class="section categories" id="categories">
  <div class="section-header">
    <h2>Explore by Category</h2>
    <p>Find the right library for your needs, organized by functionality.</p>
  </div>
  <div class="categories-grid">
    {categories.map((c) => <CategoryCard {...c} />)}
  </div>
</section>
```

- [ ] **Step 4: Build and test**

Run: `npm run build && npm test`
Expected: all six `h3` category titles appear in `headings match...`.

Run: `grep -c 'category-card"' dist/index.html`
Expected: `6`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: port category section to data-driven cards"
```

---

### Task 11: All Libraries grid

**Files:**
- Create: `src/components/LibCard.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `libraries` and the `Library` interface (Task 5), `Icon` (Task 4).
- Produces: `LibCard` with `Props = Library`.

- [ ] **Step 1: Read the source**

Markup: `tests/fixtures/baseline.html:1094-1296`. CSS: `466-522` for the grid and tiles, `786-800` for `.view-all`.

- [ ] **Step 2: Write `src/components/LibCard.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
import type { Library } from '../data/libraries';

type Props = Library;
const { name, repo, icon, desc } = Astro.props;
---

<a href={repo} target="_blank" rel="noopener noreferrer" class="lib-card">
  <div class="lib-icon"><Icon name={icon} /></div>
  <div class="lib-info">
    <div class="lib-name">{name}</div>
    <div class="lib-desc">{desc}</div>
  </div>
</a>
```

Translate `.lib-card`, `.lib-card:hover`, `.lib-icon`, `.lib-info`, `.lib-name` and `.lib-desc` from `466-522`.

- [ ] **Step 3: Render the section**

`src/pages/index.astro` must now also import `Icon` — the "View All Repositories" link renders one directly rather than through a component:

```astro
---
import { Icon } from 'astro-icon/components';
import LibCard from '../components/LibCard.astro';
import { libraries } from '../data/libraries';
---

<section class="section" id="all-libraries">
  <div class="section-header">
    <h2>All Libraries</h2>
    <p>Every package in the InitPHP ecosystem, ready to install via Composer.</p>
  </div>
  <div class="libraries-grid">
    {libraries.map((l) => <LibCard {...l} />)}
  </div>
  <div class="view-all">
    <a href="https://github.com/orgs/InitPHP/repositories" target="_blank" rel="noopener noreferrer">
      View All Repositories <Icon name="fa6-solid:arrow-right" />
    </a>
  </div>
</section>
```

- [ ] **Step 4: Build and test**

Run: `npm run build && npm test`
Expected: `anchors match...` is now very close — only the install/footer anchors are missing.

Run: `grep -c 'lib-card"' dist/index.html`
Expected: `27`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: port all-libraries grid to data-driven tiles"
```

---

### Task 12: Install, Footer, ScrollTop — full parity

The last three pieces of markup. At the end of this task the entire parity suite must be green.

**Files:**
- Create: `src/components/Install.astro`, `src/components/Footer.astro`, `src/components/ScrollTop.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Icon` (Task 4).
- Produces: `Install`, `Footer`, `ScrollTop` — none take props.

- [ ] **Step 1: Read the source**

Markup: `tests/fixtures/baseline.html:1298-1348`. CSS: `600-704` for install and footer, `800-839` for `.scroll-top`, plus the footer overrides in the 768px block. Script: `1369-1376`.

- [ ] **Step 2: Write `src/components/Install.astro`**

```astro
---
const commands = [
  'composer require initphp/database',
  'composer require initphp/router',
  'composer require initphp/socket',
  'composer require initphp/cache',
];
---

<section class="section install" id="install">
  <div class="section-header">
    <h2>Get Started</h2>
    <p>Install any library with Composer in seconds.</p>
  </div>
  <div class="install-box">
    <div class="install-box-header">
      <span class="install-dot"></span>
      <span class="install-dot"></span>
      <span class="install-dot"></span>
      <span>terminal</span>
    </div>
    <div class="install-box-body">
      {commands.map((cmd, i) => (
        <div class={i < commands.length - 1 ? 'mb-3' : ''}>
          <code><span class="cmd-prefix">$ </span>{cmd}</code>
        </div>
      ))}
    </div>
  </div>
</section>
```

The baseline uses an inline `style="margin-bottom: 0.75rem"` on the first three command rows and nothing on the last; `mb-3` is Tailwind's 0.75rem. Translate `.install-box`, `.install-box-header`, `.install-dot` (including the three `:nth-child` colours at `600-656`), `.install-box-body` and `.cmd-prefix` into a `<style>` block.

- [ ] **Step 3: Write `src/components/Footer.astro`**

```astro
---
import { Icon } from 'astro-icon/components';

const social = [
  { href: 'https://github.com/InitPHP', label: 'GitHub', icon: 'fa6-brands:github' },
  { href: 'https://www.linkedin.com/in/muhametsafak/', label: 'LinkedIn', icon: 'fa6-brands:linkedin' },
  { href: 'https://medium.com/@muhametsafak', label: 'Medium', icon: 'fa6-brands:medium' },
];
---

<footer>
  <div class="footer-inner">
    <div class="footer-left">
      <a href="/" class="footer-brand">InitPHP</a>
      <span class="footer-copy">
        &copy; 2022-2026 InitPHP Project. <a href="./license.txt" target="_blank">MIT License</a>. Created by <a href="https://github.com/muhammetsafak" target="_blank" rel="noopener noreferrer">Muhammet SAFAK</a>
      </span>
    </div>
    <div class="footer-links">
      {social.map((s) => (
        <a href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} aria-label={s.label}>
          <Icon name={s.icon} />
        </a>
      ))}
    </div>
  </div>
</footer>
```

Keep the licence href as `./license.txt` exactly as the baseline has it — the file is served from the site root via `public/license.txt`, so the relative form resolves correctly and the anchor comparison stays exact.

- [ ] **Step 4: Write `src/components/ScrollTop.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
---

<button class="scroll-top" id="scrollTop" aria-label="Scroll to top">
  <Icon name="fa6-solid:arrow-up" />
</button>

<script>
  const scrollBtn = document.getElementById('scrollTop')!;

  window.addEventListener(
    'scroll',
    () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    },
    { passive: true },
  );

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
</script>
```

Translate `.scroll-top`, `.scroll-top.visible` and `.scroll-top:hover` from `800-839`.

- [ ] **Step 5: Render all three**

Add `<Install />`, `<Footer />` and `<ScrollTop />` to `src/pages/index.astro`, in that order, after the all-libraries section.

- [ ] **Step 6: Run the full suite — this is the gate**

Run: `npm run build && npm test`
Expected: **all tests PASS**, including `rendered body text matches exactly`.

If `rendered body text matches exactly` fails, diff the two strings and look first for missing spaces around icons — that is the Astro 7 whitespace behaviour and means `compressHTML: true` was lost from `astro.config.mjs`.

If `anchors match in order, target and label` fails, the diff names the exact href and label; compare against `tests/fixtures/baseline.html`.

- [ ] **Step 7: Type-check**

Run: `npx astro check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: port install, footer and scroll-to-top; content parity now green"
```

---

### Task 13: Visual parity pass

Content is proven identical. This task proves the rendering is too. This is where the Tailwind rewrite gets its real test, and it is the highest-risk task in the plan.

**Files:**
- Modify: any component whose styles are wrong.

- [ ] **Step 1: Serve both versions**

```bash
npm run build
npx astro preview &              # the new site, on the port it prints
python3 -m http.server 8081 &    # from the repo root
```

Open the built site at the `astro preview` URL, and the baseline at
`http://localhost:8081/tests/fixtures/baseline.html`. Serving the baseline from the
repo root (not from `tests/fixtures/`) is what makes its relative `assets/fontawesome/`
references resolve, so its icons render.

`logos/` has moved to `public/logos/` by Task 2, so the baseline's logo image will 404.
That is expected and is not a difference to chase — compare layout, type, colour and
spacing, not that one image.

- [ ] **Step 2: Capture and compare at three widths**

For each of 1440px, 768px and 375px, screenshot both pages full-page and compare them side by side.

Check specifically, in this order:
1. **Responsive direction.** Is the mobile drawer showing at 375px and the horizontal nav at 1440px? A `max-md:` written as `md:` inverts the whole breakpoint and is obvious at a glance.
2. **Icon baseline and size.** Icons should sit level with their adjacent text and be the same visual size as the baseline's glyphs. If they float high or low, adjust `vertical-align` on `[data-icon]` in `global.css`.
3. **Icon aspect ratio.** No icon should look horizontally squashed or stretched.
4. Card grid column counts at each width.
5. The hero radial glow's position and extent.
6. The gradient on the headline span.
7. Font weights and letter-spacing on the hero badge and stat labels.
8. Hover states: featured card lift, lib card, buttons, nav links.

- [ ] **Step 3: Fix every difference**

For each difference, re-read the original rule in `tests/fixtures/baseline.html` at the line range from the CSS source map, and correct the component. Do not adjust the baseline.

- [ ] **Step 4: Re-run everything**

Run: `npm run build && npm test && npx astro check`
Expected: all green. Styling fixes must not have changed the markup.

- [ ] **Step 5: Report**

Present the before/after screenshots at all three widths to the user for sign-off before continuing. Note the `fa-grid-2` → `table-cells-large` change as the one expected difference.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "fix: correct styling differences found in visual parity comparison"
```

---

### Task 14: Remove the superseded files

Only now is it safe to delete the FontAwesome tree — Task 4 proved the icon strategy and Task 13 proved the rendering.

**Files:**
- Delete: `index.html`, `assets/`

- [ ] **Step 1: Confirm nothing references the assets directory**

Run: `grep -rn "assets/" src/ astro.config.mjs public/ 2>/dev/null`
Expected: no output. If `src/icons/` was used as the Task 4 fallback, those SVGs are already copied into `src/icons/` and this grep still returns nothing.

- [ ] **Step 2: Delete**

```bash
git rm index.html
git rm -r assets
```

`tests/fixtures/baseline.html` is the archived copy of `index.html` and stays.

- [ ] **Step 3: Rebuild and retest**

Run: `npm run build && npm test`
Expected: all green. The parity harness reads the fixture, not the deleted file, so nothing should change.

- [ ] **Step 4: Check the size**

Run: `du -sh . --exclude=node_modules --exclude=.git --exclude=dist 2>/dev/null || du -sh .`
Expected: roughly 2 MB of tracked content, down from ~16 MB.

- [ ] **Step 5: Commit**

```bash
git commit -m "chore: remove the superseded index.html, Bootstrap, unused images and FontAwesome"
```

---

### Task 15: GitHub Actions deployment

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

- [ ] **Step 1: Write the workflow**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - run: npm ci

      - run: npm run build

      # Parity tests read dist/index.html, so they must run after the build.
      - run: npm test

      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`npm test` runs after the build and before the artifact upload, so a content regression fails the deploy rather than shipping. The parity suite reads `dist/index.html`; running it before the build would fail with `ENOENT`.

- [ ] **Step 2: Validate the YAML locally**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml')); print('valid')"`
Expected: `valid`

- [ ] **Step 3: Update the README**

Replace the contents of `README.md`:

````markdown
# initphp.org

Source for [initphp.org](https://initphp.org), built with [Astro](https://astro.build).

## Develop

```sh
npm install
npm run dev
```

## Test

```sh
npm test
```

The suite compares the built `dist/index.html` against `tests/fixtures/baseline.html`,
a frozen copy of the pre-Astro page, and fails on any change to the page's metadata,
links, headings or rendered text. Run `npm run build` first.

## Deploy

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`. The custom domain comes from `public/CNAME`.
````

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "ci: build and deploy to GitHub Pages with GitHub Actions"
```

- [ ] **Step 5: Hand the manual step to the repository owner**

**Do not push and assume this is done.** Tell the user, in these words:

> The migration is committed. Before pushing to `main`, open
> https://github.com/InitPHP/initphp.github.io/settings/pages and change
> **Build and deployment → Source** from *Deploy from a branch* to
> **GitHub Actions**. Until that switch is flipped, the workflow will build
> successfully but GitHub Pages will keep serving the old branch contents, so the
> site will not change. This setting cannot be changed from the repository.

- [ ] **Step 6: Push only after the user confirms**

```bash
git push origin main
```

Then watch the run: `gh run watch`

- [ ] **Step 7: Verify the deployed site**

Run: `curl -sI https://initphp.org | head -1`
Expected: `HTTP/2 200`

Run: `curl -s https://initphp.org | grep -c 'lib-card'`
Expected: `27`

---

## Self-Review

**Spec coverage.** Spec §3 decisions → Tasks 2, 3, 4 and the Global Constraints. §3.1 `fa-grid-2` → Task 8 Step 2. §3.2 Astro 7 changes → Global Constraints, Task 2 Step 3, Task 4 Step 4 (astro-icon gate and fallback), Task 12 Step 6 (whitespace diagnosis). §4 structure → the File Structure table and Tasks 2, 5, 6. §5 data model → Task 5. §6 styling → Task 3 and each component task. §7 client JavaScript → Tasks 7 and 12. §8 deployment → Task 15, including the manual Pages source switch. §9 removals → Task 14. §10 verification: item 1 → Task 2/12 builds; items 3, 4 → Tasks 6, 12 via the parity suite; item 2 → Task 13; item 5 → Task 13 Step 2.

**Type consistency.** `Library`/`libraries`, `Featured`/`featured`, `Category`/`CategoryItem`/`categories` are declared in Task 5 and consumed under exactly those names in Tasks 8, 9, 10 and 11. `extractSnapshot` is declared and consumed in Task 1. `[data-icon]` is introduced in Task 4 and relied on in Tasks 7-12.

**Known judgement call.** Component tasks give the markup in full but describe the CSS translation by pointing at the exact source line range rather than transcribing 770 lines of declarations into this document. Transcription at that volume adds a copying-error surface without adding information, and the line ranges resolve to a file this plan creates in Task 1. Task 13 is the check on that work.
