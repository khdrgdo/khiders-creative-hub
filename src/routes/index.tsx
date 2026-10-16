import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { siteQuery, homeContentQuery } from "@/lib/queries";
import { mergeSettings, filterByType } from "@/lib/content-helper";
import { useLiveContent, useLiveSettings } from "@/lib/content-store";
import { HeroSection } from "@/components/public/HeroSection";
import { BooksSection } from "@/components/public/BooksSection";
import { ProjectsSection } from "@/components/public/ProjectsSection";
import { WritingSection } from "@/components/public/WritingSection";
import { ResearchSection } from "@/components/public/ResearchSection";
import { GallerySection } from "@/components/public/GallerySection";
import { ContactSection } from "@/components/public/ContactSection";
import type { ContentItem } from "@/lib/site-types";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "خضر مأمون | برمجة وكتابة وبحث مستقل" },
    { name: "description", content: "الأعمال المختارة والكتب والكتابات والأبحاث المستقلة لخضر مأمون." },
    { property: "og:title", content: "خضر مأمون | برمجة وكتابة وبحث مستقل" },
    { property: "og:description", content: "الأعمال المختارة والكتب والكتابات والأبحاث المستقلة لخضر مأمون." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: IndexPage,
});

function IndexPage() {
  const { data: siteData } = useQuery(siteQuery);
  const { data: homeItems } = useQuery(homeContentQuery);

  const settings = useLiveSettings(mergeSettings(siteData?.settings));
  const items = useLiveContent((homeItems as ContentItem[]) || []);

  const books = filterByType(items, "book");
  const projects = filterByType(items, "project");
  const articles = filterByType(items, "article");
  const research = filterByType(items, "research");
  const gallery = filterByType(items, "gallery");

  return (
    <div className="editorial-home">
      {/* 1. Hero */}
      <HeroSection settings={settings} />

      <div className="rule-ornament" />

      <ProjectsSection projects={projects} limit={4} />
      <section className="editorial-skills">
        <div><h2 className="font-display font-bold mb-5">المهارات <span className="text-primary">والخبرات</span></h2><ul className="text-sm">{settings.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div>
        <div><h2 className="font-display font-bold mb-5">الفكر <span className="text-primary">والاهتمامات</span></h2><ul className="text-sm">{settings.interests.map((interest) => <li key={interest}>{interest}</li>)}</ul></div>
      </section>
      <BooksSection books={books} limit={2} />

      <div className="rule-ornament" />

      {/* 3. Selected Software Projects */}


      <div className="rule-ornament" />

      {/* 4. Latest Articles */}
      <WritingSection articles={articles} limit={3} />

      <div className="rule-ornament" />

      {/* 5. Independent Research */}
      <ResearchSection research={research} limit={2} />

      <div className="rule-ornament" />

      {/* 6. Photography / Visual Gallery */}
      <GallerySection items={gallery} limit={3} />

      <div className="rule-ornament" />

      {/* 7. Direct Contact */}
      <ContactSection email={settings.email} />
    </div>
  );
}
