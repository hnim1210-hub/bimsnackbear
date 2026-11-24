# Kế hoạch bản đầu (v1)

## Mục tiêu
Gallery cá nhân của Bim · SnacK Bear: giới thiệu ở đầu trang, tác phẩm (sáng tác + tranh đặt) xếp dọc một con đường,
liên hệ ở cuối. Song ngữ Việt/Anh. Chủ kho tự thêm tranh, tải ảnh, kéo-thả thứ tự trên điện thoại hoặc máy tính, miễn phí.

## Công nghệ (đã chốt, có lý do)
| Phần | Chọn | Vì sao |
|---|---|---|
| Dựng web | Astro 7 (trang tĩnh) | Nhanh, tự tối ưu ảnh (WebP, nhiều cỡ), không cần máy chủ |
| Quản trị | Sveltia CMS 0.271 | Miễn phí; kéo-thả thứ tự (`reorder: true`); nhiều ảnh/tác phẩm; tự nén ảnh khi tải lên; hỗ trợ điện thoại |
| Đăng nhập CMS | Chìa khoá GitHub (fine-grained token) | Không cần máy chủ OAuth; có thể nâng cấp sau |
| Lưu trữ + đăng web | GitHub (kho riêng) + Cloudflare Pages | Miễn phí; mỗi lần lưu trong CMS là web tự cập nhật |
| Địa chỉ | `bimsnackbear.pages.dev` | Miễn phí; gắn tên miền riêng sau không phải làm lại |

## Mô hình dữ liệu
- `src/content/tac-pham/<slug>/index.yml` + ảnh cùng thư mục. Trường: `title_vi/en`, `loai` (sang-tac|tranh-dat),
  `khach_hang`, `nam`, `chat_lieu_vi/en`, `mo_ta_vi/en`, `anh_dai_dien`, `anh_chi_tiet[]`, `order` (CMS tự ghi khi kéo-thả).
- `src/data/thong-tin.yml` + ảnh chân dung: nghệ danh, con dấu, câu tuyên ngôn, giới thiệu, liên hệ, mô tả chia sẻ link.

## Tiêu chí hoàn thành
- [x] Trang chủ vi `/` và en `/en/`; trang chi tiết `/tac-pham/<slug>/` và `/en/tac-pham/<slug>/`
- [x] Con đường uốn nhẹ liền mạch, tự vẽ khi cuộn, máy bay giấy, điểm đỏ bật khi tới; bộ lọc Tất cả / Sáng tác / Tranh đặt
- [x] Trang chi tiết: thông tin (khách đặt chỉ với tranh đặt), bộ ảnh, xem ảnh lớn (phím ←/→, vuốt, Esc)
- [x] Ảnh tự tối ưu; không tràn ngang ở 1280px và điện thoại; không lỗi console
- [x] /admin: cấu hình hợp lệ theo schema chính thức của Sveltia; hiện màn hình đăng nhập
- [ ] Kết nối Cloudflare Pages (chủ kho làm, ~5 phút) → web chạy ở `bimsnackbear.pages.dev`
- [ ] Chủ kho tạo chìa khoá GitHub, đăng nhập /admin, thử thêm 1 tranh thật
- [ ] Thay nội dung mẫu bằng nội dung thật
