ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

DROP POLICY IF EXISTS "published readable" ON public.content_items;
CREATE POLICY "published readable" ON public.content_items FOR SELECT TO anon, authenticated
  USING (status = 'published'::content_status AND deleted_at IS NULL);

CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  action text NOT NULL,
  target_table text NOT NULL,
  target_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read audit" ON public.audit_log FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin insert audit" ON public.audit_log FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() AND user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.security_overview()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE r jsonb;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'admin only'; END IF;
  SELECT jsonb_build_object(
    'tables_without_rls', COALESCE((SELECT jsonb_agg(c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
        WHERE n.nspname='public' AND c.relkind='r' AND NOT c.relrowsecurity), '[]'::jsonb),
    'tables_rls_no_policies', COALESCE((SELECT jsonb_agg(c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
        WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity
        AND NOT EXISTS (SELECT 1 FROM pg_policies p WHERE p.schemaname='public' AND p.tablename=c.relname)), '[]'::jsonb),
    'open_policies', COALESCE((SELECT jsonb_agg(jsonb_build_object('table',tablename,'policy',policyname,'cmd',cmd,'roles',roles,'using',qual,'check',with_check))
        FROM pg_policies WHERE schemaname='public'
        AND (coalesce(trim(qual),'')='true' OR coalesce(trim(with_check),'')='true')
        AND cmd <> 'SELECT'), '[]'::jsonb),
    'public_read_policies', COALESCE((SELECT jsonb_agg(jsonb_build_object('table',tablename,'policy',policyname))
        FROM pg_policies WHERE schemaname='public' AND cmd='SELECT' AND coalesce(trim(qual),'')='true'), '[]'::jsonb)
  ) INTO r;
  RETURN r;
END $$;
REVOKE ALL ON FUNCTION public.security_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.security_overview() TO authenticated;