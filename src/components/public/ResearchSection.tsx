import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Download, ArrowLeft, ExternalLink } from "lucide-react";
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
    <section className="py-12">
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-border/60">
          <div>
            <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block mb-1">
              الدراسات المستقلة
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              الأبحاث والأوراق الفكرية
            </h2>
          </div>
          <Link
            to="/research"
            className="mt-2 sm:mt-0 inline-flex items-center gap-1 text-xs sm:text-sm text-primary hover:underline font-medium"
          >
            <span>عرض كل الأبحاث</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {displayResearch.map((item) => {
          const meta = (item.meta || {}) as Record<string, string>;

          return (
            <article
              key={item.id}
              className="p-6 rounded-2xl border border-border/70 hover:border-primary/40 bg-card hover:bg-card/80 transition-all duration-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans bg-accent text-accent-foreground font-medium">
                    {item.category || "ورقة بحثية"}
                  </span>
                  {meta.status && (
                    <span className="text-xs text-muted-foreground">• {meta.status}</span>
                  )}
                </div>
                {meta.year && (
                  <span className="text-xs font-mono text-muted-foreground">{meta.year}</span>
                )}
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3 hover:text-primary transition-colors">
                {item.title}
              </h3>

              <p className="text-sm font-sans text-muted-foreground leading-relaxed mb-6">
                {item.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/40">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivePaper(item)}
                    className="text-xs h-8 gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>قراءة المستخلص</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => alert("يبدأ تحميل الورقة البحثية بصيغة PDF...")}
                    className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل الورقة (PDF)</span>
                  </Button>
                </div>

                {meta.pages && (
                  <span className="text-xs text-muted-foreground">{meta.pages}</span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Abstract Modal */}
      <Dialog open={!!activePaper} onOpenChange={(open) => !open && setActivePaper(null)}>
        {activePaper && (
          <DialogContent className="max-w-xl text-right dir-rtl">
            <DialogHeader className="text-right">
              <span className="text-xs text-primary font-semibold">
                {activePaper.category}
              </span>
              <DialogTitle className="font-display text-2xl font-bold mt-1">
                {activePaper.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {(activePaper.meta as any)?.status || "بحث مستقل"}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-sm font-sans leading-relaxed text-foreground/90 max-h-[60vh] overflow-y-auto">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                ملخص البحث والخلفية:
              </h4>
              <p className="whitespace-pre-line">{activePaper.body || activePaper.excerpt}</p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
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
                onClick={() => alert("يبدأ تحميل الورقة البحثية بصيغة PDF...")}
                className="text-xs gap-1.5 bg-primary text-primary-foreground"
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
