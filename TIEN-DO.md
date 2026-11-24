# Tiến độ

*Cập nhật: 24/11/2026*

## Đã có ✅
- Web Astro song ngữ (vi/en): giới thiệu đầu trang, con đường tác phẩm, trang chi tiết + xem ảnh lớn, liên hệ.
- Trang quản trị Sveltia CMS tại `/admin` (đăng nhập bằng chìa khoá GitHub), kéo-thả thứ tự, tải nhiều ảnh, tự nén WebP.
- Nội dung **mẫu**: 6 tác phẩm `mau-*` (3 sáng tác, 3 tranh đặt) + giới thiệu có chữ trong [ngoặc vuông] → chủ kho thay/xoá trong /admin.

## Quyết định đã chốt
- Xem bảng công nghệ trong `PLAN.md` và mục Thiết kế trong `CLAUDE.md`.
- Thứ tự tác phẩm = trường `order` do CMS ghi khi kéo-thả; tranh chưa có `order` xếp cuối.
- Không hiển thị năm trên con đường; năm chỉ ở trang chi tiết.

## Việc tiếp theo ⏭️
1. Chủ kho kết nối Cloudflare Pages với kho (hướng dẫn trong `README.md`).
2. Chủ kho tạo chìa khoá GitHub, đăng nhập /admin, thay nội dung mẫu.
3. (Tuỳ chọn) Đăng nhập một chạm: Cloudflare Worker `sveltia-cms-auth` thay cho chìa khoá.
4. (Tuỳ chọn) Tên miền riêng `bimsnackbear.com`; khi đổi, sửa `site` trong `astro.config.mjs` và `site_url` trong `public/admin/config.yml`.

## Vấn đề đã biết ⚠️
| Vấn đề | Cách xử lý |
|---|---|
| Phiên Claude đám mây bị chặn unpkg/jsdelivr nên /admin báo lỗi tải thư viện phụ khi thử tại chỗ | Không ảnh hưởng trên máy người dùng |
| Astro 7.4 cần Node ≥ 22.23.4 | `.node-version` = 22.23.5; nếu Cloudflare báo lỗi Node, thêm biến môi trường `NODE_VERSION=22.23.5` |
