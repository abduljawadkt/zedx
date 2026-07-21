"use client";

import { useMemo, useState, type ReactNode } from "react";
import { RefreshCw, Save, Settings2, FileSearch, PanelsTopLeft, FolderTree, Boxes, Image as ImageIcon, Link2, Sparkles } from "lucide-react";
import type { Category, Collection, HomepageSection, Product } from "@/lib/backend/types";

type SiteSettings = Awaited<ReturnType<typeof import("@/lib/backend/catalog").getSiteSettings>>;
type OrderSummary = Awaited<ReturnType<typeof import("@/lib/backend/repository").getOrders>>[number];

type Props = {
  categories: Category[];
  collections: Collection[];
  homepageSections: HomepageSection[];
  products: Product[];
  siteSettings: SiteSettings;
};

type TabKey = "products" | "categories" | "collections" | "orders" | "homepage" | "seo" | "redirects" | "media" | "settings";

const tabs: Array<{ key: TabKey; label: string; icon: ReactNode }> = [
  { key: "products", label: "Products", icon: <Boxes size={16} /> },
  { key: "categories", label: "Categories", icon: <FolderTree size={16} /> },
  { key: "collections", label: "Collections", icon: <PanelsTopLeft size={16} /> },
  { key: "orders", label: "Orders", icon: <Boxes size={16} /> },
  { key: "homepage", label: "Homepage", icon: <Sparkles size={16} /> },
  { key: "seo", label: "SEO", icon: <FileSearch size={16} /> },
  { key: "redirects", label: "Redirects", icon: <Link2 size={16} /> },
  { key: "media", label: "Media", icon: <ImageIcon size={16} /> },
  { key: "settings", label: "Settings", icon: <Settings2 size={16} /> },
];

function toJson<T>(value: T) {
  return JSON.stringify(value);
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}

