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
