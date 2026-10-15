import { ToolError, type ToolContext } from "@lovable.dev/mcp-js";
import type { Tables } from "@/integrations/supabase/types";
import { supabaseForUser } from "./supabase";

/** Server-side admin gate: asks the database (is_admin) as the verified caller. */
export async function requireAdmin(ctx: ToolContext) {
  if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated.");
  const supabase = supabaseForUser(ctx);
  const { data, error } = await supabase.rpc("is_admin");
  if (error) throw new ToolError(`Admin check failed: ${error.message}`);
  if (data !== true) throw new ToolError("Only the site admin can use this tool.");
  return supabase;
}

type Client = Awaited<ReturnType<typeof requireAdmin>>;

export async function audit(
  supabase: Client,
  ctx: ToolContext,
  action: string,
  targetId: string | null,
  details: Record<string, unknown> = {},
) {
  const { error } = await supabase.from("audit_log").insert({
    user_id: ctx.getUserId()!,
    action,
    target_table: "content_items",
    target_id: targetId,
    details: JSON.parse(JSON.stringify(details)),
  });
  if (error) throw new ToolError(`Change saved but audit log failed: ${error.message}`);
}

export const CONTENT_TYPES = ["book", "project", "article", "research", "gallery"] as const;

export function toItemJson(r: Tables<"content_items">) {
  return {
    id: String(r.id),
    type: String(r.type),
    title: String(r.title ?? ""),
    slug: String(r.slug ?? ""),
    excerpt: String(r.excerpt ?? ""),
    body: String(r.body ?? ""),
    category: String(r.category ?? ""),
    tags: Array.isArray(r.tags) ? r.tags.map(String) : [],
    cover_url: r.cover_url == null ? null : String(r.cover_url),
    file_path: r.file_path == null ? null : String(r.file_path),
    images: Array.isArray(r.images) ? r.images.map(String) : [],
    links: Array.isArray(r.links)
      ? r.links.map((l) => ({ label: String((l as { label?: unknown })?.label ?? ""), url: String((l as { url?: unknown })?.url ?? "") }))
      : [],
    meta: Object.fromEntries(Object.entries((r.meta && typeof r.meta === "object" ? r.meta : {}) as Record<string, unknown>).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)])),
    status: String(r.status),
    featured: Boolean(r.featured),
    sort_order: Number(r.sort_order ?? 0),
    published_at: r.published_at == null ? null : String(r.published_at),
    created_at: String(r.created_at ?? ""),
    updated_at: String(r.updated_at ?? ""),
    deleted_at: r.deleted_at == null ? null : String(r.deleted_at),
  };
}
