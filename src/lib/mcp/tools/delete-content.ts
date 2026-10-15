import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { requireAdmin, audit } from "../admin";

export default defineTool({
  name: "delete_content",
  title: "Move content to trash",
  description: "Soft-delete a content item: it moves to the trash and disappears from the site, but can be restored with restore_content (admin only).",
  inputSchema: { id: z.string().uuid().describe("Content item id.") },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    const supabase = await requireAdmin(ctx);
    const { data, error } = await supabase.from("content_items").update({ deleted_at: new Date().toISOString() }).eq("id", id).is("deleted_at", null).select("id, title").maybeSingle();
    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError("Item not found or already in the trash.");
    await audit(supabase, ctx, "delete_content", id, { title: data.title });
    return { content: [{ type: "text", text: `"${data.title}" moved to trash.` }] };
  },
});
