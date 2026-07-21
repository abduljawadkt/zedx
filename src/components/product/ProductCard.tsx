"use client";

import Link from "next/link";
import { Eye, Plus, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import {
  ProductImage,
  productImageGroundShadowClassName,
  productImageStageClassName,
  productImageStageGlowClassName,
} from "@/components/product/ProductImage";
import type { Product } from "@/data/products";
import { formatProductName } from "@/lib/productDisplay";

export function ProductCard({
  hidePricing = false,
  index = 0,
  product,
}: {
  hidePricing?: boolean;
  index?: number;
  product: Product;
}) {
  const { addToCart, openQuickView } = useCommerce();
  const [justAdded, setJustAdded] = useState(false);
  const reduceMotion = useReducedMotion();
  const displayName = formatProductName(product.name);

  function handleAdd() {
    addToCart(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 900);
  }

  return (
    <motion.article
      className="group relative overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#0b0d11]/78 text-white shadow-sm shadow-black/30 transition duration-500 hover:-translate-y-1 hover:border-[#00a0e3]/35 hover:bg-[#11151b] hover:shadow-2xl hover:shadow-[#00a0e3]/10 sm:rounded-[1.35rem]"
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -8 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 120, damping: 22, delay: index * 0.04 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="block"
        aria-label={`View ${displayName} product details`}
      >
        <div
          className={`${productImageStageClassName} m-2 min-h-56 rounded-[0.95rem] transition duration-500 group-hover:border-[#00a0e3]/45 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_24px_70px_rgba(0,160,227,0.16)] sm:m-3 sm:min-h-[18rem] sm:rounded-[1.2rem]`}
        >
          <div className={productImageStageGlowClassName} />
          <div className={productImageGroundShadowClassName} />
          <motion.div
            className="relative z-10 grid w-full place-items-center"
            whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
          >
            <ProductImage
              product={product}
              alt={`${displayName} product image`}
              className="!w-[min(82%,330px)] !drop-shadow-[0_28px_48px_rgba(15,23,42,0.25)]"
              imageClassName="brightness-[1.03] contrast-[1.04]"
              sizes="(min-width: 1280px) 330px, (min-width: 640px) 42vw, 78vw"
            />
          </motion.div>
          <span className="absolute left-3 top-3 z-10 rounded-full border border-[#00a0e3]/20 bg-[#00a0e3] px-2.5 py-1.5 text-[0.62rem] font-semibold text-white shadow-lg shadow-[#00a0e3]/20 sm:left-5 sm:top-5 sm:px-3 sm:text-[0.65rem]">
            {product.badge}
          </span>
          <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1.5 text-[0.68rem] font-semibold text-white backdrop-blur sm:right-5 sm:top-5 sm:px-3 sm:text-[0.7rem]">
            <Star size={12} className="fill-[#00a0e3] text-[#00a0e3]" />
            4.8
          </span>
        </div>
      </Link>
      <div className="p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-white/42">
            {product.collection}
          </p>
          <p className="rounded-full bg-[#00a0e3]/12 px-3 py-1 text-[0.68rem] font-semibold text-[var(--brand-blue-soft)]">
            {product.category}
          </p>
        </div>
        <h3 className="mt-4 min-h-14 text-lg font-semibold leading-tight text-white sm:min-h-16 sm:text-2xl">
          {displayName}
        </h3>
        <p className="mt-3 line-clamp-2 min-h-11 text-sm leading-6 text-white/55">
          {product.shortDescription}
        </p>
        {!hidePricing && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-2xl font-semibold text-white">
              {product.currency} {product.price}
            </p>
            <p className="text-sm text-white/35 line-through">
              {product.currency} {product.oldPrice}
            </p>
          </div>
        )}
        <div className="mt-6 grid gap-3">
          <button
            type="button"
            aria-label={`Open quick view for ${displayName}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#00a0e3] px-5 text-xs font-semibold text-white shadow-lg shadow-[#00a0e3]/20 transition hover:scale-[1.02] hover:bg-[#008fcb] active:scale-95"
            onClick={() => openQuickView(product)}
          >
            <Eye size={14} />
            View product
          </button>
          <button
            type="button"
            aria-label={`Add ${displayName} to cart`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#00a0e3]/35 bg-white/[0.04] px-5 text-xs font-semibold text-[var(--brand-blue-soft)] transition hover:border-[#00a0e3] hover:bg-[#00a0e3]/10 active:scale-95"
            onClick={handleAdd}
          >
            <Plus size={14} />
            {justAdded ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
