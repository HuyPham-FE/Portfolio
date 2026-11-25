import type { Skill } from "@/types/content";
export const skills: Skill[] = [
  {
    id: "development",
    name: "Web Development",
    icon: "</>",
    brands: ["wordpress", "next", "react"],
    description: "Cấu trúc vững. Tương tác mượt.",
    tools: ["WordPress", "Next.js", "React", "TypeScript"],
    detail:
      "Website responsive, dễ mở rộng và được chăm chút trong từng tương tác.",
  },
  {
    id: "design",
    name: "Website Design",
    icon: "◇",
    brands: ["figma"],
    description: "Rõ ràng từ điểm chạm đầu tiên.",
    tools: ["Figma", "Design systems", "Prototyping"],
    detail:
      "Hệ thống giao diện nhất quán, dẫn dắt người dùng đến điều quan trọng.",
  },
  {
    id: "seo",
    name: "SEO & Optimization",
    icon: "⌕",
    brands: ["google"],
    description: "Dễ tìm thấy. Dễ sử dụng.",
    tools: ["Technical SEO", "On-page", "Core Web Vitals", "Accessibility"],
    detail:
      "Kết nối cấu trúc nội dung, tốc độ và khả năng truy cập với nhu cầu tìm kiếm.",
  },
  {
    id: "content",
    name: "Content Marketing",
    icon: "✎",
    brands: [],
    description: "Thông điệp đúng. Nội dung có ích.",
    tools: ["SEO content", "Fanpage", "Content strategy"],
    detail:
      "Nội dung website và fanpage nhất quán với thương hiệu và hành trình khách hàng.",
  },
  {
    id: "ads",
    name: "Digital Advertising",
    icon: "↗",
    brands: ["facebook"],
    description: "Kết nối với đúng khách hàng.",
    tools: ["Meta Ads", "Creative", "Measurement"],
    detail:
      "Thử nghiệm thông điệp, thiết kế nội dung quảng cáo và theo dõi hiệu quả.",
  },
];
