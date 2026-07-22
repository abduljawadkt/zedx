import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";

export const productImageStageClassName =
  "relative grid place-items-center overflow-hidden border border-black/10 bg-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.86),0_18px_50px_rgba(0,0,0,0.22)]";

export const productImageStageGlowClassName =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(255,255,255,0.9),transparent_42%),radial-gradient(circle_at_50%_92%,rgba(0,160,227,0.08),transparent_36%)]";

export const productImageGroundShadowClassName =
  "pointer-events-none absolute inset-x-[18%] bottom-[12%] h-9 rounded-full bg-slate-950/16 blur-2xl";

export function getTransparentProductImageSrc(src: string) {
  if (!src.startsWith("/products/")) return src;

  const fileName = src.split("/").pop();
  if (!fileName) return src;

  const baseName = fileName.replace(/\.(jpe?g|png|webp)$/i, ".webp");
  return `/products-transparent/${baseName}`;
}

export function ProductImage({
  alt,
  className,
  imageClassName,
  priority = false,
  product,
  sizes = "(min-width: 1024px) 420px, (min-width: 640px) 45vw, 80vw",
  src,
}: {
  alt?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  product: Product;
  sizes?: string;
  src?: string;
}) {
  const imageSrc = src ?? product.image;
  const useTabletArtwork =
    product.categorySlug === "tablets" && imageSrc.includes("/generated-products/tablet-premium.svg");

  return (
    <div
      className={cn(
        "relative z-10 aspect-square w-[min(78%,440px)] drop-shadow-[0_35px_80px_rgba(56,189,248,0.18)]",
        className,
      )}
    >
      {useTabletArtwork ? (
        <TabletProductArtwork product={product} alt={alt ?? product.name} />
      ) : (
        <Image
          src={getTransparentProductImageSrc(imageSrc)}
          alt={alt ?? product.name}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-contain", imageClassName)}
        />
      )}
    </div>
  );
}

const tabletProductOrder = [
  "zedx-zt56-tablet-pc-12-512-gb",
  "zedx-zt30-tablet-pc-12-512-gb",
  "zedx-z103pro-10-inch-8-256",
  "zedx-z-pro-10inch-tab-8-512",
  "zedx-zee-pad-z105-pro-tab-5-256",
  "zedx-z104-pro-10inch-tab-8-512-gb",
  "zedx-z-lite-7inch-6-128gb",
  "zedx-zsmart-7inch-5g",
  "zedx-z11-kids-tab-wifi-7ich-peecaboo",
];

const tabletVisuals = [
  {
    accent: "#00a0e3",
    angle: "-10deg",
    bezel: "#101820",
    caseColor: "#a9b6c1",
    glow: "rgba(0,160,227,0.34)",
    screen:
      "linear-gradient(135deg, #111827 0%, #263849 42%, #c4d3df 43%, #f5f8fb 100%)",
    size: "78%",
  },
  {
    accent: "#78d5ff",
    angle: "7deg",
    bezel: "#f5f7f9",
    caseColor: "#d8e0e7",
    glow: "rgba(120,213,255,0.32)",
    screen:
      "radial-gradient(circle at 62% 22%, #ffffff 0%, #dbe5ed 38%, #677b8c 100%)",
    size: "74%",
  },
  {
    accent: "#31c6ff",
    angle: "-4deg",
    bezel: "#202831",
    caseColor: "#596672",
    glow: "rgba(49,198,255,0.28)",
    screen:
      "linear-gradient(145deg, #05080c 0%, #172230 46%, #50677a 100%)",
    size: "76%",
  },
  {
    accent: "#6ab8ff",
    angle: "11deg",
    bezel: "#0d1b2a",
    caseColor: "#12334d",
    glow: "rgba(106,184,255,0.34)",
    screen:
      "radial-gradient(circle at 22% 18%, #73d5ff 0%, #15324a 45%, #071019 100%)",
    size: "80%",
  },
  {
    accent: "#d8b46a",
    angle: "-7deg",
    bezel: "#e9eef2",
    caseColor: "#b9c6d0",
    glow: "rgba(216,180,106,0.22)",
    screen:
      "linear-gradient(135deg, #f7fbff 0%, #d7e0e7 45%, #253241 100%)",
    size: "77%",
  },
  {
    accent: "#8ee9ff",
    angle: "4deg",
    bezel: "#161d24",
    caseColor: "#778693",
    glow: "rgba(142,233,255,0.3)",
    screen:
      "linear-gradient(120deg, #091018 0%, #111d28 36%, #8395a3 100%)",
    size: "82%",
  },
  {
    accent: "#8ffff0",
    angle: "-2deg",
    bezel: "#dff8f5",
    caseColor: "#93d6cf",
    glow: "rgba(143,255,240,0.26)",
    screen:
      "radial-gradient(circle at 30% 18%, #effffb 0%, #b6ebe4 42%, #2c5962 100%)",
    size: "68%",
  },
  {
    accent: "#00a0e3",
    angle: "9deg",
    bezel: "#0a0f16",
    caseColor: "#48545f",
    glow: "rgba(0,160,227,0.4)",
    screen:
      "radial-gradient(circle at 72% 25%, #00a0e3 0%, #122f44 35%, #04070b 100%)",
    size: "72%",
  },
  {
    accent: "#ffb84d",
    angle: "-8deg",
    bezel: "#f6fbff",
    caseColor: "#70cdf4",
    glow: "rgba(255,184,77,0.24)",
    screen:
      "linear-gradient(135deg, #ffffff 0%, #d7f4ff 44%, #4ea9d4 100%)",
    size: "70%",
  },
];

