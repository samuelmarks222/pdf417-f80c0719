import * as bwipjs from "bwip-js";

const CANVAS_WIDTH = 675;
const CANVAS_HEIGHT = 195;

const PDF417_OPTIONS = {
  bcid: "pdf417",
  scaleX: 2,
  scaleY: 2,
  columns: 15,
  rows: 20,
  rowmult: 4,
  eclevel: 5,
  paddingwidth: 2,
  paddingheight: 2,
  barcolor: "000000",
  includetext: false,
} as const;

export function renderPdf417(canvas: HTMLCanvasElement, text: string) {
  const renderSymbol = (rowmult: number) => {
    const symbol = document.createElement("canvas");
    bwipjs.toCanvas(symbol, { ...PDF417_OPTIONS, rowmult, text });
    return symbol;
  };

  let symbol = renderSymbol(PDF417_OPTIONS.rowmult);
  if (symbol.height > CANVAS_HEIGHT) {
    symbol = renderSymbol(3);
  }
  if (symbol.width > CANVAS_WIDTH || symbol.height > CANVAS_HEIGHT) {
    throw new Error("This data is too long to fit the configured PDF417 dimensions.");
  }

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not display generated barcode.");
  }

  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.drawImage(
    symbol,
    Math.floor((CANVAS_WIDTH - symbol.width) / 2),
    Math.floor((CANVAS_HEIGHT - symbol.height) / 2),
  );
}
