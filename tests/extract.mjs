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
