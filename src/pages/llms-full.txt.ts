import type { APIRoute } from 'astro';
import { lastReleased, libraries } from '../data/libraries';
import { categoryOf } from '../data/categories';
import { faqs } from '../data/faq';
import { SITE, abs } from '../data/site';

/*
  The expanded companion to /llms.txt: every fact the site holds about every
  package, in one plain-text document, plus the FAQ. Generated from the same
  data as the rendered pages.
*/
export const GET: APIRoute = () => {
  const lines: string[] = [
    `# ${SITE.name} — full package reference`,
    '',
    `> ${SITE.description}`,
    '',
    `Last package release: ${lastReleased}. Packages: ${libraries.length}. License: MIT (${SITE.license}).`,
    `Maintainer: ${SITE.author.name} (${SITE.author.url}).`,
    '',
    '## Frequently asked questions',
    '',
  ];

  for (const item of faqs) {
    lines.push(`### ${item.q}`, '', item.a, '');
  }

  lines.push('## Packages', '');

  for (const lib of libraries) {
    lines.push(
      `### InitPHP ${lib.name}`,
      '',
      lib.summary,
      '',
      `- Composer: \`composer require ${lib.pkg}\``,
      `- Package: ${lib.pkg}`,
      `- Version: ${lib.version} (released ${lib.released})`,
      `- Requires: PHP ${lib.php} (${lib.phpConstraint})`,
      `- Category: ${categoryOf(lib.category)?.title ?? lib.category}`,
      `- License: MIT`,
      ...(lib.psr ? [`- Implements: ${lib.psr.join(', ')}`] : []),
      ...(lib.ext ? [`- PHP extensions: ${lib.ext.map((e) => `ext-${e}`).join(', ')}`] : []),
      ...(lib.deps ? [`- Dependencies: ${lib.deps.join(', ')}`] : []),
      `- Page: ${abs(`/libraries/${lib.slug}/`)}`,
      `- Source: ${lib.repo}`,
      `- Documentation: ${lib.docs}`,
      `- Packagist: ${lib.packagist}`,
      '',
    );
  }

  lines.push(
    '## Archived packages',
    '',
    'These are published on Packagist but marked abandoned and are deliberately not listed on the site or recommended for new projects: initphp/cli-table, initphp/curl, initphp/event-emitter, initphp/http-client, initphp/http-factory, initphp/polyfill-php80, initphp/redis, initphp/redis-session-handler, initphp/var-dumper.',
    '',
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
