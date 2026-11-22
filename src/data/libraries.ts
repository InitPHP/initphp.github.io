/**
 * The single source of truth for every InitPHP package.
 *
 * Everything the site renders about a library — homepage cards, category
 * lists, the per-library pages, JSON-LD, llms.txt and the sitemap — is
 * derived from this array. Nothing about a package may be duplicated in
 * another data file, so a package can never disagree with itself between
 * two sections of the site.
 *
 * `version`, `released`, `php`, `psr`, `ext` and `deps` mirror the published
 * Packagist metadata; `stars` mirrors the GitHub repository. Refresh both
 * with `npm run refresh:stars` (stars) and by re-reading Packagist when a
 * package is tagged.
 *
 * Archived packages (initphp/cli-table, curl, event-emitter, http-client,
 * http-factory, polyfill-php80, redis, redis-session-handler, var-dumper)
 * are deliberately absent: they are marked abandoned on Packagist and must
 * not be advertised as installable.
 */
export interface Library {
  /** Display name, matching the GitHub repository name. */
  name: string;
  /** URL segment under /libraries/. */
  slug: string;
  /** Composer package name, e.g. "initphp/database". */
  pkg: string;
  repo: string;
  docs: string;
  packagist: string;
  icon: string;
  /** Terse label for the compact grid card. */
  desc: string;
  /** One sentence; drives each library page's meta description. */
  tagline: string;
  /** Full prose description shown on the library page. */
  summary: string;
  /** Human-readable minimum PHP, e.g. "8.1+". */
  php: string;
  /** Raw Composer constraint as published. */
  phpConstraint: string;
  /** Latest stable release. */
  version: string;
  /** ISO date of that release. */
  released: string;
  stars: number;
  category: string;
  /** PSR interfaces the package implements or consumes. */
  psr?: string[];
  /** Required PHP extensions. */
  ext?: string[];
  /** Other Composer packages pulled in. */
  deps?: string[];
  featured?: boolean;
}

