import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { requireAdmin, audit, CONTENT_TYPES } from "../admin";

export default defineTool({
  name: "update_content",
  title: "Update content item",
  description: "Edit fields of an existing content item in place (admin only). Only the fields you pass are changed.",
  inputSchema: {
    id: z.string().uuid().describe("Content item id."),
    type: z.enum(CONTENT_TYPES).optional(),
    title: z.string().trim().min(1).max(300).optional(),
    slug: z.string().trim().min(1).max(120).optional(),
    excerpt: z.string().max(1000).optional(),
    body: z.string().max(100000).optional(),
    category: z.string().max(100).optional(),
    tags: z.array(z.string().max(50)).max(30).optional(),
    cover_url: z.string().url().nullable().optional(),
    images: z.array(z.string().url()).max(50).optional(),
    links: z.array(z.object({ label: z.string().max(60), url: z.string().url() })).max(10).optional(),
    meta: z.record(z.string(), z.string().max(200)).optional().describe("Replaces meta entirely."),
    status: z.enum(["published", "draft"]).optional(),
    featured: z.boolean().optional(),
    sort_order: z.number().int().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, ...fields }, ctx) => {
    const supabase = await requireAdmin(ctx);
    const patch: Record<string, unknown> = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    if (Object.keys(patch).length === 0) throw new ToolError("No fields to update.");
    const { data: before } = await supabase.from("content_items").select("status, published_at, deleted_at").eq("id", id).maybeSingle();
    if (!before) throw new ToolError("Item not found.");
    if (before.deleted_at) throw new ToolError("Item is in the trash; restore it first.");
    if (patch["status"] === "published" && !before.published_at) patch["published_at"] = new Date().toISOString();
    const { data, error } = await supabase.from("content_items").update(patch).eq("id", id).select("id, title, status").maybeSingle();
    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError("Item not found.");
    await audit(supabase, ctx, "update_content", id, { fields: Object.keys(patch) });
    return {
      content: [{ type: "text", text: `Updated "${data.title}" (${Object.keys(patch).join(", ")}).` }],
      structuredContent: { id: data.id, updated_fields: Object.keys(patch) },
    };
  },
});
