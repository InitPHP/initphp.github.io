import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://initphp.org',
  output: 'static',
  // Astro 7 defaults compressHTML to 'jsx', which strips newline-adjacent
  // whitespace and would glue icons to their labels. Keep v6 behaviour.
  compressHTML: true,
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
