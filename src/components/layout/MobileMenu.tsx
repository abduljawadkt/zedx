"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Search, ShoppingBag, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import {
  getTransparentProductImageSrc,
  productImageGroundShadowClassName,
  productImageStageClassName,
} from "@/components/product/ProductImage";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { formatCategoryName, formatProductName } from "@/lib/productDisplay";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const primaryLinks = [
  { href: "/collections/audio", label: "Audio" },
  { href: "/collections/power", label: "Power" },
  { href: "/collections/accessories", label: "Accessories" },
  { href: "/products", label: "Explore" },
];

const secondaryLinks = [
  { href: "/login", label: "Sign in" },
  { href: "/signup", label: "Create account" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileMenu() {
  const { closeMenu, isMenuOpen, openCart, openSearch } = useCommerce();

  function openSearchFromMenu() {
    closeMenu();
    window.setTimeout(openSearch, 120);
  }

  function openCartFromMenu() {
    closeMenu();
    window.setTimeout(openCart, 120);
  }

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-[80] bg-black/45 p-3 backdrop-blur-2xl sm:p-4 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.nav
            aria-label="Mobile navigation"
            className="flex h-full flex-col overflow-auto rounded-[1.35rem] border border-[var(--shell-border)] bg-[var(--shell-panel-solid)] p-4 shadow-2xl shadow-[var(--shell-shadow)] sm:rounded-[1.75rem] sm:p-6"
            initial={{ y: 26, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 26, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="relative flex h-10 w-36 items-center"
                onClick={closeMenu}
                aria-label="ZEDX home"
              >
                <Image
                  src="/brand/zedx-logo-white.png"
                  alt="ZEDX"
                  width={220}
                  height={68}
                  sizes="10rem"
                  className="h-9 w-auto object-contain object-left"
                />
              </Link>
              <button
                type="button"
                aria-label="Close mobile menu"
                className="grid size-11 place-items-center rounded-full border border-[var(--shell-border)] text-[var(--brand-blue)]"
                onClick={closeMenu}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-8">
              <ThemeToggle />
            </div>

            <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5">
              {primaryLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 160,
                    damping: 22,
                    delay: index * 0.05,
                  }}
                >
                  <Link
                    href={link.href}
                    className="text-3xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-7 grid gap-3 rounded-[1.5rem] border border-[var(--shell-border)] bg-[var(--shell-soft)] p-3 sm:mt-9 sm:rounded-[1.75rem]">
              {products.slice(0, 3).map((product) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="grid grid-cols-[4rem_1fr_auto] items-center gap-3 rounded-[1.2rem] bg-[var(--shell-panel)] p-2"
                  onClick={closeMenu}
                >
                  <span className={`${productImageStageClassName} aspect-square rounded-2xl`}>
                    <span className={productImageGroundShadowClassName} />
                    <Image
                      src={getTransparentProductImageSrc(product.image)}
                      alt={`${formatProductName(product.name)} menu product image`}
                      width={120}
                      height={120}
                      className="relative z-10 h-16 w-auto object-contain brightness-[1.03] contrast-[1.04] drop-shadow-[0_12px_20px_rgba(15,23,42,0.2)]"
                    />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold text-[var(--brand-blue-soft)]">
                      {formatCategoryName(product.category)}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm font-semibold leading-5 text-[var(--foreground)]">
                      {formatProductName(product.name)}
                    </span>
                  </span>
                  <ChevronRight size={18} className="text-[var(--muted)]" />
                </Link>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-[#00a0e3]/25 text-sm font-semibold text-[var(--brand-blue)] transition active:scale-95"
                onClick={openCartFromMenu}
              >
                <ShoppingBag size={17} />
                Cart
              </button>
              <Link
                href="/account"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-[#00a0e3]/25 text-sm font-semibold text-[var(--brand-blue)] transition active:scale-95"
                onClick={closeMenu}
              >
                <User size={17} />
                Account
              </Link>
              <button
                type="button"
                className="col-span-2 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[var(--brand-blue)] text-sm font-semibold text-white transition active:scale-95"
                onClick={openSearchFromMenu}
              >
                <Search size={17} />
                Search
              </button>
            </div>

            <div className="mt-10">
              <p className="text-xs font-semibold text-[var(--muted)]">
                Full menu
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-[var(--shell-border)] px-4 py-3 text-center text-sm font-semibold text-[var(--muted)]"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <p className="text-xs font-semibold text-[var(--muted)]">
                Categories
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="rounded-full border border-[var(--shell-border)] px-4 py-2 text-xs font-semibold text-[var(--muted)]"
                    onClick={closeMenu}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
