import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { SiteSettingsContext, defaultSiteSettings } from "@/contexts/site-settings-context";

function setMeta(attribute: "name" | "property", key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

function removeMeta(attribute: "name" | "property", key: string) {
  document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)?.remove();
}

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
    document.title = settings.meta_title || settings.site_name;
    setMeta("name", "description", settings.meta_description);
    setMeta("name", "keywords", settings.meta_keywords);
    setMeta("name", "robots", settings.meta_robots);
    setMeta("property", "og:title", settings.meta_title || settings.site_name);
    setMeta("property", "og:description", settings.meta_description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", settings.site_name);
    setMeta("property", "og:url", new URL(location.pathname, `${settings.canonical_url.replace(/\/+$/, "")}/`).href);
    if (settings.og_image_url) setMeta("property", "og:image", settings.og_image_url);
    else removeMeta("property", "og:image");
    setMeta("name", "twitter:card", settings.og_image_url ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", settings.meta_title || settings.site_name);
    setMeta("name", "twitter:description", settings.meta_description);
    if (settings.twitter_handle) setMeta("name", "twitter:site", settings.twitter_handle);
    else removeMeta("name", "twitter:site");
    if (settings.og_image_url) setMeta("name", "twitter:image", settings.og_image_url);
    else removeMeta("name", "twitter:image");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = new URL(location.pathname, `${settings.canonical_url.replace(/\/+$/, "")}/`).href;

    const faviconUrl = settings.favicon_url || "/favicon.ico";
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
