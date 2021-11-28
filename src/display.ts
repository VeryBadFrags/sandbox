import * as CellType from "./celltype.js";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const context = canvas.getContext("2d", { alpha: false });

export function drawFull(gameState: CellType.Cell[][], lightMap?: number[][]) {
  // reset the grid
  //context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = CellType.empty.color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gameHeight = gameState[0].length;
  for (let i = 0; i < gameState.length; i++) {
    const column = gameState[i];
    for (let j = 0; j < gameHeight; j++) {
      const cell = column[j];
      if (cell !== CellType.empty) {
        context.fillStyle = getHexColor(cell, lightMap ? lightMap[i][j] : 0);
        context.fillRect(i, j, 1, 1);
      }
    }
  }
}

export function drawPartial(deltaBoard: CellType.Cell[][]) {
  const gameWidth = deltaBoard.length;
  const gameHeight = deltaBoard[0].length;
  for (let x = 0; x < gameWidth; x++) {
    const column = deltaBoard[x];
    for (let y = 0; y < gameHeight; y++) {
      const cell = column[y];
      if (cell) {
        context.fillStyle = cell.color;
        context.fillRect(x, y, 1, 1);
      }
    }
  }
}

export function drawPartialDynamic(
  deltaBoard: CellType.Cell[][],
  fullBoard: CellType.Cell[][],
  lightMap: number[][]
) {
  const gameWidth = deltaBoard.length;
  const gameHeight = deltaBoard[0].length;
  for (let i = 0; i < gameWidth; i++) {
    const column = deltaBoard[i];
    for (let j = 0; j < gameHeight; j++) {
      let cell = column[j];
      if (cell) {
        context.fillStyle = getHexColor(cell, lightMap ? lightMap[i][j] : 0);
        context.fillRect(i, j, 1, 1);
      } else if (lightMap && lightMap[i][j] > 0) {
        cell = fullBoard[i][j];
        context.fillStyle = getHexColor(cell, lightMap[i][j]);
        context.fillRect(i, j, 1, 1);
      }
    }
  }
}

function getHexColor(cell: CellType.Cell, lightValue: number) {
  if (lightValue > 0) {
    const hsl = cell.hsl;
    const newL = Math.min(hsl[2] + Math.floor(lightValue * 0.4), 100);
    return `hsl(${hsl[0]}, ${hsl[1]}%, ${newL}%)`;
  } else {
    return cell.color;
  }
}
