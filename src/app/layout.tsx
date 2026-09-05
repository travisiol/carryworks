import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { chain, siteConfig } from "@/lib/site-config";

// Loaded from a runtime <link> rather than next/font/google, which downloads
// and self-hosts at BUILD time and so needs outbound access wherever
// `next build` runs.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.seoDescription,
  keywords: [
    "carry market",
    "yield vault",
    "permissionless launchpad",
    "ERC-4626",
    "performance fee",
    "tokenized assets",
    "RWA yield",
    chain.name,
  ],
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.seoDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.seoDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#06060c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={FONTS} rel="stylesheet" />
      </head>
      <body className="flex min-h-full flex-col bg-void text-hi antialiased">
        <Nav />
        {/* The mobile tab strip sits below the bar, so the offset is taller
            until md, where the strip is hidden. */}
        <main className="flex-1 pt-[calc(var(--nav-h)+37px)] md:pt-[var(--nav-h)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
