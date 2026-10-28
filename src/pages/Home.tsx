import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Barcode,
  Check,
  CircleCheck,
  CreditCard,
  Download,
  MapPinned,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Pdf417Sample } from "@/components/Pdf417Sample";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/useSiteSettings";

const features = [
  {
    icon: MapPinned,
    title: "USA state formats",
    description: "Explore available U.S. state formats and revisions, with forms tailored to each selection.",
    label: "50 STATES + DC",
  },
  {
    icon: ScanLine,
    title: "PDF417, ready to preview",
    description: "Build a barcode from structured fields, review the result, then download your image.",
    label: "BUILD · PREVIEW · EXPORT",
  },
  {
    icon: CreditCard,
    title: "Straightforward credits",
    description: "Code 128 is free. PDF417 generations use credits, with balances and activity in your account.",
    label: "CLEAR PRICING",
  },
];

const Home = () => {
  const { settings } = useSiteSettings();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#fbfaf6]">
      <Header />

      <main className="flex-1">
        <section className="relative isolate -mt-[88px] overflow-hidden bg-[linear-gradient(112deg,#e4f0eb_0%,#fbfaf6_46%,#fff0de_100%)] pt-[88px]">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className="absolute -left-36 top-24 h-[32rem] w-[32rem] rounded-full bg-[#a5c9c1]/35 blur-[100px]" />
            <div className="absolute right-0 top-10 h-[35rem] w-[38rem] rounded-full bg-[#ffcf9c]/35 blur-[110px]" />
            <div className="absolute inset-0 opacity-[0.13] [background-image:radial-gradient(#315c54_0.7px,transparent_0.7px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
          </div>

          <div className="container grid max-w-7xl items-center gap-8 pb-14 pt-10 sm:gap-12 sm:pb-20 min-[1000px]:min-h-[650px] min-[1000px]:grid-cols-[0.95fr_1.05fr] min-[1000px]:gap-4 min-[1000px]:pb-24 min-[1000px]:pt-14">
            <div className="relative z-10 max-w-2xl lg:pl-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0b5149]/10 bg-white/70 px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-[#07584e] shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#ed9e32]" />
                {settings.hero_badge}
              </div>

              <h1 className="mt-7 max-w-[650px] text-[2.8rem] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#171b1b] sm:text-6xl min-[1000px]:text-[4.3rem]">
                {settings.hero_title}
                {settings.hero_highlight && (
                  <span className="mt-1 block text-[#07584e]">
                    {settings.hero_highlight}
                  </span>
                )}
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-[#465451] sm:text-[17px] sm:leading-8">
                {settings.hero_description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-[#07584e] pl-6 pr-2 text-white shadow-lg shadow-[#07584e]/15 hover:bg-[#06483f]"
                >
                  <Link to="/generator">
                    Open PDF417 generator
                    <span className="ml-3 grid h-8 w-8 place-items-center rounded-full bg-[#f3a332] text-[#18221e]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-[#183a34]/15 bg-white/65 px-6 text-[#1d302d] hover:bg-white"
                >
                  <Link to="/states">Browse U.S. formats</Link>
                </Button>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#42534f]">
                <span className="inline-flex items-center gap-2">
                  <CircleCheck className="h-4 w-4 text-[#087a68]" /> Preview before download
                </span>
                <span className="inline-flex items-center gap-2">
                  <CircleCheck className="h-4 w-4 text-[#087a68]" /> Code 128 is free
                </span>
              </div>

              <div className="mt-10 flex items-center gap-3 border-t border-[#183a34]/10 pt-5">
                <span className="flex -space-x-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#eef3ec] bg-[#d6e8df] text-[10px] font-bold text-[#07584e]">US</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#eef3ec] bg-[#f7dfc9] text-[10px] font-bold text-[#a64c38]">CA</span>
                </span>
                <p className="text-xs leading-5 text-[#52615d]">
                  PDF417 tools for barcode workflows<br className="sm:hidden" /> across North America
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[650px] min-[1000px]:ml-auto">
              <div className="absolute left-[13%] top-[15%] h-[68%] w-[74%] rotate-[-8deg] rounded-[48%_52%_48%_52%] bg-[#b8d5cb]/65 blur-[1px]" aria-hidden="true" />
              <div className="absolute right-[5%] top-[8%] h-28 w-28 rounded-full border border-white/80 bg-white/25" aria-hidden="true" />
              <div className="absolute left-[10%] top-[13%] hidden -rotate-12 text-5xl text-[#d28b44]/70 sm:block" aria-hidden="true">⌁</div>
              <div className="absolute right-[3%] top-[30%] hidden rotate-12 text-5xl text-[#07584e]/35 sm:block" aria-hidden="true">〰</div>

              <div className="relative mx-auto w-[94%] max-w-[520px] pb-8 pt-5 sm:pb-10">
                <div className="absolute right-0 top-[17%] z-20 hidden -translate-y-1/2 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl shadow-[#425b53]/10 backdrop-blur sm:block">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1dc] text-[#b36c13]">
                      <Barcode className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#1d2724]">PDF417 format</p>
                      <p className="mt-0.5 text-xs text-[#687671]">USA · Canada workflows</p>
                    </div>
                  </div>
                </div>

                <div className="relative mx-auto w-[88%] rotate-[-2deg] rounded-[2rem] border border-white/80 bg-white/80 p-3 shadow-[0_35px_80px_rgba(39,70,61,0.17)] backdrop-blur sm:p-4">
                  <div className="rounded-[1.45rem] border border-[#e9ede9] bg-[#fcfdfb] p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#82918b]">Barcode preview</p>
                        <p className="mt-2 text-xl font-bold tracking-tight text-[#19211e]">PDF417</p>
                        <p className="mt-1 text-xs text-[#73817b]">Structured barcode workspace</p>
                      </div>
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e8f3ed] text-[#087260]">
                        <ScanLine className="h-5 w-5" />
                      </span>
                    </div>

                    <div className="mt-5 rounded-2xl border border-[#e4e9e5] bg-white p-3 sm:p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded-full bg-[#e8f3ed] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#087260]">Preview</span>
                        <span className="font-mono text-[10px] text-[#9aa49f]">PDF417 · SAMPLE DATA</span>
                      </div>
                      <Pdf417Sample />
                      <p className="mt-1 text-center text-[9px] text-[#9aa49f]">Illustrative sample only · not encoded identity data</p>
                      <div className="mt-3 flex items-center justify-between border-t border-[#edf0ed] pt-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#95a09b]">Output</p>
                          <p className="mt-0.5 text-xs font-semibold text-[#33413b]">PNG image</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f2f6f2] px-2.5 py-2 text-xs font-semibold text-[#3e5048]">
                          <Download className="h-3.5 w-3.5" /> Download
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#f2f6f2] p-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#8b9992]">Step 01</p>
                        <p className="mt-1 text-xs font-bold text-[#34423c]">Choose a format</p>
                      </div>
                      <div className="rounded-xl bg-[#f2f6f2] p-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#8b9992]">Step 02</p>
                        <p className="mt-1 text-xs font-bold text-[#34423c]">Preview &amp; save</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-1 left-0 z-20 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-xl shadow-[#425b53]/10 sm:bottom-0 sm:left-[-2%] sm:p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f4ea] text-[#168054]">
                      <Check className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1d2724]">Preview before download</p>
                      <p className="mt-0.5 text-[11px] text-[#75817b]">Review your barcode first</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[10%] right-[-1%] z-20 hidden rotate-3 rounded-2xl bg-[#07584e] px-4 py-3 text-white shadow-xl shadow-[#07584e]/20 sm:block">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-[#b8e3d1]" />
                    <div>
                      <p className="text-xs font-bold">Account credit controls</p>
                      <p className="mt-0.5 text-[10px] text-white/70">Balance shown in your workspace</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e8e9e2] bg-white">
          <div className="container grid max-w-7xl divide-y divide-[#e8e9e2] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Metric icon={MapPinned} value="USA" label="State and DC formats" />
            <Metric icon={Barcode} value="PDF417 + Code 128" label="Two barcode formats" />
            <Metric icon={CreditCard} value="Free Code 128" label="PDF417 uses credits" />
          </div>
        </section>

        <section id="featuresSection" className="container max-w-7xl py-20 sm:py-28">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#087260]">A simpler way to work</p>
              <h2 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-[#18211e] sm:text-4xl">
                Make barcode creation feel effortless.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#66726d] md:justify-self-end">
              Create a PDF417 preview with a focused workflow for U.S. state formats, plus a free Code 128 generator for quick projects.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description, label }, index) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-[#e7e9e3] bg-white p-6 shadow-[0_8px_28px_rgba(39,70,61,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#b7d6ca] hover:shadow-xl hover:shadow-[#30574c]/[0.08] sm:p-7"
              >
                <span className="absolute right-5 top-5 text-xs font-semibold tracking-widest text-[#c5ccc7]">0{index + 1}</span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf4ee] text-[#087260] transition-colors group-hover:bg-[#07584e] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-7 text-[10px] font-bold tracking-[0.15em] text-[#087260]">{label}</p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-[#1d2724]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6b7771]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container max-w-7xl pb-20 sm:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#07584e] px-6 py-10 text-white shadow-xl shadow-[#07584e]/10 sm:px-10 sm:py-12 lg:px-14">
            <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#f1ad52]/20 blur-[80px]" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#c9e6d8]">
                  <Sparkles className="h-4 w-4" /> Your barcode workspace
                </p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Create, preview, and download in a few steps.</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                  Pick an available format, fill in your fields, and open the generator to get started.
                </p>
              </div>
              <Button asChild size="lg" className="h-12 shrink-0 rounded-full bg-[#f3a332] px-6 font-bold text-[#17231f] hover:bg-[#ffc15f]">
                <Link to="/generator">Start generating <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-[#e8e9e2] bg-white">
          <div className="container max-w-7xl py-16 sm:py-20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#087260]">Good to know</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#18211e]">A few quick answers.</h2>
              </div>
              <Link to="/features" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#087260] hover:gap-2.5">
                Explore all features <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Faq title="How do I create a PDF417?" text="Choose an available U.S. state format, fill out its fields, generate a preview, and download the image when it is ready." link="/generator" linkText="Open generator" />
              <Faq title="Can I use Code 128?" text="Yes. Code 128 generation is free. PDF417 generations use credits, which you can review in your account." link="/account" linkText="View credits" />
              <Faq title="Which U.S. formats are available?" text="Browse the available state formats and revisions before opening the barcode generator." link="/states" linkText="Browse U.S. formats" />
            </div>

            <p className="mx-auto mt-10 max-w-4xl rounded-xl border border-[#f1d9a8] bg-[#fff8e9] px-4 py-3 text-center text-xs leading-5 text-[#735b32]">
              For educational and testing purposes only. Do not use generated barcodes to misrepresent identity, create fraudulent identification, or break the law.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof MapPinned;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 py-5 sm:justify-start sm:px-7 sm:py-6 first:sm:pl-0">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eaf4ee] text-[#087260]">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-bold tracking-tight text-[#23312c]">{value}</p>
        <p className="mt-0.5 text-xs text-[#77827d]">{label}</p>
      </div>
    </div>
  );
}

function Faq({ title, text, link, linkText }: { title: string; text: string; link: string; linkText: string }) {
  return (
    <article className="group rounded-2xl border border-[#e7e9e3] bg-[#fbfaf6] p-5 transition-colors hover:border-[#b7d6ca] hover:bg-[#f5faf6] sm:p-6">
      <h3 className="font-bold tracking-tight text-[#1d2724]">{title}</h3>
      <p className="mt-2 min-h-[4.5rem] text-sm leading-6 text-[#6b7771]">{text}</p>
      <Link to={link} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#087260] group-hover:gap-2.5">
        {linkText} <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

export default Home;
