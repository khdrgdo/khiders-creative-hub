import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Download, ArrowLeft, Bookmark, FileText } from "lucide-react";
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
    <section className="py-12 sm:py-16">
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-num font-mono text-xs">SECTION 01</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs font-sans text-primary font-semibold">المؤلفات المنشورة</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              الكتب والدراسات الفكرية
            </h2>
          </div>
          <Link
            to="/books"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:underline font-semibold"
          >
            <span>الأرشيف الكامل للكتب</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="space-y-12">
        {displayBooks.map((book, idx) => {
          const meta = (book.meta || {}) as Record<string, string>;
          const bookIndex = String(idx + 1).padStart(2, "0");

          return (
            <article
              key={book.id}
              className="group relative p-6 sm:p-8 rounded-2xl border border-border/70 bg-card hover:border-primary/50 transition-all duration-300 shadow-sm"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* 3D Book Cover Presentation */}
                <div className="relative shrink-0">
                  <div className="book-cover-3d w-44 sm:w-48 h-64 sm:h-72 rounded-r-sm rounded-l-md overflow-hidden bg-muted border border-border/80">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent to-muted flex items-center justify-center p-4 text-center font-display text-primary font-bold">
                        {book.title}
                      </div>
                    )}
                    {/* Spine highlight band */}
                    <div className="absolute inset-y-0 right-0 w-3.5 bg-black/25 pointer-events-none" />
                  </div>

                  {/* Bookmark badge */}
                  <div className="absolute -top-2 left-4 w-7 h-9 bg-primary text-primary-foreground flex items-center justify-center rounded-b-md shadow-md">
                    <Bookmark className="w-4 h-4 fill-current" />
                  </div>
                </div>

                {/* Editorial Content Column */}
                <div className="flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-mono text-primary font-bold">{bookIndex}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground font-medium text-[11px]">
                        {book.category || "إصدار كتاب"}
                      </span>
                      {meta.year && (
                        <span className="text-muted-foreground">{meta.year}</span>
                      )}
                      {meta.pages && (
                        <span className="text-muted-foreground">• {meta.pages}</span>
                      )}
                      {meta.publisher && (
                        <span className="text-muted-foreground">• {meta.publisher}</span>
                      )}
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {book.title}
                    </h3>

                    <p className="text-sm sm:text-base font-sans text-muted-foreground leading-relaxed">
                      {book.excerpt}
                    </p>

                    {/* Pull-quote / highlight */}
                    <blockquote className="my-3 ps-4 border-s-2 border-primary/50 text-sm font-display text-foreground/90 italic bg-accent/20 py-1.5 rounded-e-lg">
                      «محاولة لإعادة تعريف العلاقة بين الإنسان والآلة من منظور لغوي وفلسفي خالص.»
                    </blockquote>
                  </div>

                  {/* Action Toolbar */}
                  <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBook(book)}
                      className="text-xs h-9 px-4 gap-2 border-border hover:border-primary/50"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      <span>قراءة الفصول والمقدمة</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => {
                        alert("يبدأ تنزيل النسخة الرقمية الكاملة للكتاب بصيغة PDF...");
                      }}
                      className="text-xs h-9 px-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل الكتاب كاملاً (PDF)</span>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Book Reader Modal */}
      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        {selectedBook && (
          <DialogContent className="max-w-2xl text-right dir-rtl p-6 sm:p-10 max-h-[85vh] overflow-y-auto">
            <DialogHeader className="text-right pb-4 border-b border-border/60">
              <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-1">
                <span>{selectedBook.category}</span>
                <span>•</span>
                <span>{(selectedBook.meta as any)?.year || "2024"}</span>
              </div>
              <DialogTitle className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                {selectedBook.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                {(selectedBook.meta as any)?.publisher || "إصدار مستقل"} • {(selectedBook.meta as any)?.pages || "248 صفحة"}
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4 text-base font-sans leading-loose text-foreground/90">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                مقدمة عن الكتاب وفصوله:
              </h4>
              <p className="whitespace-pre-line">{selectedBook.body || selectedBook.excerpt}</p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
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
                onClick={() => alert("يبدأ تحميل الكتاب بصيغة PDF...")}
                className="text-xs gap-2 bg-primary text-primary-foreground font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل PDF (مجاناً)</span>
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
