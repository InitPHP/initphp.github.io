import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { extractSnapshot } from './extract.mjs';
import { libraries } from '../src/data/libraries.ts';
import { faqs } from '../src/data/faq.ts';
import { SITE } from '../src/data/site.ts';

/**
 * Asserts the crawlable surface of the built site: what a search engine or
 * an answer engine sees when it fetches dist/. This replaced a parity suite
 * that diff'ed the build against a frozen copy of the pre-Astro page — a
 * useful check while the markup was meant to stay identical, and a
 * meaningless one now that the page is deliberately different.
 *
 * Requires `npm run build` first; every assertion reads dist/.
 */
const dist = fileURLToPath(new URL('../dist/', import.meta.url));

const read = (relative) => readFileSync(new URL(relative, `file://${dist}`), 'utf8');

/** dist-relative file backing a site-absolute URL path. */
const fileFor = (path) => (path.endsWith('/') ? `${path.slice(1)}index.html` : path.slice(1));

const pagePaths = ['/', '/libraries/', ...libraries.map((l) => `/libraries/${l.slug}/`)];

const snapshots = new Map(pagePaths.map((path) => [path, extractSnapshot(read(fileFor(path)))]));

const graphOf = (path) => {
  const [document] = snapshots.get(path).jsonLd;
  assert.ok(document, `${path} has no JSON-LD`);
  return document['@graph'];
};

const nodesOfType = (path, type) =>
  graphOf(path).filter((node) => [node['@type']].flat().includes(type));

test('every catalogue page is built, plus the 404', () => {
  for (const path of pagePaths) {
    assert.ok(existsSync(`${dist}${fileFor(path)}`), `${path} was not built`);
  }
  assert.ok(existsSync(`${dist}404.html`), '404.html was not built');
});

test('each page has exactly one h1 and a descending heading outline', () => {
  for (const [path, snapshot] of snapshots) {
    const h1s = snapshot.headings.filter((h) => h.tag === 'h1');
    assert.equal(h1s.length, 1, `${path} should have exactly one h1, found ${h1s.length}`);
    assert.ok(h1s[0].text.length > 0, `${path} has an empty h1`);

    // No heading may skip a level relative to the one before it.
    let previous = 1;
    for (const heading of snapshot.headings) {
      const level = Number(heading.tag.slice(1));
      assert.ok(
        level <= previous + 1,
        `${path} jumps from h${previous} to ${heading.tag} at "${heading.text}"`,
      );
      previous = level;
    }
  }
});

test('titles and meta descriptions stay inside what search results render', () => {
  for (const [path, snapshot] of snapshots) {
    assert.ok(snapshot.title.length > 0, `${path} has no title`);
    assert.ok(snapshot.title.length <= 65, `${path} title is ${snapshot.title.length} chars: "${snapshot.title}"`);

    const description = snapshot.meta.description;
    assert.ok(description, `${path} has no meta description`);
    assert.ok(
      description.length >= 70 && description.length <= 160,
      `${path} meta description is ${description.length} chars: "${description}"`,
    );
  }

  // Duplicate titles across pages make them compete with each other.
  const titles = [...snapshots.values()].map((s) => s.title);
  assert.equal(new Set(titles).size, titles.length, 'page titles must be unique');
});

test('every page canonicalises to its own absolute URL', () => {
  for (const [path, snapshot] of snapshots) {
    assert.equal(snapshot.canonical, `${SITE.url}${path}`, `${path} has the wrong canonical`);
    assert.equal(snapshot.meta['og:url'], `${SITE.url}${path}`, `${path} has the wrong og:url`);
  }
});

test('social cards declare an absolute 1200x630 image', () => {
  for (const [path, snapshot] of snapshots) {
    const image = snapshot.meta['og:image'];
    assert.ok(image?.startsWith('https://'), `${path} og:image is not absolute: "${image}"`);
    assert.equal(snapshot.meta['og:image:width'], '1200', `${path} og:image:width`);
    assert.equal(snapshot.meta['og:image:height'], '630', `${path} og:image:height`);
    assert.ok(snapshot.meta['og:image:alt'], `${path} og:image has no alt`);
    assert.equal(snapshot.meta['twitter:card'], 'summary_large_image', `${path} twitter:card`);
  }

  const card = readFileSync(`${dist}og-image.png`);
  // PNG IHDR: width and height are the two big-endian uint32s at byte 16.
  assert.equal(card.readUInt32BE(16), 1200, 'og-image.png width');
  assert.equal(card.readUInt32BE(20), 630, 'og-image.png height');
});

