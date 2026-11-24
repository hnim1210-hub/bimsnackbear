// Chép Sveltia CMS (đã cài qua npm, khoá phiên bản trong package.json) vào public/admin
// để trang quản trị không phụ thuộc CDN bên ngoài.
import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules/@sveltia/cms/dist');
const dest = join(root, 'public/admin');
const noMaps = (p) => !p.endsWith('.map');

mkdirSync(dest, { recursive: true });
cpSync(join(src, 'sveltia-cms.js'), join(dest, 'sveltia-cms.js'));
cpSync(join(src, 'chunks'), join(dest, 'chunks'), { recursive: true, filter: noMaps });
// Phông chữ cho khung xem trước trong trang quản trị (giống web thật)
const fonts = [
  ['@fontsource-variable/fraunces/files', ['latin', 'vietnamese'].flatMap((s) => [`fraunces-${s}-full-normal.woff2`, `fraunces-${s}-full-italic.woff2`])],
  ['@fontsource/be-vietnam-pro/files', ['latin', 'vietnamese'].flatMap((s) => [300, 400, 500].map((w) => `be-vietnam-pro-${s}-${w}-normal.woff2`))],
];
mkdirSync(join(dest, 'fonts'), { recursive: true });
for (const [dir, files] of fonts) for (const f of files) cpSync(join(root, 'node_modules', dir, f), join(dest, 'fonts', f));
console.log('Đã chép Sveltia CMS và phông chữ xem trước vào public/admin');
