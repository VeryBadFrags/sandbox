import * as Utils from "../utils";
import * as CellType from "../celltype";
import * as Game from "../game";

export function process(
  cell: CellType.Cell,
  i: number,
  j: number,
  pascalsLaw: boolean
) {
  const cellBelow = Game.getCell(i, j + 1);

  if (processAcid(cell, cellBelow, i, j)) return;

  // Fall down
  if (cellBelow === CellType.empty || cellBelow.state === CellType.states.gas) {
    Game.swapCells(i, j, i, j + 1);
    return;
  }

  if (cellBelow.state === CellType.states.liquid) {
    const direction = Math.random() >= 0.5 ? 1 : -1;
    // Roll sideways
    if (
      moveLiquidSideways(i, j, direction) ||
      moveLiquidSideways(i, j, -direction)
    ) {
      return;
    }

    // Interract with other liquids
    if (cellBelow !== cell) {
      // Settle in less dense liquids
      if (
        Math.random() <=
        (cell.density - cellBelow.density) / cellBelow.density / 5
      ) {
        Game.swapCells(i, j, i, j + 1);
        return;
      }

      // Swirl in liquids
      if (
        i + direction >= 0 &&
        i + direction < Game.getWidth() &&
        Math.random() >= 0.5
      ) {
        // TODO use liquid thickness instead of 0.5
        const nextCell = Game.getCell(i + direction, j);
        if (nextCell !== cell && nextCell.state === CellType.states.liquid) {
          Game.swapCells(i, j, i + direction, j);
          return;
        }
      }
    } else {
      applyPascalsLaw(pascalsLaw, cell, i, j);
    }
  }
}

function processAcid(
  cell: CellType.Cell,
  cellBelow: CellType.Cell,
  i: number,
  j: number
) {
  // Acid
  if (
    cell == CellType.acid &&
    cellBelow.state === CellType.states.solid &&
    Math.random() > 0.8
  ) {
    Game.createCell(i, j, CellType.smoke);
    if (Math.random() > 0.999) {
      Game.createCell(i, j + 1, CellType.acid);
    } else {
      Game.createCell(i, j + 1, CellType.empty);
    }
    return true;
  }
  return false;
}

function applyPascalsLaw(
  pascalsLaw: boolean,
  cell: CellType.Cell,
  i: number,
  j: number
) {
  if (
    pascalsLaw &&
    j - 1 >= 0 &&
    Game.getCell(i, j - 1) === CellType.empty &&
    i - 1 >= 0 &&
    Game.getCell(i - 1, j) === cell &&
    i + 1 < Game.getWidth() &&
    Game.getCell(i + 1, j) === cell
  ) {
    const higherCell = Utils.getHigherCell(cell, i, j, Game.pixelGrid);
    if (higherCell) {
      Game.swapCells(i, j - 1, higherCell[0], higherCell[1]);
      return;
    }
  }
}

function moveLiquidSideways(i: number, j: number, direction: number): boolean {
  if (i + direction >= 0 && i + direction < Game.getWidth()) {
    if (Game.getCell(i + direction, j + 1) === CellType.empty) {
      Game.swapCells(i, j, i + direction, j + 1);
      return true;
    }

    if (
      Game.getCell(i + direction, j) === CellType.empty &&
      Game.getCell(i, j + 1) !== CellType.states.solid
    ) {
      Game.swapCells(i, j, i + direction, j);
      return true;
    }
  }

  return false;
}
