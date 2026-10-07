import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmationPage } from "@/components/checkout/OrderConfirmationPage";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your ZEDX order has been placed successfully.",
  robots: { index: false, follow: false },
};

export default function CheckoutConfirmationRoute() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationPage />
    </Suspense>
  );
}
