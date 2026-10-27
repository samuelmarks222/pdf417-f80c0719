import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-mono">
      <Header />

      <main className="flex-1">
        {/* Hero - exact pdf417.pro style */}
        <section className="py-16 text-center">
          <div className="container max-w-2xl mx-auto">
            <h1 className="text-4xl font-light mb-4">PDF417.PRO</h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Simple and powerful service for creating 100% valid PDF417 barcodes for a US Driver's License.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/generator"
                className="inline-flex items-center gap-2 px-5 py-2 rounded border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                Get started
              </Link>
              <Link
                to="#featuresSection"
                className="inline-flex items-center gap-2 px-5 py-2 rounded border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                Our features
              </Link>
            </div>

            <div className="mt-3">
              <a
                href="#faq"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How does it work?
              </a>
            </div>
          </div>
        </section>

        {/* 3 Feature columns - exact pdf417.pro layout */}
        <section className="pb-16">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8" style={{ marginBottom: '48px' }}>
              <article className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Validity 100%</h2>
                  <p className="text-muted-foreground">
                    We create barcodes in accordance with official AAMVA documentation, so they are exactly the same as the original documents barcodes.
                  </p>
                </div>
              </article>

              <article className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Credit-based generation</h2>
                  <p className="text-muted-foreground">
                    Sign in to manage your barcode credits. Each successfully generated barcode uses one credit; buy a package whenever you need more.
                  </p>
                </div>
              </article>

              <article className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Easy to use</h2>
                  <p className="text-muted-foreground">
                    We have been developing our product with a focus on usability and speed of use. User-friendly and responsive UI, random data generators and much more.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="text-left" id="featuresSection">
          <div className="container">
            <h2 className="text-center text-2xl font-semibold pt-8 pb-4">Features</h2>
            <hr className="border-border mb-8" />

            {/* Feature 1: Check barcode */}
            <article className="flex flex-col md:flex-row items-center gap-8 py-8">
              <div className="md:w-5/12">
                <h2 className="text-2xl font-semibold mb-3">Check barcode with any scanner</h2>
                <p className="text-muted-foreground">
                  All generated barcodes are fully scannable and AAMVA-compliant. Works with Scandit, FIDScan, Veriscan, Show-Me ID, and all standard PDF417 readers.
                </p>
              </div>
              <div className="md:w-7/12">
                <img
                  src="https://pdf417.pro/media/images/california_poster.webp"
                  className="w-full rounded"
                  alt="Application for barcode validation"
                  loading="lazy"
                />
              </div>
            </article>

            <hr className="border-border" />

            {/* Feature 2: Data generators */}
            <article className="flex flex-col md:flex-row-reverse items-center gap-8 py-8">
              <div className="md:w-5/12">
                <h2 className="text-2xl font-semibold mb-3">Data generators</h2>
                <p className="text-muted-foreground">
                  Use built-in data generators to make your work easier. Correct <strong>Document Discriminator</strong> and <strong>Inventory Control Number</strong> will be calculated instantly!
                </p>
              </div>
              <div className="md:w-7/12">
                <div className="bg-muted rounded p-4 text-xs leading-relaxed">
                  <pre className="text-muted-foreground whitespace-pre-wrap">
{`// Built-in calculators for each state
// Click the calculator icon next to any field

DL Number → Auto-generate state-specific format
DD → Document Discriminator (state-specific)
ICN → Inventory Control Number
Issue/Expiry → Auto-calculate from birth date`}
                  </pre>
                </div>
              </div>
            </article>

            <hr className="border-border" />

            {/* Feature 3: REAL ID Compliance */}
            <article className="flex flex-col md:flex-row items-center gap-8 py-8">
              <div className="md:w-5/12">
                <h2 className="text-2xl font-semibold mb-3">REAL ID Compliant</h2>
                <p className="text-muted-foreground">
                  Full compliance with REAL ID Act (6 CFR § 37.19). DDA field set to "F" (Fully Compliant), all mandatory AAMVA elements included. Gold star ⭐ indicates compliant states.
                </p>
              </div>
              <div className="md:w-7/12 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">⭐</div>
                  <p className="text-lg font-semibold">REAL ID Compliant</p>
                  <p className="text-sm text-muted-foreground">DDA = F (Fully Compliant)</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <hr className="border-border container" />

        {/* FAQ Section */}
        <section className="text-left pt-8" id="faq">
          <div className="container">
            <h2 className="text-center text-2xl font-semibold pt-8 pb-6">F.A.Q</h2>
            <div className="grid md:grid-cols-3 gap-4 pb-8">
              <article className="border border-border rounded-lg p-4 flex flex-col h-full">
                <h4 className="font-semibold pb-3">How to create barcode?</h4>
                <p className="text-muted-foreground text-sm flex-1">
                  It's very simple – select a state, fill in the fields, and click "Create". A valid and readable barcode will be generated instantly.
                </p>
                <div className="flex justify-end pt-3">
                  <Link to="/generator" className="text-sm text-primary hover:underline">
                    Get started →
                  </Link>
                </div>
              </article>

              <article className="border border-border rounded-lg p-4 flex flex-col h-full">
                <h4 className="font-semibold pb-3">Which states are supported?</h4>
                <p className="text-muted-foreground text-sm flex-1">
                  All 50 US states plus Washington DC are supported. Each state has specific AAMVA version and field requirements.
                </p>
                <div className="flex justify-end pt-3">
                  <Link to="/states" className="text-sm text-primary hover:underline">
                    Browse states →
                  </Link>
                </div>
              </article>

              <article className="border border-border rounded-lg p-4 flex flex-col h-full">
                <h4 className="font-semibold pb-3">How to check the generated barcode?</h4>
                <p className="text-muted-foreground text-sm flex-1">
                  There are several great apps for checking the validity of the generated barcode: Scandit, FIDScan, Veriscan, and Show-Me ID.
                </p>
                <div className="flex justify-end pt-3">
                  <Link to="/generator" className="text-sm text-primary hover:underline">
                    Generate barcode →
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <div className="container pb-8">
          <div className="border border-destructive/20 rounded-lg bg-destructive/5 p-4 text-center">
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

export default Home;
