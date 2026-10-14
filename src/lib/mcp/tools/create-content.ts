import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { slugify } from "@/lib/site-types";

export default defineTool({
  name: "create_content",
  title: "Create site content",
  description: "Add a book, project, article, research paper or gallery photo to the site (admin only). Saved as draft unless status is 'published'.",
  inputSchema: {
    type: z.enum(["book", "project", "article", "research", "gallery"]).describe("Content type."),
    title: z.string().trim().min(1).max(300).describe("Title."),
    excerpt: z.string().max(1000).optional().describe("Short summary."),
    body: z.string().max(100000).optional().describe("Full text (Markdown)."),
    category: z.string().max(100).optional().describe("Category."),
    tags: z.array(z.string().max(50)).max(30).optional().describe("Tags."),
    cover_url: z.string().url().optional().describe("Cover or photo image URL."),
    links: z.array(z.object({ label: z.string().max(60), url: z.string().url() })).max(10).optional().describe("Links such as GitHub or demo."),
    meta: z.record(z.string(), z.string().max(200)).optional().describe("Extra details, e.g. year, pages, publisher, readTime, license, camera, location."),
    status: z.enum(["published", "draft"]).optional().describe("Publish now or keep as draft (default draft)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    const status = input.status ?? "draft";
    const { data, error } = await supabaseForUser(ctx)
      .from("content_items")
      .insert({
        type: input.type,
        title: input.title,
        slug: `${slugify(input.title) || "item"}-${Date.now().toString(36)}`,
        excerpt: input.excerpt ?? "",
        body: input.body ?? "",
        category: input.category ?? "",
        tags: input.tags ?? [],
        cover_url: input.cover_url ?? null,
        links: input.links ?? [],
        meta: input.meta ?? {},
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select("id, slug, status")
      .single();
    if (error) throw new ToolError(`Could not save (only the site admin can add content): ${error.message}`);
    return {
      content: [{ type: "text", text: `Saved "${input.title}" as ${data.status} (id ${data.id}).` }],
      structuredContent: { id: data.id, slug: data.slug, status: data.status },
    };
  },
});
