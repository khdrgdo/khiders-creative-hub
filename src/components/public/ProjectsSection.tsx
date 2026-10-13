import { Link } from "@tanstack/react-router";
import { Code2, Github, ExternalLink, ArrowLeft, Star } from "lucide-react";
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
    <section className="py-12">
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-border/60">
          <div>
            <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block mb-1">
              هندسة البرمجيات
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              المشاريع البرمجية الحرة
            </h2>
          </div>
          <Link
            to="/projects"
            className="mt-2 sm:mt-0 inline-flex items-center gap-1 text-xs sm:text-sm text-primary hover:underline font-medium"
          >
            <span>عرض كل المشاريع</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayProjects.map((project) => {
          const meta = (project.meta || {}) as Record<string, string>;
          const links = (project.links || []) as Array<{ label: string; url: string }>;

          return (
            <article
              key={project.id}
              className="flex flex-col justify-between p-6 rounded-2xl border border-border/70 hover:border-primary/40 bg-card hover:bg-card/90 transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans bg-accent/80 text-accent-foreground font-medium">
                    {project.category || "برمجيات مفتوحة"}
                  </span>
                  {meta.status && (
                    <span className="text-[11px] text-muted-foreground/80">
                      {meta.status}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl font-bold text-foreground hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                  {project.excerpt}
                </p>

                {/* Tech tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-muted text-foreground/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="pt-6 mt-4 border-t border-border/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                  {links.length === 0 && (
                    <a
                      href="https://github.com/khdrgdo"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>مستودع الكود</span>
                    </a>
                  )}
                </div>

                {meta.license && (
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {meta.license}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
