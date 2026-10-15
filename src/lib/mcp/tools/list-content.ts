import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { requireAdmin, toItemJson, CONTENT_TYPES } from "../admin";

export default defineTool({
  name: "list_content",
  title: "List site content",
  description: "List content items (admin only), filtered by type and status (published, draft or trash), optionally with all fields.",
  inputSchema: {
    type: z.enum(CONTENT_TYPES).optional().describe("Content type filter."),
    status: z.enum(["published", "draft", "trash", "all"]).optional().describe("Status filter (default: all non-deleted)."),
    full: z.boolean().optional().describe("Return every field (body, tags, links, meta)."),
    limit: z.number().int().min(1).max(100).optional().describe("Max items (default 30)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ type, status, full, limit }, ctx) => {
    const supabase = await requireAdmin(ctx);
    let q = supabase.from("content_items").select("*").order("created_at", { ascending: false }).limit(limit ?? 30);
    if (type) q = q.eq("type", type);
    if (status === "trash") q = q.not("deleted_at", "is", null);
    else {
      q = q.is("deleted_at", null);
      if (status === "published" || status === "draft") q = q.eq("status", status);
    }
    const { data, error } = await q;
    if (error) throw new ToolError(error.message);
    const rows = (data ?? []).map(toItemJson);
    const items = full ? rows : rows.map((r) => ({ id: r.id, type: r.type, title: r.title, slug: r.slug, status: r.status, published_at: r.published_at, deleted_at: r.deleted_at }));
    return {
      content: [{ type: "text", text: items.length ? (full ? JSON.stringify(items, null, 2) : rows.map((i) => `${i.id} [${i.type}] ${i.title} (${i.deleted_at ? "trash" : i.status})`).join("\n")) : "No items." }],
      structuredContent: { items },
    };
  },
});
