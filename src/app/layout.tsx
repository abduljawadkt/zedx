import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
import { StructuredData } from "@/components/seo/StructuredData";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "ZEDX",
  creator: "ZEDX",
  publisher: "ZEDX",
  title: {
    default: "ZEDX Premium Tech",
    template: "%s | ZEDX Premium Tech",
  },
  description:
    "Shop premium ZEDX audio, fast charging, wearables, car mounts, cables, and refined everyday tech accessories.",
  keywords: [
    "ZEDX",
    "premium tech accessories",
    "wireless earbuds",
    "power banks",
    "fast chargers",
    "smart watches",
    "car mounts",
    "charging cables",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "ZEDX Premium Tech",
    title: "ZEDX Premium Tech",
    description:
      "Premium audio, power, wearables, mounts, cables, and everyday tech accessories in a cinematic ecommerce experience.",
    url: "/",
    images: ["/brand/zedx-logo-transparent.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZEDX Premium Tech",
    description:
      "Premium audio, power, wearables, mounts, cables, and everyday tech accessories.",
    images: ["/brand/zedx-logo-transparent.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ZEDX",
  url: siteUrl,
  logo: absoluteUrl("/brand/zedx-logo-transparent.png"),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ZEDX Premium Tech",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/products?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    try {
      var theme = window.localStorage.getItem("zedx-theme");
      if (theme === "light" || theme === "dark") {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
      }
    } catch (_) {}
  `;

  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <StructuredData data={[organizationJsonLd, websiteJsonLd]} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
