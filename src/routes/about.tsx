import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { siteQuery } from "@/lib/queries";
import { mergeSettings } from "@/lib/content-helper";
import { useLiveSettings } from "@/lib/content-store";
import { CheckCircle2, Compass, BookOpen, Code, Sparkles, Terminal } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن خضر مأمون | السيرة والفكر والمسيرة" },
      {
        name: "description",
        content: "السيرة الذاتية والفكرية للمبرمج والكاتب والباحث المستقل خضر مأمون.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: siteData } = useQuery(siteQuery);
  const settings = useLiveSettings(mergeSettings(siteData?.settings));

  return (
    <div className="py-8 sm:py-16 max-w-3xl space-y-16">
      {/* Page Header */}
      <div className="space-y-4 pb-6 border-b border-border/60">
        <span className="text-xs font-sans text-primary font-semibold tracking-wider uppercase block">
          السيرة والمسار
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground">
          عنّي: في تقاطعات التقنية والفكر
        </h1>
        <p className="text-base sm:text-lg font-display text-muted-foreground">
          {settings.tagline}
        </p>
      </div>

      {/* Main Biography & Portrait Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {settings.avatarUrl && (
          <div className="md:col-span-5 order-first md:order-last">
            <div className="art-frame rounded-2xl overflow-hidden bg-card border border-border/80 p-2.5 shadow-sm">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-muted">
                <img
                  src={settings.avatarUrl}
                  alt={settings.siteName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <span className="font-display font-bold text-sm text-foreground block">
                  {settings.siteName}
                </span>
                <span className="text-[11px] font-sans text-muted-foreground">
                  {settings.tagline}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={settings.avatarUrl ? "md:col-span-7 space-y-6 prose-ar text-base text-foreground/90 leading-loose" : "md:col-span-12 space-y-6 prose-ar text-base sm:text-lg text-foreground/90 leading-loose"}>
          <p>
            أنا <strong className="text-foreground">{settings.siteName}</strong>، مهندس
            برمجيات وكاتب وباحث سوداني مستقل. تشكلت رؤيتي عبر سنوات من الترحال
            بين كود الحاسوب وكتب الفلسفة والأدب، حيث أرى في البرمجة ضرباً من ضروب
            التعبير الإنساني الرفيع وليس مجرد أداة نفعية بحتة.
          </p>

          <p>
            {settings.about}
          </p>
        </div>
      </section>

      {/* Journey & Timeline */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground pb-2 border-b border-border/40">
          محطات في المسيرة
        </h2>

        <div className="space-y-6">
          {settings.journey.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 p-4 rounded-xl bg-card border border-border/60"
            >
              <span className="font-mono text-xs font-bold text-primary shrink-0 sm:w-28">
                {item.year}
              </span>
              <p className="text-sm font-sans text-foreground/90 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interests & Domains */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground pb-2 border-b border-border/40">
          الاهتمامات البحثية والفكرية
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {settings.interests.map((interest, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-card"
            >
              <Compass className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs sm:text-sm font-sans font-medium text-foreground">
                {interest}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Skills */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground pb-2 border-b border-border/40">
          الأدوات والمهارات الهندسية
        </h2>

        <div className="flex flex-wrap gap-2">
          {settings.skills.map((skill, idx) => (
            <div
              key={idx}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-accent/30 text-xs font-mono text-foreground/90"
            >
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* Personal Quote */}
      <div className="p-8 rounded-2xl bg-accent/40 border border-lavender/40 text-center space-y-3">
        <p className="font-display text-lg sm:text-xl font-bold text-foreground leading-relaxed">
          «البرمجة الحقيقية تشبه الشعر: كلاهما يبحث عن أنقى صياغة ممكنة تُعبّر
          عن المعنى الكامن في أقل عدد من الرموز.»
        </p>
        <span className="text-xs font-sans text-muted-foreground block">
          — خضر مأمون
        </span>
      </div>
    </div>
  );
}
