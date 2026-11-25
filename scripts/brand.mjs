// Tạo các ảnh logo có đường dẫn cố định cho: biểu tượng tab trình duyệt, biểu tượng màn hình chính
// điện thoại và logo trang quản trị. Nguồn: ô "Logo (ấn triện)" trong src/data/thong-tin.yml;
// nếu trống thì dùng con dấu mặc định src/assets/con-dau-mac-dinh.svg.
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parse } from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = parse(readFileSync(join(root, 'src/data/thong-tin.yml'), 'utf8')) ?? {};
const fallback = join(root, 'src/assets/con-dau-mac-dinh.svg');
let src = fallback;
if (typeof data.logo === 'string' && data.logo.trim()) {
  const candidate = join(root, 'src/data', basename(data.logo.trim()));
  if (existsSync(candidate)) src = candidate;
  else console.warn(`Không thấy ảnh logo "${data.logo}" trong src/data, dùng con dấu mặc định.`);
}

const out = join(root, 'public/brand');
mkdirSync(out, { recursive: true });
const clear = { r: 0, g: 0, b: 0, alpha: 0 };
const paper = { r: 252, g: 251, b: 248, alpha: 1 }; // #FCFBF8
const img = () => sharp(readFileSync(src), { density: 384 });

await img().resize(512, 512, { fit: 'contain', background: clear }).png().toFile(join(out, 'logo.png'));
await img().resize(32, 32, { fit: 'contain', background: clear }).png().toFile(join(out, 'favicon-32.png'));
// iPhone/Android không hiển thị nền trong suốt đẹp: đặt logo lên nền giấy, chừa lề
await sharp({ create: { width: 180, height: 180, channels: 4, background: paper } })
  .composite([{ input: await img().resize(140, 140, { fit: 'contain', background: clear }).png().toBuffer(), gravity: 'center' }])
  .png()
  .toFile(join(out, 'apple-touch-icon.png'));
console.log(`Đã tạo logo từ ${src === fallback ? 'con dấu mặc định' : basename(src)} vào public/brand`);
