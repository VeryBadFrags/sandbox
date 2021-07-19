import * as CellType from "./celltype.js";

const canvas = document.getElementById("game");
console.log(canvas);

const context = canvas.getContext("2d");

export function drawFull(gameState) {
  // reset the grid
  //context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = CellType.empty.color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameState[i].length; j++) {
      let cell = gameState[i][j];
      if (cell !== CellType.empty) {
        context.fillStyle = cell.color;
        context.fillRect(i, j, 1, 1);
      }
    }
  }
}

export function drawPartial(gameState) {
  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameState[i].length; j++) {
      let cell = gameState[i][j];
      if (cell) {
        context.fillStyle = cell.color;
        context.fillRect(i, j, 1, 1);
      }
    }
  }
}
