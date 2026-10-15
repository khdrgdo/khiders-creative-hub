import { Link } from "@tanstack/react-router";
import {
  BookMarked,
  Code2,
  Feather,
  Compass,
  ArrowUpRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/site-types";
import { useLiveContent } from "@/lib/content-store";
import { filterByType } from "@/lib/content-helper";

import { SocialLinksBar } from "@/components/public/SocialLinksBar";

interface HeroSectionProps {
  settings: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const allItems = useLiveContent();
  const booksCount = filterByType(allItems, "book").length;
  const projectsCount = filterByType(allItems, "project").length;
  const researchCount = filterByType(allItems, "research").length;

  return (
    <section className="pt-8 pb-14 sm:pt-14 sm:pb-20 space-y-12">
      {/* Top Editorial Index Header (Calm & Understated - No AI green bar) */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono pb-4 border-b border-border/50 text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <span className="text-foreground/90 font-bold uppercase tracking-wider text-[11px]">
            PORTFOLIO // مِلفُ الأَعْمَال
          </span>
          <span>•</span>
          <span className="font-sans text-[11px]">فضاء فكري وبرمجي مستقل</span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span>الخرطوم ➔ الفضاء الرقمي</span>
        </div>
      </div>

      {/* Main Split Hero: Identity & Portrait Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Right Column: High-Impact Typography & Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="editorial-num font-mono text-xs uppercase tracking-widest text-primary font-bold">
              PORTFOLIO // خضر مأمون
            </span>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.18]">
              أنا{" "}
              <span className="text-foreground underline decoration-border/80 underline-offset-8">
                {settings.siteName || "خضر مأمون"}
              </span>
              .
            </h1>

            <p className="font-display text-xl sm:text-2xl md:text-3xl text-foreground/85 font-normal leading-relaxed">
              {settings.tagline || "مهندس برمجيات، كاتب، وباحث مستقل"}
            </p>
          </div>

          {/* Manifesto / Mission Excerpt */}
          <div className="relative ps-5 border-s-2 border-border my-6">
            <p className="text-base sm:text-lg font-sans text-foreground/80 leading-loose max-w-xl">
              {settings.intro}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-xs gap-1.5 shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.01]"
            >
              <Link to="/projects">
                <span>استكشاف المشاريع البرمجية</span>
                <Code2 className="w-4 h-4 ms-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-10 px-4 rounded-xl border-border hover:border-foreground/30 hover:bg-accent/40 font-semibold text-xs transition-colors"
            >
              <Link to="/writing">
                <span>المقالات والأفكار</span>
                <Feather className="w-3.5 h-3.5 ms-1 text-primary" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="h-10 px-4 rounded-xl text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <Link to="/contact">
                <span>تواصل معي</span>
                <ArrowUpRight className="w-3.5 h-3.5 ms-1" />
              </Link>
            </Button>
          </div>

          {/* Direct Social Media Links Row */}
          <div className="pt-2">
            <SocialLinksBar settings={settings} />
          </div>

          {/* Live Metrics Index Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3.5 py-1.5 rounded-lg border border-border/70 bg-card flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground">الكتب:</span>
              <span className="font-bold text-foreground">{booksCount} إصدارات</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg border border-border/70 bg-card flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground">البرمجيات:</span>
              <span className="font-bold text-foreground">{projectsCount} حرة</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg border border-border/70 bg-card flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground">الأبحاث:</span>
              <span className="font-bold text-foreground">{researchCount} أوراق</span>
            </div>
          </div>
        </div>

        {/* Left Column: Dedicated Personal Portrait Card (مكان لصورتي) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm">
            {settings.avatarUrl ? (
              /* Custom Portrait Uploaded by Khider */
              <div className="art-frame group relative rounded-2xl overflow-hidden bg-card border border-border/80 shadow-md transition-all duration-400 hover:shadow-xl">
                <div className="p-3 bg-muted/20 rounded-xl">
                  <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted shadow-inner">
                    <img
                      src={settings.avatarUrl}
                      alt={settings.siteName}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-xs text-white font-sans drop-shadow font-medium">
                        {settings.siteName} — {settings.tagline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Museum Plaque Underneath Portrait */}
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {settings.siteName}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold">
                      PORTRAIT
                    </span>
                  </div>
                  <p className="text-xs font-sans text-muted-foreground">
                    مهندس برمجيات وكاتب وباحث سوداني مستقل
                  </p>
                </div>
              </div>
            ) : (
              /* Bespoke Editorial Monograph Card when no photo uploaded yet */
              <div className="art-frame relative rounded-2xl overflow-hidden bg-card border border-border/80 p-6 space-y-5 shadow-sm text-center">
                <div className="w-28 h-28 mx-auto rounded-full bg-accent/50 border border-border flex items-center justify-center shadow-xs">
                  <span className="font-display text-5xl font-bold text-foreground/85 select-none">
                    {settings.siteName ? settings.siteName.charAt(0) : "خ"}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-mono">
                    <span>مِلفُ الأَعْمَال الشَّخْصِي</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {settings.siteName || "خضر مأمون"}
                  </h3>
                  <p className="text-xs font-sans text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {settings.tagline || "بين كود الحاسوب وكتب الفلسفة والأدب"}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 text-xs font-mono text-muted-foreground flex items-center justify-between">
                  <span>الخرطوم ➔ السودان</span>
                  <span className="text-primary font-bold">٢٠٢٦</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rule-ornament" />

      {/* Editorial Navigation Index Jump Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
        <Link
          to="/books"
          className="group relative p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-accent/40 transition-all duration-300 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="font-mono text-[11px] text-primary font-bold">٠١</span>
            <BookMarked className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
            الكتب والإصدارات
          </h3>
          <p className="text-[11px] font-sans text-muted-foreground mt-0.5">
            نسخ رقمية للتحميل
          </p>
        </Link>

        <Link
          to="/projects"
          className="group relative p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-accent/40 transition-all duration-300 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="font-mono text-[11px] text-primary font-bold">٠٢</span>
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
          className="group relative p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-accent/40 transition-all duration-300 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="font-mono text-[11px] text-primary font-bold">٠٣</span>
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
          className="group relative p-4 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-accent/40 transition-all duration-300 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="font-mono text-[11px] text-primary font-bold">٠٤</span>
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
