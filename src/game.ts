import { get1DIndex, initArray, wipe1DArray } from "./utils/arrayUtils.ts";
import { emptyCell } from "./content/CellValues.ts";
import type { Cell } from "./types/cell.type.ts";

const gameWidth = 400;
const gameHeight = 400;

const pixelGrid = initArray(gameWidth, gameHeight, emptyCell);
const delta = initArray(gameWidth, gameHeight, undefined);

export function getCell(x: number, y: number): Cell {
  const index = get1DIndex(x, y, gameWidth);
  return pixelGrid[index];
}

export function getDeltaCell(x: number, y: number): Cell {
  const index = get1DIndex(x, y, gameWidth);
  return delta[index];
}

export function getDeltaBoard() {
  return delta;
}

export function getFullBoard() {
  return pixelGrid;
}

export function getGameWidth(): number {
  return gameWidth;
}

export function getGameHeight(): number {
  return gameHeight;
}

export function createCell(x: number, y: number, cellType: Cell): void {
  const index = get1DIndex(x, y, gameWidth);
  pixelGrid[index] = cellType;
  delta[index] = cellType;
}

export function swapCells(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): void {
  const index1 = get1DIndex(x1, y1, gameWidth);
  const index2 = get1DIndex(x2, y2, gameWidth);
  const originCell: Cell = pixelGrid[index1];
  const destinationCell: Cell = pixelGrid[index2];

  pixelGrid[index1] = destinationCell;
  pixelGrid[index2] = originCell;
  delta[index1] = destinationCell;
  delta[index2] = originCell;
}

export function destroyCell(x: number, y: number) {
  const index = get1DIndex(x, y, gameWidth);
  pixelGrid[index] = emptyCell;
  delta[index] = emptyCell;
}

export function wipeBoard() {
  wipe1DArray(pixelGrid, emptyCell);
}

export function wipeDelta() {
  wipe1DArray(delta, undefined);
}
