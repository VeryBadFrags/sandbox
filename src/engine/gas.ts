import * as CellType from "../celltype";
import * as Game from "../game";

export function process(
  cell: CellType.Cell,
  i: number,
  j: number,
  canvasWidth: number
) {
  // SMOKE
  if (Math.random() > cell.lifetime) {
    Game.destroyCell(i, j);
  } else if (
    j > 0 &&
    Game.getCell(i, j - 1) === CellType.empty &&
    Math.random() > 0.7
  ) {
    // Go up
    Game.swapCells(i, j, i, j - 1);
  } else {
    const coinFlip = Math.random() >= 0.5 ? 1 : -1;
    if (
      coinFlip &&
      j > 0 &&
      i + coinFlip >= 0 &&
      i + coinFlip < canvasWidth &&
      Game.getCell(i + coinFlip, j - 1) === CellType.empty &&
      Math.random() > 0.7
    ) {
      Game.swapCells(i, j, i + coinFlip, j - 1);
    }
  }
}
