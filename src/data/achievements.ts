import type { AchievementContent } from "@/types/content";
export const achievements: AchievementContent = {
  // AloHouse Meta Ads results for 2026, supplied by Huy from Ads Manager. Exact values, never rounded.
  metrics: [
    { id: "spend", value: 125382488, suffix: "đ", label: "Tổng chi tiêu quảng cáo" },
    { id: "impressions", value: 2344327, suffix: "", label: "Tổng lượt hiển thị" },
    { id: "reach", value: 992954, suffix: "", label: "Tài khoản Meta tiếp cận" },
    {
      id: "messages",
      value: 6196,
      suffix: "",
      label: "Tổng số người liên hệ nhắn tin",
      highlight: true,
    },
    {
      id: "newMessages",
      value: 5001,
      suffix: "",
      label: "Người liên hệ nhắn tin mới",
      highlight: true,
    },
    { id: "cpc", value: 2357, suffix: "đ", label: "CPC (tất cả)", note: "Chi phí mỗi lượt nhấp" },
    { id: "ctr", value: 2.27, suffix: "%", label: "CTR (tất cả)", note: "Tỷ lệ nhấp" },
    {
      id: "cpm",
      value: 53483,
      suffix: "đ",
      label: "CPM",
      note: "Chi phí mỗi 1.000 lượt hiển thị",
    },
  ].map((m) => ({ ...m, verified: true, source: "Meta Ads Manager · AloHouse 2026" })),
};
