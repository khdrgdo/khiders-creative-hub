import { useState, useEffect } from "react";
import { defaultContentItems, initialSiteSettings } from "./mock-data";
import type { ContentItem, SiteSettings } from "./site-types";

const ITEMS_STORAGE_KEY = "khiders_content_items_v2";
const SETTINGS_STORAGE_KEY = "khiders_site_settings_v2";

/**
 * Retrieves the current content items.
 * In browser: checks localStorage first; falls back to default seed items.
 */
export function getStoredItems(): ContentItem[] {
  if (typeof window === "undefined") {
    return defaultContentItems;
  }
  try {
    const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read items from localStorage:", err);
  }
  return defaultContentItems;
}

/**
 * Persists content items to localStorage and dispatches a change event.
 */
export function saveStoredItems(items: ContentItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("khider_content_changed", { detail: items }));
  } catch (err) {
    console.error("Failed to save items to localStorage:", err);
  }
}

/**
 * Retrieves current site settings.
 */
export function getStoredSettings(): SiteSettings {
  if (typeof window === "undefined") {
    return initialSiteSettings;
  }
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return { ...initialSiteSettings, ...parsed };
      }
    }
  } catch (err) {
    console.warn("Failed to read settings from localStorage:", err);
  }
  return initialSiteSettings;
}

/**
 * Persists site settings to localStorage and dispatches a change event.
 */
export function saveStoredSettings(settings: SiteSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent("khider_settings_changed", { detail: settings }));
  } catch (err) {
    console.error("Failed to save settings to localStorage:", err);
  }
}

/**
 * Resets all stored content and settings back to initial defaults.
 */
export function resetStoredToDefaults(): { items: ContentItem[]; settings: SiteSettings } {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ITEMS_STORAGE_KEY);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("khider_content_changed", { detail: defaultContentItems }));
    window.dispatchEvent(new CustomEvent("khider_settings_changed", { detail: initialSiteSettings }));
  }
  return { items: defaultContentItems, settings: initialSiteSettings };
}

/**
 * Exports all data as a formatted JSON string for backup.
 */
export function exportDataAsJson(): string {
  const payload = {
    version: "2.0",
    exportedAt: new Date().toISOString(),
    settings: getStoredSettings(),
    items: getStoredItems(),
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Imports and validates a JSON backup payload.
 */
export function importDataFromJson(jsonString: string): { items: ContentItem[]; settings: SiteSettings } {
  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("ملف البيانات غير صالح");
  }

  let items = getStoredItems();
  let settings = getStoredSettings();

  if (Array.isArray(parsed.items) && parsed.items.length > 0) {
    items = parsed.items;
    saveStoredItems(items);
  }

  if (parsed.settings && typeof parsed.settings === "object") {
    settings = { ...initialSiteSettings, ...parsed.settings };
    saveStoredSettings(settings);
  }

  return { items, settings };
}

/**
 * Reactive React hook for components to always render latest content items
 */
export function useLiveContent(fallbackItems?: ContentItem[]): ContentItem[] {
  const [items, setItems] = useState<ContentItem[]>(() => {
    if (typeof window !== "undefined") {
      return getStoredItems();
    }
    return fallbackItems || defaultContentItems;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setItems(getStoredItems());

    function onContentChanged(e: any) {
      if (e.detail) setItems(e.detail);
    }
    window.addEventListener("khider_content_changed", onContentChanged);
    return () => window.removeEventListener("khider_content_changed", onContentChanged);
  }, []);

  return items;
}

/**
 * Reactive React hook for components to always render latest site settings
 */
export function useLiveSettings(fallbackSettings?: SiteSettings): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (typeof window !== "undefined") {
      return getStoredSettings();
    }
    return fallbackSettings || initialSiteSettings;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSettings(getStoredSettings());

    function onSettingsChanged(e: any) {
      if (e.detail) setSettings(e.detail);
    }
    window.addEventListener("khider_settings_changed", onSettingsChanged);
    return () => window.removeEventListener("khider_settings_changed", onSettingsChanged);
  }, []);

  return settings;
}

