import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { requireAdmin, toItemJson } from "../admin";

export default defineTool({
  name: "get_content",
  title: "Get content item",
  description: "Return every field of one content item, including body, tags, links and meta (admin only).",
  inputSchema: { id: z.string().uuid().describe("Content item id.") },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    const supabase = await requireAdmin(ctx);
    const { data, error } = await supabase.from("content_items").select("*").eq("id", id).maybeSingle();
    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError("Item not found.");
    const item = toItemJson(data);
    return { content: [{ type: "text", text: JSON.stringify(item, null, 2) }], structuredContent: { item } };
  },
});
