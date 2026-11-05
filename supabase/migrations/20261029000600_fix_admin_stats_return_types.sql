drop function if exists public.admin_credit_dashboard_stats();

create function public.admin_credit_dashboard_stats()
returns table (
  total_users bigint,
  total_barcodes bigint,
  successful_payments bigint,
  pending_payments bigint,
  confirmed_revenue numeric,
  credits_purchased numeric,
  credits_consumed numeric
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
    coalesce((select sum(amount_usd) from public.credit_payments where status = 'successful'), 0::numeric),
    coalesce((select sum(delta) from public.credit_transactions where transaction_type = 'purchase'), 0::numeric),
    coalesce((select -sum(delta) from public.credit_transactions where transaction_type = 'generation'), 0::numeric);
end;
$$;

grant execute on function public.admin_credit_dashboard_stats() to authenticated;
