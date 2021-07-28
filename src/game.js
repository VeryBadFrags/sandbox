const canvas = document.getElementById("game");
import * as Utils from "./utils.js";
import * as CellType from "./celltype.js";

export const pixelGrid = Utils.initArray(canvas.width, canvas.height);
export const delta = Utils.initArray(canvas.width, canvas.height, null);

let maxLightDistance = 6;

export function processSolid(cell, i, j, column, canvasWidth, canvasHeight) {
  if (cell.static) {
    processStatic(cell, i, j, column, canvasWidth, canvasHeight);
    return;
  }

  let cellBelow = column[j + 1];

  switch (cell) {
    case CellType.seed:
      // Germinate
      if (
        Math.random() > 0.999 &&
        Utils.countNeighbors(i, j, pixelGrid, CellType.soil) >= 3
      ) {
        createCell(i, j, CellType.plant);
        return;
      }
      break;
    case CellType.salt:
      if (cellBelow === CellType.ice) {
        createCell(i, j, CellType.water);
        createCell(i, j + 1, CellType.water);
      }
      if (i - 1 >= 0 && pixelGrid[i - 1][j + 1] === CellType.ice) {
        createCell(i, j, CellType.water);
        createCell(i - 1, j + 1, CellType.water);
      }
      if (i + 1 < canvasWidth && pixelGrid[i + 1][j + 1] === CellType.ice) {
        createCell(i, j, CellType.water);
        createCell(i + 1, j + 1, CellType.water);
      }
      break;
  }

  if (cellBelow === CellType.empty) {
    swapCells(i, j, i, j + 1);
  } else if (cellBelow.state === CellType.states.liquid) {
    // Sink in liquids
    if (
      Math.random() <=
      (cell.density - cellBelow.density) / cellBelow.density / 100
    ) {
      swapCells(i, j, i, j + 1);
    }
  } else if (cellBelow.state === CellType.states.fire && Math.random() > 0.9) {
    if (Math.random() > cell.flammable) {
      createCell(i, j, CellType.fire);
    } else {
      swapCells(i, j, i, j + 1);
    }
  } else if (cell.granular) {
    // Fall sideways
    let direction = Math.random() >= 0.5 ? 1 : -1;
    if (!rollGrainSideways(cell, i, j, direction, canvasWidth)) {
      rollGrainSideways(cell, i, j, -direction, canvasWidth);
    }
  }
}

function rollGrainSideways(cell, i, j, direction, canvasWidth) {
  if (i + direction >= 0 && i + direction < canvasWidth) {
    let otherCell = pixelGrid[i + direction][j + 1];
    if (otherCell === CellType.empty && Math.random() > 0.2) {
      // Roll down
      swapCells(i, j, i + direction, j + 1);
      return true;
    } else if (
      otherCell.state === CellType.states.fire &&
      Math.random() > 0.9
    ) {
      if (Math.random() > cell.flammable) {
        createCell(i, j, CellType.fire);
      } else {
        swapCells(i, j, i + direction, j + 1);
      }
      return true;
    } else if (
      otherCell.state === CellType.states.liquid &&
      Math.random() > 0.95
    ) {
      // Swirl in liquid
      swapCells(i, j, i + direction, j + 1);
      return true;
    }
  }
  return false;
}

function processStatic(cell, i, j, column, canvasWidth, canvasHeight) {
  switch (cell) {
    case CellType.plant:
      processPlant(cell, i, j, column, canvasWidth, canvasHeight);
      break;
    case CellType.ice:
      processIce(cell, i, j, column, canvasWidth);
      break;
  }
}

