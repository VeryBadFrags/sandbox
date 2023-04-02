import * as ArrayHelper from "./utils/arrayHelper";
import * as CellType from "./celltype";

const gameWidth = 600;
const gameHeight = 450;

const pixelGrid = ArrayHelper.initArray(
  gameWidth,
  gameHeight,
  CellType.empty
);
const delta = ArrayHelper.initArray(gameWidth, gameHeight, null);

export function getCell(x: number, y: number) {
  const index = ArrayHelper.get1DIndex(x,y, gameWidth);
  return pixelGrid[index];
}

export function getDeltaCell(x: number, y: number) {
  const index = ArrayHelper.get1DIndex(x,y, gameWidth);
  return delta[index];
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
  const index = ArrayHelper.get1DIndex(x,y, gameWidth);
  pixelGrid[index] = cellType;
  delta[index] = cellType;
}

export function swapCells(x1: number, y1: number, x2: number, y2: number) {
  const index1 = ArrayHelper.get1DIndex(x1,y1, gameWidth);
  const index2 = ArrayHelper.get1DIndex(x2,y2, gameWidth);
  const originCell = pixelGrid[index1];
  const destinationCell = pixelGrid[index2];

  pixelGrid[index1] = destinationCell;
  pixelGrid[index2] = originCell;
  delta[index1] = destinationCell;
  delta[index2] = originCell;
}

export function destroyCell(x: number, y: number) {
  const index = ArrayHelper.get1DIndex(x,y, gameWidth);
  pixelGrid[index] = CellType.empty;
  delta[index] = CellType.empty;
}

export function updateFullBoard() {
  // for(let i = 0; i < delta.length; i++) {
  //   if(delta[i]) {
  //     pixelGrid[i] = delta[i];
  //   }
  // }
}

export function wipeBoard() {
  ArrayHelper.wipe1DArray(pixelGrid, CellType.empty);
}

export function wipeDelta() {
  ArrayHelper.wipe1DArray(delta, null);
}
