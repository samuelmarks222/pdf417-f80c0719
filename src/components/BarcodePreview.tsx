import { useEffect, useRef, useState } from "react";
import * as bwipjs from "bwip-js";
import { Button } from "@/components/ui/button";
import { Barcode, Check, Download, RefreshCw, Sparkles } from "lucide-react";

interface BarcodePreviewProps {
  data: string;
  code128Text?: string;
  onCode128TextChange?: (value: string) => void;
  onGenerate?: (generationId: string, dataDigest: string) => Promise<boolean>;
  isAdmin?: boolean;
}

export function BarcodePreview({ data, code128Text = "", onCode128TextChange, onGenerate, isAdmin = false }: BarcodePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [generated2, setGenerated2] = useState(false);

  const chargeForGeneration = async (format: "pdf417" | "code128", text: string) => {
    if (!onGenerate) {
      return false;
    }

    const digestInput = new TextEncoder().encode(`${format}\0${text}`);
    const digestBuffer = await crypto.subtle.digest("SHA-256", digestInput);
    const dataDigest = [...new Uint8Array(digestBuffer)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return onGenerate(crypto.randomUUID(), dataDigest);
  };

  const generateBarcode = async () => {
    if (!data || !canvasRef.current) {
      setGenerated(false);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const output = document.createElement("canvas");
      await bwipjs.toCanvas(output, {
        bcid: "pdf417",
        text: data,
        scale: 3,
        height: 9,
        includetext: false,
        columns: 8,
        rowmult: 3,
        eclevel: 5,
        paddingwidth: 6,
        paddingheight: 12,
        backgroundcolor: "FFFFFF",
        barcolor: "000000",
      });

      if (!canvasRef.current.getContext("2d")) throw new Error("Could not display generated barcode.");
      const canPublish = await chargeForGeneration("pdf417", data);
      if (!canPublish) return;

      canvasRef.current.width = output.width;
      canvasRef.current.height = output.height;
      const context = canvasRef.current.getContext("2d");
      if (!context) throw new Error("Could not display generated barcode.");
      context.drawImage(output, 0, 0);
      setGenerated(true);
    } catch (err) {
      console.error("Barcode generation error:", err);
      setError("Failed to generate barcode. Please check your data.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadBarcode = () => {
    if (!canvasRef.current || !generated) return;
    const link = document.createElement("a");
    link.download = `pdf417-barcode-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const generateCode128 = async () => {
    if (!code128Text || !canvasRef2.current) {
      setGenerated2(false);
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const output = document.createElement("canvas");
      await bwipjs.toCanvas(output, {
        bcid: "code128",
        text: code128Text,
      });

      if (!canvasRef2.current.getContext("2d")) throw new Error("Could not display generated barcode.");
      canvasRef2.current.width = output.width;
      canvasRef2.current.height = output.height;
      const context = canvasRef2.current.getContext("2d");
      if (!context) throw new Error("Could not display generated barcode.");
      context.drawImage(output, 0, 0);
      setGenerated2(true);
    } catch (err) {
      console.error("Code 128 generation error:", err);
      setError("Failed to generate the Code 128 barcode.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCode128 = () => {
    if (!canvasRef2.current || !generated2) return;
    const link = document.createElement("a");
    link.download = `code128-barcode-${Date.now()}.png`;
    link.href = canvasRef2.current.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    if (!data) {
      setGenerated(false);
      setError(null);
    }
  }, [data]);

  useEffect(() => {
    if (!code128Text) setGenerated2(false);
  }, [code128Text]);

  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-2">
      <section className="surface-panel flex min-w-0 flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Barcode className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold">PDF417 barcode</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">State-specific format</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${isAdmin ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>
            {isAdmin ? "Always free for admins" : "1 credit per generation"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="relative flex min-h-[220px] w-full flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/45 p-5 sm:min-h-[240px]">
            <canvas
              ref={canvasRef}
              className={generated ? "block h-auto max-h-40 w-full max-w-none rounded-lg bg-white object-contain" : "hidden"}
              width={600}
              height={200}
              style={{ imageRendering: "pixelated" }}
            />
            {!generated && (
              <div className="max-w-xs text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-border/70">
                  <Barcode className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm font-semibold text-foreground">Your preview will appear here</p>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  Complete the state fields above, then create your PDF417 barcode.
                </p>
                {error && <p role="alert" className="mt-3 text-xs font-medium text-destructive">{error}</p>}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {generated ? (
                <><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-3 w-3" /></span> Preview ready</>
              ) : (
                <><Sparkles className="h-4 w-4 text-primary" /> Ready to create</>
              )}
            </div>
            {generated ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={generateBarcode} disabled={isGenerating} className="gap-2 rounded-full">
                  <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                  Generate again
                </Button>
                <Button size="sm" onClick={downloadBarcode} className="gap-2 rounded-full">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={generateBarcode} disabled={isGenerating || !data} className="gap-2 rounded-full px-5">
                <Sparkles className="h-3.5 w-3.5" />
                {isGenerating ? "Generating…" : "Create PDF417"}
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="surface-panel flex min-w-0 flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700">
              <Barcode className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold">Code 128 barcode</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Custom text format · no credits required</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-semibold text-emerald-800">Always free</span>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="relative flex min-h-[220px] w-full flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/45 p-5 sm:min-h-[240px]">
            <canvas
              ref={canvasRef2}
              className={generated2 ? "block h-auto max-h-40 w-full max-w-[500px] rounded-lg bg-white object-contain" : "hidden"}
              width={500}
              height={120}
              style={{ imageRendering: "pixelated" }}
            />
            {!generated2 && (
              <div className="max-w-xs text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm ring-1 ring-border/70">
                  <Barcode className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm font-semibold text-foreground">Create a custom barcode</p>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">Enter your text below to prepare a Code 128 preview.</p>
                {error && <p role="alert" className="mt-3 text-xs font-medium text-destructive">{error}</p>}
              </div>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="code128-text" className="mb-2 block text-xs font-semibold text-foreground">Text to encode</label>
            <textarea
              id="code128-text"
              value={code128Text}
              onChange={(e) => onCode128TextChange?.(e.target.value)}
              placeholder="Type or paste your text here…"
              className="min-h-20 w-full resize-y rounded-xl border border-input bg-card px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
              rows={2}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              {generated2 ? "Preview ready" : `${code128Text.length} characters`}
            </div>
            {generated2 ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={generateCode128} disabled={isGenerating} className="gap-2 rounded-full">
                  <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                  Generate again
                </Button>
                <Button size="sm" onClick={downloadCode128} className="gap-2 rounded-full">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={generateCode128} disabled={!code128Text || isGenerating} className="gap-2 rounded-full px-5">
                <Sparkles className="h-3.5 w-3.5" />
                {isGenerating ? "Generating…" : "Create Code 128"}
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
