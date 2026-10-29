// Screenshot the site at 1280x720 and optionally diff against a reference image.
// usage: node tools/shot.mjs [--hash '#/xbox-live'] [--out shot.png] [--ref ref.png] [--diff diff.png]
//                            [--width 1280 --height 720] [--wait 600] [--eval 'js'] [--full 1]
// Chromium may need extra shared libraries; pass their directory in PW_LIBS.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
  if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1]]);
  return acc;
}, []));
const width = Number(args.width ?? 1280);
const height = Number(args.height ?? 720);

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const url = `http://127.0.0.1:${server.address().port}/${args.hash ?? ''}`;

const env = { ...process.env };
if (process.env.PW_LIBS) env.LD_LIBRARY_PATH = `${process.env.PW_LIBS}:${process.env.LD_LIBRARY_PATH ?? ''}`;
const browser = await chromium.launch({ env });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[${m.type()}]`, m.text()); });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('requestfailed', (r) => console.log('[requestfailed]', r.url()));
page.on('response', (r) => { if (r.status() >= 400) console.log('[http', r.status() + ']', r.url()); });
await page.goto(url);
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => window.__dashReady === true, null, { timeout: 5000 }).catch(() => console.log('[warn] __dashReady not set'));
if (args.eval) {
  const result = await page.evaluate(args.eval);
  if (result !== undefined) console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 1));
}
await page.waitForTimeout(Number(args.wait ?? 600));
const out = args.out ?? 'shot.png';
await page.screenshot({ path: out, fullPage: !!args.full });
await browser.close();
server.close();

if (args.ref) {
  const a = PNG.sync.read(fs.readFileSync(out));
  const b = PNG.sync.read(fs.readFileSync(args.ref));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(`size mismatch: shot ${a.width}x${a.height}, ref ${b.width}x${b.height}`);
  } else {
    const diff = new PNG({ width: a.width, height: a.height });
    const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.15 });
    if (args.diff) fs.writeFileSync(args.diff, PNG.sync.write(diff));
    console.log(`mismatch: ${(100 * n / (a.width * a.height)).toFixed(2)}% (${n} px)`);
  }
}
console.log(`saved ${out}`);
