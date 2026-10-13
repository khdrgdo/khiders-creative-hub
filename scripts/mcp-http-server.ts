#!/usr/bin/env bun
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";

// Load environment from .env file
const envPath = resolve(dirname(import.meta.dir), ".env");
let supabaseUrl = process.env.SUPABASE_URL || "https://c--e8ac8a78-2b29-4bf0-9d7c-73c826b10f23-prod.lovable.cloud";
let supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_jzyMVvppW8xTCBZn2qf0tw_7_QzaQdz";

if (existsSync(envPath)) {
  try {
    const raw = readFileSync(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...valParts] = trimmed.split("=");
      const val = valParts.join("=").replace(/^["']|["']$/g, "").trim();
      if (key === "SUPABASE_URL" || key === "VITE_SUPABASE_URL") supabaseUrl = val;
      if (key === "SUPABASE_PUBLISHABLE_KEY" || key === "VITE_SUPABASE_PUBLISHABLE_KEY") supabaseKey = val;
      if (key === "SUPABASE_SERVICE_ROLE_KEY" && val) supabaseKey = val;
    }
  } catch {}
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Shared JSON content storage helpers for immediate local website updates
const contentJsonPath = resolve(dirname(import.meta.dir), "public", "content.json");

function getLocalStore(): { items: any[]; settings: any } {
  try {
    if (existsSync(contentJsonPath)) {
      const parsed = JSON.parse(readFileSync(contentJsonPath, "utf-8"));
      return {
        items: Array.isArray(parsed?.items) ? parsed.items : [],
        settings: parsed?.settings || {},
      };
    }
  } catch (err) {
    console.warn("Could not read public/content.json:", err);
  }
  return { items: [], settings: {} };
}

function saveLocalStore(data: { items: any[]; settings: any }) {
  try {
    writeFileSync(contentJsonPath, JSON.stringify({ version: "2.0", updatedAt: new Date().toISOString(), ...data }, null, 2), "utf-8");
  } catch (err) {
    console.error("Could not write to public/content.json:", err);
  }
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

const tools = [
  {
    name: "publish_article",
    description: "نشر مقال فكري أو كتابة جديدة في موقع خضر مأمون (قسم الكتابات والمقالات)",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "عنوان المقال" },
        body: { type: "string", description: "نص المقال الكامل (يدعم Markdown)" },
        excerpt: { type: "string", description: "نبذة تمهيدية وموجزة عن المقال" },
        category: { type: "string", description: "تصنيف المقال (مثال: فلسفة وفكر، تقنية وأدب، تأملات)" },
        tags: { type: "array", items: { type: "string" }, description: "الوسوم والكلمات المفتاحية" },
        readTime: { type: "string", description: "زمن القراءة المتوقع (مثال: 5 دقائق قراءة)" },
        status: { type: "string", enum: ["published", "draft"], description: "حالة النشر: published لنشره فوراً، أو draft كمسودة للمراجعة" },
      },
      required: ["title", "body"],
    },
  },
  {
    name: "publish_project",
    description: "إضافة مشروع برمجي مفتوح المصدر في موقع خضر مأمون (قسم المشاريع)",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "اسم المشروع البرمجي" },
        excerpt: { type: "string", description: "وصف موجز للمشروع وأهدافه" },
        body: { type: "string", description: "التفاصيل المعمارية والتقنية للمشروع" },
        category: { type: "string", description: "تصنيف المشروع (مثال: ذكاء اصطناعي، أدوات مطورين)" },
        tags: { type: "array", items: { type: "string" }, description: "التقنيات المستخدمة (مثال: TypeScript, Rust, React)" },
        github_url: { type: "string", description: "رابط مستودع الكود على GitHub" },
        demo_url: { type: "string", description: "رابط المعاينة الحية للمشروع إن وجد" },
        license: { type: "string", description: "نوع الرخصة (مثال: MIT, GPLv3)" },
        status: { type: "string", enum: ["published", "draft"], description: "حالة النشر: published أو draft" },
      },
      required: ["title", "excerpt"],
    },
  },
  {
    name: "publish_book",
    description: "إضافة كتاب أو دراسة فكرية منشورة في مكتبة الموقع",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "عنوان الكتاب أو الإصدار" },
        excerpt: { type: "string", description: "نبذة عن فكرة وموضوع الكتاب" },
        body: { type: "string", description: "ملخص الفصول والمقدمة" },
        category: { type: "string", description: "مجال الكتاب (مثال: فلسفة، أدب، تقنية)" },
        pages: { type: "string", description: "عدد الصفحات (مثال: 240 صفحة)" },
        year: { type: "string", description: "سنة النشر (مثال: 2024)" },
        publisher: { type: "string", description: "دار النشر أو إصدار مستقل" },
        cover_url: { type: "string", description: "رابط صورة الغلاف" },
        status: { type: "string", enum: ["published", "draft"], description: "حالة النشر: published أو draft" },
      },
      required: ["title", "excerpt"],
    },
  },
  {
    name: "publish_research",
    description: "نشر ورقة بحثية مستقلة أو دراسة أكاديمية محكمة",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "عنوان البحث أو الورقة العلمية" },
        excerpt: { type: "string", description: "المستخلص التنفيذي الموجز" },
        body: { type: "string", description: "نص المستخلص الكامل والمنهجية والمراجع" },
        category: { type: "string", description: "مجال البحث (مثال: لسانيات حاسوبية، سيادة رقمية)" },
        tags: { type: "array", items: { type: "string" }, description: "الكلمات المفتاحية للبحث" },
        year: { type: "string", description: "سنة الإنجاز (مثال: 2024)" },
        pages: { type: "string", description: "عدد الصفحات (مثال: 28 صفحة)" },
        status: { type: "string", enum: ["published", "draft"], description: "حالة النشر: published أو draft" },
      },
      required: ["title", "excerpt"],
    },
  },
  {
    name: "publish_photo",
    description: "إضافة عمل فوتوغرافي أو مشهد بصري لمعرض الصور",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "عنوان العمل البصري أو الصورة" },
        cover_url: { type: "string", description: "رابط الصورة عالية الجودة" },
        excerpt: { type: "string", description: "وصف موجز للمشهد وسياقه" },
        location: { type: "string", description: "الموقع الجغرافي (مثال: الخرطوم، النيل)" },
        camera: { type: "string", description: "نوع الكاميرا والعدسة (مثال: Fujifilm X-T4)" },
        status: { type: "string", enum: ["published", "draft"], description: "حالة النشر: published أو draft" },
      },
      required: ["title", "cover_url"],
    },
  },
  {
    name: "get_inbox_messages",
    description: "قراءة واستعراض الرسائل الواردة من زوار الموقع عبر نموذج التواصل المباشر",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "عدد الرسائل المطلوب جلبها (افتراضياً 10)" },
      },
    },
  },
  {
    name: "list_content_items",
    description: "عرض قائمة المحتويات المنشورة أو المسودات في الموقع حسب النوع",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["book", "project", "article", "research", "gallery"], description: "نوع المحتوى المطلوب" },
        status: { type: "string", enum: ["published", "draft"], description: "تصفية حسب الحالة" },
      },
    },
  },
];

