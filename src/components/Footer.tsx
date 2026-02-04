export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-lg font-bold">
              PDF417<span className="text-primary">.GEN</span>
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            PDF417 Barcode Generator for US Driver's Licenses. AAMVA Compliant.
          </p>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PDF417.GEN
          </div>
        </div>
      </div>
    </footer>
  );
}
