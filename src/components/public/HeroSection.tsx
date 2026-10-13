import { Link } from "@tanstack/react-router";
import { BookMarked, Code2, Feather, Compass, ArrowLeft } from "lucide-react";
import type { SiteSettings } from "@/lib/site-types";

interface HeroSectionProps {
  settings: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section className="py-12 sm:py-20 max-w-3xl">
      {/* Subtle status tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/70 border border-lavender/40 text-[12px] font-sans text-primary mb-6">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>مساحة شخصية للكتابة، البرمجة، والبحث المستقل</span>
      </div>

      {/* Main Heading */}
      <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.25] mb-6">
        أهلاً بك، أنا <span className="text-primary">{settings.siteName}</span>.
      </h1>

      {/* Role / Tagline */}
      <p className="text-lg sm:text-xl font-display text-muted-foreground mb-6">
        {settings.tagline}
      </p>

      {/* Introductory Paragraph */}
      <p className="text-base sm:text-lg font-sans text-foreground/80 leading-relaxed sm:leading-loose mb-10 max-w-2xl">
        {settings.intro}
      </p>

      {/* Quick Navigation Cards / Badges (Subtle & Clean) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <Link
          to="/books"
          className="group flex flex-col p-3.5 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-accent/30 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <BookMarked className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </div>
          <span className="text-xs font-bold text-foreground">الكتب</span>
          <span className="text-[11px] text-muted-foreground">3 إصدارات</span>
        </Link>

        <Link
          to="/projects"
          className="group flex flex-col p-3.5 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-accent/30 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <Code2 className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </div>
          <span className="text-xs font-bold text-foreground">المشاريع</span>
          <span className="text-[11px] text-muted-foreground">نظم حرة</span>
        </Link>

        <Link
          to="/writing"
          className="group flex flex-col p-3.5 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-accent/30 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <Feather className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </div>
          <span className="text-xs font-bold text-foreground">الكتابات</span>
          <span className="text-[11px] text-muted-foreground">مقالات ورؤى</span>
        </Link>

        <Link
          to="/research"
          className="group flex flex-col p-3.5 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-accent/30 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <Compass className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </div>
          <span className="text-xs font-bold text-foreground">الأبحاث</span>
          <span className="text-[11px] text-muted-foreground">دراسات مستقلة</span>
        </Link>
      </div>
    </section>
  );
}