async function handleToolCall(name: string, args: any): Promise<string> {
  try {
    switch (name) {
      case "publish_article": {
        const slug = slugify(args.title);
        const excerpt = args.excerpt || args.body.slice(0, 180) + "...";
        const meta = { readTime: args.readTime || "5 دقائق قراءة" };
        const newItem = {
          id: crypto.randomUUID(),
          type: "article",
          title: args.title,
          slug,
          excerpt,
          body: args.body,
          category: args.category || "مقالات وتأملات",
          tags: args.tags || [],
          meta,
          status: args.status || "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // 1. Save to local content store for instant site update
        const store = getLocalStore();
        store.items = [newItem, ...store.items.filter((i) => i.slug !== slug)];
        saveLocalStore(store);

        // 2. Background attempt to Supabase
        supabase.from("content_items").upsert([newItem]).catch(() => {});

        return `✅ تم بنجاح نشر المقال: "${args.title}"\n• التصنيف: ${newItem.category}\n• الرابط في الموقع: /writing#${slug}\n• الحالة: ${newItem.status === "published" ? "منشور ومتاح فوراً للزوار" : "مسودة للمراجعة"}`;
      }

      case "publish_project": {
        const slug = slugify(args.title);
        const links: any[] = [];
        if (args.github_url) links.push({ label: "GitHub", url: args.github_url });
        if (args.demo_url) links.push({ label: "معاينة حية", url: args.demo_url });
        const meta = { license: args.license || "MIT", status: "نشط" };
        const newItem = {
          id: crypto.randomUUID(),
          type: "project",
          title: args.title,
          slug,
          excerpt: args.excerpt,
          body: args.body || args.excerpt,
          category: args.category || "برمجيات مفتوحة",
          tags: args.tags || [],
          links,
          meta,
          status: args.status || "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const store = getLocalStore();
        store.items = [newItem, ...store.items.filter((i) => i.slug !== slug)];
        saveLocalStore(store);

        supabase.from("content_items").upsert([newItem]).catch(() => {});

        return `✅ تم بنجاح إضافة المشروع: "${args.title}"\n• الرابط في الموقع: /projects\n• الحالة: ${newItem.status === "published" ? "منشور ومتاح فوراً للزوار" : "مسودة للمراجعة"}`;
      }

      case "publish_book": {
        const slug = slugify(args.title);
        const meta = {
          pages: args.pages || "200 صفحة",
          year: args.year || String(new Date().getFullYear()),
          publisher: args.publisher || "إصدار مستقل",
        };
        const newItem = {
          id: crypto.randomUUID(),
          type: "book",
          title: args.title,
          slug,
          excerpt: args.excerpt,
          body: args.body || args.excerpt,
          category: args.category || "كتب ودراسات",
          cover_url: args.cover_url || null,
          meta,
          status: args.status || "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const store = getLocalStore();
        store.items = [newItem, ...store.items.filter((i) => i.slug !== slug)];
        saveLocalStore(store);

        supabase.from("content_items").upsert([newItem]).catch(() => {});

        return `✅ تم بنجاح إضافة الكتاب: "${args.title}"\n• الرابط في الموقع: /books\n• الحالة: ${newItem.status === "published" ? "منشور ومتاح فوراً للزوار" : "مسودة للمراجعة"}`;
      }

      case "publish_research": {
        const slug = slugify(args.title);
        const meta = {
          year: args.year || String(new Date().getFullYear()),
          pages: args.pages || "24 صفحة",
          status: "ورقة عمل منشورة",
        };
        const newItem = {
          id: crypto.randomUUID(),
          type: "research",
          title: args.title,
          slug,
          excerpt: args.excerpt,
          body: args.body || args.excerpt,
          category: args.category || "أبحاث مستقلة",
          tags: args.tags || [],
          meta,
          status: args.status || "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const store = getLocalStore();
        store.items = [newItem, ...store.items.filter((i) => i.slug !== slug)];
        saveLocalStore(store);

        supabase.from("content_items").upsert([newItem]).catch(() => {});

        return `✅ تم بنجاح نشر الورقة البحثية: "${args.title}"\n• الرابط في الموقع: /research\n• الحالة: ${newItem.status === "published" ? "منشور ومتاح فوراً للزوار" : "مسودة للمراجعة"}`;
      }

      case "publish_photo": {
        const slug = slugify(args.title);
        const meta = {
          location: args.location || "",
          camera: args.camera || "",
        };
        const newItem = {
          id: crypto.randomUUID(),
          type: "gallery",
          title: args.title,
          slug,
          cover_url: args.cover_url,
          excerpt: args.excerpt || "",
          body: args.body || args.excerpt || "",
          meta,
          status: args.status || "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const store = getLocalStore();
        store.items = [newItem, ...store.items.filter((i) => i.slug !== slug)];
        saveLocalStore(store);

        supabase.from("content_items").upsert([newItem]).catch(() => {});

        return `✅ تم بنجاح إضافة العمل البصري: "${args.title}" إلى معرض الصور!\n• الرابط في الموقع: /gallery`;
      }

      case "get_inbox_messages": {
        const limit = args?.limit || 10;
        try {
          const { data, error } = await supabase
            .from("contact_messages")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

          if (!error && data && data.length > 0) {
            const formatted = data
              .map(
                (m, i) =>
                  `📩 رسالة #${i + 1}:\n• من: ${m.name} (${m.email})\n• الموضوع: ${m.subject || "بدون موضوع"}\n• التاريخ: ${m.created_at}\n• نص الرسالة: ${m.message}\n---`
              )
              .join("\n\n");
            return `📬 إجمالي الرسائل الواردة (${data.length}):\n\n${formatted}`;
          }
        } catch {}
        return "📭 لا توجد رسائل واردة جديدة في صندوق البريد حالياً.";
      }

      case "list_content_items": {
        const store = getLocalStore();
        let items = store.items;

        if (!items || items.length === 0) {
          const { data } = await supabase
            .from("content_items")
            .select("id, type, title, status, published_at")
            .order("published_at", { ascending: false })
            .limit(30);
          items = data || [];
        }

        if (args?.type) items = items.filter((i: any) => i.type === args.type);
        if (args?.status) items = items.filter((i: any) => i.status === args.status);

        if (!items || items.length === 0) return "لا توجد عناصر مطابقة.";

        const list = items
          .map((item: any) => `• [${item.type}] ${item.title} (${item.status === "published" ? "منشور" : "مسودة"})`)
          .join("\n");
        return `📋 المحتويات في الموقع (${items.length}):\n${list}`;
      }

      default:
        throw new Error(`Tool ${name} not recognized`);
    }
  } catch (err: any) {
    return `❌ حدث خطأ أثناء تنفيذ الأداة ${name}: ${err.message || String(err)}`;
  }
}

async function processJsonRpc(message: any) {
  const { id, method, params } = message;

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "khiders-creative-hub-mcp",
          version: "1.0.0",
        },
      },
    };
  }

  if (method === "notifications/initialized") {
    return null;
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: { tools },
    };
  }

  if (method === "tools/call") {
    const text = await handleToolCall(params?.name, params?.arguments);
    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [{ type: "text", text }],
      },
    };
  }

  if (id !== undefined) {
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: "Method not found" },
    };
  }

  return null;
}

