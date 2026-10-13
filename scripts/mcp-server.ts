#!/usr/bin/env bun
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
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
        const { data, error } = await supabase.from("content_items").upsert([
          {
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
          },
        ]);
        if (error) throw error;
        return `✅ تم بنجاح نشر المقال: "${args.title}"\n• الرابط: /writing#${slug}\n• الحالة: ${args.status || "published"}`;
      }

      case "publish_project": {
        const slug = slugify(args.title);
        const links: any[] = [];
        if (args.github_url) links.push({ label: "GitHub", url: args.github_url });
        if (args.demo_url) links.push({ label: "معاينة حية", url: args.demo_url });
        const meta = { license: args.license || "MIT", status: "نشط" };
        const { error } = await supabase.from("content_items").upsert([
          {
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
          },
        ]);
        if (error) throw error;
        return `✅ تم بنجاح إضافة المشروع: "${args.title}"\n• الرابط: /projects\n• الحالة: ${args.status || "published"}`;
      }

      case "publish_book": {
        const slug = slugify(args.title);
        const meta = {
          pages: args.pages || "200 صفحة",
          year: args.year || String(new Date().getFullYear()),
          publisher: args.publisher || "إصدار مستقل",
        };
        const { error } = await supabase.from("content_items").upsert([
          {
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
          },
        ]);
        if (error) throw error;
        return `✅ تم بنجاح إضافة الكتاب: "${args.title}"\n• الرابط: /books\n• الحالة: ${args.status || "published"}`;
      }

      case "publish_research": {
        const slug = slugify(args.title);
        const meta = {
          year: args.year || String(new Date().getFullYear()),
          pages: args.pages || "24 صفحة",
          status: "ورقة عمل منشورة",
        };
        const { error } = await supabase.from("content_items").upsert([
          {
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
          },
        ]);
        if (error) throw error;
        return `✅ تم بنجاح نشر الورقة البحثية: "${args.title}"\n• الرابط: /research\n• الحالة: ${args.status || "published"}`;
      }

      case "publish_photo": {
        const slug = slugify(args.title);
        const meta = {
          location: args.location || "",
          camera: args.camera || "",
        };
        const { error } = await supabase.from("content_items").upsert([
          {
            type: "gallery",
            title: args.title,
            slug,
            cover_url: args.cover_url,
            excerpt: args.excerpt || "",
            body: args.body || args.excerpt || "",
            meta,
            status: args.status || "published",
            published_at: new Date().toISOString(),
          },
        ]);
        if (error) throw error;
        return `✅ تم بنجاح إضافة العمل البصري: "${args.title}" لمعرض الصور!`;
      }

      case "get_inbox_messages": {
        const limit = args?.limit || 10;
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        if (!data || data.length === 0) {
          return "📭 لا توجد رسائل واردة جديدة في صندوق البريد حالياً.";
        }

        const formatted = data
          .map(
            (m, i) =>
              `📩 رسالة #${i + 1}:\n• من: ${m.name} (${m.email})\n• الموضوع: ${m.subject || "بدون موضوع"}\n• التاريخ: ${m.created_at}\n• نص الرسالة: ${m.message}\n---`
          )
          .join("\n\n");

        return `📬 إجمالي الرسائل الواردة (${data.length}):\n\n${formatted}`;
      }

      case "list_content_items": {
        let query = supabase.from("content_items").select("id, type, title, status, published_at").order("published_at", { ascending: false });
        if (args?.type) query = query.eq("type", args.type);
        if (args?.status) query = query.eq("status", args.status);
        const { data, error } = await query.limit(30);

        if (error) throw error;
        if (!data || data.length === 0) return "لا توجد عناصر مطابقة.";

        const list = data
          .map((item) => `• [${item.type}] ${item.title} (${item.status === "published" ? "منشور" : "مسودة"})`)
          .join("\n");
        return `📋 المحتويات:\n${list}`;
      }

      default:
        throw new Error(`Tool ${name} not recognized`);
    }
  } catch (err: any) {
    return `❌ حدث خطأ أثناء تنفيذ الأداة ${name}: ${err.message || String(err)}`;
  }
}

// Process Stdio JSON-RPC 2.0 messages
process.stdin.setEncoding("utf-8");
let buffer = "";

process.stdin.on("data", async (chunk) => {
  buffer += chunk;
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    try {
      const message = JSON.parse(trimmed);
      const { id, method, params } = message;

      if (method === "initialize") {
        sendResponse({
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
        });
      } else if (method === "notifications/initialized") {
        // Notification, no reply needed
      } else if (method === "tools/list") {
        sendResponse({
          jsonrpc: "2.0",
          id,
          result: { tools },
        });
      } else if (method === "tools/call") {
        const text = await handleToolCall(params?.name, params?.arguments);
        sendResponse({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text }],
          },
        });
      } else {
        if (id !== undefined) {
          sendResponse({
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: "Method not found" },
          });
        }
      }
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
    }
  }
});

function sendResponse(payload: any) {
  process.stdout.write(JSON.stringify(payload) + "\n");
}
