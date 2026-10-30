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
  site_name: "PDF417.LIVE",
  site_tagline: "",
  logo_url: "",
  favicon_url: "",
  meta_title: "PDF417 Barcode Generator for USA & Canada | PDF417.LIVE",
  meta_description: "Create and download PDF417 and Code 128 barcodes for U.S. driver's licenses and Canadian licence formats. Explore state, province, and territory barcode tools online.",
  meta_keywords: "PDF417 barcode generator, USA driver's license barcode generator, U.S. DL PDF417, AAMVA PDF417 barcode, state driver's license barcode, Canada driver's licence barcode, Canadian DL barcode generator, Canadian province barcode, Canadian territory barcode, Alberta PDF417, Manitoba PDF417, Ontario PDF417, Quebec PDF417, Saskatchewan PDF417, Yukon PDF417, Code 128 barcode generator, PDF417 barcode image, PDF417 PNG download",
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
