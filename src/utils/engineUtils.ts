import * as Game from "../game";
import * as CellType from "../celltype";

export function isFuelAround(x: number, y: number) {
  const xMax = Math.min(x + 1, Game.getWidth() - 1);
  const yMax = Math.min(y + 1, Game.getHeight() - 1);
  for (let i = Math.max(x - 1, 0); i <= xMax; i++) {
    for (let j = Math.max(y - 1, 0); j <= yMax; j++) {
      if (i !== x || j !== y) {
        if (Game.getCell(i, j).flammable) return true;
      }
    }
  }
  return false;
}

export function countNeighbors(
  x: number,
  y: number,
  pixelGrid: CellType.Cell[][],
  neighType: CellType.Cell
) {
  let count = 0;
  const xMax = Math.min(x + 1, Game.getWidth() - 1);
  const yMax = Math.min(y + 1, Game.getHeight() - 1);
  for (let i = Math.max(x - 1, 0); i <= xMax; i++) {
    const column = pixelGrid[i];
    for (let j = Math.max(y - 1, 0); j <= yMax; j++) {
      if (i !== x || j !== y) {
        if (column[j] === neighType) {
          count++;
        }
      }
    }
  }
  return count;
}

export function testNeighbors(
  x: number,
  y: number,
  pixelGrid: CellType.Cell[][],
  testFunction: (c: CellType.Cell) => boolean,
  action?: (c: CellType.Cell, x: number, y: number) => void
) {
  let count = 0;
  const xMax = Math.min(x + 1, pixelGrid.length - 1);
  const yMax = Math.min(y + 1, pixelGrid[0].length - 1);
  for (let i = Math.max(x - 1, 0); i <= xMax; i++) {
    const column = pixelGrid[i];
    for (let j = Math.max(y - 1, 0); j <= yMax; j++) {
      if (i !== x || j !== y) {
        if (testFunction(column[j])) {
          count++;
          action ? action(column[j], i, j) : null;
        }
      }
    }
  }
  return count;
}
