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
console.log('Đã chép Sveltia CMS vào public/admin');
