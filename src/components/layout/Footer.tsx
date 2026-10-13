import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 sm:mt-32 border-t border-border/60 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Identity & Statement */}
          <div className="md:col-span-6 space-y-3">
            <h3 className="font-display text-2xl font-bold text-foreground">
              خضر مأمون
            </h3>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed max-w-md">
              مبرمج، كاتب، وباحث مستقل. مساحة رقمية تعنى بهندسة البرمجيات،
              وفلسفة التقنية، وجماليات اللغة والفكر العربي المعاصر.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span>الخرطوم ➔ الشتات ➔ الفضاء الرقمي</span>
            </div>
          </div>

          {/* Quick Sections */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              الأقسام
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/books" className="hover:text-primary transition-colors">
                  الكتب والإصدارات
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-primary transition-colors">
                  المشاريع البرمجية
                </Link>
              </li>
              <li>
                <Link to="/writing" className="hover:text-primary transition-colors">
                  المقالات والكتابات
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-primary transition-colors">
                  الأبحاث والدراسات
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary transition-colors">
                  معرض الصور
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              الروابط والتواصل
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/khdrgdo"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>X / Twitter</span>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>مراسلة مباشرة</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} خضر مأمون. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-3">
            <span>صُنع بعناية وهدوء</span>
            <span>•</span>
            <Link
              to="/khider"
              className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              title="إدارة الموقع"
            >
              مدخل الإدارة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
