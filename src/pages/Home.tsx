import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Shield,
  Zap,
  MapPin,
  Download,
  CheckCircle,
  Smartphone,
  Barcode,
} from "lucide-react";

const highlights = [
  {
    icon: Shield,
    title: "AAMVA Compliant",
    desc: "Follows the official Card Design Standard for every state.",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    desc: "Client-side encoding — no uploads, no waiting.",
  },
  {
    icon: MapPin,
    title: "All 50 States + DC",
    desc: "Correct IIN and jurisdiction version for every region.",
  },
  {
    icon: Smartphone,
    title: "Scanner-Ready",
    desc: "Works with Scandit, FIDScan, Veriscan, and more.",
  },
  {
    icon: Download,
    title: "PNG Export",
    desc: "Download high-resolution barcodes ready for print or screen.",
  },
  {
    icon: CheckCircle,
    title: "REAL ID Support",
    desc: "Full Compliance and Non-Compliant DDA field encoding.",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-info/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="container relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Barcode className="h-4 w-4" />
              PDF417 &amp; Code 128 Barcode Generator
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Generate{" "}
              <span className="text-gradient">AAMVA-Compliant</span>{" "}
              Barcodes Instantly
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              The fastest way to create scannable PDF417 barcodes for US
              Driver's Licenses — right in your browser, no server required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 px-8 text-base shadow-lg shadow-primary/20">
                <Link to="/generator">
                  Start Generating
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 px-8 text-base">
                <Link to="/states">
                  Browse States
                  <MapPin className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-20 lg:py-24">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-3">
                Everything You Need
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Professional-grade barcode generation with full AAMVA compliance
                for every US state.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={i}
                    className="card-hover p-6 bg-card border-border group"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-24">
          <div className="container max-w-3xl text-center">
            <Card className="p-10 lg:p-14 bg-primary/[0.03] border-primary/20">
              <h2 className="text-3xl font-bold mb-4">Ready to Generate?</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Select a state, fill in the fields, and get a scannable barcode
                in seconds — completely free.
              </p>
              <Button asChild size="lg" className="gap-2 px-10 text-base shadow-lg shadow-primary/20">
                <Link to="/generator">
                  Open Generator
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
