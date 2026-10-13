import { defaultContentItems, initialSiteSettings } from "./mock-data";
import { getStoredItems, getStoredSettings } from "./content-store";
import type { ContentItem, ContentType, SiteSettings } from "./site-types";
import { normalizeSettings } from "./site-types";

export function mergeSettings(dbSettings: unknown): SiteSettings {
  const base = typeof window !== "undefined" ? getStoredSettings() : initialSiteSettings;
  if (!dbSettings || typeof dbSettings !== "object") {
    return base;
  }
  const s = normalizeSettings(dbSettings);
  return {
    ...base,
    ...s,
    siteName: s.siteName || base.siteName,
    tagline: s.tagline || base.tagline,
    intro: s.intro || base.intro,
    about: s.about || base.about,
    interests: s.interests?.length ? s.interests : base.interests,
    skills: s.skills?.length ? s.skills : base.skills,
    journey: s.journey?.length ? s.journey : base.journey,
    socials: s.socials?.length ? s.socials : base.socials,
    nav: s.nav?.length ? s.nav : base.nav,
    seo: {
      ...base.seo,
      ...(s.seo || {}),
      title: s.seo?.title || base.seo.title,
      description: s.seo?.description || base.seo.description,
    },
  };
}

export function filterByType(items: ContentItem[] | null | undefined, type: ContentType): ContentItem[] {
  let source: ContentItem[] = [];
  if (items && items.length > 0) {
    source = items;
  } else if (typeof window !== "undefined") {
    source = getStoredItems();
  } else {
    source = defaultContentItems;
  }
  return source.filter((item) => item.type === type && item.status === "published");
}

export function findBySlug(
  items: ContentItem[] | null | undefined,
  type: ContentType,
  slug: string
): ContentItem | undefined {
  let source: ContentItem[] = [];
  if (items && items.length > 0) {
    source = items;
  } else if (typeof window !== "undefined") {
    source = getStoredItems();
  } else {
    source = defaultContentItems;
  }
  return source.find((item) => item.type === type && item.slug === slug);
}