export const libraries: Library[] = [
  {
    name: 'Database',
    slug: 'database',
    pkg: 'initphp/database',
    repo: 'https://github.com/InitPHP/Database',
    docs: 'https://github.com/InitPHP/Database/wiki',
    packagist: 'https://packagist.org/packages/initphp/database',
    icon: 'fa6-solid:database',
    desc: 'DBAL, Data Mapper, Query Builder, ORM',
    tagline: 'Query builder, DBAL and active-record ORM for PHP 8.2+, with a server-side DataTables.js helper built in.',
    summary:
      'PHP 8.2+ query builder, DBAL and active-record ORM — with a server-side DataTables.js helper out of the box. Built on the InitORM stack, so the query builder, DBAL and ORM layers can each be used on their own or stacked together.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '5.0.0',
    released: '2026-11-22',
    stars: 6,
    category: 'database',
    ext: ['pdo'],
    deps: ['initorm/orm'],
    featured: true,
  },
  {
    name: 'Router',
    slug: 'router',
    pkg: 'initphp/router',
    repo: 'https://github.com/InitPHP/Router',
    docs: 'https://github.com/InitPHP/Router/wiki',
    packagist: 'https://packagist.org/packages/initphp/router',
    icon: 'fa6-solid:route',
    desc: 'Advanced HTTP routing library',
    tagline: 'Framework-agnostic PSR-7 HTTP router for PHP 8.2+ with route groups, middleware, named routes and route caching.',
    summary:
      'Fast, framework-agnostic PSR-7 HTTP router for PHP 8.2+: route groups (prefix, domain, port, IP), middleware, dependency injection, named routes and URL generation, static file links and route caching.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 3,
    category: 'http',
    psr: ['PSR-7', 'PSR-11'],
    featured: true,
  },
  {
    name: 'Socket',
    slug: 'socket',
    pkg: 'initphp/socket',
    repo: 'https://github.com/InitPHP/Socket',
    docs: 'https://github.com/InitPHP/Socket/wiki',
    packagist: 'https://packagist.org/packages/initphp/socket',
    icon: 'fa6-solid:plug',
    desc: 'TCP, TLS, UDP, SSL Server/Client',
    tagline: 'TCP, UDP, TLS and SSL socket toolkit for PHP 8.2+ with a non-blocking, select-driven server loop.',
    summary:
      'Lightweight TCP, UDP, TLS and SSL socket toolkit for PHP 8.2+. Enum-driven factory, non-blocking select-driven server loop, and a per-transport Channel strategy for building real-time servers and clients.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 11,
    category: 'networking',
    ext: ['sockets', 'openssl'],
    featured: true,
  },
  {
    name: 'Events',
    slug: 'events',
    pkg: 'initphp/events',
    repo: 'https://github.com/InitPHP/Events',
    docs: 'https://github.com/InitPHP/Events/wiki',
    packagist: 'https://packagist.org/packages/initphp/events',
    icon: 'fa6-solid:bolt',
    desc: 'Event hooks for extensible architecture',
    tagline: 'Zero-dependency event and hook library for PHP 8.2+, bundling a static Events facade and an EventEmitter.',
    summary:
      'Tiny, zero-dependency event & hook library for PHP 8.2+ — a WordPress-style static Events facade and a Node-style EventEmitter, in one package, for building extensible plugin-based architectures.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 6,
    category: 'utilities',
    featured: true,
  },
  {
    name: 'FiberLoops',
    slug: 'fiberloops',
    pkg: 'initphp/fiber-loops',
    repo: 'https://github.com/InitPHP/FiberLoops',
    docs: 'https://github.com/InitPHP/FiberLoops/wiki',
    packagist: 'https://packagist.org/packages/initphp/fiber-loops',
    icon: 'fa6-solid:arrows-spin',
    desc: 'Async-style PHP Fiber loops',
    tagline: 'Minimal cooperative task scheduler for PHP 8.2+, built on native fibers — concurrency without threads.',
    summary:
      'A minimal cooperative task scheduler (event loop) for PHP, built on native fibers. Run multiple tasks concurrently without threads or extensions.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 6,
    category: 'networking',
    featured: true,
  },
  {
    name: 'Cache',
    slug: 'cache',
    pkg: 'initphp/cache',
    repo: 'https://github.com/InitPHP/Cache',
    docs: 'https://github.com/InitPHP/Cache/wiki',
    packagist: 'https://packagist.org/packages/initphp/cache',
    icon: 'fa6-solid:box-archive',
    desc: 'PSR-16 Simple Cache interface',
    tagline: 'PSR-16 Simple Cache implementation for PHP 8 with File, PDO, Redis, Memcache(d) and WinCache handlers.',
    summary:
      'PSR-16 (Simple Cache) implementation for PHP 8 with File, PDO, Redis, Memcache(d) and WinCache handlers behind one interface, so the storage backend can be swapped without touching call sites.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '2.0.0',
    released: '2026-11-22',
    stars: 2,
    category: 'database',
    psr: ['PSR-16'],
    deps: ['psr/simple-cache'],
  },
  {
    name: 'Encryption',
    slug: 'encryption',
    pkg: 'initphp/encryption',
    repo: 'https://github.com/InitPHP/Encryption',
    docs: 'https://github.com/InitPHP/Encryption/wiki',
    packagist: 'https://packagist.org/packages/initphp/encryption',
    icon: 'fa6-solid:lock',
    desc: 'OpenSSL & Sodium encryption',
    tagline: 'Authenticated symmetric encryption for PHP 8.2+ on top of OpenSSL and libsodium, with a versioned ciphertext format.',
    summary:
      'Secure, modern symmetric encryption for PHP 8.2+ on top of OpenSSL and libsodium — authenticated by default, versioned ciphertext format, single exception type.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 2,
    category: 'security',
  },
  {
    name: 'Validation',
    slug: 'validation',
    pkg: 'initphp/validation',
    repo: 'https://github.com/InitPHP/Validation',
    docs: 'https://github.com/InitPHP/Validation/wiki',
    packagist: 'https://packagist.org/packages/initphp/validation',
    icon: 'fa6-solid:check-double',
    desc: 'Data type & structure verification',
    tagline: 'Dependency-free data validation for PHP 8.2+ with a string rule DSL, custom rules and localized messages.',
    summary:
      'Fast, dependency-free data validation for PHP 8.2+ — a string rule DSL, callable and custom rules, and localized error messages.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 1,
    category: 'security',
    ext: ['mbstring'],
  },
  {
    name: 'Translator',
    slug: 'translator',
    pkg: 'initphp/translator',
    repo: 'https://github.com/InitPHP/Translator',
    docs: 'https://github.com/InitPHP/Translator/wiki',
    packagist: 'https://packagist.org/packages/initphp/translator',
    icon: 'fa6-solid:language',
    desc: 'Multi-language support',
    tagline: 'Dependency-free i18n translation for PHP 8.2+ with nested keys, placeholder interpolation and language fallback.',
    summary:
      'Dependency-free multi-language (i18n) translation library for PHP 8.2+ — file or directory language packs, dot-delimited nested keys, placeholder interpolation and default-language fallback.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '2.0.0',
    released: '2026-11-22',
    stars: 3,
    category: 'utilities',
    featured: true,
  },
  {
    name: 'Mailer',
    slug: 'mailer',
    pkg: 'initphp/mailer',
    repo: 'https://github.com/InitPHP/Mailer',
    docs: 'https://github.com/InitPHP/Mailer/wiki',
    packagist: 'https://packagist.org/packages/initphp/mailer',
    icon: 'fa6-solid:envelope',
    desc: 'Simple SMTP mail sending',
    tagline: 'Send e-mail through mail(), sendmail or SMTP with attachments, inline images and MIME multipart bodies.',
    summary:
      "Send e-mail via PHP's mail() function, sendmail or SMTP, with attachments, inline images and MIME multipart bodies.",
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 1,
    category: 'networking',
    ext: ['mbstring', 'iconv', 'fileinfo'],
  },
  {
    name: 'Logger',
    slug: 'logger',
    pkg: 'initphp/logger',
    repo: 'https://github.com/InitPHP/Logger',
    docs: 'https://github.com/InitPHP/Logger/wiki',
    packagist: 'https://packagist.org/packages/initphp/logger',
    icon: 'fa6-solid:file-lines',
    desc: 'PSR-3 logging to file or database',
    tagline: 'Focused PSR-3 logger for PHP 8.2+ with File and PDO handlers and a built-in multiplexer.',
    summary:
      'Small, focused PSR-3 logger for PHP 8.2+ — File and PDO handlers with a built-in multiplexer for writing one log line to several destinations.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 2,
    category: 'utilities',
    psr: ['PSR-3'],
    deps: ['psr/log'],
  },
  {
    name: 'HTTP',
    slug: 'http',
    pkg: 'initphp/http',
    repo: 'https://github.com/InitPHP/HTTP',
    docs: 'https://github.com/InitPHP/HTTP/wiki',
    packagist: 'https://packagist.org/packages/initphp/http',
    icon: 'fa6-solid:globe',
    desc: 'PSR-7 & PSR-17 HTTP Messages',
    tagline: 'PSR-7, PSR-17 and PSR-18 HTTP messages, factories, cURL client and SAPI emitter for PHP 8.2+.',
    summary:
      'Standards-compliant PSR-7, PSR-17 and PSR-18 HTTP messages, factories, cURL client, and SAPI response emitter for PHP 8.2+ (PSR-7 v1 and v2 compatible).',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '4.0.0',
    released: '2026-11-22',
    stars: 2,
    category: 'http',
    psr: ['PSR-7', 'PSR-17', 'PSR-18'],
    ext: ['json'],
  },
  {
    name: 'Config',
    slug: 'config',
    pkg: 'initphp/config',
    repo: 'https://github.com/InitPHP/Config',
    docs: 'https://github.com/InitPHP/Config/wiki',
    packagist: 'https://packagist.org/packages/initphp/config',
    icon: 'fa6-solid:sliders',
    desc: 'Configuration file management',
    tagline: 'Configuration manager for PHP 8.2+ with dotted-path access, case-insensitive keys and multiple loaders.',
    summary:
      'Advanced configuration manager for PHP with dotted-path access, case-insensitive keys, and array, file, directory and class loaders.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 2,
    category: 'config',
    deps: ['initphp/parameterbag'],
  },
  {
    name: 'DotENV',
    slug: 'dotenv',
    pkg: 'initphp/dotenv',
    repo: 'https://github.com/InitPHP/DotENV',
    docs: 'https://github.com/InitPHP/DotENV/wiki',
    packagist: 'https://packagist.org/packages/initphp/dotenv',
    icon: 'fa6-solid:file-code',
    desc: 'Load .env environment variables',
    tagline: 'Environment variable loader for PHP 8 reading .env and .env.php with type coercion and ${VAR} interpolation.',
    summary:
      'Environment variable loader for PHP 8 — reads .env and .env.php with type coercion and ${VAR} interpolation, so configuration stays out of version control.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '4.0.0',
    released: '2026-11-22',
    stars: 1,
    category: 'config',
  },
  {
    name: 'Container',
    slug: 'container',
    pkg: 'initphp/container',
    repo: 'https://github.com/InitPHP/Container',
    docs: 'https://github.com/InitPHP/Container/wiki',
    packagist: 'https://packagist.org/packages/initphp/container',
    icon: 'fa6-solid:cube',
    desc: 'PSR-11 dependency injection',
    tagline: 'PSR-11 dependency injection container for PHP 8.2+ with autowiring, lazy factories and interface binding.',
    summary:
      'Lightweight PSR-11 container — autowiring, lazy factories and interface binding for PHP 8.2+.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '2.0.0',
    released: '2026-11-22',
    stars: 1,
    category: 'config',
    psr: ['PSR-11'],
    deps: ['psr/container'],
  },
  {
    name: 'Escaper',
    slug: 'escaper',
    pkg: 'initphp/escaper',
    repo: 'https://github.com/InitPHP/Escaper',
    docs: 'https://github.com/InitPHP/Escaper/wiki',
    packagist: 'https://packagist.org/packages/initphp/escaper',
    icon: 'fa6-solid:shield',
    desc: 'HTML, JS, CSS, URL escaping',
    tagline: 'OWASP-aligned, context-aware output escaper for PHP 8.2+ covering HTML, attribute, JavaScript, CSS and URL contexts.',
    summary:
      'Context-aware output escaper for PHP (HTML, attribute, JavaScript, CSS, URL) — OWASP-aligned, dependency-free, PHP 8.2+.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 1,
    category: 'security',
    ext: ['ctype', 'mbstring'],
  },
  {
    name: 'Console',
    slug: 'console',
    pkg: 'initphp/console',
    repo: 'https://github.com/InitPHP/Console',
    docs: 'https://github.com/InitPHP/Console/wiki',
    packagist: 'https://packagist.org/packages/initphp/console',
    icon: 'fa6-solid:terminal',
    desc: 'CLI application helper',
    tagline: 'Helper library for writing console and CLI applications in PHP 8.2+.',
    summary:
      'A simple helper library that lets you write your console/CLI application with PHP, covering argument handling and formatted terminal output.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 0,
    category: 'utilities',
  },
  {
    name: 'Auth',
    slug: 'auth',
    pkg: 'initphp/auth',
    repo: 'https://github.com/InitPHP/Auth',
    docs: 'https://github.com/InitPHP/Auth/wiki',
    packagist: 'https://packagist.org/packages/initphp/auth',
    icon: 'fa6-solid:user-shield',
    desc: 'Authorization library',
    tagline: 'PHP 8 auth library with session, signed-cookie and custom storage adapters plus a permission set.',
    summary:
      'Lightweight PHP 8 auth library: session, signed-cookie, and custom storage adapters plus a case-insensitive permission set.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 0,
    category: 'security',
    ext: ['json', 'hash'],
    deps: ['initphp/parameterbag'],
  },
  {
    name: 'Sessions',
    slug: 'sessions',
    pkg: 'initphp/sessions',
    repo: 'https://github.com/InitPHP/Sessions',
    docs: 'https://github.com/InitPHP/Sessions/wiki',
    packagist: 'https://packagist.org/packages/initphp/sessions',
    icon: 'fa6-solid:key',
    desc: 'Session management',
    tagline: 'Framework-agnostic PHP 8.2+ session manager with File, Cookie, PDO, Redis, Memcached and MongoDB handlers.',
    summary:
      'Framework-agnostic PHP session manager with pluggable save handlers — File, Cookie, PDO, Redis, Memcached and MongoDB.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '5.0.0',
    released: '2026-11-22',
    stars: 0,
    category: 'config',
  },
  {
    name: 'Cookies',
    slug: 'cookies',
    pkg: 'initphp/cookies',
    repo: 'https://github.com/InitPHP/Cookies',
    docs: 'https://github.com/InitPHP/Cookies/wiki',
    packagist: 'https://packagist.org/packages/initphp/cookies',
    icon: 'fa6-solid:cookie-bite',
    desc: 'Secure signed cookies',
    tagline: 'Signed, tamper-evident cookie manager for PHP 8.2+ with HMAC-SHA256 integrity and per-key TTL.',
    summary:
      'A signed, tamper-evident cookie manager for PHP with HMAC-SHA256 integrity, per-key TTL, and hardened deserialization.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 0,
    category: 'config',
    deps: ['initphp/parameterbag'],
  },
  {
    name: 'ParameterBag',
    slug: 'parameterbag',
    pkg: 'initphp/parameterbag',
    repo: 'https://github.com/InitPHP/ParameterBag',
    docs: 'https://github.com/InitPHP/ParameterBag/wiki',
    packagist: 'https://packagist.org/packages/initphp/parameterbag',
    icon: 'fa6-solid:bag-shopping',
    desc: 'Key-value data storage',
    tagline: 'Dependency-free container for flat and nested data with dot-notation access and ArrayAccess support.',
    summary:
      'A small, dependency-free PHP container for flat and nested configuration data with dot-notation access, ArrayAccess support, and optional case-insensitive keys.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 2,
    category: 'utilities',
  },
  {
    name: 'Input',
    slug: 'input',
    pkg: 'initphp/input',
    repo: 'https://github.com/InitPHP/Input',
    docs: 'https://github.com/InitPHP/Input/wiki',
    packagist: 'https://packagist.org/packages/initphp/input',
    icon: 'fa6-solid:keyboard',
    desc: 'User input retrieval & validation',
    tagline: 'Read and validate GET, POST and JSON body input with configurable source priority for PHP 8.2+.',
    summary:
      'Read and validate GET, POST and JSON body input with configurable source priority, backed by InitPHP Validation for the rule layer.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 1,
    category: 'security',
    ext: ['json'],
    deps: ['initphp/parameterbag', 'initphp/validation'],
  },
  {
    name: 'PerformanceMeter',
    slug: 'performancemeter',
    pkg: 'initphp/performance-meter',
    repo: 'https://github.com/InitPHP/PerformanceMeter',
    docs: 'https://github.com/InitPHP/PerformanceMeter/wiki',
    packagist: 'https://packagist.org/packages/initphp/performance-meter',
    icon: 'fa6-solid:gauge-high',
    desc: 'Runtime benchmarking',
    tagline: 'Single-class PHP 8.2+ profiler measuring elapsed time and memory between named checkpoints.',
    summary:
      'Zero-dependency, single-class PHP profiler for measuring elapsed time and memory between named checkpoints. Built for tiny scripts, CLI tools, and reproducers where a real profiler is overkill.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 1,
    category: 'utilities',
  },
  {
    name: 'Barbarian',
    slug: 'barbarian',
    pkg: 'initphp/barbarian',
    repo: 'https://github.com/InitPHP/Barbarian',
    docs: 'https://github.com/InitPHP/Barbarian/wiki',
    packagist: 'https://packagist.org/packages/initphp/barbarian',
    icon: 'fa6-solid:arrow-up-from-bracket',
    desc: 'Database migration library',
    tagline: 'PDO-based database migration runner for MySQL, SQLite and PostgreSQL with a lightweight CLI.',
    summary:
      'A small, simple database migration library for PHP — a PDO-based runner for MySQL, SQLite and PostgreSQL with a lightweight CLI.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 0,
    category: 'database',
    ext: ['pdo', 'json'],
    deps: ['initphp/console'],
  },
  {
    name: 'Upload',
    slug: 'upload',
    pkg: 'initphp/upload',
    repo: 'https://github.com/InitPHP/Upload',
    docs: 'https://github.com/InitPHP/Upload/wiki',
    packagist: 'https://packagist.org/packages/initphp/upload',
    icon: 'fa6-solid:cloud-arrow-up',
    desc: 'File upload to local/remote',
    tagline: 'Validate and store uploaded files on local disk, FTP/FTPS or Amazon S3 through one adapter-based API.',
    summary:
      'Validate and store uploaded files on local disk, FTP/FTPS or Amazon S3 through a single, adapter-based API.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 0,
    category: 'http',
    ext: ['fileinfo'],
  },
  {
    name: 'Views',
    slug: 'views',
    pkg: 'initphp/views',
    repo: 'https://github.com/InitPHP/Views',
    docs: 'https://github.com/InitPHP/Views/wiki',
    packagist: 'https://packagist.org/packages/initphp/views',
    icon: 'fa6-solid:eye',
    desc: 'View/template rendering',
    tagline: 'Adapter-based view rendering for PHP 8: plain PHP, Blade or Twig behind one interface.',
    summary:
      'Small, adapter-based view rendering layer for PHP 8: render with plain PHP, Blade or Twig behind one interface.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '3.0.0',
    released: '2026-11-22',
    stars: 0,
    category: 'http',
  },
  {
    name: 'Queue',
    slug: 'queue',
    pkg: 'initphp/queue',
    repo: 'https://github.com/InitPHP/Queue',
    docs: 'https://github.com/InitPHP/Queue/wiki',
    packagist: 'https://packagist.org/packages/initphp/queue',
    icon: 'fa6-solid:list-check',
    desc: 'Job queue management',
    tagline: 'Framework-less queue worker for PHP 8.2+ with URN routing, retries, dead-letter handling and PDO/Redis/RabbitMQ transports.',
    summary:
      'The framework-less BabelQueue runtime for plain PHP — a polyglot queue worker with URN routing, retries and back-off, dead-letter handling and PDO, Redis and RabbitMQ transports.',
    php: '8.2+',
    phpConstraint: '^8.2',
    version: '2.2.0',
    released: '2026-11-22',
    stars: 0,
    category: 'database',
    ext: ['json'],
    deps: ['babelqueue/php-sdk'],
  },
];

/** Homepage "Featured Libraries" grid, in descending star order. */
export const featured: Library[] = libraries
  .filter((l) => l.featured)
  .sort((a, b) => b.stars - a.stars);

export const bySlug = (slug: string): Library | undefined =>
  libraries.find((l) => l.slug === slug);

/** Newest release date across the catalogue, used as the site's dateModified. */
export const lastReleased: string = libraries
  .map((l) => l.released)
  .sort()
  .at(-1)!;
