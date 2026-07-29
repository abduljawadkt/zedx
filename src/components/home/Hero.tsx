"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const heroVideoSrc = "/hero-video/zedx-powerbank-hero.mp4";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const videoScale = useTransform(scrollYProgress, [0, 0.34], [1.03, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.28], [0, 46]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.68]);

  return (
    <section className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[#050505] text-white">
      <motion.video
        className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
        src={heroVideoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        disablePictureInPicture
        style={reduceMotion ? undefined : { scale: videoScale }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.84)_0%,rgba(5,5,5,0.6)_34%,rgba(5,5,5,0.2)_68%,rgba(5,5,5,0.08)_100%),linear-gradient(180deg,rgba(5,5,5,0.62)_0%,rgba(5,5,5,0.06)_44%,rgba(5,5,5,0.86)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.86))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(0,160,227,0.16),transparent_34%),linear-gradient(250deg,rgba(255,255,255,0.08),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/15" />

      <motion.div
        className="relative z-10 flex min-h-[calc(100svh-4.5rem)] items-end px-5 pb-12 pt-24 sm:px-8 sm:pb-16 lg:px-14 lg:pb-20"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 24 }}
        style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
      >
        <div className="max-w-[44rem] drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]">
          <p className="type-eyebrow text-[#9fe7ff]">
            ZEDX power series
          </p>
          <h1 className="mt-4 max-w-[44rem] type-hero">
            Powering Your Digital Lifestyle
          </h1>
          <p className="mt-5 max-w-xl type-body text-white/78">
            Shop ZEDX chargers, power banks, wireless audio, smart wearables, car mounts, and mobile accessories for Dubai and the UAE.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
