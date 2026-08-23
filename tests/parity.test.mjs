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
