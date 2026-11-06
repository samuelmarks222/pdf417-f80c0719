import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { SiteSettingsContext, defaultSiteSettings } from "@/contexts/site-settings-context";

function setMeta(attribute: "name" | "property", key: string, value: string) {
  const elements = Array.from(document.head.querySelectorAll<HTMLMetaElement>(`meta[${attribute}="${key}"]`));
  let element = elements[0];
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  elements.slice(1).forEach((duplicate) => duplicate.remove());
  element.content = value;
}

function removeMeta(attribute: "name" | "property", key: string) {
  document.head.querySelectorAll<HTMLMetaElement>(`meta[${attribute}="${key}"]`).forEach((element) => element.remove());
}

const routeMetadata: Record<string, { title: string; description: string; keywords: string; robots: string }> = {
  "/generator": {
    title: "PDF417 Barcode Generator | AAMVA & U.S. State Formats",
    description: "Create PDF417 barcode previews for AAMVA and U.S. state formats, review structured fields, and export PNG images for educational and testing workflows.",
    keywords: "PDF417 generator, AAMVA PDF417 generator, state barcode generator, driver license barcode testing, PDF417 PNG",
    robots: "index,follow",
  },
  "/states": {
    title: "U.S. State PDF417 Barcode Formats | AAMVA Revisions",
    description: "Browse available U.S. state, District of Columbia, Canadian province, and territory PDF417 formats before opening the barcode generator.",
    keywords: "state PDF417 formats, AAMVA state barcode formats, U.S. driver license barcode formats, PDF417 revisions",
    robots: "index,follow",
  },
  "/features": {
    title: "PDF417 Barcode Generator Features | Fields, Preview & PNG",
    description: "PDF417.LIVE is a fast and easy-to-use online PDF417 barcode generator for US Driver’s Licenses, designed to create AAMVA-compliant PDF417 barcodes with accurate formatting and reliable results.",
    keywords: "PDF417 barcode features, AAMVA fields, barcode preview, Code 128 generator, PNG barcode export",
    robots: "index,follow",
  },
  "/account": {
    title: "Account & Credits | PDF417.LIVE",
    description: "Manage your PDF417.LIVE account, credits, payments, and barcode generation history.",
    keywords: "PDF417 account, barcode generator credits",
    robots: "noindex,nofollow",
  },
  "/admin": {
    title: "Admin Dashboard | PDF417.LIVE",
    description: "Private administration dashboard for PDF417.LIVE.",
    keywords: "",
    robots: "noindex,nofollow",
  },
};

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const location = useLocation();

  const refresh = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setErrorMessage("Supabase is not configured.");
      return false;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("site_name,site_tagline,logo_url,favicon_url,meta_title,meta_description,meta_keywords,canonical_url,meta_robots,og_image_url,twitter_handle,hero_badge,hero_title,hero_highlight,hero_description,footer_notice")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      console.error("Could not load site settings:", error.message);
      setErrorMessage(error.message);
      setLoading(false);
      return false;
    }
    if (!data) {
      const message = "Site settings have not been initialized.";
      console.error(message);
      setErrorMessage(message);
      setLoading(false);
      return false;
    }
    setSettings({ ...defaultSiteSettings, ...data });
    setErrorMessage(null);
    setLoading(false);
    return true;
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const metadata = routeMetadata[location.pathname] ?? {
      title: settings.meta_title || settings.site_name,
      description: settings.meta_description,
      keywords: settings.meta_keywords,
      robots: "noindex,nofollow",
    };
    const pageTitle = location.pathname === "/" ? settings.meta_title || settings.site_name : metadata.title;
    const pageDescription = location.pathname === "/" ? settings.meta_description : metadata.description;
    const pageKeywords = location.pathname === "/" ? settings.meta_keywords : metadata.keywords;
    const pageRobots = location.pathname === "/" ? settings.meta_robots : metadata.robots;
    const socialTitle = location.pathname === "/" ? "PDF417.LIVE – Online US Driver's License Barcode Generator" : pageTitle;
    const socialDescription = location.pathname === "/"
      ? "Create PDF417 barcode images online with PDF417.LIVE. A simple and convenient platform for generating standardized PDF417 AAMVA barcode formats."
      : pageDescription;

    document.title = pageTitle;
    setMeta("name", "description", pageDescription);
    setMeta("name", "keywords", pageKeywords);
    setMeta("name", "author", "PDF417.LIVE");
    setMeta("name", "robots", pageRobots);
    setMeta("property", "og:title", socialTitle);
    setMeta("property", "og:description", socialDescription);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", settings.site_name);
    setMeta("property", "og:url", new URL(location.pathname, `${settings.canonical_url.replace(/\/+$/, "")}/`).href);
    if (settings.og_image_url) setMeta("property", "og:image", settings.og_image_url);
    else removeMeta("property", "og:image");
    setMeta("name", "twitter:card", settings.og_image_url ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", location.pathname === "/" ? "PDF417.LIVE – PDF417 Barcode Generator USA" : pageTitle);
    setMeta("name", "twitter:description", location.pathname === "/"
      ? "Generate PDF417 barcode images online with a simple and convenient platform."
      : pageDescription);
    if (settings.twitter_handle) setMeta("name", "twitter:site", settings.twitter_handle);
    else removeMeta("name", "twitter:site");
    if (settings.og_image_url) setMeta("name", "twitter:image", settings.og_image_url);
    else removeMeta("name", "twitter:image");

    const canonicalLinks = Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));
    let canonical = canonicalLinks[0];
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonicalLinks.slice(1).forEach((link) => link.remove());
    canonical.href = new URL(location.pathname, `${settings.canonical_url.replace(/\/+$/, "")}/`).href;

    const faviconUrl = settings.favicon_url || "/favicon.svg";
    const iconLinks = Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'));
    const icon = iconLinks[0] ?? document.createElement("link");
    if (!iconLinks.length) {
      document.head.appendChild(icon);
    }
    icon.rel = "icon";
    icon.href = faviconUrl;
    iconLinks.slice(1).forEach((link) => link.remove());
  }, [location.pathname, settings]);

  const value = useMemo(
    () => ({ settings, loading, error: errorMessage, refresh }),
    [settings, loading, errorMessage, refresh],
  );
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}
