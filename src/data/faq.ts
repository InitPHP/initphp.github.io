import { libraries } from './libraries.ts';

/**
 * Homepage FAQ. Rendered as visible content *and* as FAQPage JSON-LD — the
 * two must stay identical, which is why both read this one array. Answers
 * are plain text on purpose: FAQPage answers may carry limited HTML, and
 * keeping them plain means the rendered copy and the structured copy cannot
 * drift apart.
 */
export interface Faq {
  q: string;
  a: string;
}

const count = libraries.length;
const oldest = 'PHP 5.6';
const newest = 'PHP 8.2';

export const faqs: Faq[] = [
  {
    q: 'What is InitPHP?',
    a: `InitPHP is an open source collection of ${count} standalone PHP libraries covering database access, HTTP routing, caching, encryption, sockets, queues and more. It is not a framework: there is no kernel, no service container you must boot, and no shared runtime. Each package is installed and used on its own.`,
  },
  {
    q: 'Do I have to use all of the libraries together?',
    a: 'No. Every package is published separately on Packagist and depends only on what it genuinely needs. You can install a single library into an existing application without adopting anything else from the ecosystem.',
  },
  {
    q: 'How do I install an InitPHP library?',
    a: 'Each library is a Composer package under the initphp vendor namespace. Run composer require initphp/<package>, for example composer require initphp/router or composer require initphp/database. Every library page on this site lists its exact install command.',
  },
  {
    q: 'Which PHP versions does InitPHP support?',
    a: `It depends on the package. The minimum ranges from ${oldest} for the smallest utility libraries up to ${newest} for the newest ones; most current releases target PHP 8.1 or later. The required version is listed on each library's page.`,
  },
  {
    q: 'Can I use InitPHP libraries with Laravel, Symfony or CodeIgniter?',
    a: 'Yes. The libraries are framework-agnostic and interoperate through PSR interfaces, so they can be dropped into any PHP application or framework that uses Composer.',
  },
  {
    q: 'Which PSR standards does InitPHP implement?',
    a: 'InitPHP HTTP implements PSR-7, PSR-17 and PSR-18; Container implements PSR-11; Cache implements PSR-16; Logger implements PSR-3; and Router consumes PSR-7 and PSR-11. That means they can be swapped for any other compliant implementation.',
  },
  {
    q: 'Is InitPHP free for commercial use?',
    a: 'Yes. Every InitPHP package is released under the MIT license, which permits commercial use, modification and redistribution as long as the copyright notice is retained.',
  },
  {
    q: 'Where is the documentation?',
    a: 'Each package documents itself in its GitHub wiki, linked from that library page on this site alongside its source repository and its Packagist listing.',
  },
];
