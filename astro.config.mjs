import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
// Astro loads this config through Vite, so the TypeScript catalogue can be
// imported directly and the sitemap's lastmod can come from real release
// dates instead of the build clock (which would mark all 29 URLs as changed
// on every deploy, whether or not anything did).
import { lastReleased, libraries } from './src/data/libraries.ts';

const releasedBySlug = new Map(libraries.map((lib) => [lib.slug, lib.released]));

export default defineConfig({
  site: 'https://initphp.org',
  output: 'static',
  // Astro 7 defaults compressHTML to 'jsx', which strips newline-adjacent
  // whitespace and would glue icons to their labels. Keep v6 behaviour.
  compressHTML: true,
  integrations: [
    icon(),
    sitemap({
      // 404.astro is rendered as a static page by the adapter but must never
      // be advertised for crawling.
      filter: (page) => !page.includes('/404'),
      // The homepage is the entry point; /libraries/ is the hub for the 27
      // package pages, which sit one level below both.
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (path === '/') {
          return { ...item, changefreq: 'weekly', priority: 1.0, lastmod: new Date(lastReleased) };
        }
        if (path === '/libraries/') {
          return { ...item, changefreq: 'weekly', priority: 0.9, lastmod: new Date(lastReleased) };
        }
        const slug = path.replace(/^\/libraries\/|\/$/g, '');
        const released = releasedBySlug.get(slug);
        return {
          ...item,
          changefreq: 'monthly',
          priority: 0.8,
          ...(released ? { lastmod: new Date(released) } : {}),
        };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
