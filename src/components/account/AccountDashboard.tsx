"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, MapPin, PackageCheck, Save, ShoppingBag } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  addressLine: string;
  apartment: string | null;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  total: number;
  createdAt: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
};

export function AccountDashboard({ customer }: { customer: Customer }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [orders, setOrders] = useState<Order[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [fullName, setFullName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone ?? "");
  const [city, setCity] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [apartment, setApartment] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadAccount() {
      const [ordersResponse, addressesResponse] = await Promise.all([
        fetch("/api/account/orders"),
        fetch("/api/account/addresses"),
      ]);
      if (!active) return;
      if (ordersResponse.ok) {
        const data = await ordersResponse.json();
        setOrders(data.orders ?? data.data?.orders ?? []);
      }
      if (addressesResponse.ok) {
        const data = await addressesResponse.json();
        const defaultAddress = (data.addresses ?? data.data?.addresses)?.[0] as Address | undefined;
        if (defaultAddress) {
          setAddress(defaultAddress);
          setFullName(defaultAddress.fullName);
          setPhone(defaultAddress.phone);
          setCity(defaultAddress.city);
          setAddressLine(defaultAddress.addressLine);
          setApartment(defaultAddress.apartment ?? "");
        }
      }
    }
    loadAccount();
    return () => {
      active = false;
    };
  }, []);

  async function saveAddress() {
    setStatus(null);
    const response = await fetch("/api/account/addresses", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        label: "Default",
        fullName,
        phone,
        city,
        addressLine,
        apartment,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data?.error?.message ?? "Unable to save delivery details.");
      return;
    }
    setAddress(data.address ?? data.data?.address);
    setStatus("Delivery details saved.");
  }

  async function logout() {
    await fetch("/api/account/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-[92rem] flex-1 px-4 py-28 text-white sm:px-8">
      <motion.section
        className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 sm:p-10"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 24 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(0,160,227,0.24),transparent_34%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
              My account
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-[0.9] tracking-normal sm:text-7xl">
              {customer.name}
            </h1>
            <p className="mt-5 text-base text-white/62">{customer.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full border border-white/14 px-5 text-sm font-semibold text-white/72 transition hover:border-[var(--brand-blue)] hover:text-white"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </motion.section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/12 bg-white/[0.055] p-6 shadow-2xl shadow-black/25 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-[var(--brand-blue)] text-white">
              <MapPin size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
                Saved delivery details
              </p>
              <h2 className="text-3xl font-semibold tracking-normal">Delivery profile</h2>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={fullName} onChange={setFullName} className="sm:col-span-2" />
            <Field label="Phone" value={phone} onChange={setPhone} />
            <Field label="City" value={city} onChange={setCity} />
            <Field label="Area or street" value={addressLine} onChange={setAddressLine} className="sm:col-span-2" />
            <Field label="Apartment or villa" value={apartment} onChange={setApartment} className="sm:col-span-2" />
          </div>

          <button
            type="button"
            onClick={saveAddress}
            className="mt-6 inline-flex h-13 w-full items-center justify-center gap-3 rounded-full bg-[var(--brand-blue)] text-sm font-semibold text-white transition hover:bg-white hover:text-[#050505]"
          >
            <Save size={16} />
            Save delivery details
          </button>
          {status ? <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/72">{status}</p> : null}
          {address ? (
            <p className="mt-4 text-sm leading-6 text-white/48">
              Current default: {address.addressLine}, {address.city}
            </p>
          ) : null}
        </div>

        <div className="rounded-[2rem] border border-white/12 bg-white/[0.055] p-6 shadow-2xl shadow-black/25 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-white text-[#050505]">
              <PackageCheck size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
                Order history
              </p>
              <h2 className="text-3xl font-semibold tracking-normal">Your purchases</h2>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="mt-8 grid min-h-72 place-items-center rounded-[1.5rem] border border-white/10 bg-black/18 p-8 text-center">
              <div>
                <ShoppingBag className="mx-auto text-[var(--brand-blue-soft)]" size={34} />
                <p className="mt-4 text-2xl font-semibold">No orders yet.</p>
                <p className="mt-2 text-sm text-white/52">Your completed ZEDX checkout orders will appear here.</p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#050505] transition hover:bg-[var(--brand-blue)] hover:text-white"
                >
                  Browse products
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-7 space-y-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">
                        {order.orderNumber}
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        {order.items.length} item{order.items.length === 1 ? "" : "s"} · {order.currency} {order.total}
                      </p>
                      <p className="mt-1 text-sm text-white/46">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="w-fit rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold text-white/66">
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-white/58">
                    {order.items.map((item) => (
                      <p key={item.id}>{item.quantity} x {item.name}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({
  className = "",
  label,
  onChange,
  value,
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold text-white/44">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-14 w-full rounded-2xl border border-white/12 bg-black/24 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-[var(--brand-blue)]"
        placeholder={label}
      />
    </label>
  );
}
