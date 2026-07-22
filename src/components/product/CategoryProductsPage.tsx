"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ChevronDown, Package, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/data/categories";
import type { Product } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  ProductImage,
  productImageGroundShadowClassName,
  productImageStageClassName,
  productImageStageGlowClassName,
} from "@/components/product/ProductImage";
import { formatCategoryName, formatProductName } from "@/lib/productDisplay";

type SortMode = "featured" | "price-asc" | "price-desc";

export function CategoryProductsPage({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const reduceMotion = useReducedMotion();
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const sortedProducts = useMemo(() => {
    const items = [...products];
    if (sortMode === "price-asc") items.sort((a, b) => a.price - b.price);
    if (sortMode === "price-desc") items.sort((a, b) => b.price - a.price);
    return items;
  }, [products, sortMode]);
  const heroProduct = products[0];
  const lowestPrice = products.length ? Math.min(...products.map((product) => product.price)) : 0;
  const displayCategoryName = formatCategoryName(category.name);
  const collectionLabel = category.collection.toLowerCase().includes("collection")
    ? category.collection
    : `${category.collection} collection`;

  return (
    <main className="mx-auto w-full max-w-[92rem] flex-1 px-4 py-12 text-white sm:px-8 sm:py-20">
      <motion.div
        className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0b0d11]/72 p-5 shadow-2xl shadow-black/30 sm:rounded-[1.8rem] sm:p-8 lg:grid lg:grid-cols-[1fr_0.48fr] lg:items-end lg:gap-10"
        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 22 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(0,160,227,0.24),transparent_34%),radial-gradient(circle_at_22%_86%,rgba(255,255,255,0.08),transparent_34%)]" />
        <div>
          <p className="relative inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-[var(--brand-blue-soft)]">
            {collectionLabel}
          </p>
          <h1 className="relative mt-5 text-4xl font-semibold leading-tight text-white sm:text-7xl sm:leading-[0.96]">
            {displayCategoryName}
          </h1>
          <p className="relative mt-5 max-w-xl text-base leading-7 text-white/58 sm:mt-6 sm:text-lg sm:leading-8">
            {category.description}
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-[#00a0e3]/60 hover:text-white"
            >
              All products
            </Link>
            <Link
              href="#category-products"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#050505] transition hover:bg-[var(--brand-blue-soft)]"
            >
              Shop from AED {lowestPrice}
            </Link>
          </div>
        </div>
        <div className="relative mt-8 overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#10141a] p-4 text-white lg:mt-0 sm:p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(0,160,227,0.2),transparent_44%)]" />
          {heroProduct ? (
            <div className={`${productImageStageClassName} mb-4 min-h-64 rounded-[1rem] sm:min-h-72 sm:rounded-[1.2rem]`}>
              <div className={productImageStageGlowClassName} />
              <div className={productImageGroundShadowClassName} />
              <ProductImage
                product={heroProduct}
                alt={`${formatProductName(heroProduct.name)} category hero`}
                className="!w-[min(82%,360px)] !drop-shadow-[0_28px_50px_rgba(15,23,42,0.28)]"
                imageClassName="brightness-[1.03] contrast-[1.04]"
                sizes="(min-width: 1024px) 360px, 72vw"
              />
            </div>
          ) : (
            <div className="relative grid h-64 place-items-center">
              <Package size={56} />
            </div>
          )}
          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
              <p className="text-xs font-semibold text-white/45">From</p>
              <p className="mt-2 text-3xl font-semibold">AED {lowestPrice}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <section className="mt-8 rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Buy {displayCategoryName.toLowerCase()} in Dubai & UAE
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/58 sm:text-base">
          This ZEDX category brings together focused options{lowestPrice ? ` from AED ${lowestPrice}` : ""}, helping UAE shoppers
          compare price, use case, category, and compatibility before choosing the right setup.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/54 sm:text-base">
          Browse by daily need: audio for calls and music, power for travel and work, smart wearables for quick
          notifications, and mobile accessories for cleaner car, desk, and charging routines.
        </p>
      </section>

      <div id="category-products" className="mt-12 scroll-mt-28">
        {products.length > 0 ? (
          <>
            <div className="mb-6 flex flex-col gap-4 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-xs font-semibold text-white/45">
                <SlidersHorizontal size={16} />
                Browse products
              </div>
              <label className="relative block min-w-64">
                <span className="sr-only">Sort category products</span>
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="h-12 w-full appearance-none rounded-full border border-white/10 bg-black/25 px-5 pr-12 text-xs font-semibold text-white outline-none"
                >
                  <option value="featured" className="bg-[#050505]">Featured</option>
                  <option value="price-asc" className="bg-[#050505]">Price low to high</option>
                  <option value="price-desc" className="bg-[#050505]">Price high to low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
              </label>
            </div>
            <ProductGrid products={sortedProducts} />
          </>
        ) : (
          <div className="glass-panel flex min-h-80 flex-col justify-center rounded-[2rem] p-8">
            <p className="text-xs font-semibold text-white/40">
              Empty category
            </p>
            <h2 className="mt-4 text-4xl font-semibold text-white">
              No products yet.
            </h2>
            <p className="mt-4 max-w-md text-white/55">
              This category will expand as new ZEDX essentials arrive.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex h-12 w-fit items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#050505] transition hover:bg-[var(--brand-blue-soft)]"
            >
              View all products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
