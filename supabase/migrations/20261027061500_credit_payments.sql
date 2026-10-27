create table if not exists public.credit_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  credit_balance bigint not null default 0 check (credit_balance >= 0),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.credit_packages (
  id text primary key,
  name text not null,
  credits integer not null check (credits > 0),
  price_usd numeric(12, 2) not null check (price_usd > 0),
  active boolean not null default true,
  recommended boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create unique index if not exists credit_packages_one_recommended
  on public.credit_packages (recommended)
  where recommended;

create table if not exists public.credit_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.credit_profiles(id),
  package_id text not null references public.credit_packages(id),
  provider text not null check (provider in ('sasapay', 'plisio')),
  provider_reference text,
  checkout_reference text not null unique,
  credits_granted integer not null check (credits_granted > 0),
  amount_usd numeric(12, 2) not null check (amount_usd > 0),
  amount_due numeric(14, 2) not null check (amount_due > 0),
  currency text not null,
  phone_number text,
  checkout_url text,
  status text not null default 'pending'
    check (status in ('pending', 'successful', 'failed', 'cancelled', 'expired', 'underpaid')),
  provider_data jsonb not null default '{}'::jsonb,
  verification_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  credited_at timestamptz
);

create unique index if not exists credit_payments_provider_reference
  on public.credit_payments (provider, provider_reference)
  where provider_reference is not null;
create index if not exists credit_payments_user_created
  on public.credit_payments (user_id, created_at desc);
create index if not exists credit_payments_status_created
  on public.credit_payments (status, created_at desc);

create table if not exists public.barcode_generations (
  id uuid primary key,
  user_id uuid not null references public.credit_profiles(id),
  data_digest text not null check (length(data_digest) = 64),
  created_at timestamptz not null default now()
);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.credit_profiles(id),
  transaction_type text not null
    check (transaction_type in ('purchase', 'generation', 'admin_adjustment')),
  delta bigint not null check (delta <> 0),
  balance_after bigint not null check (balance_after >= 0),
  payment_id uuid references public.credit_payments(id),
  generation_id uuid references public.barcode_generations(id),
  actor_user_id uuid references public.credit_profiles(id),
  reason text,
  created_at timestamptz not null default now(),
  check (
    (transaction_type = 'purchase' and delta > 0 and payment_id is not null)
    or (transaction_type = 'generation' and delta = -1 and generation_id is not null)
    or (transaction_type = 'admin_adjustment' and reason is not null and length(trim(reason)) > 0)
  )
);

create unique index if not exists credit_transactions_one_purchase
  on public.credit_transactions (payment_id)
  where transaction_type = 'purchase';
create unique index if not exists credit_transactions_one_generation
  on public.credit_transactions (generation_id)
  where transaction_type = 'generation';
create index if not exists credit_transactions_user_created
  on public.credit_transactions (user_id, created_at desc);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.credit_payments(id),
  provider text not null check (provider in ('sasapay', 'plisio')),
  event_type text not null,
  message text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_credit_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.credit_profiles
    where id = (select auth.uid()) and is_admin
  );
$$;

create or replace function public.handle_credit_user_created()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.credit_profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.credit_profiles.display_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_credit_profile on auth.users;
create trigger on_auth_user_created_credit_profile
  after insert or update of email, raw_user_meta_data on auth.users
  for each row execute procedure public.handle_credit_user_created();

insert into public.credit_profiles (id, email, display_name)
select
  id,
  email,
  coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name')
from auth.users
on conflict (id) do update
  set email = excluded.email,
      display_name = coalesce(excluded.display_name, public.credit_profiles.display_name);

insert into public.credit_packages (id, name, credits, price_usd, active, recommended, sort_order)
values
  ('single', 'Single', 1, 3.00, true, false, 1),
  ('starter', 'Starter', 5, 14.00, true, false, 2),
  ('basic', 'Basic', 10, 26.00, true, false, 3),
  ('standard', 'Standard', 25, 60.00, true, false, 4),
  ('value', 'Value', 50, 110.00, true, false, 5),
  ('pro', 'Pro', 100, 200.00, true, true, 6),
  ('business', 'Business', 250, 450.00, true, false, 7),
  ('advanced', 'Advanced', 500, 800.00, true, false, 8),
  ('premium', 'Premium', 1000, 1500.00, true, false, 9),
  ('enterprise', 'Enterprise', 2500, 3500.00, true, false, 10)
