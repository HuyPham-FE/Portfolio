import { getBrand } from "@/lib/content";
export function Brand({
  name,
  label = false,
}: {
  name: string;
  label?: boolean;
}) {
  const brand = getBrand(name);
  if (!brand) return null;
  return (
    <span className="brand-mark" title={brand.name}>
      <img
        src={brand.src}
        alt={label ? "" : brand.name}
        width="28"
        height="28"
      />
      {label && <span>{brand.name}</span>}
    </span>
  );
}
export function BrandRow({
  names,
  labels = false,
}: {
  names: string[];
  labels?: boolean;
}) {
  return (
    <div className="brand-row">
      {names.map((name) => (
        <Brand key={name} name={name} label={labels} />
      ))}
    </div>
  );
}
