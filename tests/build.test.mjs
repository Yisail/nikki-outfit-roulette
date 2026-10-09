import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
assert.ok(assets.some(asset => asset.endsWith('.js')));
assert.ok(assets.some(asset => asset.endsWith('.css')));
for (const asset of assets) {
  assert.ok(asset.startsWith('./assets/'), `Asset must be relative: ${asset}`);
  assert.ok((await stat(new URL('../dist/' + asset, import.meta.url))).isFile());
}
assert.ok(!html.includes('/src/') && !html.includes('@vite/client'));
console.log('Static artifact verified: relative JS/CSS paths and no development entrypoints.');
