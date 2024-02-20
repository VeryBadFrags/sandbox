import * as Game from "../game";
import { getHigherCell } from "../utils/liquidUtils";
import { States } from "../types/states";
import { acid, emptyCell, smoke } from "../content/CellValues";
import type { Cell } from "../types/cell.type";

export function process(
  cell: Cell,
  i: number,
  j: number,
  pascalsLaw: boolean,
): void {
  const cellBelow = Game.getCell(i, j + 1);

  if (processAcid(cell, cellBelow, i, j)) return;

  // Fall down
  if (cellBelow === emptyCell || cellBelow.state === States.gas) {
    Game.swapCells(i, j, i, j + 1);
    return;
  }

  const direction = Math.random() >= 0.5 ? 1 : -1;
  // Roll sideways
  if (
    moveLiquidSideways(i, j, direction, cell) ||
    moveLiquidSideways(i, j, -direction, cell)
  ) {
    return;
  }

  if (cellBelow.state === States.liquid) {
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
        i + direction < Game.getGameWidth() &&
        Math.random() >= 0.5
      ) {
        // TODO use liquid thickness instead of 0.5
        const nextCell = Game.getCell(i + direction, j);
        if (nextCell !== cell && nextCell.state === States.liquid) {
          Game.swapCells(i, j, i + direction, j);
          return;
        }
      }
    } else {
      applyPascalsLaw(pascalsLaw, cell, i, j);
    }
    return;
  }

  if (
    cellBelow.state === States.solid &&
    !cellBelow.static &&
    cell.density > cellBelow.density &&
    Math.random() > 0.999
  ) {
    Game.swapCells(i, j, i, j + 1);
    return;
  }

  // If above conveyor
  if (cellBelow.state === States.conveyor) {
    const neighbor = Game.getCell(
      i + cellBelow.vector.x,
      j + cellBelow.vector.y,
    );
    if (neighbor === emptyCell) {
      Game.swapCells(i, j, i + cellBelow.vector.x, j + cellBelow.vector.y);
    } else if (
      Game.getCell(i + cellBelow.vector.x, j + cellBelow.vector.y - 1) ===
      emptyCell
    ) {
      Game.swapCells(i, j, i + cellBelow.vector.x, j + cellBelow.vector.y - 1);
    }
    return;
  }
}

function processAcid(
  cell: Cell,
  cellBelow: Cell,
  i: number,
  j: number,
): boolean {
  if (cell == acid && cellBelow.state === States.solid && Math.random() > 0.8) {
    Game.createCell(i, j, smoke);
    if (Math.random() > 0.999) {
      Game.createCell(i, j + 1, acid);
    } else {
      Game.createCell(i, j + 1, emptyCell);
    }
    return true;
  }
  return false;
}

function applyPascalsLaw(
  pascalsLaw: boolean,
  cell: Cell,
  i: number,
  j: number,
): void {
  if (
    pascalsLaw &&
    j - 1 >= 0 &&
    Game.getCell(i, j - 1) === emptyCell &&
    i - 1 >= 0 &&
    Game.getCell(i - 1, j) === cell &&
    i + 1 < Game.getGameWidth() &&
    Game.getCell(i + 1, j) === cell
  ) {
    const higherCell = getHigherCell(cell, i, j);
    if (higherCell) {
      Game.swapCells(i, j - 1, higherCell[0], higherCell[1]);
      return;
    }
  }
}

function moveLiquidSideways(
  i: number,
  j: number,
  direction: number,
  current: Cell,
): boolean {
  if (i + direction >= 0 && i + direction < Game.getGameWidth()) {
    const neighbor = Game.getCell(i + direction, j);
    if (neighbor === emptyCell && !Game.getCell(i, j + 1).static) {
      Game.swapCells(i, j, i + direction, j);
      return true;
    }

    if (Game.getCell(i + direction, j + 1) === emptyCell) {
      Game.swapCells(i, j, i + direction, j + 1);
      return true;
    }

    if (
      neighbor !== current &&
      neighbor.state === States.liquid &&
      Math.random() > 0.9
    ) {
      Game.swapCells(i, j, i + direction, j);
    }
  }

  return false;
}
