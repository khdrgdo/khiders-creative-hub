import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { requireAdmin, audit } from "../admin";

export default defineTool({
  name: "set_content_status",
  title: "Publish or unpublish content",
  description: "Change a content item's status to published or draft (admin only).",
  inputSchema: {
    id: z.string().uuid().describe("Content item id from list_content."),
    status: z.enum(["published", "draft"]).describe("New status."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, status }, ctx) => {
    const supabase = await requireAdmin(ctx);
    const patch = status === "published" ? { status, published_at: new Date().toISOString() } : { status };
    const { data, error } = await supabase.from("content_items").update(patch).eq("id", id).is("deleted_at", null).select("id, title").maybeSingle();
    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError("Item not found (or it is in the trash).");
    await audit(supabase, ctx, "set_content_status", id, { status });
    return { content: [{ type: "text", text: `"${data.title}" is now ${status}.` }] };
  },
});
