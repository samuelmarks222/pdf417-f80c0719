import { useContext } from "react";
import { SiteSettingsContext } from "@/contexts/site-settings-context";

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
