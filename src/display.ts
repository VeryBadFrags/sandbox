import * as CellType from "./celltype";
import * as Game from "./game";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const context = canvas.getContext("2d", { alpha: false });

const gameWidth = Game.gameWidth;
const gameHeight = Game.gameHeight;

let imagedata = context.createImageData(canvas.width, canvas.height);

export function drawFull(gameState: CellType.Cell[][], lightMap?: number[][]) {
  // Reset imageData
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  imagedata = context.createImageData(canvasWidth, canvasHeight);

  const ratioX = gameWidth / canvasWidth;
  const ratioY = gameHeight / canvasHeight;

  for (let x = 0; x < canvasWidth; x++) {
    const gameX = Math.min(Math.ceil(x * ratioX), gameWidth - 1);
    const column = gameState[gameX];
    for (let y = 0; y < canvasHeight; y++) {
      const gameY = Math.min(Math.round(y * ratioY), gameHeight - 1);
      const cell = column[gameY];
      if (cell) {
        // TODO use lightmap to fix dynamic lights

        const pixelindex = (y * canvasWidth + x) * 4;
        imagedata.data[pixelindex] = cell.rgb[0]; // Red
        imagedata.data[pixelindex + 1] = cell.rgb[1]; // Green
        imagedata.data[pixelindex + 2] = cell.rgb[2]; // Blue
        imagedata.data[pixelindex + 3] = 255; // Alpha
      }
    }
  }

  context.putImageData(imagedata, 0, 0);
}

export function drawPartial(deltaBoard: CellType.Cell[][]) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const ratioX = gameWidth / canvasWidth;
  const ratioY = gameHeight / canvasHeight;

  for (let x = 0; x < canvasWidth; x++) {
    const gameX = Math.min(Math.round(x * ratioX), gameWidth - 1);
    const column = deltaBoard[gameX];
    for (let y = 0; y < canvasHeight; y++) {
      const gameY = Math.min(Math.round(y * ratioY), gameHeight - 1);
      const cell = column[gameY];
      if (cell) {
        const pixelindex = (y * canvasWidth + x) * 4;
        imagedata.data[pixelindex] = cell.rgb[0]; // Red
        imagedata.data[pixelindex + 1] = cell.rgb[1]; // Green
        imagedata.data[pixelindex + 2] = cell.rgb[2]; // Blue
        imagedata.data[pixelindex + 3] = 255; // Alpha
      }
    }
  }

  context.putImageData(imagedata, 0, 0);
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
