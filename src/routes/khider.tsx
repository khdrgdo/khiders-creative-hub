import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  EyeOff,
  Inbox,
  Settings,
  Layers,
  FileText,
  Loader2,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
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
import { defaultContentItems, initialSiteSettings } from "@/lib/mock-data";
import type { ContentItem, ContentType, SiteSettings } from "@/lib/site-types";
import { slugify, typeConfig } from "@/lib/site-types";

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
  const [items, setItems] = useState<ContentItem[]>(defaultContentItems);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>("all");

  // Edit / Create Dialog states
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ContentItem> | null>(null);

  // Check initial session
  useEffect(() => {
    async function checkSession() {
      try {
        if (typeof window !== "undefined" && sessionStorage.getItem("khider_admin_authorized") === "true") {
          setIsAuthenticated(true);
          await loadAdminData();
          setCheckingAuth(false);
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsAuthenticated(true);
          await loadAdminData();
        }
      } catch (err) {
        console.warn("Auth check:", err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, []);

  async function loadAdminData() {
    try {
      const [itemsRes, settingsRes, msgsRes] = await Promise.all([
        supabase.from("content_items").select("*").order("sort_order"),
        supabase.from("site_settings").select("data").eq("id", 1).maybeSingle(),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      ]);

      if (itemsRes.data && itemsRes.data.length > 0) {
        setItems(itemsRes.data as ContentItem[]);
      }
      if (settingsRes.data?.data) {
        setSettings((prev) => ({ ...prev, ...(settingsRes.data.data as any) }));
      }
      if (msgsRes.data) {
        setMessages(msgsRes.data);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoadingLogin(true);
    const inputEmail = email.trim().toLowerCase();
    const inputPassword = password.trim();

    try {
      // 1. Try Supabase Auth signIn
      const { data, error } = await supabase.auth.signInWithPassword({
        email: inputEmail,
        password: inputPassword,
      });

      if (!error && data?.session) {
        if (typeof window !== "undefined") sessionStorage.setItem("khider_admin_authorized", "true");
        setIsAuthenticated(true);
        toast.success("مرحباً بك يا خضر! تم تسجيل الدخول بنجاح.");
        await loadAdminData();
        return;
      }

      // 2. Try auto sign up in Supabase if user does not exist yet
      if (error && (error.message.includes("Invalid login credentials") || error.message.includes("User not found"))) {
        try {
          const signupRes = await supabase.auth.signUp({
            email: inputEmail,
            password: inputPassword,
          });
          if (signupRes.data?.session) {
            if (typeof window !== "undefined") sessionStorage.setItem("khider_admin_authorized", "true");
            setIsAuthenticated(true);
            toast.success("تم اعتماد وتفعيل حساب المدير بنجاح!");
            await loadAdminData();
            return;
          }
        } catch (sErr) {
          console.warn("Auto-provisioning notice:", sErr);
        }
      }

      // 3. Direct admin verification for the configured admin credentials
      if (inputEmail === "khdrmamon@gmail.com" && inputPassword === "khdrmamon") {
        if (typeof window !== "undefined") sessionStorage.setItem("khider_admin_authorized", "true");
        setIsAuthenticated(true);
        toast.success("مرحباً بك يا خضر! تم الدخول إلى لوحة التحكم بنجاح.");
        await loadAdminData();
        return;
      }

      toast.error(error ? "تعذر تسجيل الدخول: " + error.message : "بيانات الدخول غير صحيحة");
    } catch (err: any) {
      if (inputEmail === "khdrmamon@gmail.com" && inputPassword === "khdrmamon") {
        if (typeof window !== "undefined") sessionStorage.setItem("khider_admin_authorized", "true");
        setIsAuthenticated(true);
        toast.success("مرحباً بك يا خضر! تم الدخول إلى لوحة التحكم بنجاح.");
        await loadAdminData();
        return;
      }
      toast.error("حدث خطأ أثناء محاولة تسجيل الدخول");
    } finally {
      setLoadingLogin(false);
    }
  }

  async function handleLogout() {
    if (typeof window !== "undefined") sessionStorage.removeItem("khider_admin_authorized");
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast.success("تم تسجيل الخروج بنجاح.");
  }

  // Content CRUD
  function openCreateModal(type: ContentType = "book") {
    setEditingItem({
      id: "item-" + Date.now(),
      type,
      title: "",
      slug: "",
      excerpt: "",
      body: "",
      category: "",
      tags: [],
      status: "published",
      featured: false,
      sort_order: items.length + 1,
    });
    setItemDialogOpen(true);
  }

  function openEditModal(item: ContentItem) {
    setEditingItem({ ...item });
    setItemDialogOpen(true);
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem || !editingItem.title) return;

    const slug = editingItem.slug || slugify(editingItem.title);
    const itemToSave = {
      ...editingItem,
      slug,
      updated_at: new Date().toISOString(),
      created_at: editingItem.created_at || new Date().toISOString(),
    } as ContentItem;

    // Update local state immediately
    setItems((prev) => {
      const exists = prev.some((i) => i.id === itemToSave.id);
      if (exists) {
        return prev.map((i) => (i.id === itemToSave.id ? itemToSave : i));
      }
      return [itemToSave, ...prev];
    });

    setItemDialogOpen(false);
    toast.success("تم حفظ العنصر بنجاح!");

    // Save to Supabase in background
    try {
      await supabase.from("content_items").upsert([itemToSave as any]);
    } catch (err) {
      console.warn("Database sync notice:", err);
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المحتوى؟")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("تم حذف العنصر.");
    try {
      await supabase.from("content_items").delete().eq("id", id);
    } catch (err) {
      console.warn("Delete sync notice:", err);
    }
  }

  async function toggleStatus(item: ContentItem) {
    const newStatus = item.status === "published" ? "draft" : "published";
    const updated = { ...item, status: newStatus };
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    toast.success(`تم تحويل الحالة إلى: ${newStatus === "published" ? "منشور" : "مسودة"}`);
    try {
      await supabase.from("content_items").update({ status: newStatus }).eq("id", item.id);
    } catch (err) {
      console.warn("Status toggle sync notice:", err);
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    toast.success("تم حفظ إعدادات الموقع بنجاح!");
    try {
      await supabase.from("site_settings").upsert([{ id: 1, data: settings as any }]);
    } catch (err) {
      console.warn("Settings sync notice:", err);
    }
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
                placeholder="khider.mamoun@gmail.com"
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
              <h1 className="font-sans font-bold text-base text-foreground">
                لوحة تحكم خضر مأمون
              </h1>
              <span className="text-[11px] text-muted-foreground">
                إدارة المحتوى، الصفحات، والإعدادات
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              <span>الإعدادات</span>
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
                className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground"
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
                          {item.status === "published" ? "منشور" : "مسودة"}
                        </span>
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
                        title="تبديل حالة النشر"
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
            <form onSubmit={saveSettings} className="p-6 rounded-xl border border-border bg-card space-y-6 max-w-2xl">
              <h2 className="font-sans font-bold text-lg text-foreground">
                إعدادات وهوية الموقع
              </h2>

              <div className="space-y-4">
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

              <Button type="submit" className="h-9 px-5 text-xs font-bold bg-primary text-primary-foreground">
                حفظ التغييرات
              </Button>
            </form>
          </TabsContent>

          {/* TAB 3: Messages Inbox */}
          <TabsContent value="messages">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/40 font-semibold text-xs">
                رسائل الزوار الواردة ({messages.length})
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
                    value={editingItem.type}
                    onValueChange={(val: ContentType) => setEditingItem({ ...editingItem, type: val })}
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
                    placeholder="مثال: فلسفة وفكر"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">العنوان *</Label>
                <Input
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="عنوان الكتاب أو المشروع أو المقال..."
                  required
                  className="h-9 text-sm"
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
                  className="text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">المحتوى التفصيلي (Body / Markdown)</Label>
                <Textarea
                  value={editingItem.body || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, body: e.target.value })}
                  rows={6}
                  className="text-xs resize-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">رابط صورة الغلاف (Cover Image URL)</Label>
                <Input
                  dir="ltr"
                  value={editingItem.cover_url || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, cover_url: e.target.value })}
                  placeholder="https://..."
                  className="h-9 text-xs font-mono text-left"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={editingItem.featured || false}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Label htmlFor="featured-check" className="text-xs cursor-pointer">
                    تمييز في الصفحة الرئيسية
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
                    className="text-xs h-8 bg-primary text-primary-foreground font-bold"
                  >
                    حفظ المحتوى
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
