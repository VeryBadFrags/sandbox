import * as Engine from "./engine.js";
import * as Cells from "./cells.js";

const sandPix = "#c2b280";
const floor = "#aaa";

let pixelGrid = initArray();

var canvasWidth = 800;
var canvasHeight = 600;

function initArray() {
  let newArray = new Array(canvasWidth);
  for (let i = 0; i < newArray.length; i++) {
    newArray[i] = new Array(canvasHeight);
    for (let j = 0; j < newArray[i].length; j++) {
      newArray[i][j] = Cells.empty;
    }
  }
  return newArray;
}




function nextState() {
  let change = false;

  let newGrid = initArray();

  for (let i = 0; i < pixelGrid.length; i++) {
    for (let j = pixelGrid[i].length -1; j >= 0; j--) {
      let cell = pixelGrid[i][j];

      if (cell === sandPix) {
        if (j < canvasHeight - 1) {
          if (pixelGrid[i][j + 1] === Cells.empty) {
            newGrid[i][j + 1] = sandPix;
          } else {
            let coinToss = Math.random() > 0.5;
            if (coinToss && i > 0 && pixelGrid[i - 1][j + 1] === Cells.empty) {
                newGrid[i - 1][j + 1] = sandPix;
            } else if (i < pixelGrid.length -1 && pixelGrid[i + 1][j + 1] === Cells.empty) {
              newGrid[i + 1][j + 1] = sandPix;
            } else {
              // Could not move
              newGrid[i][j] = sandPix;
            }
          }
        } else {
          // Bottom of the screen
          newGrid[i][j] = sandPix;
        }
      }

    }
  }

  if (Math.random() > 0.7) {
    newGrid[400][0] = sandPix;
  }

  return newGrid;
}

let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  let newGrid = nextState();

  Engine.draw(newGrid);
  pixelGrid = newGrid;
  requestAnimationFrame(update);
}


const canvas = document.getElementById("game");
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mousemove", onMouseMove);
let mouseX = 0, mouseY = 0;

var intervalId;

let brushSize = 5;
const spawnSand = (x, y) => {
  for(let i = Math.max(0, x - brushSize); i < Math.min(x +brushSize, canvasWidth); i++ ) {
    for(let j = Math.max(0, y - brushSize); j < Math.min(y + brushSize, canvasHeight); j++) {
      if(Math.random() > 0.8) {
        pixelGrid[i][j] = sandPix;
      }
    }
  }
  pixelGrid[x][y] = sandPix;
};

function onMouseDown(event) {
  spawnSand(event.clientX, event.clientY);
  intervalId = setInterval(function () {spawnSand(mouseX, mouseY);}, 10);
}

function onMouseUp(event) {
  clearInterval(intervalId);
}

function onMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

update();
