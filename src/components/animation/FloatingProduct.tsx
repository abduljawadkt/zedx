"use client";

import { motion, useReducedMotion } from "motion/react";
import { ProductImage } from "@/components/product/ProductImage";
import type { Product } from "@/data/products";
import { formatProductName } from "@/lib/productDisplay";

type FloatingProductProps = {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  product?: Product;
};

export function FloatingProduct({ children, className = "", delay = 0, product }: FloatingProductProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [-1, 1.5, -1] }}
      transition={{
        delay,
        duration: 5.4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {product ? (
        <ProductImage
          product={product}
          alt={`${formatProductName(product.name)} floating product image`}
          className="!w-full"
          sizes="(min-width: 1024px) 360px, 70vw"
        />
      ) : (
        children
      )}
    </motion.div>
  );
}
