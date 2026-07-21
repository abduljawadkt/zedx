"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, Search, ShoppingBag, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { getTransparentProductImageSrc } from "@/components/product/ProductImage";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { formatProductName, productGroups } from "@/lib/productDisplay";

const navGroups = [
  {
    id: "audio",
    label: "Audio",
    href: "/collections/audio",
    ...productGroups.audio,
  },
  {
    id: "power",
    label: "Power",
    href: "/collections/power",
    ...productGroups.power,
  },
  {
    id: "accessories",
    label: "Accessories",
    href: "/collections/accessories",
    ...productGroups.accessories,
  },
];

export function Header() {
  const { cartItems, openCart, openMenu, openSearch } = useCommerce();
  const pathname = usePathname();
  const [activeMega, setActiveMega] = useState<(typeof navGroups)[number] | null>(null);
  const activeProducts = products
    .filter((product) => activeMega?.collections.includes(product.collection))
    .slice(0, 3);
  const activeCategories = categories.filter((category) =>
    activeMega?.categorySlugs.includes(category.slug),
  );

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 22 }}
      className="fixed left-0 right-0 top-2 z-50 px-3 sm:top-3 sm:px-6 lg:px-8"
      onMouseLeave={() => setActiveMega(null)}
    >
      <div className="mx-auto flex h-13 w-full max-w-[76rem] items-center justify-between rounded-full border border-white/12 bg-[#08090b]/82 px-3 shadow-2xl shadow-black/45 backdrop-blur-2xl sm:h-16 sm:px-6 lg:px-7">
        <Link
          href="/"
          aria-label="Zedx home"
          className="group relative flex h-10 w-28 shrink-0 items-center sm:h-11 sm:w-44"
        >
          <span className="relative h-10 w-10 overflow-hidden sm:h-11 sm:w-11">
            <img
              src="/cropped-zedx-logo-1.webp"
              alt="Zedx"
              className="absolute left-0 top-1/2 h-10 w-40 max-w-none -translate-y-1/2 object-contain object-left transition duration-300 group-hover:scale-[1.03] sm:h-11"
            />
          </span>
          <span className="ml-2 text-2xl font-semibold text-white sm:ml-3 sm:text-3xl">
            zedx
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-sm font-medium text-white/68 md:flex lg:text-base"
        >
          {navGroups.map((link) => {
            const active =
              pathname.startsWith(link.href) ||
              link.categorySlugs.some((slug) => pathname.startsWith(`/categories/${slug}`));

            return (
              <Link
                key={link.href}
                className={`group relative py-2 transition hover:text-white ${
                  active ? "text-[var(--brand-blue-soft)]" : ""
                }`}
                href={link.href}
                onFocus={() => setActiveMega(link)}
                onMouseEnter={() => setActiveMega(link)}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-1/2 h-1 -translate-x-1/2 rounded-full bg-[var(--brand-blue)] transition-all duration-300 group-hover:w-8 ${
                    active ? "w-8" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            aria-label="Open cart"
            className="relative grid size-9 place-items-center text-[var(--brand-blue)] transition hover:scale-110 hover:text-[var(--brand-blue-soft)] active:scale-95"
            onClick={openCart}
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {cartItems.length > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[var(--brand-blue)] text-[0.65rem] font-bold text-white">
                {cartItems.length}
              </span>
            )}
          </button>
          <Link
            href="/account"
            aria-label="Open customer account"
            className="hidden size-9 place-items-center text-[var(--brand-blue)] transition hover:scale-110 hover:text-[var(--brand-blue-soft)] active:scale-95 sm:grid"
          >
            <User size={20} strokeWidth={1.8} />
          </Link>
          <button
            type="button"
            aria-label="Open search"
            className="grid size-9 place-items-center text-[var(--brand-blue)] transition hover:scale-110 hover:text-[var(--brand-blue-soft)] active:scale-95"
            onClick={openSearch}
          >
            <Search size={20} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            aria-label="Open mobile menu"
            className="grid size-9 place-items-center text-[var(--brand-blue)] transition active:scale-95 md:hidden"
            onClick={openMenu}
          >
            <Menu size={22} strokeWidth={1.8} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {activeMega && (
          <motion.div
            className="mx-auto mt-3 hidden w-full max-w-[88rem] overflow-hidden rounded-[1.5rem] border border-[#ffffff1a] bg-[#090a0d]/94 p-4 shadow-2xl shadow-[#0000007a] backdrop-blur-2xl md:block"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <div className="grid gap-4 lg:grid-cols-[0.8fr_1fr_1.1fr]">
              <div className="rounded-[1.25rem] border border-[#ffffff1a] bg-[#ffffff0a] p-6">
                <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
                  {activeMega.label} universe
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">
                  Shop the full {activeMega.label.toLowerCase()} range.
                </h2>
                <p className="mt-4 text-sm leading-6 text-white/62">
                  {activeMega.description}
                </p>
                <Link
                  href={activeMega.href}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#050505]"
                  onClick={() => setActiveMega(null)}
                >
                  Explore {activeMega.label}
                  <ChevronRight size={16} />
                </Link>
              </div>

              <div className="grid gap-3">
                {activeCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="group rounded-[1.15rem] border border-[#ffffff1a] bg-[#ffffff09] p-4 transition hover:-translate-y-0.5 hover:border-[#00a0e3]/50 hover:bg-white/[0.065]"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{category.name}</p>
                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#ffffff7a]">
                          {category.description}
                        </p>
                      </div>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ffffff0f] text-[var(--brand-blue)] transition group-hover:bg-[var(--brand-blue)] group-hover:text-white">
                        <ChevronRight size={17} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {activeProducts.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/products/${product.slug}`}
                    className="group overflow-hidden rounded-[1.15rem] border border-[#ffffff1a] bg-[#11151b] text-white transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#00a0e3]/10"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="relative grid min-h-40 place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_18%,#eef3f7,#9facb8_52%,#202832)]">
                      <Image
                        src={getTransparentProductImageSrc(product.image)}
                        alt={`${formatProductName(product.name)} menu product image`}
                        width={220}
                        height={220}
                        className="h-36 w-auto object-contain transition duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[0.65rem] font-semibold text-white/45">
                        {product.category}
                      </p>
                      <p className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5">
                        {formatProductName(product.name)}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[var(--brand-blue-soft)]">
                        {product.currency} {product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
