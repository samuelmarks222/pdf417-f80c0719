import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StateForm } from "@/components/StateForm";
import { BarcodePreview } from "@/components/BarcodePreview";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
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
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form - takes 2 columns */}
            <div className="lg:col-span-2">
              <StateForm data={formData} onChange={handleFormChange} />
            </div>

            {/* Barcode Preview - takes 1 column */}
            <div className="space-y-6">
              <BarcodePreview data={encodedData} />
              
              <Card className="p-4 bg-card border-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-mono text-sm font-semibold flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    Raw Barcode Data
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowRawData(!showRawData)}
                  >
                    {showRawData ? "Hide" : "Show"}
                  </Button>
                </div>
                
                {showRawData && (
                  <pre className="bg-secondary/50 rounded-lg p-3 text-xs font-mono text-muted-foreground overflow-x-auto max-h-64 overflow-y-auto">
                    {encodedData.split("\n").map((line, i) => (
                      <div key={i} className="hover:bg-primary/10 px-1">
                        {line || " "}
                      </div>
                    ))}
                  </pre>
                )}
              </Card>

              {/* Scanner Compatibility */}
              <Card className="p-4 bg-card border-border">
                <h4 className="font-mono text-sm font-semibold mb-3">Scanner Compatibility</h4>
                <div className="flex flex-wrap gap-2">
                  {["Scandit", "FIDScan", "Veriscan", "Show-Me ID"].map((scanner) => (
                    <span 
                      key={scanner}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {scanner} ✓
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Help Section */}
          <Card className="mt-8 p-6 bg-card border-border">
            <h3 className="font-mono text-lg font-semibold mb-4">Need help?</h3>
            <p className="text-muted-foreground text-sm">
              Fill in the fields and click the "Create" button and your barcode will appear. 
              The barcode is generated following AAMVA CDS specifications and is compatible 
              with all major scanning applications.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