test('indexable pages are indexable and the 404 is not', () => {
  for (const [path, snapshot] of snapshots) {
    const robots = snapshot.meta.robots;
    assert.ok(robots?.startsWith('index, follow'), `${path} is not marked indexable: "${robots}"`);
    assert.match(robots, /max-image-preview:large/, `${path} does not opt into large image previews`);
  }

  const notFound = extractSnapshot(read('404.html'));
  assert.match(notFound.meta.robots, /^noindex/, '404 must be noindex');
});

test('every page carries the Organization and WebSite graph', () => {
  for (const path of pagePaths) {
    const graph = graphOf(path);
    assert.equal(nodesOfType(path, 'Organization').length, 1, `${path} Organization node`);
    assert.equal(nodesOfType(path, 'WebSite').length, 1, `${path} WebSite node`);

    // Every @id referenced from within the graph must resolve inside it.
    const ids = new Set(graph.map((node) => node['@id']).filter(Boolean));
    const references = JSON.stringify(graph).matchAll(/\{"@id":"([^"]+)"\}/g);
    for (const [, reference] of references) {
      assert.ok(ids.has(reference), `${path} references unresolved @id ${reference}`);
    }
  }
});

test('the homepage lists all libraries and mirrors the FAQ in JSON-LD', () => {
  const [itemList] = nodesOfType('/', 'ItemList');
  assert.ok(itemList, 'homepage has no ItemList');
  assert.equal(itemList.numberOfItems, libraries.length);
  assert.equal(itemList.itemListElement.length, libraries.length);

  const listed = new Set(itemList.itemListElement.map((entry) => entry.url));
  for (const lib of libraries) {
    assert.ok(listed.has(`${SITE.url}/libraries/${lib.slug}/`), `${lib.name} missing from the homepage ItemList`);
  }

  const [faqPage] = nodesOfType('/', 'FAQPage');
  assert.ok(faqPage, 'homepage has no FAQPage');
  assert.equal(faqPage.mainEntity.length, faqs.length);

  // The structured answers must be the rendered answers, verbatim.
  const text = snapshots.get('/').text;
  for (const [i, question] of faqPage.mainEntity.entries()) {
    assert.equal(question.name, faqs[i].q);
    assert.equal(question.acceptedAnswer.text, faqs[i].a);
    assert.ok(text.includes(faqs[i].q), `FAQ question not rendered on the page: "${faqs[i].q}"`);
    assert.ok(text.includes(faqs[i].a), `FAQ answer not rendered on the page: "${faqs[i].q}"`);
  }
});

test('each library page states its own package facts, in text and in JSON-LD', () => {
  for (const lib of libraries) {
    const path = `/libraries/${lib.slug}/`;
    const { text } = snapshots.get(path);

    assert.ok(text.includes(`composer require ${lib.pkg}`), `${path} does not show its install command`);
    assert.ok(text.includes(`PHP ${lib.php}`), `${path} does not state its PHP requirement`);
    assert.ok(text.includes(lib.summary), `${path} does not render its summary`);

    const [software] = nodesOfType(path, 'SoftwareSourceCode');
    assert.ok(software, `${path} has no SoftwareSourceCode node`);
    assert.equal(software.alternateName, lib.pkg, `${path} SoftwareSourceCode package name`);
    assert.equal(software.softwareVersion, lib.version, `${path} SoftwareSourceCode version`);
    assert.equal(software.codeRepository, lib.repo, `${path} SoftwareSourceCode repository`);
    assert.equal(software.license, SITE.license, `${path} SoftwareSourceCode license`);
    assert.equal(software.dateModified, lib.released, `${path} SoftwareSourceCode dateModified`);

    const [breadcrumb] = nodesOfType(path, 'BreadcrumbList');
    assert.ok(breadcrumb, `${path} has no BreadcrumbList`);
    assert.deepStrictEqual(
      breadcrumb.itemListElement.map((entry) => entry.item),
      [`${SITE.url}/`, `${SITE.url}/libraries/`, `${SITE.url}${path}`],
      `${path} breadcrumb trail`,
    );
  }
});

