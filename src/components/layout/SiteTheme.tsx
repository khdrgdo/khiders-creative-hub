import { useEffect } from "react";
import { useLiveSettings } from "@/lib/content-store";
import { applySiteColors, resolveSiteColors } from "@/lib/site-theme";

export function SiteTheme() {
  const settings = useLiveSettings();
  useEffect(() => {
    applySiteColors(resolveSiteColors(settings), document.documentElement);
  }, [settings]);
  return null;
}