# Featured Projects — Orbit → Horizontal

Ngày 06/11/2026. Thay thế đúng một Featured Projects theo prompt mới; không thêm section thứ hai. Đây là kế hoạch triển khai và ghi chú kiểm chứng cho thay đổi frontend, không phải triển khai CMS.

## Audit và phạm vi

- Điểm tích hợp cũ: `src/components/featured-slider.tsx`, được Home truyền `projects.filter(p => p.featured)` và `copy.featured`.
- Slider cũ dùng active index, click/swipe và xếp chồng thẻ; không có trình tự orbital theo cuộn. Component đã được thay hoàn toàn nhưng giữ tên export để không sửa Home.
- Dữ liệu hiện có: bốn project concept, slug ổn định, ảnh có biến thể JPG 800px. Không thêm dự án, công nghệ, khách hàng hay số liệu giả.
- MotionProvider đã cung cấp Lenis/GSAP ticker và trạng thái ready/reduced. Controller mới dùng ScrollTrigger chung, không tạo Lenis hoặc RAF loop riêng.
- Preloader, Hero, About, Skills, Growth, Services Stack, Marketing, Process, Contact, navigation và detail layouts không thay đổi.
- Không có bốn screenshot mới trong lượt gửi này; triển khai theo nội dung choreography của prompt, dùng màu và ảnh hiện có.

## Kế hoạch và kết quả triển khai

1. **Layout:** heading FEATURED / PROJECTS cỡ lớn, bản chữ outline phía sau, nền #F8FAFF với icy-blue gradient, liên kết toàn bộ dự án, một bộ project cards.
2. **Orbit:** tính đường ellipse với depth, scale, rotateY/Z theo tiến độ cuộn. Các thẻ đi vào từ phía trên; ảnh phía trước lớn hơn ảnh phía sau.
3. **Morph:** giảm tốc quay, hạ tâm quỹ đạo, trải thẻ thành cung ngang rồi duỗi phẳng. Không remount các project chính giữa giai đoạn.
4. **Showcase:** vòng lặp ngang 26px/s sau khi duỗi phẳng, tái chế thẻ ngoài khung nhìn. Các bản sao chỉ phục vụ loop, không tạo project mới hoặc thêm keyboard stops.
5. **Interaction:** hover dừng autoplay trên thẻ; focus dừng trong section; Tab/arrow/Home/End đưa project có focus vào vùng nhìn thấy. Kéo ngang có ngưỡng phân biệt với thao tác cuộn dọc và chặn click sau drag; click thật vẫn đi đúng route.
6. **Responsive:** desktop/tablet đủ chiều cao dùng full sequence. Dưới 768px hoặc chiều cao dưới 540px dùng gallery native swipe không pin, không autoplay. Reduced-motion cũng dùng layout tự nhiên, không tilt/transitions.
7. **Verification:** tests hình học + DOM/GSAP thực, production build, export/assets/link checks. Quan sát browser còn cần thực hiện vì phiên hiện tại không cung cấp browser khả dụng.

## Choreography

Một timeline dài 1 đơn vị, một ScrollTrigger pin stage trong khoảng 5.4 lần chiều cao viewport. Scrub 0.65 giây.

| Label                    | Tiến độ | Vai trò                                       |
| ------------------------ | ------: | --------------------------------------------- |
| typographyReveal         |      0% | Chữ lớn là trung tâm bố cục                   |
| orbitEntrance            |     12% | Thẻ từ phía trên đi vào quỹ đạo               |
| orbitRotation            |     28% | Quay theo cuộn, có chiều sâu                  |
| orbitDescent             |     52% | Tâm quỹ đạo hạ xuống, bắt đầu dàn ngang       |
| horizontalTransformation |     70% | Cung cong duỗi phẳng, thẻ tăng kích thước     |
| galleryReveal            |     86% | Kết thúc morph, bắt đầu autoplay              |
| Release                  |    100% | Nhả pin sau khoảng giữ gallery ~0.76 viewport |

Cuộn ngược dùng cùng hàm hình học, không tween reset. Khi rời giai đoạn gallery, autoplay dừng và offset được giữ rồi hòa về quỹ đạo theo tiến độ. Ba lớp transform độc lập: outer card cho scroll, inner loop cho autoplay/drag, link surface cho hover.

Các vị trí được tính từ kích thước stage khi setup/resize, không đọc layout trong từng frame. React không setState khi cuộn. Một GSAP ticker callback chỉ cập nhật loop khi gallery hoàn tất, nhìn thấy, không hover/focus/drag và tab đang hoạt động. Cleanup hủy observers/listeners/ticker, context và pin spacer.

Tham khảo API: [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) và [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/). Dùng một pin và matchMedia cleanup theo tài liệu GSAP.

## File thay đổi

- `src/components/featured-slider.tsx`: markup mới, dữ liệu/route cũ, breakpoint và lifecycle.
- `src/components/featured-orbit.module.css`: styles riêng; không dùng class slider cũ để tránh rule cũ tác động.
- `src/lib/motion/featured-orbit.ts`: geometry, interpolation, loop wrapping và autoplay gate độc lập dữ liệu.
- `src/lib/motion/featured-controller.ts`: GSAP clock, ScrollTrigger, sự kiện và cleanup.
- `src/data/site-settings.ts`: chỉ thêm title/collection label trong `featured`.
- `tests/featured-orbit.test.mjs`, `tests/featured-controller.test.mjs`: các trường hợp kết thúc morph, reverse, nối phase, loop ngoài viewport, gate autoplay, pin/cleanup/remount.
- `scripts/verify-featured.mjs`: kiểm chứng HTML build, ảnh, link, copy aria-hidden và không có slider cũ.
- `scripts/verify-redesign.mjs`: cập nhật selector kiểm tra Featured sang markup mới; giữ các kiểm tra section khác.

