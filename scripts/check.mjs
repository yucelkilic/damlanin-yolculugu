import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const seen = new Set();
for (const id of ids) {
  if (seen.has(id)) throw new Error(`Duplicate id: ${id}`);
  seen.add(id);
}
for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const url = match[1];
  if (/^(?:https?:|data:|mailto:)/.test(url) || url === '#') continue;
  if (url.startsWith('#')) {
    if (!seen.has(url.slice(1))) throw new Error(`Missing anchor: ${url}`);
  } else {
    await access(resolve(root, url.endsWith('/') ? `${url}index.html` : url));
  }
}
const presentation = await readFile(resolve(root, 'sunum/index.html'), 'utf8');
if (!presentation.includes('Damla') || !presentation.includes('slides')) {
  throw new Error('Presentation is missing or invalid.');
}
console.log('Site links, anchors and presentation validated.');
