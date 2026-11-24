// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Đổi khi gắn tên miền riêng (dùng cho thẻ chia sẻ link và canonical).
  site: 'https://bimsnackbear.pages.dev',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
