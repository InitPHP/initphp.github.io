# initphp.org

Source for [initphp.org](https://initphp.org), built with [Astro](https://astro.build).

## Develop

```sh
npm install
npm run dev
```

## Content model

`src/data/libraries.ts` is the single source of truth for every package:
name, slug, Composer name, repository, wiki, Packagist URL, description,
minimum PHP version, latest version and release date, PSR interfaces,
required extensions, dependencies and star count.

Everything else is derived from it — the homepage cards, the category
lists, the 27 pages under `/libraries/`, the JSON-LD, `llms.txt`,
`llms-full.txt` and the sitemap. Nothing about a package may be restated in
another file, so a package cannot disagree with itself between two sections
of the site.

- `src/data/categories.ts` holds category metadata only; membership comes
  from each library's `category` field.
- `src/data/faq.ts` backs both the visible FAQ and its `FAQPage` JSON-LD.
- `src/data/site.ts` holds the origin, titles and social identities that end
  up in canonicals and structured data.

Archived Packagist packages (`initphp/cli-table`, `curl`, `event-emitter`,
`http-client`, `http-factory`, `polyfill-php80`, `redis`,
`redis-session-handler`, `var-dumper`) are deliberately absent from the
catalogue: they are marked abandoned upstream and must not be advertised as
installable.

Star counts are the one number that changes without a commit:

```sh
npm run refresh:stars   # rewrites `stars:` in libraries.ts from the GitHub API
```

## Assets

`public/` favicons, the PWA icons and the 1200x630 `og-image.png` are all
generated from the single 700x700 master logo:

```sh
npm run icons           # scripts/generate-icons.mjs
```

Re-run it after replacing `public/logos/initphp-icon-700.png`. Do not hand-
edit the generated files.

## Styling conventions

- Two approaches exist today, split by component rather than by rule
  complexity: `Navbar.astro` and `Hero.astro` put Tailwind utilities on
  their outer markup; the other components and the page section shells are
  scoped-CSS-only, even for one-declaration rules. The codebase is not
  uniform.
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
npm run build   # tests/seo.test.mjs reads dist/
npm test
```

The suite has two parts:

- `tests/data.test.mjs` checks `src/data/*.ts` directly, independently of the
  build — entry counts, required fields and their types, Iconify icon id
  format, Composer/GitHub/Packagist URL agreement, that categories partition
  the catalogue exactly, and uniqueness of names, slugs, packages and repos.
- `tests/seo.test.mjs` asserts the crawlable surface of `dist/`: one h1 per
  page and no skipped heading levels, title and meta-description lengths,
  per-page canonicals and `og:url`, a 1200x630 social image, `robots` values
  (including `noindex` on the 404), a resolvable JSON-LD `@graph` on every
  page, the homepage `ItemList` and `FAQPage` matching the rendered content,
  each library page stating its own install command and package facts, no
  internal link pointing at something that was not built, `alt`/`width`/
  `height` on every image, sitemap coverage and `lastmod` values, `robots.txt`,
  and `llms.txt` / `llms-full.txt` covering every package.

A third file, `tests/parity.test.mjs`, used to diff the build against a
frozen copy of the pre-Astro page. It was retired once the page started
diverging from that baseline on purpose; `tests/extract.mjs`, the HTML
snapshot helper it was built around, is still used by the SEO suite.

## Deploy

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`. The custom domain comes from `public/CNAME`.

Repository **Settings → Pages → Source** must be set to **GitHub Actions**.
With the older "Deploy from a branch" setting the workflow still reports
success while Pages serves 404, because the branch root holds Astro sources
rather than a built site.
