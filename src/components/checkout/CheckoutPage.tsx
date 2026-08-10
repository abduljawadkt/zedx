"use client";

import Link from "next/link";
import { Banknote, Minus, Plus, ShieldCheck, ShoppingBag, Store, Truck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { ProductImage } from "@/components/product/ProductImage";

const paymentOptions = ["Cash on delivery", "Store pickup"] as const;
const defaultCountryCode = "ae";
const defaultPhoneCountryCode = "+971";
const emirates = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"] as const;

const paymentOptionMeta = {
  "Cash on delivery": {
    icon: Banknote,
    note: "Pay when the UAE delivery reaches the customer.",
  },
  "Store pickup": {
    icon: Store,
    note: "Reserve the order and collect after confirmation.",
  },
} satisfies Record<(typeof paymentOptions)[number], { icon: typeof Banknote; note: string }>;

export function CheckoutPage() {
  const { addToCart, cartItems, clearCart, removeFromCart } = useCommerce();
  const reduceMotion = useReducedMotion();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountryCode] = useState(defaultPhoneCountryCode);
  const [countryCode] = useState(defaultCountryCode);
  const [emirate, setEmirate] = useState<(typeof emirates)[number]>("Dubai");
  const [city, setCity] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [apartment, setApartment] = useState("");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentOptions)[number]>("Cash on delivery");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadCustomerDetails() {
      const meResponse = await fetch("/api/account/auth/me");
      if (!active || !meResponse.ok) return;
      const mePayload = await meResponse.json();
      const me = mePayload.data;
      if (!me.authenticated || !me.customer) return;
      setCustomerName((value) => value || me.customer.name || "");
      setEmail((value) => value || me.customer.email || "");
      setPhone((value) => value || me.customer.phone || "");

      const addressResponse = await fetch("/api/account/addresses");
      if (!active || !addressResponse.ok) return;
      const addressData = await addressResponse.json();
      const address = addressData.data?.addresses?.[0];
      if (!address) return;
      setCustomerName((value) => value || address.fullName || "");
      setPhone((value) => value || address.phone || "");
      setCity((value) => value || address.city || "");
      setAddressLine((value) => value || address.addressLine || "");
      setApartment((value) => value || address.apartment || "");
    }
    loadCustomerDetails();
    return () => {
      active = false;
    };
  }, []);

  const groupedItems = useMemo(
    () =>
      cartItems.reduce(
        (items, product) => {
          const existing = items.find((item) => item.product.id === product.id);
          if (existing) existing.quantity += 1;
          else items.push({ product, quantity: 1 });
          return items;
        },
        [] as Array<{ product: (typeof cartItems)[number]; quantity: number }>,
      ),
    [cartItems],
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shipping = subtotal > 0 && paymentMethod !== "Store pickup" ? 18 : 0;
  const total = subtotal + shipping;

  async function placeOrder() {
    setSubmitting(true);
    setStatus(null);
    try {
      if (!customerName || !email || !phone || !emirate || !city || !addressLine || !buildingName || !postalCode) {
        throw new Error("Please complete all required contact and delivery fields before placing the order.");
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          phoneCountryCode,
          countryCode,
          emirate,
          city,
          addressLine,
          buildingName,
          apartment,
          landmark,
          postalCode,
          deliveryNotes,
          paymentMethod,
          items: cartItems.reduce(
            (items, product) => {
              const existing = items.find((item) => item.productId === product.id);
              if (existing) existing.quantity += 1;
              else items.push({ productId: product.id, productSlug: product.slug, variantId: product.medusaVariantId, quantity: 1 });
              return items;
            },
            [] as Array<{ productId: string; productSlug: string; variantId?: string; quantity: number }>,
          ),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        const message = typeof payload?.error === "string" ? payload.error : payload?.error?.message;
        throw new Error(message ?? "Unable to place order.");
      }
      const data = payload.data ?? payload;
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      clearCart();
      setStatus(`Order ${data.orderNumber} created in Medusa Admin. Total ${data.currency} ${data.total}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to place order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[92rem] flex-1 px-4 py-8 sm:px-8 sm:py-20">
      <motion.section
        className="relative overflow-hidden rounded-[1.5rem] border border-[#ffffff1a] bg-[#ffffff09] p-5 shadow-2xl shadow-[#00000033] sm:rounded-[2rem] sm:p-8"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 22 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,160,227,0.22),transparent_34%)]" />
        <p className="relative inline-flex rounded-full border border-[#ffffff1a] bg-[#ffffff0a] px-4 py-2 text-xs font-semibold text-[var(--brand-blue-soft)]">
          Checkout
        </p>
        <h1 className="relative mt-5 max-w-5xl text-5xl font-semibold leading-[0.9] text-white sm:text-8xl">
          Secure your ZEDX order.
        </h1>
        <p className="relative mt-5 max-w-2xl text-base leading-7 text-white/62 sm:mt-6 sm:text-lg sm:leading-8">
          Add your contact details, full UAE delivery address, and preferred COD or pickup option so the order can be created correctly in the backend.
        </p>
      </motion.section>

      {groupedItems.length === 0 ? (
        <section className="mt-8 grid min-h-[24rem] place-items-center rounded-[1.5rem] border border-[#ffffff1a] bg-[#ffffff08] p-6 text-center sm:mt-10 sm:min-h-[30rem] sm:rounded-[2rem] sm:p-8">
          <div>
            <ShoppingBag className="mx-auto text-[var(--brand-blue-soft)]" size={36} />
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Your cart is empty.</h2>
            <p className="mt-3 max-w-md text-white/60">Add products from the catalog to build your ZEDX setup.</p>
            <Link href="/products" className="mt-7 inline-flex h-13 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#050505] transition hover:bg-[var(--brand-blue-soft)]">
              Browse products
            </Link>
          </div>
        </section>
      ) : (
        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.46fr]">
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-[#ffffff1a] bg-[#ffffff09] p-5 sm:rounded-[2rem] sm:p-7">
              <StepHeader step="1" title="Contact details" note="Used for order confirmation and delivery coordination." />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input label="Full name" value={customerName} onChange={setCustomerName} className="sm:col-span-2" required autoComplete="name" />
                <Input label="Email address" value={email} onChange={setEmail} type="email" required autoComplete="email" />
                <PhoneInput label="Mobile number" value={phone} onChange={setPhone} countryCode={phoneCountryCode} required />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#ffffff1a] bg-[#ffffff09] p-5 sm:rounded-[2rem] sm:p-7">
              <StepHeader step="2" title="Delivery address" note="Required fields are sent to Medusa for shipping and fulfillment." />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <SelectInput label="Emirate" value={emirate} onChange={(value) => setEmirate(value as (typeof emirates)[number])} options={emirates} required />
                <ReadOnlyField label="Country" value="United Arab Emirates" required />
                <Input label="City" value={city} onChange={setCity} required autoComplete="address-level2" />
                <Input label="Postal code" value={postalCode} onChange={setPostalCode} required autoComplete="postal-code" inputMode="numeric" />
                <Input label="Area, street, or community" value={addressLine} onChange={setAddressLine} className="sm:col-span-2" required autoComplete="address-line1" />
                <Input label="Building, villa, or tower name" value={buildingName} onChange={setBuildingName} required autoComplete="address-line2" />
                <Input label="Apartment, floor, or unit" value={apartment} onChange={setApartment} />
                <Input label="Nearest landmark" value={landmark} onChange={setLandmark} className="sm:col-span-2" />
                <TextArea label="Delivery notes" value={deliveryNotes} onChange={setDeliveryNotes} className="sm:col-span-2" placeholder="Gate code, preferred delivery time, or extra directions" />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#ffffff1a] bg-[#ffffff09] p-5 sm:rounded-[2rem] sm:p-7">
              <StepHeader step="3" title="Payment method" note="Online card payments can be enabled when the gateway is ready." />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {paymentOptions.map((option) => {
                  const Icon = paymentOptionMeta[option].icon;
                  return (
                  <label key={option} className="flex min-h-24 cursor-pointer items-center gap-3 rounded-2xl border border-[#ffffff1a] bg-[#00000033] p-4 text-sm font-semibold text-[#ffffffb3] transition hover:border-[#00a0e3]/60">
                    <input type="radio" name="payment" checked={paymentMethod === option} onChange={() => setPaymentMethod(option)} className="size-4 accent-[#00a0e3]" />
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-[var(--brand-blue-soft)]">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-white">{option}</span>
                      <span className="mt-1 block text-xs font-medium leading-5 text-white/52">{paymentOptionMeta[option].note}</span>
                    </span>
                  </label>
                  );
                })}
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#00a0e3]/30 bg-[#00a0e3]/10 p-4 text-sm leading-6 text-[#ffffff99]">
                <ShieldCheck className="mt-0.5 shrink-0 text-[var(--brand-blue-soft)]" size={18} />
                Card payments are temporarily hidden. Cash on delivery and store pickup create real pending orders in Medusa Admin.
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[1.5rem] border border-[#ffffff1a] bg-[#101014]/88 p-5 shadow-2xl shadow-[#00000040] sm:rounded-[2rem] sm:p-6 lg:sticky lg:top-28">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">Review order</h2>
            <div className="mt-6 space-y-4">
              {groupedItems.map(({ product, quantity }) => (
                <div key={product.id} className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-2xl border border-[#ffffff1a] bg-[#ffffff09] p-3 sm:grid-cols-[5rem_1fr] sm:gap-4">
                  <div className="grid min-h-20 place-items-center rounded-xl bg-[#f2f2f4]">
                    <ProductImage product={product} className="!w-14" sizes="80px" />
                  </div>
                  <div>
                    <p className="line-clamp-2 text-sm font-semibold leading-5 text-white">{product.name}</p>
                    <p className="mt-1 text-sm text-[#ffffff73]">{product.currency} {product.price}</p>
                    <div className="mt-3 inline-flex items-center overflow-hidden rounded-full border border-[#ffffff1a]">
                      <button type="button" aria-label={`Decrease ${product.name} quantity`} className="grid size-8 place-items-center text-[#ffffff99] hover:bg-[#ffffff1a] hover:text-white" onClick={() => removeFromCart(product.id)}>
                        <Minus size={13} />
                      </button>
                      <span className="grid h-8 min-w-9 place-items-center border-x border-[#ffffff1a] text-sm font-semibold text-white">{quantity}</span>
                      <button type="button" aria-label={`Increase ${product.name} quantity`} className="grid size-8 place-items-center text-[#ffffff99] hover:bg-[#ffffff1a] hover:text-white" onClick={() => addToCart(product, { openCart: false })}>
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-[#ffffff1a] pt-5 text-sm">
              <SummaryRow label="Subtotal" value={`AED ${subtotal}`} />
              <SummaryRow label="Shipping" value={shipping ? `AED ${shipping}` : "Free"} />
              <div className="flex items-center justify-between pt-3 text-white">
                <span className="text-sm text-[#ffffff73]">Total</span>
                <span className="text-2xl font-semibold sm:text-3xl">AED {total}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={placeOrder}
              className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#00a0e3] text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-white hover:text-[#050505] disabled:opacity-70"
            >
              <ShieldCheck size={17} />
              {submitting ? "Placing order..." : paymentMethod === "Store pickup" ? "Confirm pickup order" : "Confirm COD order"}
            </button>
            {status && <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">{status}</p>}
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#ffffff1a] bg-[#ffffff09] p-4 text-sm leading-6 text-white/60">
              <Truck className="mt-0.5 shrink-0 text-[var(--brand-blue-soft)]" size={18} />
              Estimated UAE delivery: 3-7 business days. Fulfillment can be managed from Medusa Admin after order confirmation.
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}

function StepHeader({ step, title, note }: { step: string; title: string; note: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-blue-soft)]">Step {step}</p>
        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      </div>
      <p className="max-w-md text-sm leading-6 text-white/52">{note}</p>
    </div>
  );
}

function RequiredMark() {
  return <span className="text-[var(--brand-blue-soft)]">*</span>;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="text-xs font-semibold text-[#ffffff66]">
      {label} {required && <RequiredMark />}
    </span>
  );
}

function Input({
  label,
  value,
  onChange,
  className = "",
  required = false,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
  type?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "none" | "numeric" | "decimal" | "search";
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <FieldLabel label={label} required={required} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        className="mt-2 h-14 w-full rounded-2xl border border-[#ffffff1a] bg-black/24 px-4 text-white outline-none transition placeholder:text-[#ffffff40] focus:border-[#00a0e3]/70"
        placeholder={placeholder ?? label}
      />
    </label>
  );
}

function PhoneInput({
  label,
  value,
  onChange,
  countryCode,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <div className="mt-2 grid h-14 grid-cols-[5.25rem_1fr] overflow-hidden rounded-2xl border border-[#ffffff1a] bg-black/24 transition focus-within:border-[#00a0e3]/70">
        <span className="grid place-items-center border-r border-[#ffffff1a] bg-white/[0.04] text-sm font-semibold text-white/80">{countryCode}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          className="h-full w-full bg-transparent px-4 text-white outline-none placeholder:text-[#ffffff40]"
          placeholder="50 123 4567"
        />
      </div>
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-2 h-14 w-full rounded-2xl border border-[#ffffff1a] bg-black/24 px-4 text-white outline-none transition focus:border-[#00a0e3]/70"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#101014] text-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReadOnlyField({ label, value, required }: { label: string; value: string; required?: boolean }) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <input value={value} readOnly className="mt-2 h-14 w-full rounded-2xl border border-[#ffffff1a] bg-white/[0.04] px-4 text-white/72 outline-none" />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  className = "",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <FieldLabel label={label} />
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-[#ffffff1a] bg-black/24 px-4 py-3 text-white outline-none transition placeholder:text-[#ffffff40] focus:border-[#00a0e3]/70"
        placeholder={placeholder ?? label}
      />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-white/72">
      <span>{label}</span>
      <span className="font-semibold text-[#ffffffbf]">{value}</span>
    </div>
  );
}
