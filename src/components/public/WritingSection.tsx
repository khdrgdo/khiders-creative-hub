import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Feather, Clock, ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/site-types";
import type { ContentItem } from "@/lib/site-types";

interface WritingSectionProps {
  articles: ContentItem[];
  showHeading?: boolean;
  limit?: number;
}

export function WritingSection({ articles, showHeading = true, limit }: WritingSectionProps) {
  const [readingArticle, setReadingArticle] = useState<ContentItem | null>(null);
  const displayArticles = limit ? articles.slice(0, limit) : articles;

  return (
    <section className="py-12">
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-border/60">
          <div>
            <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block mb-1">
              المقالات والرؤى
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              كتابات وتأملات فكرية
            </h2>
          </div>
          <Link
            to="/writing"
            className="mt-2 sm:mt-0 inline-flex items-center gap-1 text-xs sm:text-sm text-primary hover:underline font-medium"
          >
            <span>عرض كل الكتابات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="divide-y divide-border/60">
        {displayArticles.map((article) => {
          const meta = (article.meta || {}) as Record<string, string>;

          return (
            <article
              key={article.id}
              onClick={() => setReadingArticle(article)}
              className="group py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-baseline justify-between gap-4 cursor-pointer hover:bg-muted/30 px-3 -mx-3 rounded-xl transition-colors duration-150"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-sans">{formatDate(article.published_at)}</span>
                  {meta.readTime && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meta.readTime}
                      </span>
                    </>
                  )}
                  {article.category && (
                    <>
                      <span>•</span>
                      <span className="text-primary font-medium">{article.category}</span>
                    </>
                  )}
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                <p className="text-sm font-sans text-muted-foreground leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>

              <div className="shrink-0 pt-2 md:pt-0">
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:underline">
                  <span>قراءة المقال</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Reader Dialog */}
      <Dialog open={!!readingArticle} onOpenChange={(open) => !open && setReadingArticle(null)}>
        {readingArticle && (
          <DialogContent className="max-w-2xl text-right dir-rtl p-6 sm:p-10 max-h-[85vh] overflow-y-auto">
            <DialogHeader className="text-right pb-4 border-b border-border/60">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span>{formatDate(readingArticle.published_at)}</span>
                <span>•</span>
                <span className="text-primary font-semibold">{readingArticle.category}</span>
              </div>
              <DialogTitle className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                {readingArticle.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                بقلم: خضر مأمون
              </DialogDescription>
            </DialogHeader>

            {/* Article body in prose-ar */}
            <div className="py-6 prose-ar text-foreground/90 leading-[2.1] text-base sm:text-lg">
              <p className="whitespace-pre-line">{readingArticle.body || readingArticle.excerpt}</p>
            </div>

            {readingArticle.tags && readingArticle.tags.length > 0 && (
              <div className="pt-4 border-t border-border flex flex-wrap gap-2 text-xs">
                {readingArticle.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
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
