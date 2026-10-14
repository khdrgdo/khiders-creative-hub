import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_messages",
  title: "Read contact messages",
  description: "Read the latest messages visitors sent through the contact form (admin only).",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("How many messages (default 10)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    const { data, error } = await supabaseForUser(ctx)
      .from("contact_messages")
      .select("id, name, email, subject, message, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);
    if (error) throw new ToolError(error.message);
    const messages = (data ?? []).map((m) => ({ ...m }));
    return {
      content: [{ type: "text", text: messages.length ? messages.map((m) => `${m.created_at} — ${m.name} <${m.email}>: ${m.subject}\n${m.message}`).join("\n---\n") : "No messages (or you are not the site admin)." }],
      structuredContent: { messages },
    };
  },
});
