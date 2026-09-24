import { ProductCard } from "@/components/product-card";
import { productsSectionContent } from "@/content/products-section";
import { products } from "@/data/products";

export function ProductsSection() {
  return (
    <section id="cardapio" className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold tracking-tight">
          {productsSectionContent.title}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {productsSectionContent.subtitle}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryLabel={
                productsSectionContent.categoryLabels[product.category]
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
