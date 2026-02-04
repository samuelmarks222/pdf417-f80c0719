import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { US_STATES } from "@/lib/aamvaData";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const States = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-mono text-3xl font-bold mb-4">
              Supported <span className="text-primary">States</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We support all 50 US states plus the District of Columbia. Each state has its 
              own IIN (Issuer Identification Number) for proper barcode encoding.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {US_STATES.map((state) => (
              <Link key={state.code} to={`/?state=${state.code}`}>
                <Card className="p-4 bg-card border-border hover:border-primary/50 hover:bg-card/80 transition-all group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold">{state.code}</p>
                      <p className="text-sm text-muted-foreground">{state.name}</p>
                      <p className="text-xs text-primary font-mono mt-1">IIN: {state.iin}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default States;
