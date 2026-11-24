# Bim · SnacK Bear — gallery tranh

Web gallery của hoạ sĩ minh hoạ **Hoàng Ngân** (Bim · SnacK Bear): tranh sáng tác và tranh đặt,
hai thứ tiếng Việt / Anh, xếp dọc theo một con đường đỏ son.

- Web: `https://bimsnackbear.pages.dev` (sau khi kết nối Cloudflare Pages)
- Trang quản trị: `https://bimsnackbear.pages.dev/admin`

## Quản lý nội dung (không cần biết code)

1. Mở **/admin** trên máy tính hoặc điện thoại → **Sign In Using Access Token** → dán "chìa khoá" GitHub (xem dưới).
2. **Tác phẩm**: thêm / sửa / xoá tranh; tải ảnh đại diện và nhiều ảnh chi tiết (ảnh tự nén sang WebP, tối đa 2400px).
3. **Sắp thứ tự**: trong danh sách Tác phẩm, bấm nút sắp xếp (Reorder) rồi kéo-thả.
4. **Giới thiệu & Liên hệ**: nghệ danh, chữ trên con dấu, câu tuyên ngôn, giới thiệu, ảnh chân dung, email, mạng xã hội.
5. Bấm **Lưu (Save)** → khoảng 1–2 phút sau web tự cập nhật.

Mẹo nhập chữ:
- Câu tuyên ngôn: mỗi dòng là một dòng trên trang; `*chữ*` để tô đỏ nghiêng.
- Giới thiệu: cách một dòng trống để tách đoạn.
- Ô tiếng Anh bỏ trống thì bản tiếng Anh dùng chữ tiếng Việt.

### Tạo "chìa khoá" GitHub để đăng nhập trang quản trị (làm 1 lần mỗi năm)

GitHub → ảnh đại diện → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
→ **Generate new token**:
- Token name: `Quan tri web Bim`; Expiration: tối đa cho phép.
- Repository access: **Only select repositories** → `bimsnackbear`.
- Permissions → Repository permissions → **Contents: Read and write**.
- Generate → chép chuỗi `github_pat_…`, dán vào trang /admin. Không gửi chìa khoá này cho ai.

## Cấu trúc

```
public/admin/config.yml            cấu hình trang quản trị (Sveltia CMS)
src/content/tac-pham/<slug>/       mỗi tác phẩm 1 thư mục: index.yml + ảnh
src/data/thong-tin.yml             giới thiệu & liên hệ (+ ảnh chân dung cùng thư mục)
src/lib/content.ts                 đọc nội dung, kiểm tra ảnh
src/lib/i18n.ts                    chữ cố định của giao diện (vi/en)
src/components/Home.astro          trang chủ (giới thiệu, con đường tác phẩm, liên hệ)
src/components/WorkPage.astro      trang chi tiết tác phẩm + xem ảnh lớn
src/scripts/trail.ts               con đường, máy bay giấy, điểm đỏ, bộ lọc
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
