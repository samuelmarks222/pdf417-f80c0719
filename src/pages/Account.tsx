import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/useAuth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_usd: number;
  recommended: boolean;
}

interface PaymentRow {
  id: string;
  provider: string;
  amount_usd: number;
  amount_due: number;
  currency: string;
  provider_reference: string | null;
  status: string;
  checkout_url: string | null;
  created_at: string;
}

interface CreditRow {
  id: string;
  transaction_type: string;
  delta: number;
  balance_after: number;
  reason: string | null;
  created_at: string;
}

const currency = (amount: number) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(amount);

const statusClass = (status: string) => {
  if (status === "successful") return "text-green-700 bg-green-50 border-green-200";
  if (status === "pending") return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-destructive bg-destructive/5 border-destructive/20";
};

const Account = () => {
  const { configured, loading, user, profile, signInWithGoogle, refreshProfile } = useAuth();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [transactions, setTransactions] = useState<CreditRow[]>([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [provider, setProvider] = useState<"sasapay" | "plisio">("sasapay");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const paymentStatuses = useRef(new Map<string, string>());

  useEffect(() => {
    if (!supabase) return;
    void supabase
      .from("credit_packages")
      .select("id,name,credits,price_usd,recommended")
      .eq("active", true)
      .order("sort_order")
      .then(({ data, error }) => {
        if (error) {
          toast.error(`Could not load packages: ${error.message}`);
          return;
        }
        const packageRows = (data ?? []) as CreditPackage[];
        setPackages(packageRows);
        setSelectedPackage((current) => current || packageRows.find((item) => item.recommended)?.id || packageRows[0]?.id || "");
      });
  }, []);

  const refreshAccount = useCallback(async () => {
    if (!supabase || !user) return;
    const [paymentResult, transactionResult] = await Promise.all([
      supabase.from("credit_payments").select("id,provider,provider_reference,amount_usd,amount_due,currency,status,checkout_url,created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("credit_transactions").select("id,transaction_type,delta,balance_after,reason,created_at").order("created_at", { ascending: false }).limit(50),
    ]);

    const error = paymentResult.error ?? transactionResult.error;
    if (error) {
      toast.error(`Could not load account data: ${error.message}`);
      return;
    }

    const paymentRows = (paymentResult.data ?? []) as PaymentRow[];
    paymentRows.forEach((payment) => {
      if (paymentStatuses.current.get(payment.id) === "pending" && payment.status === "successful") {
        toast.success("Payment confirmed. Your credits are available.");
      }
      paymentStatuses.current.set(payment.id, payment.status);
    });
    setPayments(paymentRows);
    setTransactions((transactionResult.data ?? []) as CreditRow[]);
    try {
      await refreshProfile();
    } catch (profileError) {
      toast.error(profileError instanceof Error ? profileError.message : "Could not refresh the credit balance.");
    }
  }, [user, refreshProfile]);

  useEffect(() => {
    if (user) void refreshAccount();
  }, [user, refreshAccount]);

  const hasPendingPayments = payments.some((payment) => payment.status === "pending");
  useEffect(() => {
    if (!user || !hasPendingPayments) return;
    const timer = window.setInterval(() => void refreshAccount(), 5000);
    return () => window.clearInterval(timer);
  }, [user, hasPendingPayments, refreshAccount]);

  const startCheckout = async () => {
    if (!supabase || !selectedPackage) {
      toast.error("Choose an available credit package.");
      return;
    }
    if (provider === "sasapay" && !phoneNumber.trim()) {
      toast.error("Enter the M-Pesa phone number for the payment.");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { packageId: selectedPackage, provider, phoneNumber },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (provider === "plisio" && data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }

      toast.success(`${data.message ?? "M-Pesa payment request sent."} Amount: ${data.amount} ${data.currency}.`);
      await refreshAccount();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start payment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageShell><div className="container max-w-5xl py-10">Loading account…</div></PageShell>;
  }

  return (
    <PageShell>
      <main className="container max-w-6xl flex-1 py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Credits &amp; payments</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage your balance, choose a package, and keep track of every transaction.</p>
          </div>
          {user && (
            <div className="min-w-44 rounded-2xl bg-nav-background px-5 py-4 text-right text-nav-foreground-active shadow-lg shadow-slate-900/10">
              <p className="text-xs font-medium text-nav-foreground">Available balance</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">{profile?.credit_balance ?? "—"} <span className="text-sm font-medium text-nav-foreground">credits</span></p>
            </div>
          )}
        </div>

        {!isSupabaseConfigured ? (
          <SetupNotice />
        ) : !user ? (
          <>
            <section className="surface-panel relative overflow-hidden p-8 text-center sm:p-12">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-cyan-400" />
              <h2 className="text-2xl font-bold">Sign in to manage credits</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Use your Google account to buy packages, keep a private transaction history, and generate barcodes.
              </p>
              <Button className="mt-5" onClick={async () => {
                const error = await signInWithGoogle();
                if (error) toast.error(error);
              }}>
                Continue with Google
              </Button>
            </section>
            <section className="surface-panel mt-8 p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Choose a package</p>
                <h2 className="mt-1 text-xl font-bold">Credit packages</h2>
              </div>
              {packages.length === 0 ? <p className="text-sm text-muted-foreground">Package pricing appears here after the Supabase migration is applied.</p> : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {packages.map((item) => <PackageCard key={item.id} item={item} selected={selectedPackage === item.id} onSelect={setSelectedPackage} />)}
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            <section className="surface-panel mb-8 p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Top up</p>
                  <h2 className="mt-1 text-xl font-bold">Buy barcode credits</h2>
                  <p className="mt-1 text-sm text-muted-foreground">One credit is used for each successfully generated barcode.</p>
                </div>
                <Link to="/generator" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary">Go to generator <span aria-hidden="true">→</span></Link>
              </div>

              {packages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active packages are available right now.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {packages.map((item) => <PackageCard key={item.id} item={item} selected={selectedPackage === item.id} onSelect={setSelectedPackage} />)}
                </div>
              )}

              <div className="mt-6 grid gap-4 rounded-2xl bg-muted/60 p-4 md:grid-cols-[1fr_2fr_auto] md:items-end sm:p-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment method</label>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant={provider === "sasapay" ? "default" : "outline"} className="rounded-full" onClick={() => setProvider("sasapay")}>SasaPay / M-Pesa</Button>
                    <Button type="button" size="sm" variant={provider === "plisio" ? "default" : "outline"} className="rounded-full" onClick={() => setProvider("plisio")}>Crypto / Plisio</Button>
                  </div>
                </div>
                {provider === "sasapay" ? (
                  <div>
                    <label className="mb-2 block text-xs font-medium" htmlFor="mpesa-phone">M-Pesa phone number</label>
                    <Input id="mpesa-phone" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="0712345678" inputMode="tel" />
                    <p className="mt-1 text-[11px] text-muted-foreground">The checkout amount will be shown in KES before payment is initiated.</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Plisio opens a hosted invoice with the supported cryptocurrencies available to your merchant account.</p>
                )}
                <Button disabled={!selectedPackage || submitting} onClick={startCheckout} className="rounded-full px-5">
                  {submitting ? "Starting…" : provider === "sasapay" ? "Request M-Pesa payment" : "Continue to crypto checkout"}
                </Button>
              </div>
            </section>

            <section className="surface-panel mb-8 p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Recent activity</p>
                <h2 className="mt-1 text-xl font-bold">Payment history</h2>
              </div>
              {payments.length === 0 ? <p className="text-sm text-muted-foreground">No payments yet.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-xs">
                    <thead className="border-b border-border text-muted-foreground">
                      <tr><th className="pb-2 pr-3">Date</th><th className="pb-2 pr-3">Provider</th><th className="pb-2 pr-3">Amount</th><th className="pb-2 pr-3">Status</th><th className="pb-2">Reference</th></tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-b border-border/60">
                          <td className="py-3 pr-3">{new Date(payment.created_at).toLocaleString()}</td>
                          <td className="py-3 pr-3">{payment.provider === "sasapay" ? "SasaPay / M-Pesa" : "Plisio"}</td>
                          <td className="py-3 pr-3">{payment.currency === "USD" ? currency(Number(payment.amount_usd)) : `${payment.amount_due} ${payment.currency}`}</td>
                          <td className="py-3 pr-3"><span className={`rounded border px-2 py-1 ${statusClass(payment.status)}`}>{payment.status}</span></td>
                          <td className="max-w-40 truncate py-3 font-mono">
                            {payment.provider_reference ?? payment.id}
                            {payment.status === "pending" && payment.checkout_url && (
                              <a href={payment.checkout_url} target="_blank" rel="noreferrer" className="mt-1 block font-sans text-primary hover:underline">
                                Reopen invoice
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="surface-panel p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Account ledger</p>
                <h2 className="mt-1 text-xl font-bold">Credit history</h2>
              </div>
              {transactions.length === 0 ? <p className="text-sm text-muted-foreground">No credit activity yet.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-xs">
                    <thead className="border-b border-border text-muted-foreground">
                      <tr><th className="pb-2 pr-3">Date</th><th className="pb-2 pr-3">Activity</th><th className="pb-2 pr-3">Change</th><th className="pb-2 pr-3">Balance</th><th className="pb-2">Reason</th></tr>
                    </thead>
                    <tbody>
                      {transactions.map((entry) => (
                        <tr key={entry.id} className="border-b border-border/60">
                          <td className="py-3 pr-3">{new Date(entry.created_at).toLocaleString()}</td>
                          <td className="py-3 pr-3">{entry.transaction_type.replace("_", " ")}</td>
                          <td className={`py-3 pr-3 font-semibold ${entry.delta > 0 ? "text-green-700" : "text-foreground"}`}>{entry.delta > 0 ? "+" : ""}{entry.delta}</td>
                          <td className="py-3 pr-3">{entry.balance_after}</td>
                          <td className="py-3">{entry.reason ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </PageShell>
  );
};

function PackageCard({
  item,
  selected,
  onSelect,
}: {
  item: CreditPackage;
  selected: boolean;
  onSelect: (packageId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`relative rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
        selected ? "border-primary bg-primary/[0.04] ring-2 ring-primary/15 shadow-md shadow-primary/5" : "border-border bg-card hover:border-primary/40 hover:shadow-md"
      }`}
    >
      {item.recommended && <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-bold tracking-wide text-primary">BEST VALUE</span>}
      <span className="block pr-20 text-sm font-semibold text-muted-foreground">{item.name}</span>
      <span className="mt-3 block text-2xl font-bold tracking-tight">{item.credits.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">credits</span></span>
      <span className="mt-2 block text-lg font-semibold">{currency(Number(item.price_usd))}</span>
      <span className="mt-0.5 block text-xs text-muted-foreground">{currency(Number(item.price_usd) / item.credits)} per barcode</span>
    </button>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col bg-background"><Header />{children}<Footer /></div>;
}

function SetupNotice() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
      Supabase is not configured for this deployment. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> (or the equivalent <code>VITE_*</code> variables) to the frontend environment, then deploy the database migration and Edge Functions before enabling credit checkout.
    </div>
  );
}

export default Account;
