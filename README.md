# Bim · SnacK Bear — gallery tranh

Web gallery của hoạ sĩ minh hoạ **Hoàng Ngân** (Bim · SnacK Bear): tranh sáng tác và tranh đặt,
hai thứ tiếng Việt / Anh, xếp dọc theo một con đường đỏ son.

- Web: `https://bimsnackbear.pages.dev`
- Trang quản trị: `https://bimsnackbear.pages.dev/admin`

## Quản lý nội dung (không cần biết code)

1. Mở **/admin** trên máy tính hoặc điện thoại → đăng nhập bằng **tên + mật khẩu** tài khoản quản trị.
2. **Tác phẩm**: thêm / sửa / xoá tranh; tải ảnh đại diện và nhiều ảnh chi tiết (ảnh tự nén nhẹ sang WebP chất lượng 92, cạnh dài tối đa 3000px).
3. **Sắp thứ tự**: trong danh sách Tác phẩm, bấm nút sắp xếp (Reorder) rồi kéo-thả.
4. **Giới thiệu & Liên hệ**: nghệ danh, **logo (ấn triện)**, chữ trên con dấu, câu tuyên ngôn, giới thiệu, ảnh chân dung, email, mạng xã hội.
5. Bấm **Lưu (Save)** → khoảng 1–2 phút sau web tự cập nhật.

Khi sửa, khung **Xem trước** bên phải hiện nội dung đúng kiểu trình bày trên web (thẻ trên con đường, trang chi tiết,
bản tiếng Anh; đầu trang và phần Liên hệ). Nút **Xem trên web** mở trang thật của tranh đang sửa.

Mẹo nhập chữ:
- Câu tuyên ngôn: mỗi dòng là một dòng trên trang; `*chữ*` để tô đỏ nghiêng.
- Giới thiệu: cách một dòng trống để tách đoạn.
- Ô tiếng Anh bỏ trống thì bản tiếng Anh dùng chữ tiếng Việt.

### Đăng nhập trang quản trị (Sveltia CMS Additions)

"Phòng bảo vệ" chạy miễn phí trên Cloudflare: Worker `bim-admin` (`https://bim-admin.hnim1210.workers.dev`),
mã nguồn ở một kho riêng do nút Deploy tạo. Nó giữ danh sách tài khoản và thay mặt mọi người ghi vào kho này
qua một GitHub App chỉ được cài cho kho `bimsnackbear`.

- **Lần đầu**: mở /admin → **Use Admin Secret** → dán `ADMIN_SECRET` (đã lưu trong trình quản lý mật khẩu)
  → tạo tài khoản quản trị → đăng ký GitHub App, cài **Only select repositories** → `bimsnackbear`.
- **Hằng ngày**: đăng nhập bằng tên + mật khẩu tài khoản quản trị.
- **Thêm người** (trợ lý…): Administration → Users.
- **Quên mật khẩu**: /admin → Use Admin Secret → Reset Admin Password.
- **Mất `ADMIN_SECRET`**: đặt cái mới trong Cloudflare (Worker `bim-admin` → Settings → Variables and Secrets),
  mở trình cài đặt bằng nó → Start Over (giữ mật khẩu, phải cài lại khoá của GitHub App).
- **Cập nhật**: khi GitHub mở đề xuất (pull request) cập nhật trong kho của Worker, bấm Merge.

## Cấu trúc

```
public/admin/config.yml            cấu hình trang quản trị (Sveltia CMS)
public/admin/preview.js|css       khung xem trước giống web trong trang quản trị
scripts/brand.mjs                  tạo biểu tượng tab, màn hình điện thoại, logo trang quản trị (public/brand/) từ ô Logo
src/assets/con-dau-mac-dinh.svg    con dấu mặc định khi chưa tải logo
src/components/SealMark.astro      logo/con dấu trên thanh menu và ảnh chân dung
src/content/tac-pham/<slug>/       mỗi tác phẩm 1 thư mục: index.yml + ảnh
src/data/thong-tin.yml             giới thiệu & liên hệ (+ ảnh chân dung cùng thư mục)
src/lib/content.ts                 đọc nội dung, kiểm tra ảnh
src/lib/i18n.ts                    chữ cố định của giao diện (vi/en)
src/components/Home.astro          trang chủ (giới thiệu, con đường tác phẩm, liên hệ)
src/components/WorkPage.astro      trang chi tiết tác phẩm + xem ảnh lớn
src/scripts/trail.ts               con đường, máy bay giấy, điểm đỏ, bộ lọc
src/scripts/hover-slides.ts        rê chuột vào ảnh đại diện → tự chuyển qua các ảnh của tác phẩm
src/styles/global.css              giao diện (màu son trầm #9E2B3F)
```

Đường dẫn: tiếng Việt `/`, `/tac-pham/<slug>/`; tiếng Anh `/en/`, `/en/tac-pham/<slug>/`.

## Chạy trên máy (cho người làm code)

Cần Node 22.23.4 trở lên (`.node-version`).

```sh
npm install
npm run dev      # http://localhost:4321  (admin: /admin → "Work with Local Repository")
npm run build    # xuất ra dist/
```

## Đưa lên Cloudflare Pages

Workers & Pages → Create → **Pages** → Connect to Git → chọn `bimsnackbear`
→ Project name `bimsnackbear` → Framework preset **Astro** → Build command `npm run build` → Output `dist` → Deploy.
Mỗi lần có commit mới trên `main` (kể cả từ trang quản trị), Cloudflare tự dựng lại web.
