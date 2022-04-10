import * as Utils from "./utils.js";
import * as CellType from "./celltype.js";
const canvas = document.getElementById("game") as HTMLCanvasElement;

export const pixelGrid = Utils.initArray(
  canvas.width,
  canvas.height,
  CellType.empty
);
export const delta = Utils.initArray(canvas.width, canvas.height, null);

const maxLightDistance = 6;

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
  // Douse
  if (
    Utils.testNeighbors(
      i,
      j,
      pixelGrid,
      (test: CellType.Cell) => test.dousing,
      (current: CellType.Cell, x: number, y: number) =>
        current.melt && Math.random() > 0.5 ? createCell(x, y, current.melt) : null
    ) > 0
  ) {
    const lastCell = cell.nextCell.state === CellType.states.fire ? cell.nextCell.nextCell : cell.nextCell;
    createCell(i,j, lastCell);
    return;
  }

  // Extinguish
  if (
    Math.random() > cell.lifetime &&
    Utils.testNeighbors(
      i,
      j,
      pixelGrid,
      (test: CellType.Cell) => test.flammable > 0
    ) < 1
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

  propagateFire(i, canvasWidth, j, canvasHeight);

  // TODO move outside of this function
  updateFireLightMap(
    dynamicLights,
    column,
    j,
    i,
    canvasWidth,
    canvasHeight,
    lightMap
  );
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
        if (
          (a !== i || b !== j) &&
          pixelGrid[a][b].state !== CellType.states.fire
        ) {
          const distance = Utils.getDistance(a, b, i, j);
          lightMap[a][b] =
            lightMap[a][b] + Math.max(0, maxLightDistance - distance);
        }
      }
    }
  }
}

function propagateFire(
  i: number,
  canvasWidth: number,
  j: number,
  canvasHeight: number
) {
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
