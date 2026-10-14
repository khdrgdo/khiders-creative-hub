import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Camera,
  MapPin,
  ArrowLeft,
  Maximize2,
  Aperture,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ContentItem } from "@/lib/site-types";

interface GallerySectionProps {
  items: ContentItem[];
  showHeading?: boolean;
  limit?: number;
}

export function GallerySection({ items, showHeading = true, limit }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const displayItems = limit ? items.slice(0, limit) : items;

  const selectedPhoto =
    selectedIndex !== null && displayItems[selectedIndex]
      ? displayItems[selectedIndex]
      : null;

  // Keyboard navigation for lightbox
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedIndex === null) return;
      if (e.key === "ArrowLeft") {
        // Next photo in RTL
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % displayItems.length : 0
        );
      } else if (e.key === "ArrowRight") {
        // Prev photo in RTL
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + displayItems.length) % displayItems.length : 0
        );
      } else if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, displayItems.length]);

  function nextPhoto() {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % displayItems.length);
  }

  function prevPhoto() {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + displayItems.length) % displayItems.length);
  }

  return (
    <section className="py-12 sm:py-16">
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-num font-mono text-xs">SECTION 05</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs font-sans text-primary font-semibold">المشاهد والبصريات</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              معرض الصور والمشاهد
            </h2>
          </div>
          <Link
            to="/gallery"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:underline font-semibold"
          >
            <span>كامل المعرض البصري</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Fine-Art Curated Exhibition Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {displayItems.map((photo, idx) => {
          const meta = (photo.meta || {}) as Record<string, string>;
          const plateNum = `لوحة ${String(idx + 1).padStart(2, "0")}`;

          return (
            <article
              key={photo.id}
              onClick={() => setSelectedIndex(idx)}
              className="art-frame group cursor-pointer flex flex-col justify-between transition-all duration-400 hover:-translate-y-1"
            >
              {/* Museum Passe-partout (Matte Frame) */}
              <div className="p-2.5 sm:p-3 bg-muted/30 rounded-xl border border-border/60">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted shadow-inner">
                  {photo.cover_url ? (
                    <img
                      src={photo.cover_url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground text-xs font-sans">
                      <Camera className="w-8 h-8 opacity-40 mb-1" />
                    </div>
                  )}

                  {/* Curated Plate Watermark */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-sm text-[10px] font-mono text-white/90 border border-white/10">
                    {plateNum}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <span className="text-xs text-white font-medium flex items-center gap-1.5 drop-shadow">
                      <Maximize2 className="w-3.5 h-3.5 text-primary" />
                      <span>عرض في صالة المعرض</span>
                    </span>
                    {meta["camera"] && (
                      <span className="text-[10px] text-white/80 font-mono hidden sm:inline">
                        {meta["camera"]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Plaque Caption */}
              <div className="pt-4 pb-1 px-1 space-y-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {photo.title}
                  </h3>
                  {meta["location"] && (
                    <span className="flex items-center gap-1 text-[11px] font-sans text-muted-foreground shrink-0 bg-muted/60 px-2 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span>{meta["location"]}</span>
                    </span>
                  )}
                </div>

                {photo.excerpt && (
                  <p className="text-xs font-sans text-muted-foreground line-clamp-2 leading-relaxed">
                    {photo.excerpt}
                  </p>
                )}

                {/* Plaque Footer Metadata */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    {meta["camera"] ? (
                      <>
                        <Aperture className="w-3 h-3 text-primary/80" />
                        <span>{meta["camera"]}</span>
                      </>
                    ) : (
                      <span>{photo.category || "عمل فوتوغرافي"}</span>
                    )}
                  </span>
                  <span className="text-primary font-bold text-[10px]">
                    معاينة ➔
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* High-End Darkroom Lightbox Exhibition Modal */}
      <Dialog
        open={selectedPhoto !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        {selectedPhoto && (
          <DialogContent className="max-w-5xl text-right dir-rtl p-0 overflow-hidden bg-card border-border/90 shadow-2xl">
            {/* Visual Display Stage */}
            <div className="relative w-full bg-black/95 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[500px] max-h-[72vh]">
              {selectedPhoto.cover_url ? (
                <img
                  src={selectedPhoto.cover_url}
                  alt={selectedPhoto.title}
                  className="max-h-[72vh] w-auto object-contain mx-auto transition-all"
                />
              ) : (
                <div className="p-16 text-center text-white/50 font-sans">
                  لا تتوفر صورة مكبرة
                </div>
              )}

              {/* Lightbox Navigation Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                aria-label="الصورة السابقة"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white transition-all border border-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                aria-label="الصورة التالية"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white transition-all border border-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Index Indicator Pill */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-white/90 border border-white/15">
                {(selectedIndex ?? 0) + 1} / {displayItems.length}
              </div>
            </div>

            {/* Editorial Caption Details */}
            <div className="p-6 sm:p-8 space-y-4 bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <DialogTitle className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  {selectedPhoto.title}
                </DialogTitle>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-sans font-medium">
                  {selectedPhoto.category || "مشاهد وبصريات"}
                </span>
              </div>

              {(selectedPhoto.body || selectedPhoto.excerpt) && (
                <p className="text-sm sm:text-base font-sans text-foreground/85 leading-relaxed max-w-3xl">
                  {selectedPhoto.body || selectedPhoto.excerpt}
                </p>
              )}

              {/* Technical EXIF Specifications Bar */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-muted-foreground border-t border-border/50 font-mono">
                {(selectedPhoto.meta as any)?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>الموقع الجغرافي: {(selectedPhoto.meta as any).location}</span>
                  </span>
                )}
                {(selectedPhoto.meta as any)?.camera && (
                  <span className="flex items-center gap-1.5">
                    <Aperture className="w-4 h-4 text-primary" />
                    <span>الكاميرا والعدسة: {(selectedPhoto.meta as any).camera}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5 ms-auto text-muted-foreground/80">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>أرشيف خضر مأمون البصري</span>
                </span>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
