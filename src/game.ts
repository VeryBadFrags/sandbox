import * as Utils from "./utils";
import * as CellType from "./celltype";
const canvas = document.getElementById("game") as HTMLCanvasElement;

export const pixelGrid = Utils.initArray(
  canvas.width,
  canvas.height,
  CellType.empty
);
export const delta = Utils.initArray(canvas.width, canvas.height, null);

export function createCell(x: number, y: number, cellType: CellType.Cell) {
  pixelGrid[x][y] = cellType;
  delta[x][y] = cellType;
}

export function swapCells(x1: number, y1: number, x2: number, y2: number) {
  const originCell = pixelGrid[x1][y1];
  const destinationCell = pixelGrid[x2][y2];

  pixelGrid[x1][y1] = destinationCell;
  pixelGrid[x2][y2] = originCell;
  delta[x1][y1] = destinationCell;
  delta[x2][y2] = originCell;
}

export function destroyCell(x: number, y: number) {
  pixelGrid[x][y] = CellType.empty;
  delta[x][y] = CellType.empty;
}
