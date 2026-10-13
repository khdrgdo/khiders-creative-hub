import { createFileRoute } from "@tanstack/react-router";
import { publicClient } from "@/lib/public-client";
import { typeConfig, type ContentType } from "@/lib/site-types";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const sb = publicClient();
        const [{ data: items }, { data: pages }] = await Promise.all([
          sb.from("content_items").select("type,slug,updated_at"),
          sb.from("pages").select("slug,updated_at"),
        ]);
        const urls = ["/", "/about", "/books", "/projects", "/writing", "/research", "/gallery", "/contact"];
        for (const i of items ?? []) if (i.type !== "gallery") urls.push(`${typeConfig[i.type as ContentType].path}/${encodeURIComponent(i.slug)}`);
        for (const p of pages ?? []) urls.push(`/p/${p.slug}`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
          .map((u) => `<url><loc>${origin}${u}</loc></url>`)
          .join("")}</urlset>`;
        return new Response(xml, { headers: { "content-type": "application/xml" } });
      },
    },
  },
});
