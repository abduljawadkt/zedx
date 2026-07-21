import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "ZEDX Premium Tech",
    template: "%s | ZEDX Premium Tech",
  },
  description:
    "Explore premium ZEDX audio, power, wearables, tablets, mounts, cables, and everyday tech accessories.",
  openGraph: {
    images: ["/brand/zedx-logo-transparent.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} data-scroll-behavior="smooth">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
