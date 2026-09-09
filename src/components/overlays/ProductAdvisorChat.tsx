"use client";

import Link from "next/link";
import { Headset, MessageCircle, Send, ShoppingBag, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { type Product } from "@/data/products";
import { formatCategoryName, formatProductName } from "@/lib/productDisplay";

type ChatMessage = {
  id: number;
  productIds?: string[];
  role: "assistant" | "user";
  text: string;
};

type SupportDraft = {
  message: string;
  name: string;
  phone: string;
};

const supportWhatsAppNumber = "971524371450";

const quickPrompts = [
  "Best audio combo",
  "Travel charging setup",
  "Work desk essentials",
  "Gift under AED 150",
];

function getRecommendations(prompt: string, products: Product[]) {
  const normalized = prompt.toLowerCase();
  let matches: Product[];
  let intro: string;

  if (normalized.includes("audio") || normalized.includes("earbud") || normalized.includes("music")) {
    matches = products.filter((product) =>
      ["earpods", "speakers", "over-heads", "wired-headphones", "neck-band"].includes(product.categorySlug),
    );
    intro = "For audio, I would compare comfort, call clarity, and bass profile. These three cover private listening, open-ear comfort, and room sound.";
  } else if (normalized.includes("travel") || normalized.includes("charging") || normalized.includes("power")) {
    matches = products.filter((product) =>
      ["power-banks", "chargers", "charging-cables", "adapters", "car-chargers"].includes(product.categorySlug),
    );
    intro = "For travel, build around one powerbank, one fast wall charger, and one reliable cable so the setup stays compact.";
  } else if (normalized.includes("desk") || normalized.includes("work") || normalized.includes("office")) {
    matches = products.filter((product) =>
      ["car-holders", "charging-cables", "chargers", "smart-watches"].includes(product.categorySlug),
    );
    intro = "For a work desk, I would prioritize charging, visibility, and quick-access wearables without cluttering the surface.";
  } else if (normalized.includes("gift") || normalized.includes("150") || normalized.includes("budget")) {
    matches = products.filter((product) => product.price <= 150);
    intro = "For gifting under AED 150, these are easy to understand, practical, and still feel premium.";
  } else {
    matches = products.filter((product) =>
      ["Best Seller", "New", "Fast Charge", "Premium"].includes(product.badge),
    );
    intro = "A balanced recommendation should include one audio product, one power product, and one daily accessory. Here is a strong mixed set.";
  }

  const recommendations = matches.slice(0, 3);

  return {
    text: intro,
    productIds: recommendations.map((product) => product.id),
  };
}

export function ProductAdvisorChat() {
  const { addToCart } = useCommerce();
  const { products, productById } = useCatalog();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [supportMode, setSupportMode] = useState(false);
  const [supportDraft, setSupportDraft] = useState<SupportDraft>({
    message: "",
    name: "",
    phone: "",
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hi, I am the ZEDX product advisor. Tell me your use case and I will compare products that fit your setup.",
      productIds: products.slice(0, 3).map((product) => product.id),
    },
  ]);

  const recommendedProductsById = productById;

  function sendPrompt(prompt: string) {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    setSupportMode(false);
    const answer = getRecommendations(cleanPrompt, products);
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text: cleanPrompt },
      {
        id: Date.now() + 1,
        role: "assistant",
        text: answer.text,
        productIds: answer.productIds,
      },
    ]);
    setInput("");
    setOpen(true);
  }

  function openSupportMode() {
    setOpen(true);
    setSupportMode(true);
  }

  function updateSupportDraft(field: keyof SupportDraft, value: string) {
    setSupportDraft((current) => ({ ...current, [field]: value }));
  }

  function submitSupportRequest() {
    const name = supportDraft.name.trim();
    const phone = supportDraft.phone.trim();
    const message = supportDraft.message.trim();

    if (!name || !phone || !message) return;

    const whatsappMessage = [
      "ZEDX Customer Support Request",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Message: ${message}`,
      "",
      "Source: Website product advisor chat",
    ].join("\n");

    window.open(
      `https://wa.me/${supportWhatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank",
      "noopener,noreferrer",
    );

    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text: "Customer support request" },
      {
        id: Date.now() + 1,
        role: "assistant",
        text: "I prepared your support message for WhatsApp. Please review and send it to the official ZEDX support number.",
      },
    ]);
  }

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open ZEDX product advisor chatbot"
        className="fixed bottom-4 right-4 z-[70] grid size-12 place-items-center rounded-full border border-[#ffffff26] bg-[#00a0e3] text-white shadow-2xl shadow-[#00a0e3]/30 transition hover:scale-105 active:scale-95 sm:bottom-5 sm:right-5 sm:size-16"
        onClick={() => setOpen(true)}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.96 }}
      >
        <Headset className="size-5 sm:size-[27px]" />
        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-[#050505] sm:size-6">
          <Sparkles size={13} />
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="ZEDX product advisor"
            className="fixed bottom-20 right-3 z-[82] flex max-h-[calc(100svh-6rem)] w-[calc(100vw-1.5rem)] max-w-[28rem] flex-col overflow-hidden rounded-[1.35rem] border border-[#ffffff1a] bg-[#08080a]/94 shadow-2xl shadow-[#00000080] backdrop-blur-2xl sm:bottom-24 sm:right-5 sm:w-[calc(100vw-2rem)] sm:rounded-[2rem]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 190, damping: 24 }}
          >
            <div className="border-b border-[#ffffff1a] bg-[#ffffff0a] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-[#00a0e3] text-white">
                    <Headset size={21} />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-white">ZEDX Advisor</h2>
                    <p className="text-xs text-[#ffffff73]">Product recommendations</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close product advisor"
                  className="grid size-10 place-items-center rounded-full border border-[#ffffff1a] text-white"
                  onClick={() => setOpen(false)}
                >
                  <X size={17} />
                </button>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#00a0e3]/55 bg-[#00a0e3]/14 px-4 py-2 text-xs font-semibold text-[var(--brand-blue-soft)] transition hover:bg-[#00a0e3] hover:text-white"
                  onClick={openSupportMode}
                >
                  <MessageCircle size={14} />
                  Customer Support
                </button>
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="shrink-0 rounded-full border border-[#ffffff1a] px-4 py-2 text-xs font-semibold text-[#ffffffb3] transition hover:border-[#00a0e3]/60 hover:text-white"
                    onClick={() => sendPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-auto p-5">
              {messages.map((message) => {
                const messageProducts = message.productIds
                  ?.map((id) => recommendedProductsById.get(id))
                  .filter(Boolean) as Product[] | undefined;

                return (
                  <div
                    key={message.id}
                    className={message.role === "user" ? "ml-auto max-w-[82%]" : "max-w-full"}
                  >
                    <div
                      className={`rounded-[1.35rem] px-4 py-3 text-sm leading-6 ${
                        message.role === "user"
                          ? "bg-[#00a0e3] text-white"
                          : "border border-[#ffffff1a] bg-[#ffffff0b] text-[#ffffffb3]"
                      }`}
                    >
                      {message.text}
                    </div>
                    {messageProducts && messageProducts.length > 0 && (
                      <div className="mt-3 grid gap-3">
                        {messageProducts.map((product) => (
                          <div
                            key={product.id}
                            className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-[1.25rem] border border-[#ffffff1a] bg-[#ffffff09] p-3"
                          >
                            <div className="product-stage !min-h-0 aspect-square rounded-2xl">
                              <ProductImage
                                product={product}
                                alt={`${product.name} advisor recommendation`}
                                className="!w-[70%] !drop-shadow-[0_16px_26px_rgba(15,23,42,0.22)]"
                                imageClassName="brightness-[1.03] contrast-[1.04]"
                                sizes="90px"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="line-clamp-2 text-sm font-semibold leading-5 text-white">
                                {formatProductName(product.name)}
                              </p>
                              <p className="mt-1 text-xs text-[#ffffff6b]">
                                {formatCategoryName(product.category)}
                              </p>
                              <p className="mt-2 text-sm font-semibold text-[var(--brand-blue-soft)]">
                                {product.currency} {product.price}
                              </p>
                              <div className="mt-3 flex gap-2">
                                <button
                                  type="button"
                                  className="inline-flex h-9 items-center gap-1 rounded-full bg-white px-3 text-xs font-semibold text-[#050505] transition hover:bg-[var(--brand-blue-soft)]"
                                  onClick={() => addToCart(product)}
                                >
                                  <ShoppingBag size={13} />
                                  Add
                                </button>
                                <Link
                                  href={`/products/${product.slug}`}
                                  className="inline-flex h-9 items-center rounded-full border border-[#ffffff1a] px-3 text-xs font-semibold text-[#ffffffa6] transition hover:border-[#00a0e3]/60 hover:text-white"
                                  onClick={() => setOpen(false)}
                                >
                                  Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {supportMode ? (
                <div className="rounded-[1.35rem] border border-[#00a0e3]/28 bg-[#00a0e3]/10 p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#00a0e3] text-white">
                      <MessageCircle size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Customer Support</p>
                      <p className="mt-1 text-xs leading-5 text-white/58">
                        Share your details and we will open WhatsApp with a ready message to the official ZEDX support number.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {supportMode ? (
              <form
                className="border-t border-[#ffffff1a] p-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitSupportRequest();
                }}
              >
                <div className="grid gap-2">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      value={supportDraft.name}
                      onChange={(event) => updateSupportDraft("name", event.target.value)}
                      aria-label="Customer name"
                      className="h-11 rounded-2xl border border-[#ffffff1a] bg-[#ffffff0a] px-4 text-sm text-white outline-none placeholder:text-[#ffffff4d] focus:border-[#00a0e3]/70"
                      placeholder="Your name"
                      required
                    />
                    <input
                      value={supportDraft.phone}
                      onChange={(event) => updateSupportDraft("phone", event.target.value)}
                      aria-label="Customer phone"
                      className="h-11 rounded-2xl border border-[#ffffff1a] bg-[#ffffff0a] px-4 text-sm text-white outline-none placeholder:text-[#ffffff4d] focus:border-[#00a0e3]/70"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                  <textarea
                    value={supportDraft.message}
                    onChange={(event) => updateSupportDraft("message", event.target.value)}
                    aria-label="Support message"
                    className="min-h-20 resize-none rounded-2xl border border-[#ffffff1a] bg-[#ffffff0a] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-[#ffffff4d] focus:border-[#00a0e3]/70"
                    placeholder="What do you need help with?"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="h-11 rounded-full border border-[#ffffff1a] px-4 text-xs font-semibold text-white/62 transition hover:border-white/35 hover:text-white"
                      onClick={() => setSupportMode(false)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#00a0e3] px-5 text-xs font-semibold text-white transition hover:bg-white hover:text-[#050505]"
                    >
                      <MessageCircle size={15} />
                      Send To WhatsApp
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form
                className="border-t border-[#ffffff1a] p-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  sendPrompt(input);
                }}
              >
                <div className="flex items-center gap-2 rounded-full border border-[#ffffff1a] bg-[#ffffff0a] p-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    aria-label="Product advisor message"
                    className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-[#ffffff4d]"
                    placeholder="Ask for audio, travel, desk, gift..."
                  />
                  <button
                    type="submit"
                    aria-label="Send product advisor message"
                    className="grid size-10 place-items-center rounded-full bg-[#00a0e3] text-white transition hover:bg-white hover:text-[#050505]"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
