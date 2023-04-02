import * as ArrayHelper from "./utils/arrayHelper";
import * as CellType from "./celltype";
import * as Utils from "./utils";

const gameWidth = 600;
const gameHeight = 450;

const pixelGrid = ArrayHelper.init2DArray(
  gameWidth,
  gameHeight,
  CellType.empty
);
const delta = ArrayHelper.init2DArray(gameWidth, gameHeight, null);

export function getCell(i: number, j: number) {
  return pixelGrid[i][j];
}

export function getFullBoard() {
  return pixelGrid;
}

export function getDeltaBoard() {
  return delta;
}

export function getWidth() {
  return gameWidth;
}

export function getHeight() {
  return gameHeight;
}

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

export function wipeBoard() {
  Utils.wipeMatrix(pixelGrid, CellType.empty);
}

export function wipeDelta() {
  Utils.wipeMatrix(delta, null);
}