function TabletProductArtwork({ alt, product }: { alt: string; product: Product }) {
  const orderedIndex = tabletProductOrder.indexOf(product.slug);
  const variant = tabletVisuals[orderedIndex >= 0 ? orderedIndex : 0];
  const isKidsTablet = product.slug.includes("kids");
  const isCompact = product.name.includes("7inch") || product.name.includes("7ich");
  const style = {
    "--tablet-accent": variant.accent,
    "--tablet-bezel": variant.bezel,
    "--tablet-case": variant.caseColor,
    "--tablet-glow": variant.glow,
    "--tablet-screen": variant.screen,
  } as CSSProperties;

  return (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-0 grid place-items-center"
      style={style}
    >
      <div
        className="relative aspect-[4/3] rounded-[1.7rem] border border-white/35 bg-[var(--tablet-case)] p-[3.6%] shadow-[0_28px_70px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.55)]"
        style={{
          rotate: variant.angle,
          width: variant.size,
        }}
      >
        {isKidsTablet && (
          <div className="absolute -inset-[6%] -z-10 rounded-[2.2rem] bg-[var(--tablet-case)] shadow-[inset_0_0_0_10px_rgba(255,255,255,0.22)]" />
        )}
        <div className="relative h-full overflow-hidden rounded-[1.25rem] bg-[var(--tablet-bezel)] p-[3.2%] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]">
          <div className="absolute left-1/2 top-[2.2%] z-10 size-1.5 -translate-x-1/2 rounded-full bg-black/45 ring-1 ring-white/20" />
          <div className="relative h-full overflow-hidden rounded-[0.95rem] bg-[var(--tablet-screen)]">
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.5),transparent_22%,transparent_58%,rgba(255,255,255,0.14))]" />
            <div className="absolute left-[8%] top-[10%] h-[11%] w-[38%] rounded-full bg-white/55" />
            <div className="absolute bottom-[12%] left-[8%] h-[9%] w-[24%] rounded-full bg-[var(--tablet-accent)] shadow-[0_0_24px_var(--tablet-glow)]" />
            <div className="absolute bottom-[12%] right-[9%] h-[26%] w-[28%] rounded-2xl border border-white/22 bg-white/12 backdrop-blur-sm" />
            <div className="absolute bottom-[44%] right-[12%] h-[8%] w-[22%] rounded-full bg-white/22" />
          </div>
        </div>
        <div className="absolute -bottom-[9%] left-[18%] h-[8%] w-[64%] rounded-full bg-black/35 blur-xl" />
        {!isCompact && (
          <div className="absolute -right-[10%] bottom-[13%] h-[4%] w-[34%] rounded-full bg-[var(--tablet-accent)] shadow-[0_0_22px_var(--tablet-glow)]" />
        )}
      </div>
    </div>
  );
}
