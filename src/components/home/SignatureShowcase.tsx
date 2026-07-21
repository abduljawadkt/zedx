"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { FloatingProduct } from "@/components/animation/FloatingProduct";
import { products } from "@/data/products";

export function SignatureShowcase() {
  const reduceMotion = useReducedMotion();
  const product =
    products.find((item) => item.categorySlug === "smart-watches") ?? products[3];

  return (
    <section className="mx-auto grid max-w-[92rem] gap-10 bg-[#050505] px-5 py-28 text-white sm:px-8 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 90, damping: 22 }}
      >
        <p className="text-xs font-semibold text-violet-200/80">
          Signature product
        </p>
        <h2 className="mt-4 text-6xl font-semibold leading-[0.86] text-white sm:text-8xl">
          {product.name}
        </h2>
        <p className="mt-8 max-w-xl text-lg leading-8 text-white/55">
          {product.description}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#050505] transition hover:scale-105 hover:bg-[var(--brand-blue-soft)]"
        >
          See signature
        </Link>
      </motion.div>
      <motion.div
        className="relative"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 90, damping: 22 }}
      >
        <div className="product-glow" />
        <div className="product-stage min-h-[680px] rounded-[2.4rem]">
          <FloatingProduct
            product={product}
            className="relative z-10 w-[min(64%,360px)]"
          />
          <div className="absolute left-8 top-8 z-10 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-[var(--brand-blue-soft)]">
            {product.badge}
          </div>
          <div className="absolute bottom-8 left-8 right-8 z-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            {product.highlights.slice(0, 3).map((highlight) => (
              <p key={highlight} className="text-sm leading-6 text-white/60">
                {highlight}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
