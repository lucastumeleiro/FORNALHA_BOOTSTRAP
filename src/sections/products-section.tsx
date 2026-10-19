import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { productsSectionContent } from "@/content/products-section";
import { products, type ProductCategory } from "@/data/products";
import { filterProducts, type ProductFilter } from "@/lib/filter-products";

const { allLabel, categoryLabels, filterGroupLabel, productCount } =
  productsSectionContent;

// "Todos" primeiro; as categorias seguem a ordem de `categoryLabels`.
const filterOptions: { value: ProductFilter; label: string }[] = [
  { value: "all", label: allLabel },
  ...(Object.keys(categoryLabels) as ProductCategory[]).map((category) => ({
    value: category,
    label: categoryLabels[category],
  })),
];

export function ProductsSection() {
  const [filter, setFilter] = useState<ProductFilter>("all");
  const visibleProducts = filterProducts(products, filter);
  const count = visibleProducts.length;

  return (
    <section id="cardapio" className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold tracking-tight">
          {productsSectionContent.title}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {productsSectionContent.subtitle}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
          <div
            role="group"
            aria-label={filterGroupLabel}
            className="flex flex-wrap gap-2"
          >
            {filterOptions.map((option) => {
              const isActive = option.value === filter;
              return (
                <Button
                  key={option.value}
                  type="button"
                  size="lg"
                  variant={isActive ? "default" : "outline"}
                  aria-pressed={isActive}
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
          <p
            aria-live="polite"
            aria-atomic="true"
            className="basis-full text-muted-foreground sm:basis-auto"
          >
            {`${count} ${count === 1 ? productCount.one : productCount.other}`}
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryLabel={categoryLabels[product.category]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
