import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { STATE_CONFIGS } from "@/lib/stateConfigs";
import { Link } from "react-router-dom";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

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

  // Group states into 4 columns like pdf417.pro
  const statesPerColumn = Math.ceil(STATE_CONFIGS.length / 4);
  const columns = [
    STATE_CONFIGS.slice(0, statesPerColumn),
    STATE_CONFIGS.slice(statesPerColumn, statesPerColumn * 2),
    STATE_CONFIGS.slice(statesPerColumn * 2, statesPerColumn * 3),
    STATE_CONFIGS.slice(statesPerColumn * 3),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-mono">
      <Header />

      <main className="flex-1">
        <h1 className="sr-only">List of available states and regions</h1>

        <section className="container p-4 pb-8">
          <h3 className="text-center pb-4 pt-3 text-2xl font-semibold">
            USA 🇺🇸
          </h3>

          <div className="grid md:grid-cols-4 gap-0">
            {columns.map((column, colIndex) => (
              <div key={colIndex}>
                <ul className="divide-y divide-border border border-border rounded-lg overflow-hidden">
                  {column.map((state) => (
                    <li key={state.code} className="bg-card">
                      {state.revisions.length === 1 ? (
                        // Single revision - direct link with checkmark
                        <Link
                          to={`/generator?state=${state.code}`}
                          className="flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-primary font-medium text-sm">{state.name}</span>
                          {state.revisions[0].realIdCompliant && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </Link>
                      ) : (
                        // Multiple revisions - expandable
                        <div>
                          <button
                            onClick={() => toggleState(state.code)}
                            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                          >
                            <span className="text-primary font-medium text-sm flex items-center gap-2">
                              {state.name}
                              {state.revisions.some(r => r.year === "2024" || r.year === "2025") && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-primary text-primary-foreground rounded font-bold">NEW</span>
                              )}
                            </span>
                            <div className="flex items-center gap-2">
                              {state.revisions.some(r => r.realIdCompliant) && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform ${
                                  expandedStates.has(state.code) ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </button>
                          {expandedStates.has(state.code) && (
                            <ul className="pl-4 pb-2">
                              {state.revisions.map((revision) => (
                                <li key={revision.id}>
                                  <Link
                                    to={`/generator?state=${state.code}&revision=${revision.id}`}
                                    className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    ➜ {revision.name}
                                    {(revision.year === "2024" || revision.year === "2025") && (
                                      <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-bold">NEW</span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default States;
