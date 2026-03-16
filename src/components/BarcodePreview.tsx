import { useEffect, useRef, useState } from "react";
import * as bwipjs from "bwip-js";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

interface BarcodePreviewProps {
  data: string;
  onGenerate?: () => void;
}

export function BarcodePreview({ data, onGenerate }: BarcodePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

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

  useEffect(() => {
    if (data) generateBarcode();
  }, [data]);

  return (
    <div className="border border-border rounded bg-card p-6">
      {/* Barcode area */}
      <div className="bg-muted/50 rounded p-8 flex items-center justify-center min-h-[140px]">
        {error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : !generated ? (
          <p className="text-muted-foreground text-sm">
            Fill in the fields and click the "Create" button and your barcode will appear here.
          </p>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full bg-white rounded"
            style={{ imageRendering: "pixelated" }}
          />
        )}
        {/* Hidden canvas for generation before first display */}
        {!generated && <canvas ref={canvasRef} className="hidden" />}
      </div>

      {/* Actions */}
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
          <Button
            size="sm"
            onClick={downloadBarcode}
            className="gap-2 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Download PNG
          </Button>
        </div>
      )}
    </div>
  );
}
