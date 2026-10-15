import React from "react";
import { Github, Twitter, Linkedin, Send, Globe, Mail, BookOpen, ArrowUpRight } from "lucide-react";
import type { SiteSettings, SocialLinks } from "@/lib/site-types";

interface SocialLinksBarProps {
  settings: SiteSettings;
  className?: string;
  variant?: "minimal" | "compact" | "full";
  showLabel?: boolean;
}

export function SocialLinksBar({
  settings,
  className = "",
  variant = "minimal",
  showLabel = true,
}: SocialLinksBarProps) {
  const socials = settings.socialLinks || {};

  const links: Array<{
    key: string;
    label: string;
    url?: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: "github", label: "GitHub", url: socials.github, icon: Github },
    { key: "twitter", label: "X (تويتر)", url: socials.twitter, icon: Twitter },
    { key: "linkedin", label: "LinkedIn", url: socials.linkedin, icon: Linkedin },
    { key: "telegram", label: "Telegram", url: socials.telegram, icon: Send },
    { key: "substack", label: "Substack", url: socials.substack, icon: BookOpen },
    { key: "website", label: "موقع شخصي", url: socials.website, icon: Globe },
    {
      key: "email",
      label: "مراسلة",
      url: settings.email ? `mailto:${settings.email}` : undefined,
      icon: Mail,
    },
  ].filter((item) => Boolean(item.url && item.url.trim()));

  if (links.length === 0) {
    return null;
  }

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.key}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              title={link.label}
              className="w-8 h-8 rounded-lg border border-border/70 bg-card hover:bg-accent/60 hover:border-foreground/30 text-muted-foreground hover:text-foreground flex items-center justify-center transition-all duration-200"
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-[11px] font-mono text-muted-foreground me-1 select-none">
          حسابات التواصل:
        </span>
      )}
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 bg-card hover:bg-accent/50 hover:border-foreground/30 text-muted-foreground hover:text-foreground text-xs font-mono transition-all duration-200"
          >
            <Icon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-105" />
            <span className="text-[11px] font-sans font-medium">{link.label}</span>
            <ArrowUpRight className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </a>
        );
      })}
    </div>
  );
}
