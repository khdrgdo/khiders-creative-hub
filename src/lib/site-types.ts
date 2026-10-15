import type { Tables } from "@/integrations/supabase/types";

export type ContentType = "book" | "project" | "article" | "research" | "gallery";
export type ContentItem = Tables<"content_items">;
export type PageRow = Tables<"pages">;
export type HomeSection = Tables<"home_sections">;

export interface LinkItem { label: string; url: string }
export interface NavItem { label: string; to: string }

export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  telegram?: string;
  substack?: string;
  website?: string;
  youtube?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  intro: string;
  about: string;
  avatarUrl?: string;
  socialLinks?: SocialLinks;
  interests: string[];
  skills: string[];
  journey: { year: string; text: string }[];
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  email: string;
  socials: LinkItem[];
  nav: NavItem[];
  seo: { title: string; description: string; ogImage: string };
}

export const defaultSettings: SiteSettings = {
  siteName: "خضر مأمون",
  tagline: "",
  intro: "",
  about: "",
  avatarUrl: "",
  socialLinks: {
    github: "https://github.com/khdrgdo",
    twitter: "https://x.com",
    linkedin: "",
    telegram: "",
    substack: "",
    website: "",
    youtube: "",
  },
  interests: [],
  skills: [],
  journey: [],
  primaryColor: "",
  accentColor: "",
  logoUrl: "",
  email: "",
  socials: [],
  nav: [],
  seo: { title: "", description: "", ogImage: "" },
};

export function normalizeSettings(raw: unknown): SiteSettings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<SiteSettings>;
  return { ...defaultSettings, ...r, seo: { ...defaultSettings.seo, ...(r.seo ?? {}) } };
}

export const typeConfig: Record<ContentType, { label: string; plural: string; path: string; hasFile: boolean }> = {
  book: { label: "كتاب", plural: "الكتب", path: "/books", hasFile: true },
  project: { label: "مشروع", plural: "المشاريع", path: "/projects", hasFile: false },
  article: { label: "مقال", plural: "الكتابات", path: "/writing", hasFile: false },
  research: { label: "بحث", plural: "الأبحاث", path: "/research", hasFile: true },
  gallery: { label: "صورة", plural: "المعرض", path: "/gallery", hasFile: false },
};

export const contentTypes = Object.keys(typeConfig) as ContentType[];

export function asLinks(v: unknown): LinkItem[] {
  return Array.isArray(v) ? (v as LinkItem[]).filter((l) => l && typeof l.url === "string") : [];
}
export function metaList(meta: unknown, key: string): string[] {
  const m = (meta && typeof meta === "object" ? meta : {}) as Record<string, unknown>;
  const v = m[key];
  return Array.isArray(v) ? v.map(String) : [];
}

export function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

export function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });
}
