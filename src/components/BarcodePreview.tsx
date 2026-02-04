import { useEffect, useRef, useState } from "react";
import * as bwipjs from "bwip-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, RefreshCw, CheckCircle } from "lucide-react";

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
    if (!canvasRef.current || !data) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Clear canvas first
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      
      await bwipjs.toCanvas(canvasRef.current, {
        bcid: "pdf417",
        text: data,
        scale: 2,
        height: 15,
        includetext: false,
        textxalign: "center",
        columns: 10,
        rowmult: 2,
        eclevel: 5,
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
    if (data) {
      generateBarcode();
    }
  }, [data]);

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-lg font-semibold flex items-center gap-2">
          Barcode Preview
          {generated && (
            <CheckCircle className="h-5 w-5 text-primary" />
          )}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateBarcode}
            disabled={isGenerating || !data}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
          <Button
            size="sm"
            onClick={downloadBarcode}
            disabled={!generated}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PNG
          </Button>
        </div>
      </div>
      
      <div className="bg-secondary/50 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
        {error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full bg-white rounded"
            style={{ imageRendering: "pixelated" }}
          />
        )}
      </div>
      
      {generated && (
        <div className="mt-4 flex items-center gap-2 text-sm text-primary">
          <CheckCircle className="h-4 w-4" />
          <span>Barcode generated successfully - AAMVA compliant, scannable</span>
        </div>
      )}
    </Card>
  );
}
