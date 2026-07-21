import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/data/products";

export function ProductGrid({
  hidePricing = false,
  products,
}: {
  hidePricing?: boolean;
  products: Product[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          hidePricing={hidePricing}
          index={index}
          product={product}
        />
      ))}
    </div>
  );
}
