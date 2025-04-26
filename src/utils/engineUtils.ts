import * as Game from "../game.ts";
import type { Cell } from "../types/cell.type.ts";

export function isFuelAround(x: number, y: number) {
  const xMax = Math.min(x + 1, Game.getGameWidth() - 1);
  const yMax = Math.min(y + 1, Game.getGameHeight() - 1);
  for (let i = Math.max(x - 1, 0); i <= xMax; i++) {
    for (let j = Math.max(y - 1, 0); j <= yMax; j++) {
      if (i !== x || j !== y) {
        if (Game.getCell(i, j).flammable) return true;
      }
    }
  }
  return false;
}

export function countNeighbors(x: number, y: number, neighType: Cell) {
  let count = 0;
  const xMax = Math.min(x + 1, Game.getGameWidth() - 1);
  const yMax = Math.min(y + 1, Game.getGameHeight() - 1);
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
  testFunction: (c: Cell) => boolean,
  action?: (c: Cell, x: number, y: number) => void,
): number {
  let count = 0;
  const xMin = Math.max(x - 1, 0);
  const xMax = Math.min(x + 1, Game.getGameWidth() - 1);
  const yMin = Math.max(y - 1, 0);
  const yMax = Math.min(y + 1, Game.getGameHeight() - 1);
  for (let i = xMin; i <= xMax; i++) {
    for (let j = yMin; j <= yMax; j++) {
      if (i !== x || j !== y) {
        const neighbor = Game.getCell(i, j);
        if (testFunction(neighbor)) {
          count++;
          if (action) action(neighbor, i, j);
        }
      }
    }
  }
  return count;
}
