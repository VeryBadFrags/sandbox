const canvas = document.getElementById("game") as HTMLCanvasElement;
import * as Utils from "./utils.js";
import * as CellType from "./celltype.js";

export const pixelGrid = Utils.initArray(canvas.width, canvas.height, CellType.empty);
export const delta = Utils.initArray(canvas.width, canvas.height, null);

const maxLightDistance = 6;

export function processLiquid(
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
    swapCells(i, j, i, j + 1);
  } else if (cellBelow.state === CellType.states.liquid) {
    if (
      cellBelow !== cell &&
      Math.random() <= (cell.density - cellBelow.density) / cellBelow.density / 5
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
      const higherCell = Utils.getHigherCell(cell, i, j, pixelGrid);
      if (higherCell) {
        swapCells(i, j - 1, higherCell[0], higherCell[1]);
      }
    } else {
      // Move liquid around
      const direction = Math.random() >= 0.5 ? 1 : -1;
      if(!moveLiquidSideways(cell, i, j, direction, canvasWidth)){
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
    if (pixelGrid[i + direction][j + 1] === CellType.empty) {
      swapCells(i, j, i + direction, j + 1);
      return true;
    } else if (pixelGrid[i + direction][j] === CellType.empty && pixelGrid[i][j+1] !== CellType.states.solid) {
      swapCells(i, j, i + direction, j);
      return true;
    } else if (Math.random() >= 0.5) {
      // TODO use liquid thickness instead of 0.5
      const nextCell = pixelGrid[i + direction][j];
      if (nextCell !== cell && nextCell.state !== CellType.states.solid) {
        swapCells(i, j, i + direction, j);
        return true;
      }
    }
  }
  return false;
}

export function processFire(
  cell: CellType.Cell,
  i: number,
  j: number,
  column: CellType.Cell[],
  canvasWidth: number,
  canvasHeight: number,
  lightMap: number[][],
  dynamicLights: boolean
) {
  propagateFire(i, canvasWidth, j, canvasHeight);

  // Extinguish
  if (
    (Math.random() > cell.lifetime && !Utils.isFuelAround(i, j, pixelGrid)) ||
    Utils.testNeighbors(i, j, pixelGrid, (test: CellType.Cell) => test.dousing) >= 2
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

  updateFireLightMap(dynamicLights, column, j, i, canvasWidth, canvasHeight, lightMap);
}

function updateFireLightMap(
  dynamicLights: boolean,
  column: CellType.Cell[],
  j: number,
  i: number,
  canvasWidth: number,
  canvasHeight: number,
  lightMap: number[][]
) {
  if (dynamicLights && column[j].state === CellType.states.fire) {
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
        if ((a !== i || b !== j) && pixelGrid[a][b].state !== CellType.states.fire) {
          const distance = Utils.getDistance(a, b, i, j);
          lightMap[a][b] = lightMap[a][b] + Math.max(0, maxLightDistance - distance);
        }
      }
    }
  }
}

function propagateFire(i: number, canvasWidth: number, j: number, canvasHeight: number) {
  const a = Math.floor(Math.random() * 3) - 1;
  const b = Math.floor(Math.random() * 3) - 1;
  if (i + a >= 0 && i + a < canvasWidth && j + b >= 0 && j + b < canvasHeight) {
    const target = pixelGrid[i + a][j + b];

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
}

export function processGas(
  cell: CellType.Cell,
  i: number,
  j: number,
  column: CellType.Cell[],
  canvasWidth: number
) {
  // SMOKE
  if (Math.random() > cell.lifetime) {
    destroyCell(i, j);
  } else if (j > 0 && column[j - 1] === CellType.empty && Math.random() > 0.7) {
    // Go up
    swapCells(i, j, i, j - 1);
  } else {
    const coinFlip = Math.random() >= 0.5 ? 1 : -1;
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

export function createCell(x: number, y: number, cellType: CellType.Cell) {
  pixelGrid[x][y] = cellType;
  delta[x][y] = cellType;
}

export function swapCells(x1: number, y1: number, x2: number, y2: number) {
  const originCell = pixelGrid[x1][y1];
  const destinationCell = pixelGrid[x2][y2];

  pixelGrid[x1][y1] = destinationCell;
  pixelGrid[x2][y2] = originCell;
  delta[x1][y1] = destinationCell;
  delta[x2][y2] = originCell;
}

export function destroyCell(x: number, y: number) {
  pixelGrid[x][y] = CellType.empty;
  delta[x][y] = CellType.empty;
}
