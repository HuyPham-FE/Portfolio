import type { ServiceStackContent } from "@/types/content";

export const services: ServiceStackContent = {
  title: "Từ website đến",
  accent: "tăng trưởng.",
  description:
    "Thiết kế nền tảng số, tối ưu khả năng tìm kiếm và kết nối thương hiệu với đúng khách hàng.",
  cards: [
    {
      id: "website",
      label: "01 / WEBSITE",
      title: "Thiết kế & Phát triển Website.",
      description:
        "Xây dựng website hiện đại, chú trọng trải nghiệm người dùng, hiệu suất và khả năng phát triển lâu dài.",
      logos: [
        { brand: "wordpress", label: "WordPress" },
        { brand: "next", label: "Next.js" },
        { brand: "react", label: "React" },
      ],
      visual: "website",
      projectSlug: "toan-interior",
    },
    {
      id: "seo-content",
      label: "02 / SEO & CONTENT",
      title: "Tối ưu SEO & Phát triển nội dung.",
      description:
        "Phát triển cấu trúc SEO và nội dung phù hợp với nhu cầu tìm kiếm, giúp website tiếp cận khách hàng tiềm năng.",
      logos: [
        { brand: "google", label: "Google" },
        { icon: "search", label: "SEO" },
        { icon: "document", label: "Content" },
      ],
      visual: "search",
    },
    {
      id: "digital-marketing",
      label: "03 / DIGITAL MARKETING",
      title: "Triển khai quảng cáo & Tăng trưởng hiệu quả.",
      description:
        "Kết hợp nội dung, quảng cáo và dữ liệu để tiếp cận khách hàng phù hợp, hỗ trợ tăng trưởng kinh doanh.",
      logos: [
        { brand: "meta", label: "Meta Ads" },
        { brand: "googleads", label: "Google Ads" },
        { brand: "googleanalytics", label: "Analytics" },
      ],
      visual: "marketing",
      cta: { label: "Xem cách tôi làm", href: "#process" },
    },
  ],
  visualCopy: {
    websiteCaption: "Toan.com · Concept trong portfolio",
    searchQuery: "website nội thất",
    searchUrl: "toan.com / không gian sống",
    searchTitle: "Nội thất hiện đại. Không gian của bạn.",
    searchDescription:
      "Khám phá ý tưởng thiết kế, chất liệu và cảm hứng cho không gian sống.",
    searchTags: ["Cấu trúc rõ ràng", "Nội dung hữu ích", "Đúng nhu cầu"],
    searchGraph: "Tín hiệu tìm kiếm",
    dashboardTitle: "Kết nối từng điểm chạm.",
    dashboardTabs: ["Meta Ads", "Google Ads"],
    dashboardSignals: ["Tiếp cận", "Tương tác", "Chuyển đổi"],
    illustrationNote:
      "Giao diện & biểu đồ minh họa · Không phải kết quả chiến dịch",
  },
};
