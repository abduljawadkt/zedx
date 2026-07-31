"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ProductImage } from "@/components/product/ProductImage";
import { products, type Product } from "@/data/products";
import { formatProductName } from "@/lib/productDisplay";

const featureCards = [
  {
    label: "Audio",
    title: "Precision Audio",
    href: "/products/zedx-headphone-lumen-100",
    productSlug: "zedx-headphone-lumen-100",
    metric: "Shop audio",
    tone: "cyan",
    size: "large",
  },
  {
    label: "Wearables",
    title: "Future on Your Wrist",
    href: "/products/zedx-at-24-ultra-watch",
    productSlug: "zedx-at-24-ultra-watch",
    metric: "Shop watches",
    tone: "silver",
    size: "compact",
  },
  {
    label: "Power",
    title: "Power Your Workflow",
    href: "/products/zedx-power-dock-x-gan-105w",
    productSlug: "zedx-power-dock-x-gan-105w",
    metric: "Shop power",
    tone: "blue",
    size: "compact",
  },
] as const;

const toneClassNames = {
  blue: {
    badge: "border-[#00a0e3]/35 bg-[#00a0e3]/18 text-[var(--brand-blue-soft)]",
    glow: "bg-[#00a0e3]/20",
    line: "from-[#00a0e3]/0 via-[#00a0e3]/65 to-[#00a0e3]/0",
  },
  cyan: {
    badge: "border-cyan-200/24 bg-cyan-200/10 text-cyan-100",
    glow: "bg-cyan-300/16",
    line: "from-cyan-300/0 via-cyan-200/60 to-cyan-300/0",
  },
  silver: {
    badge: "border-white/20 bg-white/12 text-white/86",
    glow: "bg-white/12",
    line: "from-white/0 via-white/42 to-white/0",
  },
};