test('no internal link points at something that was not built', () => {
  for (const [path, snapshot] of snapshots) {
    for (const anchor of snapshot.anchors) {
      const href = anchor.href ?? '';
      if (!href.startsWith('/')) continue;

      const [target, fragment] = href.split('#');
      const file = fileFor(target || '/');
      assert.ok(existsSync(`${dist}${file}`), `${path} links to ${href}, which was not built`);

      if (fragment) {
        assert.match(
          read(file),
          new RegExp(`id="${fragment}"`),
          `${path} links to ${href}, but #${fragment} does not exist on that page`,
        );
      }
    }
  }
});

test('every image declares alt text and intrinsic dimensions', () => {
  for (const [path] of snapshots) {
    const root = parse(read(fileFor(path)));
    for (const img of root.querySelectorAll('img')) {
      const src = img.getAttribute('src');
      assert.ok(img.getAttribute('alt'), `${path}: <img src="${src}"> has no alt text`);
      assert.ok(img.getAttribute('width'), `${path}: <img src="${src}"> has no width`);
      assert.ok(img.getAttribute('height'), `${path}: <img src="${src}"> has no height`);
    }
  }
});

test('the sitemap covers every indexable page and nothing else', () => {
  const xml = read('sitemap-0.xml');
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);

  assert.deepStrictEqual(
    [...locations].sort(),
    pagePaths.map((path) => `${SITE.url}${path}`).sort(),
    'sitemap URLs should be exactly the indexable pages',
  );
  assert.ok(!xml.includes('/404'), 'the 404 page must not appear in the sitemap');

  // A lastmod that moves on every build is noise; these come from release
  // dates, so each one must be a real date in the catalogue.
  const dates = new Set(libraries.map((l) => l.released));
  for (const [, lastmod] of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
    assert.ok(dates.has(lastmod.slice(0, 10)), `sitemap lastmod ${lastmod} is not a package release date`);
  }

  assert.match(read('sitemap-index.xml'), /sitemap-0\.xml/);
});

test('robots.txt allows crawling and points at the sitemap', () => {
  const robots = read('robots.txt');
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, new RegExp(`^Sitemap: ${SITE.url}/sitemap-index\\.xml$`, 'm'));
  assert.ok(!/^Disallow: \/$/m.test(robots), 'robots.txt must not disallow the whole site');
});

test('llms.txt and llms-full.txt describe every package', () => {
  const index = read('llms.txt');
  const full = read('llms-full.txt');

  for (const lib of libraries) {
    assert.ok(index.includes(`composer require ${lib.pkg}`), `llms.txt omits ${lib.pkg}`);
    assert.ok(index.includes(`/libraries/${lib.slug}/`), `llms.txt omits the page for ${lib.name}`);

    assert.ok(full.includes(`### InitPHP ${lib.name}`), `llms-full.txt omits ${lib.name}`);
    assert.ok(full.includes(lib.summary), `llms-full.txt omits the summary for ${lib.name}`);
    assert.ok(full.includes(lib.version), `llms-full.txt omits the version for ${lib.name}`);
  }

  // Abandoned packages are named only so a reader knows they were excluded
  // on purpose, never as something to install.
  assert.ok(full.includes('initphp/var-dumper'), 'llms-full.txt should account for the archived packages');
  assert.ok(!index.includes('initphp/var-dumper'), 'llms.txt must not list an abandoned package');
});

test('the favicon set and manifest referenced by the pages exist', () => {
  for (const file of [
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'icon-192.png',
    'icon-512.png',
    'site.webmanifest',
  ]) {
    assert.ok(existsSync(`${dist}${file}`), `${file} is missing from the build`);
  }

  const manifest = JSON.parse(read('site.webmanifest'));
  for (const icon of manifest.icons) {
    assert.ok(existsSync(`${dist}${icon.src.slice(1)}`), `manifest references missing icon ${icon.src}`);
  }
});
