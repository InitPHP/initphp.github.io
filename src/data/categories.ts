export interface CategoryItem {
  label: string;
  repo: string;
}

export interface Category {
  icon: string;
  title: string;
  desc: string;
  items: CategoryItem[];
}

export const categories: Category[] = [
  {
    icon: 'fa6-solid:database',
    title: 'Database & Storage',
    desc: 'ORM, query building, caching, queues, and data persistence.',
    items: [
      { label: 'Database', repo: 'https://github.com/InitPHP/Database' },
      { label: 'Cache', repo: 'https://github.com/InitPHP/Cache' },
      { label: 'Barbarian (Migrations)', repo: 'https://github.com/InitPHP/Barbarian' },
      { label: 'Queue (Jobs)', repo: 'https://github.com/InitPHP/Queue' },
    ],
  },
  {
    icon: 'fa6-solid:route',
    title: 'HTTP & Routing',
    desc: 'Routing, request & response handling, PSR-7/17 messages, uploads, and views.',
    items: [
      { label: 'Router', repo: 'https://github.com/InitPHP/Router' },
      { label: 'HTTP (PSR-7/17)', repo: 'https://github.com/InitPHP/HTTP' },
      { label: 'Upload', repo: 'https://github.com/InitPHP/Upload' },
      { label: 'Views', repo: 'https://github.com/InitPHP/Views' },
    ],
  },
  {
    icon: 'fa6-solid:shield-halved',
    title: 'Security',
    desc: 'Encryption, escaping, validation, and authentication utilities.',
    items: [
      { label: 'Encryption', repo: 'https://github.com/InitPHP/Encryption' },
      { label: 'Escaper', repo: 'https://github.com/InitPHP/Escaper' },
      { label: 'Validation', repo: 'https://github.com/InitPHP/Validation' },
      { label: 'Auth', repo: 'https://github.com/InitPHP/Auth' },
      { label: 'Input', repo: 'https://github.com/InitPHP/Input' },
    ],
  },
  {
    icon: 'fa6-solid:network-wired',
    title: 'Networking',
    desc: 'TCP/UDP sockets, mail sending, and real-time communication.',
    items: [
      { label: 'Socket', repo: 'https://github.com/InitPHP/Socket' },
      { label: 'Mailer', repo: 'https://github.com/InitPHP/Mailer' },
      { label: 'FiberLoops', repo: 'https://github.com/InitPHP/FiberLoops' },
    ],
  },
  {
    icon: 'fa6-solid:gear',
    title: 'Configuration',
    desc: 'Environment, config management, sessions, and cookies.',
    items: [
      { label: 'Config', repo: 'https://github.com/InitPHP/Config' },
      { label: 'DotENV', repo: 'https://github.com/InitPHP/DotENV' },
      { label: 'Sessions', repo: 'https://github.com/InitPHP/Sessions' },
      { label: 'Cookies', repo: 'https://github.com/InitPHP/Cookies' },
      { label: 'Container (PSR-11)', repo: 'https://github.com/InitPHP/Container' },
    ],
  },
  {
    icon: 'fa6-solid:toolbox',
    title: 'Utilities',
    desc: 'Logging, CLI tools, events, i18n, and general-purpose helpers.',
    items: [
      { label: 'Logger (PSR-3)', repo: 'https://github.com/InitPHP/Logger' },
      { label: 'Console', repo: 'https://github.com/InitPHP/Console' },
      { label: 'Events', repo: 'https://github.com/InitPHP/Events' },
      { label: 'Translator (i18n)', repo: 'https://github.com/InitPHP/Translator' },
      { label: 'PerformanceMeter', repo: 'https://github.com/InitPHP/PerformanceMeter' },
      { label: 'ParameterBag', repo: 'https://github.com/InitPHP/ParameterBag' },
    ],
  },
];
