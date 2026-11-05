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
  meta_title: "PDF417.LIVE – US Driver's License PDF417 Barcode Generator",
  meta_description: "PDF417.LIVE is an easy-to-use online PDF417 barcode generator for US Driver's License formats, providing a simple and convenient way to create AAMVA PDF417 barcodes.",
  meta_keywords: "PDF417, PDF417 LIVE, PDF417 barcode generator, US Driver's License barcode, online PDF417 generator, AAMVA barcode generator, PDF417 barcode creator, PDF417 generator USA, AAMVA PDF417 format",
  canonical_url: "https://pdf417.live",
  meta_robots: "index,follow",
  og_image_url: "",
  twitter_handle: "",
  hero_badge: "PDF417 BARCODE GENERATOR · USA & CANADA",
  hero_title: "Online PDF417 Barcode Generator",
  hero_highlight: "",
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
