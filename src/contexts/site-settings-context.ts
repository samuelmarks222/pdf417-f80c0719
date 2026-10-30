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
  site_tagline: "",
  logo_url: "",
  favicon_url: "",
  meta_title: "USA DL PDF417 Barcode Generator | U.S. Driver's License Barcodes",
  meta_description: "Generate and download PDF417 barcode images for U.S. driver's license formats. Explore supported barcode formats and create downloadable barcode images with our online USA DL PDF417 barcode generator.",
  meta_keywords: "PDF417 barcode generator, USA DL barcode generator, U.S. driver's license barcode, USA driver's license PDF417, PDF417 barcode generator USA, driver's license barcode format, AAMVA PDF417 standard, PDF417 barcode image generator, DL barcode scanner, PDF417 PNG generator",
  canonical_url: "https://pdf417.live",
  meta_robots: "index,follow",
  og_image_url: "",
  twitter_handle: "",
  hero_badge: "PDF417 BARCODE GENERATOR · USA & CANADA",
  hero_title: "PDF417 barcode generator",
  hero_highlight: "for USA & Canada.",
  hero_description: "Create PDF417 barcode previews for AAMVA and U.S. state formats. Review your fields, explore state-specific formats, and export a PNG for educational and testing use.",
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
