import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/queries";
import { mergeSettings } from "@/lib/content-helper";
import { useLiveSettings } from "@/lib/content-store";
import { ContactSection } from "@/components/public/ContactSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معي | خضر مأمون" },
      {
        name: "description",
        content: "صفحة المراسلة والتواصل المباشر مع خضر مأمون لتبادل الآراء أو التعاون البرمجي والفكري.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: siteData } = useQuery(siteQuery);
  const settings = useLiveSettings(mergeSettings(siteData?.settings));

  return (
    <div className="py-8 sm:py-16 space-y-10">
      <div className="max-w-2xl space-y-3 pb-6 border-b border-border/60">
        <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block">
          قنوات الاتصال
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground">
          تواصل معي
        </h1>
        <p className="text-sm sm:text-base font-sans text-muted-foreground leading-relaxed">
          أرحب بالمراسلات الجادة حول البرمجيات الحرة، الأبحاث الفكرية
          واللغوية، أو الأفكار المشتركة. يمكنك مراسلتي عبر النموذج أدناه أو
          مباشرة عبر البريد الإلكتروني.
        </p>
      </div>

      <ContactSection email={settings.email} />
    </div>
  );
}
