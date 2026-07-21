/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowRight, Mail, MapPin, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { categories } from "@/data/categories";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/categories/earpods", label: "Audio" },
      { href: "/categories/power-banks", label: "Power" },
      { href: "/categories/car-holders", label: "Mounts" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Zedx" },
      { href: "/contact", label: "Contact" },
      { href: "/products", label: "Catalog" },
      { href: "/categories/smart-watches", label: "Wearables" },
    ],
  },
];

const serviceNotes = [
  { icon: Truck, label: "Fast delivery" },
  { icon: ShieldCheck, label: "Warranty support" },
  { icon: Sparkles, label: "AI product advisor" },
];

const glassPanelClassName =
  "relative overflow-hidden rounded-[2rem] border border-white/14 bg-[#101114]/88 shadow-[0_28px_90px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl";

const glassVeilClassName =
  "absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018)_42%,rgba(0,0,0,0.2))]";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#ffffff1a] bg-[#050505] px-5 pt-20 text-[#ffffff] sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_54%_0%,rgba(0,160,227,0.18),transparent_30rem),radial-gradient(circle_at_12%_36%,rgba(255,255,255,0.07),transparent_22rem)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[56rem] -translate-x-1/2 rounded-full bg-[#00a0e3]/10 blur-3xl" />
      <div className="mx-auto max-w-[92rem]">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.45fr]">
          <div className={`${glassPanelClassName} p-7 sm:p-9`}>
            <div className={glassVeilClassName} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(0,160,227,0.22),transparent_36%),radial-gradient(circle_at_88%_88%,rgba(255,255,255,0.06),transparent_34%)]" />
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-blue-soft)]/60 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center">
                <span className="relative h-12 w-12 overflow-hidden">
                  <img
                    src="/cropped-zedx-logo-1.webp"
                    alt="Zedx"
                    className="absolute left-0 top-1/2 h-12 w-44 max-w-none -translate-y-1/2 object-contain object-left"
                  />
                </span>
                <span className="ml-3 text-4xl font-semibold text-white">
                  zedx
                </span>
              </div>
              <h2 className="mt-10 max-w-xl text-5xl font-semibold leading-[0.9] sm:text-6xl">
                Premium tech for everyday momentum.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#ffffff8c]">
                Explore audio, power, wearables, and everyday accessories with a focused ZEDX shopping experience.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#050505] transition hover:bg-[var(--brand-blue-soft)]"
                >
                  Explore catalog
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-[#ffffff1a] px-6 text-sm font-semibold text-[#ffffffbf] transition hover:border-[#00a0e3]/60 hover:text-[#ffffff]"
                >
                  Contact ZEDX
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className={`${glassPanelClassName} p-7`}>
              <div className={glassVeilClassName} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(0,160,227,0.16),transparent_34%)]" />
              <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-blue-soft)]/50 to-transparent" />
              <div className="relative z-10">
                <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
                  Categories
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {categories.slice(0, 10).map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      className="rounded-full border border-white/16 bg-black/18 px-4 py-3 text-sm font-semibold text-white/72 backdrop-blur-xl transition hover:border-[#00a0e3]/70 hover:bg-[#00a0e3]/12 hover:text-white"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className={`${glassPanelClassName} p-7`}>
                <div className={glassVeilClassName} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,160,227,0.12),transparent_32%)]" />
                <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
                <div className="relative z-10">
                  <p className="text-xs font-semibold text-white/50">
                    Store confidence
                  </p>
                  <div className="mt-5 grid gap-3">
                    {serviceNotes.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-3 rounded-2xl border border-white/14 bg-black/22 p-4 text-sm font-semibold text-white/76 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
                        >
                          <Icon size={18} className="text-[var(--brand-blue-soft)]" />
                          {item.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={`${glassPanelClassName} p-7`}>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,37,53,0.54),rgba(0,160,227,0.12)_45%,rgba(5,5,5,0.34))]" />
                <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-blue-soft)]/55 to-transparent" />
                <div className="relative z-10">
                  <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
                    Launch updates
                  </p>
                  <div className="mt-5 flex items-center gap-3 rounded-full border border-white/18 bg-black/40 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
                    <Mail size={18} className="ml-3 text-[#ffffff73]" />
                    <span className="min-w-0 flex-1 text-sm text-[#ffffff73]">hello@zedx.store</span>
                    <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#050505]">
                      Notify me
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${glassPanelClassName} mt-8 grid gap-6 p-7 md:grid-cols-[1fr_auto_auto] md:items-start`}>
          <div className={glassVeilClassName} />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="relative z-10">
            <p className="text-xs font-semibold text-white/50">
              ZEDX promise
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#ffffff80]">
              Focused product discovery, helpful recommendations, and a clean path from selection to checkout.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title} className="relative z-10 min-w-40">
              <p className="text-sm font-semibold text-[#ffffff]">{group.title}</p>
              <div className="mt-3 grid gap-2">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-[#ffffff73] transition hover:text-[#ffffff]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[#ffffff1a] py-7 text-sm text-[#ffffff66] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={15} />
            <span>Dubai-ready ZEDX shopping experience</span>
          </div>
          <p>
            Developed by{" "}
            <Link
              href="https://tofai.tech/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#ffffff] transition hover:text-[var(--brand-blue-soft)]"
            >
              Tofai Global Tech
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