const headerReveal = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const cardReveal = {
  hidden: { opacity: 0, y: 72, scale: 0.975, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
};

export function CategoryStrip() {
  const [primaryCard, ...secondaryCards] = featureCards;
  const reduceMotion = useReducedMotion();
  const initialState = reduceMotion ? false : "hidden";
  const viewport = { once: true, amount: 0.24, margin: "-12% 0px -14% 0px" };

  return (
    <section
      aria-label="Featured ZEDX categories"
      className="border-y border-white/10 bg-[#030405] px-4 py-14 text-white sm:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[92rem]">
        <motion.div
          className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
          initial={initialState}
          transition={{ type: "spring", stiffness: 92, damping: 22 }}
          variants={headerReveal}
          viewport={viewport}
          whileInView="visible"
        >
          <div>
            <p className="type-eyebrow">Shop By Setup</p>
            <h2 className="mt-3 type-section-title">
              Shop ZEDX by setup.
            </h2>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]"
          initial={initialState}
          transition={{ staggerChildren: 0.12, delayChildren: 0.08 }}
          viewport={viewport}
          whileInView="visible"
        >
          <motion.div
            className="min-w-0"
            transition={{ type: "spring", stiffness: 78, damping: 20, mass: 0.92 }}
            variants={cardReveal}
          >
            <CategoryFeatureCard card={primaryCard} priority />
          </motion.div>
          <div className="grid gap-5">
            {secondaryCards.map((card, index) => (
              <motion.div
                key={card.label}
                className="min-w-0"
                transition={{
                  type: "spring",
                  stiffness: 82,
                  damping: 20,
                  mass: 0.88,
                  delay: index * 0.04,
                }}
                variants={cardReveal}
              >
                <CategoryFeatureCard card={card} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryFeatureCard({
  card,
  priority = false,
}: {
  card: (typeof featureCards)[number];
  priority?: boolean;
}) {
  const product = products.find((item) => item.slug === card.productSlug) ?? products[0];
  const isLarge = card.size === "large";
  const tone = toneClassNames[card.tone];

  return (
    <Link
      href={card.href}
      className={`group relative isolate grid overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#0b0d11] shadow-2xl shadow-black/30 transition duration-500 hover:-translate-y-1 hover:border-[#00a0e3]/45 hover:bg-[#10141a] sm:rounded-[1.7rem] ${
        isLarge
          ? "min-h-[36rem] gap-7 p-5 sm:min-h-[38rem] sm:p-7 lg:min-h-[44rem] lg:p-8"
          : "min-h-[21rem] gap-6 p-5 sm:p-7 xl:grid-cols-[0.88fr_1fr] xl:items-center"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_14%,rgba(0,160,227,0.2),transparent_30%),radial-gradient(circle_at_18%_88%,rgba(255,255,255,0.06),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.42)_48%,rgba(0,0,0,0.84))]" />
      <div className={`pointer-events-none absolute -right-20 top-8 size-72 rounded-full blur-3xl ${tone.glow}`} />
      <div className={`pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r ${tone.line}`} />

      <div className={`relative z-10 flex min-w-0 flex-col ${isLarge ? "max-w-2xl" : ""}`}>
        <span
          className={`w-fit rounded-full border px-3.5 py-2 type-micro backdrop-blur-md ${tone.badge}`}
        >
          {card.label}
        </span>
        <h3
          className={`mt-5 max-w-[15ch] font-semibold leading-[1.06] text-white ${
            isLarge ? "text-4xl sm:text-5xl lg:text-[3.4rem]" : "text-3xl sm:text-4xl xl:text-[2.8rem]"
          }`}
        >
          {card.title}
        </h3>

        <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-auto sm:pt-8">
          <span className="inline-flex h-12 items-center gap-3 rounded-full bg-white px-4 type-control text-[#050505] shadow-lg shadow-white/5 transition group-hover:bg-[var(--brand-blue-soft)]">
            <ArrowRight size={17} />
            Shop now
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 type-micro text-white/62">
            {card.metric}
          </span>
        </div>
      </div>

      <ProductStage
        isLarge={isLarge}
        priority={priority}
        product={product}
        tone={card.tone}
      />
    </Link>
  );
}

function ProductStage({
  isLarge,
  priority,
  product,
  tone: toneName,
}: {
  isLarge: boolean;
  priority: boolean;
  product: Product;
  tone: keyof typeof toneClassNames;
}) {
  const tone = toneClassNames[toneName];

  return (
    <div
      className={`relative z-10 grid min-h-72 place-items-center overflow-hidden rounded-[1.1rem] border border-black/10 bg-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.86),0_24px_70px_rgba(0,0,0,0.24)] sm:rounded-[1.35rem] ${
        isLarge ? "lg:min-h-[27rem]" : "xl:min-h-72"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.94),transparent_42%),radial-gradient(circle_at_50%_88%,rgba(0,160,227,0.08),transparent_36%)]" />
      <div className={`pointer-events-none absolute bottom-[20%] h-[30%] w-[58%] rounded-full blur-3xl opacity-45 ${tone.glow}`} />
      <div className="pointer-events-none absolute inset-x-[14%] bottom-[15%] h-10 rounded-full bg-slate-950/16 blur-2xl" />
      <ProductImage
        product={product}
        alt={`${formatProductName(product.name)} category feature`}
        priority={priority}
        className={
          isLarge
            ? "!w-[min(62%,520px)] !drop-shadow-[0_36px_70px_rgba(15,23,42,0.22)]"
            : "!w-[min(72%,340px)] !drop-shadow-[0_30px_58px_rgba(15,23,42,0.2)]"
        }
        imageClassName="brightness-[1.03] contrast-[1.05]"
        sizes={isLarge ? "(min-width: 1024px) 40vw, 82vw" : "(min-width: 1280px) 24vw, 74vw"}
      />
      <span className="absolute bottom-4 left-4 right-4 truncate rounded-full border border-black/10 bg-[#1b2027]/88 px-4 py-2 text-center type-micro text-white/78 shadow-lg shadow-black/10 backdrop-blur-md">
        {formatProductName(product.name)}
      </span>
    </div>
  );
}
