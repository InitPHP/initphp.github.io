import type { APIRoute } from 'astro';
import { libraries } from '../data/libraries';
import { categories, librariesIn } from '../data/categories';
import { SITE, abs } from '../data/site';

/*
  /llms.txt, per the llmstxt.org convention: a single flat, link-dense
  summary of the site that a model can read instead of parsing the rendered
  HTML. Generated from the same catalogue the pages render, so it can never
  describe a package the site does not have.
*/
export const GET: APIRoute = () => {
  const lines: string[] = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `InitPHP is not a framework. There is no kernel to boot and no shared runtime: each of the ${libraries.length} packages is installed from Packagist on its own, under the \`initphp\` vendor namespace, and works inside any Composer-based PHP application or framework. Every package is MIT licensed.`,
    '',
    `- Site: ${SITE.url}`,
    `- Source: ${SITE.org}`,
    `- Packages: ${SITE.packagistVendor}`,
    `- License: MIT`,
    '',
  ];

  for (const category of categories) {
    lines.push(`## ${category.title}`, '');
    for (const lib of librariesIn(category.slug)) {
      lines.push(
        `- [InitPHP ${lib.name}](${abs(`/libraries/${lib.slug}/`)}): ${lib.tagline} Install: \`composer require ${lib.pkg}\`. Requires PHP ${lib.php}.`,
      );
    }
    lines.push('');
  }

  lines.push(
    '## Optional',
    '',
    `- [Full package reference](${abs('/llms-full.txt')}): every package with version, release date, PSR interfaces, required extensions and dependencies.`,
    `- [Library catalogue](${abs('/libraries/')}): the same list as HTML.`,
    '',
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
