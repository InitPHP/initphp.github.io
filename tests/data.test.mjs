import { test } from 'node:test';
import assert from 'node:assert/strict';
import { libraries } from '../src/data/libraries.ts';
import { featured } from '../src/data/featured.ts';
import { categories } from '../src/data/categories.ts';

const ICON_RE = /^fa6-(solid|brands|regular):[a-z0-9-]+$/;

const isNonEmptyString = (v) => typeof v === 'string' && v.length > 0;

const isGithubUrl = (v) => {
  if (!isNonEmptyString(v)) return false;
  try {
    return new URL(v).host === 'github.com';
  } catch {
    return false;
  }
};

const assertFields = (entry, fields, label) => {
  for (const field of fields) {
    assert.ok(isNonEmptyString(entry[field]), `${label}: "${field}" should be a non-empty string`);
  }
};

test('libraries: 27 entries, unique names/repos, valid fields', () => {
  assert.equal(libraries.length, 27);
  for (const lib of libraries) {
    assertFields(lib, ['name', 'repo', 'icon', 'desc'], `library "${lib.name}"`);
    assert.match(lib.icon, ICON_RE, `library "${lib.name}" has bad icon id "${lib.icon}"`);
    assert.ok(isGithubUrl(lib.repo), `library "${lib.name}" repo is not a github.com URL: "${lib.repo}"`);
  }
  const names = libraries.map((l) => l.name);
  assert.equal(new Set(names).size, names.length, 'library names must be unique');
  const repos = libraries.map((l) => l.repo);
  assert.equal(new Set(repos).size, repos.length, 'library repos must be unique');
});

test('featured: 6 entries, valid fields', () => {
  assert.equal(featured.length, 6);
  for (const f of featured) {
    assertFields(f, ['name', 'tag', 'desc', 'code', 'docs'], `featured "${f.name}"`);
    assert.ok(
      Number.isInteger(f.stars) && f.stars >= 0,
      `featured "${f.name}" stars should be a non-negative integer, got ${f.stars}`,
    );
    assert.ok(isGithubUrl(f.code), `featured "${f.name}" code is not a github.com URL: "${f.code}"`);
    assert.ok(isGithubUrl(f.docs), `featured "${f.name}" docs is not a github.com URL: "${f.docs}"`);
  }
});

test('categories: 6 categories, 27 items total, valid fields', () => {
  assert.equal(categories.length, 6);
  let totalItems = 0;
  for (const cat of categories) {
    assertFields(cat, ['icon', 'title', 'desc'], `category "${cat.title}"`);
    assert.match(cat.icon, ICON_RE, `category "${cat.title}" has bad icon id "${cat.icon}"`);
    assert.ok(Array.isArray(cat.items) && cat.items.length > 0, `category "${cat.title}" should have items`);
    for (const item of cat.items) {
      assertFields(item, ['label', 'repo'], `category "${cat.title}" item`);
      assert.ok(
        isGithubUrl(item.repo),
        `category "${cat.title}" item "${item.label}" repo is not a github.com URL: "${item.repo}"`,
      );
    }
    totalItems += cat.items.length;
  }
  assert.equal(totalItems, 27);
});
