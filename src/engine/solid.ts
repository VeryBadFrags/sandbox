import * as Utils from "../utils.js";
import * as CellType from "../celltype.js";
import * as Game from "../game.js";

export function process(
  cell: CellType.Cell,
  i: number,
  j: number,
  column: CellType.Cell[],
  canvasWidth: number,
  canvasHeight: number
) {
  if (cell.static) {
    processStatic(cell, i, j, column, canvasWidth, canvasHeight);
    return;
  }

  const cellBelow = column[j + 1];

  switch (cell) {
    case CellType.seed:
      // Germinate
      if (
        Math.random() > 0.999 &&
        Utils.countNeighbors(i, j, Game.pixelGrid, CellType.soil) >= 3
      ) {
        Game.createCell(i, j, CellType.plant);
        return;
      }
      break;
    case CellType.salt:
      if (cellBelow === CellType.ice) {
        Game.createCell(i, j, CellType.water);
        Game.createCell(i, j + 1, CellType.water);
      }
      if (i - 1 >= 0 && Game.pixelGrid[i - 1][j + 1] === CellType.ice) {
        Game.createCell(i, j, CellType.water);
        Game.createCell(i - 1, j + 1, CellType.water);
      }
      if (
        i + 1 < canvasWidth &&
        Game.pixelGrid[i + 1][j + 1] === CellType.ice
      ) {
        Game.createCell(i, j, CellType.water);
        Game.createCell(i + 1, j + 1, CellType.water);
      }
      break;
  }

  if (cell.disolve) {
    if (
      Math.random() > 0.995 &&
      Utils.countNeighbors(i, j, Game.pixelGrid, cell.disolve) >= 2
    ) {
      Game.createCell(i, j, cell.disolveInto);
      return;
    }
  }

  if (
    (cellBelow === CellType.empty || cellBelow.state === CellType.states.gas) &&
    Math.random() >= 1 / (cell.density * 100)
  ) {
    Game.swapCells(i, j, i, j + 1);
  } else if (cellBelow.state === CellType.states.liquid) {
    // Sink in liquids
    if (
      Math.random() <=
      (cell.density - cellBelow.density) / cellBelow.density / 50
    ) {
      Game.swapCells(i, j, i, j + 1);
    }
  } else if (cellBelow.state === CellType.states.fire && Math.random() > 0.9) {
    if (Math.random() > cell.flammable) {
      Game.createCell(i, j, CellType.flame);
    } else {
      Game.swapCells(i, j, i, j + 1);
    }
  } else if (cell.granular) {
    // Fall sideways
    const direction = Math.random() >= 0.5 ? 1 : -1;
    if (!rollGrainSideways(cell, i, j, direction, canvasWidth)) {
      rollGrainSideways(cell, i, j, -direction, canvasWidth);
    }
  }
}

function rollGrainSideways(
  cell: CellType.Cell,
  i: number,
  j: number,
  direction: number,
  canvasWidth: number
) {
  if (i + direction >= 0 && i + direction < canvasWidth) {
    const otherCell = Game.pixelGrid[i + direction][j + 1];
    if (otherCell === CellType.empty && Math.random() > 0.2) {
      // Roll down
      Game.swapCells(i, j, i + direction, j + 1);
      return true;
    } else if (
      otherCell.state === CellType.states.fire &&
      Math.random() > 0.9
    ) {
      if (Math.random() > cell.flammable) {
        Game.createCell(i, j, CellType.flame);
      } else {
        Game.swapCells(i, j, i + direction, j + 1);
      }
      return true;
    } else if (
      otherCell.state === CellType.states.liquid &&
      Math.random() > 0.9
    ) {
      // Swirl in liquid
      Game.swapCells(i, j, i + direction, j + 1);
      return true;
    }
  }
  return false;
}

function processStatic(
  cell: CellType.Cell,
  i: number,
  j: number,
  column: CellType.Cell[],
  canvasWidth: number,
  canvasHeight: number
) {
  switch (cell) {
    case CellType.plant:
      processPlant(cell, i, j, column, canvasWidth, canvasHeight);
      break;
    case CellType.ice:
      processIce(cell, i, j, column, canvasWidth);
      break;
  }
}

function processPlant(
  cell: CellType.Cell,
  i: number,
  j: number,
  column: CellType.Cell[],
  canvasWidth: number,
  canvasHeight: number
) {
  const cellBelow = column[j + 1];
  // Propagate
  if (Utils.countNeighbors(i, j, Game.pixelGrid, CellType.ice) >= 2) {
    return;
  }
  const direction = Math.floor(Math.random() * 4);
  switch (direction) {
    case 0:
      if (
        j > 0 &&
        (column[j - 1] === CellType.water ||
          (column[j - 1] === CellType.soil &&
            Utils.countNeighbors(i, j, Game.pixelGrid, CellType.plant) <= 3)) &&
        Math.random() > cell.propagation
      ) {
        Game.createCell(i, j - 1, CellType.plant);
      }
      break;
    case 1:
      if (
        i < canvasWidth - 1 &&
        (Game.pixelGrid[i + 1][j] === CellType.water ||
          (Game.pixelGrid[i + 1][j] === CellType.soil &&
            Utils.countNeighbors(i, j, Game.pixelGrid, CellType.plant) <= 2)) &&
        Math.random() > cell.propagation
      ) {
        Game.createCell(i + 1, j, CellType.plant);
      }
      break;
    case 2:
      if (
        j < canvasHeight - 1 &&
        column[j + 1] === CellType.water &&
        Math.random() > cell.propagation
      ) {
        Game.createCell(i, j + 1, CellType.plant);
      }
      break;
    case 3:
      if (
        i > 0 &&
        (Game.pixelGrid[i - 1][j] === CellType.water ||
          (Game.pixelGrid[i - 1][j] === CellType.soil &&
            Utils.countNeighbors(i, j, Game.pixelGrid, CellType.plant) <= 2)) &&
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
    Utils.countNeighbors(i, j, Game.pixelGrid, CellType.plant) > 5
  ) {
    Game.createCell(i, j + 1, CellType.seed);
  }
}

function processIce(
  cell: CellType.Cell,
  i: number,
  j: number,
  column: CellType.Cell[],
  canvasWidth: number
) {
  const cellBelow = column[j + 1];
  // Propagate
  if (
    j > 0 &&
    Utils.countNeighbors(i, j, Game.pixelGrid, CellType.water) >= 2 &&
    Utils.countNeighbors(i, j, Game.pixelGrid, CellType.ice) <= 4
  ) {
    // TODO replace with for loop
    if (
      i > 0 &&
      Game.pixelGrid[i - 1][j - 1] === CellType.water &&
      Math.random() > cell.propagation
    ) {
      Game.createCell(i - 1, j - 1, CellType.ice);
    }
    if (
      i < canvasWidth - 1 &&
      Game.pixelGrid[i + 1][j - 1] === CellType.water &&
      Math.random() > cell.propagation
    ) {
      Game.createCell(i + 1, j - 1, CellType.ice);
    }
    if (column[j - 1] === CellType.water && Math.random() > cell.propagation) {
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
      Utils.countNeighbors(i, j, Game.pixelGrid, CellType.ice) < 6) ||
    Utils.testNeighbors(
      i,
      j,
      Game.pixelGrid,
      (c: CellType.Cell) => c.state === CellType.states.fire
    ) > 0
  ) {
    Game.createCell(i, j, cell.melt);
  }
}