## Kiểm tra trên máy

```powershell
npm run test:motion
npm run build
npm run verify:export
npm run verify:redesign
node scripts/verify-services.mjs
node scripts/verify-featured.mjs
```

Preview: `http://127.0.0.1:3000/#featured` nếu local preview đang chạy; hoặc `npm run preview` sau build. Khi mở bằng fragment lần đầu, đợi intro kết thúc để controller được kích hoạt.

Checklist browser còn cần quan sát, không đánh dấu đã PASS bằng kiểm tra DOM:

- Desktop 1440×900 và 1920×1080: cuộn chậm qua sáu label, cuộn ngược sau autoplay, cuộn nhanh vượt pin rồi quay lại.
- Tablet 820×1180; mobile 390×844 và landscape: resize, không overflow ngang toàn trang, native swipe và cuộn dọc tự nhiên.
- Hover từng thẻ, rời thẻ, focus bằng Tab, Arrow/Home/End, click thường và Ctrl/Cmd click; drag không mở route ngoài ý muốn.
- Rời viewport/ẩn tab: loop dừng; quay lại không nhảy frame lớn. Reduced-motion tắt pin và giữ mọi link.
- Sau gallery, Marketing đến theo document flow, không có đệm trắng riêng; Services phía trên vẫn đi hết hành trình thẻ thứ ba.
- Kiểm tra console, ảnh decode, tốc độ khung hình và cảm nhận easing trên thiết bị thật.

Giới hạn dữ liệu: 0 featured projects không render section; 1 project dùng gallery tĩnh không loop. Số project nhiều hơn vẫn dùng cùng thuật toán và thứ tự data. Slug hiện là định danh ổn định vì schema hiện tại chưa có ID riêng. Chưa đổi CMS/backend.

## Kết quả chạy cuối

- `npm run test:motion`: **33/33 PASS**, gồm kiểm tra GSAP/DOM pin, reverse, cleanup và các regression motion có sẵn.
- `npm run build`: **PASS**, giữ static export và bốn route chi tiết dự án.
- `verify:export`: **PASS**, 6 content routes và 342 local references.
- `verify:redesign`, `verify-services.mjs`, `verify-featured.mjs`: **PASS**.
- HTTP local `127.0.0.1:3000/`: **200**, HTML có Featured orbit mới, không còn markup stack-stage cũ.
- Chưa kiểm tra browser trực quan/FPS: inventory không có browser; mở IAB trả `Browser is not available: iab`. Các kiểm tra DOM không thay thế bước quan sát này.
## Bản sửa lỗi trắng khi cuộn (06/11/2026)

Bản đầu vượt qua kiểm tra timeline nhưng còn lỗi tích hợp: route bọc bởi `.page-enter` với animation `transform` có fill-mode `both`. Fixed pin bên trong ancestor này có thể nằm ngoài viewport. Screenshot của người dùng xác nhận vùng Featured trắng; không được xem test DOM đơn thuần là kiểm chứng giao diện.

Bản sửa:

- `pinReparent: true` để scene đang pin ra body, thoát containing block của route.
- Chuyển CSS trạng thái enhanced/gallery/dragging sang chính stage; focus listeners cũng gắn vào stage. Vì thế reparent không làm mất style hoặc tương tác.
- Chờ animation entrance của ancestor hoàn tất rồi mới khởi tạo và đo pin. Có cancellation khi unmount/chuyển breakpoint.
- Regression test bổ sung thao tác scroll qua ScrollTrigger thực, kiểm tra stage được reparent, stylesheet vẫn đặt card absolute, nhả pin và cleanup ngay lúc đang pin.

Kiểm chứng: browser log của tab người dùng từng ghi `top:11640` (ngoài màn hình), sau sửa ghi `top:0`, stage height=viewport=1039 qua nhiều lần cuộn tiến/lùi. Người dùng xác nhận **“Đã thấy chữ và ảnh dự án”**. Log chẩn đoán tạm đã được gỡ. Bộ motion hiện **34/34 PASS**. Đây là xác nhận từ screenshot/log runtime và người dùng; agent vẫn chưa có quyền điều khiển trình duyệt để tự kiểm tra toàn bộ viewport/FPS/interaction checklist.

Tham khảo cơ chế: [GSAP pinReparent](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [MDN animation fill mode](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations/Using).
## Sửa mốc cuộn Marketing / Process (07/11/2026)

Sau khi Featured chờ route entrance rồi mới mount, pin được tạo muộn hơn các ScrollTrigger Marketing và Process. Refresh theo thứ tự tạo khiến hai section sau đo vị trí trước khi spacer Featured được khôi phục. Animation vì thế chạy sớm, trong lúc người dùng vẫn ở gallery.

Thêm `refreshPriority: 1` cho pin Featured: tính lại khoảng pin trước các trigger phụ thuộc. Giữ nguyên thiết kế, choreography hai section và các chữ phụ đã xóa. Regression test mô phỏng normal flow từ padding thực của pin-spacer: trước sửa Marketing bắt đầu 1101px, thiếu ~4860px pin; sau sửa mốc tính đủ khoảng pin. Test kiểm tra cả forward/reverse và cả hai animation chưa chạy khi đang ở Featured.

Bộ 35 motion tests, production build và export/redesign/services/featured checks đã qua. Chưa nhận xác nhận giao diện từ người dùng trong lượt sửa này; không coi kết quả DOM test là kiểm chứng hình ảnh thực tế.

Cơ chế refresh order theo [GSAP ScrollTrigger.sort](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.sort/).