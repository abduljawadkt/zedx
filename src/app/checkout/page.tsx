import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout Preview",
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
