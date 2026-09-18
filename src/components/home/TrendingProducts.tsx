"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ProductImage } from "@/components/product/ProductImage";
import { type Product } from "@/data/products";
import { formatCategoryName, formatProductName } from "@/lib/productDisplay";

// Products are supplied by the homepage from the live catalog (Medusa/DB) —
// no hardcoded product lists. See src/app/page.tsx for how they are fetched.
export function TrendingProducts({ products }: { products: Product[] }) {
  return <ProductCarouselSection title="Featured items" products={products} />;
}

export function NewArrivals({ products }: { products: Product[] }) {
  return <ProductCarouselSection title="New Arrivals" products={products} hideProductNames />;
}

function ProductCarouselSection({
  title,
  products,
  hideProductNames = false,
}: {
  title: string;
  products: Product[];
  hideProductNames?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="overflow-hidden bg-[#050505] px-5 py-14 text-white sm:px-8 lg:py-16">
      <div className="mx-auto max-w-[92rem]">
        <div className="mb-8 flex items-center justify-between gap-5">
          <div>
            <p className="inline-flex rounded-[1.4rem] bg-[var(--brand-blue)] px-7 py-4 text-sm font-bold text-white shadow-[0_18px_55px_rgba(0,160,227,0.24)] sm:px-8">
              {title}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 text-sm font-semibold text-white/66 transition hover:text-white"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 120, damping: 22, delay: index * 0.035 }}
            >
              <FeaturedSkuCard product={product} hideProductName={hideProductNames} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedSkuCard({
  product,
  hideProductName = false,
}: {
  product: Product;
  hideProductName?: boolean;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      aria-label={`View ${product.name} product details`}
      className="group block w-full overflow-hidden rounded-[1.15rem] bg-white text-[#050505] shadow-[0_22px_65px_rgba(0,0,0,0.24)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(0,160,227,0.16)]"
    >
      <div className="relative grid h-[20rem] place-items-center overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-x-[18%] bottom-[17%] h-8 rounded-full bg-slate-950/13 blur-2xl" />
        <ProductImage
          product={product}
          alt={`${product.name} product image`}
          className="!w-[min(78%,260px)] transition duration-500 group-hover:scale-105"
          imageClassName="brightness-[1.02] contrast-[1.04]"
          sizes="(min-width: 1280px) 260px, 240px"
        />
      </div>
      <div className={hideProductName ? "px-6 py-4" : "min-h-[7.5rem] px-6 py-6"}>
        <p className="text-[0.68rem] font-semibold text-[#00a0e3]">
          {formatCategoryName(product.category)}
        </p>
        {!hideProductName && (
          <h3 className="mt-4 line-clamp-2 text-[1.32rem] font-bold leading-[1.08] tracking-normal text-[#050505]">
            {formatProductName(product.name)}
          </h3>
        )}
      </div>
    </Link>
  );
}
