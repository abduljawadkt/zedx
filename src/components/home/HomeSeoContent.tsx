import Link from "next/link";
import { BatteryCharging, Headphones, Mail, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { storefrontConfig } from "@/config/storefront";

const reasons = [
  {
    icon: BatteryCharging,
    title: "Fast charging choices",
    body: "Compare ZEDX power banks, charging docks, GaN chargers, car chargers, and Type-C cables by use case and price.",
  },
  {
    icon: Headphones,
    title: "Audio for daily routines",
    body: "Shop wireless earbuds, neckbands, headphones, and speakers for clear calls, gaming, commuting, and focused listening.",
  },
  {
    icon: Smartphone,
    title: "Accessories that fit your setup",
    body: "Find car mounts, smart watches, cables, and mobile accessories for desk, travel, and dashboard use.",
  },
  {
    icon: ShieldCheck,
    title: storefrontConfig.warranty.label,
    body: storefrontConfig.warranty.description,
  },
  {
    icon: Truck,
    title: storefrontConfig.shipping.label,
    body: storefrontConfig.shipping.description,
  },
];

export function HomeSeoContent() {
  return (
    <section className="bg-[#050505] px-5 py-20 text-white sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">Why ZEDX</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl sm:leading-[0.98]">
            Mobile accessories, chargers, power banks, and smart devices for Dubai & UAE.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
            ZEDX brings everyday electronics into one premium shopping experience: wireless earbuds for calls and music,
            power banks for travel, GaN chargers for faster desk charging, smart watches for daily visibility, and car
            mounts for cleaner driving setups.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/56">
            The catalog is organized around practical UAE shopping needs: price, category, compatibility, portability,
            and setup type. Each page is built to help customers compare products quickly before moving to checkout.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#00a0e3] px-6 text-sm font-semibold text-white"
            >
              Shop all products
            </Link>
            <Link
              href="/support"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 px-6 text-sm font-semibold text-white/76"
            >
              Get product help
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <article
                key={reason.title}
                className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-[var(--brand-blue-soft)]">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{reason.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/58">{reason.body}</p>
                  </div>
                </div>
              </article>
            );
          })}

          <article className="rounded-[1.25rem] border border-[#00a0e3]/22 bg-[#00a0e3]/10 p-5 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-[#050505]">
                <Mail size={20} />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-white">Launch updates</h3>
                <p className="mt-2 text-sm leading-7 text-white/62">
                  Follow ZEDX product launches, new arrivals, and support updates through the confirmed brand email:
                  {" "}
                  <span className="font-semibold text-white">{storefrontConfig.contactEmail}</span>.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
