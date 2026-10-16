import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "../components/layout/Navbar";
import { SiteTheme } from "../components/layout/SiteTheme";
import { Footer } from "../components/layout/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-right dir-rtl">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-7xl font-display font-bold text-primary">404</h1>
        <h2 className="text-2xl font-display font-bold text-foreground">الصفحة غير موجودة</h2>
        <p className="text-sm font-sans text-muted-foreground">
          ربما تم نقل الصفحة أو أن الرابط غير صحيح. يمكنك العودة للصفحة الرئيسية دائماً.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-right dir-rtl">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-display font-bold text-foreground">
          حدث خطأ أثناء تحميل الصفحة
        </h1>
        <p className="text-sm font-sans text-muted-foreground">
          يمكنك محاولة إعادة التحميل أو العودة إلى الصفحة الرئيسية.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            إعادة المحاولة
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-card px-4 py-2 text-xs font-bold text-foreground transition-colors hover:bg-accent"
          >
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "خضر مأمون | Khiders Creative Hub" },
      {
        name: "description",
        content: "الموقع الشخصي للكاتب والمهندس والباحث المستقل خضر مأمون. فكر وشفرة وأدب.",
      },
      { name: "author", content: "خضر مأمون" },
      { property: "og:title", content: "خضر مأمون | Khiders Creative Hub" },
      {
        property: "og:description",
        content: "الموقع الشخصي للكاتب والمهندس والباحث المستقل خضر مأمون. فكر وشفرة وأدب.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent selection:text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isAdminRoute = pathname.startsWith("/khider");

  return (
    <QueryClientProvider client={queryClient}>
      <SiteTheme />
      <Toaster position="top-center" richColors closeButton />

      {isAdminRoute ? (
        // Clean distraction-free layout for private admin dashboard
        <Outlet />
      ) : (
        // Public website layout
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main key={pathname} className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16 page-enter">
            <Outlet />
          </main>
          <Footer />
        </div>
      )}
    </QueryClientProvider>
  );
}
