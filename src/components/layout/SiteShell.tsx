"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartDrawer } from "@/components/overlays/CartDrawer";
import { ProductAdvisorChat } from "@/components/overlays/ProductAdvisorChat";
import { SearchOverlay } from "@/components/overlays/SearchOverlay";
import { ProductQuickView } from "@/components/product/ProductQuickView";
import { CommerceProvider, useCommerce } from "@/components/providers/CommerceProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { usePathname } from "next/navigation";

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

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <CommerceProvider>
        <Header />
        {children}
        <Footer />
        <CommerceOverlays />
      </CommerceProvider>
    </ThemeProvider>
  );
}
