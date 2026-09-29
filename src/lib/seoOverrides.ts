// Manual SEO overrides — the SINGLE source of truth for hand-written meta
// titles and descriptions across the site. Fill this in from the SEO content
// sheet. Anything not listed here automatically falls back to the site's
// auto-generated meta, so partial coverage is completely fine.
//
// Keys are "<type>:<key>":
//   product:<handle>      e.g. "product:zedx-at-24-ultra-watch"
//   category:<handle>     e.g. "category:audio"
//   collection:<handle>   e.g. "collection:power"
//   page:<path>           e.g. "page:/"  or  "page:/about"
//
// Best practice: titles ~50–60 characters, descriptions ~150–160 characters.

export type SeoOverride = {
  title?: string;
  description?: string;
};

export type SeoOverrideType = "product" | "category" | "collection" | "page";

export const seoOverrides: Record<string, SeoOverride> = {
  // ---- Filled from the SEO content sheet ----
  // "product:zedx-at-24-ultra-watch": {
  //   title: "ZEDX AT24 Ultra Smart Watch — Buy Online in UAE",
  //   description: "Shop the ZEDX AT24 Ultra smart watch in Dubai & UAE ...",
  // },
};

export function getSeoOverride(type: SeoOverrideType, key: string): SeoOverride | undefined {
  return seoOverrides[`${type}:${key}`];
}
