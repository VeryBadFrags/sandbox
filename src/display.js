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
    let column = gameState[i];
    for (let j = 0; j < gameHeight; j++) {
      let cell = column[j];
      if (cell !== CellType.empty) {
        context.fillStyle = getHexColor(cell, lightMap ? lightMap[i][j] : 0);
        context.fillRect(i, j, 1, 1);
      }
    }
  }
}

export function drawPartial(deltaBoard, fullBoard, lightMap, dynamicLight) {
  let gameWidth = deltaBoard.length;
  let gameHeight = deltaBoard[0].length;
  // Test dynamicLight first for performances
  if (dynamicLight) {
    for (let i = 0; i < gameWidth; i++) {
      let column = deltaBoard[i];
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
  } else {
    for (let i = 0; i < gameWidth; i++) {
      let column = deltaBoard[i];
      for (let j = 0; j < gameHeight; j++) {
        let cell = column[j];
        if (cell) {
          context.fillStyle = cell.color;
          context.fillRect(i, j, 1, 1);
        }
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
