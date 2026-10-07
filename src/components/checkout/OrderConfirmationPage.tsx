"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductImage } from "@/components/product/ProductImage";
import type { Product } from "@/data/products";

const STORAGE_KEY = "zedx:lastOrder";

type ConfirmationLine = {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  slug?: string;
  product?: Product;
};

type ConfirmationData = {
  orderNumber: string;
  status: string;
  currency: string;
  total: number;
  itemsCount: number;
  customerName?: string;
  email?: string;
  phone?: string;
  paymentMethod?: string;
  address?: {
    emirate?: string;
    city?: string;
    addressLine?: string;
    buildingName?: string;
    apartment?: string;
    landmark?: string;
    postalCode?: string;
    deliveryNotes?: string;
  };
  placedAt?: string;
  lines: ConfirmationLine[];
};

type LoadState =
  | { phase: "loading" }
  | { phase: "ready"; data: ConfirmationData }
  | { phase: "missing"; orderNumber: string | null };

function readStoredOrder(orderNumber: string | null): ConfirmationData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConfirmationData;
    if (!parsed?.orderNumber) return null;
    // If the URL names a specific order, only use the stored copy when it matches.
    if (orderNumber && parsed.orderNumber !== orderNumber) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function fetchOrder(orderNumber: string): Promise<ConfirmationData | null> {
  try {
    const response = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`);
    if (!response.ok) return null;
    const payload = await response.json();
    const order = payload?.data ?? payload;
    if (!order?.orderNumber) return null;
    const lines: ConfirmationLine[] = Array.isArray(order.items)
      ? order.items.map((item: Record<string, unknown>) => ({
          name: String(item.name ?? "ZEDX product"),
          quantity: Number(item.quantity ?? 1),
          price: Number(item.price ?? 0),
          image: typeof item.image === "string" ? item.image : undefined,
          slug: typeof item.productSlug === "string" ? item.productSlug : undefined,
        }))
      : [];
    return {
      orderNumber: order.orderNumber,
      status: order.status ?? "pending",
      currency: order.currency ?? "AED",
      total: Number(order.total ?? 0),
      itemsCount: lines.reduce((sum, line) => sum + line.quantity, 0) || lines.length,
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      paymentMethod: order.paymentMethod,
      address: {
        city: order.city,
        addressLine: order.addressLine,
        apartment: order.apartment ?? undefined,
      },
      placedAt: order.createdAt,
      lines,
    };
  } catch {
    return null;
  }
}

export function OrderConfirmationPage() {
  const reduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");
  const [state, setState] = useState<LoadState>({ phase: "loading" });

  useEffect(() => {
    let active = true;
    async function resolve() {
      const stored = readStoredOrder(orderParam);
      if (stored) {
        if (active) setState({ phase: "ready", data: stored });
        return;
      }
      if (orderParam) {
        const fetched = await fetchOrder(orderParam);
        if (!active) return;
        setState(fetched ? { phase: "ready", data: fetched } : { phase: "missing", orderNumber: orderParam });
        return;
      }
      if (active) setState({ phase: "missing", orderNumber: null });
    }
    resolve();
    return () => {
      active = false;
    };
  }, [orderParam]);

  if (state.phase === "loading") {
    return (
      <main className="mx-auto grid min-h-[60vh] w-full max-w-[92rem] flex-1 place-items-center px-4 py-20">
        <div className="flex flex-col items-center gap-4 text-white/60">
          <div className="size-10 animate-spin rounded-full border-2 border-white/15 border-t-[var(--brand-blue-soft)]" />
          <p className="text-sm">Loading your order…</p>
        </div>
      </main>
    );
  }

  if (state.phase === "missing") {
    return (
      <main className="mx-auto w-full max-w-[92rem] flex-1 px-4 py-14 sm:px-8 sm:py-24">
        <section className="grid min-h-[22rem] place-items-center rounded-[1.5rem] border border-[#ffffff1a] bg-[#ffffff08] p-6 text-center sm:rounded-[2rem] sm:p-10">
          <div>
            <Package className="mx-auto text-[var(--brand-blue-soft)]" size={38} />
            <h1 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
              {state.orderNumber ? "We couldn't load this order" : "No recent order found"}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-white/60">
              {state.orderNumber
                ? `Order ${state.orderNumber} isn't available on this device. If you just placed it, keep the number for your records — our team will reach out to confirm delivery.`
                : "Place an order from the checkout to see its confirmation here."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#050505] transition hover:bg-[var(--brand-blue-soft)]"
              >
                Browse products
              </Link>
              <Link
                href="/track-order"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#ffffff26] px-6 text-sm font-semibold text-white transition hover:border-white/60"
              >
                Track an order
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return <ConfirmationContent data={state.data} reduceMotion={reduceMotion ?? false} />;
}

function ConfirmationContent({ data, reduceMotion }: { data: ConfirmationData; reduceMotion: boolean }) {
  const computedTotal = useMemo(
    () => data.lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [data.lines],
  );
  const total = computedTotal || data.total;
  const currency = data.currency || "AED";
  const isPickup = (data.paymentMethod ?? "").toLowerCase().includes("pickup");
  const placedAt = data.placedAt ? new Date(data.placedAt) : null;
  const addressParts = [
    data.address?.addressLine,
    data.address?.buildingName,
    data.address?.apartment,
    data.address?.landmark ? `Landmark: ${data.address.landmark}` : "",
    [data.address?.city, data.address?.emirate].filter(Boolean).join(", "),
    data.address?.postalCode,
  ].filter(Boolean);

  return (
    <main className="mx-auto w-full max-w-[92rem] flex-1 px-4 py-8 sm:px-8 sm:py-16">
      <motion.section
        className="relative overflow-hidden rounded-[1.5rem] border border-[#ffffff1a] bg-[#ffffff09] p-6 shadow-2xl shadow-[#00000033] sm:rounded-[2rem] sm:p-10"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 22 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(0,160,227,0.24),transparent_38%)]" />
        <motion.div
          className="relative grid size-16 place-items-center rounded-2xl border border-[#00a0e3]/40 bg-[#00a0e3]/15 text-[var(--brand-blue-soft)] sm:size-20"
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
        >
          <CheckCircle2 size={38} />
        </motion.div>
        <p className="relative mt-6 inline-flex rounded-full border border-[#ffffff1a] bg-[#ffffff0a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-blue-soft)]">
          Order confirmed
        </p>
        <h1 className="relative mt-5 max-w-4xl text-4xl font-semibold leading-[0.95] text-white sm:text-7xl">
          Thank you{data.customerName ? `, ${data.customerName.split(" ")[0]}` : ""}.
        </h1>
        <p className="relative mt-5 max-w-2xl text-base leading-7 text-white/64 sm:text-lg sm:leading-8">
          Your ZEDX order has been placed successfully.{" "}
          {isPickup
            ? "We'll reach out to arrange your store pickup."
            : "Our team will contact you to confirm your cash-on-delivery order."}
          {data.phone ? ` We'll call ${data.phone}.` : ""}
        </p>
        <div className="relative mt-7 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ffffff1f] bg-black/30 px-4 py-2.5 text-sm font-semibold text-white">
            <ClipboardCheck size={16} className="text-[var(--brand-blue-soft)]" />
            Order {data.orderNumber}
          </span>
          {placedAt && (
            <span className="text-sm text-white/50">
              {placedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
        </div>
      </motion.section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.5fr]">
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-[#ffffff1a] bg-[#ffffff09] p-5 sm:rounded-[2rem] sm:p-7">
            <div className="flex items-center gap-2 text-white">
              <Package size={18} className="text-[var(--brand-blue-soft)]" />
              <h2 className="text-xl font-semibold sm:text-2xl">Order summary</h2>
            </div>
            <div className="mt-6 space-y-4">
              {data.lines.map((line, index) => (
                <div
                  key={`${line.slug ?? line.name}-${index}`}
                  className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 rounded-2xl border border-[#ffffff1a] bg-[#ffffff09] p-3 sm:grid-cols-[5rem_1fr_auto] sm:gap-4"
                >
                  <div className="grid min-h-20 place-items-center overflow-hidden rounded-xl bg-[#f2f2f4]">
                    {line.product ? (
                      <ProductImage product={line.product} className="!w-14" sizes="80px" />
                    ) : line.image ? (
                      <Image
                        src={line.image}
                        alt={line.name}
                        width={56}
                        height={56}
                        className="h-14 w-14 object-contain"
                      />
                    ) : (
                      <ShoppingBag className="text-black/30" size={24} />
                    )}
                  </div>
                  <div>
                    <p className="line-clamp-2 text-sm font-semibold leading-5 text-white">{line.name}</p>
                    <p className="mt-1 text-sm text-white/55">Qty {line.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {currency} {line.price * line.quantity}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-[#ffffff1a] pt-5 text-sm">
              <div className="flex items-center justify-between text-white/70">
                <span>Subtotal</span>
                <span className="font-semibold text-white/90">
                  {currency} {total}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 text-white">
                <span className="text-sm text-white/70">Total</span>
                <span className="text-2xl font-semibold sm:text-3xl">
                  {currency} {total}
                </span>
              </div>
            </div>
          </div>

          {addressParts.length > 0 && (
            <div className="rounded-[1.5rem] border border-[#ffffff1a] bg-[#ffffff09] p-5 sm:rounded-[2rem] sm:p-7">
              <div className="flex items-center gap-2 text-white">
                <MapPin size={18} className="text-[var(--brand-blue-soft)]" />
                <h2 className="text-xl font-semibold sm:text-2xl">Delivery address</h2>
              </div>
              <div className="mt-4 text-sm leading-7 text-white/70">
                {data.customerName && <p className="font-semibold text-white">{data.customerName}</p>}
                <p>{addressParts.join(", ")}</p>
                <p className="mt-1 text-white/50">United Arab Emirates</p>
                {data.address?.deliveryNotes && (
                  <p className="mt-3 rounded-xl border border-[#ffffff14] bg-black/20 p-3 text-white/60">
                    Notes: {data.address.deliveryNotes}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit space-y-6 lg:sticky lg:top-28">
          <div className="rounded-[1.5rem] border border-[#ffffff1a] bg-[#101014]/88 p-5 shadow-2xl shadow-[#00000040] sm:rounded-[2rem] sm:p-6">
            <h2 className="text-lg font-semibold text-white">Order details</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <Detail icon={ClipboardCheck} label="Order number" value={data.orderNumber} />
              <Detail
                icon={CreditCard}
                label="Payment"
                value={data.paymentMethod ?? (isPickup ? "Store pickup" : "Cash on delivery")}
              />
              <Detail icon={Package} label="Status" value={capitalize(data.status)} badge />
              {data.email && <Detail icon={ClipboardCheck} label="Email" value={data.email} />}
            </dl>
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#00a0e3]/30 bg-[#00a0e3]/10 p-4 text-sm leading-6 text-white/75">
              <Truck className="mt-0.5 shrink-0 text-[var(--brand-blue-soft)]" size={18} />
              {isPickup
                ? "Your order will be reserved for in-store pickup once confirmed."
                : "Estimated UAE delivery: 3-7 business days."}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/products"
              className="inline-flex h-13 items-center justify-center rounded-full bg-[#00a0e3] text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-white hover:text-[#050505]"
            >
              Continue shopping
            </Link>
            <Link
              href="/account"
              className="inline-flex h-13 items-center justify-center rounded-full border border-[#ffffff26] text-sm font-semibold text-white transition hover:border-white/60"
            >
              View my orders
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  badge = false,
}: {
  icon: typeof ClipboardCheck;
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex items-center gap-2 text-white/55">
        <Icon size={15} className="text-[var(--brand-blue-soft)]" />
        {label}
      </dt>
      <dd className={badge ? "" : "text-right font-semibold text-white"}>
        {badge ? (
          <span className="inline-flex items-center rounded-full border border-[#00a0e3]/40 bg-[#00a0e3]/15 px-3 py-1 text-xs font-semibold text-[var(--brand-blue-soft)]">
            {value}
          </span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function capitalize(value: string) {
  if (!value) return "Pending";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
