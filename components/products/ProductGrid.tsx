import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";

type ProductGridProps = {
  products: readonly Product[];
  className?: string;
  /** Cards in the first row load eagerly when the grid is above the fold. */
  priorityCount?: number;
  columns?: "three" | "four";
  sizes?: string;
};

const columnClass = {
  three: "grid grid-cols-2 gap-px bg-deep-brown/15 lg:grid-cols-3",
  four: "grid grid-cols-2 gap-px bg-deep-brown/15 lg:grid-cols-4",
} as const;

const sizeHint = {
  three: "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw",
  four: "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw",
} as const;

/** Shared product listing grid. Rendering rules live here, not in each page. */
export function ProductGrid({
  products,
  className,
  priorityCount = 0,
  columns = "three",
  sizes,
}: ProductGridProps) {
  return (
    <div className={cn(columnClass[columns], className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          className="border-0"
          priority={index < priorityCount}
          sizes={sizes ?? sizeHint[columns]}
        />
      ))}
    </div>
  );
}
