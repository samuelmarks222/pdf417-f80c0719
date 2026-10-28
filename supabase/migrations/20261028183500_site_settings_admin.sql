create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  site_name text not null default 'PDF417.PRO',
  site_tagline text not null default 'A practical barcode workspace',
  logo_url text not null default '',
  favicon_url text not null default '',
  meta_title text not null default 'PDF417 Pro | Barcode Workspace',
  meta_description text not null default 'A focused workspace for creating PDF417 and Code 128 barcodes with state-aware fields, useful helpers, and clear credit controls.',
  meta_keywords text not null default 'PDF417, barcode generator, Code 128, barcode workspace',
  canonical_url text not null default 'https://pdf417.live',
  meta_robots text not null default 'index,follow'
    check (meta_robots in ('index,follow', 'noindex,nofollow')),
  og_image_url text not null default '',
  twitter_handle text not null default '',
  hero_badge text not null default 'A PRACTICAL BARCODE WORKSPACE',
  hero_title text not null default 'Build, preview, and download',
  hero_highlight text not null default 'in one place.',
  hero_description text not null default 'A focused workspace for creating PDF417 and Code 128 barcodes with state-aware fields, useful helpers, and clear credit controls.',
  footer_notice text not null default 'For educational and testing use only.',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Site settings are publicly readable" on public.site_settings;
create policy "Site settings are publicly readable"
  on public.site_settings for select to anon, authenticated
  using (id = 1);

grant select on public.site_settings to anon, authenticated;
grant all on public.site_settings to service_role;

create or replace function public.admin_update_site_settings(
  p_site_name text,
  p_site_tagline text,
  p_logo_url text,
  p_favicon_url text,
  p_meta_title text,
  p_meta_description text,
  p_meta_keywords text,
  p_canonical_url text,
  p_meta_robots text,
  p_og_image_url text,
  p_twitter_handle text,
  p_hero_badge text,
  p_hero_title text,
  p_hero_highlight text,
  p_hero_description text,
  p_footer_notice text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_credit_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  if length(trim(coalesce(p_site_name, ''))) not between 1 and 80
    or length(trim(coalesce(p_site_tagline, ''))) > 160
    or length(trim(coalesce(p_meta_title, ''))) not between 1 and 120
    or length(trim(coalesce(p_meta_description, ''))) not between 1 and 320
    or length(trim(coalesce(p_meta_keywords, ''))) > 500
    or length(trim(coalesce(p_twitter_handle, ''))) > 80
    or length(trim(coalesce(p_hero_badge, ''))) > 100
    or length(trim(coalesce(p_hero_title, ''))) not between 1 and 120
    or length(trim(coalesce(p_hero_highlight, ''))) > 120
    or length(trim(coalesce(p_hero_description, ''))) not between 1 and 500
    or length(trim(coalesce(p_footer_notice, ''))) > 240 then
    raise exception 'One or more text fields are empty or too long' using errcode = '22023';
  end if;

  if p_meta_robots not in ('index,follow', 'noindex,nofollow') then
    raise exception 'Invalid robots directive' using errcode = '22023';
  end if;
  if trim(coalesce(p_canonical_url, '')) !~ '^https://[^/?#[:space:]]+/?$' then
    raise exception 'Canonical URL must be a valid HTTPS URL' using errcode = '22023';
  end if;
  if coalesce(p_logo_url, '') <> '' and trim(p_logo_url) !~ '^https://[^[:space:]]+$' then
    raise exception 'Logo URL must use HTTPS' using errcode = '22023';
  end if;
  if coalesce(p_favicon_url, '') <> '' and trim(p_favicon_url) !~ '^https://[^[:space:]]+$' then
    raise exception 'Favicon URL must use HTTPS' using errcode = '22023';
  end if;
  if coalesce(p_og_image_url, '') <> '' and trim(p_og_image_url) !~ '^https://[^[:space:]]+$' then
    raise exception 'Social image URL must use HTTPS' using errcode = '22023';
  end if;

  update public.site_settings
  set site_name = trim(p_site_name),
      site_tagline = trim(p_site_tagline),
      logo_url = trim(coalesce(p_logo_url, '')),
      favicon_url = trim(coalesce(p_favicon_url, '')),
      meta_title = trim(p_meta_title),
      meta_description = trim(p_meta_description),
      meta_keywords = trim(coalesce(p_meta_keywords, '')),
      canonical_url = trim(p_canonical_url),
      meta_robots = p_meta_robots,
      og_image_url = trim(coalesce(p_og_image_url, '')),
      twitter_handle = trim(coalesce(p_twitter_handle, '')),
      hero_badge = trim(coalesce(p_hero_badge, '')),
      hero_title = trim(p_hero_title),
      hero_highlight = trim(coalesce(p_hero_highlight, '')),
      hero_description = trim(p_hero_description),
      footer_notice = trim(coalesce(p_footer_notice, '')),
      updated_at = now()
  where id = 1;
end;
$$;

revoke all on function public.admin_update_site_settings(
  text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text
) from public, anon;
grant execute on function public.admin_update_site_settings(
  text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text
) to authenticated;
