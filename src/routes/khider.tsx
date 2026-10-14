import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Inbox,
  Settings,
  FileText,
  Loader2,
  ExternalLink,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  Tag,
  Book,
  Code2,
  GraduationCap,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { ContentItem, ContentType, SiteSettings } from "@/lib/site-types";
import { slugify, typeConfig } from "@/lib/site-types";
import {
  getStoredItems,
  saveStoredItems,
  getStoredSettings,
  saveStoredSettings,
  resetStoredToDefaults,
  exportDataAsJson,
  importDataFromJson,
} from "@/lib/content-store";

export const Route = createFileRoute("/khider")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم الإدارية | خضر مأمون" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: KhiderAdminPage,
});

function KhiderAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login form states
  const [email, setEmail] = useState("khdrmamon@gmail.com");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Data states
  const [items, setItems] = useState<ContentItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getStoredSettings());
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>("all");

  // Edit / Create Dialog states
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ContentItem> | null>(null);

  // Specific meta helpers for editing dialog
  const [metaYear, setMetaYear] = useState("");
  const [metaPages, setMetaPages] = useState("");
  const [metaPublisher, setMetaPublisher] = useState("");
  const [metaGithub, setMetaGithub] = useState("");
  const [metaDemo, setMetaDemo] = useState("");
  const [metaLicense, setMetaLicense] = useState("");
  const [metaReadTime, setMetaReadTime] = useState("");
  const [metaCamera, setMetaCamera] = useState("");
  const [metaLocation, setMetaLocation] = useState("");
  const [tagsString, setTagsString] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and check session
  useEffect(() => {
    // 1. Load local content store immediately
    setItems(getStoredItems());
    setSettings(getStoredSettings());

    // 2. Check auth
    if (typeof window !== "undefined" && sessionStorage.getItem("khider_admin_authorized") === "true") {
      setIsAuthenticated(true);
      setCheckingAuth(false);
      loadRemoteData();
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setIsAuthenticated(true);
        loadRemoteData();
      }
      setCheckingAuth(false);
    }).catch(() => {
      setCheckingAuth(false);
    });
  }, []);

  // Listen for storage changes
  useEffect(() => {
    function onContentChanged(e: any) {
      if (e.detail) setItems(e.detail);
    }
    function onSettingsChanged(e: any) {
      if (e.detail) setSettings(e.detail);
    }
    window.addEventListener("khider_content_changed", onContentChanged);
    window.addEventListener("khider_settings_changed", onSettingsChanged);
    return () => {
      window.removeEventListener("khider_content_changed", onContentChanged);
      window.removeEventListener("khider_settings_changed", onSettingsChanged);
    };
  }, []);

  async function loadRemoteData() {
    try {
      const [itemsRes, settingsRes, msgsRes] = await Promise.all([
        supabase.from("content_items").select("*").order("sort_order"),
        supabase.from("site_settings").select("data").eq("id", 1).maybeSingle(),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      ]);

      if (itemsRes.data && itemsRes.data.length > 0) {
        // Smart non-destructive merge: never overwrite user's local edits!
        const local = getStoredItems();
        if (local.length === 0) {
          setItems(itemsRes.data as ContentItem[]);
          saveStoredItems(itemsRes.data as ContentItem[]);
        } else {
          // Merge only new remote items that don't exist locally
          const localIds = new Set(local.map((i) => i.id));
          const newRemote = (itemsRes.data as ContentItem[]).filter((i) => !localIds.has(i.id));
          if (newRemote.length > 0) {
            const merged = [...local, ...newRemote];
            setItems(merged);
            saveStoredItems(merged);
          }
        }
      }
      // Only apply remote settings if local settings haven't been customized by the user
      const isCustomized = typeof window !== "undefined" && localStorage.getItem("khiders_settings_customized") === "true";
      if (!isCustomized && settingsRes.data?.data) {
        setSettings((prev) => ({ ...prev, ...(settingsRes.data!.data as any) }));
      }
      if (msgsRes.data) {
        setMessages(msgsRes.data);
      }
    } catch (err) {
      console.warn("Notice: remote fetch completed or bypassed:", err);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoadingLogin(true);
    const inputEmail = email.trim().toLowerCase();
    const inputPassword = password.trim();

    try {
      // 1. Authorized administrator credentials check
      if (
        (inputEmail === "khdrmamon@gmail.com" && inputPassword === "khdrmamon") ||
        (inputEmail === "khdrmamon@gmail.com" && inputPassword === "Khider@Mamoun2026!")
      ) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("khider_admin_authorized", "true");
        }
        setIsAuthenticated(true);
        toast.success("مرحباً بك يا أستاذ خضر! تم الدخول إلى لوحة التحكم بنجاح.");
        await loadRemoteData();
        return;
      }

      // 2. Try Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: inputEmail,
        password: inputPassword,
      });

      if (!error && data?.session) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("khider_admin_authorized", "true");
        }
        setIsAuthenticated(true);
        toast.success("مرحباً بك يا خضر! تم الدخول بنجاح.");
        await loadRemoteData();
        return;
      }

      toast.error("بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور.");
    } catch (err) {
      toast.error("حدث خطأ أثناء محاولة تسجيل الدخول.");
    } finally {
      setLoadingLogin(false);
    }
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("khider_admin_authorized");
    }
    supabase.auth.signOut().then(() => {}, () => {});
    setIsAuthenticated(false);
    toast.success("تم تسجيل الخروج بنجاح.");
  }

  // --- Content CRUD Operations ---

  function openCreateModal(type: ContentType = "book") {
    const newItem: Partial<ContentItem> = {
      id: crypto.randomUUID(),
      type,
      title: "",
      slug: "",
      excerpt: "",
      body: "",
      category: "",
      tags: [],
      cover_url: "",
      status: "published",
      featured: false,
      sort_order: items.length + 1,
      meta: {},
      links: [],
    };
    setEditingItem(newItem);
    setMetaYear(String(new Date().getFullYear()));
    setMetaPages("");
    setMetaPublisher("إصدار مستقل");
    setMetaGithub("");
    setMetaDemo("");
    setMetaLicense("MIT");
    setMetaReadTime("5 دقائق قراءة");
    setMetaCamera("");
    setMetaLocation("");
    setTagsString("");
    setItemDialogOpen(true);
  }

  function openEditModal(item: ContentItem) {
    setEditingItem({ ...item });
    const meta = (item.meta || {}) as Record<string, any>;
    const links = (item.links || []) as Array<{ label: string; url: string }>;

    setMetaYear(meta["year"] || "");
    setMetaPages(meta["pages"] || "");
    setMetaPublisher(meta["publisher"] || "");
    setMetaReadTime(meta["readTime"] || "");
    setMetaCamera(meta["camera"] || "");
    setMetaLocation(meta["location"] || "");
    setMetaLicense(meta["license"] || "MIT");

    const ghLink = links.find((l) => l.label?.toLowerCase() === "github");
    const demoLink = links.find((l) => l.label?.includes("معاينة") || l.label?.toLowerCase() === "demo");
    setMetaGithub(ghLink?.url || "");
    setMetaDemo(demoLink?.url || "");

    setTagsString(Array.isArray(item.tags) ? item.tags.join(", ") : "");
    setItemDialogOpen(true);
  }

  function saveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem || !editingItem.title?.trim()) {
      toast.error("يرجى إدخال عنوان المحتوى.");
      return;
    }

    const currentId =
      editingItem.id && editingItem.id.length > 20 && !editingItem.id.startsWith("item-")
        ? editingItem.id
        : crypto.randomUUID();

    const slug = editingItem.slug?.trim() || slugify(editingItem.title);
    const tags = tagsString
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter(Boolean);

    // Build meta object based on type
    const meta: Record<string, any> = { ...((editingItem.meta as Record<string, any>) || {}) };
    if (editingItem.type === "book") {
      if (metaYear) meta["year"] = metaYear;
      if (metaPages) meta["pages"] = metaPages;
      if (metaPublisher) meta["publisher"] = metaPublisher;
    } else if (editingItem.type === "project") {
      if (metaLicense) meta["license"] = metaLicense;
    } else if (editingItem.type === "article") {
      if (metaReadTime) meta["readTime"] = metaReadTime;
    } else if (editingItem.type === "research") {
      if (metaYear) meta["year"] = metaYear;
      if (metaPages) meta["pages"] = metaPages;
    } else if (editingItem.type === "gallery") {
      if (metaCamera) meta["camera"] = metaCamera;
      if (metaLocation) meta["location"] = metaLocation;
    }

    // Build links array
    const links: Array<{ label: string; url: string }> = [];
    if (metaGithub) links.push({ label: "GitHub", url: metaGithub });
    if (metaDemo) links.push({ label: "معاينة حية", url: metaDemo });

    const itemToSave: ContentItem = {
      id: currentId,
      type: editingItem.type || "book",
      title: editingItem.title.trim(),
      slug,
      excerpt: editingItem.excerpt?.trim() || "",
      body: editingItem.body?.trim() || editingItem.excerpt?.trim() || "",
      category: editingItem.category?.trim() || "عام",
      tags,
      cover_url: editingItem.cover_url?.trim() || null,
      file_path: editingItem.file_path || null,
      images: editingItem.images || [],
      links,
      meta,
      status: editingItem.status || "published",
      featured: editingItem.featured ?? false,
      sort_order: editingItem.sort_order ?? items.length + 1,
      published_at: editingItem.published_at || new Date().toISOString(),
      created_at: editingItem.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Update State & Local Store immediately (Guaranteed persistence!)
    let updated: ContentItem[];
    const exists = items.some((i) => i.id === itemToSave.id);
    if (exists) {
      updated = items.map((i) => (i.id === itemToSave.id ? itemToSave : i));
    } else {
      updated = [itemToSave, ...items];
    }

    setItems(updated);
    saveStoredItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("khiders_content_customized", "true");
    }
    setItemDialogOpen(false);
    toast.success("✅ تم حفظ وتحديث المحتوى في الموقع بنجاح!");

    // 2. Background attempt to Supabase
    supabase.from("content_items").upsert([itemToSave as any]).then(({ error }) => {
      if (error) {
        console.warn("Supabase background sync notice:", error.message);
      }
    });
  }

  function deleteItem(id: string) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا المحتوى نهائياً؟")) return;

    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveStoredItems(updated);
    toast.success("تم حذف المحتوى بنجاح.");

    supabase.from("content_items").delete().eq("id", id).then(() => {}, () => {});
  }

  function toggleStatus(item: ContentItem) {
    const newStatus = item.status === "published" ? "draft" : "published";
    const updatedItem: ContentItem = { ...item, status: newStatus as ContentItem["status"] };
    const updated = items.map((i) => (i.id === item.id ? updatedItem : i));

    setItems(updated);
    saveStoredItems(updated);
    toast.success(`تم تغيير الحالة إلى: ${newStatus === "published" ? "منشور ومتاح للزوار" : "مسودة خاصة"}`);

    supabase.from("content_items").update({ status: newStatus }).eq("id", item.id).then(() => {}, () => {});
  }

  // --- Site Settings Operations ---

  function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("khiders_settings_customized", "true");
    }
    saveStoredSettings(settings);
    toast.success("✅ تم حفظ وتطبيق إعدادات الموقع فورياً في كافة الصفحات!");

    supabase.from("site_settings").upsert([{ id: 1, data: settings as any }]).then(() => {}, () => {});
  }

  // --- Backup / Export / Import ---

  function handleExportJson() {
    try {
      const json = exportDataAsJson();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `khiders-creative-hub-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("تم تنزيل ملف النسخة الاحتياطية بنجاح!");
    } catch {
      toast.error("فشل تصدير النسخة الاحتياطية.");
    }
  }

  function handleImportJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const res = importDataFromJson(content);
        setItems(res.items);
        setSettings(res.settings);
        toast.success(`تم بنجاح استيراد ${res.items.length} عنصر وإعدادات الموقع!`);
      } catch (err: any) {
        toast.error("خطأ أثناء قراءة ملف النسخة: " + (err.message || "الملف تالف"));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleResetDefaults() {
    if (!confirm("تحذير: هل أنت متأكد من استعادة المحتوى والإعدادات الافتراضية الأولى للموقع؟")) {
      return;
    }
    const res = resetStoredToDefaults();
    setItems(res.items);
    setSettings(res.settings);
    toast.success("تمت استعادة المحتوى والإعدادات الافتراضية بنجاح.");
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-accent text-primary flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              لوحة التحكم الخاصة
            </h1>
            <p className="text-xs text-muted-foreground font-sans">
              منطقة إدارية مخصصة للأستاذ خضر مأمون لإدارة المحتوى والإعدادات
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">البريد الإلكتروني</Label>
              <Input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="khdrmamon@gmail.com"
                required
                className="h-10 text-sm font-mono text-left"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">كلمة المرور</Label>
              <Input
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="h-10 text-sm font-mono text-left"
              />
            </div>

            <Button
              type="submit"
              disabled={loadingLogin}
              className="w-full h-10 bg-primary text-primary-foreground font-bold text-xs"
            >
              {loadingLogin ? <Loader2 className="w-4 h-4 animate-spin" /> : "تسجيل الدخول"}
            </Button>
          </form>

          <div className="pt-2 text-center border-t border-border/50">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
              ➔ العودة إلى واجهة الموقع الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  const filteredItems =
    activeTypeFilter === "all"
      ? items
      : items.filter((i) => i.type === activeTypeFilter);

  return (
    <div className="admin-theme min-h-screen pb-20">
      {/* Top Admin Header */}
      <div className="bg-card border-b border-border py-4 px-4 sm:px-6 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              خ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans font-bold text-base text-foreground">
                  لوحة تحكم خضر مأمون
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600">
                  <Check className="w-3 h-3" />
                  حفظ دائم ونشط
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                التعديلات تظهر فورياً في الموقع ومحفوظة على جهازك
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="text-xs h-8 gap-1.5"
              title="تصدير نسخة احتياطية من كل المحتوى"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير نسخة (JSON)</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs h-8 gap-1.5"
              title="استيراد نسخة بيانات"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>استيراد نسخة</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJson}
              accept=".json"
              className="hidden"
            />

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="text-xs h-8 gap-1 text-muted-foreground hover:text-destructive"
              title="استعادة البيانات الأصلية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>

            <Button asChild variant="outline" size="sm" className="text-xs h-8 gap-1.5">
              <Link to="/" target="_blank">
                <span>معاينة الموقع</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs h-8 text-destructive hover:bg-destructive/10 gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid grid-cols-3 max-w-md bg-muted/60">
            <TabsTrigger value="content" className="text-xs gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>المحتوى ({items.length})</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              <span>الإعدادات والهوية</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-xs gap-1.5">
              <Inbox className="w-3.5 h-3.5" />
              <span>الرسائل ({messages.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Content Items */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  variant={activeTypeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTypeFilter("all")}
                  className="text-xs h-7"
                >
                  الكل ({items.length})
                </Button>
                {Object.entries(typeConfig).map(([type, cfg]) => {
                  const count = items.filter((i) => i.type === type).length;
                  return (
                    <Button
                      key={type}
                      variant={activeTypeFilter === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTypeFilter(type)}
                      className="text-xs h-7"
                    >
                      {cfg.plural} ({count})
                    </Button>
                  );
                })}
              </div>

              <Button
                size="sm"
                onClick={() => openCreateModal(activeTypeFilter === "all" ? "book" : (activeTypeFilter as ContentType))}
                className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة محتوى جديد</span>
              </Button>
            </div>

            {/* Content Table / List */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-accent text-accent-foreground">
                          {typeConfig[item.type]?.label || item.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.status === "published"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {item.status === "published" ? "منشور ومتاح" : "مسودة خاصة"}
                        </span>
                        {item.featured && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-primary/10 text-primary font-semibold">
                            مميز بالرئيسية
                          </span>
                        )}
                        {item.category && (
                          <span className="text-xs text-muted-foreground">• {item.category}</span>
                        )}
                      </div>
                      <h3 className="font-sans font-bold text-base text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(item)}
                        className="text-xs h-7 px-2"
                        title={item.status === "published" ? "تحويل إلى مسودة" : "نشر للزوار"}
                      >
                        {item.status === "published" ? (
                          <EyeOff className="w-3 h-3 text-muted-foreground" />
                        ) : (
                          <Eye className="w-3 h-3 text-emerald-600" />
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(item)}
                        className="text-xs h-7 px-2"
                        title="تعديل"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                        className="text-xs h-7 px-2 text-destructive hover:bg-destructive/10"
                        title="حذف"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredItems.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    لا يوجد محتوى في هذا التصنيف حالياً.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Site Settings */}
          <TabsContent value="settings">
            <form onSubmit={saveSettings} className="p-6 rounded-xl border border-border bg-card space-y-6 max-w-3xl">
              <div>
                <h2 className="font-sans font-bold text-lg text-foreground">
                  إعدادات وهوية الموقع
                </h2>
                <p className="text-xs text-muted-foreground">
                  تعديل الاسم والتعريف والسيرة الذاتية ووسائل التواصل
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">اسم الموقع / الاسم الشخصي</Label>
                    <Input
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">الصفة / الشعار (Tagline)</Label>
                    <Input
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">النبذة التمهيدية في الرئيسية (Intro)</Label>
                  <Textarea
                    value={settings.intro}
                    onChange={(e) => setSettings({ ...settings, intro: e.target.value })}
                    rows={3}
                    className="text-sm resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">السيرة والبيان الفكري (صفحة عنّي - About)</Label>
                  <Textarea
                    value={settings.about}
                    onChange={(e) => setSettings({ ...settings, about: e.target.value })}
                    rows={4}
                    className="text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">المهارات والتقنيات (مفصولة بفواصل)</Label>
                    <Input
                      value={settings.skills.join(", ")}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          skills: e.target.value
                            .split(/[,،]/)
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="TypeScript, React, Python, ..."
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">الاهتمامات الفكرية (مفصولة بفواصل)</Label>
                    <Input
                      value={settings.interests.join(", ")}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          interests: e.target.value
                            .split(/[,،]/)
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="البرمجة, الفلسفة, الأدب العربي, ..."
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">البريد الإلكتروني للتواصل</Label>
                  <Input
                    type="email"
                    dir="ltr"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="text-sm font-mono text-left"
                  />
                </div>
              </div>

              <Button type="submit" className="h-9 px-6 text-xs font-bold bg-primary text-primary-foreground">
                حفظ وتطبيق التغييرات في الموقع
              </Button>
            </form>
          </TabsContent>

          {/* TAB 3: Messages Inbox */}
          <TabsContent value="messages">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/40 font-semibold text-xs">
                رسائل الزوار الواردة عبر نموذج التواصل ({messages.length})
              </div>

              <div className="divide-y divide-border">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-bold text-foreground">{msg.name}</span>
                      <span className="font-mono dir-ltr">{msg.email}</span>
                    </div>
                    {msg.subject && (
                      <h4 className="text-sm font-bold text-foreground">
                        {msg.subject}
                      </h4>
                    )}
                    <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                      {msg.message}
                    </p>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    لا توجد رسائل واردة جديدة حتى الآن.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create / Edit Content Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        {editingItem && (
          <DialogContent className="max-w-2xl text-right dir-rtl p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="text-right">
              <DialogTitle className="font-sans font-bold text-xl">
                {items.some((i) => i.id === editingItem.id) ? "تعديل المحتوى" : "إضافة محتوى جديد"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={saveItem} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">نوع المحتوى</Label>
                  <Select
                    value={editingItem.type ?? ""}
                    onValueChange={(val: string) => setEditingItem({ ...editingItem, type: val as ContentType })}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeConfig).map(([k, cfg]) => (
                        <SelectItem key={k} value={k} className="text-xs">
                          {cfg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">التصنيف</Label>
                  <Input
                    value={editingItem.category || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="مثال: أدب، فلسفة، تقنية..."
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">العنوان *</Label>
                <Input
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="عنوان الكتاب، المشروع، المقال، أو الصورة..."
                  required
                  className="h-9 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">الرابط اللطيف (Slug)</Label>
                <Input
                  dir="ltr"
                  value={editingItem.slug || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                  placeholder="slug-in-english-or-arabic"
                  className="h-9 text-xs font-mono text-left"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">النبذة الموجزة (Excerpt)</Label>
                <Textarea
                  value={editingItem.excerpt || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                  rows={2}
                  placeholder="وصف مختصر يظهر في بطاقة العرض الرئيسية..."
                  className="text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">المحتوى التفصيلي (Body / Markdown)</Label>
                <Textarea
                  value={editingItem.body || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, body: e.target.value })}
                  rows={5}
                  placeholder="المحتوى الكامل للمقال، فصول الكتاب، أو تفاصيل المشروع..."
                  className="text-xs resize-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">رابط صورة الغلاف أو العمل البصري (Image URL)</Label>
                <Input
                  dir="ltr"
                  value={editingItem.cover_url || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, cover_url: e.target.value })}
                  placeholder="https://..."
                  className="h-9 text-xs font-mono text-left"
                />
              </div>

              {/* Dynamic Type-specific Meta Fields */}
              {editingItem.type === "book" && (
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border/70 space-y-3">
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Book className="w-3.5 h-3.5" />
                    <span>تفاصيل الكتاب والنشر</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">سنة النشر</Label>
                      <Input
                        value={metaYear}
                        onChange={(e) => setMetaYear(e.target.value)}
                        placeholder="2024"
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">عدد الصفحات</Label>
                      <Input
                        value={metaPages}
                        onChange={(e) => setMetaPages(e.target.value)}
                        placeholder="220 صفحة"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">دار النشر</Label>
                      <Input
                        value={metaPublisher}
                        onChange={(e) => setMetaPublisher(e.target.value)}
                        placeholder="إصدار مستقل"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editingItem.type === "project" && (
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border/70 space-y-3">
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>روابط المشروع والشيفرة</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">رابط مستودع GitHub</Label>
                      <Input
                        dir="ltr"
                        value={metaGithub}
                        onChange={(e) => setMetaGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="h-8 text-xs font-mono text-left"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">رابط المعاينة الحية (Live Demo)</Label>
                      <Input
                        dir="ltr"
                        value={metaDemo}
                        onChange={(e) => setMetaDemo(e.target.value)}
                        placeholder="https://..."
                        className="h-8 text-xs font-mono text-left"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editingItem.type === "article" && (
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border/70 space-y-3">
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>بيانات المقال</span>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">وقت القراءة المتوقع</Label>
                    <Input
                      value={metaReadTime}
                      onChange={(e) => setMetaReadTime(e.target.value)}
                      placeholder="5 دقائق قراءة"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              )}

              {editingItem.type === "research" && (
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border/70 space-y-3">
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>بيانات الورقة البحثية</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">سنة الإنجاز</Label>
                      <Input
                        value={metaYear}
                        onChange={(e) => setMetaYear(e.target.value)}
                        placeholder="2024"
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">عدد الصفحات</Label>
                      <Input
                        value={metaPages}
                        onChange={(e) => setMetaPages(e.target.value)}
                        placeholder="24 صفحة"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editingItem.type === "gallery" && (
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border/70 space-y-3">
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>بيانات العمل البصري والكاميرا</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">الموقع الجغرافي للمشهد</Label>
                      <Input
                        value={metaLocation}
                        onChange={(e) => setMetaLocation(e.target.value)}
                        placeholder="الخرطوم، النيل"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">الكاميرا والعدسة</Label>
                      <Input
                        value={metaCamera}
                        onChange={(e) => setMetaCamera(e.target.value)}
                        placeholder="Fujifilm X-T4, 35mm f/1.4"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">الوسوم والكلمات المفتاحية (مفصولة بفواصل)</Label>
                <Input
                  value={tagsString}
                  onChange={(e) => setTagsString(e.target.value)}
                  placeholder="فلسفة, أدب, ذكاء اصطناعي..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={editingItem.featured || false}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="rounded border-border accent-primary cursor-pointer w-4 h-4"
                  />
                  <Label htmlFor="featured-check" className="text-xs cursor-pointer font-medium">
                    إبراز وتثبيت في الصفحة الرئيسية
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setItemDialogOpen(false)}
                    className="text-xs h-8"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="text-xs h-8 bg-primary text-primary-foreground font-bold px-4"
                  >
                    حفظ ونشر التعديل
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
