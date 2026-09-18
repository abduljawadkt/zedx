"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CatalogProvider } from "@/components/providers/CatalogProvider";
import { CommerceProvider, useCommerce } from "@/components/providers/CommerceProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { Category } from "@/data/categories";
import type { Product } from "@/data/products";

const MobileMenu = dynamic(() =>
  import("@/components/layout/MobileMenu").then((module) => module.MobileMenu),
);
const CartDrawer = dynamic(() =>
  import("@/components/overlays/CartDrawer").then((module) => module.CartDrawer),
);
const SearchOverlay = dynamic(() =>
  import("@/components/overlays/SearchOverlay").then((module) => module.SearchOverlay),
);
const ProductAdvisorChat = dynamic(() =>
  import("@/components/overlays/ProductAdvisorChat").then((module) => module.ProductAdvisorChat),
);
const ProductQuickView = dynamic(() =>
  import("@/components/product/ProductQuickView").then((module) => module.ProductQuickView),
);

function CommerceOverlays() {
  const { closeQuickView, quickViewProduct } = useCommerce();

  return (
    <>
      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
      <ProductAdvisorChat />
      <ProductQuickView product={quickViewProduct} onClose={closeQuickView} />
    </>
  );
}

export function SiteShell({
  children,
  products,
  categories,
}: {
  children: React.ReactNode;
  products: Product[];
  categories: Category[];
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <CatalogProvider products={products} categories={categories}>
        <CommerceProvider>
          <Header />
          {children}
          <Footer />
          <CommerceOverlays />
        </CommerceProvider>
      </CatalogProvider>
    </ThemeProvider>
  );
}
