"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Grid2X2, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { categories } from "@/data/categories";
import { collections, products, type Product } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { productGroups } from "@/lib/productDisplay";

type SortMode = "featured" | "price-asc" | "price-desc";
type PriceMode = "all" | "under-100" | "100-200" | "over-200";

const sortLabels: Record<SortMode, string> = {
  featured: "Featured",
  "price-asc": "Price Low to High",
  "price-desc": "Price High to Low",
};

export function ProductsExplorer() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCollection, setActiveCollection] = useState("all");
  const [priceMode, setPriceMode] = useState<PriceMode>("all");
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const reduceMotion = useReducedMotion();

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatch = activeCategory === "all" || product.categorySlug === activeCategory;
      const collectionMatch = activeCollection === "all" || product.collection === activeCollection;
      const priceMatch =
        priceMode === "all" ||
        (priceMode === "under-100" && product.price < 100) ||
        (priceMode === "100-200" && product.price >= 100 && product.price <= 200) ||
        (priceMode === "over-200" && product.price > 200);
      const queryMatch =
        !normalizedQuery ||
        [product.name, product.category, product.collection, product.badge]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return categoryMatch && collectionMatch && priceMatch && queryMatch;
    });

    const sorted = [...filtered];

    if (sortMode === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    }

    if (sortMode === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    }

    return sorted;
  }, [activeCategory, activeCollection, priceMode, query, sortMode]);

  return (
    <main className="mx-auto w-full max-w-[92rem] flex-1 px-4 py-12 text-white sm:px-8 sm:py-20">
      <motion.div
        className="relative mb-7 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0b0d11]/72 p-5 shadow-2xl shadow-black/30 sm:mb-10 sm:rounded-[1.8rem] sm:p-8 lg:grid lg:grid-cols-[1fr_0.62fr] lg:items-end lg:gap-10"
        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 22 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(0,160,227,0.22),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.14),transparent_34%)]" />
        <div>
          <p className="relative inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-cyan-200/80">
            Full ZEDX catalog
          </p>
          <h1 className="relative mt-5 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-7xl sm:leading-[0.96]">
            Explore products by category.
          </h1>
          <p className="relative mt-5 max-w-xl text-base leading-7 text-white/55 sm:mt-6 sm:text-lg sm:leading-8">
            Browse audio, power, wearables, tablets, mounts, cables, and daily accessories in one refined ZEDX collection.
          </p>
          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/checkout"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#00a0e3] px-5 text-xs font-semibold text-white shadow-lg shadow-[#00a0e3]/20 transition hover:scale-[1.02] hover:bg-[#008fcb] sm:h-14 sm:px-7 sm:text-sm"
            >
              View checkout
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/categories/chargers"
              className="inline-flex h-13 items-center justify-center rounded-full border border-[#00a0e3]/30 bg-white px-5 text-xs font-semibold text-[#0078ad] transition hover:border-[#00a0e3] hover:bg-[#eaf8ff] sm:h-14 sm:px-7 sm:text-sm"
            >
              Shop chargers
            </Link>
          </div>
        </div>
        <div className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:grid-cols-1">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.07] p-4 shadow-sm shadow-black/20 sm:rounded-[1.5rem]">
            <div className="flex items-center gap-3 text-xs font-semibold text-white/45">
              <Grid2X2 size={16} />
              Showing
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">
              {visibleProducts.length} products
            </p>
            <p className="mt-1 text-sm text-white/55">
              {activeCategory === "all"
                ? "All categories"
                : categories.find((category) => category.slug === activeCategory)?.name}
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.07] p-4 shadow-sm shadow-black/20 sm:rounded-[1.5rem]">
          <div className="flex items-center gap-3 text-xs font-semibold text-white/45">
            <SlidersHorizontal size={16} />
            Sort products
          </div>
          <label className="relative block">
            <span className="sr-only">Sort products</span>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="mt-3 h-14 w-full appearance-none rounded-full border border-white/10 bg-black/25 px-5 pr-12 text-sm font-semibold text-white outline-none transition focus:border-[#00a0e3]/70"
            >
              {(Object.keys(sortLabels) as SortMode[]).map((mode) => (
                <option key={mode} value={mode} className="bg-[#050505]">
                  {sortLabels[mode]}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45"
              size={18}
            />
          </label>
          </div>
        </div>
      </motion.div>

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        {Object.values(productGroups).map((group) => (
          <Link
            key={group.slug}
            href={`/collections/${group.slug}`}
            className="rounded-[1.1rem] border border-white/10 bg-white/[0.045] p-4 transition hover:-translate-y-0.5 hover:border-[#00a0e3]/45 hover:bg-white/[0.07]"
          >
            <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
              {group.categorySlugs.length} categories
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{group.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/56">
              {group.description}
            </p>
          </Link>
        ))}
      </section>

      <div className="mb-5 grid gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-3 lg:grid-cols-[1fr_auto_auto]">
        <label className="flex h-14 min-w-0 items-center gap-3 rounded-full border border-white/10 bg-black/25 px-5">
          <Search size={18} className="shrink-0 text-white/40" />
          <span className="sr-only">Search products</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, categories, collections"
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/30"
          />
        </label>
        <label className="relative block min-w-0 lg:min-w-56">
          <span className="sr-only">Filter by collection</span>
          <select
            value={activeCollection}
            onChange={(event) => setActiveCollection(event.target.value)}
            className="h-14 w-full appearance-none rounded-full border border-white/10 bg-black/25 px-5 pr-12 text-xs font-semibold text-white outline-none transition focus:border-[#00a0e3]/70"
          >
            <option value="all" className="bg-[#050505]">All collections</option>
            {collections.map((collection) => (
              <option key={collection} value={collection} className="bg-[#050505]">
                {collection}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
        </label>
        <label className="relative block min-w-0 lg:min-w-52">
          <span className="sr-only">Filter by price</span>
          <select
            value={priceMode}
            onChange={(event) => setPriceMode(event.target.value as PriceMode)}
            className="h-14 w-full appearance-none rounded-full border border-white/10 bg-black/25 px-5 pr-12 text-xs font-semibold text-white outline-none transition focus:border-[#00a0e3]/70"
          >
            <option value="all" className="bg-[#050505]">All prices</option>
            <option value="under-100" className="bg-[#050505]">Under AED 100</option>
            <option value="100-200" className="bg-[#050505]">AED 100-200</option>
            <option value="over-200" className="bg-[#050505]">Over AED 200</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
        </label>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-2 sm:mb-10 sm:gap-3">
        <FilterPill
          label="All"
          count={products.length}
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        {categories.map((category) => (
          <FilterPill
            key={category.slug}
            label={category.name}
            count={products.filter((product) => product.categorySlug === category.slug).length}
            active={activeCategory === category.slug}
            onClick={() => setActiveCategory(category.slug)}
          />
        ))}
      </div>

      {visibleProducts.length > 0 ? (
        <ProductGrid products={visibleProducts as Product[]} />
      ) : (
        <div className="grid min-h-80 place-items-center rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center">
          <div>
            <Sparkles className="mx-auto text-[var(--brand-blue-soft)]" size={28} />
            <h2 className="mt-4 text-2xl font-semibold text-white sm:text-4xl">
              No products match those filters.
            </h2>
            <button
              type="button"
              className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#050505]"
              onClick={() => {
                setActiveCategory("all");
                setActiveCollection("all");
                setPriceMode("all");
                setQuery("");
              }}
            >
              Reset filters
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function FilterPill({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-5 py-3 text-xs font-semibold transition ${
        active
          ? "border-[#00a0e3] bg-[#00a0e3] text-white shadow-lg shadow-[#00a0e3]/20"
          : "border-white/10 text-white/55 hover:border-white/30 hover:text-white"
      }`}
      onClick={onClick}
    >
      {label}
      <span className="ml-2 opacity-60">{count}</span>
    </button>
  );
}
