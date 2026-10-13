import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookMarked, Download, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ContentItem } from "@/lib/site-types";

interface BooksSectionProps {
  books: ContentItem[];
  showHeading?: boolean;
  limit?: number;
}

export function BooksSection({ books, showHeading = true, limit }: BooksSectionProps) {
  const [selectedBook, setSelectedBook] = useState<ContentItem | null>(null);
  const displayBooks = limit ? books.slice(0, limit) : books;

  return (
    <section className="py-12">
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-border/60">
          <div>
            <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block mb-1">
              الإنتاج الفكري
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              الكتب والدراسات المنشورة
            </h2>
          </div>
          <Link
            to="/books"
            className="mt-2 sm:mt-0 inline-flex items-center gap-1 text-xs sm:text-sm text-primary hover:underline font-medium"
          >
            <span>عرض كل الكتب</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="space-y-8">
        {displayBooks.map((book) => {
          const meta = (book.meta || {}) as Record<string, string>;

          return (
            <article
              key={book.id}
              className="group flex flex-col md:flex-row gap-6 p-5 sm:p-6 rounded-2xl border border-border/70 hover:border-primary/40 bg-card hover:bg-card/80 transition-all duration-200"
            >
              {/* Cover */}
              {book.cover_url && (
                <div className="w-full md:w-36 h-52 shrink-0 overflow-hidden rounded-xl bg-muted border border-border/60 shadow-sm">
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Book Details */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans bg-accent text-accent-foreground">
                      {book.category || "كتاب"}
                    </span>
                    {meta.year && (
                      <span className="text-xs text-muted-foreground">
                        {meta.year}
                      </span>
                    )}
                    {meta.pages && (
                      <span className="text-xs text-muted-foreground">
                        • {meta.pages}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>

                  <p className="text-sm font-sans text-muted-foreground leading-relaxed line-clamp-3">
                    {book.excerpt}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBook(book)}
                    className="text-xs h-8 gap-1.5 border-border hover:border-primary/50"
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>نبذة عن الكتاب</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => setSelectedBook(book)}
                    className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل النسخة الرقمية (PDF)</span>
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Book Detail Modal */}
      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        {selectedBook && (
          <DialogContent className="max-w-xl text-right dir-rtl">
            <DialogHeader className="text-right">
              <span className="text-xs text-primary font-semibold">
                {selectedBook.category}
              </span>
              <DialogTitle className="font-display text-2xl font-bold mt-1">
                {selectedBook.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {(selectedBook.meta as any)?.publisher || "إصدار مستقل"} •{" "}
                {(selectedBook.meta as any)?.year || "2024"}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-sm font-sans leading-relaxed text-foreground/90 max-h-[60vh] overflow-y-auto">
              <p className="whitespace-pre-line">{selectedBook.body || selectedBook.excerpt}</p>

              {selectedBook.tags && selectedBook.tags.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {selectedBook.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-muted text-[11px] text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBook(null)}
                className="text-xs"
              >
                إغلاق
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  alert("يبدأ تحميل ملف الكتاب الرقمي بصيغة PDF...");
                }}
                className="text-xs gap-1.5 bg-primary text-primary-foreground"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل PDF مجاناً</span>
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
