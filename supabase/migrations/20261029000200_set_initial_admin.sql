update public.credit_profiles as profile
set is_admin = true
from auth.users as auth_user
where profile.id = auth_user.id
  and lower(auth_user.email) = 'samuelmarks222@gmail.com'
  and auth_user.email_confirmed_at is not null;

create or replace function public.handle_credit_user_created()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.credit_profiles (id, email, display_name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    lower(coalesce(new.email, '')) = 'samuelmarks222@gmail.com'
      and new.email_confirmed_at is not null
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.credit_profiles.display_name),
        is_admin = public.credit_profiles.is_admin or excluded.is_admin;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_credit_profile on auth.users;
create trigger on_auth_user_created_credit_profile
  after insert or update of email, raw_user_meta_data, email_confirmed_at on auth.users
  for each row execute procedure public.handle_credit_user_created();
