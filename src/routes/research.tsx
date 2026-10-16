import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { homeContentQuery } from "@/lib/queries";
import { filterByType } from "@/lib/content-helper";
import { useLiveContent } from "@/lib/content-store";
import { ResearchSection } from "@/components/public/ResearchSection";
import type { ContentItem } from "@/lib/site-types";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { property: "og:title", content: "الأبحاث والدراسات المستقلة | خضر مأمون" },
      { property: "og:description", content: "الأبحاث الأكاديمية والمستقلة في اللسانيات الحاسوبية، الصرف العربي، والسيادة الرقمية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "الأبحاث والدراسات المستقلة | خضر مأمون" },
      {
        name: "description",
        content: "الأبحاث الأكاديمية والمستقلة في اللسانيات الحاسوبية، الصرف العربي، والسيادة الرقمية.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const { data: items } = useQuery(homeContentQuery);
  const liveItems = useLiveContent((items as ContentItem[]) || []);
  const research = filterByType(liveItems, "research");

  return (
    <div className="py-8 sm:py-16 space-y-10">
      <div className="max-w-2xl space-y-3 pb-6 border-b border-border/60">
        <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block">
          بحث مستقل
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground">
          الأبحاث والأوراق المحكمة
        </h1>
        <p className="text-sm sm:text-base font-sans text-muted-foreground leading-relaxed">
          دراسات معمقة وأوراق عمل في حوسبة اللسان العربي، ونماذج المعالجة
          اللغوية، وقضايا الاستقلال المعرفي والاقتصاد السياسي للتكنولوجيا.
        </p>
      </div>

      <ResearchSection research={research} showHeading={false} />
    </div>
  );
}