on conflict (id) do nothing;

create or replace function public.consume_barcode_credit(p_generation_id uuid, p_data_digest text)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_balance bigint;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_data_digest !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid barcode digest' using errcode = '22023';
  end if;

  insert into public.barcode_generations (id, user_id, data_digest)
  values (p_generation_id, v_user_id, p_data_digest)
  on conflict (id) do nothing;

  if not found then
    if not exists (
      select 1 from public.barcode_generations
      where id = p_generation_id and user_id = v_user_id and data_digest = p_data_digest
    ) then
      raise exception 'Generation reference already used' using errcode = '23505';
    end if;
    select credit_balance into v_balance from public.credit_profiles where id = v_user_id;
    return v_balance;
  end if;

  update public.credit_profiles
    set credit_balance = credit_balance - 1
    where id = v_user_id and credit_balance > 0
    returning credit_balance into v_balance;
  if not found then
    raise exception 'Insufficient credits' using errcode = 'P0001';
  end if;

  insert into public.credit_transactions
    (user_id, transaction_type, delta, balance_after, generation_id)
  values (v_user_id, 'generation', -1, v_balance, p_generation_id);
  return v_balance;
end;
$$;

create or replace function public.admin_adjust_credits(p_user_id uuid, p_delta bigint, p_reason text)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_balance bigint;
begin
  if not public.is_credit_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if p_delta = 0 or length(trim(coalesce(p_reason, ''))) < 3 then
    raise exception 'A non-zero adjustment and reason are required' using errcode = '22023';
  end if;

  update public.credit_profiles
    set credit_balance = credit_balance + p_delta
    where id = p_user_id and credit_balance + p_delta >= 0
    returning credit_balance into v_balance;
  if not found then
    raise exception 'User not found or adjustment would make balance negative' using errcode = 'P0001';
  end if;

  insert into public.credit_transactions
    (user_id, transaction_type, delta, balance_after, actor_user_id, reason)
  values (p_user_id, 'admin_adjustment', p_delta, v_balance, auth.uid(), trim(p_reason));
  return v_balance;
end;
$$;

