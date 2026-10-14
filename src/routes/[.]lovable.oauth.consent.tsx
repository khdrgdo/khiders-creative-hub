import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type OAuthApi = {
  getAuthorizationDetails(id: string): Promise<{ data: any; error: { message: string } | null }>;
  approveAuthorization(id: string): Promise<{ data: any; error: { message: string } | null }>;
  denyAuthorization(id: string): Promise<{ data: any; error: { message: string } | null }>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  head: () => ({ meta: [{ title: "ربط مساعد ذكي | خضر مأمون" }, { name: "robots", content: "noindex" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s["authorization_id"] === "string" ? (s["authorization_id"] as string) : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("طلب الربط غير مكتمل.");
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ href: `/khider?next=${encodeURIComponent(location.pathname + location.searchStr)}` });
  },
  loader: async ({ location }) => {
    const id = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(id);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main dir="rtl" className="mx-auto max-w-md p-8 text-center">تعذر تحميل طلب الربط: {error instanceof Error ? error.message : String(error)}</main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = details?.client?.name ?? "تطبيق خارجي";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve ? await oauth().approveAuthorization(authorization_id) : await oauth().denyAuthorization(authorization_id);
    if (error) { setBusy(false); setError(error.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("لم يُرجع الخادم رابط المتابعة."); return; }
    window.location.href = target;
  }

  return (
    <main dir="rtl" className="mx-auto max-w-md space-y-5 p-8 text-center">
      <h1 className="text-2xl font-bold">ربط {name} بحسابك</h1>
      <p className="text-muted-foreground">سيتمكن {name} من إدارة محتوى الموقع وقراءة الرسائل باسمك.</p>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <div className="flex justify-center gap-3">
        <Button disabled={busy} onClick={() => decide(true)}>موافقة</Button>
        <Button variant="outline" disabled={busy} onClick={() => decide(false)}>رفض</Button>
      </div>
    </main>
  );
}
