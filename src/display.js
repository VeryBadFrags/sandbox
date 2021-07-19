import * as CellType from "./celltype.js";

const canvas = document.getElementById("game");
console.log(canvas);

const context = canvas.getContext("2d");

export function draw(gameState) {
  // reset the grid
  //context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = CellType.empty.color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  gameState.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell !== CellType.empty) {
        context.fillStyle = cell.color;
        context.fillRect(i, j, 1, 1);
      }
    })
  );
}
