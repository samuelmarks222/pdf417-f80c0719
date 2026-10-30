update public.credit_packages
set credits = case id
  when 'single' then 1
  when 'starter' then 5
  when 'basic' then 10
  when 'standard' then 20
  when 'value' then 50
  when 'pro' then 100
  when 'business' then 200
  when 'advanced' then 500
  else credits
end,
price_usd = case id
  when 'single' then 3.00
  when 'starter' then 12.00
  when 'basic' then 19.00
  when 'standard' then 39.00
  when 'value' then 79.00
  when 'pro' then 99.00
  when 'business' then 169.00
  when 'advanced' then 299.00
  else price_usd
end,
active = case
  when id in ('single', 'starter', 'basic', 'standard', 'value', 'pro', 'business', 'advanced') then true
  when id in ('premium', 'enterprise') then false
  else active
end,
updated_at = now()
where id in ('single', 'starter', 'basic', 'standard', 'value', 'pro', 'business', 'advanced', 'premium', 'enterprise');
