"use client";

import { useState } from "react";
import Image from "next/image";
import { BatteryCharging, Headphones, Package, Watch } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  ProductImage,
  productImageGroundShadowClassName,
  productImageStageClassName,
  productImageStageGlowClassName,
} from "@/components/product/ProductImage";
import { products } from "@/data/products";
import { formatProductName } from "@/lib/productDisplay";

const storySteps = [
  {
    label: "01",
    title: "Precision Audio",
    icon: Headphones,
    categorySlug: "earpods",
    pickSlugs: ["earpods", "speakers", "over-heads"],
    visualSrc: "/hero-animation/earbuds.png",
  },
  {
    label: "02",
    title: "Smart Wearables",
    icon: Watch,
    categorySlug: "smart-watches",
    pickSlugs: ["smart-watches", "car-holders", "charging-cables"],
    visualSrc: "/hero-animation/watch.png",
  },
  {
    label: "03",
    title: "Portable Power",
    icon: BatteryCharging,
    categorySlug: "power-banks",
    pickSlugs: ["power-banks", "chargers", "car-chargers"],
    visualSrc: "/hero-animation/dock.png",
  },
  {
    label: "04",
    title: "Everyday Accessories",
    icon: Package,
    categorySlug: "car-holders",
    pickSlugs: ["car-holders", "charging-cables", "adapters"],
    visualSrc: "/hero-animation/mount.png",
  },
];

