# QA và trạng thái bàn giao

## Đã kiểm tra tự động

- `npm run build`: Next.js compile, TypeScript, generateStaticParams và static export.
- `npm run verify:export`: sáu route nội dung, metadata, một H1/trang, href/src/anchor nội bộ, email/điện thoại đúng, nhãn concept, 404 và biến thể ảnh mobile.
- HTTP bản static: kiểm tra route và mã 404 bằng server preview cục bộ.

## Cần kiểm tra trình duyệt trước khi xuất bản

Chưa được đánh dấu pass: phiên làm việc không có trình duyệt tích hợp, cầu nối native Windows trả lỗi pipe unavailable. Không có báo cáo FPS/Lighthouse/console hay screenshot chứng minh.

- Desktop 1440×900 và tablet 820×1180: hero không bị chữ đè lên CTA; mockup có chiều sâu; các scene đọc được.
- Mobile 390×844 và 360×800: không tràn ngang, menu mở/đóng/Escape, ảnh không méo, không sticky pin cản cuộn.
- Phiên mới: intro đủ sáu cảnh trong 6,2 giây khi tài nguyên sẵn sàng; chờ tại Focus 3,8s nếu ảnh/font chưa xong. Hero thật vào chồng lên mở kính từ 4,55s. Chặn ảnh/font để kiểm tra timeout 6,5 giây và khôi phục tương tác.
- Featured: next/previous/dots; phím trái/phải; chọn card sau rồi mở case study; vuốt trái/phải; cuộn dọc vẫn bình thường; nhấn liên tục không tạo tween tích tụ.
- Skills: sáu lựa chọn cập nhật mô tả/tools, chạm và bàn phím đều dùng được; hover tilt trở về trạng thái bình thường.
- Scroll: title/image clip reveal, parallax, chart line, process timeline; quay lại từ trang khác không còn trigger cũ.
- Project list → detail → next → back; browser back/forward và deep links.
- Reduced motion: tắt chuyển động dài, bỏ Lenis, các controls vẫn hoạt động; không JavaScript: nội dung vẫn đọc và điều hướng được.
- Console không lỗi hydration/runtime; Network không 404; kiểm tra tài nguyên tải ở kích thước mobile phù hợp.
- Email/phone mở đúng handler, không gửi liên hệ tự động.
- Trước publish: thay concept/ảnh minh họa bằng dữ liệu thật hoặc giữ nguyên nhãn; không đăng số liệu chưa xác minh như kết quả thật.

## Glass Unfold bổ sung

15 kiểm thử logic đã qua bằng Node/jsdom và GSAP thật. Chi tiết và giới hạn nằm trong [glass-unfold.md](glass-unfold.md). Không đánh đồng việc kiểm tra DOM/timeline với kiểm thử render hoặc hiệu năng trình duyệt.
