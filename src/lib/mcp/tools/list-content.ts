import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_content",
  title: "List site content",
  description: "List books, projects, articles, research or gallery items on the site, optionally filtered by type and status.",
  inputSchema: {
    type: z.enum(["book", "project", "article", "research", "gallery"]).optional().describe("Content type filter."),
    status: z.enum(["published", "draft"]).optional().describe("Status filter."),
    limit: z.number().int().min(1).max(100).optional().describe("Max items (default 30)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ type, status, limit }, ctx) => {
    let q = supabaseForUser(ctx)
      .from("content_items")
      .select("id, type, title, slug, status, published_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 30);
    if (type) q = q.eq("type", type);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) throw new ToolError(error.message);
    const items = (data ?? []).map((r) => ({
      id: r.id, type: r.type, title: r.title, slug: r.slug, status: r.status, published_at: r.published_at,
    }));
    return {
      content: [{ type: "text", text: items.length ? items.map((i) => `${i.id} [${i.type}] ${i.title} (${i.status})`).join("\n") : "No items." }],
      structuredContent: { items },
    };
  },
});
