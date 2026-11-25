# Kiến trúc nội dung và mở rộng

## Luồng hiện tại

`src/data/*` → `ContentRepository` trong `src/lib/content.ts` → Server Components → props có kiểu → Client Components / motion.

Client Components không import nguồn dữ liệu. Các animation chỉ biết DOM và props, không biết database. API adapter sau này có thể trả về cùng `Project`, `Skill`, `AchievementContent`, `SiteSettings` mà không đổi giao diện.

## Cấu trúc

- `src/app/`: layout, route, metadata và các stylesheet phân theo phạm vi.
- `src/components/`: Home, FeaturedSlider, SkillLab, ProjectShowcase, ProjectDetail, shell và visual.
- `src/hooks/use-scene-motion.ts`: GSAP context, ScrollTrigger, magnetic pointer handlers và cleanup.
- `src/components/motion-provider.tsx`: trạng thái loader, reduced motion và vòng lặp Lenis.
- `public/images/`: tài nguyên cục bộ, ảnh 1800px / 800px.
- `scripts/verify-export.mjs`: kiểm tra hợp đồng bản export.

## Khi thêm hệ quản trị

1. Tạo dịch vụ quản trị riêng chạy trên Cloudflare Worker hoặc runtime phù hợp, cùng trang `/admin` ở giai đoạn sau. Giữ website công khai static nếu cần.
2. Dữ liệu dự kiến: `projects`, `project_media`, `skills`, `achievements`, `site_settings`, `seo_metadata`; dùng slug duy nhất và trạng thái draft/published. D1 phù hợp nội dung dạng quan hệ, R2 hoặc nhà cung cấp ảnh phù hợp lưu media.
3. Xác thực và phân quyền phải được thực thi ở server. Không nhúng secrets hoặc quyền ghi vào static bundle. Upload qua endpoint đã xác thực hoặc URL có thời hạn; kiểm tra loại và kích thước tệp.
4. Adapter mới đọc nội dung đã xuất bản tại build time. Một lần publish nội dung gọi deploy hook để rebuild `out/`. Dự án hoặc slug mới chỉ có trên site sau lần build đó.
5. Nếu cần CRUD hoặc cập nhật nội dung tức thời trên cùng Next.js app, chuyển runtime sang phương án server phù hợp và bỏ `output: 'export'`. Không thể dùng các tính năng server đó trong HTML export hiện tại.
6. Bổ sung validation ở biên API, schema migrations, draft previews, audit log và image variants lúc triển khai thực tế.

Không tạo route `/admin` giả, form đăng nhập giả hay endpoint placeholder ở phiên bản này.

## Quy tắc nội dung

- Giữ ảnh và số liệu concept có nhãn; không biến ví dụ thành thành tựu thực tế.
- `Metric.verified` cần đi kèm `source`; nguồn phải được người quản trị kiểm chứng.
- Thêm domain thật trước khi cấu hình canonical, sitemap hoặc OpenGraph absolute URL.
- Đường dẫn ảnh responsive hiện được suy ra từ tên `*.jpg`. Khi dùng nhà cung cấp media, mở rộng `Media` với `srcSet`/`sizes` rồi cập nhật component ảnh chung.

## Phân tích tham khảo

- 01 Project Detail: hero phủ ảnh, metadata ngang, overview, challenge, solution, result, gallery bất đối xứng, tech stack, next project.
- 02 All Projects: tên lớn bên trái, mockup chiếm phần lớn bên phải, một cảnh cho mỗi dự án, thumbnail rail.
- 03 Home: hero Design/Develop/Market; About; Skill Lab; Impact; Featured; Marketing; Process; Contact.
- 04 Featured: active card lớn phía trước, các tấm ảnh lệch phải và lùi sâu, chuyển động phối hợp vị trí/scale/rotation. Không dùng lưới card.

Bảng màu: #F8FAFF / #FFFFFF / #2864F0 / #DCEAFF / navy. Manrope Variable. Bố cục 2 cột/12-column mental grid trên desktop, xếp dọc mobile. CSS 3D đủ cho các tấm phẳng; không thêm WebGL để tránh tải và context GPU không cần thiết.
