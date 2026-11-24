// Chữ cố định của giao diện (không phải nội dung do người dùng nhập trong CMS).
import type { Lang } from './content';

export const UI = {
  vi: {
    navAbout: 'Giới thiệu', navWorks: 'Tác phẩm', navContact: 'Liên hệ', navLabel: 'Mục chính', toTop: 'Về đầu trang',
    works: 'Tác phẩm', filterLabel: 'Lọc theo loại tranh', all: 'Tất cả', trailEnd: 'Con đường còn tiếp…',
    kind: { 'sang-tac': 'Tranh sáng tác', 'tranh-dat': 'Tranh đặt' },
    images: (n: number) => `${n} ảnh`, viewN: (n: number) => `Xem ${n} ảnh →`, viewWork: (t: string) => `Xem tác phẩm ${t}`,
    contact: 'Liên hệ', collab: 'Hợp tác', copy: 'Chép email', copied: 'Đã chép', selected: 'Đã chọn, nhấn Ctrl+C', open: 'Mở', phone: 'Điện thoại',
    rights: 'Mọi hình ảnh thuộc bản quyền tác giả.', madeBy: 'Làm bằng tay, có chút mực son.',
    back: '← Tất cả tác phẩm', fKind: 'Loại tranh', fClient: 'Khách đặt', fYear: 'Năm', fMedium: 'Chất liệu',
    next: 'Tác phẩm tiếp theo', enlarge: (k: number) => `Xem lớn ảnh ${k}`, viewer: 'Xem ảnh lớn',
    close: 'Đóng ✕', prev: '← Trước', nextImg: 'Sau →', switchTo: 'English', langName: 'Tiếng Việt', empty: 'Chưa có tác phẩm nào.',
  },
  en: {
    navAbout: 'About', navWorks: 'Works', navContact: 'Contact', navLabel: 'Main', toTop: 'Back to top',
    works: 'Works', filterLabel: 'Filter by type', all: 'All', trailEnd: 'The road goes on…',
    kind: { 'sang-tac': 'Personal work', 'tranh-dat': 'Commissions' },
    images: (n: number) => `${n} images`, viewN: (n: number) => `View ${n} images →`, viewWork: (t: string) => `View work ${t}`,
    contact: 'Contact', collab: 'Commissions', copy: 'Copy email', copied: 'Copied', selected: 'Selected, press Ctrl+C', open: 'Open', phone: 'Phone',
    rights: 'All images © the artist.', madeBy: 'Made by hand, with a touch of cinnabar.',
    back: '← All works', fKind: 'Type', fClient: 'Commissioned by', fYear: 'Year', fMedium: 'Medium',
    next: 'Next work', enlarge: (k: number) => `Enlarge image ${k}`, viewer: 'Image viewer',
    close: 'Close ✕', prev: '← Previous', nextImg: 'Next →', switchTo: 'Tiếng Việt', langName: 'English', empty: 'No works yet.',
  },
} as const;

export const t = (lang: Lang) => UI[lang];

/** Đường dẫn theo ngôn ngữ: tiếng Việt ở gốc, tiếng Anh dưới /en. */
export const home = (lang: Lang) => (lang === 'vi' ? '/' : '/en/');
export const workUrl = (lang: Lang, slug: string) => `${lang === 'vi' ? '' : '/en'}/tac-pham/${slug}/`;
