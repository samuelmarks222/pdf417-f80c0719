alter table public.site_settings
  add column if not exists crypto_ltc_address text not null default '';

create or replace function public.admin_update_crypto_wallets(
  p_btc_address text,
  p_ltc_address text,
  p_eth_address text,
  p_usdt_trc20_address text,
  p_usdc_erc20_address text
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

  if length(trim(coalesce(p_btc_address, ''))) > 256
    or length(trim(coalesce(p_ltc_address, ''))) > 256
    or length(trim(coalesce(p_eth_address, ''))) > 256
    or length(trim(coalesce(p_usdt_trc20_address, ''))) > 256
    or length(trim(coalesce(p_usdc_erc20_address, ''))) > 256 then
    raise exception 'Crypto wallet addresses must be 256 characters or fewer' using errcode = '22023';
  end if;

  update public.site_settings
  set crypto_btc_address = trim(coalesce(p_btc_address, '')),
      crypto_ltc_address = trim(coalesce(p_ltc_address, '')),
      crypto_eth_address = trim(coalesce(p_eth_address, '')),
      crypto_usdt_trc20_address = trim(coalesce(p_usdt_trc20_address, '')),
      crypto_usdc_erc20_address = trim(coalesce(p_usdc_erc20_address, '')),
      updated_at = now()
  where id = 1;

  if not found then
    raise exception 'Site settings have not been initialized' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.admin_update_crypto_wallets(text, text, text, text, text) from public, anon;
grant execute on function public.admin_update_crypto_wallets(text, text, text, text, text) to authenticated;
