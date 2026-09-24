import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  categoryLabel: string;
};

export function ProductCard({ product, categoryLabel }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3>{product.name}</h3>
        </CardTitle>
        <CardAction>
          <Badge variant="secondary">{categoryLabel}</Badge>
        </CardAction>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-medium">{`R$ ${product.price.toFixed(2)}`}</p>
      </CardContent>
    </Card>
  );
}
