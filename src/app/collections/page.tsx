import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCollections } from "@/lib/backend/catalog";
import { getTransparentProductImageSrc } from "@/components/product/ProductImage";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse curated ZEDX collections for audio, power, travel charging, wearables, mounts, and everyday essentials.",
  alternates: {
    canonical: "/collections",
  },
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <main className="mx-auto w-full max-w-[92rem] flex-1 px-4 py-10 text-white sm:px-8 sm:py-20">
      <section className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
        <p className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-[var(--brand-blue-soft)]">
          Curated catalog
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.9] sm:text-8xl">
          Shop by collection.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/58">
          Premium product groups for launch campaigns, homepage merchandising, and focused shopping
          journeys.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] transition hover:-translate-y-1 hover:border-[#00a0e3]/40"
          >
            <div className="relative grid min-h-64 place-items-center overflow-hidden bg-[#f4f4f6]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,160,227,0.18),transparent_48%)]" />
              <Image
                src={getTransparentProductImageSrc(collection.image)}
                alt={`${collection.name} collection`}
                width={320}
                height={320}
                className="relative h-52 w-auto object-contain transition duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-5">
              <h2 className="text-2xl font-semibold">{collection.name}</h2>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/56">
                {collection.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/76">
                Explore
                <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
