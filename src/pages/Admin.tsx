import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/useAuth";
import type { SiteSettings } from "@/contexts/site-settings-context";
import { useSiteSettings } from "@/contexts/useSiteSettings";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface PackageRow {
  id: string;
  name: string;
  credits: number;
  price_usd: number;
  active: boolean;
  recommended: boolean;
}

interface UserRow {
  id: string;
  email: string | null;
  display_name: string | null;
  credit_balance: number;
  created_at: string;
}

interface PaymentRow {
  id: string;
  user_id: string;
  package_id: string;
  provider: string;
  provider_reference: string | null;
  amount_usd: number;
  amount_due: number;
  currency: string;
  status: string;
  verification_error: string | null;
  created_at: string;
}

interface TransactionRow {
  id: string;
  user_id: string;
  transaction_type: string;
  delta: number;
  balance_after: number;
  reason: string | null;
  created_at: string;
}

interface PaymentEventRow {
  id: string;
  payment_id: string | null;
  provider: string;
  event_type: string;
  message: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

interface Stats {
  total_users: number;
  total_barcodes: number;
  successful_payments: number;
  pending_payments: number;
  confirmed_revenue: number;
  credits_purchased: number;
  credits_consumed: number;
}

const Admin = () => {
  const { loading, user, profile } = useAuth();
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [events, setEvents] = useState<PaymentEventRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [adjustment, setAdjustment] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!supabase || !profile?.is_admin) return;
    const [packageResult, userResult, paymentResult, eventResult, statsResult] = await Promise.all([
      supabase.from("credit_packages").select("id,name,credits,price_usd,active,recommended").order("sort_order"),
      supabase.from("credit_profiles").select("id,email,display_name,credit_balance,created_at").order("created_at", { ascending: false }).limit(1000),
      supabase.from("credit_payments").select("id,user_id,package_id,provider,provider_reference,amount_usd,amount_due,currency,status,verification_error,created_at").order("created_at", { ascending: false }).limit(1000),
      supabase.from("payment_events").select("id,payment_id,provider,event_type,message,payload,created_at").order("created_at", { ascending: false }).limit(500),
      supabase.rpc("admin_credit_dashboard_stats"),
    ]);

    const results = [packageResult, userResult, paymentResult, eventResult, statsResult];
    const errorResult = results.find((result) => result.error);
    if (errorResult?.error) {
      toast.error(`Could not load admin data: ${errorResult.error.message}`);
      return;
    }

