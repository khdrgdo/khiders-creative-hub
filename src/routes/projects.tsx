import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { homeContentQuery } from "@/lib/queries";
import { filterByType } from "@/lib/content-helper";
import { useLiveContent } from "@/lib/content-store";
import { ProjectsSection } from "@/components/public/ProjectsSection";
import type { ContentItem } from "@/lib/site-types";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "المشاريع البرمجية الحرة | خضر مأمون" },
      {
        name: "description",
        content: "المشاريع البرمجية مفتوحة المصدر، معالجة اللغات الطبيعية العربية، والأنظمة المستقلة.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: items } = useQuery(homeContentQuery);
  const liveItems = useLiveContent((items as ContentItem[]) || []);
  const projects = filterByType(liveItems, "project");

  return (
    <div className="py-8 sm:py-16 space-y-10">
      <div className="max-w-2xl space-y-3 pb-6 border-b border-border/60">
        <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block">
          شفرات وأدوات
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground">
          المشاريع البرمجية المفتوحة
        </h1>
        <p className="text-sm sm:text-base font-sans text-muted-foreground leading-relaxed">
          نظم وأدوات برمجية بُنيت وفق مبادئ المصدر المفتوح وحماية الخصوصية،
          مع التركيز على دعم اللغة العربية وهندسة المعرفة الرقمية.
        </p>
      </div>

      <ProjectsSection projects={projects} showHeading={false} />
    </div>
  );
}
