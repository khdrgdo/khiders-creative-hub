import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { requireAdmin, toItemJson } from "../admin";

async function linkBroken(url: string, signal: AbortSignal): Promise<string | null> {
  try {
    const ctl = AbortSignal.any([signal, AbortSignal.timeout(5000)]);
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctl });
    if (res.status === 405 || res.status === 403) res = await fetch(url, { method: "GET", redirect: "follow", signal: ctl });
    return res.status >= 400 ? `HTTP ${res.status}` : null;
  } catch (e) {
    return e instanceof Error ? e.name : "error";
  }
}

export default defineTool({
  name: "check_site_health",
  title: "Check site health",
  description: "Read-only audit: published items missing title/excerpt/image, broken links, duplicates, pages without basic SEO, and RLS/open policy issues (admin only).",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (_input, ctx) => {
    const supabase = await requireAdmin(ctx);
    const [itemsRes, pagesRes, secRes] = await Promise.all([
      supabase.from("content_items").select("*").is("deleted_at", null).limit(1000),
      supabase.from("pages").select("id, slug, title, body, status, seo_description"),
      supabase.rpc("security_overview"),
    ]);
    if (itemsRes.error) throw new ToolError(itemsRes.error.message);
    if (pagesRes.error) throw new ToolError(pagesRes.error.message);
    const items = (itemsRes.data ?? []).map(toItemJson);
    const published = items.filter((i) => i.status === "published");

    const incomplete = published
      .map((i) => ({
        id: i.id, title: i.title, type: i.type,
        missing: [!i.title.trim() && "title", !i.excerpt.trim() && "excerpt", !i.cover_url && i.images.length === 0 && "image"].filter((x): x is string => !!x),
      }))
      .filter((i) => i.missing.length > 0);

    const groups = new Map<string, typeof items>();
    for (const i of items) {
      const k = `${i.type}|${i.title.trim().toLowerCase()}`;
      groups.set(k, [...(groups.get(k) ?? []), i]);
    }
    const slugGroups = new Map<string, typeof items>();
    for (const i of items) slugGroups.set(i.slug, [...(slugGroups.get(i.slug) ?? []), i]);
    const duplicates = [
      ...[...groups.values()].filter((g) => g.length > 1).map((g) => ({ reason: "same type and title", ids: g.map((x) => x.id), title: g[0].title })),
      ...[...slugGroups.values()].filter((g) => g.length > 1).map((g) => ({ reason: "same slug", ids: g.map((x) => x.id), title: g[0].slug })),
    ];

    const urls = new Map<string, string[]>();
    for (const i of published) {
      for (const u of [...i.links.map((l) => l.url), ...(i.cover_url?.startsWith("http") ? [i.cover_url] : [])]) {
        if (/^https?:\/\//.test(u)) urls.set(u, [...(urls.get(u) ?? []), i.id]);
      }
    }
    const urlList = [...urls.keys()].slice(0, 60);
    await ctx.progress({ progress: 0, total: urlList.length, message: "Checking links" });
    const broken: { url: string; error: string; item_ids: string[] }[] = [];
    for (let k = 0; k < urlList.length; k += 10) {
      const batch = urlList.slice(k, k + 10);
      const results = await Promise.all(batch.map((u) => linkBroken(u, ctx.signal)));
      batch.forEach((u, j) => { if (results[j]) broken.push({ url: u, error: results[j]!, item_ids: urls.get(u)! }); });
      await ctx.progress({ progress: Math.min(k + 10, urlList.length), total: urlList.length });
    }

    const pagesWithoutSeo = (pagesRes.data ?? [])
      .filter((p) => p.status === "published")
      .map((p) => ({ id: p.id, slug: p.slug, missing: [!p.title.trim() && "title", !p.seo_description.trim() && "seo_description", p.seo_description.length > 160 && "seo_description too long"].filter((x): x is string => !!x) }))
      .filter((p) => p.missing.length > 0);

    const security = secRes.error ? { error: secRes.error.message } : (secRes.data as Record<string, unknown>);

    const report = {
      published_incomplete: incomplete,
      broken_links: broken,
      links_checked: urlList.length,
      links_total: urls.size,
      duplicates,
      pages_without_seo: pagesWithoutSeo,
      security,
    };
    const text = [
      `Published items missing fields: ${incomplete.length}`,
      `Broken links: ${broken.length} of ${urlList.length} checked`,
      `Duplicates: ${duplicates.length}`,
      `Pages without basic SEO: ${pagesWithoutSeo.length}`,
      `Security: ${JSON.stringify(security)}`,
    ].join("\n");
    return { content: [{ type: "text", text: `${text}\n\n${JSON.stringify(report, null, 2)}` }], structuredContent: JSON.parse(JSON.stringify(report)) };
  },
});
