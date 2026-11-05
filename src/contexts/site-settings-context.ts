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
  meta_title: "US Driver's License Barcode Generator · PDF417.LIVE",
  meta_description: "PDF417.LIVE is a simple and powerful online PDF417 barcode generator for US Driver's Licenses. Best online PDF417 AAMVA barcode generator",
  meta_keywords: "PDF417 barcode generator, online PDF417 generator, PDF417 barcode creator, AAMVA PDF417 format, US driver's license barcode, PDF417 generator USA",
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
