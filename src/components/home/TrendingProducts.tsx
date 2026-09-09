"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ProductImage } from "@/components/product/ProductImage";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { type Product } from "@/data/products";
import { formatCategoryName, formatProductName } from "@/lib/productDisplay";

const featuredSlugs = [
  "zedx-zeepods-pro-2025",
  "zedx-3-in-1-foldable-wireless-charging-station-zx-026",
  "zedx-power-dock-x-gan-105w",
  "zedx-z-mag-mini-10000-mah-zx-w11p",
  "zedx-zee-holder-360-car-mount",
];

const newArrivalSlugs = [
  "zedx-car-charger-52-5w-ze-01",
  "zedx-gan-charger-65w-z430",
  "zedx-z-mag-mini-10000-mah-zx-w11p",
  "zedx-headphone-lumen-100",
  "zedx-world-travel-adapter-70w-gan",
];

function resolveCurated(products: Product[], slugs: string[], fallbackCount: number) {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const resolved = slugs
    .map((slug) => bySlug.get(slug))
    .filter((product): product is Product => Boolean(product));

  return resolved.length > 0 ? resolved : products.slice(0, fallbackCount);
}

export function TrendingProducts() {
  const { products } = useCatalog();
  const featuredProducts = resolveCurated(products, featuredSlugs, 5);

  return <ProductCarouselSection title="Featured items" products={featuredProducts} />;
}

export function NewArrivals() {
  const { products } = useCatalog();
  const newArrivalProducts = resolveCurated(products, newArrivalSlugs, 5);

  return <ProductCarouselSection title="New Arrivals" products={newArrivalProducts} hideProductNames />;
}

function ProductCarouselSection({
  title,
  products,
  hideProductNames = false,
}: {
  title: string;
  products: Product[];
  hideProductNames?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="overflow-hidden bg-[#050505] px-5 py-14 text-white sm:px-8 lg:py-16">
      <div className="mx-auto max-w-[92rem]">
        <div className="mb-8 flex items-center justify-between gap-5">
          <div>
            <p className="inline-flex rounded-[1.4rem] bg-[var(--brand-blue)] px-7 py-4 text-sm font-bold text-white shadow-[0_18px_55px_rgba(0,160,227,0.24)] sm:px-8">
              {title}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 text-sm font-semibold text-white/66 transition hover:text-white"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 pb-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 xl:mx-0 xl:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-5 xl:w-full">
            {products.map((product, index) => (
              <motion.div
                key={product.slug}
                className="xl:flex-1"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ type: "spring", stiffness: 120, damping: 22, delay: index * 0.035 }}
              >
                <FeaturedSkuCard product={product} hideProductName={hideProductNames} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-white/40">
          <div className="h-full w-[14%] rounded-full bg-[var(--brand-blue)] shadow-[0_0_22px_rgba(0,160,227,0.7)]" />
        </div>
      </div>
    </section>
  );
}

function FeaturedSkuCard({
  product,
  hideProductName = false,
}: {
  product: Product;
  hideProductName?: boolean;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      aria-label={`View ${product.name} product details`}
      className="group block w-[20.5rem] overflow-hidden rounded-[1.15rem] bg-[#f2f3f4] text-[#050505] shadow-[0_22px_65px_rgba(0,0,0,0.24)] transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_30px_90px_rgba(0,160,227,0.16)] xl:w-full"
    >
      <div className="relative grid h-[20rem] place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_20%,#ffffff_0%,#f9fafb_42%,#e9edf1_100%)]">
        <div className="pointer-events-none absolute inset-x-[18%] bottom-[17%] h-8 rounded-full bg-slate-950/13 blur-2xl" />
        <ProductImage
          product={product}
          alt={`${product.name} product image`}
          className="!w-[min(78%,260px)] transition duration-500 group-hover:scale-105"
          imageClassName="brightness-[1.02] contrast-[1.04]"
          sizes="(min-width: 1280px) 260px, 240px"
        />
      </div>
      <div className={hideProductName ? "px-6 py-4" : "min-h-[7.5rem] px-6 py-6"}>
        <p className="text-[0.68rem] font-semibold text-[#00a0e3]">
          {formatCategoryName(product.category)}
        </p>
        {!hideProductName && (
          <h3 className="mt-4 line-clamp-2 text-[1.32rem] font-bold leading-[1.08] tracking-normal text-[#050505]">
            {formatProductName(product.name)}
          </h3>
        )}
      </div>
    </Link>
  );
}