create or replace function public.confirm_credit_payment(
  p_payment_id uuid,
  p_provider_reference text,
  p_provider_data jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_payment public.credit_payments%rowtype;
  v_balance bigint;
begin
  if auth.role() <> 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;

  select * into v_payment from public.credit_payments where id = p_payment_id for update;
  if not found then
    raise exception 'Payment not found' using errcode = 'P0002';
  end if;
  if v_payment.status = 'successful' then
    return false;
  end if;
  update public.credit_profiles
    set credit_balance = credit_balance + v_payment.credits_granted
    where id = v_payment.user_id
    returning credit_balance into v_balance;

  update public.credit_payments
    set status = 'successful',
        provider_reference = coalesce(p_provider_reference, provider_reference),
        provider_data = coalesce(p_provider_data, '{}'::jsonb),
        verification_error = null,
        credited_at = now(),
        updated_at = now()
    where id = p_payment_id;

  insert into public.credit_transactions
    (user_id, transaction_type, delta, balance_after, payment_id, reason)
  values (
    v_payment.user_id,
    'purchase',
    v_payment.credits_granted,
    v_balance,
    p_payment_id,
    'Verified payment'
  );
  return true;
end;
$$;

create or replace function public.update_credit_payment_status(
  p_payment_id uuid,
  p_status text,
  p_error text default null,
  p_provider_data jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;
  if p_status not in ('pending', 'failed', 'cancelled', 'expired', 'underpaid') then
    raise exception 'Invalid non-success payment status' using errcode = '22023';
  end if;

  update public.credit_payments
    set status = p_status,
        verification_error = p_error,
        provider_data = coalesce(p_provider_data, '{}'::jsonb),
        updated_at = now()
    where id = p_payment_id and status in ('pending', 'underpaid');
end;
$$;

create or replace function public.admin_update_credit_package(
  p_id text,
  p_name text,
  p_credits integer,
  p_price_usd numeric,
  p_active boolean,
  p_recommended boolean
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
  if length(trim(coalesce(p_name, ''))) < 1 or p_credits < 1 or p_price_usd <= 0 then
    raise exception 'Package name, credits, and price must be valid' using errcode = '22023';
  end if;
  if p_recommended and not p_active then
    raise exception 'A recommended package must be active' using errcode = '22023';
  end if;
  if not exists (select 1 from public.credit_packages where id = p_id) then
    raise exception 'Package not found' using errcode = 'P0002';
  end if;

  if p_recommended then
    update public.credit_packages set recommended = false where recommended and id <> p_id;
  end if;

  update public.credit_packages
    set name = trim(p_name),
        credits = p_credits,
        price_usd = p_price_usd,
        active = p_active,
        recommended = p_recommended,
        updated_at = now()
    where id = p_id;
end;
$$;

create or replace function public.admin_credit_dashboard_stats()
returns table (
  total_users bigint,
  total_barcodes bigint,
  successful_payments bigint,
  pending_payments bigint,
  confirmed_revenue numeric,
  credits_purchased bigint,
  credits_consumed bigint
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_credit_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  return query
  select
    (select count(*) from public.credit_profiles),
    (select count(*) from public.barcode_generations),
    (select count(*) from public.credit_payments where status = 'successful'),
    (select count(*) from public.credit_payments where status in ('pending', 'underpaid')),
    coalesce((select sum(amount_usd) from public.credit_payments where status = 'successful'), 0),
    coalesce((select sum(delta) from public.credit_transactions where transaction_type = 'purchase'), 0),
    coalesce((select -sum(delta) from public.credit_transactions where transaction_type = 'generation'), 0);
end;
$$;

alter table public.credit_profiles enable row level security;
alter table public.credit_packages enable row level security;
alter table public.credit_payments enable row level security;
alter table public.barcode_generations enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.payment_events enable row level security;

create policy "Users read own credit profile"
  on public.credit_profiles for select to authenticated
  using (id = auth.uid() or public.is_credit_admin());
create policy "Active packages are public"
  on public.credit_packages for select to anon, authenticated
  using (active);
create policy "Admins can view inactive packages"
  on public.credit_packages for select to authenticated
  using (public.is_credit_admin());
create policy "Users read own payment history"
  on public.credit_payments for select to authenticated
  using (user_id = auth.uid() or public.is_credit_admin());
create policy "Users read own credit history"
  on public.credit_transactions for select to authenticated
  using (user_id = auth.uid() or public.is_credit_admin());
create policy "Users read own generation history"
  on public.barcode_generations for select to authenticated
  using (user_id = auth.uid() or public.is_credit_admin());
create policy "Admins read payment events"
  on public.payment_events for select to authenticated
  using (public.is_credit_admin());

grant select on public.credit_packages to anon, authenticated;
grant select on public.credit_profiles, public.credit_payments, public.credit_transactions, public.barcode_generations, public.payment_events to authenticated;
grant all on public.credit_profiles, public.credit_packages, public.credit_payments, public.barcode_generations, public.credit_transactions, public.payment_events to service_role;

revoke all on function public.consume_barcode_credit(uuid, text) from public, anon;
grant execute on function public.consume_barcode_credit(uuid, text) to authenticated;
revoke all on function public.admin_adjust_credits(uuid, bigint, text) from public, anon;
grant execute on function public.admin_adjust_credits(uuid, bigint, text) to authenticated;
revoke all on function public.confirm_credit_payment(uuid, text, jsonb) from public, anon, authenticated;
grant execute on function public.confirm_credit_payment(uuid, text, jsonb) to service_role;
revoke all on function public.update_credit_payment_status(uuid, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.update_credit_payment_status(uuid, text, text, jsonb) to service_role;
revoke all on function public.admin_update_credit_package(text, text, integer, numeric, boolean, boolean) from public, anon;
grant execute on function public.admin_update_credit_package(text, text, integer, numeric, boolean, boolean) to authenticated;
revoke all on function public.admin_credit_dashboard_stats() from public, anon;
grant execute on function public.admin_credit_dashboard_stats() to authenticated;
grant execute on function public.is_credit_admin() to authenticated;
