import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { homeContentQuery } from "@/lib/queries";
import { filterByType } from "@/lib/content-helper";
import { useLiveContent } from "@/lib/content-store";
import { GallerySection } from "@/components/public/GallerySection";
import type { ContentItem } from "@/lib/site-types";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { property: "og:title", content: "معرض الصور والأعمال البصرية | خضر مأمون" },
      { property: "og:description", content: "لقطات فوتوغرافية ومشاهد توثيقية من السودان ودفاتر الترحال بعدسة خضر مأمون." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "معرض الصور والأعمال البصرية | خضر مأمون" },
      {
        name: "description",
        content: "لقطات فوتوغرافية ومشاهد توثيقية من السودان ودفاتر الترحال بعدسة خضر مأمون.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data: items } = useQuery(homeContentQuery);
  const liveItems = useLiveContent((items as ContentItem[]) || []);
  const gallery = filterByType(liveItems, "gallery");

  return (
    <div className="py-8 sm:py-16 space-y-10">
      <div className="max-w-2xl space-y-3 pb-6 border-b border-border/60">
        <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block">
          مشاهد وبصريات
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground">
          معرض الصور واللقطات
        </h1>
        <p className="text-sm sm:text-base font-sans text-muted-foreground leading-relaxed">
          شذرات بصرية توثق أماكن حميمة وتفاصيل من التراث والذاكرة، بين ضفاف
          النيل وعوالم الكتب والسكينة.
        </p>
      </div>

      <GallerySection items={gallery} showHeading={false} />
    </div>
  );
}
