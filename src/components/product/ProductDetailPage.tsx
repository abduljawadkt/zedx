"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Minus, Plus, ShieldCheck, ShoppingBag, Truck, Zap } from "lucide-react";
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
import { formatCategoryName, formatProductDescription, formatProductName } from "@/lib/productDisplay";
import { storefrontConfig } from "@/config/storefront";

const shippingItems = [
  {
    title: storefrontConfig.shipping.shortLabel,
    icon: Truck,
    content: storefrontConfig.shipping.description,
  },
  {
    title: storefrontConfig.warranty.label,
    icon: ShieldCheck,
    content: storefrontConfig.warranty.description,
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
          <p className="type-eyebrow text-cyan-200/80">
            Product launch
          </p>
          <p className="mt-3 max-w-2xl type-muted text-white/60">
            Explore the finish, pricing, highlights, and setup details before you add it to your cart.
          </p>
        </div>
        <p className="type-micro text-white/48">
          {product.collection} / {formatCategoryName(product.category)}
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
            <Badge className="text-[var(--brand-blue-soft)]">{formatCategoryName(product.category)}</Badge>
            <Badge className="text-white/70">{product.color}</Badge>
          </div>
          <h1 className="mt-5 type-page-title">
            {displayName}
          </h1>
          <p className="mt-5 max-w-xl type-body sm:mt-6">
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
              <span className="mb-1 rounded-full bg-[#00a0e3]/16 px-3 py-1 type-micro text-[var(--brand-blue-soft)]">
                Launch price: {product.currency} {savings} less than list
              </span>
            )}
          </div>

          <div className="mt-7 rounded-[1.25rem] border border-[#00a0e3]/30 bg-[#00a0e3]/10 p-4">
            <div className="flex items-center gap-3 type-control text-white">
              <Zap size={17} className="text-[var(--brand-blue-soft)]" />
              Auto-applied launch offer
            </div>
            <p className="mt-2 type-muted">
              Current demo pricing is shown clearly before checkout. Timed offers will appear only after ZEDX confirms campaign dates.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 type-micro text-white/52">
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
                <span className="grid h-14 min-w-12 place-items-center border-x border-white/10 type-control text-white">
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
              className="inline-flex h-13 items-center justify-center gap-3 rounded-full bg-[#00a0e3] px-5 type-control text-white shadow-lg shadow-[#00a0e3]/20 transition hover:scale-105 hover:bg-[#008fcb] sm:h-14 sm:px-7"
              onClick={() => addSelectedQuantity()}
            >
              <ShoppingBag size={17} />
              Add to cart
            </button>
            <Link
              href="/checkout"
              className="inline-flex h-13 items-center justify-center rounded-full border border-[#00a0e3]/40 bg-[#00a0e3]/10 px-5 type-control text-[var(--brand-blue-soft)] transition hover:scale-105 hover:border-[#00a0e3] hover:bg-[#00a0e3]/16 sm:h-14 sm:px-7"
              onClick={() => addSelectedQuantity(false)}
            >
              Buy now
            </Link>
            <button
              type="button"
              aria-label={`Preview ${displayName} in quick view`}
              className="h-13 rounded-full border border-white/10 px-5 type-control text-white transition hover:scale-105 hover:border-[#00a0e3]/70 sm:h-14 sm:px-7"
              onClick={() => openQuickView(product)}
            >
                Quick view
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {product.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 type-micro text-white/68"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
            {[
              storefrontConfig.shipping.label,
              storefrontConfig.warranty.label,
              storefrontConfig.support.label,
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 type-control text-white/68">
                <ShieldCheck size={17} className="text-[var(--brand-blue-soft)]" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-3">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="type-control text-white/78">Key specifications</p>
              <dl className="mt-4 grid gap-3">
                {product.specs.map((spec) => (
                  <div
                    key={spec}
                    className="grid gap-1 rounded-2xl border border-white/10 bg-black/18 p-4 sm:grid-cols-[0.7fr_1fr] sm:items-center"
                  >
                    <dt className="type-micro text-white/50">Feature</dt>
                    <dd className="type-control text-white/76">{spec}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {[
              {
                title: "Compatibility",
                content:
                  "Designed for everyday phone, tablet, audio, and accessory setups. Check connector type and power needs before ordering.",
              },
              {
                title: "Box contents",
                content:
                  "Packaging contents vary by SKU. ZEDX should confirm exact accessories, cables, and manuals for each product before launch.",
              },
              {
                title: "FAQ",
                content:
                  "Need help choosing? Compare price, category, connector type, charging speed, and daily use case before checkout.",
              },
            ].map((item, index) => (
              <AccordionItem
                key={item.title}
                open={openSpec === index}
                title={item.title}
                onClick={() => setOpenSpec(openSpec === index ? -1 : index)}
              >
                {item.content}
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
          <p className="type-eyebrow text-cyan-200/80">
            Related products
          </p>
          <h2 className="mt-4 type-section-title">
            Complete the setup.
          </h2>
          <div className="mt-10">
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[#050505]/94 p-3 shadow-[0_-18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:hidden">
        <div className="mx-auto flex max-w-[92rem] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate type-control text-white">{displayName}</p>
            <p className="type-micro text-[var(--brand-blue-soft)]">{price}</p>
          </div>
          <button
            type="button"
            aria-label={`Add ${displayName} to cart`}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#00a0e3] px-5 text-sm font-semibold text-white shadow-lg shadow-[#00a0e3]/20"
            onClick={() => addSelectedQuantity()}
          >
            <ShoppingBag size={16} />
            Add
          </button>
          <Link
            href="/checkout"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#050505]"
            onClick={() => addSelectedQuantity(false)}
          >
            Buy
          </Link>
        </div>
      </div>
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
        <span className="flex items-center gap-3 type-control text-white/78">
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
            <p className="px-4 pb-4 type-muted">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
