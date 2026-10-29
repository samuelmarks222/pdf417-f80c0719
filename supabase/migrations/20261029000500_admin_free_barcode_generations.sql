create or replace function public.consume_barcode_credit(p_generation_id uuid, p_data_digest text)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_balance bigint;
  v_is_admin boolean;
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

  select is_admin, credit_balance into v_is_admin, v_balance
  from public.credit_profiles
  where id = v_user_id;

  if coalesce(v_is_admin, false) then
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
