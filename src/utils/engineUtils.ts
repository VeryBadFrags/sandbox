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

export function countNeighbors(x: number, y: number, neighType: CellType.Cell) {
  let count = 0;
  const xMax = Math.min(x + 1, Game.getWidth() - 1);
  const yMax = Math.min(y + 1, Game.getHeight() - 1);
  for (let i = Math.max(x - 1, 0); i <= xMax; i++) {
    for (let j = Math.max(y - 1, 0); j <= yMax; j++) {
      if (i !== x || j !== y) {
        if (Game.getCell(i, j) === neighType) {
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
  testFunction: (c: CellType.Cell) => boolean,
  action?: (c: CellType.Cell, x: number, y: number) => void
) {
  let count = 0;
  const xMax = Math.min(x + 1, Game.getWidth() - 1);
  const yMax = Math.min(y + 1, Game.getHeight() - 1);
  for (let i = Math.max(x - 1, 0); i <= xMax; i++) {
    for (let j = Math.max(y - 1, 0); j <= yMax; j++) {
      if (i !== x || j !== y) {
        const neighbor = Game.getCell(i, j);
        if (testFunction(neighbor)) {
          count++;
          action ? action(neighbor, i, j) : null;
        }
      }
    }
  }
  return count;
}
