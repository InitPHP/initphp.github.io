/**
 * Rewrites the `stars` field of every entry in src/data/libraries.ts from
 * the live GitHub API. Star counts are the one number on the site that
 * changes without a commit, so they need a way to be refreshed that is not
 * "edit 27 numbers by hand and hope".
 *
 * Usage: npm run refresh:stars
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(new URL('../src/data/libraries.ts', import.meta.url));

const response = await fetch('https://api.github.com/orgs/InitPHP/repos?per_page=100', {
  headers: {
    accept: 'application/vnd.github+json',
    // Unauthenticated requests are rate limited to 60/hour, which is ample
    // for one call; GITHUB_TOKEN lifts that when the script runs in CI.
    ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  },
});

if (!response.ok) {
  throw new Error(`GitHub API returned ${response.status} ${response.statusText}`);
}

const stars = new Map(
  (await response.json()).map((repo) => [repo.name, repo.stargazers_count]),
);

let source = await readFile(file, 'utf8');
let changed = 0;
const missing = [];

// Matches a repo URL and the `stars:` line that follows it within the same
// object literal. The Library interface declares `repo` before `stars`, and
// `[^}]` keeps the match from running past the end of an entry.
source = source.replace(
  /repo: 'https:\/\/github\.com\/InitPHP\/([A-Za-z0-9._-]+)',([^}]*?)stars: (\d+),/g,
  (match, name, between, current) => {
    if (!stars.has(name)) {
      missing.push(name);
      return match;
    }
    const next = stars.get(name);
    if (String(next) === current) return match;
    changed += 1;
    console.log(`${name}: ${current} -> ${next}`);
    return `repo: 'https://github.com/InitPHP/${name}',${between}stars: ${next},`;
  },
);

if (missing.length > 0) {
  throw new Error(`No GitHub repository found for: ${missing.join(', ')}`);
}

if (changed === 0) {
  console.log('star counts already current');
} else {
  await writeFile(file, source);
  console.log(`updated ${changed} entr${changed === 1 ? 'y' : 'ies'}`);
}
