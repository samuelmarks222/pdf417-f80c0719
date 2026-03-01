import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StateForm } from "@/components/StateForm";
import { BarcodePreview } from "@/components/BarcodePreview";
import { AAMVAData, DEFAULT_AAMVA_DATA } from "@/lib/aamvaData";
import { encodeAAMVA } from "@/lib/aamvaEncoder";
import { getStateConfig, getRevision } from "@/lib/stateConfigs";
import { useSearchParams } from "react-router-dom";

const Index = () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-6">
        <div className="container max-w-5xl">
          {/* Form */}
          <StateForm data={formData} onChange={handleFormChange} />

          {/* Barcode Preview - below form like pdf417.pro */}
          <div className="mt-6">
            <BarcodePreview data={encodedData} />
          </div>

          {/* Raw Data Toggle */}
          <div className="mt-4 border border-border rounded bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Raw Barcode Data</span>
              <button 
                onClick={() => setShowRawData(!showRawData)}
                className="text-xs text-primary hover:underline"
              >
                {showRawData ? "Hide" : "Show"}
              </button>
            </div>
            
            {showRawData && (
              <pre className="mt-3 bg-muted rounded p-3 text-[11px] overflow-x-auto max-h-48 overflow-y-auto text-muted-foreground">
                {encodedData.split("\n").map((line, i) => (
                  <div key={i}>{line || " "}</div>
                ))}
              </pre>
            )}
          </div>

          {/* Need help section - matches pdf417.pro */}
          <div className="mt-6 text-center">
            <h3 className="text-lg font-bold mb-3">Need help?</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Fill in the fields and click the "Create" button and your barcode will appear.
              All barcodes are generated in accordance with official AAMVA documentation.
            </p>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-4 border border-destructive/20 rounded bg-destructive/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">
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
