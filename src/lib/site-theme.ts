import type { SiteSettings } from "./site-types";

export const themeDefaults = {
  primary: "#bd6245",
  accent: "#edddd2",
  background: "#f7f4ec",
  foreground: "#191919",
  card: "#faf8f2",
  mutedForeground: "#655f59",
  border: "#cbc5bb",
  primaryForeground: "#ffffff",
};

export type ThemeColor = keyof typeof themeDefaults;
export type SiteColors = Partial<Record<ThemeColor, string>>;

export function isHexColor(value: string): boolean {
  return /^#[\da-f]{6}$/i.test(value);
}

export function resolveSiteColors(settings: Pick<SiteSettings, "colors">): Record<ThemeColor, string> {
  return Object.fromEntries(Object.entries(themeDefaults).map(([key, fallback]) => {
    const custom = settings.colors?.[key as ThemeColor];
    return [key, custom && isHexColor(custom) ? custom : fallback];
  })) as Record<ThemeColor, string>;
}

export function applySiteColors(colors: Record<ThemeColor, string>, target: HTMLElement): void {
  const names: Record<ThemeColor, string[]> = {
    primary: ["primary", "ring"], accent: ["accent", "secondary", "muted", "lavender"],
    background: ["background"], foreground: ["foreground", "ink", "accent-foreground", "secondary-foreground", "card-foreground", "popover-foreground"],
    card: ["card", "popover"], mutedForeground: ["muted-foreground"], border: ["border", "input"],
    primaryForeground: ["primary-foreground"],
  };
  for (const key of Object.keys(names) as ThemeColor[]) {
    for (const name of names[key]) target.style.setProperty(`--${name}`, colors[key]);
  }
}