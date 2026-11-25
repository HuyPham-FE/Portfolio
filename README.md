# Phạm Quang Huy — Interactive Portfolio

Portfolio Next.js App Router + TypeScript, Tailwind CSS, GSAP/ScrollTrigger và Lenis. Xuất HTML tĩnh cho Cloudflare Pages. Không có API server, Admin, WordPress, Vite hoặc React Router.

## Chạy trên Windows

```powershell
cd D:\Profile\huy-portfolio
npm.cmd install
npm.cmd run dev
```

Mở http://127.0.0.1:3000. Dùng `npm` thay cho `npm.cmd` nếu shell cho phép. Font Manrope và ảnh được phục vụ từ dự án, không phụ thuộc CDN lúc chạy.

## Build và kiểm tra bản xuất

```powershell
npm.cmd run build
npm.cmd run verify:export
npm.cmd run preview
```

`out/` là thư mục deploy. `preview` chỉ là server hỗ trợ xem thử trên máy, không tham gia runtime production. Dừng bằng Ctrl+C.

## Thay nội dung

- `src/data/site-settings.ts`: tên, email, số điện thoại, navigation, SEO và toàn bộ copy.
- `src/data/projects.ts`: dự án, slug, media, metadata, thách thức, giải pháp, kết quả.
- `src/data/skills.ts`: kỹ năng và thông tin tương tác.
- `src/data/achievements.ts`: thành tựu đã xác minh và dữ liệu biểu đồ minh họa riêng.
- `src/types/content.ts`: hợp đồng dữ liệu.
- `src/lib/content.ts`: cổng truy cập nội dung duy nhất của giao diện.

Bốn dự án hiện là **concept minh họa**, không phải hồ sơ khách hàng đã xác minh. Ảnh lấy từ Unsplash và ghi rõ định hướng minh họa. Chân dung dùng placeholder chữ, không giả làm ảnh thật. Thành tích thực tế để trống. Chỉ metric có `verified: true` và `source` mới được hiển thị như kết quả. Trước khi ra mắt, thay concept bằng dự án thật, ảnh sản phẩm và nguồn chứng minh.

Khi thêm ảnh, cập nhật media và phiên bản responsive: hiện ảnh gốc 1800px và hậu tố `-800.jpg`. Mỗi dự án mới tự sinh route qua `generateStaticParams()` khi build lại.

## Refinement mới nhất

Xem [feedback refinement](docs/refinements.md): WordPress, tiêu đề Skills ba dòng, Process dọc với hình riêng, Value tự co giãn và marquee logo không nút điều khiển.

## Redesign

Xem [audit và các thay đổi](docs/redesign.md). Value mới kể câu chuyện Build → Connect → Grow; Skills gồm năm nhóm; Featured vẫn giữ slider xếp lớp; Marketing chỉ đưa KPI đã xác minh lên giao diện. Logo được phục vụ cục bộ, nguồn ghi trong [assets](docs/assets.md).

Chạy `npm run test:motion` và `npm run verify:redesign` để kiểm tra thêm timeline và nội dung bản redesign.

## Motion

Xem [Glass Unfold](docs/glass-unfold.md) để hiểu choreography và phát lại intro qua `/?intro=replay`. Chạy `npm run test:intro` để kiểm tra lifecycle, synchronization và fallback (Node 24).

- Cinematic intro gồm Wake → Assemble → Flow → Focus → Reveal Threshold → Hero Reveal, không dùng counter hoặc progress bar. Mỗi phiên chạy một lần.
- Master timeline 6,2 giây chờ ảnh decode/font ở Focus (3,8s). Glass mask mở trang thật; Hero entrance chồng lên đoạn cuối từ 4,55s. Asset timeout 6,5 giây và recovery deadline 11 giây tránh giữ người xem vô hạn.
- Featured: GSAP xếp lớp perspective, previous/next, dots, phím trái/phải, drag/swipe; không tự chạy, không giữ cuộn của người dùng.
- Skill Lab: năm nhóm kỹ năng, logo nền tảng, chọn bằng chuột/chạm/bàn phím và tilt có kiểm soát.
- Value: một timeline Build → Connect → Grow theo cuộn, không pin hoặc chặn wheel.
- All Projects: từng cảnh gần một viewport, hình scale/rotate theo cuộn, rail thumbnail.
- Biểu đồ SVG vẽ theo scroll; timeline quy trình; magnetic CTA.
- Lenis chạy cùng GSAP ticker. Context, tween, observer và listener được cleanup khi unmount. Tôn trọng reduced motion.

## Cloudflare Pages

Dùng preset **Next.js (Static HTML Export)**:

- Build command: `npm run build`
- Output directory: `out`
- Node: 24 (file `.node-version`)
- Nếu repo chứa thư mục cha, root directory là `huy-portfolio`.

Có thể tải trực tiếp nội dung `out/` lên Pages hoặc kết nối repository để tự build. Không cần Worker, secrets hay database cho phiên bản này. Không cấu hình SPA catch-all vì đã có route HTML và `404.html` thật. Chưa đăng ký hoặc deploy lên tài khoản Cloudflare.

Tài liệu chính thức: [Next.js static export](https://nextjs.org/docs/app/guides/static-exports), [Cloudflare Pages static Next.js](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

## Mở rộng Admin

Xem `docs/architecture.md`. Admin, xác thực, CRUD, upload và database mới ở mức kiến trúc, chưa triển khai.

## Kiểm thử

Build production và TypeScript được kiểm tra; `verify:export` kiểm tra các route, đường dẫn/anchor, assets, metadata, liên hệ và nhãn concept. Trình duyệt tích hợp và Windows Computer Use không khả dụng trong phiên triển khai, nên kiểm thử trực quan, console, swipe thực và hiệu năng chưa được xác nhận. Xem `docs/qa.md` để hoàn tất trước khi xuất bản.
