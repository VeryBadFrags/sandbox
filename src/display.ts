import * as CellType from "./type/Cell";
import * as Game from "./game";
import { get1DIndex } from "./utils/arrayHelper";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const context = canvas.getContext("2d", { alpha: false });

let imagedata = context.createImageData(canvas.width, canvas.height);

export function drawFull(lightMap?: number[][]) {
  // Reset imageData
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  imagedata = context.createImageData(canvasWidth, canvasHeight);

  const ratioX = Game.getWidth() / canvasWidth;
  const ratioY = Game.getHeight() / canvasHeight;

  for (let x = 0; x < canvasWidth; x++) {
    const gameX = Math.min(Math.round(x * ratioX), Game.getWidth() - 1);
    for (let y = 0; y < canvasHeight; y++) {
      const gameY = Math.min(Math.round(y * ratioY), Game.getHeight() - 1);
      const cell = Game.getCell(gameX, gameY);
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

export function drawPartial() {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const ratioX = canvasWidth / Game.getWidth();
  const ratioY = canvasHeight / Game.getHeight();

  Game.getDeltaBoard()
    .filter((cell) => cell.cell)
    .forEach((gameCell) => {
      const cell = gameCell.cell;
      for (let a = 0; a < Math.floor(ratioX); a++) {
        for (let b = 0; b < Math.floor(ratioY); b++) {
          const imageX = (gameCell.x * ratioX + a) * 4;
          const imageY = (gameCell.y * ratioY + b) * 4;
          const pixelIndex = get1DIndex(imageX, imageY, canvasWidth);

          imagedata.data[pixelIndex] = cell.rgb[0]; // Red
          imagedata.data[pixelIndex + 1] = cell.rgb[1]; // Green
          imagedata.data[pixelIndex + 2] = cell.rgb[2]; // Blue
          imagedata.data[pixelIndex + 3] = 255; // Alpha
        }
      }
    });

  context.putImageData(imagedata, 0, 0);
}

export function drawPartialDynamic(lightMap: number[][]) {
  const gameWidth = Game.getWidth();
  const gameHeight = Game.getHeight();
  for (let i = 0; i < gameWidth; i++) {
    for (let j = 0; j < gameHeight; j++) {
      let cell = Game.getDeltaCell(i, j);
      if (cell) {
        context.fillStyle = getHexColor(cell, lightMap ? lightMap[i][j] : 0);
        context.fillRect(i, j, 1, 1);
      } else if (lightMap && lightMap[i][j] > 0) {
        cell = Game.getCell(i, j);
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
