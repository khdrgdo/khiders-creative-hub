import { Link } from "@tanstack/react-router";
import { Code2, Github, ExternalLink, ArrowLeft, Terminal, GitFork, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContentItem } from "@/lib/site-types";

interface ProjectsSectionProps {
  projects: ContentItem[];
  showHeading?: boolean;
  limit?: number;
}

export function ProjectsSection({ projects, showHeading = true, limit }: ProjectsSectionProps) {
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <section className="py-12 sm:py-16">
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-num font-mono text-xs">SECTION 02</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs font-sans text-primary font-semibold">المصادر المفتوحة</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              المشاريع البرمجية الحرة
            </h2>
          </div>
          <Link
            to="/projects"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:underline font-semibold"
          >
            <span>كل المشاريع والمستودعات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayProjects.map((project, idx) => {
          const meta = (project.meta || {}) as Record<string, string>;
          const links = (project.links || []) as Array<{ label: string; url: string }>;
          const projIndex = String(idx + 1).padStart(2, "0");

          return (
            <article
              key={project.id}
              className="group flex flex-col justify-between border-b border-border transition-all duration-300 overflow-hidden"
            >
              {/* Project Screenshot / Cover if provided */}
              {project.cover_url && (
                <div className="relative aspect-video w-full overflow-hidden bg-muted/30 border-b border-border/50">
                  <img
                    src={project.cover_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Body */}
              <div className="py-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground font-medium text-[11px]">
                      {project.category || "برمجيات مفتوحة"}
                    </span>
                    {meta["license"] && (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {meta["license"]}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                    {project.excerpt}
                  </p>
                </div>

                {/* Stack Badges */}
                {project.tags && project.tags.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-muted/70 text-foreground border border-border/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Footer Action */}
              <div className="py-3 border-t border-border/40 flex flex-wrap gap-2 items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {links.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                  {links.length === 0 && (
                    <a
                      href="https://github.com/khdrgdo"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>مستودع الكود</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Cpu className="w-3 h-3 text-primary" />
                  <span>{meta["status"] || "نشط"}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
