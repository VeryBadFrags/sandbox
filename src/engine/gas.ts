import * as Game from "../game";
import { emptyCell } from "../content/CellValues";
import type { Cell } from "../types/cell.type";

export function process(cell: Cell, i: number, j: number): void {
  // SMOKE
  if (Math.random() > cell.lifetime) {
    Game.destroyCell(i, j);
  } else if (
    j > 0 &&
    Game.getCell(i, j - 1) === emptyCell &&
    Math.random() > 0.7
  ) {
    // Go up
    Game.swapCells(i, j, i, j - 1);
    return;
  }

  const direction = Math.random() >= 0.5 ? 1 : -1;
  if (
    j > 0 &&
    i + direction >= 0 &&
    i + direction < Game.getGameWidth() &&
    Game.getCell(i + direction, j - 1) === emptyCell &&
    Math.random() > 0.7
  ) {
    Game.swapCells(i, j, i + direction, j - 1);
    return;
  }
}
