import type { Product, ProductCategory } from "@/data/products";

export type ProductFilter = ProductCategory | "all";

// "all" devolve tudo; uma categoria devolve só os dela, na ordem original.
export function filterProducts(
  products: Product[],
  category: ProductFilter,
): Product[] {
  if (category === "all") return [...products];
  return products.filter((product) => product.category === category);
}
