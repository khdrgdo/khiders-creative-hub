# دليل خادم Model Context Protocol (MCP) - منصة خضر مأمون

هذا الخادم يتيح للذكاء الاصطناعي (مثل Antigravity أو Claude أو Cursor) النشر والإدارة المباشرة لمحتويات منصة خضر مأمون دون الحاجة للدخول اليدوي إلى لوحة التحكم.

---

## 🛠️ الأدوات المتاحة (Available Tools)

| اسم الأداة | الوظيفة | المعاملات الأساسية |
| :--- | :--- | :--- |
| `publish_article` | نشر مقال فكري أو كتابة جديدة في قسم المقالات | `title`, `body`, `excerpt`, `category`, `tags`, `readTime`, `status` |
| `publish_project` | إضافة مشروع برمجي مفتوح المصدر في قسم المشاريع | `title`, `excerpt`, `body`, `tags`, `github_url`, `demo_url`, `license`, `status` |
| `publish_book` | إضافة كتاب أو إصدار فكري في قسم الكتب مع مواصفاته | `title`, `excerpt`, `body`, `pages`, `year`, `publisher`, `cover_url`, `status` |
| `publish_research` | نشر ورقة بحثية أكاديمية أو دراسة مستقلة | `title`, `excerpt`, `body`, `category`, `tags`, `year`, `pages`, `status` |
| `publish_photo` | إضافة صورة فنية أو مشهد لمعرض الصور | `title`, `cover_url`, `excerpt`, `location`, `camera`, `status` |
| `get_inbox_messages` | قراءة رسائل الزوار الواردة عبر نموذج التواصل المباشر | `limit` (افتراضياً 10) |
| `list_content_items` | استعراض قائمة المحتويات المنشورة أو المسودات | `type`, `status` |

---

## 🚀 التثبيت والإعداد

تم تسجيل الخادم مسبقاً في إعدادات Antigravity MCP العالمية في المسار:
`C:\Users\dell\.gemini\config\mcp_config.json`

```json
{
  "mcpServers": {
    "khiders-hub": {
      "command": "bun",
      "args": ["run", "E:/khiders-creative-hub/scripts/mcp-server.ts"]
    }
  }
}
```

### تشغيله يدويًا للاختبار:
```bash
cd E:\khiders-creative-hub
bun run mcp
```

---

## 💬 أمثلة للأوامر المباشرة مع الذكاء الاصطناعي

يمكنك الآن في محادثتك مع الذكاء الاصطناعي أن تقول ببساطة:
1. **"انشر مقالاً جديداً بعنوان 'فلسفة البرمجة الحرة في زمن النماذج الكبيرة' واكتب محتواه بالتفصيل"** -> سيقوم الذكاء الاصطناعي بصياغة المقال ونشره مباشرة عبر `publish_article`.
2. **"هل وردت رسائل جديدة في نموذج التواصل بالموقع؟"** -> سيستدعي `get_inbox_messages` ويعرض لك تفاصيل الرسائل ومرسليها.
3. **"أضف مشروعي الجديد على غيت هوب (رابط: ...) إلى قسم المشاريع"** -> يستدعي `publish_project`.
4. **"أضف كتابي الجديد 'مدارات الفكر السوداني' إلى مكتبة الكتب"** -> يستدعي `publish_book`.
