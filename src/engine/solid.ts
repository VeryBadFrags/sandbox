import * as EngineUtils from "../utils/engineUtils";
import * as CellType from "../type/Cell";
import * as Game from "../game";

export function process(cell: CellType.Cell, i: number, j: number) {
  if (cell.static) {
    processStatic(cell, i, j);
    return;
  }

  const cellBelow = Game.getCell(i, j + 1);

  switch (cell) {
    case CellType.seed:
      // Germinate
      if (
        Math.random() > 0.999 &&
        EngineUtils.countNeighbors(i, j, CellType.soil) >= 3
      ) {
        Game.createCell(i, j, CellType.plant);
        return;
      }
      break;
    case CellType.salt:
      if (cellBelow === CellType.ice) {
        Game.createCell(i, j, CellType.water);
        Game.createCell(i, j + 1, CellType.water);
        return;
      }
      if (i - 1 >= 0 && Game.getCell(i - 1, j + 1) === CellType.ice) {
        Game.createCell(i, j, CellType.water);
        Game.createCell(i - 1, j + 1, CellType.water);
        return;
      }
      if (
        i + 1 < Game.getWidth() &&
        Game.getCell(i + 1, j + 1) === CellType.ice
      ) {
        Game.createCell(i, j, CellType.water);
        Game.createCell(i + 1, j + 1, CellType.water);
        return;
      }
      break;
  }

  if (cell.disolve) {
    if (
      Math.random() > 0.995 &&
      EngineUtils.countNeighbors(i, j, cell.disolve) >= 2
    ) {
      Game.createCell(i, j, cell.disolveInto);
      return;
    }
  }

  // If above void of gas
  if (
    (cellBelow === CellType.empty || cellBelow.state === CellType.States.gas) &&
    Math.random() >= 1 / (cell.density * 100)
  ) {
    Game.swapCells(i, j, i, j + 1);
    return;
  }

  // If above conveyor
  if (cellBelow.state === CellType.States.conveyor) {
    const neighbor = Game.getCell(
      i + cellBelow.vector.x,
      j + cellBelow.vector.y
    );
    if (neighbor === CellType.empty) {
      Game.swapCells(i, j, i + cellBelow.vector.x, j + cellBelow.vector.y);
    } else if (
      Game.getCell(i + cellBelow.vector.x, j + cellBelow.vector.y - 1) ===
      CellType.empty
    ) {
      Game.swapCells(i, j, i + cellBelow.vector.x, j + cellBelow.vector.y - 1);
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
      Game.swapCells(i, j, i, j + 1);
      return;
    }
  }

  if (cellBelow.state === CellType.States.fire && Math.random() > 0.9) {
    if (Math.random() > cell.flammable) {
      Game.createCell(i, j, CellType.flame);
    } else {
      Game.swapCells(i, j, i, j + 1);
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
  direction: number
): boolean {
  if (i + direction >= 0 && i + direction < Game.getWidth()) {
    const diagonalCell = Game.getCell(i + direction, j + 1);
    if (diagonalCell === CellType.empty && Math.random() > 0.2) {
      // Roll down
      Game.swapCells(i, j, i + direction, j + 1);
      return true;
    }

    if (diagonalCell.state === CellType.States.fire && Math.random() > 0.7) {
      if (Math.random() > cell.flammable) {
        Game.createCell(i, j, CellType.flame);
      } else {
        Game.swapCells(i, j, i + direction, j + 1);
      }
      return true;
    }

    if (diagonalCell.state === CellType.States.liquid && Math.random() > 0.9) {
      // Swirl in liquid
      Game.swapCells(i, j, i + direction, j);
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
  const cellBelow = Game.getCell(i, j + 1);
  // Propagate
  if (EngineUtils.countNeighbors(i, j, CellType.ice) >= 2) {
    return;
  }
  const direction = Math.floor(Math.random() * 4);
  switch (direction) {
    case 0:
      if (
        j > 0 &&
        (Game.getCell(i, j - 1) === CellType.water ||
          (Game.getCell(i, j - 1) === CellType.soil &&
            EngineUtils.countNeighbors(i, j, CellType.plant) <= 3)) &&
        Math.random() > cell.propagation
      ) {
        Game.createCell(i, j - 1, CellType.plant);
      }
      break;
    case 1:
      if (
        i < Game.getWidth() - 1 &&
        (Game.getCell(i + 1, j) === CellType.water ||
          (Game.getCell(i + 1, j) === CellType.soil &&
            EngineUtils.countNeighbors(i, j, CellType.plant) <= 2)) &&
        Math.random() > cell.propagation
      ) {
        Game.createCell(i + 1, j, CellType.plant);
      }
      break;
    case 2:
      if (
        j < Game.getHeight() - 1 &&
        Game.getCell(i, j + 1) === CellType.water &&
        Math.random() > cell.propagation
      ) {
        Game.createCell(i, j + 1, CellType.plant);
      }
      break;
    case 3:
      if (
        i > 0 &&
        (Game.getCell(i - 1, j) === CellType.water ||
          (Game.getCell(i - 1, j) === CellType.soil &&
            EngineUtils.countNeighbors(i, j, CellType.plant) <= 2)) &&
        Math.random() > cell.propagation
      ) {
        Game.createCell(i - 1, j, CellType.plant);
      }
      break;
  }

  // Spawn seed
  if (
    cellBelow === CellType.empty &&
    Math.random() > 0.999 &&
    EngineUtils.countNeighbors(i, j, CellType.plant) > 5
  ) {
    Game.createCell(i, j + 1, CellType.seed);
  }
}

function processIce(cell: CellType.Cell, i: number, j: number) {
  const cellBelow = Game.getCell(i, j + 1);
  // Propagate
  if (
    j > 0 &&
    EngineUtils.countNeighbors(i, j, CellType.water) >= 2 &&
    EngineUtils.countNeighbors(i, j, CellType.ice) <= 4
  ) {
    // TODO replace with for loop
    if (
      i > 0 &&
      Game.getCell(i - 1, j - 1) === CellType.water &&
      Math.random() > cell.propagation
    ) {
      Game.createCell(i - 1, j - 1, CellType.ice);
    }
    if (
      i < Game.getWidth() - 1 &&
      Game.getCell(i + 1, j - 1) === CellType.water &&
      Math.random() > cell.propagation
    ) {
      Game.createCell(i + 1, j - 1, CellType.ice);
    }
    if (
      Game.getCell(i, j - 1) === CellType.water &&
      Math.random() > cell.propagation
    ) {
      Game.createCell(i, j - 1, CellType.ice);
    }
  }

  // Drip
  dripAndMeltIce(cellBelow, cell, i, j);
}

function dripAndMeltIce(
  cellBelow: CellType.Cell,
  cell: CellType.Cell,
  i: number,
  j: number
) {
  if (cellBelow === CellType.empty && Math.random() > cell.drip) {
    Game.createCell(i, j + 1, CellType.water);
  }
  // Melt
  if (
    (Math.random() > cell.lifetime &&
      EngineUtils.countNeighbors(i, j, CellType.ice) < 6) ||
    EngineUtils.testNeighbors(
      i,
      j,
      (c: CellType.Cell) => c.state === CellType.States.fire
    ) > 0
  ) {
    Game.createCell(i, j, cell.melt);
  }
}
