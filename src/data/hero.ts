import type { HeroContent } from "@/types/content";

export const hero: HeroContent = {
  lines: ["Thiết kế website.", "Tối ưu trải nghiệm.", "Tạo tăng trưởng."],
  description:
    "Tôi tự thiết kế, lập trình website rồi trực tiếp chạy quảng cáo, SEO và nội dung để website mang về khách hàng thật.",
  goal: "Đang tìm vị trí Web Developer kiêm Digital Marketing (Marketing Technologist).",
  primary: { label: "Khám phá dự án", href: "#featured" },
  secondary: { label: "Cách tôi làm việc", href: "#process" },
  backdrop: ["WEB EXPERIENCE", "DIGITAL GROWTH", "BUILD · RANK · CONVERT"],
  project: { slug: "noithatnhom", cta: "Xem dự án" },
  panels: {
    development: {
      title: "WordPress · Next.js · React",
      brands: ["wordpress", "next", "react"],
    },
    seo: { brand: "google", query: "website nội thất" },
    ads: { title: "Meta Ads · Google Ads", brands: ["meta", "googleads"] },
    chart: {
      note: "Dữ liệu minh họa",
      series: [14, 22, 19, 30, 27, 38, 35, 47],
    },
  },
  chapters: [
    {
      id: "design",
      title: "Design",
      description:
        "Bố cục rõ ràng, giao diện dễ dùng và một ngôn ngữ hình ảnh riêng cho thương hiệu.",
      keywords: ["UI/UX", "Layout"],
    },
    {
      id: "development",
      title: "Development",
      description:
        "Cấu trúc gọn, tải nhanh và dễ mở rộng — từ WordPress đến Next.js.",
      keywords: ["WordPress", "Next.js", "Code", "Cấu trúc"],
    },
    {
      id: "marketing",
      title: "Marketing",
      description:
        "Đưa website đến đúng người bằng SEO, nội dung, quảng cáo và đo lường.",
      keywords: ["Google SEO", "Nội dung", "Meta Ads", "Analytics"],
    },
  ],
  design: {
    palette: ["#2864F0", "#151D30", "#DCEAFF", "#FFFFFF"],
    typeface: "Manrope",
  },
  development: {
    file: "app/page.tsx",
    code: [
      "export default function Page() {",
      "  return (",
      "    <Layout>",
      "      <Hero />",
      "      <Projects />",
      "      <Contact />",
      "    </Layout>",
      "  );",
      "}",
    ],
    structure: ["Trang chủ", "Dự án", "Dịch vụ", "Liên hệ"],
    brands: ["wordpress", "next", "react", "gsap"],
  },
  marketing: {
    query: "website nội thất",
    url: "noithatnhom.vn › nội thất nhôm",
    title: "Nội thất hiện đại. Không gian của bạn.",
    description:
      "Khám phá ý tưởng thiết kế, chất liệu và cảm hứng cho không gian sống.",
    adTitle: "Không gian sống tinh tế",
    adAction: "Tìm hiểu thêm",
    adBrands: ["meta", "googleads"],
    note: "Giao diện minh họa — không phải kết quả chiến dịch.",
  },
};
