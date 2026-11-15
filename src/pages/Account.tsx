import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/useAuth";
import { useSiteSettings } from "@/contexts/useSiteSettings";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ArrowRight, Check, MessageCircle, ShieldCheck } from "lucide-react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import bitcoinLogo from "cryptocurrency-icons/svg/color/btc.svg";
import litecoinLogo from "cryptocurrency-icons/svg/color/ltc.svg";
import ethereumLogo from "cryptocurrency-icons/svg/color/eth.svg";
import tetherLogo from "cryptocurrency-icons/svg/color/usdt.svg";
import usdCoinLogo from "cryptocurrency-icons/svg/color/usdc.svg";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_usd: number;
  recommended: boolean;
}

interface PaymentRow {
  id: string;
  package_id: string;
  provider: string;
  amount_usd: number;
  amount_due: number;
  currency: string;
  provider_reference: string | null;
  provider_data: Record<string, unknown>;
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

const cryptoAssets = [
  { value: "BTC", name: "Bitcoin (BTC)", network: "Bitcoin", setting: "crypto_btc_address", logo: bitcoinLogo },
  { value: "LTC", name: "Litecoin (LTC)", network: "Litecoin", setting: "crypto_ltc_address", logo: litecoinLogo },
  { value: "ETH", name: "Ethereum (ETH)", network: "Ethereum (ERC-20)", setting: "crypto_eth_address", logo: ethereumLogo },
  { value: "USDT_TRC20", name: "Tether (USDT)", network: "Tron (TRC-20)", setting: "crypto_usdt_trc20_address", logo: tetherLogo },
  { value: "USDC_ERC20", name: "USD Coin (USDC)", network: "Ethereum (ERC-20)", setting: "crypto_usdc_erc20_address", logo: usdCoinLogo },
] as const;

const statusClass = (status: string) => {
  if (status === "successful") return "text-green-700 bg-green-50 border-green-200";
  if (status === "pending") return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-destructive bg-destructive/5 border-destructive/20";
};

const Account = () => {
  const { configured, loading, user, profile, signInWithGoogle, refreshProfile } = useAuth();
  const { settings: siteSettings, loading: settingsLoading } = useSiteSettings();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [transactions, setTransactions] = useState<CreditRow[]>([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const provider = "manual_crypto";
  const [cryptoAsset, setCryptoAsset] = useState<(typeof cryptoAssets)[number]["value"]>("BTC");
  const [revealedCryptoPaymentIds, setRevealedCryptoPaymentIds] = useState<Set<string>>(() => new Set());
  const [paidCryptoPaymentIds, setPaidCryptoPaymentIds] = useState<Set<string>>(() => new Set());
  const [cryptoTransactionHashes, setCryptoTransactionHashes] = useState<Record<string, string>>({});
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
      supabase.from("credit_payments").select("id,package_id,provider,provider_reference,provider_data,amount_usd,amount_due,currency,status,checkout_url,created_at").order("created_at", { ascending: false }).limit(50),
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
  const singleCreditPrice = Number(packages.find((item) => item.credits === 1)?.price_usd ?? 3);
  const selectedPackageDetails = packages.find((item) => item.id === selectedPackage);
  const configuredCryptoAssets = cryptoAssets.filter((asset) => siteSettings[asset.setting].trim());
  const selectedCryptoAsset = configuredCryptoAssets.find((asset) => asset.value === cryptoAsset)?.value
    ?? configuredCryptoAssets[0]?.value;
  const pendingCryptoPayment = payments.find((payment) =>
    payment.provider === "manual_crypto"
      && payment.status === "pending"
      && payment.package_id === selectedPackage
      && payment.provider_data.crypto_asset === selectedCryptoAsset
  );

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
    if (!selectedCryptoAsset) {
      toast.error("No crypto wallet is configured yet. Contact site support.");
      return;
    }
    if (pendingCryptoPayment && !revealedCryptoPaymentIds.has(pendingCryptoPayment.id)) {
      setRevealedCryptoPaymentIds((current) => new Set(current).add(pendingCryptoPayment.id));
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { packageId: selectedPackage, provider, cryptoAsset: selectedCryptoAsset },
      });
      if (error instanceof FunctionsHttpError) {
        const responseBody: unknown = await error.context.json().catch(() => null);
        if (
          responseBody !== null
          && typeof responseBody === "object"
          && "error" in responseBody
          && typeof responseBody.error === "string"
        ) {
          throw new Error(responseBody.error);
        }
      }
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (typeof data?.paymentId !== "string") {
        throw new Error("Payment was created, but its address could not be loaded. Check your payment history.");
      }

      setRevealedCryptoPaymentIds((current) => new Set(current).add(data.paymentId));
      toast.success(`Crypto payment created for ${currency(Number(data.amount))}. Send the payment to the address shown below.`);
      await refreshAccount();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const markCryptoPaymentPaid = (paymentId: string) => {
    setPaidCryptoPaymentIds((current) => new Set(current).add(paymentId));
    toast.success("Contact support to confirm your payment. Credits are added after admin verification.");
  };

  const submitCryptoHash = async (paymentId: string) => {
    if (!supabase) return;
    const transactionHash = cryptoTransactionHashes[paymentId]?.trim();
    if (!transactionHash) {
      toast.error("Enter the blockchain transaction hash.");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-crypto-payment", {
        body: { paymentId, transactionHash },
      });
      if (error instanceof FunctionsHttpError) {
        const responseBody: unknown = await error.context.json().catch(() => null);
        if (
          responseBody !== null
          && typeof responseBody === "object"
          && "error" in responseBody
          && typeof responseBody.error === "string"
        ) {
          throw new Error(responseBody.error);
        }
      }
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Transaction hash submitted. Credits will be added after an administrator verifies the payment.");
      setCryptoTransactionHashes((current) => ({ ...current, [paymentId]: "" }));
      await refreshAccount();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit the transaction hash.");
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
          {profile?.is_admin && (
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link to="/admin">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin dashboard
              </Link>
            </Button>
          )}
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
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {packages.map((item) => <PackageCard key={item.id} item={item} selected={selectedPackage === item.id} referencePrice={singleCreditPrice} onSelect={setSelectedPackage} />)}
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            <section className="surface-panel mb-8 overflow-hidden">
              <div className="relative overflow-hidden border-b border-border/70 bg-gradient-to-br from-primary/[0.08] via-card to-amber-400/[0.06] px-5 py-6 sm:px-7 sm:py-7">
                <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-primary/[0.07] blur-3xl" />
                <div className="relative flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Credit wallet · Step 1</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Choose your credit package</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                      Pick the amount that fits your work. Larger packages lower your cost per barcode.
                    </p>
                  </div>
                  <Link to="/generator" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:text-primary">
                    Go to generator <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {packages.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No active packages are available right now.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {packages.map((item) => <PackageCard key={item.id} item={item} selected={selectedPackage === item.id} referencePrice={singleCreditPrice} onSelect={setSelectedPackage} />)}
                  </div>
                )}
              </div>

              <div className="border-t border-border/70 bg-slate-50 p-4 sm:p-7">
                <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.85fr_1.15fr]">
                  <aside className="relative overflow-hidden bg-blue-600 p-6 text-white sm:p-8">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-400/40 blur-3xl" />
                    <div className="relative flex h-full flex-col">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                        <span>Crypto checkout</span>
                        <span>Step 2 of 3</span>
                      </div>
                      <h3 className="mt-8 text-3xl font-bold tracking-tight">Pay with crypto</h3>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">
                        Choose your coin and network, then send the exact amount to the address provided.
                      </p>

