# Premium portfolio refinement

Bản cập nhật mới nhất: [WordPress, Process dọc, marquee và responsive](refinements.md). Những quyết định/timing bên dưới mô tả đợt redesign trước.

## Audit và phạm vi

Làm trên source hiện có, giữ Next.js App Router, static export, content adapter, GSAP/ScrollTrigger và Lenis. Tham chiếu bốn hình thiết kế trước đó và storyboard sáu cảnh. Không có screenshot toàn trang mới hoặc ảnh đánh dấu microcopy đi kèm lượt yêu cầu này; audit dựa trên mã đang có và những hình đã cung cấp.

| Phần      | Quyết định                | Thay đổi                                                                                                                                                   |
| --------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero      | Giữ bố cục                | Headline, mockup nghiêng và nền xanh giữ nguyên. Body 16–17px, CTA rõ hơn, tăng chiều cao tối thiểu để chữ và nút có đủ chỗ.                               |
| Intro     | Giữ choreography sáu cảnh | Thêm nhận diện Next.js/React và Google/Facebook trong panel đúng ngữ cảnh. Vẫn dùng một timeline 6,2s và Hero thật.                                        |
| About     | Tinh chỉnh                | Monogram cá nhân có tilt, tên và vai trò rõ hơn, bỏ lời nhắc cập nhật ảnh, rút gọn đoạn giới thiệu. Không tạo chân dung giả.                               |
| Skills    | Nâng cấp                  | Năm nhóm; kết hợp SEO với Optimization. Panel lớn hơn, logo local, active state, nội dung đổi khi hover/focus/chạm. Mobile dùng các nút trong luồng trang. |
| Value     | Thiết kế lại              | Bỏ nền núi và ba cột. Câu chuyện Build → Connect → Grow với mockup website, code, đường nối SVG, Search, ad creative và chart minh họa.                    |
| Featured  | Giữ và nâng cấp           | Không đổi sang grid/carousel thường. Tăng sân khấu, chiều sâu, cỡ chữ, CTA và khoảng trống; caption vào cùng chuyển slide.                                 |
| Marketing | Thiết kế biên tập         | Tiêu đề lớn, danh sách khía cạnh đo lường, một chart chính và logo nền tảng; bỏ các hộp KPI rỗng.                                                          |
| Process   | Tinh giản                 | Bốn bước, chữ dễ đọc, line nối và trạng thái bước theo scroll. Mobile chuyển thành timeline dọc.                                                           |
| Contact   | Tăng nhấn                 | Tiêu đề lớn, CTA rõ, liên hệ dễ đọc, dải kính xanh nối ngôn ngữ Hero/intro.                                                                                |

## Motion và tương tác

`GrowthStory` dùng một timeline với ba nhãn `build`, `connect`, `grow`. ScrollTrigger scrub theo vị trí section, không pin hay chặn wheel. Website hiện trước, đường nối được vẽ, rồi Search/Ads và chart xuất hiện. Cuộn ngược quay lại cùng trạng thái. Cleanup nằm trong GSAP context; reduced motion giữ toàn bộ nội dung ở trạng thái hoàn chỉnh. _(Đã gỡ khỏi trang chủ ngày 2026-11-26 để rút ngắn trang.)_

Slider giữ click, next/previous, dots, phím trái/phải, swipe và liên kết detail. Vai trò/công nghệ mở khi hover hoặc focus; thiết bị không hover thấy metadata của project active. Chỉ active card có tilt. Kết quả chỉ hiển thị nếu có `verified` và nguồn. Hủy caption tween và xóa style tạm khi đổi slide để không giữ chữ ở trạng thái nửa ẩn khi nhấn liên tục.

Bỏ lệnh cuộn về 0 sau khi intro hoàn tất; scroll lock phục hồi vị trí gốc, Next.js tiếp tục phụ trách điều hướng. Lenis vẫn khởi tạo sau intro. Pointer tilt được reset khi chuyển sang reduced motion hoặc card mất active.

## Nội dung và logo

Không có metrics đã xác minh trong dữ liệu hiện tại. Vì vậy không hiển thị KPI, phần trăm tăng trưởng, chiến dịch hay thứ hạng giả. Chart và visual marketing luôn có nhãn minh họa. Bốn project vẫn giữ trạng thái concept và nội dung cũ.

