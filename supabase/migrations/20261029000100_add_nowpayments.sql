alter table public.credit_payments
  drop constraint if exists credit_payments_provider_check;

alter table public.credit_payments
  add constraint credit_payments_provider_check
  check (provider in ('sasapay', 'plisio', 'nowpayments'));

alter table public.payment_events
  drop constraint if exists payment_events_provider_check;

alter table public.payment_events
  add constraint payment_events_provider_check
  check (provider in ('sasapay', 'plisio', 'nowpayments'));
