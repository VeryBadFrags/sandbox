import * as EngineUtils from "../utils/engineUtils";
import {
  createCell,
  getCell,
  getGameHeight,
  getGameWidth,
  swapCells,
} from "../game";
import { States } from "../types/states";
import {
  emptyCell,
  flame,
  ice,
  plant,
  salt,
  seed,
  soil,
  water,
} from "../content/CellValues";
import type { Cell } from "../types/cell.type";

export function process(cell: Cell, i: number, j: number) {
  if (cell.static) {
    processStatic(cell, i, j);
    return;
  }

  const cellBelow = getCell(i, j + 1);

  switch (cell) {
    case seed:
      // Germinate
      if (
        Math.random() > 0.999 &&
        EngineUtils.countNeighbors(i, j, soil) >= 3
      ) {
        createCell(i, j, plant);
        return;
      }
      break;
    case salt:
      if (cellBelow === ice) {
        createCell(i, j, water);
        createCell(i, j + 1, water);
        return;
      }
      if (i - 1 >= 0 && getCell(i - 1, j + 1) === ice) {
        createCell(i, j, water);
        createCell(i - 1, j + 1, water);
        return;
      }
      if (i + 1 < getGameWidth() && getCell(i + 1, j + 1) === ice) {
        createCell(i, j, water);
        createCell(i + 1, j + 1, water);
        return;
      }
      break;
  }

  if (cell.disolve) {
    if (
      Math.random() > 0.995 &&
      EngineUtils.countNeighbors(i, j, cell.disolve) >= 2
    ) {
      createCell(i, j, cell.disolveInto);
      return;
    }
  }

  // If above void or gas
  if (
    (cellBelow === emptyCell || cellBelow.state === States.gas) &&
    Math.random() >= 1 / (cell.density * 100)
  ) {
    swapCells(i, j, i, j + 1);
    return;
  }

  // If above conveyor
  if (cellBelow.state === States.conveyor) {
    const neighbor = getCell(i + cellBelow.vector.x, j + cellBelow.vector.y);
    if (neighbor === emptyCell) {
      swapCells(i, j, i + cellBelow.vector.x, j + cellBelow.vector.y);
    } else if (
      getCell(i + cellBelow.vector.x, j + cellBelow.vector.y - 1) === emptyCell
    ) {
      swapCells(i, j, i + cellBelow.vector.x, j + cellBelow.vector.y - 1);
    }
    return;
  }

  // Sink in liquids
  if (cellBelow.state === States.liquid && cell.density > cellBelow.density) {
    if (
      Math.random() <=
      (cell.density - cellBelow.density) / cellBelow.density / 50
    ) {
      swapCells(i, j, i, j + 1);
      return;
    }
  }

  if (cellBelow.state === States.fire && Math.random() > 0.9) {
    if (Math.random() > cell.flammable) {
      createCell(i, j, flame);
    } else {
      swapCells(i, j, i, j + 1);
    }
    return;
  }

  if (!cell.sticky) {
    // Fall sideways
    const direction = Math.random() >= 0.5 ? 1 : -1;
    if (!rollGrainSideways(cell, i, j, direction)) {
      rollGrainSideways(cell, i, j, -direction);
    }
    return;
  }
}

function rollGrainSideways(
  cell: Cell,
  i: number,
  j: number,
  direction: number,
): boolean {
  if (i + direction >= 0 && i + direction < getGameWidth()) {
    const diagonalCell = getCell(i + direction, j + 1);
    if (diagonalCell === emptyCell && Math.random() > 0.2) {
      // Roll down
      swapCells(i, j, i + direction, j + 1);
      return true;
    }

    if (diagonalCell.state === States.fire && Math.random() > 0.7) {
      if (Math.random() > cell.flammable) {
        createCell(i, j, flame);
      } else {
        swapCells(i, j, i + direction, j + 1);
      }
      return true;
    }

    if (diagonalCell.state === States.liquid && Math.random() > 0.9) {
      // Swirl in liquid
      swapCells(i, j, i + direction, j);
      return true;
    }
  }
  return false;
}

function processStatic(cell: Cell, i: number, j: number) {
  switch (cell) {
    case plant:
      processPlant(cell, i, j);
      break;
    case ice:
      processIce(cell, i, j);
      break;
  }
}

function processPlant(cell: Cell, i: number, j: number) {
  const cellBelow = getCell(i, j + 1);
  // Propagate
  if (EngineUtils.countNeighbors(i, j, ice) >= 2) {
    return;
  }
  const direction = Math.floor(Math.random() * 4);
  switch (direction) {
    case 0:
      if (
        j > 0 &&
        (getCell(i, j - 1) === water ||
          (getCell(i, j - 1) === soil &&
            EngineUtils.countNeighbors(i, j, plant) <= 3)) &&
        Math.random() > cell.propagation
      ) {
        createCell(i, j - 1, plant);
      }
      break;
    case 1:
      if (
        i < getGameWidth() - 1 &&
        (getCell(i + 1, j) === water ||
          (getCell(i + 1, j) === soil &&
            EngineUtils.countNeighbors(i, j, plant) <= 2)) &&
        Math.random() > cell.propagation
      ) {
        createCell(i + 1, j, plant);
      }
      break;
    case 2:
      if (
        j < getGameHeight() - 1 &&
        getCell(i, j + 1) === water &&
        Math.random() > cell.propagation
      ) {
        createCell(i, j + 1, plant);
      }
      break;
    case 3:
      if (
        i > 0 &&
        (getCell(i - 1, j) === water ||
          (getCell(i - 1, j) === soil &&
            EngineUtils.countNeighbors(i, j, plant) <= 2)) &&
        Math.random() > cell.propagation
      ) {
        createCell(i - 1, j, plant);
      }
      break;
  }

  // Spawn seed
  if (
    cellBelow === emptyCell &&
    Math.random() > 0.999 &&
    EngineUtils.countNeighbors(i, j, plant) > 5
  ) {
    createCell(i, j + 1, seed);
  }
}

function processIce(cell: Cell, i: number, j: number) {
  const cellBelow = getCell(i, j + 1);
  // Propagate
  if (
    j > 0 &&
    EngineUtils.countNeighbors(i, j, water) >= 2 &&
    EngineUtils.countNeighbors(i, j, ice) <= 4
  ) {
    // TODO replace with for loop
    if (
      i > 0 &&
      getCell(i - 1, j - 1) === water &&
      Math.random() > cell.propagation
    ) {
      createCell(i - 1, j - 1, ice);
    }
    if (
      i < getGameWidth() - 1 &&
      getCell(i + 1, j - 1) === water &&
      Math.random() > cell.propagation
    ) {
      createCell(i + 1, j - 1, ice);
    }
    if (getCell(i, j - 1) === water && Math.random() > cell.propagation) {
      createCell(i, j - 1, ice);
    }
  }

  // Drip
  dripAndMeltIce(cellBelow, cell, i, j);
}

function dripAndMeltIce(cellBelow: Cell, cell: Cell, i: number, j: number) {
  if (cellBelow === emptyCell && Math.random() > cell.drip) {
    createCell(i, j + 1, water);
  }
  // Melt
  if (
    (Math.random() > cell.lifetime &&
      EngineUtils.countNeighbors(i, j, ice) < 6) ||
    EngineUtils.testNeighbors(i, j, (c: Cell) => c.state === States.fire) > 0
  ) {
    createCell(i, j, cell.melt);
  }
}
