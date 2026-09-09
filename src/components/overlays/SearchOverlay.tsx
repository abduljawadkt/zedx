"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { formatCategoryName, formatProductName } from "@/lib/productDisplay";

export function SearchOverlay() {
  const { closeSearch, isSearchOpen } = useCommerce();
  const { products } = useCatalog();
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products.slice(0, 4);
    return products.filter((product) =>
      [product.name, product.category, product.collection]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [products, query]);

  useEffect(() => {
    if (!isSearchOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSearch();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSearch, isSearchOpen]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          className="fixed inset-0 z-[76] overflow-auto bg-black/82 p-5 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_76%_70%,rgba(139,92,246,0.16),transparent_38%)]" />
          <motion.div
            className="glass-panel relative mx-auto mt-12 max-w-5xl p-6 sm:mt-20 sm:p-8"
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
          >
            <div className="flex items-center gap-4">
              <Search className="text-cyan-200" size={22} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-16 min-w-0 flex-1 bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-[#ffffff40] sm:text-4xl"
                placeholder="Search gadgets"
              />
              <button
                type="button"
                aria-label="Close search"
                className="grid size-11 place-items-center rounded-full border border-[#ffffff1a] text-white"
                onClick={closeSearch}
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {results.length > 0 ? (
                results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group grid grid-cols-[5rem_1fr] items-center gap-4 rounded-[1.25rem] border border-[#ffffff1a] bg-[#ffffff09] p-3 transition hover:-translate-y-1 hover:border-cyan-300/50"
                  onClick={closeSearch}
                >
                  <div className="product-stage !min-h-20">
                    <ProductImage
                      product={product}
                      alt={`${formatProductName(product.name)} search result image`}
                      className="!w-14 transition group-hover:scale-110"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{formatProductName(product.name)}</p>
                    <p className="text-sm text-[#ffffff73]">{formatCategoryName(product.category)}</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--brand-blue-soft)]">
                      {product.currency} {product.price}
                    </p>
                  </div>
                </Link>
                ))
              ) : (
                <div className="col-span-full grid min-h-56 place-items-center border border-[#ffffff1a] bg-[#ffffff08] p-8 text-center">
                  <div>
                    <p className="text-xs font-semibold text-[#ffffff59]">
                      No matches
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                      No matching ZEDX products yet.
                    </h2>
                    <p className="mt-3 text-white/60">
                      Try earbuds, power, watch, charger, or speaker.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
