import * as CellType from "./celltype.js";
import * as Utils from "./utils.js";

const canvas = document.getElementById("game");
const context = canvas.getContext("2d", { alpha: false });

export function drawFull(gameState, lightMap) {
  // reset the grid
  //context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = CellType.empty.color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  let gameHeight = gameState[0].length;
  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameHeight; j++) {
      let cell = gameState[i][j];
      if (cell !== CellType.empty) {
        context.fillStyle = getHexColor(cell, lightMap ? lightMap[i][j] : 0);
        context.fillRect(i, j, 1, 1);
      }
    }
  }
}

export function drawPartial(gameState, pixelGrid, lightMap, dynamicLight) {
  let gameHeight = gameState[0].length;
  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameHeight; j++) {
      let cell = gameState[i][j];
      if (cell) {
        if (dynamicLight) {
          context.fillStyle = getHexColor(cell, lightMap ? lightMap[i][j] : 0);
        } else {
          context.fillStyle = cell.color;
        }
        context.fillRect(i, j, 1, 1);
      } else if (dynamicLight && lightMap && lightMap[i][j] > 0) {
        cell = pixelGrid[i][j];
        context.fillStyle = getHexColor(cell, lightMap[i][j]);
        context.fillRect(i, j, 1, 1);
      }
    }
  }
}

function getHexColor(cell, lightValue) {
  if (lightValue > 0) {
    let hsl = Utils.hexToHSL(cell.color);
    hsl[2] = Math.min(hsl[2] + Math.floor(lightValue * 0.4), 100);
    //hsl[0] = Math.floor(hsl[0] / lightValue); // move to red
    return Utils.hslToHex(hsl[0], hsl[1], hsl[2]);
  } else {
    return cell.color;
  }
}
