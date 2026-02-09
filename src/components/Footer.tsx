import { Link } from "react-router-dom";
import { Barcode } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-10 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Barcode className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">
              PDF417<span className="text-primary">.GEN</span>
            </span>
          </Link>

          <p className="text-sm text-muted-foreground text-center">
            PDF417 Barcode Generator for US Driver's Licenses — AAMVA Compliant.
          </p>

          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PDF417.GEN
          </div>
        </div>
      </div>
    </footer>
  );
}
