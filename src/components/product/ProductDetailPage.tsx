"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck, Zap } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { Badge } from "@/components/ui/Badge";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  ProductImage,
  productImageGroundShadowClassName,
  productImageStageClassName,
  productImageStageGlowClassName,
} from "@/components/product/ProductImage";
import type { Product } from "@/data/products";
import { formatProductDescription, formatProductName } from "@/lib/productDisplay";

const shippingItems = [
  {
    title: "Shipping",
    icon: Truck,
    content:
      "Estimated delivery: 1-3 business days in major UAE cities.",
  },
  {
    title: "Warranty",
    icon: ShieldCheck,
    content:
      "Warranty support information may vary by product, region, and service availability.",
  },
];

export function ProductDetailPage({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const { addToCart, openQuickView } = useCommerce();
  const [activeImage, setActiveImage] = useState(product.gallery[0] ?? product.image);
  const [openSpec, setOpenSpec] = useState(0);
  const [openShipping, setOpenShipping] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const reduceMotion = useReducedMotion();
  const price = `${product.currency} ${product.price}`;
  const gallery = useMemo(() => product.gallery.length ? product.gallery : [product.image], [product]);
  const savings = Math.max(product.oldPrice - product.price, 0);
  const displayName = formatProductName(product.name);
  const displayDescription = formatProductDescription(product);

  function addSelectedQuantity(openCart = true) {
    Array.from({ length: quantity }).forEach(() =>
      addToCart(product, { openCart }),
    );
  }

  return (
    <main className="relative mx-auto w-full max-w-[92rem] flex-1 px-4 py-12 text-white sm:px-8 sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-4 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
      <motion.div
        className="mb-8 flex flex-col gap-4 rounded-[1.2rem] border border-white/10 bg-[#0b0d11]/72 p-5 shadow-2xl shadow-black/30 sm:mb-14 sm:flex-row sm:items-end sm:justify-between sm:rounded-[1.6rem] sm:p-8"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 22 }}
      >
        <div>
          <p className="text-xs font-semibold text-cyan-200/80">
            Product launch
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
            Explore the finish, pricing, highlights, and setup details before you add it to your cart.
          </p>
        </div>
        <p className="text-xs font-semibold text-white/35">
          {product.collection} / {product.category}
        </p>
      </motion.div>
      <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <section aria-label={`${displayName} gallery`} className="space-y-5">
          <motion.div
            className={`${productImageStageClassName} min-h-[330px] rounded-[1.2rem] shadow-2xl shadow-cyan-500/10 sm:min-h-[640px] sm:rounded-[1.8rem]`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 22 }}
          >
            <div className={productImageStageGlowClassName} />
            <div className={productImageGroundShadowClassName} />
            <motion.div
              key={activeImage}
              className="relative z-10 grid w-full place-items-center"
              initial={reduceMotion ? false : { opacity: 0, rotate: -8, scale: 0.9 }}
              animate={reduceMotion ? undefined : { opacity: 1, rotate: -2, scale: 1 }}
              whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: 3 }}
              transition={{ type: "spring", stiffness: 110, damping: 18 }}
            >
              <ProductImage
                product={product}
                src={activeImage}
                alt={`${displayName} gallery image`}
                priority
                className="!w-[min(84%,560px)] !drop-shadow-[0_34px_60px_rgba(15,23,42,0.28)] sm:!w-[min(76%,620px)]"
                imageClassName="brightness-[1.03] contrast-[1.04]"
                sizes="(min-width: 1024px) 620px, 86vw"
              />
            </motion.div>
            <span className="sr-only">{activeImage}</span>
          </motion.div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`${productImageStageClassName} min-h-24 rounded-[1rem] transition hover:scale-105 sm:min-h-36 sm:rounded-[1.4rem] ${
                  activeImage === image
                    ? "border-[#00a0e3] opacity-100 ring-4 ring-[#00a0e3]/15"
                    : "opacity-75"
                }`}
                aria-label={`Select ${displayName} gallery image ${index + 1}`}
                onClick={() => setActiveImage(image)}
              >
                <div className={productImageGroundShadowClassName} />
                <ProductImage
                  product={product}
                  src={image}
                  alt={`${displayName} thumbnail ${index + 1}`}
                  className="!w-[58%] !drop-shadow-[0_18px_28px_rgba(15,23,42,0.22)]"
                  imageClassName="brightness-[1.03] contrast-[1.04]"
                  sizes="180px"
                />
                <span className="sr-only">Select gallery image {index + 1}</span>
              </button>
            ))}
          </div>
        </section>

        <motion.section
          className="lg:sticky lg:top-28 lg:h-fit"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 22 }}
        >
          <div className="flex flex-wrap gap-3">
            <Badge>{product.badge}</Badge>
            <Badge className="text-[var(--brand-blue-soft)]">{product.category}</Badge>
            <Badge className="text-white/70">{product.color}</Badge>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--brand-blue-soft)]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={16} className="fill-current" />
            ))}
            <span className="ml-2 text-white/45">54 verified reviews</span>
          </div>
          <h1 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-6xl sm:leading-[0.98]">
            {displayName}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/55 sm:mt-6 sm:text-lg sm:leading-8">
            {displayDescription}
          </p>
          <div className="mt-7 flex flex-wrap items-end gap-3 sm:mt-8 sm:gap-4">
            <p className="text-3xl font-semibold text-white sm:text-4xl">
              {price}
            </p>
            <p className="pb-1 text-lg text-white/35 line-through">
              {product.currency} {product.oldPrice}
            </p>
            {savings > 0 && (
              <span className="mb-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                Save {product.currency} {savings}
              </span>
            )}
          </div>

          <div className="mt-7 rounded-[1.25rem] border border-[#00a0e3]/30 bg-[#00a0e3]/10 p-4">
            <div className="flex items-center gap-3 text-sm font-semibold text-white">
              <Zap size={17} className="text-[var(--brand-blue-soft)]" />
              Auto-applied launch offer
            </div>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Limited launch pricing is applied automatically for this product.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold text-white/40">
                Quantity
              </p>
              <div className="inline-flex h-14 items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.035]">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="grid size-14 place-items-center text-white/65 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  <Minus size={16} />
                </button>
                <span className="grid h-14 min-w-12 place-items-center border-x border-white/10 text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="grid size-14 place-items-center text-white/65 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setQuantity((current) => Math.min(9, current + 1))}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                aria-label={`Add ${displayName} to cart`}
              className="inline-flex h-13 items-center justify-center gap-3 rounded-full bg-[#00a0e3] px-5 text-xs font-semibold text-white shadow-lg shadow-[#00a0e3]/20 transition hover:scale-105 hover:bg-[#008fcb] sm:h-14 sm:px-7 sm:text-sm"
              onClick={() => addSelectedQuantity()}
            >
              <ShoppingBag size={17} />
              Add to cart
            </button>
            <Link
              href="/checkout"
              className="inline-flex h-13 items-center justify-center rounded-full border border-[#00a0e3]/40 bg-[#00a0e3]/10 px-5 text-xs font-semibold text-[var(--brand-blue-soft)] transition hover:scale-105 hover:border-[#00a0e3] hover:bg-[#00a0e3]/16 sm:h-14 sm:px-7 sm:text-sm"
              onClick={() => addSelectedQuantity(false)}
            >
              Buy now
            </Link>
            <button
              type="button"
              aria-label={`Preview ${displayName} in quick view`}
              className="h-13 rounded-full border border-white/10 px-5 text-xs font-semibold text-white transition hover:scale-105 hover:border-[#00a0e3]/70 sm:h-14 sm:px-7 sm:text-sm"
              onClick={() => openQuickView(product)}
            >
                Quick view
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {product.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/60"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
            {[
              "In stock - estimated delivery in 3-7 business days",
              "30-day money-back guarantee",
              "Lifetime customer support messaging",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-semibold text-white/62">
                <ShieldCheck size={17} className="text-[var(--brand-blue-soft)]" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-3">
            {product.specs.map((spec, index) => (
              <AccordionItem
                key={spec}
                open={openSpec === index}
                title={spec}
                onClick={() => setOpenSpec(openSpec === index ? -1 : index)}
              >
                Detailed product information for {displayName}, including fit, finish, compatibility, and everyday performance.
              </AccordionItem>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {shippingItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <AccordionItem
                  key={item.title}
                  open={openShipping === index}
                  title={item.title}
                  onClick={() => setOpenShipping(openShipping === index ? -1 : index)}
                  icon={<Icon size={17} />}
                >
                  {item.content}
                </AccordionItem>
              );
            })}
          </div>
        </motion.section>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-24 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:mt-32 sm:p-8">
          <p className="text-xs font-semibold text-cyan-200/80">
            Related products
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-6xl sm:leading-[0.98]">
            Complete the setup.
          </h2>
          <div className="mt-10">
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}
    </main>
  );
}

function AccordionItem({
  children,
  icon,
  onClick,
  open,
  title,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick: () => void;
  open: boolean;
  title: string;
}) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
        onClick={onClick}
      >
        <span className="flex items-center gap-3 text-sm font-semibold text-white/75">
          {icon}
          {title}
        </span>
        <ChevronDown
          className={`text-white/45 transition ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 24 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm leading-6 text-white/50">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
