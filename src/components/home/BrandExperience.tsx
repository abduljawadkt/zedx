"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  ProductImage,
  productImageGroundShadowClassName,
  productImageStageClassName,
  productImageStageGlowClassName,
} from "@/components/product/ProductImage";
import { products } from "@/data/products";

type ExperiencePanel = {
  copy: string;
  eyebrow: string;
  href: string;
  productId: string;
  title: string;
      tone: "blue" | "dark" | "graphite";
  visualSrc?: string;
};

const panels: ExperiencePanel[] = [
  {
    eyebrow: "Portable power",
    title: "Power for every moment.",
    copy: "Powerbanks, wall chargers, and cables made for travel, work, and always-on days.",
    productId: "zedx-power-bank-10000-zx-pb115",
    href: "/categories/power-banks",
    tone: "graphite",
  },
  {
    eyebrow: "Premium audio",
    title: "Audio that feels composed.",
    copy: "Earbuds, speakers, and headphones tuned for immersive listening and clear everyday calls.",
    productId: "zedx-headphone-lumen-100",
    visualSrc: "/hero-animation/headphones.png",
    href: "/categories/over-heads",
    tone: "dark",
  },
  {
    eyebrow: "Smart wearables",
    title: "A sharper everyday setup.",
    copy: "Smart displays, watches, and accessories that keep your day visible, connected, and refined.",
    productId: "zedx-zen5-round-watch",
    href: "/categories/smart-watches",
    tone: "blue",
  },
];

export function BrandExperience() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-[#08080a] px-5 pb-28 pt-4 text-white sm:px-8">
      <div className="mx-auto max-w-[92rem]">
        <div className="mb-10">
          <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
            Featured worlds
          </p>
          <h2 className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.9] sm:text-7xl">
            Designed around the way you move.
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {panels.map((panel, index) => {
            const product =
              products.find((item) => item.id === panel.productId) ?? products[index];
            const isWide = index === 0;

            return (
              <motion.article
                key={panel.title}
                className={`group relative min-h-[33rem] overflow-hidden rounded-[2rem] border border-white/10 p-7 shadow-sm shadow-black/30 sm:p-10 ${
                  isWide ? "lg:col-span-2" : ""
                } ${
                  panel.tone === "dark"
                    ? "bg-[#050505] text-white"
                    : panel.tone === "blue"
                      ? "bg-[radial-gradient(circle_at_70%_20%,rgba(0,160,227,0.28),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.035))] text-white"
                      : "bg-[linear-gradient(145deg,rgba(255,255,255,0.095),rgba(255,255,255,0.03))] text-white"
                }`}
                initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ type: "spring", stiffness: 100, damping: 22, delay: index * 0.06 }}
              >
                <div
                  className={`absolute inset-0 ${
                    panel.tone === "dark"
                      ? "bg-[radial-gradient(circle_at_70%_40%,rgba(56,189,248,0.3),transparent_38%)]"
                      : "bg-[radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.16),transparent_38%)]"
                  }`}
                />
                <div
                  className={`relative z-10 grid h-full gap-8 ${
                    isWide ? "lg:grid-cols-[0.9fr_1.1fr] lg:items-center" : ""
                  }`}
                >
                  <div className="flex max-w-xl flex-col justify-end">
                    <p
                      className={`text-xs font-semibold ${
                        "text-[var(--brand-blue-soft)]"
                      }`}
                    >
                      {panel.eyebrow}
                    </p>
                    <h3
                      className={`mt-4 text-5xl font-semibold leading-[0.9] sm:text-7xl ${
                        "text-white"
                      }`}
                    >
                      {panel.title}
                    </h3>
                    <p
                      className={`mt-5 max-w-lg text-lg leading-8 ${
                        "text-white/62"
                      }`}
                    >
                      {panel.copy}
                    </p>
                    <Link
                      href={panel.href}
                      className={`mt-8 inline-flex h-14 w-fit items-center justify-center gap-3 rounded-full px-6 text-sm font-semibold transition active:scale-95 ${
                        panel.tone === "dark"
                          ? "bg-white text-[#050505] hover:bg-[var(--brand-blue-soft)]"
                          : "bg-[#00a0e3] text-white hover:bg-white hover:text-[#050505]"
                      }`}
                    >
                      Explore
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                  <motion.div
                    className="relative z-10 grid min-h-72 place-items-center"
                    whileHover={reduceMotion ? undefined : { scale: 1.03, rotate: 1.5 }}
                    transition={{ type: "spring", stiffness: 130, damping: 18 }}
                  >
                    {panel.visualSrc ? (
                      <div
                        className={
                          isWide
                            ? "relative aspect-square w-[min(82%,520px)]"
                            : "relative aspect-square w-[min(82%,360px)]"
                        }
                      >
                        <Image
                          src={panel.visualSrc}
                          alt={`${product.name} transparent featured product`}
                          fill
                          sizes={isWide ? "(min-width: 1024px) 520px, 86vw" : "420px"}
                          className="object-contain drop-shadow-[0_45px_90px_rgba(56,189,248,0.26)]"
                        />
                      </div>
                    ) : (
                      <div
                        className={`${productImageStageClassName} ${
                          isWide ? "min-h-[28rem] w-full" : "min-h-[22rem] w-full"
                        } rounded-[2rem]`}
                      >
                        <div className={productImageStageGlowClassName} />
                        <div className={productImageGroundShadowClassName} />
                        <ProductImage
                          product={product}
                          className={
                            isWide
                              ? "!w-[min(82%,520px)] !drop-shadow-[0_34px_60px_rgba(15,23,42,0.28)]"
                              : "!w-[min(82%,360px)] !drop-shadow-[0_28px_48px_rgba(15,23,42,0.25)]"
                          }
                          imageClassName="brightness-[1.03] contrast-[1.04]"
                          sizes={isWide ? "(min-width: 1024px) 520px, 86vw" : "420px"}
                          alt={`${product.name} featured experience product`}
                        />
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
