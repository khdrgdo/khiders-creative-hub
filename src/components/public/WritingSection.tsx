import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Feather, Clock, ArrowLeft, BookOpen, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/site-types";
import type { ContentItem } from "@/lib/site-types";

interface WritingSectionProps {
  articles: ContentItem[];
  showHeading?: boolean;
  limit?: number;
}

export function WritingSection({ articles, showHeading = true, limit }: WritingSectionProps) {
  const [readingArticle, setReadingArticle] = useState<ContentItem | null>(null);
  const [copied, setCopied] = useState(false);
  const displayArticles = limit ? articles.slice(0, limit) : articles;

  function copyArticleLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin + "/writing");
      setCopied(true);
      toast.success("تم نسخ رابط المقال!");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section className="py-12 sm:py-16">
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-num font-mono text-xs">SECTION 03</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs font-sans text-primary font-semibold">الكتابات والتأملات</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              المقالات والأفكار
            </h2>
          </div>
          <Link
            to="/writing"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:underline font-semibold"
          >
            <span>أرشيف كل المقالات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="divide-y divide-border/60">
        {displayArticles.map((article, idx) => {
          const meta = (article.meta || {}) as Record<string, string>;
          const articleNum = String(idx + 1).padStart(2, "0");

          return (
            <article
              key={article.id}
              onClick={() => setReadingArticle(article)}
              className="group py-7 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-baseline justify-between gap-6 cursor-pointer hover:bg-card/70 px-4 -mx-4 rounded-2xl transition-all duration-200"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-mono text-primary font-bold">{articleNum}</span>
                  <span className="font-sans">{formatDate(article.published_at)}</span>
                  {meta["readTime"] && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {meta["readTime"]}
                      </span>
                    </>
                  )}
                  {article.category && (
                    <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-medium">
                      {article.category}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-sm sm:text-base font-sans text-muted-foreground leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>

              <div className="shrink-0 pt-2 md:pt-0">
                <span className="inline-flex items-center gap-1.5 text-xs text-primary font-bold group-hover:underline">
                  <span>قراءة المقال</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-200" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Reader Dialog */}
      <Dialog open={!!readingArticle} onOpenChange={(open) => !open && setReadingArticle(null)}>
        {readingArticle && (
          <DialogContent className="max-w-2xl text-right dir-rtl p-6 sm:p-12 max-h-[88vh] overflow-y-auto">
            <DialogHeader className="text-right pb-6 border-b border-border/60">
              <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <span>{formatDate(readingArticle.published_at)}</span>
                  <span>•</span>
                  <span className="text-primary font-semibold">{readingArticle.category}</span>
                  <span>•</span>
                  <span>{(readingArticle.meta as any)?.readTime || "5 دقائق قراءة"}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyArticleLink}
                  className="h-7 px-2.5 text-xs gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-foreground" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? "تم النسخ" : "مشاركة"}</span>
                </Button>
              </div>

              <DialogTitle className="font-display text-3xl sm:text-4xl font-bold leading-tight">
                {readingArticle.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-2">
                بقلم: خضر مأمون — مبرمج، كاتب، وباحث مستقل
              </DialogDescription>
            </DialogHeader>

            {/* Article body in prose-ar */}
            <div className="py-8 prose-ar text-foreground/90 leading-[2.2] text-base sm:text-lg">
              <p className="whitespace-pre-line">{readingArticle.body || readingArticle.excerpt}</p>
            </div>

            {readingArticle.tags && readingArticle.tags.length > 0 && (
              <div className="pt-6 border-t border-border flex flex-wrap gap-2 text-xs">
                {readingArticle.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-md bg-accent text-accent-foreground font-sans">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
