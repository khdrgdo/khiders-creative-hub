import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { homeContentQuery } from "@/lib/queries";
import { filterByType } from "@/lib/content-helper";
import { WritingSection } from "@/components/public/WritingSection";
import type { ContentItem } from "@/lib/site-types";

export const Route = createFileRoute("/writing")({
  head: () => ({
    meta: [
      { title: "الكتابات والمقالات | خضر مأمون" },
      {
        name: "description",
        content: "مقالات، رؤى، وتأملات فكرية وفلسفية حول التقنية، الإنسان، واللغة بقلم خضر مأمون.",
      },
    ],
  }),
  component: WritingPage,
});

function WritingPage() {
  const { data: items } = useQuery(homeContentQuery);
  const articles = filterByType(items as ContentItem[], "article");

  return (
    <div className="py-8 sm:py-16 space-y-10">
      <div className="max-w-2xl space-y-3 pb-6 border-b border-border/60">
        <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block">
          أفكار وشذرات
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground">
          المقالات والكتابات الفكرية
        </h1>
        <p className="text-sm sm:text-base font-sans text-muted-foreground leading-relaxed">
          نصوص مطولة وتأملات دورية حول تقاطعات التكنولوجيا والمجتمع، نقد
          العقل الخوارزمي، وذاكرة المكان السوداني.
        </p>
      </div>

      <WritingSection articles={articles} showHeading={false} />
    </div>
  );
}
