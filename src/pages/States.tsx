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

  const usaStates = STATE_CONFIGS.filter((state) => state.country !== "Canada");
  const canadaRegions = STATE_CONFIGS.filter((state) => state.country === "Canada");
  const statesPerColumn = Math.ceil(usaStates.length / 4);
  const columns = [
    usaStates.slice(0, statesPerColumn),
    usaStates.slice(statesPerColumn, statesPerColumn * 2),
    usaStates.slice(statesPerColumn * 2, statesPerColumn * 3),
    usaStates.slice(statesPerColumn * 3),
  ];
  const canadaPerColumn = Math.ceil(canadaRegions.length / 3);
  const canadaColumns = [
    canadaRegions.slice(0, canadaPerColumn),
    canadaRegions.slice(canadaPerColumn, canadaPerColumn * 2),
    canadaRegions.slice(canadaPerColumn * 2),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <h1 className="sr-only">List of available states and regions</h1>

        <section className="container max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Available formats</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">USA &amp; Canada formats</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Browse available U.S. state, District of Columbia, province, and territory revisions, then open a format in the PDF417 generator.
            </p>
          </div>

          <h2 className="mb-3 text-xl font-bold">USA state formats</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column, colIndex) => (
              <div key={colIndex}>
                <ul className="surface-panel divide-y divide-border/70 overflow-hidden">
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

          <h2 className="mb-3 mt-10 text-xl font-bold">Canada</h2>
          <p className="mb-4 text-sm text-muted-foreground">Province and territory-specific Canadian driver licence forms.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {canadaColumns.map((column, colIndex) => (
              <div key={colIndex}>
                <ul className="surface-panel divide-y divide-border/70 overflow-hidden">
                  {column.map((state) => (
                    <li key={state.code} className="bg-card">
                      {state.comingSoon ? (
                        <div className="flex items-center justify-between px-3 py-2.5 text-muted-foreground">
                          <span className="text-sm font-medium">{state.name}</span>
                          <span className="text-xs">Coming soon</span>
                        </div>
                      ) : (
                        <Link to={`/generator?state=${state.code}`} className="flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-muted/50">
                          <span className="text-sm font-medium text-primary">{state.name}</span>
                        </Link>
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
