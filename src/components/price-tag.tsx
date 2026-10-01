import { formatPrice } from "@/lib/format-price";

type PriceTagProps = {
  value: number;
};

export function PriceTag({ value }: PriceTagProps) {
  return (
    <data value={String(value)} className="font-semibold tabular-nums">
      {formatPrice(value)}
    </data>
  );
}
