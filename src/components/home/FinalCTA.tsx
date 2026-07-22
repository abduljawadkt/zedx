"use client";

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

export function FinalCTA() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, { margin: "420px 0px" });
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
    <section className="relative overflow-hidden bg-[#050505] py-16 sm:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.24),#050505)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[1.6rem] border border-[#ffffff1a] bg-[#080a0d] shadow-2xl shadow-black/35 backdrop-blur-3xl sm:flex sm:min-h-[560px] sm:flex-col sm:justify-between sm:rounded-[2rem] sm:bg-[#ffffff08] sm:p-12">
          <video
            ref={videoRef}
            className="relative h-72 w-full object-cover object-center opacity-88 sm:absolute sm:inset-0 sm:h-full"
            autoPlay={shouldPlayVideo}
            muted
            loop={!reduceMotion}
            playsInline
            preload={isInView ? "metadata" : "none"}
            aria-hidden="true"
            disablePictureInPicture
          >
            {isInView ? <source src="/story-videos/zedx-powerbank-cta.mp4" type="video/mp4" /> : null}
            Your browser does not support the video tag.
          </video>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-72 sm:hidden"
            style={{
              background:
                "radial-gradient(circle at 54% 34%, rgba(0,160,227,0.16), transparent 42%), linear-gradient(180deg, rgba(5,5,5,0.04), rgba(5,5,5,0.68))",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 hidden sm:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.68) 38%, rgba(5,5,5,0.24) 72%, rgba(5,5,5,0.5) 100%), linear-gradient(180deg, rgba(5,5,5,0.18) 0%, rgba(0,160,227,0.12) 42%, rgba(5,5,5,0.86) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 hidden sm:block"
            style={{
              background:
                "linear-gradient(115deg, rgba(0,160,227,0.18), transparent 36%), linear-gradient(250deg, rgba(255,255,255,0.08), transparent 42%)",
            }}
          />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-blue-soft)]/70 to-transparent" />

          <div className="relative z-10 bg-[#050505] p-6 sm:bg-transparent sm:p-0">
            <motion.h2
              className="max-w-4xl text-[2.55rem] font-semibold leading-[1.02] tracking-normal text-[#ffffff] drop-shadow-[0_8px_34px_rgba(0,0,0,0.72)] sm:text-7xl sm:leading-[0.92]"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 90, damping: 22 }}
            >
              Ready to upgrade your everyday tech?
            </motion.h2>
            <motion.p
              className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg"
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 90, damping: 22, delay: 0.06 }}
            >
              Shop ZEDX power banks, wireless audio, fast chargers, smart wearables, and mobile accessories for Dubai and the UAE.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 90, damping: 22, delay: 0.12 }}
            >
              <Link
                href="/products"
                className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#00a0e3] px-7 text-sm font-semibold text-[#ffffff] shadow-[0_0_24px_rgba(0,160,227,0.4)] transition hover:scale-105 hover:bg-[#ffffff] hover:text-[#050505] sm:w-fit"
              >
                Shop now
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-14 w-full items-center justify-center rounded-full border border-[#ffffff1a] bg-[#ffffff05] px-7 text-sm font-semibold text-[#ffffff] backdrop-blur-md transition hover:scale-105 hover:border-[#00a0e3]/60 sm:w-fit"
              >
                Contact ZEDX
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
