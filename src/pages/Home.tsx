import { Link } from "react-router-dom";
import { ArrowRight, Check, CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/useSiteSettings";

const features = [
  {
    icon: ShieldCheck,
    title: "State-aware formats",
    description: "Choose a state and revision. The form adapts to the selected format and its available fields.",
    label: "FORMAT CONTROL",
  },
  {
    icon: Sparkles,
    title: "Helpful built-in tools",
    description: "Use field helpers, date calculations, and sample data to move through a test workflow faster.",
    label: "LESS REPETITIVE WORK",
  },
  {
    icon: CreditCard,
    title: "Straightforward credits",
    description: "See your balance, choose a package, and review payment and credit activity from one account.",
    label: "CLEAR PRICING",
  },
];

const Home = () => {
  const { settings } = useSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
      <section className="overflow-hidden">
        <div className="container grid max-w-7xl items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {settings.hero_badge}
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[3.65rem]">
              {settings.hero_title}
              {settings.hero_highlight && <span className="text-primary"> {settings.hero_highlight}</span>}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {settings.hero_description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 rounded-full px-6 shadow-lg shadow-primary/20">
                <Link to="/generator">
                  Open generator <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-border bg-card px-6">
                <Link to="/account">Explore credit packages</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> State-specific form fields</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Preview before download</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -inset-8 rounded-[3rem] bg-primary/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111b32] p-5 text-white shadow-2xl shadow-slate-900/20 sm:p-7">
              <div className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200/70">Workspace preview</p>
                  <p className="mt-1 text-sm font-medium text-white/90">PDF417 generator</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Ready to create
                </span>
              </div>

              <div className="relative mt-5 rounded-2xl bg-white p-5 text-slate-900 shadow-xl sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">Selected format</p>
                    <p className="mt-1 text-xl font-bold tracking-tight">California <span className="font-medium text-slate-400">/ CA</span></p>
                    <p className="mt-1 text-xs text-slate-500">AAMVA data preview</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-2.5 text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div
                    aria-hidden="true"
                    className="h-20 w-full rounded-md bg-white"
                    style={{
                      backgroundImage: "repeating-linear-gradient(90deg, #172033 0 2px, transparent 2px 4px, #172033 4px 5px, transparent 5px 8px, #172033 8px 12px, transparent 12px 14px, #172033 14px 15px, transparent 15px 19px)",
                      backgroundSize: "100% 70%",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Preview illustration</span>
                    <span>PNG download</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Selected state</p>
                    <p className="mt-1 text-sm font-semibold">California</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Generation cost</p>
                    <p className="mt-1 text-sm font-semibold">1 credit</p>
                  </div>
                </div>
              </div>

              <div className="relative mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-400/15 text-blue-200">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Your account, your balance</p>
                    <p className="mt-0.5 text-xs text-white/55">Credit usage is recorded securely</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/50" />
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5 shadow-xl sm:flex">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Ready when you are</p>
                <p className="text-xs text-muted-foreground">Edit fields before generating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-white/70">
        <div className="container grid max-w-7xl gap-5 py-6 sm:grid-cols-3 sm:gap-8">
          <Metric value="50 states + DC" label="State formats" />
          <Metric value="2 barcode types" label="PDF417 and Code 128" />
          <Metric value="1 credit" label="Per successful generation" />
        </div>
      </section>

      <section id="featuresSection" className="container max-w-7xl py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Made for a smoother workflow</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need. Nothing in the way.</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Move from structured test data to a downloadable barcode without losing track of your settings or credits.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description, label }) => (
            <article key={title} className="group rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-slate-900/5">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground">{label}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container max-w-7xl pb-16 sm:pb-24">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-nav-background px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
          <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Start your next project</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">A clearer way to build barcode previews.</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">Open the generator, choose a format, and keep your workflow moving.</p>
            </div>
            <Button asChild size="lg" className="h-12 shrink-0 rounded-full bg-white px-6 text-slate-900 hover:bg-blue-50">
              <Link to="/generator">Go to generator <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-border/70 bg-white/60">
        <div className="container max-w-7xl py-14 sm:py-18">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Quick answers</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Faq title="How do I create a barcode?" text="Choose a state, complete the available fields, and generate a preview. You can download the result when it is ready." link="/generator" linkText="Open generator" />
            <Faq title="Which state formats are available?" text="Browse the available state formats and their revisions before opening the generator." link="/states" linkText="Browse states" />
            <Faq title="How do credits work?" text="Each successful new barcode generation uses one credit. You can review packages and your transaction history from your account." link="/account" linkText="View credits" />
          </div>
          <p className="mx-auto mt-8 max-w-4xl rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-center text-xs leading-5 text-amber-900">
            For educational and testing purposes only. Do not use generated barcodes to misrepresent identity, create fraudulent identification, or break the law.
          </p>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-lg font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Faq({ title, text, link, linkText }: { title: string; text: string; link: string; linkText: string }) {
  return (
    <article className="flex flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{text}</p>
      <Link to={link} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2">
        {linkText} <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

export default Home;