function processPlant(cell, i, j, column, canvasWidth, canvasHeight) {
  let cellBelow = column[j + 1];
  // Propagate
  if (Utils.countNeighbors(i, j, pixelGrid, CellType.ice) >= 2) {
    return;
  }
  let direction = Math.floor(Math.random() * 4);
  switch (direction) {
    case 0:
      if (
        j > 0 &&
        (column[j - 1] === CellType.water ||
          (column[j - 1] === CellType.soil &&
            Utils.countNeighbors(i, j, pixelGrid, CellType.plant) <= 3)) &&
        Math.random() > cell.propagation
      ) {
        createCell(i, j - 1, CellType.plant);
      }
      break;
    case 1:
      if (
        i < canvasWidth - 1 &&
        (pixelGrid[i + 1][j] === CellType.water ||
          (pixelGrid[i + 1][j] === CellType.soil &&
            Utils.countNeighbors(i, j, pixelGrid, CellType.plant) <= 2)) &&
        Math.random() > cell.propagation
      ) {
        createCell(i + 1, j, CellType.plant);
      }
      break;
    case 2:
      if (
        j < canvasHeight - 1 &&
        column[j + 1] === CellType.water &&
        Math.random() > cell.propagation
      ) {
        createCell(i, j + 1, CellType.plant);
      }
      break;
    case 3:
      if (
        i > 0 &&
        (pixelGrid[i - 1][j] === CellType.water ||
          (pixelGrid[i - 1][j] === CellType.soil &&
            Utils.countNeighbors(i, j, pixelGrid, CellType.plant) <= 2)) &&
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
    Utils.countNeighbors(i, j, pixelGrid, CellType.plant) > 5
  ) {
    createCell(i, j + 1, CellType.seed);
  }
}

function processIce(cell, i, j, column, canvasWidth) {
  let cellBelow = column[j + 1];
  // Propagate
  if (
    j > 0 &&
    Utils.countNeighbors(i, j, pixelGrid, CellType.water) >= 2 &&
    Utils.countNeighbors(i, j, pixelGrid, CellType.ice) <= 4
  ) {
    // TODO replace with for loop
    if (
      i > 0 &&
      pixelGrid[i - 1][j - 1] === CellType.water &&
      Math.random() > cell.propagation
    ) {
      createCell(i - 1, j - 1, CellType.ice);
    }
    if (
      i < canvasWidth - 1 &&
      pixelGrid[i + 1][j - 1] === CellType.water &&
      Math.random() > cell.propagation
    ) {
      createCell(i + 1, j - 1, CellType.ice);
    }
    if (column[j - 1] === CellType.water && Math.random() > cell.propagation) {
      createCell(i, j - 1, CellType.ice);
    }
  }

  // Drip
  if (cellBelow === CellType.empty && Math.random() > cell.drip) {
    createCell(i, j + 1, CellType.water);
  }
  // Melt
  if (
    (Math.random() > cell.lifetime &&
      Utils.countNeighbors(i, j, pixelGrid, CellType.ice) < 6) ||
    Utils.testNeighbors(
      i,
      j,
      pixelGrid,
      (c) => c.state === CellType.states.fire
    ) > 0
  ) {
    createCell(i, j, cell.melt);
  }
}

export function processLiquid(
  cell,
  i,
  j,
  column,
  canvasWidth,
  canvasHeight,
  pascalsLaw
) {
  let cellBelow = column[j + 1];
  // LIQUIDS
  if (cellBelow === CellType.empty) {
    // Move down
    swapCells(i, j, i, j + 1);
  } else if (cellBelow.state === CellType.states.liquid) {
    if (
      cellBelow !== cell &&
      Math.random() <=
        (cell.density - cellBelow.density) / cellBelow.density / 5
    ) {
      swapCells(i, j, i, j + 1);
    } else if (
      pascalsLaw &&
      j - 1 >= 0 &&
      pixelGrid[i][j - 1] === CellType.empty &&
      i - 1 >= 0 &&
      pixelGrid[i - 1][j] === cell &&
      i + 1 < canvasWidth &&
      pixelGrid[i + 1][j] === cell
    ) {
      let higherCell = Utils.getHigherCell(cell, i, j, pixelGrid);
      if (higherCell) {
        swapCells(i, j - 1, higherCell[0], higherCell[1]);
      }
    } else {
      // Move liquid around
      let direction = Math.random() >= 0.5 ? 1 : -1;
      moveLiquidSideways(cell, i, j, direction, canvasWidth);
    }
  }
}

function moveLiquidSideways(cell, i, j, direction, canvasWidth) {
  if (i + direction >= 0 && i + direction < canvasWidth) {
    if (
      pixelGrid[i + direction][j + 1] === CellType.empty ||
      Math.random() >= 0.5
    ) {
      let nextCell = pixelGrid[i + direction][j];
      if (nextCell !== cell && nextCell.state !== CellType.states.solid) {
        swapCells(i, j, i + direction, j);
        return true;
      }
    }
  }
  return false;
}

export function processFire(
  cell,
  i,
  j,
  column,
  canvasWidth,
  canvasHeight,
  lightMap,
  dynamicLights
) {
  // Propagate
  let a = Math.floor(Math.random() * 3) - 1;
  let b = Math.floor(Math.random() * 3) - 1;
  if (i + a >= 0 && i + a < canvasWidth && j + b >= 0 && j + b < canvasHeight) {
    let target = pixelGrid[i + a][j + b];

    if (target.flammable && Math.random() > target.flammable) {
      createCell(i + a, j + b, target.melt);
      if (
        j + b + 1 < canvasHeight &&
        target.ash &&
        pixelGrid[i + a][j + b + 1] === CellType.empty
      ) {
        createCell(i + a, j + b + 1, target.ash);
      }
    }
  }

  // Extinguish
  if (
    (Math.random() > cell.lifetime && !Utils.isFuelAround(i, j, pixelGrid)) ||
    Utils.testNeighbors(i, j, pixelGrid, (test) => test.dousing) >= 2
  ) {
    createCell(i, j, cell.nextCell);
  } else if (
    j > 0 &&
    Math.random() > 0.8 &&
    column[j - 1] === CellType.empty
    // || column[j - 1].flammable
  ) {
    // Evolve
    createCell(i, j - 1, Math.random() >= 0.5 ? cell.nextCell : cell);
  }

  // Lightmap
  if (dynamicLights) {
    if (column[j].state === CellType.states.fire) {
      for (
        let a = Math.max(i - maxLightDistance, 0);
        a <= Math.min(i + maxLightDistance, canvasWidth - 1);
        a++
      ) {
        for (
          let b = Math.max(j - maxLightDistance, 0);
          b <= Math.min(j + maxLightDistance, canvasHeight - 1);
          b++
        ) {
          if (
            (a !== i || b !== j) &&
            pixelGrid[a][b].state !== CellType.states.fire
          ) {
            let distance = Utils.getDistance(a, b, i, j);
            lightMap[a][b] =
              lightMap[a][b] + Math.max(0, maxLightDistance - distance);
          }
        }
      }
    }
  }
  //} else if (pixelGrid[x][y].state === CellType.states.liquid && Math.random() > 0.99) {
  //  lightMap[x][y] = lightMap[x][y] + 10;
}

export function processGas(cell, i, j, column, canvasWidth) {
  // SMOKE
  if (Math.random() > cell.lifetime) {
    destroyCell(i, j);
  } else if (j > 0 && column[j - 1] === CellType.empty && Math.random() > 0.7) {
    // Go up
    swapCells(i, j, i, j - 1);
  } else {
    let coinFlip = Math.random() >= 0.5 ? 1 : -1;
    if (
      coinFlip &&
      j > 0 &&
      i + coinFlip >= 0 &&
      i + coinFlip < canvasWidth &&
      pixelGrid[i + coinFlip][j - 1] === CellType.empty &&
      Math.random() > 0.7
    ) {
      swapCells(i, j, i + coinFlip, j - 1);
    }
  }
}

export function createCell(x, y, cellType) {
  pixelGrid[x][y] = cellType;
  delta[x][y] = cellType;
}

export function swapCells(x1, y1, x2, y2) {
  let originCell = pixelGrid[x1][y1];
  let destinationCell = pixelGrid[x2][y2];

  pixelGrid[x1][y1] = destinationCell;
  pixelGrid[x2][y2] = originCell;
  delta[x1][y1] = destinationCell;
  delta[x2][y2] = originCell;
}

export function destroyCell(x, y) {
  pixelGrid[x][y] = CellType.empty;
  delta[x][y] = CellType.empty;
}
