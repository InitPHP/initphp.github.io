export interface Library {
  name: string;
  repo: string;
  icon: string;
  desc: string;
}

export const libraries: Library[] = [
  { name: 'Database', repo: 'https://github.com/InitPHP/Database', icon: 'fa6-solid:database', desc: 'DBAL, Data Mapper, Query Builder, ORM' },
  { name: 'Router', repo: 'https://github.com/InitPHP/Router', icon: 'fa6-solid:route', desc: 'Advanced HTTP routing library' },
  { name: 'Socket', repo: 'https://github.com/InitPHP/Socket', icon: 'fa6-solid:plug', desc: 'TCP, TLS, UDP, SSL Server/Client' },
  { name: 'Events', repo: 'https://github.com/InitPHP/Events', icon: 'fa6-solid:bolt', desc: 'Event hooks for extensible architecture' },
  { name: 'FiberLoops', repo: 'https://github.com/InitPHP/FiberLoops', icon: 'fa6-solid:arrows-spin', desc: 'Async-style PHP Fiber loops' },
  { name: 'Cache', repo: 'https://github.com/InitPHP/Cache', icon: 'fa6-solid:box-archive', desc: 'PSR-16 Simple Cache interface' },
  { name: 'Encryption', repo: 'https://github.com/InitPHP/Encryption', icon: 'fa6-solid:lock', desc: 'OpenSSL & Sodium encryption' },
  { name: 'Validation', repo: 'https://github.com/InitPHP/Validation', icon: 'fa6-solid:check-double', desc: 'Data type & structure verification' },
  { name: 'Translator', repo: 'https://github.com/InitPHP/Translator', icon: 'fa6-solid:language', desc: 'Multi-language support' },
  { name: 'Mailer', repo: 'https://github.com/InitPHP/Mailer', icon: 'fa6-solid:envelope', desc: 'Simple SMTP mail sending' },
  { name: 'Logger', repo: 'https://github.com/InitPHP/Logger', icon: 'fa6-solid:file-lines', desc: 'PSR-3 logging to file or database' },
  { name: 'HTTP', repo: 'https://github.com/InitPHP/HTTP', icon: 'fa6-solid:globe', desc: 'PSR-7 & PSR-17 HTTP Messages' },
  { name: 'Config', repo: 'https://github.com/InitPHP/Config', icon: 'fa6-solid:sliders', desc: 'Configuration file management' },
  { name: 'DotENV', repo: 'https://github.com/InitPHP/DotENV', icon: 'fa6-solid:file-code', desc: 'Load .env environment variables' },
  { name: 'Container', repo: 'https://github.com/InitPHP/Container', icon: 'fa6-solid:cube', desc: 'PSR-11 dependency injection' },
  { name: 'Escaper', repo: 'https://github.com/InitPHP/Escaper', icon: 'fa6-solid:shield', desc: 'HTML, JS, CSS, URL escaping' },
  { name: 'Console', repo: 'https://github.com/InitPHP/Console', icon: 'fa6-solid:terminal', desc: 'CLI application helper' },
  { name: 'Auth', repo: 'https://github.com/InitPHP/Auth', icon: 'fa6-solid:user-shield', desc: 'Authorization library' },
  { name: 'Sessions', repo: 'https://github.com/InitPHP/Sessions', icon: 'fa6-solid:key', desc: 'Session management' },
  { name: 'Cookies', repo: 'https://github.com/InitPHP/Cookies', icon: 'fa6-solid:cookie-bite', desc: 'Secure signed cookies' },
  { name: 'ParameterBag', repo: 'https://github.com/InitPHP/ParameterBag', icon: 'fa6-solid:bag-shopping', desc: 'Key-value data storage' },
  { name: 'Input', repo: 'https://github.com/InitPHP/Input', icon: 'fa6-solid:keyboard', desc: 'User input retrieval & validation' },
  { name: 'PerformanceMeter', repo: 'https://github.com/InitPHP/PerformanceMeter', icon: 'fa6-solid:gauge-high', desc: 'Runtime benchmarking' },
  { name: 'Barbarian', repo: 'https://github.com/InitPHP/Barbarian', icon: 'fa6-solid:arrow-up-from-bracket', desc: 'Database migration library' },
  { name: 'Upload', repo: 'https://github.com/InitPHP/Upload', icon: 'fa6-solid:cloud-arrow-up', desc: 'File upload to local/remote' },
  { name: 'Views', repo: 'https://github.com/InitPHP/Views', icon: 'fa6-solid:eye', desc: 'View/template rendering' },
  { name: 'Queue', repo: 'https://github.com/InitPHP/Queue', icon: 'fa6-solid:list-check', desc: 'Job queue management' },
];