                      <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">Order summary</p>
                        {selectedPackageDetails ? (
                          <>
                            <p className="mt-4 text-xl font-bold">{selectedPackageDetails.name}</p>
                            <p className="mt-1 text-sm text-blue-100">{selectedPackageDetails.credits.toLocaleString()} credits</p>
                          </>
                        ) : (
                          <p className="mt-4 text-sm text-blue-100">Choose a credit package above.</p>
                        )}
                        <div className="mt-5 flex items-end justify-between border-t border-white/20 pt-4">
                          <span className="text-sm text-blue-100">Amount due</span>
                          <span className="text-2xl font-bold">{selectedPackageDetails ? currency(Number(selectedPackageDetails.price_usd)) : "—"}</span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center gap-3 pt-8 text-sm text-blue-50">
                        <ShieldCheck className="h-5 w-5 shrink-0" />
                        <span>Credits are added after your payment is verified.</span>
                      </div>
                    </div>
                  </aside>

                  <div className="p-5 sm:p-8">
                    <div className="mb-8 flex items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 sm:text-sm">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-white"><Check className="h-4 w-4" /></span>
                        <span>Package</span>
                      </div>
                      <span className="h-px flex-1 bg-slate-200" />
                      <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 sm:text-sm">
                        <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-blue-600 bg-white">2</span>
                        <span>Crypto</span>
                      </div>
                      <span className="h-px flex-1 bg-slate-200" />
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 sm:text-sm">
                        <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-slate-200 bg-white">3</span>
                        <span>Complete</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Payment</p>
                      <h4 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Select coin and network</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Make your payment with crypto. Check the network carefully before sending.
                      </p>
                    </div>

