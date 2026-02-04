import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BarcodeForm } from "@/components/BarcodeForm";
import { BarcodePreview } from "@/components/BarcodePreview";
import { Card } from "@/components/ui/card";
import { CheckCircle, DollarSign, Smile, Shield, Zap, Code } from "lucide-react";
import { AAMVAData, DEFAULT_AAMVA_DATA, encodeAAMVA } from "@/lib/aamvaData";

const features = [
  {
    icon: CheckCircle,
    title: "Validity 100%",
    description: "We create barcodes in accordance with official AAMVA documentation, so they are exactly the same as the original documents barcodes.",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Generate your PDF417 barcode instantly. No waiting, no delays. Your barcode is ready in seconds.",
  },
  {
    icon: Smile,
    title: "Easy to use",
    description: "User-friendly and responsive UI, random data generators and much more. Just fill in the form and generate!",
  },
];

const Index = () => {
  const [formData, setFormData] = useState<AAMVAData>(DEFAULT_AAMVA_DATA);
  const [encodedData, setEncodedData] = useState<string>("");

  const handleFormChange = (data: AAMVAData) => {
    setFormData(data);
    const encoded = encodeAAMVA(data);
    setEncodedData(encoded);
  };

  // Initialize encoded data on mount
  useState(() => {
    setEncodedData(encodeAAMVA(DEFAULT_AAMVA_DATA));
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container relative">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-mono text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                PDF417<span className="text-primary">.GEN</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Simple and powerful service for creating 100% valid PDF417 barcodes 
                for a US Driver's License. AAMVA compliant and scannable.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a 
                  href="#generator" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Get started
                </a>
                <a 
                  href="#features" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Our features
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 border-t border-border">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index} 
                    className="p-6 bg-card border-border hover:border-primary/50 transition-colors group"
                  >
                    <Icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-mono text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Generator Section */}
        <section id="generator" className="py-16 border-t border-border">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-mono text-3xl font-bold mb-4">
                Barcode <span className="text-primary">Generator</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fill in the form below with your license data. The barcode will be generated 
                automatically and you can download it as a PNG image.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <BarcodeForm data={formData} onChange={handleFormChange} />
              <div className="space-y-6">
                <BarcodePreview data={encodedData} />
                
                <Card className="p-6 bg-card border-border">
                  <h4 className="font-mono text-sm font-semibold mb-3 flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    Raw Barcode Data
                  </h4>
                  <pre className="bg-secondary/50 rounded-lg p-4 text-xs font-mono text-muted-foreground overflow-x-auto max-h-48 overflow-y-auto">
                    {encodedData.split("\n").map((line, i) => (
                      <div key={i} className="hover:bg-primary/10">
                        {line || " "}
                      </div>
                    ))}
                  </pre>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Details */}
        <section id="features" className="py-16 border-t border-border">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-mono text-3xl font-bold mb-4">Features</h2>
              <div className="section-divider max-w-md mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="font-mono text-2xl font-semibold mb-4">
                  Check barcode with any scanner
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our barcodes are 100% valid and scannable. Use any PDF417 scanner 
                  app on your phone to verify the barcode data.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    AAMVA CDS compliant format
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Works with all major scanner apps
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Real ID compliant encoding
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="h-24 w-24 text-primary mx-auto mb-4" />
                  <p className="font-mono text-lg font-semibold">100% Valid</p>
                  <p className="text-sm text-muted-foreground">AAMVA Compliant</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Zap className="h-24 w-24 text-primary mx-auto mb-4" />
                  <p className="font-mono text-lg font-semibold">Instant</p>
                  <p className="text-sm text-muted-foreground">Generate in seconds</p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="font-mono text-2xl font-semibold mb-4">
                  Data generators
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Use built-in data generators to make your work easier. 
                  Correct Document Discriminator and Inventory Control Number 
                  will be calculated instantly!
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Random name and address generator
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Auto-generate document IDs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    All 50 US states supported
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 border-t border-border">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-mono text-3xl font-bold mb-4">F.A.Q</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="p-6 bg-card border-border">
                <h4 className="font-mono font-semibold mb-2">How to create barcode?</h4>
                <p className="text-sm text-muted-foreground">
                  Just fill in the form with the license data and the barcode will be 
                  generated automatically. You can then download it as a PNG image.
                </p>
              </Card>
              
              <Card className="p-6 bg-card border-border">
                <h4 className="font-mono font-semibold mb-2">Is the barcode scannable?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! Our barcodes are 100% AAMVA compliant and can be scanned by any 
                  PDF417 barcode scanner application.
                </p>
              </Card>
              
              <Card className="p-6 bg-card border-border">
                <h4 className="font-mono font-semibold mb-2">What is AAMVA format?</h4>
                <p className="text-sm text-muted-foreground">
                  AAMVA (American Association of Motor Vehicle Administrators) defines 
                  the standard format for driver's license barcodes in the United States.
                </p>
              </Card>
              
              <Card className="p-6 bg-card border-border">
                <h4 className="font-mono font-semibold mb-2">Is it Real ID compliant?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can set the compliance type to "Full Compliance (REAL ID)" 
                  in the document settings to generate Real ID compliant barcodes.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
