import * as Utils from "../utils.js";
import * as CellType from "../celltype.js";
import * as Game from "../game.js";

export function process(
  cell: CellType.Cell,
  i: number,
  j: number,
  column: CellType.Cell[],
  canvasWidth: number,
  pascalsLaw: boolean
) {
  const cellBelow = column[j + 1];

  // Fall down
  if (
    (cellBelow === CellType.empty || cellBelow.state === CellType.states.gas) &&
    Math.random() >= 1 / (cell.density * 100)
  ) {
    // Move down
    Game.swapCells(i, j, i, j + 1);
    return;
  }

  if (cellBelow.state === CellType.states.liquid) {
    // Roll sideways
    const direction = Math.random() >= 0.5 ? 1 : -1;
    if (i + direction >= 0 && i + direction < canvasWidth) {
      const otherCell = Game.pixelGrid[i + direction][j + 1];
      if (otherCell === CellType.empty) {
        Game.swapCells(i, j, i + direction, j + 1);
        return;
      }
    }

    // Settle in less dense liquids
    if (
      cellBelow !== cell &&
      Math.random() <=
        (cell.density - cellBelow.density) / cellBelow.density / 5
    ) {
      Game.swapCells(i, j, i, j + 1);
      return;
    }

    // Pascal's Law
    if (
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
        return;
      }
    }

    // Move liquid around
    if (!moveLiquidSideways(cell, i, j, direction, canvasWidth)) {
      moveLiquidSideways(cell, i, j, -direction, canvasWidth);
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
    if (
      Game.pixelGrid[i + direction][j] === CellType.empty &&
      Game.pixelGrid[i][j + 1] !== CellType.states.solid
    ) {
      Game.swapCells(i, j, i + direction, j);
      return true;
    }

    if (Math.random() >= 0.5) {
      // TODO use liquid thickness instead of 0.5
      const nextCell = Game.pixelGrid[i + direction][j];
      if (nextCell !== cell && nextCell.state === CellType.states.liquid) {
        Game.swapCells(i, j, i + direction, j);
        return true;
      }
    }
  }
  return false;
}
