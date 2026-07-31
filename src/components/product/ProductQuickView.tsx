"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import {
  ProductImage,
  productImageGroundShadowClassName,
  productImageStageClassName,
  productImageStageGlowClassName,
} from "@/components/product/ProductImage";
import type { Product } from "@/data/products";
import { formatProductName } from "@/lib/productDisplay";

export function ProductQuickView({
  onClose,
  product,
}: {
  onClose: () => void;
  product: Product | null;
}) {
  const { addToCart } = useCommerce();
  const displayName = product ? formatProductName(product.name) : "";

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[70] bg-black/70 p-5 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="absolute inset-0 cursor-default"
            type="button"
            aria-label="Close quick view"
            onClick={onClose}
          />
          <motion.aside
            className="glass-panel relative mx-auto flex h-full w-full max-w-5xl flex-col overflow-auto rounded-[1.35rem] p-6 shadow-2xl shadow-cyan-500/10 sm:h-auto sm:max-h-[calc(100vh-2.5rem)] sm:rounded-[1.8rem] sm:p-8 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-8"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: "spring", stiffness: 170, damping: 24 }}
          >
            <button
              className="absolute right-5 top-5 z-20 grid size-11 place-items-center rounded-full border border-white/10 bg-black/30 text-white transition hover:scale-105"
              type="button"
              aria-label="Close quick view panel"
              onClick={onClose}
            >
              <X size={18} />
            </button>
            <div className={`${productImageStageClassName} min-h-80 rounded-[1.2rem] lg:min-h-[520px] lg:rounded-[1.6rem]`}>
              <div className={productImageStageGlowClassName} />
              <div className={productImageGroundShadowClassName} />
              <ProductImage
                product={product}
                alt={`${displayName} quick view image`}
                className="product-float !w-[min(76%,420px)] !drop-shadow-[0_32px_58px_rgba(15,23,42,0.28)]"
                imageClassName="brightness-[1.03] contrast-[1.04]"
                sizes="(min-width: 1024px) 420px, 72vw"
              />
            </div>
            <div className="pt-8 lg:pt-10">
              <p className="text-xs font-semibold text-cyan-200/80">
                {product.collection}
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-6xl sm:leading-[0.98]">
                {displayName}
              </h2>
              <div className="mt-6 flex items-end gap-4">
                <p className="text-3xl font-semibold text-white">
                  {product.currency} {product.price}
                </p>
                <p className="pb-1 text-white/35 line-through">
                  {product.currency} {product.oldPrice}
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {product.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/60"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  aria-label={`Add ${displayName} to cart`}
                  className="h-12 flex-1 rounded-full bg-[#00a0e3] text-sm font-semibold text-white shadow-lg shadow-[#00a0e3]/20 transition hover:scale-[1.02] hover:bg-[#008fcb] active:scale-95"
                  onClick={() => addToCart(product)}
                >
                  Add to cart
                </button>
                <Link
                  href={`/products/${product.slug}`}
                  className="grid h-12 place-items-center rounded-full border border-[#00a0e3]/35 bg-white/[0.04] px-5 text-sm font-semibold text-[var(--brand-blue-soft)] transition hover:border-[#00a0e3] hover:bg-[#00a0e3]/10"
                  onClick={onClose}
                >
                  Full product page
                </Link>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
