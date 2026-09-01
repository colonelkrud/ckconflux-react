import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getPageMetadata, ROUTE_PATHS } from '../src/metadata/pageMetadata.js';

const distDir = join(process.cwd(), 'dist');
const template = await readFile(join(distDir, 'index.html'), 'utf8');

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

function renderMetadata(pathname, { notFound = false } = {}) {
  const metadata = getPageMetadata(pathname);
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const url = escapeHtml(metadata.url);

  let html = template
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${description}" />`);

  const routeTags = [
    `<link rel="canonical" href="${url}" />`,
    ...(metadata.robots ? [`<meta name="robots" content="${escapeHtml(metadata.robots)}" />`] : []),
    '<meta property="og:type" content="website" />',
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    '<meta name="twitter:card" content="summary" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ].join('\n    ');

  return html.replace('</head>', `    ${routeTags}\n  </head>`);
}

for (const pathname of ROUTE_PATHS) {
  const output = pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`;
  await writeFile(join(distDir, output), renderMetadata(pathname), 'utf8');
}

await writeFile(join(distDir, '404.html'), renderMetadata('/404', { notFound: true }), 'utf8');
