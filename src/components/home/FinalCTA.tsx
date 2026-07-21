"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export function FinalCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#050505] py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.24),#050505)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative flex min-h-[560px] flex-col justify-between overflow-hidden rounded-[2rem] border border-[#ffffff1a] bg-[#ffffff08] p-8 backdrop-blur-3xl sm:p-12">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-88"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="ZEDX premium everyday tech motion film"
          >
            <source src="/story-videos/zedx-powerbank-cta.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.88)_0%,rgba(5,5,5,0.68)_38%,rgba(5,5,5,0.24)_72%,rgba(5,5,5,0.5)_100%),linear-gradient(180deg,rgba(5,5,5,0.18)_0%,rgba(0,160,227,0.12)_42%,rgba(5,5,5,0.86)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,160,227,0.18),transparent_36%),linear-gradient(250deg,rgba(255,255,255,0.08),transparent_42%)]" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-blue-soft)]/70 to-transparent" />

          <motion.h2
            className="relative z-10 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-normal text-[#ffffff] drop-shadow-[0_8px_34px_rgba(0,0,0,0.72)] sm:text-7xl"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 90, damping: 22 }}
          >
            Build a setup that feels finished.
          </motion.h2>
          <motion.p
            className="relative z-10 mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 90, damping: 22, delay: 0.06 }}
          >
            Start with power, add audio, complete the details. Every ZEDX product now has room to feel like part of one premium system.
          </motion.p>
          <motion.div
            className="relative z-10 mt-10 flex flex-col gap-4 sm:flex-row"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 90, damping: 22, delay: 0.12 }}
          >
            <Link
              href="/products"
              className="inline-flex h-14 w-fit items-center justify-center rounded-full bg-[#00a0e3] px-7 text-sm font-semibold text-[#ffffff] shadow-[0_0_24px_rgba(0,160,227,0.4)] transition hover:scale-105 hover:bg-[#ffffff] hover:text-[#050505]"
            >
              Explore products
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 w-fit items-center justify-center rounded-full border border-[#ffffff1a] bg-[#ffffff05] px-7 text-sm font-semibold text-[#ffffff] backdrop-blur-md transition hover:scale-105 hover:border-[#00a0e3]/60"
            >
              Contact ZEDX
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