Logo React, Next.js, TypeScript, Figma, Google, Facebook được lưu tại `public/brands`, định nghĩa trong `src/data/brands.ts`, truy cập qua `getBrand` trong content adapter. Không dùng CDN runtime hoặc thêm thư viện UI.

React/Next.js/TypeScript/Figma đã có trong dữ liệu kỹ năng. Google thể hiện bối cảnh SEO/tìm kiếm; Facebook thể hiện nội dung và quảng cáo. Không thêm WordPress, Google Analytics hoặc Search Console như kỹ năng đã được xác nhận vì danh sách kỹ năng hiện tại chưa xác nhận các công cụ đó. Không dùng logo làm bằng chứng khách hàng, đối tác hoặc chứng chỉ.

Đã bỏ “CHẠM ĐỂ KHÁM PHÁ”, “7 giai đoạn minh họa”, lời nhắc ảnh cá nhân và nhãn trang trí ở cạnh Hero. Nhãn concept, chú thích minh họa và aria-label chức năng vẫn giữ.

## File chính

- `src/components/growth-story.tsx`, `src/lib/motion/growth-story.ts`: Value section và scroll story.
- `src/components/marketing-story.tsx`: bố cục dữ liệu biên tập và lọc KPI đã xác minh.
- `src/components/brand.tsx`, `src/data/brands.ts`, `public/brands/`: hệ thống logo.
- `src/app/refinements.css`: typography, bố cục và responsive trên design system hiện tại.
- `src/components/home.tsx`, `skill-lab.tsx`, `featured-slider.tsx`, `ui.tsx`: tích hợp và tinh chỉnh tương tác.
- `src/data/site-settings.ts`, `skills.ts`: nội dung được rút gọn và nhóm kỹ năng.
- `src/components/preloader.tsx`, `motion-provider.tsx`, `src/hooks/use-scene-motion.ts`: logo intro, scroll restoration và chart/process motion.

## Kiểm thử và giới hạn

Đã qua production build và static export: sáu route nội dung, 285 local references. `verify:redesign` kiểm tra năm skill, bốn project, ba chương Value, bốn bước Process, bỏ microcopy dư, không KPI chưa xác minh, nhãn minh họa, logo hợp lệ và chỉ một Hero.

17 kiểm thử motion/resource bằng Node/jsdom và GSAP thật: 15 ca intro trước đó và hai ca scroll story, gồm forward/reverse, thứ tự nội dung xuất hiện và context cleanup.

```powershell
npm.cmd run test:motion
npm.cmd run build
npm.cmd run verify:export
npm.cmd run verify:redesign
npm.cmd run dev
```

Mở http://127.0.0.1:3000/?intro=replay để phát lại intro; cuộn đến `#value`, `#skills`, `#featured`.

Chưa xác nhận trực quan trên trình duyệt: công cụ trả về `apps: [], browsers: []`. Không có screenshot, đo FPS/Lighthouse, kiểm tra console/hydration hoặc thao tác touch thật. Không coi các kiểm thử DOM là chứng minh về độ mượt/độ giống reference.

Các viewport cần kiểm tra khi có trình duyệt: 1440×900, 1366×768, 820×1180, 390×844, 360×800 và mobile ngang. Ưu tiên Hero không chồng CTA, Value không cắt chữ, năm skill luôn truy cập được, slider nhấn nhanh/vuốt/bàn phím, reduced motion, điều hướng rồi quay lại và tải chậm/ảnh lỗi.

## Skills scroll burst

Skills uses two independent layers: `.skill-burst` positions and animates the entire box; the `.skill-tile` button owns hover tilt. The boxes begin gathered around the measured `.lab-core` center, then expand into their existing layout as the visitor scrolls. ScrollTrigger runs from `top 85%` to `bottom 65%` with `scrub: 1.1`; scrolling back contracts the composition. The longer scroll range and `sine.inOut` easing distribute the burst across the section instead of front-loading expansion. Geometry recalculates on refresh. Mobile uses a smaller burst, and reduced motion keeps the normal expanded layout.

No opacity or visibility tween can trap these buttons in a hidden state. The initial transform is applied synchronously (`lazy: false`) to avoid a frame of expanded cards before the gathered state. Context cleanup restores the authored layout.

Three regression tests check the gathered center → expanded positions → reverse sequence, independent hover transforms and cleanup, and compact geometry without a visible core. The full motion suite now has 20 tests. Browser visual confirmation remains pending because no browser is connected.
