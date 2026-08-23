import { test } from 'node:test';
import assert from 'node:assert/strict';
import { featured, lastReleased, libraries } from '../src/data/libraries.ts';
import { categories, librariesIn } from '../src/data/categories.ts';
import { faqs } from '../src/data/faq.ts';

const ICON_RE = /^fa6-(solid|brands|regular):[a-z0-9-]+$/;
const SLUG_RE = /^[a-z0-9]+$/;
const PKG_RE = /^initphp\/[a-z0-9-]+$/;
const PHP_RE = /^\d+\.\d+\+$/;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isNonEmptyString = (v) => typeof v === 'string' && v.length > 0;

const isUrl = (v, host) => {
  if (!isNonEmptyString(v)) return false;
  try {
    return new URL(v).host === host;
  } catch {
    return false;
  }
};

test('libraries: 27 entries with every required field populated', () => {
  assert.equal(libraries.length, 27);

  for (const lib of libraries) {
    const label = `library "${lib.name}"`;
    for (const field of [
      'name',
      'slug',
      'pkg',
      'repo',
      'docs',
      'packagist',
      'icon',
      'desc',
      'tagline',
      'summary',
      'php',
      'phpConstraint',
      'version',
      'released',
      'category',
    ]) {
      assert.ok(isNonEmptyString(lib[field]), `${label}: "${field}" should be a non-empty string`);
    }

    assert.match(lib.slug, SLUG_RE, `${label} has a slug that would not survive a URL: "${lib.slug}"`);
    assert.match(lib.pkg, PKG_RE, `${label} has a non-initphp Composer name: "${lib.pkg}"`);
    assert.match(lib.icon, ICON_RE, `${label} has bad icon id "${lib.icon}"`);
    assert.match(lib.php, PHP_RE, `${label} has an unparseable PHP version "${lib.php}"`);
    assert.match(lib.version, SEMVER_RE, `${label} has a non-semver version "${lib.version}"`);
    assert.match(lib.released, ISO_DATE_RE, `${label} has a non-ISO release date "${lib.released}"`);

    assert.ok(isUrl(lib.repo, 'github.com'), `${label} repo is not on github.com: "${lib.repo}"`);
    assert.ok(isUrl(lib.docs, 'github.com'), `${label} docs is not on github.com: "${lib.docs}"`);
    assert.ok(
      isUrl(lib.packagist, 'packagist.org'),
      `${label} packagist link is not on packagist.org: "${lib.packagist}"`,
    );

    // The three external URLs are derived from the same identity in real
    // life, so they must agree with it here too.
    assert.equal(lib.docs, `${lib.repo}/wiki`, `${label}: docs should be the repo wiki`);
    assert.equal(
      lib.packagist,
      `https://packagist.org/packages/${lib.pkg}`,
      `${label}: packagist link should point at ${lib.pkg}`,
    );

    assert.ok(
      Number.isInteger(lib.stars) && lib.stars >= 0,
      `${label} stars should be a non-negative integer, got ${lib.stars}`,
    );

    for (const field of ['psr', 'ext', 'deps']) {
      if (lib[field] === undefined) continue;
      assert.ok(Array.isArray(lib[field]) && lib[field].length > 0, `${label}: "${field}" should be a non-empty array`);
      for (const value of lib[field]) {
        assert.ok(isNonEmptyString(value), `${label}: "${field}" holds a non-string`);
      }
    }
  }
});

test('libraries: names, slugs, packages and repos are all unique', () => {
  for (const field of ['name', 'slug', 'pkg', 'repo']) {
    const values = libraries.map((l) => l[field]);
    assert.equal(new Set(values).size, values.length, `library "${field}" values must be unique`);
  }
});

test('libraries: featured set is the six flagged entries, star-ordered', () => {
  assert.equal(featured.length, 6);
  for (const lib of featured) {
    assert.equal(lib.featured, true);
  }
  const stars = featured.map((l) => l.stars);
  assert.deepStrictEqual(stars, [...stars].sort((a, b) => b - a), 'featured should be ordered by stars, descending');
});

test('libraries: lastReleased is the newest release date in the catalogue', () => {
  assert.match(lastReleased, ISO_DATE_RE);
  for (const lib of libraries) {
    assert.ok(lib.released <= lastReleased, `${lib.name} released after lastReleased`);
  }
});

test('categories: 6 categories partitioning all 27 libraries', () => {
  assert.equal(categories.length, 6);

  const slugs = categories.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'category slugs must be unique');

  let total = 0;
  for (const category of categories) {
    for (const field of ['slug', 'icon', 'title', 'desc']) {
      assert.ok(isNonEmptyString(category[field]), `category "${category.title}": "${field}" is empty`);
    }
    assert.match(category.icon, ICON_RE, `category "${category.title}" has bad icon id`);

    const members = librariesIn(category.slug);
    assert.ok(members.length > 0, `category "${category.title}" has no libraries`);
    total += members.length;
  }

  // Every library lands in exactly one category, and no library references a
  // category that does not exist.
  assert.equal(total, libraries.length);
  for (const lib of libraries) {
    assert.ok(slugs.includes(lib.category), `library "${lib.name}" is in unknown category "${lib.category}"`);
  }
});

test('faqs: every entry is a question with a substantial answer', () => {
  assert.ok(faqs.length >= 5, 'the FAQ needs enough entries to be worth marking up');
  for (const item of faqs) {
    assert.ok(isNonEmptyString(item.q) && item.q.endsWith('?'), `FAQ entry is not a question: "${item.q}"`);
    assert.ok(item.a.length > 80, `FAQ answer for "${item.q}" is too thin to be quotable`);
  }
  const questions = faqs.map((f) => f.q);
  assert.equal(new Set(questions).size, questions.length, 'FAQ questions must be unique');
});
