import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const featureCards = [
  {
    label: "Audio",
    title: "Precision Audio",
    copy: "Experience every frequency in stunning clarity.",
    href: "/collections/audio",
    productImage: "/hero-animation/headphones.png",
    size: "large",
  },
  {
    label: "Wearables",
    title: "Future on Your Wrist",
    copy: "Intelligence that moves with you.",
    href: "/collections/accessories",
    productImage: "/hero-animation/watch.png",
    size: "wide",
  },
  {
    label: "Accessories",
    title: "Power Your Workflow",
    copy: "Engineered for peak performance.",
    href: "/collections/power",
    productImage: "/hero-animation/dock.png",
    size: "wide",
  },
];

export function CategoryStrip() {
  const [primaryCard, ...secondaryCards] = featureCards;

  return (
    <section
      aria-label="Featured ZEDX categories"
      className="border-y border-[#ffffff12] bg-[#030405] px-5 py-14 text-white sm:px-8 lg:py-20"
    >
      <div className="mx-auto grid max-w-[92rem] gap-5 lg:grid-cols-[1fr_1fr]">
        <CategoryFeatureCard card={primaryCard} priority />
        <div className="grid gap-5">
          {secondaryCards.map((card) => (
            <CategoryFeatureCard key={card.label} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryFeatureCard({
  card,
  priority = false,
}: {
  card: (typeof featureCards)[number];
  priority?: boolean;
}) {
  const isLarge = card.size === "large";

  return (
    <Link
      href={card.href}
      className={`group relative isolate block overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#101114] shadow-2xl shadow-black/30 transition duration-500 hover:-translate-y-1 hover:border-[#00a0e3]/45 sm:rounded-[1.7rem] ${
        isLarge ? "min-h-[34rem] lg:min-h-[44rem]" : "min-h-[22rem]"
      }`}
    >
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_68%_20%,rgba(0,160,227,0.2),transparent_32%),radial-gradient(circle_at_18%_82%,rgba(255,255,255,0.06),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.035),rgba(3,4,5,0.92)_48%,rgba(0,0,0,0.98))]" />
      <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(0,0,0,0.34),transparent_54%),linear-gradient(180deg,rgba(3,4,5,0.04),rgba(3,4,5,0.74))]" />
      <div
        className={`absolute z-[3] rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_36%,rgba(0,160,227,0.2),rgba(8,18,23,0.82)_48%,rgba(3,4,5,0.96)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_28px_90px_rgba(0,0,0,0.42)] ${
          isLarge
            ? "inset-x-[9%] bottom-8 h-[53%] sm:bottom-10"
            : "bottom-5 right-5 h-[62%] w-[54%]"
        }`}
      />
      <div
        className={`absolute z-[4] rounded-full bg-[#00a0e3]/14 blur-3xl ${
          isLarge
            ? "inset-x-[21%] bottom-[15%] h-[26%]"
            : "bottom-[16%] right-[13%] h-[30%] w-[34%]"
        }`}
      />
      <Image
        src={card.productImage}
        alt={`${card.label} category product`}
        width={520}
        height={520}
        sizes={isLarge ? "(min-width: 1024px) 34vw, 78vw" : "(min-width: 1024px) 22vw, 46vw"}
        className={`absolute z-[5] object-contain drop-shadow-[0_34px_70px_rgba(0,0,0,0.5)] transition duration-700 group-hover:scale-105 ${
          isLarge
            ? "bottom-[11%] left-1/2 h-[38%] w-auto -translate-x-1/2 sm:h-[42%]"
            : "bottom-[14%] right-[12%] h-[48%] w-auto"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 z-[6] h-[34%] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.7))]" />

      <div className={`absolute inset-0 z-10 flex flex-col justify-end p-7 sm:p-9 ${isLarge ? "lg:p-10" : ""}`}>
        <span
          className={`w-fit rounded-full border border-white/16 px-4 py-2 text-[0.68rem] font-semibold backdrop-blur-md ${
            card.label === "Accessories" ? "bg-[#00a0e3] text-[#020617]" : "bg-white/14 text-white/82"
          }`}
        >
          {card.label}
        </span>
        <h2
          className={`mt-5 max-w-3xl font-semibold leading-tight text-white ${
            isLarge ? "text-3xl sm:text-5xl lg:text-6xl" : "text-2xl sm:text-4xl lg:text-5xl"
          }`}
        >
          {card.title}
        </h2>
        <p className="mt-4 max-w-md text-base leading-7 text-white/62">
          {card.copy}
        </p>
        <span
          className={`mt-8 inline-flex items-center gap-3 text-sm font-semibold ${
            card.label === "Accessories" ? "text-white" : "text-white/82"
          }`}
        >
          <span
            className={`grid size-12 place-items-center rounded-full border transition group-hover:scale-105 ${
              card.label === "Accessories"
                ? "border-white bg-white text-[#050505]"
                : "border-white/20 bg-black/20 text-white"
            }`}
          >
            <ArrowRight size={18} />
          </span>
          {card.label === "Accessories" ? "Explore" : ""}
        </span>
      </div>
    </Link>
  );
}
