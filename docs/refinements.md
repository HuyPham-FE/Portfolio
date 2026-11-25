# Refinement theo feedback — WordPress, Process và responsive

## Thay đổi

- WordPress được xác nhận là công nghệ dùng thường xuyên, nên xuất hiện đầu nhóm Web Development, trong danh sách tools, intro, Value và marquee. Không tự đổi công nghệ của các concept project đã có.
- Skills dùng ba dòng riêng: “Thiết kế.” / “Lập trình.” / “Kết nối tăng trưởng.”. Font theo chiều rộng thực của khối tiêu đề (`cqw`), từng dòng không ngắt giữa cụm từ. Box được căn lại theo bố cục có chủ đích, selected nổi bật hơn.
- Hiệu ứng bung Skills vẫn là cả box từ tâm ra ngoài. Trigger bắt đầu khi lab vào 85% viewport, kết thúc khi đáy chính section Skills tới 85% viewport. `scrub: true` bỏ độ trễ bám cuộn; không pin, không cần cuộn sang section sau để chờ chuyển động hoàn tất. Hover vẫn ở lớp button độc lập.
- Process thay hoàn toàn hàng ngang bằng bốn scene dọc: số bước và progress line bên trái, nội dung ở giữa, hình minh họa riêng bên phải. Mobile xếp hình dưới nội dung. Line vẽ theo cuộn, active step đổi màu và hình reveal nhẹ. Không tạo số liệu thật giả hoặc dùng ảnh chân dung AI.
- Value bỏ hàng Build / Connect / Grow. Mockup, code và marketing được đặt trong grid có chiều cao theo nội dung, không còn canvas mobile có chiều cao cố định. SVG connector tính lại theo vị trí hai khối bằng ResizeObserver, chuyển tự nhiên sang đường dọc trên mobile.
- Thêm marquee 11 công nghệ/nền tảng: WordPress, Next.js, React, GSAP, JavaScript, HTML5, CSS, TypeScript, Figma, Google, Facebook. Hai track giống nhau chạy liên tục trong 48 giây/vòng; bản lặp được ẩn khỏi screen reader.
- Theo yêu cầu bổ sung của người dùng, **không có nút tạm dừng**. Hover/focus giữ track đứng yên; reduced motion trình bày một danh sách tĩnh có xuống hàng.

Google Analytics và Search Console chưa được thêm như kỹ năng đã xác nhận. Logo Google/Facebook thể hiện ngữ cảnh SEO/quảng cáo, không phải khách hàng hoặc chứng chỉ.

## File chính

- `src/components/process-story.tsx`: narrative và GSAP context riêng cho process.
- `public/images/process-*.svg`: bốn hình vector code-native; `docs/qa-assets/process-contact-sheet.png` là contact sheet đã render và xem lại.
- `src/components/technology-marquee.tsx`: marquee không nút điều khiển.
- `src/components/growth-story.tsx`: grid composition và đường nối bám layout.
- `src/components/skill-lab.tsx`: tiêu đề tách dòng, điểm kết thúc scroll trong section.
- `src/app/feedback.css`: responsive, heading, process, marquee và Value.
- `src/data/site-settings.ts`, `skills.ts`, `brands.ts`: nội dung và bộ công nghệ.

## Xác nhận

- `npm run test:motion`: 20 kiểm thử GSAP/resource đã qua, bao gồm core → expanded → reverse của Skills, hover isolation và cleanup.
- `npm run build`: production static export thành công.
- `npm run verify:export`: sáu route, 316 tham chiếu local, metadata/contact/404.
- `npm run verify:redesign`: giữ năm skill và bốn project, bỏ hàng nhãn Value, có bốn hình process, WordPress hiện trong Web Development, tiêu đề ba dòng, marquee hai track với bản lặp ẩn và không có button.
- Bốn hình SVG process được render thành PNG và kiểm tra trực quan ở contact sheet.

**Chưa kiểm tra website bằng browser:** inventory công cụ trả `apps: [], browsers: []`. Render SVG asset không thay thế kiểm tra layout, scroll, FPS, hydration hoặc marquee trong trình duyệt. Cần xem ở desktop, tablet, 390px/360px và mobile ngang khi có browser.

Xem tại http://127.0.0.1:3000/ rồi Ctrl+F5. Kiểm tra từ About → Skills → marquee → Value; cuối trang là Process dọc mới. Dùng `/?intro=replay` nếu muốn phát lại intro có WordPress.
