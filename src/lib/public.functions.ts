import { createServerFn } from "@tanstack/react-start";
import { publicClient } from "./public-client";
import { normalizeSettings, type ContentType } from "./site-types";

const TYPES = ["book", "project", "article", "research", "gallery"];
function checkType(t: unknown): ContentType {
  if (typeof t !== "string" || !TYPES.includes(t)) throw new Error("Invalid type");
  return t as ContentType;
}
function checkSlug(s: unknown): string {
  if (typeof s !== "string" || s.length < 1 || s.length > 120) throw new Error("Invalid slug");
  return s;
}

export const getSite = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [s, h, p] = await Promise.all([
    sb.from("site_settings").select("data").eq("id", 1).maybeSingle(),
    sb.from("home_sections").select("*").order("sort_order"),
    sb.from("pages").select("slug,title").eq("show_in_nav", true).order("sort_order"),
  ]);
  if (s.error) throw new Error(s.error.message);
  return {
    settings: normalizeSettings(s.data?.data),
    sections: h.data ?? [],
    navPages: p.data ?? [],
  };
});

export const listContent = createServerFn({ method: "GET" })
  .inputValidator((d: { type: ContentType }) => ({ type: checkType(d?.type) }))
  .handler(async ({ data }) => {
    const { data: rows, error } = await publicClient()
      .from("content_items")
      .select("*")
      .eq("type", data.type)
      .order("sort_order")
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows;
  });

export const getHomeContent = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("content_items")
    .select("*")
    .order("featured", { ascending: false })
    .order("sort_order")
    .order("published_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data;
});

export const getContent = createServerFn({ method: "GET" })
  .inputValidator((d: { type: ContentType; slug: string }) => ({ type: checkType(d?.type), slug: checkSlug(d?.slug) }))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("content_items")
      .select("*")
      .eq("type", data.type)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const getPage = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => ({ slug: checkSlug(d?.slug) }))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient().from("pages").select("*").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

/** Issues a short-lived download link only for files attached to published items. */
export const getDownloadUrl = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => {
    if (typeof d?.id !== "string" || !/^[0-9a-f-]{36}$/.test(d.id)) throw new Error("Invalid id");
    return { id: d.id };
  })
  .handler(async ({ data }) => {
    // RLS on the public client only returns published rows.
    const { data: row } = await publicClient().from("content_items").select("file_path").eq("id", data.id).maybeSingle();
    if (!row?.file_path) throw new Error("الملف غير متاح");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage.from("files").createSignedUrl(row.file_path, 300, { download: true });
    if (error || !signed) throw new Error("تعذّر إنشاء رابط التحميل");
    return { url: signed.signedUrl };
  });
