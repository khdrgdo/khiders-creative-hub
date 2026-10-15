import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useLiveSettings } from "@/lib/content-store";

const navLinks = [
  { label: "الرئيسية", to: "/" },
  { label: "عنّي", to: "/about" },
  { label: "كتب", to: "/books" },
  { label: "مشاريع", to: "/projects" },
  { label: "كتابات", to: "/writing" },
  { label: "أبحاث", to: "/research" },
  { label: "معرض", to: "/gallery" },
  { label: "تواصل", to: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const settings = useLiveSettings();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-border/50 transition-all duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 sm:h-22 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90 focus:outline-none"
        >
          {settings.avatarUrl ? (
            <img
              src={settings.avatarUrl}
              alt={settings.siteName || "خضر مأمون"}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-border/80 group-hover:ring-primary/40 transition-all shadow-xs shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted/70 border border-border/80 flex items-center justify-center font-display font-bold text-base text-foreground/85 group-hover:border-primary/40 transition-colors shrink-0">
              {(settings.siteName || "خ")[0]}
            </div>
          )}
          <div className="flex flex-col justify-center">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
              {settings.siteName || "خضر مأمون"}
            </span>
            <span className="text-[11px] font-sans text-muted-foreground/80 tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>{settings.tagline || "فِكْر وشَفْرَة"}</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-1 bg-card/60 px-3 py-1.5 rounded-full border border-border/60 shadow-xs"
        >
          {navLinks.map((link) => {
            const isActive =
              link.to === "/"
                ? currentPath === "/"
                : currentPath.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-sans rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-primary font-bold bg-accent/90 shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex text-xs h-8 px-3.5 rounded-full border-border/80 hover:border-primary/50 hover:text-primary transition-colors font-sans"
          >
            <Link to="/contact">
              <span>مراسلة</span>
              <ArrowUpRight className="w-3 h-3 ms-1 text-primary" />
            </Link>
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileOpen}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-1.5 animate-in fade-in-50 duration-200">
          <div className="py-2 px-3 mb-2 text-xs text-muted-foreground border-b border-border/40 flex items-center justify-between">
            <span>أقسام الموقع</span>
            <span className="text-[11px] text-primary">خضر مأمون</span>
          </div>
          {navLinks.map((link) => {
            const isActive =
              link.to === "/"
                ? currentPath === "/"
                : currentPath.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-sans transition-colors ${
                  isActive
                    ? "bg-accent text-primary font-bold"
                    : "text-foreground hover:bg-muted/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
