import * as Utils from "./utils.js";
import * as CellType from "./celltype.js";
import * as Game from "./game.js";

export function process(
  cell: CellType.Cell,
  i: number,
  j: number,
  column: CellType.Cell[],
  canvasWidth: number,
  pascalsLaw: boolean
) {
  const cellBelow = column[j + 1];
  if (cellBelow === CellType.empty) {
    // Move down
    Game.swapCells(i, j, i, j + 1);
  } else if (cellBelow.state === CellType.states.liquid) {
    if (
      cellBelow !== cell &&
      Math.random() <=
        (cell.density - cellBelow.density) / cellBelow.density / 5
    ) {
      Game.swapCells(i, j, i, j + 1);
    } else if (
      pascalsLaw &&
      j - 1 >= 0 &&
      Game.pixelGrid[i][j - 1] === CellType.empty &&
      i - 1 >= 0 &&
      Game.pixelGrid[i - 1][j] === cell &&
      i + 1 < canvasWidth &&
      Game.pixelGrid[i + 1][j] === cell
    ) {
      const higherCell = Utils.getHigherCell(cell, i, j, Game.pixelGrid);
      if (higherCell) {
        Game.swapCells(i, j - 1, higherCell[0], higherCell[1]);
      }
    } else {
      // Move liquid around
      const direction = Math.random() >= 0.5 ? 1 : -1;
      if (!moveLiquidSideways(cell, i, j, direction, canvasWidth)) {
        moveLiquidSideways(cell, i, j, -direction, canvasWidth);
      }
    }
  }
}

function moveLiquidSideways(
  cell: CellType.Cell,
  i: number,
  j: number,
  direction: number,
  canvasWidth: number
): boolean {
  if (i + direction >= 0 && i + direction < canvasWidth) {
    if (Game.pixelGrid[i + direction][j + 1] === CellType.empty) {
      Game.swapCells(i, j, i + direction, j + 1);
      return true;
    } else if (
      Game.pixelGrid[i + direction][j] === CellType.empty &&
      Game.pixelGrid[i][j + 1] !== CellType.states.solid
    ) {
      Game.swapCells(i, j, i + direction, j);
      return true;
    } else if (Math.random() >= 0.5) {
      // TODO use liquid thickness instead of 0.5
      const nextCell = Game.pixelGrid[i + direction][j];
      if (nextCell !== cell && nextCell.state !== CellType.states.solid) {
        Game.swapCells(i, j, i + direction, j);
        return true;
      }
    }
  }
  return false;
}