export function StickyProductStory() {
  const [activeStep, setActiveStep] = useState(0);
  const reduceMotion = useReducedMotion();
  const step = storySteps[activeStep];
  const product = products.find((item) => item.categorySlug === step.categorySlug) ?? products[0];
  const recommendedProducts = step.pickSlugs
    .map((slug) => products.find((item) => item.categorySlug === slug))
    .filter(Boolean)
    .slice(0, 3) as typeof products;

  return (
    <section className="relative mx-auto max-w-[92rem] px-5 py-16 text-white sm:px-8 lg:grid lg:grid-cols-[0.82fr_1.18fr] lg:gap-10 lg:py-28">
      <div className="pointer-events-none absolute right-0 top-32 h-[38rem] w-[38rem] rounded-full bg-[#00a0e3]/10 blur-3xl" />
      <div className="lg:hidden">
        <div>
          <p className="type-eyebrow">
            ZEDX Ecosystem
          </p>
          <h2 className="mt-4 type-section-title">
            One connected collection for modern tech rituals.
          </h2>
        </div>

        <div className="-mx-5 mt-8 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-3">
            {storySteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;

              return (
                <button
                  key={step.title}
                  type="button"
                  aria-pressed={isActive}
                  className={`flex min-w-[12.5rem] items-center gap-3 rounded-full border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-[#00a0e3]/70 bg-[#00a0e3]/14 text-white shadow-[0_0_26px_rgba(0,160,227,0.12)]"
                      : "border-white/10 bg-white/[0.04] text-white/58"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-full border ${
                      isActive ? "border-[#00a0e3]/50 bg-[#00a0e3]/16" : "border-white/10 bg-white/[0.04]"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-[var(--brand-blue-soft)]" : "text-white/50"} />
                  </span>
                  <span>
                    <span className="block type-micro text-white/48">
                      Step {step.label}
                    </span>
                    <span className="mt-1 block type-control">{step.title}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          key={`mobile-${activeStep}`}
          className="relative mt-5 overflow-hidden rounded-[1.25rem] border border-white/12 bg-[radial-gradient(circle_at_52%_12%,rgba(0,160,227,0.18),transparent_36%),linear-gradient(155deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03)_46%,rgba(0,0,0,0.58))] p-4 shadow-2xl shadow-black/40"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 22 }}
        >
          <div className="absolute inset-x-8 top-10 h-40 rounded-full bg-[#00a0e3]/18 blur-3xl" />
          <div className={`${productImageStageClassName} min-h-[17rem] rounded-[1.35rem]`}>
            <div className={productImageStageGlowClassName} />
            <div className={productImageGroundShadowClassName} />
            {step.visualSrc ? (
              <Image
                src={step.visualSrc}
                alt={`${step.title} hero product`}
                width={420}
                height={420}
                className="relative z-10 max-h-[15rem] w-auto max-w-[82%] object-contain drop-shadow-[0_24px_54px_rgba(0,160,227,0.16)]"
                sizes="86vw"
              />
            ) : (
              <ProductImage
                product={product}
                alt={`${formatProductName(product.name)} story product`}
                className="!w-[min(82%,320px)] !drop-shadow-[0_24px_44px_rgba(15,23,42,0.24)]"
                imageClassName="brightness-[1.03] contrast-[1.04]"
                sizes="86vw"
              />
            )}
          </div>

          <div className="relative z-10 mt-4 rounded-[1.35rem] border border-white/12 bg-black/38 p-5 backdrop-blur-xl">
            <p className="type-micro text-[var(--brand-blue-soft)]">
              {step.title}
            </p>
            <h3 className="mt-3 type-card-title">
              {formatProductName(product.name)}
            </h3>
            <Link
              href={`/products/${product.slug}`}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#00a0e3] px-5 type-control text-white shadow-lg shadow-[#00a0e3]/20"
            >
              View product
            </Link>
          </div>
        </motion.div>

        <div className="-mx-5 mt-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-3">
            {recommendedProducts.map((item) => (
              <CompactRecommendationCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden space-y-8 lg:block lg:py-24">
        <div className="mb-16">
          <p className="type-eyebrow">
            ZEDX Ecosystem
          </p>
          <h2 className="mt-4 max-w-3xl type-section-title lg:text-[3.5rem]">
            One connected collection for modern tech rituals.
          </h2>
        </div>
        {storySteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = activeStep === index;

          return (
            <motion.article
              key={step.title}
              className={`relative min-h-[300px] rounded-[1.75rem] border px-7 py-8 transition-colors sm:min-h-[330px] sm:px-8 ${
                isActive ? "border-[#00a0e3]/70 bg-white/[0.08] shadow-[0_0_50px_rgba(0,160,227,0.08)]" : "border-white/10 bg-white/[0.025]"
              }`}
              initial={reduceMotion ? false : { opacity: 0.28, x: -28 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ amount: 0.55, margin: "-18% 0px -35% 0px" }}
              onViewportEnter={() => setActiveStep(index)}
              transition={{ type: "spring", stiffness: 90, damping: 22 }}
            >
              <div className="absolute -left-2 top-10 size-4 rounded-full border border-[#00a0e3] bg-[#050505] shadow-[0_0_28px_rgba(0,160,227,0.65)]" />
              <div className="flex items-center gap-4">
                <div className="grid size-14 place-items-center rounded-full border border-[#ffffff1a] bg-[#ffffff0a]">
                  <Icon size={22} className="text-[var(--brand-blue-soft)]" />
                </div>
                <p className="type-micro text-[#ffffff78]">
                  Step {step.label}
                </p>
              </div>
              <h3 className="mt-14 max-w-xl type-section-title sm:mt-16 sm:text-4xl">
                {step.title}
              </h3>
            </motion.article>
          );
        })}
      </div>
      <div className="hidden lg:sticky lg:top-28 lg:block lg:h-fit">
        <div className="relative min-h-[760px]">
          <div className="absolute -right-6 top-8 z-20 hidden flex-col gap-3 lg:flex">
            {storySteps.map((step, index) => (
              <button
                key={step.label}
                type="button"
                aria-label={`Story step ${step.label}`}
                className={`size-3 rounded-full transition ${
                  activeStep === index
                    ? "bg-[var(--brand-blue-soft)] shadow-[0_0_24px_rgba(0,160,227,0.8)]"
                    : "bg-[#ffffff33]"
                }`}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
          <div className="relative min-h-[760px] overflow-hidden rounded-[2.5rem] border border-white/12 bg-[radial-gradient(circle_at_62%_18%,rgba(0,160,227,0.24),transparent_34%),linear-gradient(155deg,rgba(255,255,255,0.1),rgba(255,255,255,0.035)_42%,rgba(0,0,0,0.5))] p-6 shadow-2xl shadow-black/50">
            <div className="absolute inset-x-10 top-12 h-64 rounded-full bg-[#00a0e3]/20 blur-3xl" />
            <div className="absolute right-8 top-8 z-10 rounded-full border border-[#ffffff1a] bg-[#0000004d] px-4 py-2 type-micro text-[#ffffffaa]">
              {product.collection}
            </div>
            <motion.div
              key={product.id}
              className={`${productImageStageClassName} z-10 min-h-[430px] rounded-[2rem]`}
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 110, damping: 22 }}
            >
              <div className={productImageStageGlowClassName} />
              <div className={productImageGroundShadowClassName} />
              {step.visualSrc ? (
                <Image
                  src={step.visualSrc}
                  alt={`${step.title} hero product`}
                  width={560}
                  height={560}
                  className="relative z-10 max-h-[26rem] w-auto max-w-[82%] object-contain drop-shadow-[0_36px_80px_rgba(0,160,227,0.18)]"
                  sizes="(min-width: 1024px) 520px, 86vw"
                />
              ) : (
                <ProductImage
                  product={product}
                  alt={`${formatProductName(product.name)} story product`}
                  className="!w-[min(82%,520px)] !drop-shadow-[0_34px_60px_rgba(15,23,42,0.28)]"
                  imageClassName="brightness-[1.03] contrast-[1.04]"
                  sizes="(min-width: 1024px) 520px, 86vw"
                />
              )}
            </motion.div>
            <motion.div
              key={activeStep}
              className="relative z-10 mt-6 rounded-[1.75rem] border border-white/12 bg-black/36 p-6 backdrop-blur-xl"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <p className="type-micro text-[var(--brand-blue-soft)]">
                {storySteps[activeStep].title}
              </p>
              <h3 className="mt-3 max-w-xl type-card-title">
                {formatProductName(product.name)}
              </h3>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/12 px-4 py-2 type-micro text-white/66">
                  {product.badge}
                </span>
                <Link
                  href={`/products/${product.slug}`}
                  className="rounded-full bg-[#00a0e3] px-4 py-2 type-control text-white shadow-lg shadow-[#00a0e3]/20 transition hover:bg-[#008fcb]"
                >
                  View product
                </Link>
              </div>
            </motion.div>
            <div className="relative z-10 mt-4 grid gap-3 sm:grid-cols-3">
              {recommendedProducts.map((item) => (
                <CompactRecommendationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompactRecommendationCard({ item }: { item: (typeof products)[number] }) {
  return (
    <Link
      href={`/products/${item.slug}`}
      className="group block w-[12.5rem] shrink-0 overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#10141a] p-3 text-white shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:bg-[#151b22] lg:w-auto"
    >
      <div className={`${productImageStageClassName} min-h-28 rounded-[0.95rem]`}>
        <div className={productImageGroundShadowClassName} />
        <ProductImage
          product={item}
          alt={`${formatProductName(item.name)} recommendation`}
          className="!w-[min(72%,120px)] !drop-shadow-[0_16px_26px_rgba(15,23,42,0.22)]"
          imageClassName="brightness-[1.03] contrast-[1.04]"
          sizes="140px"
        />
      </div>
      <p className="mt-3 type-micro text-[#7ddcff]">
        {item.category}
      </p>
      <p className="mt-2 line-clamp-2 min-h-10 type-control text-white">
        {formatProductName(item.name)}
      </p>
    </Link>
  );
}
