import { defaultContentItems, initialSiteSettings } from "./mock-data";
import type { ContentItem, ContentType, SiteSettings } from "./site-types";
import { normalizeSettings } from "./site-types";

export function mergeSettings(dbSettings: unknown): SiteSettings {
  if (!dbSettings || typeof dbSettings !== "object") {
    return initialSiteSettings;
  }
  const s = normalizeSettings(dbSettings);
  return {
    ...initialSiteSettings,
    ...s,
    siteName: s.siteName || initialSiteSettings.siteName,
    tagline: s.tagline || initialSiteSettings.tagline,
    intro: s.intro || initialSiteSettings.intro,
    about: s.about || initialSiteSettings.about,
    interests: s.interests?.length ? s.interests : initialSiteSettings.interests,
    skills: s.skills?.length ? s.skills : initialSiteSettings.skills,
    journey: s.journey?.length ? s.journey : initialSiteSettings.journey,
    socials: s.socials?.length ? s.socials : initialSiteSettings.socials,
    nav: s.nav?.length ? s.nav : initialSiteSettings.nav,
    seo: {
      ...initialSiteSettings.seo,
      ...(s.seo || {}),
      title: s.seo?.title || initialSiteSettings.seo.title,
      description: s.seo?.description || initialSiteSettings.seo.description,
    },
  };
}

export function filterByType(items: ContentItem[] | null | undefined, type: ContentType): ContentItem[] {
  const source = items && items.length > 0 ? items : defaultContentItems;
  return source.filter((item) => item.type === type && item.status === "published");
}

export function findBySlug(
  items: ContentItem[] | null | undefined,
  type: ContentType,
  slug: string
): ContentItem | undefined {
  const source = items && items.length > 0 ? items : defaultContentItems;
  return source.find((item) => item.type === type && item.slug === slug);
}
