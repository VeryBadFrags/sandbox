import * as CellType from "./celltype.js";
import * as Utils from "./utils.js";

const canvas = document.getElementById("game");
const context = canvas.getContext("2d", { alpha: false });

export function drawFull(gameState, lightMap) {
  // reset the grid
  //context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = CellType.empty.color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameState[i].length; j++) {
      let cell = gameState[i][j];
      if (cell !== CellType.empty) {
        context.fillStyle = getHexColor(cell, lightMap ? lightMap[i][j] : 0);
        context.fillRect(i, j, 1, 1);
      }
    }
  }
}

export function drawPartial(gameState, pixelGrid, lightMap) {
  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameState[i].length; j++) {
      let cell = gameState[i][j];
      if (cell) {
        context.fillStyle = getHexColor(cell, lightMap ? lightMap[i][j] : 0);
        context.fillRect(i, j, 1, 1);
      } else if(lightMap[i][j] > 0) {
        cell = pixelGrid[i][j]
        context.fillStyle = getHexColor(cell, lightMap ? lightMap[i][j] : 0);
        context.fillRect(i, j, 1, 1);
      }
    }
  }
}

function getHexColor(cell, lightValue) {
  if (lightValue > 0) {
    let hsl = Utils.hexToHSL(cell.color);
    hsl[2] = Math.min(hsl[2] + Math.floor(lightValue * 0.3), 100);
    //hsl[0] = Math.floor(hsl[0] / lightValue); // move to red
    return Utils.hslToHex(hsl[0], hsl[1], hsl[2]);
  } else {
    return cell.color;
  }
}