// Map of active SSE client sessions
const sessions = new Map<string, (chunk: string) => void>();

const PORT = Number(process.env.MCP_PORT) || 3001;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-session-id",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // SSE connection endpoint for Claude: GET /sse or GET /mcp/sse or GET /mcp or text/event-stream on /
    const isSseRequest =
      req.method === "GET" &&
      (url.pathname === "/sse" ||
        url.pathname === "/mcp/sse" ||
        url.pathname === "/mcp" ||
        (url.pathname === "/" && req.headers.get("accept")?.includes("text/event-stream")));

    if (isSseRequest) {
      const sessionId = crypto.randomUUID();
      const xForwardedHost = req.headers.get("x-forwarded-host");
      const xForwardedProto = req.headers.get("x-forwarded-proto") || "https";

      // If proxied/tunneled with public host, send absolute URL; otherwise relative URI per MCP spec
      let postUrl = `/messages?sessionId=${sessionId}`;
      if (xForwardedHost && !xForwardedHost.includes("localhost")) {
        postUrl = `${xForwardedProto}://${xForwardedHost}/messages?sessionId=${sessionId}`;
      }

      let keepAliveInterval: any;

      const stream = new ReadableStream({
        start(controller) {
          const send = (data: string) => {
            try {
              controller.enqueue(new TextEncoder().encode(data));
            } catch {}
          };
          sessions.set(sessionId, send);
          // Initial SSE endpoint event as per MCP SSE Transport Spec
          send(`event: endpoint\ndata: ${postUrl}\n\n`);

          // Heartbeat ping every 15s to prevent tunnel or mobile carrier drop
          keepAliveInterval = setInterval(() => {
            send(": keepalive\n\n");
          }, 15000);
        },
        cancel() {
          if (keepAliveInterval) clearInterval(keepAliveInterval);
          sessions.delete(sessionId);
        },
      });

      return new Response(stream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // POST /messages?sessionId=... for SSE transport
    if (req.method === "POST" && (url.pathname === "/messages" || url.pathname === "/sse" || url.pathname === "/" || url.pathname === "/mcp")) {
      const sessionId = url.searchParams.get("sessionId") || req.headers.get("x-session-id");
      const sendToClient = sessionId ? sessions.get(sessionId) : null;
      let body: any = {};
      try {
        body = await req.json();
      } catch {}

      const rpcResult = await processJsonRpc(body);

      // Send via active SSE stream
      if (sendToClient && rpcResult) {
        sendToClient(`event: message\ndata: ${JSON.stringify(rpcResult)}\n\n`);
      }

      // AND return 200 with JSON-RPC response in HTTP body
      return new Response(JSON.stringify(rpcResult || {}), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default welcome page
    return new Response(
      `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Khiders Hub MCP Server</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #faf8f5; color: #1f1d1a; padding: 40px 20px; line-height: 1.6; text-align: center; }
    .card { max-width: 600px; margin: 40px auto; background: white; padding: 32px; border-radius: 16px; border: 1px solid #e5e0d8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    code { background: #f0ebe4; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-family: monospace; }
    .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 99px; font-size: 13px; font-weight: bold; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">● الخادم متصل وجاهز</div>
    <h1 style="margin: 0 0 12px 0;">خادم MCP لمنصة خضر مأمون 🚀</h1>
    <p style="color: #666; font-size: 14px;">جاهز للتوصيل مع تطبيق Claude على الهاتف</p>
    <div style="margin: 24px 0; padding: 16px; background: #fbf9f6; border-radius: 8px;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #555;">أدخل هذا الرابط في خانة Server URL بتطبيق Claude:</p>
      <code dir="ltr">${url.origin}/sse</code>
    </div>
  </div>
</body>
</html>`,
      { headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
    );
  },
});

console.log(`🌐 Khiders Hub MCP HTTP/SSE Server running on port ${PORT}`);
console.log(`📡 SSE URL: http://localhost:${PORT}/sse`);