export function AdminConsole({ categories, collections, homepageSections, products, siteSettings }: Props) {
  const [tab, setTab] = useState<TabKey>("products");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(products[0] ?? null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] ?? null);
  const [selectedCollection, setSelectedCollection] = useState(collections[0] ?? null);
  const [selectedSection, setSelectedSection] = useState(homepageSections[0] ?? null);
  const [seoSlug, setSeoSlug] = useState(products[0]?.slug ?? "");
  const [seoType, setSeoType] = useState<"product" | "category" | "collection">("product");
  const [seoDraft, setSeoDraft] = useState({
    title: siteSettings.seo.title,
    description: siteSettings.seo.description,
    openGraphImage: siteSettings.seo.openGraphImage ?? "",
    canonicalPath: siteSettings.seo.canonicalPath,
    robots: siteSettings.seo.robots,
  });
  const [settingsDraft, setSettingsDraft] = useState(siteSettings);
  const [redirectFrom, setRedirectFrom] = useState("");
  const [redirectTo, setRedirectTo] = useState("");
  const [mediaDraft, setMediaDraft] = useState({ url: "", alt: "", width: "", height: "", mimeType: "", sortOrder: "0", owner: "" });
  const [orders, setOrders] = useState<OrderSummary[]>([]);

  const counts = useMemo(
    () => [
      { label: "Products", value: products.length },
      { label: "Categories", value: categories.length },
      { label: "Collections", value: collections.length },
      { label: "Sections", value: homepageSections.length },
    ],
    [categories.length, collections.length, homepageSections.length, products.length],
  );

  async function saveProduct() {
    if (!selectedProduct) return;
    setBusy(true);
    setMessage(null);
    try {
      await api("/api/admin/products/" + selectedProduct.slug, {
        method: "PATCH",
        body: toJson({
          name: selectedProduct.name,
          slug: selectedProduct.slug,
          category: selectedProduct.category,
          categorySlug: selectedProduct.categorySlug,
          collection: selectedProduct.collection,
          price: selectedProduct.price,
          oldPrice: selectedProduct.oldPrice,
          currency: selectedProduct.currency,
          badge: selectedProduct.badge,
          color: selectedProduct.color,
          image: selectedProduct.image,
          gallery: selectedProduct.gallery,
          shortDescription: selectedProduct.shortDescription,
          description: selectedProduct.description,
          specs: selectedProduct.specs,
          highlights: selectedProduct.highlights,
          published: true,
        }),
      });
      setMessage("Product saved.");
    } finally {
      setBusy(false);
    }
  }

  async function saveCategory() {
    if (!selectedCategory) return;
    setBusy(true);
    setMessage(null);
    try {
      await api("/api/admin/categories/" + selectedCategory.slug, { method: "PATCH", body: toJson(selectedCategory) });
      setMessage("Category saved.");
    } finally {
      setBusy(false);
    }
  }

  async function saveCollection() {
    if (!selectedCollection) return;
    setBusy(true);
    setMessage(null);
    try {
      await api("/api/admin/collections/" + selectedCollection.slug, { method: "PATCH", body: toJson(selectedCollection) });
      setMessage("Collection saved.");
    } finally {
      setBusy(false);
    }
  }

  async function saveHomepageSection() {
    if (!selectedSection) return;
    setBusy(true);
    setMessage(null);
    try {
      await api("/api/admin/homepage-sections/" + selectedSection.id, { method: "PATCH", body: toJson(selectedSection) });
      setMessage("Homepage section saved.");
    } finally {
      setBusy(false);
    }
  }

  async function saveSeo() {
    setBusy(true);
    setMessage(null);
    try {
      await api(`/api/admin/seo/${seoType}/${seoSlug}`, { method: "PATCH", body: toJson(seoDraft) });
      setMessage("SEO saved.");
    } finally {
      setBusy(false);
    }
  }

  async function saveRedirect() {
    setBusy(true);
    setMessage(null);
    try {
      await api("/api/admin/redirects", { method: "POST", body: toJson({ from: redirectFrom, to: redirectTo, status: 301 }) });
      setMessage("Redirect created.");
    } finally {
      setBusy(false);
    }
  }

  async function saveMedia() {
    setBusy(true);
    setMessage(null);
    try {
      await api("/api/admin/media", {
        method: "POST",
        body: toJson({
          url: mediaDraft.url,
          alt: mediaDraft.alt,
          width: mediaDraft.width ? Number(mediaDraft.width) : undefined,
          height: mediaDraft.height ? Number(mediaDraft.height) : undefined,
          mimeType: mediaDraft.mimeType || undefined,
          sortOrder: Number(mediaDraft.sortOrder || 0),
          owner: mediaDraft.owner || undefined,
        }),
      });
      setMessage("Media asset saved.");
    } finally {
      setBusy(false);
    }
  }

  async function saveSettings() {
    setBusy(true);
    setMessage(null);
    try {
      await api("/api/admin/site-settings", { method: "PATCH", body: toJson(settingsDraft) });
      setMessage("Site settings saved.");
    } finally {
      setBusy(false);
    }
  }

  async function loadOrders() {
    setBusy(true);
    setMessage(null);
    try {
      const data = await api<OrderSummary[]>("/api/admin/orders");
      setOrders(data);
      setMessage("Orders loaded.");
    } finally {
      setBusy(false);
    }
  }

  async function updateOrderStatus(orderNumber: string, status: OrderSummary["status"]) {
    setBusy(true);
    setMessage(null);
    try {
      await api(`/api/admin/orders/${orderNumber}`, { method: "PATCH", body: toJson({ status }) });
      await loadOrders();
      setMessage(`Order ${orderNumber} updated.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl pb-16 pt-4 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Catalog operations console</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {counts.map((item) => (
            <span key={item.label} className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
              {item.label}: {item.value}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
              tab === item.key ? "bg-white text-[#050505]" : "text-white/66 hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {message && (
        <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {message}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.42fr_1fr]">
        <aside className="space-y-3">
          <Panel title="Records" subtitle="Select one item to edit." icon={<Boxes size={16} />}>
            {tab === "products" && products.map((product) => (
              <button key={product.id} type="button" onClick={() => setSelectedProduct(product)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm">
                {product.name}
              </button>
            ))}
            {tab === "categories" && categories.map((item) => (
              <button key={item.slug} type="button" onClick={() => setSelectedCategory(item)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm">
                {item.name}
              </button>
            ))}
            {tab === "collections" && collections.map((item) => (
              <button key={item.slug} type="button" onClick={() => setSelectedCollection(item)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm">
                {item.name}
              </button>
            ))}
            {tab === "homepage" && homepageSections.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelectedSection(item)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm">
                {item.title}
              </button>
            ))}
            {tab === "seo" && (
              <div className="space-y-3">
                <select value={seoType} onChange={(e) => setSeoType(e.target.value as typeof seoType)} className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4">
                  <option value="product">Product</option>
                  <option value="category">Category</option>
                  <option value="collection">Collection</option>
                </select>
                <input value={seoSlug} onChange={(e) => setSeoSlug(e.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4" placeholder="slug" />
              </div>
            )}
          </Panel>
        </aside>

        <section className="space-y-6">
          {tab === "products" && selectedProduct && (
            <EditorShell title="Product editor" icon={<Boxes size={16} />} onSave={saveProduct} busy={busy}>
              <TextField label="Name" value={selectedProduct.name} onChange={(value) => setSelectedProduct({ ...selectedProduct, name: value })} />
              <TextField label="Slug" value={selectedProduct.slug} onChange={(value) => setSelectedProduct({ ...selectedProduct, slug: value })} />
              <TextField label="Category" value={selectedProduct.category} onChange={(value) => setSelectedProduct({ ...selectedProduct, category: value })} />
              <TextField label="Collection" value={selectedProduct.collection} onChange={(value) => setSelectedProduct({ ...selectedProduct, collection: value })} />
              <TextField label="Price" value={String(selectedProduct.price)} onChange={(value) => setSelectedProduct({ ...selectedProduct, price: Number(value) || 0 })} />
              <TextField label="Old price" value={String(selectedProduct.oldPrice)} onChange={(value) => setSelectedProduct({ ...selectedProduct, oldPrice: Number(value) || 0 })} />
              <TextField label="Image" value={selectedProduct.image} onChange={(value) => setSelectedProduct({ ...selectedProduct, image: value })} />
              <TextArea label="Short description" value={selectedProduct.shortDescription} onChange={(value) => setSelectedProduct({ ...selectedProduct, shortDescription: value })} />
              <TextArea label="Description" value={selectedProduct.description} onChange={(value) => setSelectedProduct({ ...selectedProduct, description: value })} />
            </EditorShell>
          )}

          {tab === "categories" && selectedCategory && (
            <EditorShell title="Category editor" icon={<FolderTree size={16} />} onSave={saveCategory} busy={busy}>
              <TextField label="Name" value={selectedCategory.name} onChange={(value) => setSelectedCategory({ ...selectedCategory, name: value })} />
              <TextField label="Slug" value={selectedCategory.slug} onChange={(value) => setSelectedCategory({ ...selectedCategory, slug: value })} />
              <TextField label="Description" value={selectedCategory.description} onChange={(value) => setSelectedCategory({ ...selectedCategory, description: value })} />
              <TextField label="Collection" value={selectedCategory.collection} onChange={(value) => setSelectedCategory({ ...selectedCategory, collection: value })} />
              <TextField label="Image" value={selectedCategory.image} onChange={(value) => setSelectedCategory({ ...selectedCategory, image: value })} />
            </EditorShell>
          )}

          {tab === "collections" && selectedCollection && (
            <EditorShell title="Collection editor" icon={<PanelsTopLeft size={16} />} onSave={saveCollection} busy={busy}>
              <TextField label="Name" value={selectedCollection.name} onChange={(value) => setSelectedCollection({ ...selectedCollection, name: value })} />
              <TextField label="Slug" value={selectedCollection.slug} onChange={(value) => setSelectedCollection({ ...selectedCollection, slug: value })} />
              <TextField label="Description" value={selectedCollection.description} onChange={(value) => setSelectedCollection({ ...selectedCollection, description: value })} />
              <TextField label="Image" value={selectedCollection.image} onChange={(value) => setSelectedCollection({ ...selectedCollection, image: value })} />
            </EditorShell>
          )}

          {tab === "homepage" && selectedSection && (
            <EditorShell title="Homepage section" icon={<Sparkles size={16} />} onSave={saveHomepageSection} busy={busy}>
              <TextField label="Title" value={selectedSection.title} onChange={(value) => setSelectedSection({ ...selectedSection, title: value })} />
              <TextField label="Sort order" value={String(selectedSection.sortOrder)} onChange={(value) => setSelectedSection({ ...selectedSection, sortOrder: Number(value) || 0 })} />
            </EditorShell>
          )}

          {tab === "orders" && (
            <EditorShell title="Orders" icon={<Boxes size={16} />} onSave={loadOrders} busy={busy}>
              <div className="md:col-span-2">
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <p className="text-sm text-white/55">Load orders to review lifecycle status and payment state.</p>
                  ) : orders.map((order) => (
                    <div key={order.orderNumber} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{order.orderNumber}</p>
                          <p className="text-xs text-white/55">{order.customerName} · {order.email}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(["pending", "paid", "processing", "fulfilled", "cancelled"] as const).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => updateOrderStatus(order.orderNumber, status)}
                              className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                                order.status === status ? "bg-white text-[#050505]" : "border border-white/10 text-white/60"
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-white/65">AED {order.total} · {order.paymentMethod} · {order.items.length} items</p>
                    </div>
                  ))}
                </div>
              </div>
            </EditorShell>
          )}

          {tab === "seo" && (
            <EditorShell title="SEO editor" icon={<FileSearch size={16} />} onSave={saveSeo} busy={busy}>
              <TextField label="Title" value={seoDraft.title} onChange={(value) => setSeoDraft({ ...seoDraft, title: value })} />
              <TextArea label="Description" value={seoDraft.description} onChange={(value) => setSeoDraft({ ...seoDraft, description: value })} />
              <TextField label="Open graph image" value={seoDraft.openGraphImage} onChange={(value) => setSeoDraft({ ...seoDraft, openGraphImage: value })} />
              <TextField label="Canonical path" value={seoDraft.canonicalPath} onChange={(value) => setSeoDraft({ ...seoDraft, canonicalPath: value })} />
            </EditorShell>
          )}

          {tab === "redirects" && (
            <EditorShell title="Redirects" icon={<Link2 size={16} />} onSave={saveRedirect} busy={busy}>
              <TextField label="From" value={redirectFrom} onChange={setRedirectFrom} />
              <TextField label="To" value={redirectTo} onChange={setRedirectTo} />
            </EditorShell>
          )}

          {tab === "media" && (
            <EditorShell title="Media asset" icon={<ImageIcon size={16} />} onSave={saveMedia} busy={busy}>
              <TextField label="URL" value={mediaDraft.url} onChange={(value) => setMediaDraft({ ...mediaDraft, url: value })} />
              <TextField label="Alt" value={mediaDraft.alt} onChange={(value) => setMediaDraft({ ...mediaDraft, alt: value })} />
              <TextField label="Width" value={mediaDraft.width} onChange={(value) => setMediaDraft({ ...mediaDraft, width: value })} />
              <TextField label="Height" value={mediaDraft.height} onChange={(value) => setMediaDraft({ ...mediaDraft, height: value })} />
            </EditorShell>
          )}

          {tab === "settings" && (
            <EditorShell title="Site settings" icon={<Settings2 size={16} />} onSave={saveSettings} busy={busy}>
              <TextField label="Brand name" value={settingsDraft.brandName} onChange={(value) => setSettingsDraft({ ...settingsDraft, brandName: value })} />
              <TextField label="Tagline" value={settingsDraft.tagline} onChange={(value) => setSettingsDraft({ ...settingsDraft, tagline: value })} />
              <TextField label="Announcement" value={settingsDraft.announcement} onChange={(value) => setSettingsDraft({ ...settingsDraft, announcement: value })} />
              <TextField label="Currency" value={settingsDraft.currency} onChange={(value) => setSettingsDraft({ ...settingsDraft, currency: value })} />
            </EditorShell>
          )}
        </section>
      </div>
    </div>
  );
}

function EditorShell({ title, icon, onSave, busy, children }: { title: string; icon: ReactNode; onSave: () => Promise<void>; busy: boolean; children: ReactNode; }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[#00a0e3]/15 text-[var(--brand-blue-soft)]">{icon}</span>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <button onClick={onSave} disabled={busy} type="button" className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#050505] disabled:opacity-60">
          {busy ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          Save
        </button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Panel({ title, subtitle, icon, children }: { title: string; subtitle: string; icon: ReactNode; children: ReactNode; }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-[#00a0e3]/15 text-[var(--brand-blue-soft)]">{icon}</span>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-white/55">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">{children}</div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void; }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/24 px-4 text-sm text-white outline-none" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void; }) {
  return (
    <label className="block md:col-span-2">
      <span className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-black/24 px-4 py-3 text-sm text-white outline-none" />
    </label>
  );
}
