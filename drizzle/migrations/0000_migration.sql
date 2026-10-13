
create type public.app_role as enum ('admin');
create type public.content_type as enum ('book','project','article','research','gallery');
create type public.content_status as enum ('draft','published');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create table public.admin_allowlist (email text primary key);
grant all on public.admin_allowlist to service_role;
alter table public.admin_allowlist enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin')
$$;

create or replace function public.guard_signup()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.admin_allowlist where lower(email) = lower(new.email)) then
    raise exception 'Registration is closed';
  end if;
  return new;
end $$;
create trigger guard_signup before insert on auth.users for each row execute function public.guard_signup();

create or replace function public.grant_admin_on_signup()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.admin_allowlist where lower(email) = lower(new.email)) then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger grant_admin_on_signup after insert on auth.users for each row execute function public.grant_admin_on_signup();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  type content_type not null,
  title text not null check (char_length(title) between 1 and 300),
  slug text not null check (char_length(slug) between 1 and 120),
  excerpt text not null default '',
  body text not null default '',
  category text not null default '',
  tags text[] not null default '{}',
  cover_url text,
  file_path text,
  images text[] not null default '{}',
  links jsonb not null default '[]',
  meta jsonb not null default '{}',
  status content_status not null default 'draft',
  featured boolean not null default false,
  sort_order int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, slug)
);
grant select on public.content_items to anon;
grant select, insert, update, delete on public.content_items to authenticated;
grant all on public.content_items to service_role;
alter table public.content_items enable row level security;
create policy "published readable" on public.content_items for select to anon, authenticated using (status = 'published');
create policy "admin all" on public.content_items for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger content_touch before update on public.content_items for each row execute function public.touch_updated_at();

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  body text not null default '',
  status content_status not null default 'draft',
  show_in_nav boolean not null default false,
  seo_description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.pages to anon;
grant select, insert, update, delete on public.pages to authenticated;
grant all on public.pages to service_role;
alter table public.pages enable row level security;
create policy "published readable" on public.pages for select to anon, authenticated using (status = 'published');
create policy "admin all" on public.pages for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger pages_touch before update on public.pages for each row execute function public.touch_updated_at();

create table public.home_sections (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('hero','books','projects','writing','research','gallery','quote','text')),
  title text not null default '',
  subtitle text not null default '',
  body text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.home_sections to anon;