                    <p id="crypto-asset-label" className="mb-2 mt-7 block text-sm font-semibold text-slate-700">
                      Crypto and network
                    </p>
                    <div role="group" aria-labelledby="crypto-asset-label" className="grid gap-3 sm:grid-cols-2">
                      {configuredCryptoAssets.map((asset) => (
                        <button
                          key={asset.value}
                          type="button"
                          aria-pressed={selectedCryptoAsset === asset.value}
                          onClick={() => setCryptoAsset(asset.value)}
                          className={`flex min-h-16 items-center gap-3 rounded-xl border-2 px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                            selectedCryptoAsset === asset.value
                              ? "border-blue-600 bg-blue-50 shadow-sm"
                              : "border-slate-200 bg-white hover:border-blue-300"
                          }`}
                        >
                          <img src={asset.logo} alt="" className="h-9 w-9 shrink-0" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold text-slate-900">{asset.name}</span>
                            <span className="mt-0.5 block truncate text-xs text-slate-500">{asset.network}</span>
                          </span>
                          {selectedCryptoAsset === asset.value && <Check className="h-4 w-4 shrink-0 text-blue-700" />}
                        </button>
                      ))}
                    </div>
                    {!settingsLoading && configuredCryptoAssets.length === 0 && (
                      <p role="status" className="mt-2 text-sm text-amber-700">Crypto payments are not available until an admin adds a wallet address.</p>
                    )}

                    {pendingCryptoPayment && revealedCryptoPaymentIds.has(pendingCryptoPayment.id) && (
                      <div id="crypto-payment-address" className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-900">Payment address ready</p>
                            <p className="mt-1 text-xs text-slate-600">
                              {String(pendingCryptoPayment.provider_data.asset_name ?? pendingCryptoPayment.provider_data.crypto_asset ?? "Crypto")}
                              {" · "}{String(pendingCryptoPayment.provider_data.network ?? "Network")}
                            </p>
                          </div>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Pending verification</span>
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-800">
                          Send {currency(Number(pendingCryptoPayment.amount_usd))} equivalent
                        </p>
                        <code className="mt-2 block break-all rounded-xl border border-blue-100 bg-white p-4 text-base font-bold text-slate-900 sm:text-lg">
                          {String(pendingCryptoPayment.provider_data.wallet_address ?? "Wallet address unavailable")}
                        </code>
                        <CryptoPaidConfirmation
                          paymentId={pendingCryptoPayment.id}
                          paid={paidCryptoPaymentIds.has(pendingCryptoPayment.id)}
                          onPaid={markCryptoPaymentPaid}
                        />
                      </div>
                    )}

