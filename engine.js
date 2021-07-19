import * as Cells from "./cells.js";

const canvas = document.getElementById("game");
console.log(canvas);

const context = canvas.getContext("2d");

export function draw(gameState) {
  // reset the grid
  //context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = Cells.empty;
  context.fillRect(0, 0, canvas.width, canvas.height);

  gameState.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell !== Cells.empty) {
        context.fillStyle = cell;
        context.fillRect(i, j, 1, 1);
      }
    })
  );
}
