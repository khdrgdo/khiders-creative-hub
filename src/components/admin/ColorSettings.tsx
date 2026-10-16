import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { applySiteColors, resolveSiteColors, themeDefaults, type ThemeColor } from "@/lib/site-theme";
import type { SiteSettings } from "@/lib/site-types";

const labels: Record<ThemeColor, string> = {
  primary: "اللون الرئيسي", accent: "اللون المساند", background: "خلفية الموقع",
  foreground: "العناوين والنصوص", card: "خلفية العناصر", mutedForeground: "النصوص الثانوية",
  border: "الحدود والفواصل", primaryForeground: "نص الأزرار",
};

export function ColorSettings({ settings, onChange }: { settings: SiteSettings; onChange: (settings: SiteSettings) => void }) {
  const preview = useRef<HTMLDivElement>(null);
  const colors = resolveSiteColors(settings);
  useEffect(() => {
    if (preview.current) applySiteColors(resolveSiteColors(settings), preview.current);
  }, [settings]);
  return (
    <section className="space-y-5 border-y border-border py-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sans text-base font-bold">ألوان الموقع</h3>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange({ ...settings, colors: { ...themeDefaults }, primaryColor: themeDefaults.primary, accentColor: themeDefaults.accent })}>
          <RotateCcw className="size-3.5" /> ألوان التصميم الأصلي
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(labels) as ThemeColor[]).map((key) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`color-${key}`}>{labels[key]}</Label>
            <div className="flex items-center gap-2" dir="ltr">
              <input aria-label={`اختيار ${labels[key]}`} type="color" value={colors[key]} className="size-10 shrink-0 cursor-pointer rounded border border-input bg-card p-1" onChange={(event) => onChange({ ...settings, colors: { ...colors, [key]: event.target.value } })} />
              <Input id={`color-${key}`} value={settings.colors?.[key] ?? colors[key]} pattern="#[a-fA-F0-9]{6}" maxLength={7} required className="font-mono text-sm" onChange={(event) => onChange({ ...settings, colors: { ...settings.colors, [key]: event.target.value } })} />
            </div>
          </div>
        ))}
      </div>
      <div ref={preview} className="bg-background text-foreground border border-border p-5 space-y-3 rounded-lg">
        <h4 className="font-display text-2xl">{settings.siteName}</h4>
        <p className="text-muted-foreground text-sm">{settings.tagline}</p>
        <div className="flex items-center gap-3"><span className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm">تواصل معي</span><span className="bg-accent text-accent-foreground rounded px-4 py-2 text-sm">الأعمال المختارة</span></div>
      </div>
    </section>
  );
}