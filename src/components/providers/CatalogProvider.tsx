"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import type { Category } from "@/data/categories";
import type { Product } from "@/data/products";
import type { Collection } from "@/lib/backend/types";

type CatalogContextValue = {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  productBySlug: Map<string, Product>;
  productById: Map<string, Product>;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({
  products,
  categories,
  collections = [],
  children,
}: {
  products: Product[];
  categories: Category[];
  collections?: Collection[];
  children: ReactNode;
}) {
  const value = useMemo<CatalogContextValue>(() => {
    return {
      products,
      categories,
      collections,
      productBySlug: new Map(products.map((product) => [product.slug, product])),
      productById: new Map(products.map((product) => [product.id, product])),
    };
  }, [products, categories, collections]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error("useCatalog must be used inside CatalogProvider");
  }

  return context;
}
