import * as bwipjs from "bwip-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderPdf417 } from "@/lib/pdf417Renderer";

vi.mock("bwip-js", () => ({
  toCanvas: vi.fn(),
}));

describe("renderPdf417", () => {
  const clearRect = vi.fn();
  const drawImage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(bwipjs.toCanvas).mockImplementation((canvas, options) => {
      canvas.width = 656;
      canvas.height = options.rowmult === 4 ? 168 : 128;
    });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      clearRect,
      drawImage,
    } as unknown as CanvasRenderingContext2D);
  });

  it("uses the requested output dimensions without stretching the symbol", () => {
    const canvas = document.createElement("canvas");

    renderPdf417(canvas, "sample barcode data");

    expect(canvas.width).toBe(675);
    expect(canvas.height).toBe(195);
    expect(bwipjs.toCanvas).toHaveBeenCalledWith(
      expect.any(HTMLCanvasElement),
      expect.objectContaining({ columns: 15, rows: 20, rowmult: 4 }),
    );
    expect(drawImage).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 9, 13);
  });

  it("rejects symbols that cannot fit the configured dimensions", () => {
    vi.mocked(bwipjs.toCanvas).mockImplementation((canvas, options) => {
      canvas.width = 656;
      canvas.height = options.rowmult === 4 ? 216 : 232;
    });

    expect(() => renderPdf417(document.createElement("canvas"), "long barcode data")).toThrow(
      "This data is too long to fit the configured PDF417 dimensions.",
    );
    expect(bwipjs.toCanvas).toHaveBeenCalledTimes(2);
  });
});
