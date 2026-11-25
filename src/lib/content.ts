// Đọc nội dung do trang quản trị (Sveltia CMS) lưu:
//   src/content/tac-pham/<slug>/index.yml  + ảnh của tranh nằm cùng thư mục
//   src/data/thong-tin.yml                 + ảnh chân dung nằm cùng thư mục
// Ảnh được nạp qua import.meta.glob để Astro tự tối ưu (WebP, nhiều cỡ).
import { parse } from 'yaml';
import type { ImageMetadata } from 'astro';

export type Lang = 'vi' | 'en';
export const LANGS: Lang[] = ['vi', 'en'];

export interface Work {
  slug: string;
  order: number;
  title: Record<Lang, string>;
  kind: 'sang-tac' | 'tranh-dat';
  client?: string;
  year?: number;
  medium: Record<Lang, string>;
  description: Record<Lang, string>;
  cover: ImageMetadata;
  images: ImageMetadata[]; // ảnh đại diện + ảnh chi tiết
}

export interface Profile {
  name: Record<Lang, string>;
  seal: string;
  /** Logo / ấn triện tải lên trong CMS; không có thì dùng con dấu chữ `seal` */
  logo?: ImageMetadata;
  role: Record<Lang, string>;
  headline: Record<Lang, string>;
  bio: Record<Lang, string>;
  portrait?: ImageMetadata;
  portraitCaption: Record<Lang, string>;
  ask: Record<Lang, string>;
  status: Record<Lang, string>;
  email: string;
  instagram?: string;
  behance?: string;
  phone?: string;
  seo: Record<Lang, string>;
}

const workFiles = import.meta.glob<string>('/src/content/tac-pham/*/index.yml', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const workImages = import.meta.glob<ImageMetadata>(
  '/src/content/tac-pham/*/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { import: 'default', eager: true },
);
const profileFile = import.meta.glob<string>('/src/data/thong-tin.yml', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const profileImages = import.meta.glob<ImageMetadata>(
  '/src/data/*.{jpg,jpeg,png,webp,avif,svg,JPG,JPEG,PNG,WEBP,SVG}',
  { import: 'default', eager: true },
);

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v));
const pair = (vi: unknown, en: unknown): Record<Lang, string> => {
  const v = str(vi);
  return { vi: v, en: str(en) || v };
};

/** Tìm ảnh theo đường dẫn CMS lưu ("ten.webp", "./ten.webp" hay "/src/...") trong một thư mục. */
function findImage(map: Record<string, ImageMetadata>, dir: string, ref: unknown, where: string) {
  const name = str(ref).split('/').pop();
  if (!name) return undefined;
  const img = map[`${dir}/${name}`];
  if (!img) throw new Error(`Không tìm thấy ảnh "${str(ref)}" (${where}). Kiểm tra lại tên ảnh trong trang quản trị.`);
  return img;
}

let worksCache: Work[] | undefined;
export function getWorks(): Work[] {
  if (worksCache) return worksCache;
  const list = Object.entries(workFiles).map(([file, raw], i) => {
    const dir = file.replace(/\/index\.yml$/, '');
    const slug = dir.split('/').pop()!;
    const d = (parse(raw) ?? {}) as Record<string, unknown>;
    const where = `tác phẩm "${slug}"`;
    const cover = findImage(workImages, dir, d.anh_dai_dien, where);
    if (!cover) throw new Error(`Tác phẩm "${slug}" chưa có ảnh đại diện.`);
    const details = (Array.isArray(d.anh_chi_tiet) ? d.anh_chi_tiet : d.anh_chi_tiet ? [d.anh_chi_tiet] : [])
      .map((r) => findImage(workImages, dir, r, where))
      .filter((x): x is ImageMetadata => !!x);
    const year = Number(d.nam);
    return {
      slug,
      order: Number.isFinite(Number(d.order)) ? Number(d.order) : 10_000 + i,
      title: pair(d.title_vi || slug, d.title_en),
      kind: d.loai === 'tranh-dat' ? 'tranh-dat' : 'sang-tac',
      client: str(d.khach_hang) || undefined,
      year: Number.isFinite(year) && year > 0 ? year : undefined,
      medium: pair(d.chat_lieu_vi, d.chat_lieu_en),
      description: pair(d.mo_ta_vi, d.mo_ta_en),
      cover,
      images: [cover, ...details],
    } satisfies Work;
  });
  // Thứ tự do người dùng kéo-thả trong CMS (trường "order"); tranh chưa sắp thì xếp cuối.
  worksCache = list.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  return worksCache;
}

export function getProfile(): Profile {
  const raw = Object.values(profileFile)[0];
  if (!raw) throw new Error('Thiếu file src/data/thong-tin.yml');
  const d = (parse(raw) ?? {}) as Record<string, unknown>;
  return {
    name: pair(d.nghe_danh_vi, d.nghe_danh_en),
    seal: str(d.con_dau) || 'Bim',
    logo: findImage(profileImages, '/src/data', d.logo, 'logo'),
    role: pair(d.vai_tro_vi, d.vai_tro_en),
    headline: pair(d.tieu_de_vi, d.tieu_de_en),
    bio: pair(d.gioi_thieu_vi, d.gioi_thieu_en),
    portrait: findImage(profileImages, '/src/data', d.anh_chan_dung, 'ảnh chân dung'),
    portraitCaption: pair(d.chu_thich_anh_vi, d.chu_thich_anh_en),
    ask: pair(d.cau_hoi_vi, d.cau_hoi_en),
    status: pair(d.trang_thai_vi, d.trang_thai_en),
    email: str(d.email),
    instagram: str(d.instagram) || undefined,
    behance: str(d.behance) || undefined,
    phone: str(d.dien_thoai) || undefined,
    seo: pair(d.mo_ta_seo_vi, d.mo_ta_seo_en),
  };
}

/** "*chữ*" → <em>chữ</em> (sau khi đã thoát HTML). */
export function emphasize(text: string) {
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
export const lines = (text: string) => text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
export const paragraphs = (text: string) => text.split(/\r?\n\s*\r?\n/).map((s) => s.trim()).filter(Boolean);
