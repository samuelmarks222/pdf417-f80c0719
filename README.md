# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Credits and payments (Supabase)

The existing Vite application uses Supabase for Google sign-in, user credit balances, the transaction ledger, package configuration, payment records, and server-side provider integrations. Do not put service-role, SasaPay, or Plisio credentials in `VITE_*` variables.

### Configure the project

1. Create or select a Supabase project and configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the frontend hosting environment (Vercel) (or copy `.env.example` to `.env.local`). Vite explicitly maps only these two values into its client bundle; the publishable key is intended for browser use, and database access is restricted by RLS. The equivalent `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` names are also supported. Payment-provider variables do not belong in Vercel: configure them as Supabase Edge Function secrets in step 4.
2. In Supabase Authentication, enable Google and configure the Google OAuth client. Add the Supabase callback URL (`https://<project-ref>.supabase.co/auth/v1/callback`) in Google Cloud, and allow the deployed app URL plus `http://localhost:5173/account` in Supabase redirect URLs.
3. Link the Supabase CLI to the project and apply the database migration:

   ```sh
   supabase link --project-ref <project-ref>
   supabase db push
   ```

   For an existing project, check `supabase migration list` and `supabase db push --dry-run` first. If a migration was already applied manually in the SQL Editor but is missing from the migration history, verify its schema and repair the history before pushing; do not blindly rerun an already-applied migration.

4. Configure Edge Function secrets in the Supabase project (never in the frontend):

   ```sh
   supabase secrets set APP_ORIGIN=https://pdf417.live
   supabase secrets set SASAPAY_BASE_URL=https://api.sasapay.app
   supabase secrets set SASAPAY_CLIENT_ID=<rotated-SasaPay-client-id>
   supabase secrets set SASAPAY_CLIENT_SECRET=<rotated-SasaPay-client-secret>
   supabase secrets set SASAPAY_MERCHANT_CODE=<merchant-code>
   supabase secrets set SASAPAY_KES_PER_USD=129
   supabase secrets set PLISIO_API_KEY=<Plisio-API-key>
   ```

   The package catalog is priced in USD. M-Pesa amounts are rounded up to whole KES using `SASAPAY_KES_PER_USD`; the configured rate above is 129 KES per USD. Set `SASAPAY_BASE_URL` to the production API host; the function adds `/api/v1` automatically if it is not already present. The default M-Pesa network code is `63902` (Safaricom); set optional `SASAPAY_NETWORK_CODE` if your merchant requires a different code. The default status path is `payments/transaction-status/`; if your merchant's active API documents a different path, set optional `SASAPAY_STATUS_PATH`. Plisio invoices use USD and its hosted invoice lists enabled crypto options. Plisio's documented callback signature uses the same API key configured as `PLISIO_API_KEY`. The Edge Function constructs the callback URL for this Supabase project; do not configure a callback URL belonging to a different application.
5. Deploy the Edge Functions:

   ```sh
   supabase functions deploy create-payment
   supabase functions deploy payments-webhook
   supabase functions deploy admin-reconcile-payment
   ```

   Set the frontend variables in the hosting provider and rebuild/redeploy the Vite app. Configure the SasaPay callback as the deployed Supabase function URL ending in `/payments-webhook?provider=sasapay`; Plisio uses the same URL with `provider=plisio`. The webhook function intentionally disables gateway JWT verification because providers do not send a Supabase user token; it independently verifies Plisio callback signatures and checks SasaPay status using the server-side API.
6. Sign in once with the Google account that should administer the project. In the Supabase SQL editor, promote that verified account:

   ```sql
   update public.credit_profiles
   set is_admin = true
   where lower(email) = lower('admin@example.com');
   ```

   Do not grant admin access based on a client-supplied email. Package defaults are seeded only when absent, so package edits survive future deployments. Admins can update the ten seeded packages, and confirmed payments retain the package quantity and USD price captured at checkout.

   The `/admin` page also includes site appearance, homepage content, and SEO settings. Apply the migrations before using this section. Administrators can update the public site name, tagline, HTTPS logo/favicon URLs, homepage hero copy, footer notice, SEO metadata, canonical origin, indexing directive, and social-sharing image. These values are stored in `public.site_settings`, read publicly, and writable only through an administrator-checked RPC. The shared header, homepage, footer, favicon, and document metadata use the saved values. Payment provider credentials remain Supabase Edge Function secrets and are never exposed in the browser or admin UI.

### Verification notes

- Credit deductions are atomic database RPCs; failed barcode rendering is not charged, and successful payment credits are granted once in a locked, idempotent database transaction.
- Payment status changes and admin credit adjustments are recorded. Provider callbacks and verification errors are available in the admin panel; reconciliation checks the provider rather than manually declaring a payment successful.
- The project did not include Supabase project credentials, Google OAuth credentials, or SasaPay/Plisio merchant credentials. Provider sandbox flows, Google sign-in, webhook delivery, and production conversion rates must be tested/configured in the merchant's Supabase/provider accounts before launch. No successful test payment is assumed.
