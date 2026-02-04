declare module 'bwip-js' {
  interface BwipOptions {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    width?: number;
    includetext?: boolean;
    textxalign?: string;
    textsize?: number;
    columns?: number;
    rows?: number;
    rowmult?: number;
    eclevel?: number;
    padding?: number;
    paddingwidth?: number;
    paddingheight?: number;
    backgroundcolor?: string;
    barcolor?: string;
    textcolor?: string;
  }

  export function toCanvas(canvas: HTMLCanvasElement, options: BwipOptions): Promise<void>;
  export function toBuffer(options: BwipOptions): Promise<Buffer>;
  
  export { BwipOptions };
}
