"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ProductImage } from "@/components/product/ProductImage";
import type { Product } from "@/data/products";

const transparentVisuals: Record<string, string> = {
  "zeepods-ultra": "/hero-animation/earbuds.png",
  "zeeclip-2": "/hero-animation/earbuds.png",
  "zx-025-speaker": "/hero-animation/speaker.png",
  "verza-z4": "/hero-animation/watch.png",
  "powercore-20k": "/hero-animation/dock.png",
  "turbo-wallcharger": "/hero-animation/dock.png",
  "lumen-100-headphones": "/hero-animation/headphones.png",
};

export function FloatingProduct({
  className,
  product,
}: {
  className?: string;
  product?: Product;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      animate={reduceMotion ? undefined : { y: [0, -18, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
    >
      {product && transparentVisuals[product.id] ? (
        <div className="relative z-10 aspect-square w-full drop-shadow-[0_35px_80px_rgba(56,189,248,0.22)]">
          <Image
            src={transparentVisuals[product.id]}
            alt={`${product.name} transparent product visual`}
            fill
            sizes="(min-width: 1024px) 360px, 70vw"
            className="object-contain"
          />
        </div>
      ) : product ? (
        <ProductImage
          product={product}
          alt={`${product.name} floating product visual`}
          className="!w-full"
          imageClassName="brightness-[1.03] contrast-[1.04]"
          sizes="(min-width: 1024px) 360px, 70vw"
        />
      ) : (
        <div
          className="product-object !w-full"
          aria-label="Floating product visual"
          role="img"
        />
      )}
    </motion.div>
  );
}
