import * as Game from "./game";
import type { Cell } from "./types/cell.type";
import { get1DIndex, getCoordsFromIndex } from "./utils/arrayUtils";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const context = canvas.getContext("2d", {
  alpha: false,
}) as CanvasRenderingContext2D;

let imagedata = context.createImageData(canvas.width, canvas.height);

export function drawFull() {
  // lightMap?: number[][] TODO resume usage of Lightmap once performances are fixed
  // Reset imageData
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  imagedata = context.createImageData(canvasWidth, canvasHeight);

  const ratioX = Game.getGameWidth() / canvasWidth;
  const ratioY = Game.getGameHeight() / canvasHeight;

  for (let x = 0; x < canvasWidth; x++) {
    const gameX = Math.min(Math.round(x * ratioX), Game.getGameWidth() - 1);
    for (let y = 0; y < canvasHeight; y++) {
      const gameY = Math.min(Math.round(y * ratioY), Game.getGameHeight() - 1);
      const cell = Game.getCell(gameX, gameY);
      if (cell && cell.rgb) {
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
  const ratioX = canvasWidth / Game.getGameWidth();
  const ratioY = canvasHeight / Game.getGameHeight();

  Game.getDeltaBoard()
    // .filter((cell) => cell)
    .forEach((cell, index) => {
      if (cell && cell.rgb) {
        // needed to keep index correct
        const coords = getCoordsFromIndex(index, Game.getGameWidth());
        for (let a = 0; a < Math.floor(ratioX); a++) {
          for (let b = 0; b < Math.floor(ratioY); b++) {
            const imageX = (coords[0] * ratioX + a) * 4;
            const imageY = (coords[1] * ratioY + b) * 4;
            const pixelIndex = get1DIndex(imageX, imageY, canvasWidth);

            imagedata.data[pixelIndex] = cell.rgb[0]; // Red
            imagedata.data[pixelIndex + 1] = cell.rgb[1]; // Green
            imagedata.data[pixelIndex + 2] = cell.rgb[2]; // Blue
            imagedata.data[pixelIndex + 3] = 255; // Alpha
          }
        }
      }
    });

  context.putImageData(imagedata, 0, 0);
}

export function drawPartialDynamic(lightMap: number[][]) {
  const gameWidth = Game.getGameWidth();
  const gameHeight = Game.getGameHeight();
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

function getHexColor(cell: Cell, lightValue: number) {
  if (lightValue > 0) {
    const hsl = cell.hsl;
    if (hsl) {
      const newL = Math.min(hsl[2] + Math.floor(lightValue * 0.4), 100);
      return `hsl(${hsl[0]}, ${hsl[1]}%, ${newL}%)`;
    } else {
      return cell.color;
    }
  } else {
    return cell.color;
  }
}
