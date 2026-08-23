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
