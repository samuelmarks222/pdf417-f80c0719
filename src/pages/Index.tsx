import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StateForm } from "@/components/StateForm";
import { BarcodePreview } from "@/components/BarcodePreview";
import { AAMVAData, DEFAULT_AAMVA_DATA } from "@/lib/aamvaData";
import { encodeAAMVA } from "@/lib/aamvaEncoder";
import { getStateConfig, getRevision } from "@/lib/stateConfigs";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const initialState = searchParams.get("state") || "CA";
  
  const [formData, setFormData] = useState<AAMVAData>(() => {
    const config = getStateConfig(initialState);
    if (config) {
      const rev = config.revisions[0];
      const revDateClean = rev.revisionDate.replace(/\//g, "");
      return {
        ...DEFAULT_AAMVA_DATA,
        stateCode: initialState,
        revisionId: rev.id,
        revisionDate: revDateClean,
      };
    }
    return DEFAULT_AAMVA_DATA;
  });
  
  const [encodedData, setEncodedData] = useState<string>("");
  const [code128Text, setCode128Text] = useState<string>("");
  const [showRawData, setShowRawData] = useState(false);

  useEffect(() => {
    const revisionData = getRevision(formData.revisionId);
    if (revisionData) {
      const { state, revision } = revisionData;
      const encoded = encodeAAMVA(formData, state.iin, revision.aamvaVersion, revision.jurisdictionVersion);
      setEncodedData(encoded);
    }
  }, [formData]);

  const handleFormChange = (data: AAMVAData) => {
    setFormData(data);
  };

  const handleGenerate = useCallback(async (generationId: string, dataDigest: string) => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error("Credits are not configured. Sign-in and credit services are unavailable.");
      return false;
    }
    if (!user) {
      toast.error("Sign in with Google before generating a barcode.");
      return false;
    }

    const { error } = await supabase.rpc("consume_barcode_credit", {
      p_generation_id: generationId,
      p_data_digest: dataDigest,
    });
    if (error) {
      if (error.message.toLowerCase().includes("insufficient credits")) {
        toast.error("You need more credits to generate a barcode.");
      } else {
        toast.error(`Barcode credit could not be charged: ${error.message}`);
      }
      return false;
    }

    void refreshProfile().catch((error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Could not refresh the credit balance.");
    });
    return true;
  }, [user, refreshProfile]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 bg-white py-8 sm:py-10">
        <div className="container max-w-7xl">
          <div className="hidden">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Barcode workspace</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Create a barcode</h1>
              <p className="mt-2 text-sm text-muted-foreground">Select a format, enter your test data, and preview before downloading.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/account" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-primary/40 hover:text-primary">
                {profile?.credit_balance ?? "—"} credits <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="hidden">
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Signed in as </span>
              <strong className="font-semibold">{user?.email ?? "Guest"}</strong>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">
                Code 128 is always free. {profile?.is_admin ? "Admin PDF417 generation is free." : user ? "PDF417 generation uses one credit." : "Sign in to generate a credit-based PDF417 barcode."}
              </span>
              <Button asChild size="sm" variant="outline" className="rounded-full"><Link to="/account">Manage credits</Link></Button>
            </div>
          </div>
          {!isSupabaseConfigured && (
            <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              Credit-backed generation is unavailable until Supabase is configured for this deployment.
            </div>
          )}
          {/* Form */}
          <StateForm data={formData} onChange={handleFormChange} />

          {/* Barcode Preview - below form like pdf417.pro */}
          <div className="mt-6">
            <BarcodePreview
              data={encodedData}
              code128Text={code128Text}
              onCode128TextChange={setCode128Text}
              onGenerate={handleGenerate}
              isAdmin={Boolean(profile?.is_admin)}
            />
          </div>

          {/* Raw Data Toggle */}
          <div className="mt-5 rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Raw barcode data</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Inspect the encoded payload if needed.</p>
              </div>
              <button 
                onClick={() => setShowRawData(!showRawData)}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary/40 hover:bg-primary/5"
              >
                {showRawData ? "Hide" : "Show"}
              </button>
            </div>
            
            {showRawData && (
              <pre className="mt-4 max-h-48 overflow-x-auto overflow-y-auto rounded-xl border border-border bg-muted/60 p-4 text-[11px] leading-5 text-muted-foreground">
                {encodedData.split("\n").map((line, i) => (
                  <div key={i}>{line || " "}</div>
                ))}
              </pre>
            )}
          </div>

          {/* Need help section - matches pdf417.pro */}
          <div className="mt-8 rounded-2xl border border-border/80 bg-card px-5 py-6 text-center shadow-sm sm:px-8">
            <h3 className="text-lg font-bold">Need a hand?</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Fill in the fields and click the "Create" button and your barcode will appear.
              All barcodes are generated in accordance with official AAMVA documentation.
            </p>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-center">
            <p className="text-xs leading-5 text-amber-900">
              <strong>⚠️ Disclaimer:</strong> This tool is for <strong>educational and testing purposes only</strong>. 
              Do not use generated barcodes for fraudulent identification or any illegal activity.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
