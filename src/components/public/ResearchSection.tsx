import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Download, ArrowLeft, ExternalLink, BookmarkCheck, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ContentItem } from "@/lib/site-types";

interface ResearchSectionProps {
  research: ContentItem[];
  showHeading?: boolean;
  limit?: number;
}

export function ResearchSection({ research, showHeading = true, limit }: ResearchSectionProps) {
  const [activePaper, setActivePaper] = useState<ContentItem | null>(null);
  const displayResearch = limit ? research.slice(0, limit) : research;

  return (
    <section className="py-12 sm:py-16">
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-num font-mono text-xs">SECTION 04</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs font-sans text-primary font-semibold">الدراسات والأوراق المستقلة</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              الأبحاث والدراسات المعمقة
            </h2>
          </div>
          <Link
            to="/research"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:underline font-semibold"
          >
            <span>كل الأبحاث والأوراق</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="space-y-8">
        {displayResearch.map((item, idx) => {
          const meta = (item.meta || {}) as Record<string, string>;
          const refCode = `DOC-0${idx + 1}`;

          return (
            <article
              key={item.id}
              className="p-6 sm:p-8 rounded-2xl border border-border/70 bg-card hover:border-primary/50 transition-all duration-300 shadow-sm space-y-5"
            >
              {/* Header meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] font-bold text-primary px-2 py-0.5 rounded bg-accent">
                    {refCode}
                  </span>
                  <span className="font-sans font-medium text-foreground">
                    {item.category || "ورقة بحثية"}
                  </span>
                  {meta.status && (
                    <span className="text-muted-foreground">• {meta.status}</span>
                  )}
                </div>

                {meta.year && (
                  <span className="font-mono text-xs text-muted-foreground">{meta.year}</span>
                )}
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-2.5">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base font-sans text-muted-foreground leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              {/* Keywords / Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded text-[11px] font-sans bg-muted text-muted-foreground border border-border/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivePaper(item)}
                    className="text-xs h-9 px-4 gap-2 border-border hover:border-primary/50"
                  >
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span>مستخلص البحث</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => alert("يبدأ تحميل الورقة البحثية بصيغة PDF...")}
                    className="text-xs h-9 px-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل الورقة كاملة (PDF)</span>
                  </Button>
                </div>

                {meta.pages && (
                  <span className="text-xs font-mono text-muted-foreground">
                    {meta.pages}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Abstract Modal */}
      <Dialog open={!!activePaper} onOpenChange={(open) => !open && setActivePaper(null)}>
        {activePaper && (
          <DialogContent className="max-w-2xl text-right dir-rtl p-6 sm:p-10 max-h-[85vh] overflow-y-auto">
            <DialogHeader className="text-right pb-4 border-b border-border/60">
              <span className="text-xs text-primary font-semibold">
                {activePaper.category}
              </span>
              <DialogTitle className="font-display text-2xl sm:text-3xl font-bold mt-1 leading-snug">
                {activePaper.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {(activePaper.meta as any)?.status || "ورقة عمل بحثية مستقلة"} • {(activePaper.meta as any)?.year || "2024"}
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4 text-sm sm:text-base font-sans leading-loose text-foreground/90">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                مستخلص الدراسة (Abstract):
              </h4>
              <p className="whitespace-pre-line">{activePaper.body || activePaper.excerpt}</p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivePaper(null)}
                className="text-xs"
              >
                إغلاق
              </Button>
              <Button
                size="sm"
                onClick={() => alert("يبدأ تحميل الورقة البحثية كاملة...")}
                className="text-xs gap-2 bg-primary text-primary-foreground font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل PDF</span>
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
