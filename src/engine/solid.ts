import * as EngineUtils from "../utils/engineUtils";
import * as CellType from "../type/Cell";
import { createCell, getCell, getGameHeight, getGameWidth, swapCells } from "../game";

export function process(cell: CellType.Cell, i: number, j: number) {
  if (cell.static) {
    processStatic(cell, i, j);
    return;
  }

  const cellBelow = getCell(i, j + 1);

  switch (cell) {
    case CellType.seed:
      // Germinate
      if (
        Math.random() > 0.999 &&
        EngineUtils.countNeighbors(i, j, CellType.soil) >= 3
      ) {
        createCell(i, j, CellType.plant);
        return;
      }
      break;
    case CellType.salt:
      if (cellBelow === CellType.ice) {
        createCell(i, j, CellType.water);
        createCell(i, j + 1, CellType.water);
        return;
      }
      if (i - 1 >= 0 && getCell(i - 1, j + 1) === CellType.ice) {
        createCell(i, j, CellType.water);
        createCell(i - 1, j + 1, CellType.water);
        return;
      }
      if (
        i + 1 < getGameWidth() &&
        getCell(i + 1, j + 1) === CellType.ice
      ) {
        createCell(i, j, CellType.water);
        createCell(i + 1, j + 1, CellType.water);
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
    (cellBelow === CellType.empty || cellBelow.state === CellType.States.gas) &&
    Math.random() >= 1 / (cell.density * 100)
  ) {
    swapCells(i, j, i, j + 1);
    return;
  }

  // If above conveyor
  if (cellBelow.state === CellType.States.conveyor) {
    const neighbor = getCell(
      i + cellBelow.vector.x,
      j + cellBelow.vector.y,
    );
    if (neighbor === CellType.empty) {
      swapCells(i, j, i + cellBelow.vector.x, j + cellBelow.vector.y);
    } else if (
      getCell(i + cellBelow.vector.x, j + cellBelow.vector.y - 1) ===
      CellType.empty
    ) {
      swapCells(i, j, i + cellBelow.vector.x, j + cellBelow.vector.y - 1);
    }
    return;
  }

  // Sink in liquids
  if (
    cellBelow.state === CellType.States.liquid &&
    cell.density > cellBelow.density
  ) {
    if (
      Math.random() <=
      (cell.density - cellBelow.density) / cellBelow.density / 50
    ) {
      swapCells(i, j, i, j + 1);
      return;
    }
  }

  if (cellBelow.state === CellType.States.fire && Math.random() > 0.9) {
    if (Math.random() > cell.flammable) {
      createCell(i, j, CellType.flame);
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
  cell: CellType.Cell,
  i: number,
  j: number,
  direction: number,
): boolean {
  if (i + direction >= 0 && i + direction < getGameWidth()) {
    const diagonalCell = getCell(i + direction, j + 1);
    if (diagonalCell === CellType.empty && Math.random() > 0.2) {
      // Roll down
      swapCells(i, j, i + direction, j + 1);
      return true;
    }

    if (diagonalCell.state === CellType.States.fire && Math.random() > 0.7) {
      if (Math.random() > cell.flammable) {
        createCell(i, j, CellType.flame);
      } else {
        swapCells(i, j, i + direction, j + 1);
      }
      return true;
    }

    if (diagonalCell.state === CellType.States.liquid && Math.random() > 0.9) {
      // Swirl in liquid
      swapCells(i, j, i + direction, j);
      return true;
    }
  }
  return false;
}

function processStatic(cell: CellType.Cell, i: number, j: number) {
  switch (cell) {
    case CellType.plant:
      processPlant(cell, i, j);
      break;
    case CellType.ice:
      processIce(cell, i, j);
      break;
  }
}

function processPlant(cell: CellType.Cell, i: number, j: number) {
  const cellBelow = getCell(i, j + 1);
  // Propagate
  if (EngineUtils.countNeighbors(i, j, CellType.ice) >= 2) {
    return;
  }
  const direction = Math.floor(Math.random() * 4);
  switch (direction) {
    case 0:
      if (
        j > 0 &&
        (getCell(i, j - 1) === CellType.water ||
          (getCell(i, j - 1) === CellType.soil &&
            EngineUtils.countNeighbors(i, j, CellType.plant) <= 3)) &&
        Math.random() > cell.propagation
      ) {
        createCell(i, j - 1, CellType.plant);
      }
      break;
    case 1:
      if (
        i < getGameWidth() - 1 &&
        (getCell(i + 1, j) === CellType.water ||
          (getCell(i + 1, j) === CellType.soil &&
            EngineUtils.countNeighbors(i, j, CellType.plant) <= 2)) &&
        Math.random() > cell.propagation
      ) {
        createCell(i + 1, j, CellType.plant);
      }
      break;
    case 2:
      if (
        j < getGameHeight() - 1 &&
        getCell(i, j + 1) === CellType.water &&
        Math.random() > cell.propagation
      ) {
        createCell(i, j + 1, CellType.plant);
      }
      break;
    case 3:
      if (
        i > 0 &&
        (getCell(i - 1, j) === CellType.water ||
          (getCell(i - 1, j) === CellType.soil &&
            EngineUtils.countNeighbors(i, j, CellType.plant) <= 2)) &&
        Math.random() > cell.propagation
      ) {
        createCell(i - 1, j, CellType.plant);
      }
      break;
  }

  // Spawn seed
  if (
    cellBelow === CellType.empty &&
    Math.random() > 0.999 &&
    EngineUtils.countNeighbors(i, j, CellType.plant) > 5
  ) {
    createCell(i, j + 1, CellType.seed);
  }
}

function processIce(cell: CellType.Cell, i: number, j: number) {
  const cellBelow = getCell(i, j + 1);
  // Propagate
  if (
    j > 0 &&
    EngineUtils.countNeighbors(i, j, CellType.water) >= 2 &&
    EngineUtils.countNeighbors(i, j, CellType.ice) <= 4
  ) {
    // TODO replace with for loop
    if (
      i > 0 &&
      getCell(i - 1, j - 1) === CellType.water &&
      Math.random() > cell.propagation
    ) {
      createCell(i - 1, j - 1, CellType.ice);
    }
    if (
      i < getGameWidth() - 1 &&
      getCell(i + 1, j - 1) === CellType.water &&
      Math.random() > cell.propagation
    ) {
      createCell(i + 1, j - 1, CellType.ice);
    }
    if (
      getCell(i, j - 1) === CellType.water &&
      Math.random() > cell.propagation
    ) {
      createCell(i, j - 1, CellType.ice);
    }
  }

  // Drip
  dripAndMeltIce(cellBelow, cell, i, j);
}

function dripAndMeltIce(
  cellBelow: CellType.Cell,
  cell: CellType.Cell,
  i: number,
  j: number,
) {
  if (cellBelow === CellType.empty && Math.random() > cell.drip) {
    createCell(i, j + 1, CellType.water);
  }
  // Melt
  if (
    (Math.random() > cell.lifetime &&
      EngineUtils.countNeighbors(i, j, CellType.ice) < 6) ||
    EngineUtils.testNeighbors(
      i,
      j,
      (c: CellType.Cell) => c.state === CellType.States.fire,
    ) > 0
  ) {
    createCell(i, j, cell.melt);
  }
}
