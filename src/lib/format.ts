/** Vietnamese number formatting (1.234.567 / 2,27), keeping the target's decimals. */
export const decimalsOf = (value: number) =>
  (String(value).split(".")[1] ?? "").length;
export const formatNumber = (value: number, decimals = decimalsOf(value)) =>
  value.toLocaleString("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
