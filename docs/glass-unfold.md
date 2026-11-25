# Cinematic Portfolio Intro — sáu cảnh liên tục

## Xem lại

Chạy `npm.cmd run dev`, mở http://127.0.0.1:3000/?intro=replay rồi reload. Query bỏ qua session flag, không cần xóa cache. Phiên thường dùng khóa `huy-cinematic-intro-v3` và chỉ chạy intro một lần. Điều hướng nội bộ không phát lại intro.

## Choreography — một master timeline 6,2 giây

| Nhãn              | Thời gian | Hành vi                                                                                                         |
| ----------------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| `wake`            | 0–0,8s    | Quả cầu kính, vòng quỹ đạo và ánh sáng dưới chân xuất hiện; các mảnh kính nhỏ mở không gian.                    |
| `assemble`        | 0,8–1,8s  | Panel danh tính, ảnh concept hiện có và panel công nghệ ghép lại quanh quả cầu.                                 |
| `flow`            | 1,8–2,9s  | Cùng các panel đó dịch chuyển theo chiều sâu; ribbon nối phần thiết kế, lập trình và biểu đồ tìm kiếm minh họa. |
| `focus`           | 2,9–3,8s  | Panel danh tính trở về giữa; tiêu đề chuyển thành Design. Develop. & Market.; nhãn kỹ năng xuất hiện.           |
| `revealThreshold` | 3,8–4,8s  | Cụm kính mở rộng, panel ảnh hướng về vị trí visual thật, ribbon tách hai hướng, mask cong hé homepage.          |
| `heroReveal`      | 4,8–6,2s  | Hero thật tiếp quản: visual vào từ 4,55s, chữ stagger từ 4,65s, navigation, mô tả, CTA cuối cùng.               |

Các nhãn là mốc kể chuyện; tween chồng nhau có chủ đích. Panel giữ nguyên DOM từ Assemble đến Reveal, không phải sáu slide. Không còn counter hoặc progress bar. Caption nhỏ bên dưới thông báo giai đoạn cho người xem và trình đọc màn hình.

## Kết nối với homepage

Homepage thật đã mount phía dưới overlay cố định. Không có bản sao Hero hay ảnh toàn màn hình từ storyboard. Khe mở dùng SVG mask Bézier, hai lớp kính rời khung và ribbon morph giữa các đường cùng topology. Panel ảnh được đo tương quan với visual Hero hiện tại để hướng về cùng vùng khi bàn giao.

`data-intro-owned` tránh phát Hero entrance lần thứ hai sau khi master hoàn tất. `MotionProvider` giữ Lenis và các scroll effect đến khi intro kết thúc. Timeline chỉ đặt style tạm thời lên các phần tử Hero; `gsap.context().revert()` trả về style ban đầu. Không thay bố cục, nội dung, slider, Skills hay About.

## Tài nguyên và fallback

Timeline độc lập với tải tài nguyên, nên cache nóng vẫn có nhịp 6,2 giây. Tại 3,8s, timeline giữ bố cục Focus nếu ảnh `data-critical` chưa decode hoặc font chưa sẵn sàng. Khi hoàn tất, tiếp tục từ đúng mốc đó. Không có phần trăm tiến độ trình diễn gây nhầm với tiến độ tải.

Asset timeout 6,5 giây cho phép tiếp tục với nội dung sẵn có; recovery deadline 11 giây kết thúc intro nếu ticker bị gián đoạn. Cleanup khôi phục overflow, padding, vị trí cuộn, inert và listeners khi hoàn tất hoặc hủy. Reduced motion khoảng 0,55 giây, không tilt/scale Hero. `noscript` giữ HTML thật có thể đọc.

## Responsive và vật liệu

Orb dùng radial gradient, viền phản xạ, các vòng kính nghiêng và caustic nhẹ. Ribbon, veil và glass wings dùng SVG; panel dùng nền trong và blur cục bộ 8px trên desktop. Không thêm WebGL hoặc thư viện mới.

Tablet giảm mảnh kính. Mobile ẩn panel biểu đồ và các fragment phụ, giảm kích thước panel, tắt blur, giảm xoay Hero; vẫn giữ trình tự orb → lắp ghép → hội tụ → mở kính. Landscape thấp thu nhỏ cụm cảnh. Overlay cắt phần trang trí ngoài khung, không làm rộng document.

Ảnh dùng lại asset concept hiện có. Biểu đồ mang nhãn “ILLUSTRATIVE GROWTH STUDY”, không thể hiện số liệu kinh doanh thật. Toàn bộ nội dung mới nằm trong `copy.loader` của lớp dữ liệu.

## Các file chính

- `src/components/preloader.tsx`: panel, orb, caption; session, watcher, deadline và lifecycle.
- `src/app/intro.css`: vật liệu, không gian, responsive và reduced motion.
- `src/lib/motion/glass-unfold.ts`: timeline sáu nhãn, readiness gate, Hero handoff, cleanup và scroll lock.
- `src/lib/motion/glass-geometry.ts`: đường cong, thời điểm, session key.
- `src/components/glass-scene.tsx`: SVG kính và nền sáng.
- `src/data/site-settings.ts`: nội dung intro.

## Kiểm tra

`npm run test:intro`: 15 kiểm thử Node/jsdom với GSAP thật, gồm resource decode/font, asset lỗi/timeout, sáu phase, panel xuyên suốt, hội tụ, gate đang chạy, Hero overlap, hủy/remount, reduced motion, mở trực tiếp detail, khôi phục tương tác và topology SVG.

`npm run build` kiểm tra Next.js production/static export. `npm run verify:export` kiểm tra route, assets, liên kết và metadata.

**Chưa xác nhận trực quan trên trình duyệt:** browser inventory rỗng và tạo tab trả về “Browser is not available: iab”. Các kiểm thử DOM/timeline không chứng minh FPS, rasterization SVG, hydration, độ giống storyboard hoặc việc không có flicker.

Cần xem thực tế tại 1440×900, 820×1180, 390×844 và mobile ngang; cả cache nóng/lạnh, mạng chậm, ảnh lỗi và reduced motion. Kiểm tra orb, panel, Flow/Focus có dễ đọc, khe mở không để nền trống, chữ Hero không giật lại, menu/slider/cuộn dùng được sau intro.
