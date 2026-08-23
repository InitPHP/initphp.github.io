/**
 * Regenerates every derived icon and social image in public/ from the single
 * 700x700 master logo. Run with `npm run icons` after replacing the master.
 *
 * Rationale: before this script the 348 KB, 700x700 master was served *as*
 * the favicon and as the 32x32 navbar logo, and doubled as the og:image at
 * the wrong aspect ratio for a summary_large_image card.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const master = `${root}public/logos/initphp-icon-700.png`;
const out = `${root}public`;

const BRAND_BG = { r: 0x0a, g: 0x0e, b: 0x17, alpha: 1 };

/**
 * Assembles a PNG-in-ICO container by hand: sharp has no .ico encoder, and
 * every browser that still requests /favicon.ico accepts embedded PNGs.
 * Layout: 6-byte ICONDIR, then one 16-byte ICONDIRENTRY per image, then the
 * PNG payloads back to back.
 */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette colours
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const square = (size, background) =>
  sharp(master)
    .resize(size, size, { fit: 'contain', background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } })
    .flatten(background ? { background } : false)
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

await mkdir(out, { recursive: true });

// Transparent PNG favicons for the modern <link rel="icon"> path.
for (const size of [16, 32, 96]) {
  await writeFile(`${out}/favicon-${size}x${size}.png`, await square(size));
}

// /favicon.ico is still requested by crawlers and older clients at the root.
await writeFile(
  `${out}/favicon.ico`,
  buildIco(
    await Promise.all(
      [16, 32, 48].map(async (size) => ({ size, data: await square(size) })),
    ),
  ),
);

// iOS home-screen icons are composited on white if left transparent, so they
// get the brand background baked in.
await writeFile(`${out}/apple-touch-icon.png`, await square(180, BRAND_BG));

// Navbar logo. The 700x700 master was previously served straight into a
// 32x32 <img>, shipping 348 KB for 32 CSS pixels; 96px covers 3x displays.
await writeFile(`${out}/logos/initphp-icon-96.png`, await square(96));

// PWA manifest icons.
for (const size of [192, 512]) {
  await writeFile(`${out}/icon-${size}.png`, await square(size, BRAND_BG));
}

// 1200x630 social card. twitter:card is summary_large_image, which crops a
// square master badly; this lays the logo and wordmark out at 1.91:1 instead.
const W = 1200;
const H = 630;
const logo = await sharp(master).resize(220, 220, { fit: 'contain' }).png().toBuffer();

const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="34%" r="60%">
      <stop offset="0%" stop-color="#7c6ef0" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#7c6ef0" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0a0e17"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="${W / 2}" y="450" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="86" font-weight="700" fill="#e2e8f0">Init<tspan fill="#9d91f5">PHP</tspan></text>
  <text x="${W / 2}" y="512" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="34" fill="#94a3b8">27 modular, standalone PHP libraries</text>
  <text x="${W / 2}" y="566" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="26" letter-spacing="2" fill="#7c6ef0">MIT LICENSED &#183; PSR COMPLIANT</text>
  <rect width="${W}" height="6" y="${H - 6}" fill="#7c6ef0"/>
</svg>`);

await sharp({ create: { width: W, height: H, channels: 4, background: BRAND_BG } })
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logo, top: 110, left: Math.round((W - 220) / 2) },
  ])
  .png({ compressionLevel: 9 })
  .toFile(`${out}/og-image.png`);

console.log('icons + og-image written to public/');