grant select, insert, update, delete on public.home_sections to authenticated;
grant all on public.home_sections to service_role;
alter table public.home_sections enable row level security;
create policy "visible readable" on public.home_sections for select to anon, authenticated using (visible);
create policy "admin all" on public.home_sections for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon;
grant select, insert, update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public readable" on public.site_settings for select to anon, authenticated using (true);
create policy "admin write" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) <= 255 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  subject text not null default '' check (char_length(subject) <= 200),
  message text not null check (char_length(message) between 1 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "anyone can send" on public.contact_messages for insert to anon, authenticated with check (is_read = false);
create policy "admin read" on public.contact_messages for select to authenticated using (public.is_admin());
create policy "admin update" on public.contact_messages for update to authenticated using (public.is_admin());
create policy "admin delete" on public.contact_messages for delete to authenticated using (public.is_admin());

-- storage: media is publicly readable (images); files only by admin (published downloads go through signed URLs from the server)
create policy "anyone reads media" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "admin reads files" on storage.objects for select to authenticated using (bucket_id = 'files' and public.is_admin());
create policy "admin uploads" on storage.objects for insert to authenticated with check (bucket_id in ('media','files') and public.is_admin());
create policy "admin updates" on storage.objects for update to authenticated using (bucket_id in ('media','files') and public.is_admin());
create policy "admin deletes" on storage.objects for delete to authenticated using (bucket_id in ('media','files') and public.is_admin());

insert into public.site_settings(id, data) values (1, '{
 "siteName":"خضر مأمون",
 "tagline":"مبرمج، كاتب، وباحث مستقل",
 "intro":"أكتب الشيفرة كما أكتب النص: بحثاً عن الوضوح، وعن معنى يبقى. هنا تجد كتبي ومشاريعي وأبحاثي وما أدوّنه من تأملات.",
 "about":"وُلدت في السودان، وتشكّلت بين الكتب ولوحة المفاتيح. أعمل مبرمجاً، وأكتب في الفكر والأدب، وأتابع أبحاثاً مستقلة في التقنية والمجتمع.",
 "interests":["البرمجة","الفلسفة","الأدب العربي","البحث المستقل","التصوير"],
 "skills":["TypeScript","React","Python","PostgreSQL","الكتابة البحثية"],
 "journey":[{"year":"البداية","text":"أول سطر برمجي وأول دفتر للكتابة."},{"year":"اليوم","text":"مشاريع برمجية مفتوحة، كتب، وأبحاث مستقلة."}],
 "primaryColor":"#7c6bb5",
 "accentColor":"#e9e4f7",
 "logoUrl":"",
 "email":"",
 "socials":[{"label":"GitHub","url":"https://github.com"},{"label":"X","url":"https://x.com"}],
 "nav":[{"label":"الرئيسية","to":"/"},{"label":"عنّي","to":"/about"},{"label":"الكتب","to":"/books"},{"label":"المشاريع","to":"/projects"},{"label":"الكتابات","to":"/writing"},{"label":"الأبحاث","to":"/research"},{"label":"المعرض","to":"/gallery"},{"label":"تواصل","to":"/contact"}],
 "seo":{"title":"خضر مأمون — مبرمج وكاتب وباحث","description":"الموقع الشخصي لخضر مأمون: كتب، مشاريع برمجية، مقالات، وأبحاث مستقلة.","ogImage":""}
}');

insert into public.home_sections(kind,title,subtitle,body,sort_order) values
 ('hero','خضر مأمون','مبرمج، كاتب، وباحث مستقل','',0),
 ('books','من المكتبة','كتب ومخطوطات','',1),
 ('writing','آخر الكتابات','مقالات وتأملات','',2),
 ('projects','مشاريع مختارة','برمجيات صنعتها','',3),
 ('quote','','','«الوضوح شكلٌ من أشكال اللطف.»',4),
 ('research','أبحاث','أسئلة مفتوحة','',5),
 ('gallery','من المعرض','صور وأعمال بصرية','',6);

insert into public.content_items(type,title,slug,excerpt,body,category,status,featured,published_at,sort_order) values
 ('book','ظلال النيل','zilal-alnil','مجموعة نصوص عن المكان والذاكرة.','نصوص قصيرة كُتبت على مدى سنوات، عن الخرطوم والنيل وما يتركه المكان فينا.','أدب','published',true,now(),0),
 ('book','البرمجة بوضوح','clear-code','دليل عملي لكتابة شيفرة مقروءة.','كتاب في مبادئ كتابة الشيفرة الواضحة، مع أمثلة عملية.','تقنية','published',true,now(),1),
 ('article','عن البطء في عصر السرعة','on-slowness','تأمل في قيمة التمهّل.','في زمن تتسارع فيه الأشياء، يصبح البطء موقفاً.

هذه محاولة للتفكير في ذلك.','تأملات','published',true,now(),0),
 ('article','لماذا أكتب؟','why-i-write','سؤال قديم يتجدد.','أكتب لأفهم. هذا كل شيء، وهو كثير.','مقالات','published',false,now(),1),
 ('project','مِداد','midad','محرر نصوص عربي بسيط للكتّاب.','محرر نصوص يدعم العربية والكتابة من اليمين لليسار بشكل كامل.','أدوات','published',true,now(),0),
 ('research','اللغة العربية والنماذج اللغوية','arabic-llms','دراسة أولية لأداء النماذج اللغوية على النصوص العربية.','ملخص البحث وأسئلته ومنهجيته.','ذكاء اصطناعي','published',true,now(),0);
update public.content_items set meta='{"technologies":["TypeScript","React"]}', links='[{"label":"GitHub","url":"https://github.com"}]' where slug='midad';
update public.content_items set meta='{"references":["Vaswani et al., Attention Is All You Need, 2017"]}' where slug='arabic-llms';
