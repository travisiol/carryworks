import type { MetadataRoute } from "next";
import { MARKETS } from "@/data/markets";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  return [
    { url: base, priority: 1 },
    { url: `${base}/markets`, priority: 0.8 },
    { url: `${base}/launch`, priority: 0.8 },
    ...MARKETS.map((m) => ({
      url: `${base}/market/${m.vault}`,
      priority: 0.5,
    })),
  ];
}
