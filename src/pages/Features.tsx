import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle, Shield, Zap, Database, Shuffle, Code, Download, Smartphone } from "lucide-react";

const featuresList = [
  {
    icon: Shield,
    title: "100% AAMVA Compliant",
    description: "Our barcodes follow the official AAMVA Card Design Standard specification. Every field is encoded correctly following the CDS format.",
  },
  {
    icon: Smartphone,
    title: "Scannable Barcodes",
    description: "All generated barcodes can be scanned with any PDF417 barcode scanner app. Works with FiDScan, PDF417 Scanner, and other popular apps.",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "No server-side processing needed. Barcodes are generated instantly in your browser using state-of-the-art encoding algorithms.",
  },
  {
    icon: Shuffle,
    title: "Random Data Generator",
    description: "Use our built-in random data generator to quickly fill in test data. Generate random names, addresses, dates, and document numbers.",
  },
  {
    icon: Database,
    title: "All 50 States + DC",
    description: "Support for all US states and the District of Columbia. Each state uses the correct IIN (Issuer Identification Number).",
  },
  {
    icon: Code,
    title: "Document Discriminator",
    description: "Automatically generate correct Document Discriminator and Inventory Control Number values with our built-in generators.",
  },
  {
    icon: CheckCircle,
    title: "REAL ID Compliant",
    description: "Generate barcodes with Full Compliance (REAL ID) or Non-Compliant status. The DDA field is properly set in the barcode data.",
  },
  {
    icon: Download,
    title: "Download as PNG",
    description: "Download your generated barcode as a high-resolution PNG image. Perfect for printing or digital use.",
  },
];

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12 sm:py-16">
        <div className="container max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Barcode workspace</p>
            <h1 className="mb-4 mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              All <span className="text-primary">Features</span>
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Explore the tools available in this PDF417 and Code 128 barcode generator, including U.S. state formats, previews, and PNG downloads.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuresList.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="rounded-2xl border-border/80 bg-white p-6 shadow-[0_8px_28px_rgba(39,70,61,0.04)] transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40"
                >
                  <Icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Technical Details */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-2xl font-bold">Technical Details</h2>
              <div className="section-divider max-w-md mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="rounded-2xl border-border/80 bg-white p-6">
                <h4 className="mb-4 font-semibold">AAMVA Field Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• DAQ - Customer ID Number (License Number)</li>
                  <li>• DCS - Customer Family Name</li>
                  <li>• DAC - Customer First Name</li>
                  <li>• DAD - Customer Middle Name</li>
                  <li>• DBB - Date of Birth</li>
                  <li>• DBC - Sex</li>
                  <li>• DAY - Eye Color</li>
                  <li>• DAU - Height</li>
                  <li>• DAG/DAH - Street Address</li>
                  <li>• DAI - City</li>
                  <li>• DAJ - State</li>
                  <li>• DAK - Postal Code</li>
                  <li>• DCF - Document Discriminator</li>
                  <li>• DCK - Inventory Control Number</li>
                  <li>• DDA - Compliance Type</li>
                </ul>
              </Card>

              <Card className="rounded-2xl border-border/80 bg-white p-6">
                <h4 className="mb-4 font-semibold">Barcode Specifications</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Format: PDF417</li>
                  <li>• Error Correction Level: 5</li>
                  <li>• Columns: 10</li>
                  <li>• Row Multiplier: 2x</li>
                  <li>• Encoding: ASCII with AAMVA delimiters</li>
                  <li>• AAMVA Versions: 08, 09, 10</li>
                  <li>• Output: PNG (transparent background available)</li>
                  <li>• Resolution: High-DPI (2x scale)</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
