import { useEffect, useRef, useState } from "react";
import * as bwipjs from "bwip-js";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

interface BarcodePreviewProps {
  data: string;
  code128Text?: string;
  onCode128TextChange?: (value: string) => void;
  onGenerate?: (generationId: string, dataDigest: string) => Promise<boolean>;
}

export function BarcodePreview({ data, code128Text = "", onCode128TextChange, onGenerate }: BarcodePreviewProps) {
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
        paddingwidth: 16,
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
      const canPublish = await chargeForGeneration("code128", code128Text);
      if (!canPublish) return;

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
    <div className="grid md:grid-cols-2 gap-4">
      <div className="border border-border rounded bg-card p-6">
        <div className="bg-muted/50 rounded p-8 flex items-center justify-center min-h-[140px]">
          <canvas
            ref={canvasRef}
            className={"max-w-full bg-white rounded"}
            width={600}
            height={200}
            style={{ imageRendering: "pixelated" }}
          />
          {error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : !generated ? (
            <p className="text-muted-foreground text-sm">
              Fill in the fields and click the "Create" button and your barcode will appear here.
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex justify-center">
          <Button size="sm" onClick={generateBarcode} disabled={isGenerating || !data} className="gap-2 text-xs">
            {isGenerating ? "Generating…" : generated ? "Generate another PDF417 (1 credit)" : "Create PDF417 (1 credit)"}
          </Button>
        </div>

        {generated && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={generateBarcode}
              disabled={isGenerating}
              className="gap-2 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              Generate again · 1 credit
            </Button>
            <Button size="sm" onClick={downloadBarcode} className="gap-2 text-xs">
              <Download className="h-3.5 w-3.5" />
              Download PNG
            </Button>
          </div>
        )}
      </div>

      <div className="border border-border rounded bg-card p-6">
        <div className="bg-muted/50 rounded p-8 flex flex-col items-center justify-center min-h-[140px] gap-4">
          <canvas
            ref={canvasRef2}
            className={"max-w-full bg-white rounded"}
            width={500}
            height={120}
            style={{ imageRendering: "pixelated" }}
          />
          <textarea
            value={code128Text}
            onChange={(e) => onCode128TextChange?.(e.target.value)}
            placeholder="Enter text to render in Code 128"
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
            rows={3}
          />
          {!generated2 ? (
            <p className="text-muted-foreground text-sm">Enter Code 128 text above, then create the barcode.</p>
          ) : null}
        </div>

        <div className="mt-4 flex justify-center">
          <Button size="sm" onClick={generateCode128} disabled={!code128Text || isGenerating} className="gap-2 text-xs">
            {generated2 ? "Generate another Code 128 (1 credit)" : "Create Code 128 (1 credit)"}
          </Button>
        </div>

        {generated2 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={generateCode128}
              className="gap-2 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5`} />
              Generate again · 1 credit
            </Button>
            <Button size="sm" onClick={downloadCode128} className="gap-2 text-xs">
              <Download className="h-3.5 w-3.5" />
              Download PNG
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
