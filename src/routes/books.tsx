import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { homeContentQuery } from "@/lib/queries";
import { filterByType } from "@/lib/content-helper";
import { BooksSection } from "@/components/public/BooksSection";
import type { ContentItem } from "@/lib/site-types";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "الكتب والإصدارات | خضر مأمون" },
      {
        name: "description",
        content: "الكتب الفلسفية والأدبية والتقنية المنشورة للكاتب خضر مأمون مع إمكانية التحميل المباشر.",
      },
    ],
  }),
  component: BooksPage,
});

function BooksPage() {
  const { data: items } = useQuery(homeContentQuery);
  const books = filterByType(items as ContentItem[], "book");

  return (
    <div className="py-8 sm:py-16 space-y-10">
      <div className="max-w-2xl space-y-3 pb-6 border-b border-border/60">
        <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block">
          المكتبة الشخصية
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground">
          الكتب والدراسات المنشورة
        </h1>
        <p className="text-sm sm:text-base font-sans text-muted-foreground leading-relaxed">
          إصدارات ودراسات مستقلة تبحث في فلسفة التقنية، أدب المكان والذاكرة،
          ومعمارية البرمجيات البسيطة. جميع النسخ الرقمية متاحة للتحميل مجاناً
          دعماً للمعرفة الحرة.
        </p>
      </div>

      <BooksSection books={books} showHeading={false} />
    </div>
  );
}