                    <Button
                      disabled={!selectedPackage || submitting || settingsLoading || !selectedCryptoAsset}
                      onClick={startCheckout}
                      className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                    >
                      {submitting
                        ? "Preparing payment…"
                        : pendingCryptoPayment && revealedCryptoPaymentIds.has(pendingCryptoPayment.id)
                        ? "Create another payment address"
                        : "Show payment address"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
                        <Fragment key={payment.id}>
                          <tr className="border-b border-border/60">
                            <td className="py-3 pr-3">{new Date(payment.created_at).toLocaleString()}</td>
                            <td className="py-3 pr-3">
                              {payment.provider === "sasapay" ? "SasaPay / M-Pesa"
                                : payment.provider === "manual_crypto" ? `Crypto · ${String(payment.provider_data.asset_name ?? payment.provider_data.crypto_asset ?? "")}`
                                : payment.provider === "legacy" ? "Legacy provider" : "Plisio"}
                            </td>
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
                          {payment.provider === "manual_crypto" && payment.status === "pending" && (
                            <tr className="border-b border-border/60 bg-violet-50/40">
                              <td colSpan={5} className="px-3 py-4">
                                <p className="font-semibold">{String(payment.provider_data.asset_name ?? payment.provider_data.crypto_asset ?? "Crypto")} · {String(payment.provider_data.network ?? "Network")} · Pay {currency(Number(payment.amount_usd))} equivalent</p>
                                <p className="mt-1 text-muted-foreground">Reveal the address before sending. Transfers on the wrong network may be permanently lost.</p>
                                {revealedCryptoPaymentIds.has(payment.id) ? (
                                  <>
                                    <code className="mt-3 block break-all rounded-xl border border-blue-100 bg-white p-4 text-base font-bold text-slate-900 sm:text-lg">{String(payment.provider_data.wallet_address ?? "Wallet address unavailable")}</code>
                                    <CryptoPaidConfirmation
                                      paymentId={payment.id}
                                      paid={paidCryptoPaymentIds.has(payment.id)}
                                      onPaid={markCryptoPaymentPaid}
                                    />
                                    {payment.provider_reference ? (
                                      <p className="mt-3 break-all text-muted-foreground">Transaction hash submitted; awaiting admin verification: <span className="font-mono">{payment.provider_reference}</span></p>
                                    ) : (
                                      <div className="mt-3 flex flex-wrap gap-2">
                                        <Input
                                          id={`crypto-hash-${payment.id}`}
                                          value={cryptoTransactionHashes[payment.id] ?? ""}
                                          onChange={(event) => setCryptoTransactionHashes((current) => ({ ...current, [payment.id]: event.target.value }))}
                                          placeholder="Blockchain transaction hash"
                                          autoComplete="off"
                                          className="h-10 min-w-56 flex-1 bg-white"
                                        />
                                        <Button disabled={submitting} onClick={() => submitCryptoHash(payment.id)}>
                                          {submitting ? "Submitting…" : "Submit transaction hash"}
                                        </Button>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="mt-3">
                                    <Button
                                      variant="outline"
                                      onClick={() => setRevealedCryptoPaymentIds((current) => new Set(current).add(payment.id))}
                                    >
                                      Show payment address
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </Fragment>
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

function CryptoPaidConfirmation({
  paymentId,
  paid,
  onPaid,
}: {
  paymentId: string;
  paid: boolean;
  onPaid: (paymentId: string) => void;
}) {
  if (!paid) {
    return (
      <Button
        onClick={() => onPaid(paymentId)}
        className="mt-4 h-12 w-full rounded-xl bg-blue-600 text-base font-bold text-white hover:bg-blue-700"
      >
        <Check className="mr-2 h-5 w-5" />
        PAID
      </Button>
    );
  }

  return (
    <div role="status" className="mt-4 rounded-2xl border-2 border-blue-200 bg-white p-5 text-center shadow-sm">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-100 text-blue-700">
        <MessageCircle className="h-10 w-10" />
      </div>
      <h4 className="mt-3 text-lg font-bold text-slate-900">Chat with support to confirm</h4>
      <p className="mt-1 text-sm leading-5 text-slate-600">
        Share payment ID <code className="break-all font-semibold text-slate-900">{paymentId}</code>. Credits are added after an admin verifies your payment.
      </p>
      <a
        href="https://t.me/PDF417_PRO"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
      >
        <MessageCircle className="h-6 w-6" />
        Open support chat
      </a>
    </div>
  );
}

function PackageCard({
  item,
  selected,
  referencePrice,
  onSelect,
}: {
  item: CreditPackage;
  selected: boolean;
  referencePrice: number;
  onSelect: (packageId: string) => void;
}) {
  const price = Number(item.price_usd);
  const credits = Number(item.credits);
  const unitPrice = credits > 0 ? price / credits : price;
  const savings = referencePrice > 0
    ? Math.max(0, Math.round((1 - unitPrice / referencePrice) * 100))
    : 0;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(item.id)}
      className={`group relative flex min-h-52 flex-col overflow-hidden rounded-2xl border p-4 text-left transition-all hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 sm:p-5 ${
        selected
          ? "border-primary bg-gradient-to-br from-primary/[0.08] via-card to-card ring-2 ring-primary/15 shadow-lg shadow-primary/10"
          : "border-border/80 bg-card hover:border-primary/35 hover:shadow-lg hover:shadow-slate-900/5"
      }`}
    >
      {item.recommended && <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-amber-400" />}
      <span className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <span className={`truncate text-xs font-bold uppercase tracking-[0.12em] ${item.recommended ? "text-primary" : "text-muted-foreground"}`}>{item.name}</span>
          {item.recommended && <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-primary">Top pick</span>}
        </span>
        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${selected ? "border-primary bg-primary text-white" : "border-border bg-white text-transparent group-hover:border-primary/50"}`}>
          <Check className="h-3 w-3" />
        </span>
      </span>

      <span className="mt-5 block text-3xl font-bold leading-none tracking-tight text-foreground sm:text-[2rem]">
        {credits.toLocaleString()}
      </span>
      <span className="mt-1 text-xs font-medium text-muted-foreground">barcode credits</span>

      <span className="mt-auto flex items-end justify-between gap-2 border-t border-border/70 pt-4">
        <span>
          <span className="block text-lg font-bold tracking-tight">{currency(price)}</span>
          <span className="mt-0.5 block text-[11px] text-muted-foreground">{currency(unitPrice)} / barcode</span>
        </span>
        {savings > 0 && (
          <span className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-600/10">
            <ArrowRight className="h-3 w-3 -rotate-45" /> Save {savings}%
          </span>
        )}
      </span>

    </button>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col bg-background"><Header />{children}<Footer /></div>;
}

function SetupNotice() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
      Supabase is not configured for this deployment. Add <code className="break-all">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="break-all">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> (or the equivalent <code className="break-all">VITE_*</code> variables) to the frontend environment, then deploy the database migration and Edge Functions before enabling credit checkout.
    </div>
  );
}

export default Account;
