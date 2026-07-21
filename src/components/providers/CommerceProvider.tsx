"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/data/products";

type CommerceContextValue = {
  cartItems: Product[];
  isCartOpen: boolean;
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: Product | null;
  addToCart: (product: Product, options?: { openCart?: boolean }) => void;
  closeCart: () => void;
  closeMenu: () => void;
  closeQuickView: () => void;
  closeSearch: () => void;
  openCart: () => void;
  openMenu: () => void;
  openQuickView: (product: Product) => void;
  openSearch: () => void;
  removeFromCart: (id: string) => void;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const value = useMemo<CommerceContextValue>(
    () => ({
      cartItems,
      isCartOpen,
      isMenuOpen,
      isSearchOpen,
      quickViewProduct,
      addToCart: (product, options = {}) => {
        setCartItems((items) => [...items, product]);
        if (options.openCart !== false) {
          setIsCartOpen(true);
        }
      },
      closeCart: () => setIsCartOpen(false),
      closeMenu: () => setIsMenuOpen(false),
      closeQuickView: () => setQuickViewProduct(null),
      closeSearch: () => setIsSearchOpen(false),
      openCart: () => setIsCartOpen(true),
      openMenu: () => setIsMenuOpen(true),
      openQuickView: (product) => setQuickViewProduct(product),
      openSearch: () => setIsSearchOpen(true),
      removeFromCart: (id) =>
        setCartItems((items) => {
          const index = items.findIndex((item) => item.id === id);
          if (index === -1) return items;
          return [...items.slice(0, index), ...items.slice(index + 1)];
        }),
    }),
    [cartItems, isCartOpen, isMenuOpen, isSearchOpen, quickViewProduct],
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const context = useContext(CommerceContext);

  if (!context) {
    throw new Error("useCommerce must be used inside CommerceProvider");
  }

  return context;
}
