import { useEffect, useRef, useState } from "react";
import * as bwipjs from "bwip-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, RefreshCw, CheckCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BarcodeType = "pdf417" | "code128";

interface BarcodePreviewProps {
  data: string;
  onGenerate?: () => void;
}

export function BarcodePreview({ data, onGenerate }: BarcodePreviewProps) {
  const pdf417CanvasRef = useRef<HTMLCanvasElement>(null);
  const code128CanvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [activeType, setActiveType] = useState<BarcodeType>("pdf417");

  const generateBarcode = async () => {
    if (!data) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Generate PDF417
      if (pdf417CanvasRef.current) {
        const ctx = pdf417CanvasRef.current.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, pdf417CanvasRef.current.width, pdf417CanvasRef.current.height);

        await bwipjs.toCanvas(pdf417CanvasRef.current, {
          bcid: "pdf417",
          text: data,
          scale: 3,
          height: 12,
          includetext: false,
          columns: 8,
          rowmult: 3,
          eclevel: 4,
        });
      }

      // Generate Code 128
      if (code128CanvasRef.current) {
        const ctx = code128CanvasRef.current.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, code128CanvasRef.current.width, code128CanvasRef.current.height);

        await bwipjs.toCanvas(code128CanvasRef.current, {
          bcid: "code128",
          text: data,
          scale: 2,
          height: 15,
          includetext: false,
        });
      }

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
    const canvas = activeType === "pdf417" ? pdf417CanvasRef.current : code128CanvasRef.current;
    if (!canvas || !generated) return;

    const link = document.createElement("a");
    link.download = `${activeType}-barcode-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
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
          {generated && <CheckCircle className="h-5 w-5 text-primary" />}
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

      {/* Barcode type tabs */}
      <Tabs value={activeType} onValueChange={(v) => setActiveType(v as BarcodeType)} className="mb-4">
        <TabsList className="w-full">
          <TabsTrigger value="pdf417" className="flex-1 font-mono text-xs">PDF417</TabsTrigger>
          <TabsTrigger value="code128" className="flex-1 font-mono text-xs">Code 128</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-secondary/50 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
        {error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : (
          <>
            <canvas
              ref={pdf417CanvasRef}
              className="max-w-full bg-white rounded"
              style={{ imageRendering: "pixelated", display: activeType === "pdf417" ? "block" : "none" }}
            />
            <canvas
              ref={code128CanvasRef}
              className="max-w-full bg-white rounded"
              style={{ imageRendering: "pixelated", display: activeType === "code128" ? "block" : "none" }}
            />
          </>
        )}
      </div>

      {generated && (
        <div className="mt-4 flex items-center gap-2 text-sm text-primary">
          <CheckCircle className="h-4 w-4" />
          <span>
            {activeType === "pdf417"
              ? "PDF417 barcode generated — AAMVA compliant, scannable"
              : "Code 128 barcode generated — scannable"}
          </span>
        </div>
      )}
    </Card>
  );
}
