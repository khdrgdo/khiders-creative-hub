import { createFileRoute } from "@tanstack/react-router";
import { publicClient } from "@/lib/public-client";

// Serves images from the media bucket (anon-readable via storage RLS).
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!path || path.includes("..") || path.length > 300) return new Response("Not found", { status: 404 });
        const { data, error } = await publicClient().storage.from("media").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=31536000, immutable",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});
