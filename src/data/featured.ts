export interface Featured {
  name: string;
  stars: number;
  tag: string;
  desc: string;
  code: string;
  docs: string;
}

export const featured: Featured[] = [
  {
    name: 'Socket',
    stars: 10,
    tag: 'PHP 8.1+',
    desc: 'PHP Socket (TCP, TLS, UDP, SSL) Server/Client Library. Build real-time applications with low-level network communication.',
    code: 'https://github.com/InitPHP/Socket',
    docs: 'https://github.com/InitPHP/Socket/wiki',
  },
  {
    name: 'Database',
    stars: 6,
    tag: 'PHP 8.1+',
    desc: 'QueryBuilder, DBAL and ORM facade built on the InitORM stack, plus a server-side DataTables.js helper for paginated, searchable tables.',
    code: 'https://github.com/InitPHP/Database',
    docs: 'https://github.com/InitPHP/Database/wiki',
  },
  {
    name: 'Events',
    stars: 6,
    tag: 'PHP 5.6+',
    desc: 'Powerful event & hook system to plug into your application flow. Now bundles the EventEmitter primitive for building extensible, plugin-based architectures.',
    code: 'https://github.com/InitPHP/Events',
    docs: 'https://github.com/InitPHP/Events/wiki',
  },
  {
    name: 'FiberLoops',
    stars: 6,
    tag: 'PHP 8.1+',
    desc: 'Async-style concurrent programming with PHP Fibers. Run multiple tasks cooperatively without threads.',
    code: 'https://github.com/InitPHP/FiberLoops',
    docs: 'https://github.com/InitPHP/FiberLoops/wiki',
  },
  {
    name: 'Router',
    stars: 3,
    tag: 'PHP 8.1+',
    desc: 'Create and manage advanced routes for HTTP requests with groups, middleware, and named routes.',
    code: 'https://github.com/InitPHP/Router',
    docs: 'https://github.com/InitPHP/Router/wiki',
  },
  {
    name: 'Translator',
    stars: 3,
    tag: 'PHP 8.1+',
    desc: 'Micro library to add multi-language support to your projects. Lightweight and easy to integrate.',
    code: 'https://github.com/InitPHP/Translator',
    docs: 'https://github.com/InitPHP/Translator/wiki',
  },
];
