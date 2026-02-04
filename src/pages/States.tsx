import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { STATE_CONFIGS } from "@/lib/stateConfigs";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const States = () => {
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());

  const toggleState = (code: string) => {
    const newExpanded = new Set(expandedStates);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedStates(newExpanded);
  };

  // Group states into columns
  const statesPerColumn = Math.ceil(STATE_CONFIGS.length / 4);
  const columns = [
    STATE_CONFIGS.slice(0, statesPerColumn),
    STATE_CONFIGS.slice(statesPerColumn, statesPerColumn * 2),
    STATE_CONFIGS.slice(statesPerColumn * 2, statesPerColumn * 3),
    STATE_CONFIGS.slice(statesPerColumn * 3),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-mono text-3xl font-bold mb-4">
              List of available states and regions
            </h1>
          </div>

          {/* USA Section */}
          <div className="mb-12">
            <h2 className="font-mono text-2xl font-semibold mb-6 flex items-center gap-3">
              USA <span className="text-2xl">🇺🇸</span>
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="space-y-2">
                  {column.map((state) => (
                    <div key={state.code}>
                      {state.revisions.length === 1 ? (
                        // Single revision - direct link
                        <Link to={`/?state=${state.code}`}>
                          <Card className="p-3 bg-card border-border hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between group">
                            <span className="text-primary font-medium">{state.name}</span>
                            {state.revisions[0].realIdCompliant && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </Card>
                        </Link>
                      ) : (
                        // Multiple revisions - expandable
                        <Collapsible 
                          open={expandedStates.has(state.code)} 
                          onOpenChange={() => toggleState(state.code)}
                        >
                          <CollapsibleTrigger asChild>
                            <Card className="p-3 bg-card border-border hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between group">
                              <span className="text-primary font-medium">{state.name}</span>
                              <div className="flex items-center gap-2">
                                {state.revisions.some(r => r.realIdCompliant) && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                                {expandedStates.has(state.code) ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </Card>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="ml-4 mt-1 space-y-1">
                              {state.revisions.map((revision) => (
                                <Link
                                  key={revision.id}
                                  to={`/?state=${state.code}&revision=${revision.id}`}
                                >
                                  <div className="p-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors flex items-center gap-2">
                                    <span>➜</span>
                                    <span>{revision.name}</span>
                                    {revision.id.includes("2024") || revision.id.includes("2025") ? (
                                      <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">NEW</span>
                                    ) : null}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground text-center">
              All 50 US states plus Washington DC are supported. Each state has specific 
              AAMVA version and field requirements. Select a state to generate a barcode.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default States;
