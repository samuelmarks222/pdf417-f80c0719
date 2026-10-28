import { createContext } from "react";

export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  logo_url: string;
  favicon_url: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  meta_robots: string;
  og_image_url: string;
  twitter_handle: string;
  hero_badge: string;
  hero_title: string;
  hero_highlight: string;
  hero_description: string;
  footer_notice: string;
}

export const defaultSiteSettings: SiteSettings = {
  site_name: "PDF417.PRO",
  site_tagline: "A practical barcode workspace",
  logo_url: "",
  favicon_url: "",
  meta_title: "PDF417 Barcode Generator for USA & Canada | PDF417.PRO",
  meta_description: "Create, preview, and download PDF417 barcode images for USA and Canada workflows. Explore available U.S. state formats and generate Code 128 barcodes for free.",
  meta_keywords: "PDF417 barcode generator, USA PDF417, Canada PDF417, barcode generator, Code 128",
  canonical_url: "https://pdf417.live",
  meta_robots: "index,follow",
  og_image_url: "",
  twitter_handle: "",
  hero_badge: "PDF417 BARCODE GENERATOR · USA & CANADA",
  hero_title: "PDF417 barcode generator",
  hero_highlight: "for USA & Canada.",
  hero_description: "Create and download PDF417 barcode previews for USA and Canada workflows. Explore available U.S. state formats, review your barcode, and export a PNG.",
  footer_notice: "For educational and testing use only.",
};

export interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<boolean>;
}

export const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: defaultSiteSettings,
  loading: true,
  error: null,
  refresh: async () => false,
});
