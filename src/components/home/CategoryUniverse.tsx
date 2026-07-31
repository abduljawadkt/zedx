"use client";

import Link from "next/link";
import {
  BatteryCharging,
  Car,
  Gamepad2,
  Headphones,
  MonitorSmartphone,
  Package,
  PlugZap,
  Speaker,
  Watch,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  ProductImage,
  productImageGroundShadowClassName,
  productImageStageClassName,
  productImageStageGlowClassName,
} from "@/components/product/ProductImage";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { formatProductName } from "@/lib/productDisplay";

const iconMap = {
  earpods: Headphones,
  "over-heads": Headphones,
  speakers: Speaker,
  "smart-watches": Watch,
  "power-banks": BatteryCharging,
  chargers: PlugZap,
  adapters: PlugZap,
  "car-chargers": Car,
  "car-holders": MonitorSmartphone,
  toys: Gamepad2,
};

const hiddenCategorySlugs = new Set([
  "tablets",
  "charging-cables",
  "neck-band",
  "wired-headphones",
  "car-holders",
]);

export function CategoryUniverse() {
  const reduceMotion = useReducedMotion();
  const visibleCategories = categories.filter((category) => !hiddenCategorySlugs.has(category.slug));

  return (
    <section className="bg-[#030405] px-5 py-20 text-white sm:px-8 lg:py-24">
      <div className="mx-auto max-w-[92rem]">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
            Shop by category
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-6xl sm:leading-[0.98]">
            Explore focused product categories.
          </h2>
        </div>
      </div>
      <div className="-mx-5 flex gap-5 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:px-0">
        {visibleCategories.map((category, index) => {
          const categoryProducts = products.filter((product) => product.categorySlug === category.slug);
          const heroProduct = categoryProducts[0] ?? products[index % products.length];
          const Icon = iconMap[category.slug as keyof typeof iconMap] ?? Package;

          return (
            <motion.div
              key={category.slug}
              className="min-w-[17rem] lg:min-w-0"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.035 }}
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group relative grid min-h-[21rem] overflow-hidden rounded-[1.15rem] border border-white/10 bg-[#0b0d11]/78 p-5 transition duration-500 hover:-translate-y-2 hover:border-[#00a0e3]/45 hover:shadow-xl hover:shadow-[#00a0e3]/10 sm:rounded-[1.35rem] sm:p-6"
              >
                <motion.div
                  className="relative z-10 grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-white"
                  whileHover={reduceMotion ? undefined : { rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                >
                  <Icon size={22} />
                </motion.div>
                <div className="relative z-10 mt-3 grid place-items-center">
                  <div className={`${productImageStageClassName} min-h-44 w-full rounded-[1rem]`}>
                    <div className={productImageStageGlowClassName} />
                    <div className={productImageGroundShadowClassName} />
                  <ProductImage
                    product={heroProduct}
                    className="!w-[min(82%,220px)] !drop-shadow-[0_20px_36px_rgba(15,23,42,0.22)]"
                    imageClassName="brightness-[1.03] contrast-[1.04]"
                    sizes="240px"
                    alt={`${category.name} category product: ${formatProductName(heroProduct.name)}`}
                  />
                  </div>
                </div>
                <div className="relative z-10 mt-auto">
                  <h3 className="text-2xl font-semibold text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
