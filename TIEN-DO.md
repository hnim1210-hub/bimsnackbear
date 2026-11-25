# Tiến độ

*Cập nhật: 24/11/2026*

## Đã có ✅
- Web Astro song ngữ (vi/en): giới thiệu đầu trang, con đường tác phẩm, trang chi tiết + xem ảnh lớn, liên hệ.
- Trang quản trị Sveltia CMS tại `/admin`, kéo-thả thứ tự, tải nhiều ảnh, tự nén WebP.
- Ô **Logo (ấn triện)** trong Giới thiệu & Liên hệ thay mọi vị trí logo (menu, chân dung, favicon, icon điện thoại, trang quản trị); trống thì dùng con dấu chữ.
- Ô **Dòng chữ dọc ở lề trái** (vi/en, mặc định "Mộc · Mực · Son"); xoá trắng để ẩn.
- Rê chuột vào ảnh đại diện trên con đường: sau ~1 giây tự chuyển lần lượt qua ảnh chi tiết (lặp), bỏ chuột về ảnh đại diện; chỉ trên máy có chuột (`src/scripts/hover-slides.ts`).
- Trang quản trị có logo, biểu tượng mục, nút Xem trên web, khung xem trước giống web (`public/admin/preview.*`).
- Đăng nhập qua **Sveltia CMS Additions** (Worker `bim-admin.hnim1210.workers.dev`): tài khoản riêng tên + mật khẩu.
- Web chạy trên Cloudflare **Pages**: `bimsnackbear.pages.dev`.
- Nội dung **mẫu**: 6 tác phẩm `mau-*` (3 sáng tác, 3 tranh đặt) + giới thiệu có chữ trong [ngoặc vuông] → chủ kho thay/xoá trong /admin.

## Quyết định đã chốt
- Xem bảng công nghệ trong `PLAN.md` và mục Thiết kế trong `CLAUDE.md`.
- Thứ tự tác phẩm = trường `order` do CMS ghi khi kéo-thả; tranh chưa có `order` xếp cuối.
- Không hiển thị năm trên con đường; năm chỉ ở trang chi tiết.
- Luôn nền sáng (`color-scheme: only light`), bỏ chế độ tối: tranh hiện trên cùng một nền với mọi người xem.

## Việc tiếp theo ⏭️
1. Chủ kho chạy trình cài đặt Additions (Use Admin Secret → tạo admin → cài GitHub App cho `bimsnackbear`).
2. Danh sách an toàn của Additions: bật 2FA Cloudflare + GitHub; thêm ruleset chặn force push/xoá trên `main` của kho này.
3. Xoá dự án Worker cũ `bimsnackbear` (bản tạo nhầm, `bimsnackbear.hnim1210.workers.dev`) nếu còn.
4. Chủ kho thay nội dung mẫu (`mau-*`) bằng nội dung thật.
5. (Tuỳ chọn) Tên miền riêng `bimsnackbear.com`; khi đổi, sửa `site` trong `astro.config.mjs` và `site_url` trong `public/admin/config.yml`.

## Vấn đề đã biết ⚠️
| Vấn đề | Cách xử lý |
|---|---|
| Phiên Claude đám mây bị chặn unpkg/jsdelivr nên /admin báo lỗi tải thư viện phụ khi thử tại chỗ | Không ảnh hưởng trên máy người dùng |
| Sveltia tự tải vài thư viện phụ từ unpkg/jsdelivr lúc chạy (immutable cho khung xem trước, bộ biểu tượng, phông giao diện) | Bình thường trên máy người dùng; trong phiên Claude đám mây bị chặn, khi thử phải giả lập |
| Astro 7.4 cần Node ≥ 22.23.4 | `.node-version` = 22.23.5; nếu Cloudflare báo lỗi Node, thêm biến môi trường `NODE_VERSION=22.23.5` |
