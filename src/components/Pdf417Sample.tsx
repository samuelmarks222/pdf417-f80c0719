import { useEffect, useRef, useState } from "react";
import * as bwipjs from "bwip-js";

const demoText = "PDF417 DEMO - NORTH AMERICA";

export function Pdf417Sample() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      bwipjs.toCanvas(canvas, {
        bcid: "pdf417",
        text: demoText,
        scale: 3,
        columns: 4,
        rowmult: 3,
        eclevel: 3,
        padding: 2,
        backgroundcolor: "FFFFFF",
        barcolor: "1D2925",
      });
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
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Actual PDF417 barcode sample: ${demoText}`}
      className="h-28 w-full rounded-lg bg-[#fbfcfa] object-contain"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
