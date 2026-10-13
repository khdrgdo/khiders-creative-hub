import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { siteQuery, homeContentQuery } from "@/lib/queries";
import { mergeSettings, filterByType } from "@/lib/content-helper";
import { HeroSection } from "@/components/public/HeroSection";
import { BooksSection } from "@/components/public/BooksSection";
import { ProjectsSection } from "@/components/public/ProjectsSection";
import { WritingSection } from "@/components/public/WritingSection";
import { ResearchSection } from "@/components/public/ResearchSection";
import { GallerySection } from "@/components/public/GallerySection";
import { ContactSection } from "@/components/public/ContactSection";
import type { ContentItem } from "@/lib/site-types";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const { data: siteData } = useQuery(siteQuery);
  const { data: homeItems } = useQuery(homeContentQuery);

  const settings = mergeSettings(siteData?.settings);
  const items = (homeItems as ContentItem[]) || [];

  const books = filterByType(items, "book");
  const projects = filterByType(items, "project");
  const articles = filterByType(items, "article");
  const research = filterByType(items, "research");
  const gallery = filterByType(items, "gallery");

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero */}
      <HeroSection settings={settings} />

      <div className="rule-ornament" />

      {/* 2. Featured Books */}
      <BooksSection books={books} limit={2} />

      <div className="rule-ornament" />

      {/* 3. Selected Software Projects */}
      <ProjectsSection projects={projects} limit={2} />

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
