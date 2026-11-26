import type { Project } from "@/types/content";
const alohouse = {
  src: "/images/project-noithatnhom.jpg",
  alt: "Trang chủ noithatnhom.vn — Nội thất nhôm tổ ong AloHouse",
};
const thuethuyen = {
  src: "/images/project-thuethuyen.jpg",
  alt: "Trang chủ thuethuyen.vn — thuê thuyền cho du lịch và sự kiện",
};
const nangto = {
  src: "/images/project-nangto.jpg",
  alt: "Trang chủ website Nàng Tơ — tinh hoa lụa Việt",
};
const common = {
  status: "published" as const,
  featured: true,
  duration: "Đang vận hành",
  year: "Đã triển khai",
  role: ["Thiết kế website", "Phát triển website"],
  technologies: ["WordPress", "UI/UX Design"],
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
    "Website đang hoạt động. Chưa công bố số liệu kinh doanh của dự án.",
};
export const projects: Project[] = [
  {
    ...common,
    slug: "noithatnhom",
    website: "https://noithatnhom.vn/",
    title: "Nội thất nhôm",
    accent: " AloHouse", // leading space: title and accent render as one name
    category: "WEBSITE / NỘI THẤT",
    description: "Nội thất nhôm tổ ong thế hệ mới.",
    summary:
      "Website thương hiệu nội thất nhôm tổ ong AloHouse: tấm nhôm tổ ong, tủ bếp, tủ quần áo, tủ lavabo và cửa thông phòng chống nước, chống ẩm.",
    industry: "Nội thất",
    // Huy ran the whole AloHouse effort, not only the site (see the 2026 case study).
    role: [
      "Chiến lược & ngân sách",
      "Chạy Meta Ads",
      "Thiết kế & phát triển website",
      "Content & creative",
    ],
    technologies: ["WordPress", "UI/UX Design", "Meta Ads"],
    image: alohouse,
    gallery: [alohouse],
  },
  {
    ...common,
    slug: "thuethuyen",
    website: "https://thuethuyen.vn/",
    title: "ThuêThuyền",
    accent: ".vn",
    category: "WEBSITE / DU LỊCH",
    description: "Thuê thuyền, khám phá những hành trình đặc biệt.",
    summary:
      "Nền tảng tìm và đặt thuyền cho du lịch, sự kiện và trải nghiệm trên biển, với bộ lọc theo điểm đến và loại thuyền.",
    industry: "Du lịch biển",
    image: thuethuyen,
    gallery: [thuethuyen],
  },
  {
    ...common,
    slug: "nangto",
    // nangto.com still serves a default WordPress "Hello world" page; the built
    // site only runs locally, so no public link until it launches.
    duration: "Đang hoàn thiện",
    year: "Chưa ra mắt",
    resultNote: "Website đang hoàn thiện, chưa ra mắt công khai.",
    title: "Nàng Tơ",
    accent: " Lụa Việt",
    category: "WEBSITE / THỜI TRANG",
    description: "Tinh hoa lụa Việt.",
    summary:
      "Website thương hiệu vải lụa cao cấp Nàng Tơ: giới thiệu bộ sưu tập, sản phẩm và câu chuyện thương hiệu trong tinh thần truyền thống hiện đại.",
    industry: "Thời trang & lụa",
    image: nangto,
    gallery: [nangto],
  },
  {
    // SEO case study: rankings come from Huy's supplied results artwork. No traffic,
    // revenue, conversion or timeline figures are claimed.
    slug: "vietyachtplus",
    title: "Vietyacht",
    accent: "Plus",
    category: "SEO / CONTENT MARKETING",
    description: "Nâng cao khả năng hiện diện trên Google",
    summary:
      "Tối ưu SEO website và phát triển nội dung hướng đến các nhóm từ khóa trong lĩnh vực du thuyền, giúp nhiều từ khóa đạt vị trí cao trên kết quả tìm kiếm Google.",
    status: "published",
    featured: false, // shown as its own showcase, not in the website helix
    industry: "Du thuyền",
    role: ["SEO Website", "Content Marketing"],
    technologies: ["SEO", "Content Marketing"],
    duration: "",
    year: "Đã triển khai",
    image: {
      src: "/images/project-vietyachtplus.webp",
      alt: "Kết quả SEO VietyachtPlus: 5 từ khóa Top 1, 6 từ khóa Top 3, 7 từ khóa Top 20 Google, kèm bảng thứ hạng từ khóa",
    },
    gallery: [],
    challenges: [],
    solutions: [],
    results: [],
    resultNote: "",
    seo: {
      headline: "Nâng cao khả năng hiện diện trên Google",
      discipline: "SEO & Digital Marketing",
      overview: [
        {
          title: "Dự án",
          description:
            "VietyachtPlus là website trong lĩnh vực du thuyền. Dự án tập trung tối ưu SEO website và phát triển nội dung theo các nhóm từ khóa của ngành.",
        },
        {
          title: "Mục tiêu",
          description:
            "Nâng cao khả năng hiện diện trên Google với các từ khóa về du thuyền, thuê du thuyền và học bằng thuyền trưởng.",
        },
        {
          title: "Vai trò",
          description:
            "Phụ trách SEO website và content marketing: tối ưu website, xây dựng nội dung theo nhóm từ khóa và theo dõi thứ hạng.",
        },
      ],
      rankings: [
        { value: 5, label: "Top 1 Google" },
        { value: 6, label: "Top 3 Google" },
        { value: 7, label: "Top 20 Google" },
      ],
      rankingNote:
        "Số từ khóa được tính lũy kế theo từng nhóm thứ hạng: nhóm Top 3 đã bao gồm các từ khóa Top 1.",
      keywords: [
        { keyword: "Lái thuyền", rank: 1 },
        { keyword: "Giá du thuyền", rank: 1 },
        { keyword: "Học bằng thuyền trưởng hạng 3", rank: 1 },
        { keyword: "Du thuyền cá nhân", rank: 1 },
        { keyword: "Công ty cho thuê du thuyền", rank: 1 },
        { keyword: "Yacht là gì", rank: 3 },
        { keyword: "Yacht", rank: 12 },
      ],
    },
  },
];
