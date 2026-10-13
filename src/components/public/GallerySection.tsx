import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Camera, MapPin, ArrowLeft, Maximize2 } from "lucide-react";
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
    <section className="py-12">
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-border/60">
          <div>
            <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block mb-1">
              الأعمال البصرية
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              معرض الصور والمشاهد
            </h2>
          </div>
          <Link
            to="/gallery"
            className="mt-2 sm:mt-0 inline-flex items-center gap-1 text-xs sm:text-sm text-primary hover:underline font-medium"
          >
            <span>عرض المعرض كاملاً</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayItems.map((photo) => {
          const meta = (photo.meta || {}) as Record<string, string>;

          return (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-border/70 bg-card hover:border-primary/40 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {photo.cover_url && (
                  <img
                    src={photo.cover_url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs text-foreground font-medium flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-primary" />
                    <span>تكبير الصورة</span>
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {photo.title}
                </h3>
                <p className="text-xs font-sans text-muted-foreground line-clamp-2">
                  {photo.excerpt}
                </p>
                {meta.location && (
                  <div className="pt-2 flex items-center gap-1 text-[11px] text-muted-foreground/80">
                    <MapPin className="w-3 h-3 text-primary/70" />
                    <span>{meta.location}</span>
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
          <DialogContent className="max-w-3xl text-right dir-rtl p-0 overflow-hidden bg-background">
            {selectedPhoto.cover_url && (
              <div className="w-full max-h-[60vh] bg-black/90 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.cover_url}
                  alt={selectedPhoto.title}
                  className="max-h-[60vh] w-auto object-contain"
                />
              </div>
            )}
            <div className="p-6 space-y-2">
              <DialogTitle className="font-display text-2xl font-bold">
                {selectedPhoto.title}
              </DialogTitle>
              <p className="text-sm font-sans text-foreground/80 leading-relaxed">
                {selectedPhoto.body || selectedPhoto.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-muted-foreground border-t border-border/50">
                {(selectedPhoto.meta as any)?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {(selectedPhoto.meta as any).location}
                  </span>
                )}
                {(selectedPhoto.meta as any)?.camera && (
                  <span className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-primary" />
                    {(selectedPhoto.meta as any).camera}
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
