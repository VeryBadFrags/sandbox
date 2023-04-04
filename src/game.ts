import * as ArrayHelper from "./utils/arrayHelper";
import * as CellType from "./type/Cell";
import { GameCell } from "./type/GameCell";

const gameWidth = 400;
const gameHeight = 400;

const pixelGrid = ArrayHelper.initArray(gameWidth, gameHeight, CellType.empty);
const delta = ArrayHelper.initArray(gameWidth, gameHeight, null);

export function getCell(x: number, y: number): CellType.Cell {
  const index = ArrayHelper.get1DIndex(x, y, gameWidth);
  return pixelGrid[index].cell;
}

export function getCellByIndex(i: number): CellType.Cell {
  return pixelGrid[i].cell;
}

export function getDeltaCell(x: number, y: number): CellType.Cell {
  const index = ArrayHelper.get1DIndex(x, y, gameWidth);
  return delta[index].cell;
}

export function getDeltaCellByIndex(i: number): CellType.Cell {
  return delta[i].cell;
}

export function getFullBoard(): Array<GameCell> {
  return pixelGrid;
}

export function getDeltaBoard() {
  return delta;
}

export function getWidth(): number {
  return gameWidth;
}

export function getHeight(): number {
  return gameHeight;
}

export function createCell(
  x: number,
  y: number,
  cellType: CellType.Cell
): void {
  const index = ArrayHelper.get1DIndex(x, y, gameWidth);
  pixelGrid[index].cell = cellType;
  delta[index].cell = cellType;
}

export function swapCells(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): void {
  const index1 = ArrayHelper.get1DIndex(x1, y1, gameWidth);
  const index2 = ArrayHelper.get1DIndex(x2, y2, gameWidth);
  const originCell: CellType.Cell = pixelGrid[index1].cell;
  const destinationCell: CellType.Cell = pixelGrid[index2].cell;

  pixelGrid[index1].cell = destinationCell;
  pixelGrid[index2].cell = originCell;
  delta[index1].cell = destinationCell;
  delta[index2].cell = originCell;
}

export function destroyCell(x: number, y: number) {
  const index = ArrayHelper.get1DIndex(x, y, gameWidth);
  pixelGrid[index].cell = CellType.empty;
  delta[index].cell = CellType.empty;
}

export function wipeBoard() {
  ArrayHelper.wipe1DArray(pixelGrid, CellType.empty);
}

export function wipeDelta() {
  ArrayHelper.wipe1DArray(delta, null);
}
