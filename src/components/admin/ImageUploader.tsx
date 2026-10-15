import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Trash2, Link as LinkIcon, Check, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { optimizeImageFile } from "@/lib/image-upload";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "video";
  hint?: string;
  maxWidth?: number;
  maxHeight?: number;
}

export function ImageUploader({
  value,
  onChange,
  label = "الصورة",
  aspectRatio = "portrait",
  hint,
  maxWidth = 1200,
  maxHeight = 1200,
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square max-w-[200px]"
      : aspectRatio === "portrait"
      ? "aspect-[3/4] max-w-[220px]"
      : aspectRatio === "video"
      ? "aspect-[16/9] max-w-full"
      : "aspect-[4/3] max-w-[260px]";

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const dataUrl = await optimizeImageFile(file, maxWidth, maxHeight, 0.85);
      onChange(dataUrl);
      toast.success("✅ تم رفع وضغط الصورة بنجاح وتجهيزها للحفظ!");
    } catch (err: any) {
      toast.error(err.message || "فشل رفع الصورة");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleUrlApply() {
    if (!tempUrl.trim()) return;
    onChange(tempUrl.trim());
    setShowUrlInput(false);
    setTempUrl("");
    toast.success("تم تطبيق رابط الصورة!");
  }

  function handleRemove() {
    onChange("");
    toast.info("تمت إزالة الصورة.");
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-foreground">{label}</Label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-primary hover:underline flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? "إلغاء إدخال الرابط" : "أو إدخال رابط URL"}</span>
          </button>
        </div>
      )}

      {/* Manual URL Input Bar if toggled */}
      {showUrlInput && (
        <div className="flex gap-2 p-2.5 rounded-lg bg-muted/60 border border-border text-xs animate-in fade-in">
          <Input
            dir="ltr"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="https://images.unsplash.com/... أو أي رابط"
            className="h-8 text-xs font-mono"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleUrlApply}
            className="h-8 px-3 text-xs bg-primary text-primary-foreground font-bold shrink-0"
          >
            تطبيق
          </Button>
        </div>
      )}

      {/* Main Upload Box / Preview */}
      {value ? (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-3 rounded-xl border border-border/80 bg-card">
          {/* Image Preview Container */}
          <div
            className={`relative rounded-lg overflow-hidden bg-muted border border-border/60 shadow-xs shrink-0 ${aspectClass}`}
          >
            <img
              src={value}
              alt="معاينة"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {loading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex-1 space-y-2.5 text-center sm:text-right py-1">
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground block mb-0.5">
                الصورة المرفقة جاهزة
              </span>
              <span>يمكنك استبدالها بصورة أخرى من جهازك أو حذفها.</span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
                className="text-xs h-8 gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
                <span>تغيير الصورة</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={handleRemove}
                className="text-xs h-8 gap-1.5 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>إزالة</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !loading && fileInputRef.current?.click()}
          className="group relative cursor-pointer border-2 border-dashed border-border hover:border-primary/60 hover:bg-accent/20 rounded-xl p-6 transition-all duration-200 text-center flex flex-col items-center justify-center gap-2.5"
        >
          <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {loading ? "جارٍ معالجة وضغط الصورة..." : "انقر لاختيار ورفع صورة من جهازك"}
            </p>
            <p className="text-[11px] font-sans text-muted-foreground">
              {hint || "يدعم PNG و JPG و WEBP (يتم تحسينها وضغطها فورياً لتوفير المساحة)"}
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
      />
    </div>
  );
}
