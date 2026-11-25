import type { Project } from "@/types/content";
const interior = {
  src: "/images/interior.jpg",
  alt: "Không gian nội thất sáng — ảnh minh họa concept",
};
const retreat = {
  src: "/images/retreat.jpg",
  alt: "Không gian nghỉ dưỡng — ảnh minh họa concept",
};
const ocean = {
  src: "/images/ocean.jpg",
  alt: "Mặt biển xanh — ảnh minh họa concept",
};
const architecture = {
  src: "/images/architecture.jpg",
  alt: "Kiến trúc hiện đại — ảnh minh họa concept",
};
const common = {
  status: "concept" as const,
  featured: true,
  duration: "Chưa triển khai",
  year: "Concept",
  role: ["UI/UX Design", "Frontend Development"],
  technologies: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
  challenges: [
    {
      title: "Một trải nghiệm có cá tính",
      description:
        "Tạo ngôn ngữ hình ảnh phù hợp lĩnh vực, với phân cấp nội dung rõ ràng.",
    },
    {
      title: "Chuyển động có chủ đích",
      description:
        "Cân bằng trải nghiệm tương tác, khả năng truy cập và tốc độ tải.",
    },
    {
      title: "Hành trình chuyển đổi",
      description:
        "Giúp người xem tìm đúng thông tin và dễ dàng thực hiện bước tiếp theo.",
    },
  ],
  solutions: [
    {
      title: "Thiết kế từ nội dung",
      description:
        "Xây dựng bố cục và hệ thống chữ xoay quanh câu chuyện thương hiệu.",
    },
    {
      title: "Phát triển linh hoạt",
      description:
        "Tách dữ liệu khỏi giao diện, dùng component tái sử dụng và responsive.",
    },
    {
      title: "Tối ưu trải nghiệm",
      description:
        "Tải ảnh phù hợp, chuyển động tiết chế trên mobile và hỗ trợ bàn phím.",
    },
    {
      title: "Sẵn sàng đo lường",
      description:
        "Chuẩn bị cấu trúc nội dung để bổ sung mục tiêu và dữ liệu sau triển khai.",
    },
  ],
  results: [],
  resultNote:
    "Đây là concept trình diễn giao diện, chưa phải dự án khách hàng đã triển khai. Chưa có kết quả kinh doanh được xác minh.",
};
export const projects: Project[] = [
  {
    ...common,
    slug: "toan-interior",
    title: "Toan",
    accent: ".com",
    category: "WEBSITE / NỘI THẤT",
    description: "Không gian đẹp. Trải nghiệm tinh tế.",
    summary:
      "Định hướng website nội thất hiện đại, kết hợp hình ảnh giàu cảm xúc với trải nghiệm khám phá sản phẩm đơn giản và rõ ràng.",
    industry: "Nội thất",
    image: interior,
    gallery: [interior, architecture, retreat],
  },
  {
    ...common,
    slug: "lakeside-retreat",
    title: "Lakeside",
    accent: "Retreat",
    category: "WEBSITE / DU LỊCH",
    description: "Một khoảng lặng giữa thiên nhiên.",
    summary:
      "Concept website nghỉ dưỡng với hình ảnh rộng, nhịp chuyển động chậm và hành trình khám phá không gian lưu trú.",
    industry: "Du lịch & nghỉ dưỡng",
    image: retreat,
    gallery: [retreat, ocean, architecture],
  },
  {
    ...common,
    slug: "blue-voyage",
    title: "Blue",
    accent: "Voyage",
    category: "WEBSITE / TRẢI NGHIỆM",
    description: "Mở ra những hành trình mới.",
    summary:
      "Concept trải nghiệm đặt chuyến đi trên biển, ưu tiên cảm xúc khám phá và thông tin hành trình dễ tiếp cận.",
    industry: "Du lịch biển",
    image: ocean,
    gallery: [ocean, retreat, architecture],
  },
  {
    ...common,
    slug: "form-living",
    title: "Form",
    accent: "Living",
    category: "WEBSITE / KIẾN TRÚC",
    description: "Tối giản hình thức. Tối đa cảm xúc.",
    summary:
      "Concept portfolio kiến trúc, dành không gian cho hình ảnh công trình và câu chuyện đằng sau từng thiết kế.",
    industry: "Kiến trúc",
    image: architecture,
    gallery: [architecture, interior, retreat],
  },
];
