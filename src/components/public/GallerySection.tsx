import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Camera, MapPin, ArrowLeft, Maximize2, Aperture } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ContentItem } from "@/lib/site-types";

interface GallerySectionProps {
  items: ContentItem[];
  showHeading?: boolean;
  limit?: number;
}

export function GallerySection({ items, showHeading = true, limit }: GallerySectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ContentItem | null>(null);
  const displayItems = limit ? items.slice(0, limit) : items;

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

      {/* Fine-Art Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {displayItems.map((photo) => {
          const meta = (photo.meta || {}) as Record<string, string>;

          return (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="art-frame group cursor-pointer flex flex-col justify-between"
            >
              {/* Passe-partout Matting and Photo Container */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted/80">
                {photo.cover_url && (
                  <img
                    src={photo.cover_url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                )}
                {/* Subtle vignette on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs text-white font-medium flex items-center gap-1.5 drop-shadow">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>مشاهدة بالحجم الكامل</span>
                  </span>
                </div>
              </div>

              {/* Museum-style caption plaque */}
              <div className="pt-4 pb-2 px-1 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {photo.title}
                  </h3>
                  {meta.location && (
                    <span className="flex items-center gap-1 text-[11px] font-sans text-muted-foreground shrink-0">
                      <MapPin className="w-3 h-3 text-primary/70" />
                      <span>{meta.location}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs font-sans text-muted-foreground line-clamp-2 leading-relaxed">
                  {photo.excerpt}
                </p>

                {meta.camera && (
                  <div className="pt-1.5 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Aperture className="w-3 h-3 text-primary/70" />
                      <span>{meta.camera}</span>
                    </span>
                    <span>{photo.category || "فوتوغرافيا"}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        {selectedPhoto && (
          <DialogContent className="max-w-4xl text-right dir-rtl p-0 overflow-hidden bg-card border-border/80">
            {selectedPhoto.cover_url && (
              <div className="w-full max-h-[65vh] bg-black/95 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.cover_url}
                  alt={selectedPhoto.title}
                  className="max-h-[65vh] w-auto object-contain"
                />
              </div>
            )}
            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <DialogTitle className="font-display text-2xl sm:text-3xl font-bold">
                  {selectedPhoto.title}
                </DialogTitle>
                <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-sans">
                  {selectedPhoto.category || "عمل بصري"}
                </span>
              </div>

              <p className="text-sm sm:text-base font-sans text-foreground/80 leading-relaxed max-w-2xl">
                {selectedPhoto.body || selectedPhoto.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-muted-foreground border-t border-border/50 font-mono">
                {(selectedPhoto.meta as any)?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>الموقع: {(selectedPhoto.meta as any).location}</span>
                  </span>
                )}
                {(selectedPhoto.meta as any)?.camera && (
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-primary" />
                    <span>الكاميرا: {(selectedPhoto.meta as any).camera}</span>
                  </span>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
