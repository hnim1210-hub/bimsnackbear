# Bim · SnacK Bear — web gallery tranh

Chủ kho: hoạ sĩ minh hoạ Hoàng Ngân (nghệ danh **Bim**, tiếng Anh **SnacK Bear** — chữ K viết hoa có chủ ý).
Người dùng nói tiếng Việt; trả lời bằng tiếng Việt, giải thích kỹ thuật kèm ví dụ đời thường.

## Bộ nhớ

- `TIEN-DO.md`: hiện trạng hệ thống, quyết định đã chốt, việc tiếp theo. Đọc trước khi làm, sửa cho đúng hiện trạng sau khi xong
  (không viết nhật ký; lịch sử chi tiết xem `git log`).
- `PLAN.md`: kế hoạch và tiêu chí hoàn thành của bản đầu.
- `README.md`: hướng dẫn cho chủ kho (quản lý nội dung, đăng nhập trang quản trị, Cloudflare).

## Luật

1. **Nội dung do chủ kho tự quản lý qua /admin (Sveltia CMS)**. Không sửa tay `src/content/` hay `src/data/`
   trừ khi được yêu cầu; nếu đổi tên/định dạng trường, sửa đồng bộ `public/admin/config.yml` + `src/lib/content.ts`.
2. **Thiết kế đã chốt** (đừng tự đổi): nền giấy dó gần trắng, mực đen ấm, đỏ son trầm `#9E2B3F`; **luôn nền sáng, không có chế độ tối**;
   Fraunces + Be Vietnam Pro; con đường uốn nhẹ liền mạch, điểm đỏ ở từng tác phẩm, máy bay giấy nét đỏ 2D;
   ảnh/chữ đổi bên xen kẽ; giới thiệu ở đầu trang; không có năm trên con đường.
3. Mọi chữ giao diện phải có đủ **vi + en** (`src/lib/i18n.ts`).
4. Tôn trọng `prefers-reduced-motion`; chỉ animate transform/opacity/clip-path.
5. Trước khi đẩy: `npm run build` phải qua; kiểm tra bằng Playwright ở 1280px và cỡ điện thoại (không tràn ngang, không lỗi console).
6. Không dùng dịch vụ trả phí khi chưa được đồng ý. Ảnh chỉ của chủ kho hoặc tự vẽ.
7. Phiên bản thư viện khoá chính xác trong `package.json`; Sveltia CMS được chép vào `public/admin` lúc build (không dùng CDN).
