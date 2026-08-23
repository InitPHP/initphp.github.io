import { libraries, type Library } from './libraries.ts';

/**
 * Category metadata only. The member list of each category is derived from
 * `libraries` at build time via each library's `category` field, so a
 * package can never appear in a category list with a stale URL or be
 * silently missing from one — the previous version of this file duplicated
 * every repo URL by hand.
 */
export interface Category {
  slug: string;
  icon: string;
  title: string;
  desc: string;
}

export const categories: Category[] = [
  {
    slug: 'database',
    icon: 'fa6-solid:database',
    title: 'Database & Storage',
    desc: 'ORM, query building, caching, queues, and data persistence.',
  },
  {
    slug: 'http',
    icon: 'fa6-solid:route',
    title: 'HTTP & Routing',
    desc: 'Routing, request & response handling, PSR-7/17 messages, uploads, and views.',
  },
  {
    slug: 'security',
    icon: 'fa6-solid:shield-halved',
    title: 'Security',
    desc: 'Encryption, escaping, validation, and authentication utilities.',
  },
  {
    slug: 'networking',
    icon: 'fa6-solid:network-wired',
    title: 'Networking',
    desc: 'TCP/UDP sockets, mail sending, and real-time communication.',
  },
  {
    slug: 'config',
    icon: 'fa6-solid:gear',
    title: 'Configuration',
    desc: 'Environment, config management, sessions, and cookies.',
  },
  {
    slug: 'utilities',
    icon: 'fa6-solid:toolbox',
    title: 'Utilities',
    desc: 'Logging, CLI tools, events, i18n, and general-purpose helpers.',
  },
];

export const librariesIn = (slug: string): Library[] =>
  libraries.filter((l) => l.category === slug);

export const categoryOf = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);
