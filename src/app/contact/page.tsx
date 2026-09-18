import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { storefrontConfig } from "@/config/storefront";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ZEDX for product help, support, and UAE shopping questions.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[72rem] flex-1 px-4 py-14 text-white sm:px-8 sm:py-24">
      <section className="rounded-[1.6rem] border border-white/10 bg-[#0b0d11]/78 p-6 shadow-2xl shadow-black/30 sm:rounded-[2rem] sm:p-10">
        <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">Contact ZEDX</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-7xl sm:leading-[0.96]">
          Product help and support for Dubai & UAE shoppers.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
          Ask about ZEDX audio, power banks, fast chargers, smart wearables, car mounts, cables, warranty support,
          shipping information, or product compatibility.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Mail,
            title: "Email",
            body: storefrontConfig.contactEmail,
            href: `mailto:${storefrontConfig.contactEmail}`,
          },
          {
            icon: MapPin,
            title: "Region",
            body: storefrontConfig.regionLabel,
            href: "/shipping",
          },
          {
            icon: MessageCircle,
            title: "Support",
            body: "Product and order help",
            href: "/support",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#00a0e3]/50 hover:bg-white/[0.055]"
            >
              <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-[var(--brand-blue-soft)]">
                <Icon size={20} />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-white/58">{item.body}</p>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
