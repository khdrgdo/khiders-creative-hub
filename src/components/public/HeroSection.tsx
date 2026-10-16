import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Asterisk } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/site-types";
import studioImage from "@/assets/editorial-studio.jpg";
import { SocialLinksBar } from "./SocialLinksBar";

export function HeroSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="editorial-hero">
      <div className="flex justify-between items-center gap-4 border-b border-border pb-4 text-xs">
        <span className="flex items-center gap-2 font-semibold"><Asterisk className="size-5 text-primary" /> مبرمج · كاتب · باحث</span>
        <span className="text-muted-foreground" dir="ltr">KHIDER MAMOUN / PORTFOLIO</span>
      </div>
      <div className="hero-stage">
        <img src={settings.avatarUrl || studioImage} alt={settings.avatarUrl ? settings.siteName : "كتب وحاسوب ودفتر كتابة"} width={1024} height={1024} className="hero-image" />
        <div className="hero-image-shade" />
        <div className="hero-heading"><span className="block text-sm font-sans font-medium mb-3">أهلاً، أنا</span><h1>{settings.siteName || "خضر مأمون"}</h1><span className="hero-word" aria-hidden="true" dir="ltr">PORTFOLIO</span></div>
        <div className="hero-intro">
          <p className="font-display text-2xl sm:text-3xl text-primary mb-4">{settings.tagline}</p>
          <p className="text-sm leading-loose max-w-md">{settings.intro}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button asChild className="rounded-none gap-2"><Link to="/projects">الأعمال المختارة <ArrowUpLeft className="size-4" /></Link></Button>
            <Button asChild variant="outline" className="rounded-none bg-background"><Link to="/contact">تواصل معي</Link></Button>
          </div>
          <div className="mt-5"><SocialLinksBar settings={settings} /></div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-3 border-t border-border py-4 text-xs text-muted-foreground"><span>من السودان، إلى العالم.</span><Link to="/about" className="flex items-center gap-2 text-foreground">الفكر وراء العمل <ArrowUpLeft className="size-4 text-primary" /></Link></div>
    </section>
  );
}
