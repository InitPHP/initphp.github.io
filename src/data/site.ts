/**
 * Site-wide constants. Anything that ends up in a canonical URL, a meta tag
 * or a JSON-LD node reads from here, so the origin is written down once.
 */
export const SITE = {
  url: 'https://initphp.org',
  name: 'InitPHP',
  /** <=60 chars, so Google renders it whole. */
  title: 'InitPHP — Modular, Standalone PHP Libraries',
  /** <=155 chars, so Google renders it whole. */
  description:
    '27 lightweight, standalone PHP libraries for database, routing, caching, encryption and sockets. MIT licensed, PSR compliant, installable with Composer.',
  locale: 'en_US',
  lang: 'en',
  themeColor: '#0a0e17',
  founded: '2022',
  license: 'https://opensource.org/licenses/MIT',
  author: {
    name: 'Muhammet SAFAK',
    url: 'https://github.com/muhammetsafak',
  },
  org: 'https://github.com/InitPHP',
  packagistVendor: 'https://packagist.org/packages/initphp/',
  sameAs: [
    'https://github.com/InitPHP',
    'https://packagist.org/packages/initphp/',
    'https://www.linkedin.com/in/muhametsafak/',
    'https://medium.com/@muhametsafak',
  ],
} as const;

/** Absolute URL for a site-relative path, for canonicals and JSON-LD @id. */
export const abs = (path = '/'): string => new URL(path, SITE.url).href;
