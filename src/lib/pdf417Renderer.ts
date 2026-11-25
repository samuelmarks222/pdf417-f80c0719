import * as bwipjs from "bwip-js";

const PDF417_OPTIONS = {
  bcid: "pdf417",
  scaleX: 2,
  scaleY: 3,
  height: 9,
  includetext: false,
  columns: 11,
  rowmult: 3,
  eclevel: 5,
  paddingwidth: 2,
  paddingheight: 2,
  barcolor: "000000",
} as const;

export function renderPdf417(canvas: HTMLCanvasElement, text: string) {
  bwipjs.toCanvas(canvas, { ...PDF417_OPTIONS, text });
}
