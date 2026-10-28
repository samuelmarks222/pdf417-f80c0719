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
  meta_title: "PDF417 Pro | Barcode Workspace",
  meta_description: "A focused workspace for creating PDF417 and Code 128 barcodes with state-aware fields, useful helpers, and clear credit controls.",
  meta_keywords: "PDF417, barcode generator, Code 128, barcode workspace",
  canonical_url: "https://pdf417.live",
  meta_robots: "index,follow",
  og_image_url: "",
  twitter_handle: "",
  hero_badge: "A PRACTICAL BARCODE WORKSPACE",
  hero_title: "Build, preview, and download",
  hero_highlight: "in one place.",
  hero_description: "A focused workspace for creating PDF417 and Code 128 barcodes with state-aware fields, useful helpers, and clear credit controls.",
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
