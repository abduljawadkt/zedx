"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { formatProductName } from "@/lib/productDisplay";

export function CartDrawer() {
  const { addToCart, cartItems, closeCart, isCartOpen, removeFromCart } = useCommerce();
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const groupedItems = cartItems.reduce(
    (items, product) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        items.push({ product, quantity: 1 });
      }
      return items;
    },
    [] as Array<{ product: (typeof cartItems)[number]; quantity: number }>,
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="fixed inset-0 z-[75] bg-[#00000099] backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 cursor-default"
            onClick={closeCart}
          />
          <motion.aside
            aria-label="Cart"
            className="glass-panel absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col border-l border-[#ffffff1a] bg-[#050505]/82 p-6 shadow-2xl shadow-cyan-500/10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-white">
                Cart
              </h2>
              <button
                type="button"
                aria-label="Close cart drawer"
                className="grid size-11 place-items-center rounded-full border border-[#ffffff1a] text-white"
                onClick={closeCart}
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-8 flex-1 space-y-4 overflow-auto">
              {groupedItems.length === 0 ? (
                <div className="glass-panel grid min-h-56 place-items-center p-6 text-center">
                  <div>
                    <p className="text-xs font-semibold text-[#ffffff59]">
                      Empty cart
                    </p>
                    <p className="mt-3 text-white/62">Add products to build your setup.</p>
                  </div>
                </div>
              ) : (
                groupedItems.map(({ product, quantity }) => (
                  <motion.div
                    key={product.id}
                    layout
                    className="grid grid-cols-[4.5rem_1fr] gap-4 border border-[#ffffff1a] bg-[#ffffff09] p-3"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    transition={{ type: "spring", stiffness: 180, damping: 24 }}
                  >
                    <div className="product-stage !min-h-16">
                      <ProductImage
                        product={product}
                        alt={`${formatProductName(product.name)} cart image`}
                        className="!w-12"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-white">{formatProductName(product.name)}</p>
                        <button
                          type="button"
                          className="text-xs text-[#ffffff66] hover:text-white"
                          onClick={() => removeFromCart(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-[#ffffff73]">
                        {product.currency} {product.price}
                      </p>
                      <div className="mt-4 inline-flex items-center overflow-hidden rounded-full border border-[#ffffff1a]">
                        <button
                          type="button"
                          aria-label={`Decrease ${formatProductName(product.name)} quantity`}
                          className="grid size-9 place-items-center text-[#ffffffa6] transition hover:bg-[#ffffff1a] hover:text-white"
                          onClick={() => removeFromCart(product.id)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="grid h-9 min-w-10 place-items-center border-x border-[#ffffff1a] text-sm font-semibold text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase ${formatProductName(product.name)} quantity`}
                          className="grid size-9 place-items-center text-[#ffffffa6] transition hover:bg-[#ffffff1a] hover:text-white"
                          onClick={() => addToCart(product)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="border-t border-[#ffffff1a] pt-5">
              <div className="flex items-center justify-between text-white">
                <span className="text-sm text-[#ffffff73]">
                  Subtotal
                </span>
                <span className="text-2xl font-semibold">AED {total}</span>
              </div>
              <Link
                href="/checkout"
                className="mt-5 flex h-14 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#050505] transition hover:scale-[1.02] hover:bg-[var(--brand-blue-soft)] active:scale-95"
                onClick={closeCart}
              >
                Checkout
              </Link>
              <p className="mt-4 text-center text-xs leading-5 text-[#ffffff66]">
                No payment or order is created.
              </p>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
