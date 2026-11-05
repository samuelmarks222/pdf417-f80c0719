create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  display_name text,
  credit_balance bigint,
  is_admin boolean,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.is_credit_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  return query
  select
    auth_user.id,
    coalesce(profile.email, auth_user.email)::text,
    coalesce(
      profile.display_name,
      auth_user.raw_user_meta_data ->> 'full_name',
      auth_user.raw_user_meta_data ->> 'name'
    )::text,
    coalesce(profile.credit_balance, 0)::bigint,
    coalesce(profile.is_admin, false)::boolean,
    auth_user.created_at,
    auth_user.last_sign_in_at
  from auth.users as auth_user
  left join public.credit_profiles as profile on profile.id = auth_user.id
  order by auth_user.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;
