import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { requireAdmin, audit } from "../admin";

export default defineTool({
  name: "restore_content",
  title: "Restore content from trash",
  description: "Restore a soft-deleted content item from the trash (admin only).",
  inputSchema: { id: z.string().uuid().describe("Content item id.") },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    const supabase = await requireAdmin(ctx);
    const { data, error } = await supabase.from("content_items").update({ deleted_at: null }).eq("id", id).not("deleted_at", "is", null).select("id, title, status").maybeSingle();
    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError("Item not found in the trash.");
    await audit(supabase, ctx, "restore_content", id, { title: data.title });
    return { content: [{ type: "text", text: `"${data.title}" restored (${data.status}).` }] };
  },
});
