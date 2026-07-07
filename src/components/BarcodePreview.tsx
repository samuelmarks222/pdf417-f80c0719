import { useEffect, useRef, useState } from "react";
import * as bwipjs from "bwip-js";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

interface BarcodePreviewProps {
  data: string;
  code128Text?: string;
+  onCode128TextChange?: (value: string) => void;
  onGenerate?: () => void;
}

export function BarcodePreview({ data, code128Text = "", onCode128TextChange, onGenerate }: BarcodePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [generated2, setGenerated2] = useState(false);

  const generateBarcode = async () => {
    if (!data || !canvasRef.current) {
      setGenerated(false);
      return;
    }

    setIsGenerating(true);
    setGenerated(false);
    setError(null);

    try {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      await bwipjs.toCanvas(canvasRef.current, {
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

      setGenerated(true);
      onGenerate?.();
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

    try {
      const ctx = canvasRef2.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef2.current.width, canvasRef2.current.height);

      await bwipjs.toCanvas(canvasRef2.current, {
        bcid: "code128",
          text: code128Text,
      });

      setGenerated2(true);
    } catch (err) {
      console.error("Code128 generation error:", err);
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
    generateBarcode();
  }, [data]);

  useEffect(() => {
    generateCode128();
  }, [code128Text]);

  useEffect(() => {
    if (!data) {
      setGenerated(false);
      setError(null);
    }
  }, [data]);

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
              Regenerate
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
            <p className="text-muted-foreground text-sm">Enter Code 128 text above and it will appear here.</p>
          ) : null}
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
              Regenerate
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
