-- Preserve prior payment history without retaining the retired processor as an
-- active provider. No checkout or callback path accepts the `legacy` value.
alter table public.credit_payments
  drop constraint if exists credit_payments_provider_check;

alter table public.credit_payments
  add constraint credit_payments_provider_check
  check (provider in ('sasapay', 'plisio', 'nowpayments', 'legacy'));

update public.credit_payments
  set provider = 'legacy'
  where provider = 'nowpayments';

alter table public.credit_payments
  drop constraint if exists credit_payments_provider_check;

alter table public.credit_payments
  add constraint credit_payments_provider_check
  check (provider in ('sasapay', 'plisio', 'legacy'));

alter table public.payment_events
  drop constraint if exists payment_events_provider_check;

alter table public.payment_events
  add constraint payment_events_provider_check
  check (provider in ('sasapay', 'plisio', 'nowpayments', 'legacy'));

update public.payment_events
  set provider = 'legacy'
  where provider = 'nowpayments';

alter table public.payment_events
  drop constraint if exists payment_events_provider_check;

alter table public.payment_events
  add constraint payment_events_provider_check
  check (provider in ('sasapay', 'plisio', 'legacy'));
