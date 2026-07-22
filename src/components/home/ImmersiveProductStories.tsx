"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
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
  variant?: "feature" | "compact" | "wide";
};

const storyVariantClassNames = {
  feature: {
    content: "p-6 sm:p-9 lg:p-11 xl:p-12",
    description: "max-w-lg text-base leading-7 text-white/74 sm:text-lg sm:leading-8",
    product: "sm:max-w-[26rem]",
    title:
      "max-w-[13ch] text-[2.25rem] font-medium leading-[1.02] text-white drop-shadow-[0_4px_22px_rgba(0,0,0,0.7)] sm:text-5xl sm:leading-tight lg:text-[3.45rem] xl:text-[3.8rem]",
  },
  compact: {
    content: "p-6 sm:p-8 lg:p-8 xl:p-9",
    description: "max-w-md text-sm leading-6 text-white/72 sm:text-base sm:leading-7",
    product: "sm:max-w-[22rem]",
    title:
      "max-w-[14ch] text-[2rem] font-medium leading-[1.04] text-white drop-shadow-[0_4px_22px_rgba(0,0,0,0.7)] sm:text-[2.55rem] lg:text-[2.65rem] xl:text-[3rem]",
  },
  wide: {
    content: "p-6 sm:p-9 lg:p-10 xl:p-11",
    description: "max-w-xl text-base leading-7 text-white/74 sm:text-lg sm:leading-8",
    product: "sm:max-w-[25rem]",
    title:
      "max-w-[16ch] text-[2.15rem] font-medium leading-[1.03] text-white drop-shadow-[0_4px_22px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-[3.1rem] xl:text-[3.45rem]",
  },
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
  variant = "compact",
}: StoryVideoProps) {
  const product = productSlug ? products.find((item) => item.slug === productSlug) : undefined;
  const variantClassNames = storyVariantClassNames[variant];
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(videoRef, { margin: "420px 0px" });
  const shouldLoadVideo = isInView;
  const shouldPlayVideo = isInView && !reduceMotion;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlayVideo) {
      void video.play().catch(() => undefined);
      return;
    }

    video.pause();
  }, [shouldPlayVideo]);

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#0b0c0f] shadow-2xl shadow-black/30 sm:block sm:rounded-[1.8rem] ${className}`}
    >
      <video
        ref={videoRef}
        className={`relative h-72 w-full shrink-0 object-cover opacity-90 transition duration-700 group-hover:scale-[1.02] sm:absolute sm:inset-0 sm:h-full sm:group-hover:scale-[1.035] ${mediaClassName}`}
        autoPlay={shouldPlayVideo}
        muted
        loop={!reduceMotion}
        playsInline
        preload={shouldLoadVideo ? "metadata" : "none"}
        aria-hidden="true"
        disablePictureInPicture
      >
        {shouldLoadVideo ? <source src={src} type="video/mp4" /> : null}
        Your browser does not support the video tag.
      </video>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 sm:hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 18%, rgba(0,160,227,0.18), transparent 42%), linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.34))",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden sm:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.68) 42%, rgba(0,0,0,0.2) 78%), linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.12) 42%, rgba(0,0,0,0.84))",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden sm:block"
        style={{
          background:
            "linear-gradient(115deg, rgba(0,160,227,0.16), transparent 36%), linear-gradient(250deg, rgba(255,255,255,0.07), transparent 44%)",
        }}
      />
      <div
        className={`relative z-10 bg-[#050505] sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-transparent ${variantClassNames.content}`}
      >
        <p className="w-fit rounded-full border border-white/16 bg-white/12 px-4 py-2 text-[0.68rem] font-semibold text-white/84 backdrop-blur-md">
          {label}
        </p>
        <h3 className={`mt-5 ${variantClassNames.title}`}>
          {title}
        </h3>
        {description ? (
          <p className={`mt-4 drop-shadow-[0_3px_14px_rgba(0,0,0,0.68)] ${variantClassNames.description}`}>
            {description}
          </p>
        ) : null}
        {product ? (
          <Link
            href={`/products/${product.slug}`}
            className={`mt-6 flex w-full items-center gap-3 rounded-[1.1rem] border border-white/16 bg-black/58 p-2.5 text-left shadow-2xl shadow-black/35 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[var(--brand-blue)] hover:bg-black/66 sm:mt-5 sm:bg-black/44 ${variantClassNames.product}`}
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
              <span className="mt-1 line-clamp-2 block text-sm font-semibold leading-tight text-white">
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
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/18 bg-white text-[#050505]">
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
    <section className="relative overflow-hidden bg-[#030405] px-5 py-20 text-white sm:px-8 lg:py-32 xl:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,160,227,0.12),transparent_28%),radial-gradient(circle_at_80%_86%,rgba(255,255,255,0.07),transparent_30%)]" />
      <div className="relative mx-auto max-w-[96rem]">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_0.78fr] lg:items-start xl:gap-14">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 100, damping: 22 }}
          >
            <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
              ZEDX essentials
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-medium leading-tight text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.52)] sm:text-6xl sm:leading-[0.98] xl:text-7xl">
              Power, audio, and accessories for daily UAE routines.
            </h2>
          </motion.div>
          <motion.p
            className="max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8 lg:pt-12 xl:text-xl xl:leading-9"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 100, damping: 22, delay: 0.08 }}
          >
            Choose compact power banks, wireless earbuds, fast chargers, car chargers, and cables with clear pricing and product-focused detail.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-7 lg:grid-cols-[1.08fr_0.92fr] xl:gap-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 96, damping: 22 }}
          >
            <StoryVideo
              src={storyVideos.powerbankCta}
              label="Powerbank"
              title="Pocket power for work, travel, and long days."
              description="Carry backup power for phones, earbuds, and everyday devices without adding bulk to your bag."
              className="sm:min-h-[42rem] lg:min-h-[48rem] xl:min-h-[52rem]"
              mediaClassName="object-center"
              cta="Shop power"
              productSlug="zedx-power-bank-10000-zx-pb115"
              variant="feature"
            />
          </motion.div>

          <div className="grid gap-7 xl:gap-8">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 96, damping: 22, delay: 0.08 }}
            >
              <StoryVideo
                src={storyVideos.earpodsLandscape}
                label="Wireless earbuds"
                title="Clear calls and music in a compact case."
                className="sm:min-h-[26rem] lg:min-h-[23.5rem] xl:min-h-[25rem]"
                mediaClassName="object-center"
                productSlug="zedx-zee-pods-pro"
                variant="compact"
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
                title="Over-ear comfort for focused listening."
                description="Choose headphones for longer sessions, stronger isolation, and a more immersive sound profile."
                className="sm:min-h-[26rem] lg:min-h-[23.5rem] xl:min-h-[25rem]"
                mediaClassName="object-center"
                productSlug="zedx-headphone-zx-hf-110"
                variant="compact"
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-7 grid gap-7 lg:grid-cols-[0.58fr_1.42fr] xl:gap-8"
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 96, damping: 22 }}
        >
          <div className="grid min-h-[26rem] content-between rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/24 sm:rounded-[1.8rem] sm:p-10 lg:min-h-[31rem]">
            <div className="grid size-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-2xl font-semibold text-white">
              Z
            </div>
            <p className="mt-10 text-2xl font-medium leading-tight text-white sm:text-4xl">
              Accessories that complete your phone, car, and desk setup.
            </p>
            <p className="mt-5 text-base leading-7 text-white/60">
              Shop durable charging cables, car adapters, mounts, and audio essentials built for everyday use.
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
            title="Fast charging without cable clutter."
            description="Retractable Type-C cables help keep desks, cars, and travel bags cleaner."
            className="sm:min-h-[30rem] lg:min-h-[31rem]"
            mediaClassName="object-center"
            cta="Shop essentials"
            productSlug="zedx-retractable-cable-100w-ze-03-type-c"
            variant="wide"
          />
        </motion.div>

        <motion.div
          className="mt-7 grid gap-7 lg:grid-cols-2 xl:gap-8"
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 96, damping: 22 }}
        >
          <StoryVideo
            src={storyVideos.carCharger}
            label="Car charger"
            title="High output for the dashboard."
            description="Keep phones topped up during commutes, rideshare work, and road trips across the UAE."
            className="sm:min-h-[28rem] lg:min-h-[31rem]"
            mediaClassName="object-center"
            productSlug="zedx-38w-car-charger-cr100"
            variant="wide"
          />
          <StoryVideo
            src={storyVideos.headphoneV2}
            label="Wireless headphones"
            title="Battery-ready sound for work and travel."
            description="Compare headphones and earbuds by comfort, portability, and everyday listening style."
            className="sm:min-h-[28rem] lg:min-h-[31rem]"
            mediaClassName="object-center"
            productSlug="zedx-headphone-lumen-100"
            variant="wide"
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
            Shop ZEDX audio, power, and accessories
          </span>
          <span className="h-px w-16 bg-white/14" />
        </motion.div>
      </div>
    </section>
  );
}
