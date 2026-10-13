import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border/50 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="group flex items-baseline gap-2.5 transition-opacity hover:opacity-85 focus:outline-none"
        >
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            خضر مأمون
          </span>
          <span className="hidden sm:inline-block text-[11px] font-sans text-muted-foreground/80 tracking-wide">
            فِكْر وشَفْرَة
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-1 sm:gap-1.5"
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
                className={`relative px-3 py-1.5 text-xs sm:text-sm font-sans rounded-md transition-colors duration-150 ${
                  isActive
                    ? "text-primary font-semibold bg-accent/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-2 h-0.5 bg-primary rounded-full" />
                )}
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
            className="hidden sm:inline-flex text-xs h-8 px-3 border-border hover:border-primary/40 hover:text-primary transition-colors"
          >
            <Link to="/contact">
              <span>تواصل معي</span>
            </Link>
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileOpen}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-1.5 animate-in fade-in-50 duration-200">
          <div className="py-2 px-3 mb-2 text-xs text-muted-foreground border-b border-border/40 flex items-center justify-between">
            <span>التنقل في الموقع</span>
            <span className="text-[11px] text-primary">الموقع الشخصي</span>
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
                className={`block px-3 py-2.5 rounded-lg text-sm font-sans transition-colors ${
                  isActive
                    ? "bg-accent/80 text-primary font-bold"
                    : "text-foreground hover:bg-muted/70"
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
