import { useEffect, useRef, useState } from "react";
import { renderPdf417 } from "@/lib/pdf417Renderer";

const demoText = "PDF417 DEMO - NORTH AMERICA";

export function Pdf417Sample() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      renderPdf417(canvas, demoText);
      setError(false);
    } catch (renderError) {
      console.error("Could not render homepage PDF417 sample:", renderError);
      if (active) setError(true);
    }

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div role="img" aria-label="PDF417 sample preview is unavailable" className="grid h-28 w-full place-items-center rounded-lg border border-dashed border-[#d6dfd8] bg-[#fbfcfa] text-xs font-medium text-[#687671]">
        PDF417 sample preview unavailable
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Actual PDF417 barcode sample: ${demoText}`}
      className="aspect-[53/10] w-full overflow-hidden rounded-lg bg-[#fbfcfa]"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
