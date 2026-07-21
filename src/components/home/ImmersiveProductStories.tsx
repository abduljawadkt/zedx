"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { products } from "@/data/products";
import { getTransparentProductImageSrc } from "@/components/product/ProductImage";
import { formatProductName } from "@/lib/productDisplay";

const storyVideos = {
  powerbankCta: "/story-videos/zedx-powerbank-cta.mp4",
  retractableCable: "/story-videos/zedx-retractable-cable.mp4",
  headphoneV1: "/story-videos/zedx-headphone-v1.mp4",
  headphoneV2: "/story-videos/zedx-headphone-v2.mp4",
  carCharger: "/story-videos/zedx-car-charger.mp4",
  earpodsLandscape: "/story-videos/zedx-earpods-landscape.mp4",
};

type StoryVideoProps = {
  src: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
  mediaClassName?: string;
  cta?: string;
  productSlug?: string;
};

function StoryVideo({
  src,
  label,
  title,
  description,
  className = "",
  mediaClassName = "object-center",
  cta,
  productSlug,
}: StoryVideoProps) {
  const product = productSlug ? products.find((item) => item.slug === productSlug) : undefined;

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#0b0c0f] shadow-2xl shadow-black/30 sm:rounded-[1.8rem] ${className}`}
    >
      <video
        className={`absolute inset-0 h-full w-full object-cover opacity-92 transition duration-700 group-hover:scale-[1.035] ${mediaClassName}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${label} ZEDX brand video`}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.18)_44%,rgba(0,0,0,0.8))]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,160,227,0.18),transparent_38%),linear-gradient(250deg,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
        <p className="w-fit rounded-full border border-white/16 bg-white/12 px-4 py-2 text-[0.68rem] font-semibold text-white/84 backdrop-blur-md">
          {label}
        </p>
        <h3 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight text-white drop-shadow-[0_4px_22px_rgba(0,0,0,0.7)] sm:text-5xl">
          {title}
        </h3>
        {description ? (
          <p className="mt-4 max-w-md text-base leading-7 text-white/78 drop-shadow-[0_3px_14px_rgba(0,0,0,0.68)]">
            {description}
          </p>
        ) : null}
        {product ? (
          <Link
            href={`/products/${product.slug}`}
            className="mt-5 flex w-full max-w-sm items-center gap-3 rounded-[1.1rem] border border-white/16 bg-black/44 p-2.5 text-left shadow-2xl shadow-black/35 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[var(--brand-blue)] hover:bg-black/58"
            aria-label={`View ${formatProductName(product.name)}`}
          >
            <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/16 bg-[radial-gradient(circle_at_50%_18%,#ffffff,#dfe7ef)] sm:size-20">
              <Image
                src={getTransparentProductImageSrc(product.image)}
                alt={`${formatProductName(product.name)} product image`}
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.58rem] font-semibold text-[var(--brand-blue-soft)] sm:text-[0.62rem]">
                Shop this product
              </span>
              <span className="mt-1 block truncate text-sm font-semibold leading-tight text-white">
                {formatProductName(product.name)}
              </span>
              <span className="mt-1 block text-xs font-semibold text-white/72">
                {product.currency} {product.price}
              </span>
            </span>
          </Link>
        ) : null}
        {cta ? (
          <div className="mt-7 inline-flex items-center gap-3 text-sm font-semibold text-white/86">
            <span className="grid size-11 place-items-center rounded-full border border-white/18 bg-white text-[#050505]">
              <ArrowRight size={17} />
            </span>
            {cta}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function ImmersiveProductStories() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#030405] px-5 py-20 text-white sm:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,160,227,0.12),transparent_28%),radial-gradient(circle_at_80%_86%,rgba(255,255,255,0.07),transparent_30%)]" />
      <div className="relative mx-auto max-w-[92rem]">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 100, damping: 22 }}
          >
            <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
              Cinematic product stories
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.52)] sm:text-6xl sm:leading-[0.98]">
              Designed to feel premium before the first tap.
            </h2>
          </motion.div>
          <motion.p
            className="max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8 lg:pt-12"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 100, damping: 22, delay: 0.08 }}
          >
            Product motion, tactile close-ups, and lifestyle moments work together as a brand film instead
            of a standard ecommerce block.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 96, damping: 22 }}
          >
            <StoryVideo
              src={storyVideos.powerbankCta}
              label="Powerbank"
              title="Pocket power with a flagship feel."
              description="A compact energy reserve presented with the kind of focus usually reserved for hero devices."
              className="min-h-[42rem] lg:min-h-[50rem]"
              mediaClassName="object-center"
              cta="Shop power"
              productSlug="zedx-power-bank-10000-zx-pb115"
            />
          </motion.div>

          <div className="grid gap-5">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 96, damping: 22, delay: 0.08 }}
            >
              <StoryVideo
                src={storyVideos.earpodsLandscape}
                label="Earpods"
                title="Audio that looks as refined as it sounds."
                className="min-h-[24rem]"
                mediaClassName="object-center"
                productSlug="zedx-zee-pods-pro"
              />
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 96, damping: 22, delay: 0.14 }}
            >
              <StoryVideo
                src={storyVideos.headphoneV1}
                label="Headphones"
                title="A quieter kind of premium presence."
                description="A soft cinematic pass for audio products that should feel wearable, not just listed."
                className="min-h-[24rem]"
                mediaClassName="object-center"
                productSlug="zedx-headphone-zx-hf-110"
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-5 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]"
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 96, damping: 22 }}
        >
          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/24 sm:rounded-[1.8rem] sm:p-10">
            <div className="grid size-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-2xl font-semibold text-white">
              Z
            </div>
            <p className="mt-10 text-2xl font-semibold leading-tight text-white sm:text-4xl">
              Small accessories deserve flagship presentation.
            </p>
            <p className="mt-5 text-base leading-7 text-white/60">
              Charging cables, car adapters, and audio pieces get the same dark, focused treatment as the hero product.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex h-12 items-center justify-center gap-3 rounded-full border border-white/18 bg-white px-5 text-xs font-semibold text-[#050505] transition hover:bg-[var(--brand-blue)]"
            >
              <Play size={14} className="fill-current" />
              View collection
            </Link>
          </div>

          <StoryVideo
            src={storyVideos.retractableCable}
            label="Retractable cable"
            title="The everyday cable, rebuilt as a detail moment."
            description="A utility product becomes desirable when motion, contrast, and texture do the selling."
            className="min-h-[30rem]"
            mediaClassName="object-center"
            cta="Shop essentials"
            productSlug="zedx-retractable-cable-100w-ze-03-type-c"
          />
        </motion.div>

        <motion.div
          className="mt-5 grid gap-5 lg:grid-cols-2"
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 96, damping: 22 }}
        >
          <StoryVideo
            src={storyVideos.carCharger}
            label="Car charger"
            title="High output for the dashboard."
            description="A sharper view of the accessories that keep the daily drive powered."
            className="min-h-[26rem]"
            mediaClassName="object-center"
            productSlug="zedx-38w-car-charger-cr100"
          />
          <StoryVideo
            src={storyVideos.headphoneV2}
            label="Audio detail"
            title="Finish, silhouette, and quiet confidence."
            description="A second audio reel adds depth and makes the collection feel wider without clutter."
            className="min-h-[26rem]"
            mediaClassName="object-center"
            productSlug="zedx-headphone-lumen-100"
          />
        </motion.div>

        <motion.div
          className="pointer-events-none mt-6 hidden items-center justify-center gap-3 text-white/36 sm:flex"
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 96, damping: 22, delay: 0.08 }}
        >
          <span className="h-px w-16 bg-white/14" />
          <span className="text-xs font-semibold">
            Motion-led product discovery
          </span>
          <span className="h-px w-16 bg-white/14" />
        </motion.div>
      </div>
    </section>
  );
}
