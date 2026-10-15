/**
 * Client-side image optimization & compression utility
 * Converts user-uploaded files into lightweight, fast-loading WebP/JPEG data URLs
 * that persist seamlessly in localStorage and public/content.json without external storage dependencies.
 */
export async function optimizeImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("الملف المحدد ليس صورة صالحة."));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("تعذر قراءة ملف الصورة."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("تعذر معالجة بيانات الصورة."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale proportionally if larger than maximum limits
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(e.target?.result as string);
        }

        // Crisp rendering settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for optimal compression, fallback to JPEG
        try {
          const dataUrl = canvas.toDataURL("image/webp", quality);
          if (dataUrl && dataUrl.startsWith("data:image/webp")) {
            return resolve(dataUrl);
          }
        } catch {}

        try {
          const fallbackDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(fallbackDataUrl);
        } catch {
          resolve(e.target?.result as string);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
