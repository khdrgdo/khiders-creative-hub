import { Link } from "@tanstack/react-router";
import { BookMarked, Code2, Feather, Compass, ArrowDown, Sparkles } from "lucide-react";
import type { SiteSettings } from "@/lib/site-types";

import { useLiveContent } from "@/lib/content-store";
import { filterByType } from "@/lib/content-helper";

interface HeroSectionProps {
  settings: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const allItems = useLiveContent();
  const booksCount = filterByType(allItems, "book").length;
  const projectsCount = filterByType(allItems, "project").length;
  const researchCount = filterByType(allItems, "research").length;

  return (
    <section className="pt-10 pb-16 sm:pt-16 sm:pb-24 max-w-4xl">
      {/* Top Status & Date */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-sans mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/70 border border-lavender/50 text-foreground/90">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="font-medium">الموقع الشخصي والأرشيف الفكري</span>
        </div>
        <span className="text-muted-foreground hidden sm:inline">•</span>
        <span className="text-muted-foreground hidden sm:inline">الخرطوم ➔ فضاء المعرفة الرقمية</span>
      </div>

      {/* Main High-Impact Typography */}
      <div className="space-y-4 mb-8">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.2]">
          أنا <span className="text-primary underline decoration-lavender/80 underline-offset-8">{settings.siteName || "خضر مأمون"}</span>.
        </h1>
        <p className="font-display text-xl sm:text-2xl md:text-3xl text-foreground/80 leading-relaxed font-normal">
          {settings.tagline || "مبرمج، كاتب، وباحث مستقل"}
        </p>
      </div>

      {/* Thoughtful Editorial Excerpt */}
      <div className="relative ps-5 border-s-2 border-primary/40 my-8">
        <p className="text-base sm:text-lg font-sans text-foreground/80 leading-loose max-w-2xl">
          {settings.intro}
        </p>
      </div>

      {/* Curated Counter & Metric Index Pills */}
      <div className="pt-4 pb-8 flex flex-wrap items-center gap-4 text-xs font-mono">
        <div className="px-3.5 py-1.5 rounded-lg border border-border/70 bg-card flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-muted-foreground">الكتب:</span>
          <span className="font-bold text-foreground">{booksCount} إصدارات</span>
        </div>
        <div className="px-3.5 py-1.5 rounded-lg border border-border/70 bg-card flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-muted-foreground">البرمجيات:</span>
          <span className="font-bold text-foreground">{projectsCount} مشاريع حرة</span>
        </div>
        <div className="px-3.5 py-1.5 rounded-lg border border-border/70 bg-card flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-muted-foreground">الأبحاث:</span>
          <span className="font-bold text-foreground">{researchCount} أوراق عمل</span>
        </div>
      </div>

      {/* Editorial Navigation Jump Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
        <Link
          to="/books"
          className="group relative p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-accent/40 transition-all duration-300 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="font-mono text-[11px] text-primary">٠١</span>
            <BookMarked className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
            الكتب والإصدارات
          </h3>
          <p className="text-[11px] font-sans text-muted-foreground mt-0.5">
            نسخ رقمية قابلة للتحميل
          </p>
        </Link>

        <Link
          to="/projects"
          className="group relative p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-accent/40 transition-all duration-300 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="font-mono text-[11px] text-primary">٠٢</span>
            <Code2 className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
            المشاريع البرمجية
          </h3>
          <p className="text-[11px] font-sans text-muted-foreground mt-0.5">
            نظم وأدوات حرة
          </p>
        </Link>

        <Link
          to="/writing"
          className="group relative p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-accent/40 transition-all duration-300 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="font-mono text-[11px] text-primary">٠٣</span>
            <Feather className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
            المقالات والأفكار
          </h3>
          <p className="text-[11px] font-sans text-muted-foreground mt-0.5">
            تأملات فكرية وفلسفية
          </p>
        </Link>

        <Link
          to="/research"
          className="group relative p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-accent/40 transition-all duration-300 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="font-mono text-[11px] text-primary">٠٤</span>
            <Compass className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
            الأبحاث المستقلة
          </h3>
          <p className="text-[11px] font-sans text-muted-foreground mt-0.5">
            أوراق علمية ومحكمة
          </p>
        </Link>
      </div>
    </section>
  );
}