    setPackages((packageResult.data ?? []) as PackageRow[]);
    setUsers((userResult.data ?? []) as UserRow[]);
    setPayments((paymentResult.data ?? []) as PaymentRow[]);
    setEvents((eventResult.data ?? []) as PaymentEventRow[]);
    const statsData = statsResult.data;
    setStats((Array.isArray(statsData) ? statsData[0] : statsData) as Stats | null);
  }, [profile?.is_admin]);

  const loadUserHistory = useCallback(async () => {
    if (!supabase || !profile?.is_admin || !selectedUser) {
      setTransactions([]);
      return;
    }
    const { data, error } = await supabase
      .from("credit_transactions")
      .select("id,user_id,transaction_type,delta,balance_after,reason,created_at")
      .eq("user_id", selectedUser)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      toast.error(`Could not load user credit history: ${error.message}`);
      return;
    }
    setTransactions((data ?? []) as TransactionRow[]);
  }, [profile?.is_admin, selectedUser]);

  useEffect(() => {
    if (profile?.is_admin) void loadData();
  }, [profile?.is_admin, loadData]);

  useEffect(() => {
    void loadUserHistory();
  }, [loadUserHistory]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((item) => !term || (item.email ?? "").toLowerCase().includes(term));
  }, [users, search]);

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();
    return payments.filter((item) => {
      const email = users.find((candidate) => candidate.id === item.user_id)?.email ?? "";
      const matchesTerm = !term || [item.id, item.provider_reference, item.user_id, email].some((value) => (value ?? "").toLowerCase().includes(term));
      const matchesStatus = !paymentFilter || item.status === paymentFilter;
      const matchesProvider = !providerFilter || item.provider === providerFilter;
      return matchesTerm && matchesStatus && matchesProvider;
    });
  }, [payments, search, paymentFilter, providerFilter, users]);

  const userTransactions = useMemo(
    () => transactions.filter((item) => item.user_id === selectedUser),
    [transactions, selectedUser],
  );

  const savePackage = async (item: PackageRow) => {
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase.rpc("admin_update_credit_package", {
      p_id: item.id,
      p_name: item.name,
      p_credits: Number(item.credits),
      p_price_usd: Number(item.price_usd),
      p_active: item.active,
      p_recommended: item.recommended,
    });
    setSaving(false);
    if (error) {
      toast.error(`Could not save package: ${error.message}`);
      return;
    }
    toast.success(`${item.name} package saved.`);
    await loadData();
  };

  const adjustUserCredits = async () => {
    if (!supabase || !selectedUser || !reason.trim()) {
      toast.error("Select a user and provide a reason for the adjustment.");
      return;
    }
    const delta = Number(adjustment);
    if (!Number.isInteger(delta) || delta === 0) {
      toast.error("Enter a non-zero whole number of credits.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.rpc("admin_adjust_credits", {
      p_user_id: selectedUser,
      p_delta: delta,
      p_reason: reason.trim(),
    });
    setSaving(false);
    if (error) {
      toast.error(`Credit adjustment failed: ${error.message}`);
      return;
    }
    toast.success("Credit adjustment recorded in the ledger.");
    setAdjustment("");
    setReason("");
    await loadData();
    await loadUserHistory();
  };

  const reconcile = async (paymentId: string) => {
    if (!supabase) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-reconcile-payment", {
        body: { paymentId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Provider status: ${data.status}${data.credited ? " — credits added" : ""}.`);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reconcile payment.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageShell><main className="container flex-1 py-10">Loading…</main></PageShell>;

  return (
    <PageShell>
      <main className="container max-w-7xl flex-1 space-y-7 py-8 sm:py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Control center</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Credits &amp; payments</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage packages, review account activity, and verify provider transactions.</p>
        </div>

        {!user ? (
          <Notice>Sign in with an administrator account to continue.</Notice>
        ) : !profile?.is_admin ? (
          <Notice>This account is not authorized to access the admin panel.</Notice>
        ) : (
          <>
            <SiteSettingsPanel />

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Total users" value={stats?.total_users ?? "—"} />
              <Stat label="Barcodes generated" value={stats?.total_barcodes ?? "—"} />
              <Stat label="Successful payments" value={stats?.successful_payments ?? "—"} />
              <Stat label="Pending payments" value={stats?.pending_payments ?? "—"} />
              <Stat label="Confirmed revenue" value={stats ? `$${Number(stats.confirmed_revenue).toFixed(2)}` : "—"} />
              <Stat label="Credits purchased" value={stats?.credits_purchased ?? "—"} />
              <Stat label="Credits consumed" value={stats?.credits_consumed ?? "—"} />
            </section>

            <section className="surface-panel p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Catalog</p>
                <h2 className="mt-1 text-xl font-bold">Package management</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[790px] text-left text-xs">
                  <thead className="border-b border-border text-muted-foreground">
                    <tr><th className="pb-2 pr-3">Package</th><th className="pb-2 pr-3">Credits</th><th className="pb-2 pr-3">Price (USD)</th><th className="pb-2 pr-3">Per barcode</th><th className="pb-2 pr-3">Available</th><th className="pb-2 pr-3">Recommended</th><th className="pb-2">Save</th></tr>
                  </thead>
                  <tbody>
                    {packages.map((item) => (
                      <tr key={item.id} className="border-b border-border/60">
                        <td className="py-2 pr-3"><Input value={item.name} onChange={(event) => updatePackage(item.id, { name: event.target.value }, setPackages)} className="h-8 min-w-32 text-xs" /></td>
                        <td className="py-2 pr-3"><Input type="number" min="1" value={item.credits} onChange={(event) => updatePackage(item.id, { credits: Number(event.target.value) }, setPackages)} className="h-8 w-24 text-xs" /></td>
                        <td className="py-2 pr-3"><Input type="number" min="0.01" step="0.01" value={item.price_usd} onChange={(event) => updatePackage(item.id, { price_usd: Number(event.target.value) }, setPackages)} className="h-8 w-28 text-xs" /></td>
                        <td className="py-2 pr-3">${(Number(item.price_usd) / Number(item.credits || 1)).toFixed(2)}</td>
                        <td className="py-2 pr-3"><input type="checkbox" checked={item.active} onChange={(event) => updatePackage(item.id, { active: event.target.checked, ...(event.target.checked ? {} : { recommended: false }) }, setPackages)} aria-label={`${item.name} active`} /></td>
                        <td className="py-2 pr-3"><input type="radio" checked={item.recommended} onChange={() => setPackages((current) => current.map((pkg) => ({ ...pkg, recommended: pkg.id === item.id })))} name="recommended-package" aria-label={`${item.name} recommended`} /></td>
                        <td className="py-2"><Button size="sm" disabled={saving} onClick={() => savePackage(item)}>Save</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="surface-panel p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Accounts</p>
                  <h2 className="mt-1 text-xl font-bold">Users &amp; credit adjustments</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Adjustments require a reason and are added to the audit ledger.</p>
                </div>
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search email, payment, or user ID" className="max-w-sm" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead className="border-b border-border text-muted-foreground"><tr><th className="pb-2 pr-3">Email</th><th className="pb-2 pr-3">Name</th><th className="pb-2 pr-3">Credits</th><th className="pb-2 pr-3">Registered</th><th className="pb-2">History</th></tr></thead>
                  <tbody>
                    {filteredUsers.map((item) => (
                      <tr key={item.id} className="border-b border-border/60">
                        <td className="py-2 pr-3">{item.email ?? "—"}</td><td className="py-2 pr-3">{item.display_name ?? "—"}</td><td className="py-2 pr-3">{item.credit_balance}</td><td className="py-2 pr-3">{new Date(item.created_at).toLocaleDateString()}</td>
                        <td className="py-2"><Button size="sm" variant={selectedUser === item.id ? "default" : "outline"} onClick={() => setSelectedUser(item.id)}>Select</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedUser && (
                <div className="mt-5 border-t border-border pt-4">
                  <p className="mb-3 text-xs font-medium">Selected user credit history ({userTransactions.length} entries)</p>
                  <div className="mb-4 grid gap-2 sm:grid-cols-[140px_1fr_auto]">
                    <Input type="number" step="1" value={adjustment} onChange={(event) => setAdjustment(event.target.value)} placeholder="+/- credits" />
                    <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Required reason for adjustment" />
                    <Button disabled={saving} onClick={adjustUserCredits}>Apply adjustment</Button>
                  </div>
                  <HistoryRows rows={userTransactions} />
                </div>
              )}
            </section>

            <section className="surface-panel p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Transactions</p>
                  <h2 className="mt-1 text-xl font-bold">Payments &amp; reconciliation</h2>
                </div>
                <div className="flex gap-2">
                  <select value={providerFilter} onChange={(event) => setProviderFilter(event.target.value)} className="h-10 rounded border border-input bg-background px-3 text-sm">
                    <option value="">All providers</option><option value="sasapay">SasaPay</option><option value="plisio">Plisio</option><option value="nowpayments">NOWPayments (legacy)</option>
                  </select>
                  <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)} className="h-10 rounded border border-input bg-background px-3 text-sm">
                    <option value="">All statuses</option>
                    {["pending", "successful", "failed", "cancelled", "expired", "underpaid"].map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-xs">
                  <thead className="border-b border-border text-muted-foreground"><tr><th className="pb-2 pr-3">Created</th><th className="pb-2 pr-3">User</th><th className="pb-2 pr-3">Provider</th><th className="pb-2 pr-3">Reference</th><th className="pb-2 pr-3">Amount</th><th className="pb-2 pr-3">Status</th><th className="pb-2 pr-3">Verification error</th><th className="pb-2">Verify</th></tr></thead>
                  <tbody>
                    {filteredPayments.map((item) => (
                      <tr key={item.id} className="border-b border-border/60">
                        <td className="py-2 pr-3">{new Date(item.created_at).toLocaleString()}</td>
                        <td className="max-w-36 truncate py-2 pr-3">{users.find((candidate) => candidate.id === item.user_id)?.email ?? item.user_id}</td>
                        <td className="py-2 pr-3">{item.provider}</td><td className="max-w-40 truncate py-2 pr-3 font-mono">{item.provider_reference ?? item.id}</td>
                        <td className="py-2 pr-3">{item.currency === "USD" ? `$${Number(item.amount_usd).toFixed(2)}` : `${item.amount_due} ${item.currency}`}</td>
                        <td className="py-2 pr-3">{item.status}</td><td className="max-w-48 truncate py-2 pr-3 text-destructive">{item.verification_error ?? "—"}</td>
                        <td className="py-2"><Button size="sm" variant="outline" disabled={saving || item.status === "successful"} onClick={() => reconcile(item.id)}>Reconcile</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="surface-panel p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Provider activity</p>
                <h2 className="mt-1 text-xl font-bold">Webhook &amp; verification events</h2>
              </div>
              {events.length === 0 ? <p className="text-xs text-muted-foreground">No provider events recorded.</p> : (
                <div className="max-h-96 space-y-2 overflow-auto">
                  {events.map((event) => (
                    <div key={event.id} className="rounded border border-border p-3 text-xs">
                      <div className="flex flex-wrap justify-between gap-2"><strong>{event.provider} · {event.event_type}</strong><time className="text-muted-foreground">{new Date(event.created_at).toLocaleString()}</time></div>
                      <p className="mt-1 text-muted-foreground">{event.message ?? event.payment_id ?? "Provider callback received."}</p>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-muted-foreground">Event payload</summary>
                        <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-[10px]">{JSON.stringify(event.payload, null, 2)}</pre>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </PageShell>
  );
};

function getImageSettingLabel(setting: "logo_url" | "favicon_url" | "og_image_url") {
  if (setting === "logo_url") return "logo";
  if (setting === "favicon_url") return "favicon";
  return "social sharing image";
}

function getImageExtension(mimeType: string) {
  const extensions: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/avif": "avif",
    "image/x-icon": "ico",
    "image/vnd.microsoft.icon": "ico",
  };
  return extensions[mimeType] ?? "png";
}

function SiteSettingsPanel() {
  const { settings, loading, error: settingsError, refresh } = useSiteSettings();
  const { user } = useAuth();
  const [draft, setDraft] = useState(settings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingSocialImage, setUploadingSocialImage] = useState(false);
  const logoFileInput = useRef<HTMLInputElement>(null);
  const faviconFileInput = useRef<HTMLInputElement>(null);
  const socialImageFileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const update = (key: keyof SiteSettings, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const uploadBrandImage = async (
    event: ChangeEvent<HTMLInputElement>,
    setting: "logo_url" | "favicon_url" | "og_image_url",
  ) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!supabase || !user) {
      toast.error(`Sign in as an administrator to upload the ${getImageSettingLabel(setting)}.`);
      return;
    }
    const isFavicon = setting === "favicon_url";
    const allowedTypes = isFavicon
      ? ["image/png", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"]
      : ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(isFavicon
        ? "Choose a PNG, SVG, or ICO favicon image."
        : "Choose a PNG, JPEG, WebP, GIF, SVG, or AVIF image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(`${getImageSettingLabel(setting)} images must be 2 MB or smaller.`);
      return;
    }

    if (setting === "logo_url") setUploadingLogo(true);
    else if (isFavicon) setUploadingFavicon(true);
    else setUploadingSocialImage(true);
    const extension = getImageExtension(file.type);
    const folder = setting === "logo_url" ? "logos" : isFavicon ? "favicons" : "social-images";
    const objectPath = `${folder}/${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from("site-assets")
      .upload(objectPath, file, { contentType: file.type, cacheControl: "3600" });
    if (error) {
      if (setting === "logo_url") setUploadingLogo(false);
      else if (isFavicon) setUploadingFavicon(false);
      else setUploadingSocialImage(false);
      toast.error(`Could not upload ${getImageSettingLabel(setting)}: ${error.message}`);
      return;
    }

    const { data } = supabase.storage.from("site-assets").getPublicUrl(objectPath);
    update(setting, data.publicUrl);
    if (setting === "logo_url") setUploadingLogo(false);
    else if (isFavicon) setUploadingFavicon(false);
    else setUploadingSocialImage(false);
    toast.success(`${getImageSettingLabel(setting)} uploaded. Click Save and publish to use it on the site.`);
  };

  const save = async () => {
    if (!supabase) return;
    if (!isHttpsUrl(draft.canonical_url) || !isOriginUrl(draft.canonical_url)) {
      toast.error("Canonical URL must be an HTTPS site origin, such as https://pdf417.live.");
      return;
    }
    for (const [label, value] of [
      ["Logo", draft.logo_url],
      ["Favicon", draft.favicon_url],
      ["Social sharing image", draft.og_image_url],
    ] as const) {
      if (value && !isHttpsUrl(value)) {
        toast.error(`${label} URL must start with https://.`);
        return;
      }
    }

    setSavingSettings(true);
    const { error } = await supabase.rpc("admin_update_site_settings", {
      p_site_name: draft.site_name,
      p_site_tagline: draft.site_tagline,
      p_logo_url: draft.logo_url,
      p_favicon_url: draft.favicon_url,
      p_meta_title: draft.meta_title,
      p_meta_description: draft.meta_description,
      p_meta_keywords: draft.meta_keywords,
      p_canonical_url: draft.canonical_url,
      p_meta_robots: draft.meta_robots,
      p_og_image_url: draft.og_image_url,
      p_twitter_handle: draft.twitter_handle,
      p_hero_badge: draft.hero_badge,
      p_hero_title: draft.hero_title,
      p_hero_highlight: draft.hero_highlight,
      p_hero_description: draft.hero_description,
      p_footer_notice: draft.footer_notice,
    });
    setSavingSettings(false);
    if (error) {
      toast.error(`Could not save site settings: ${error.message}`);
      return;
    }
    const refreshed = await refresh();
    if (!refreshed) {
      toast.error("Settings were saved, but the live preview could not refresh. Reload the page to retry.");
      return;
    }
    toast.success("Site settings saved and published.");
  };

  return (
    <section className="surface-panel space-y-6 p-5 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Website</p>
        <h2 className="mt-1 text-xl font-bold">Site appearance, content &amp; SEO</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes publish to the shared site settings used by the header, homepage, footer, and page metadata.
        </p>
      </div>

      {settingsError && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Could not load site settings: {settingsError}. Apply the site-settings migration, then reload this page.
        </p>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold">Branding</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsInput label="Site name" value={draft.site_name} onChange={(value) => update("site_name", value)} />
          <div className="grid gap-2 text-sm font-medium">
            <span>Logo image</span>
            <div className="flex flex-wrap items-center gap-3">
              {draft.logo_url && (
                <img src={draft.logo_url} alt="Current site logo preview" className="h-12 max-w-36 rounded border border-border object-contain p-1" />
              )}
              <input
                ref={logoFileInput}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
                onChange={(event) => void uploadBrandImage(event, "logo_url")}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => logoFileInput.current?.click()}
                disabled={uploadingLogo || loading || Boolean(settingsError)}
              >
                {uploadingLogo ? "Uploading…" : draft.logo_url ? "Replace logo" : "Upload logo"}
              </Button>
              <span className="text-xs font-normal text-muted-foreground">PNG, JPEG, or WebP · up to 2 MB</span>
            </div>
          </div>
          <div className="grid gap-2 text-sm font-medium">
            <span>Favicon image</span>
            <div className="flex flex-wrap items-center gap-3">
              {draft.favicon_url && (
                <img src={draft.favicon_url} alt="Current favicon preview" className="h-10 w-10 rounded border border-border object-contain p-1" />
              )}
              <input
                ref={faviconFileInput}
                type="file"
                accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico,.svg"
                onChange={(event) => void uploadBrandImage(event, "favicon_url")}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => faviconFileInput.current?.click()}
                disabled={uploadingFavicon || loading || Boolean(settingsError)}
              >
                {uploadingFavicon ? "Uploading…" : draft.favicon_url ? "Replace favicon" : "Upload favicon"}
              </Button>
              <span className="text-xs font-normal text-muted-foreground">PNG or ICO · up to 2 MB</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Homepage content</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsInput label="Hero badge" value={draft.hero_badge} onChange={(value) => update("hero_badge", value)} />
          <SettingsInput label="Main heading" value={draft.hero_title} onChange={(value) => update("hero_title", value)} />
          <SettingsInput label="Highlighted heading" value={draft.hero_highlight} onChange={(value) => update("hero_highlight", value)} />
          <SettingsInput label="Footer notice" value={draft.footer_notice} onChange={(value) => update("footer_notice", value)} />
          <SettingsTextarea label="Homepage description" value={draft.hero_description} onChange={(value) => update("hero_description", value)} />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Search and social metadata</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsInput label="SEO page title" value={draft.meta_title} onChange={(value) => update("meta_title", value)} />
          <SettingsInput label="Canonical site origin" value={draft.canonical_url} onChange={(value) => update("canonical_url", value)} placeholder="https://pdf417.live" />
          <SettingsTextarea label="SEO description" value={draft.meta_description} onChange={(value) => update("meta_description", value)} />
          <SettingsTextarea label="SEO keywords" value={draft.meta_keywords} onChange={(value) => update("meta_keywords", value)} />
          <div className="grid gap-2 text-sm font-medium">
            <span>Social sharing image</span>
            <div className="flex flex-wrap items-center gap-3">
              {draft.og_image_url && (
                <img src={draft.og_image_url} alt="Current social sharing image preview" className="h-12 max-w-36 rounded border border-border object-contain p-1" />
              )}
              <input
                ref={socialImageFileInput}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
                onChange={(event) => void uploadBrandImage(event, "og_image_url")}
                className="hidden"
                disabled={uploadingSocialImage || loading || Boolean(settingsError)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => socialImageFileInput.current?.click()}
                disabled={uploadingSocialImage || loading || Boolean(settingsError)}
              >
                {uploadingSocialImage ? "Uploading…" : draft.og_image_url ? "Replace image" : "Upload image"}
              </Button>
              <span className="text-xs font-normal text-muted-foreground">PNG, JPEG, WebP, GIF, SVG, or AVIF · up to 2 MB</span>
            </div>
          </div>
          <SettingsInput label="X/Twitter handle" value={draft.twitter_handle} onChange={(value) => update("twitter_handle", value)} placeholder="@yourhandle" />
          <label className="grid gap-1.5 text-sm font-medium">
            Search engine indexing
            <select
              value={draft.meta_robots}
              onChange={(event) => update("meta_robots", event.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm font-normal"
            >
              <option value="index,follow">Allow indexing</option>
              <option value="noindex,nofollow">Prevent indexing</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-xs leading-5 text-muted-foreground">
          Payment API keys remain protected as Supabase Edge Function secrets and are intentionally not editable or visible here.
        </p>
        <Button onClick={save} disabled={savingSettings || loading || Boolean(settingsError)} className="shrink-0">
          {savingSettings ? "Publishing…" : loading ? "Loading settings…" : "Save and publish"}
        </Button>
      </div>
    </section>
  );
}

function SettingsInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function SettingsTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} />
    </label>
  );
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isOriginUrl(value: string) {
  try {
    const url = new URL(value);
    return url.pathname === "/" && !url.search && !url.hash;
  } catch {
    return false;
  }
}

function updatePackage(
  id: string,
  patch: Partial<PackageRow>,
  setPackages: React.Dispatch<React.SetStateAction<PackageRow[]>>,
) {
  setPackages((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
}

function HistoryRows({ rows }: { rows: TransactionRow[] }) {
  if (!rows.length) return <p className="text-xs text-muted-foreground">No credit activity.</p>;
  return (
    <div className="max-h-64 overflow-auto">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-border text-muted-foreground"><tr><th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Type</th><th className="py-2 pr-3">Change</th><th className="py-2 pr-3">Balance</th><th className="py-2">Reason</th></tr></thead>
        <tbody>{rows.map((entry) => <tr key={entry.id} className="border-b border-border/60"><td className="py-2 pr-3">{new Date(entry.created_at).toLocaleString()}</td><td className="py-2 pr-3">{entry.transaction_type}</td><td className="py-2 pr-3">{entry.delta > 0 ? "+" : ""}{entry.delta}</td><td className="py-2 pr-3">{entry.balance_after}</td><td className="py-2">{entry.reason ?? "—"}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight">{value}</p></div>;
}

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">{children}</div>;
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col bg-background"><Header />{children}<Footer /></div>;
}

export default Admin;
