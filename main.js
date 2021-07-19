import * as Engine from "./engine.js";
import * as CellType from "./celltype.js";

var canvasWidth = 800;
var canvasHeight = 600;
var pixelGrid;

function initArray() {
  let newArray = new Array(canvasWidth);
  for (let i = 0; i < newArray.length; i++) {
    newArray[i] = new Array(canvasHeight);
    for (let j = 0; j < newArray[i].length; j++) {
      newArray[i][j] = CellType.empty;
    }
  }
  return newArray;
}

function nextState() {
  let change = false;

  let leftToRight = Math.random() >= 0.5;
  let iStart = leftToRight ? 0 : pixelGrid.length - 1;
  let iEnd = (i) => (leftToRight ? i < pixelGrid.length : i >= 0);

  for (let i = iStart; iEnd(i); leftToRight ? i++ : i--) {
    for (let j = pixelGrid[i].length - 1; j >= 0; j--) {
      let cell = pixelGrid[i][j];

      // SAND
      if (cell === CellType.sandPix) {
        if (j < canvasHeight - 1) {
          if (pixelGrid[i][j + 1] === CellType.empty) {
            pixelGrid[i][j] = CellType.empty;
            pixelGrid[i][j + 1] = cell;
          } else {
            // Sink in water
            if (
              j < canvasHeight - 2 &&
              pixelGrid[i][j + 1] === CellType.water &&
              pixelGrid[i][j + 2] === CellType.water
            ) {
              if (Math.random() > 0.93) {
                console.log("water swap");
                pixelGrid[i][j] = CellType.water;
                pixelGrid[i][j + 1] = cell;
                continue;
              }
            }
            let coinToss = Math.random() >= 0.5;
            if (coinToss) {
              if (i > 0 && pixelGrid[i - 1][j + 1] === CellType.empty) {
                // Bottom left
                pixelGrid[i][j] = CellType.empty;
                pixelGrid[i - 1][j + 1] = cell;
              } else if (
                i > 0 &&
                pixelGrid[i - 1][j + 1] === CellType.water &&
                Math.random() > 0.95
              ) {
                pixelGrid[i][j] = CellType.water;
                pixelGrid[i - 1][j + 1] = cell;
              }
            } else {
              // Bottom right
              if (
                i < pixelGrid.length - 1 &&
                pixelGrid[i + 1][j + 1] === CellType.empty
              ) {
                pixelGrid[i][j] = CellType.empty;
                pixelGrid[i + 1][j + 1] = cell;
              } else if (
                i < pixelGrid.length - 1 &&
                pixelGrid[i + 1][j + 1] === CellType.water &&
                Math.random() > 0.95
              ) {
                pixelGrid[i][j] = CellType.water;
                pixelGrid[i + 1][j + 1] = cell;
              }
            }
          }
        } else {
          pixelGrid[i][j] = CellType.empty;
        }
      // WATER
      } else if (cell === CellType.water) {
        if (j === canvasHeight - 1) {
          pixelGrid[i][j] = CellType.empty;
        } else if (pixelGrid[i][j + 1] === CellType.empty) {
          // Move down
          pixelGrid[i][j] = CellType.empty;
          pixelGrid[i][j + 1] = cell;
        } else {
          let coinToss = Math.random() >= 0.5;
          if (coinToss) {
            if (i > 0 && pixelGrid[i - 1][j] === CellType.empty) {
              // Move left
              pixelGrid[i][j] = CellType.empty;
              pixelGrid[i - 1][j] = cell;
            }
          } else {
            if (
              i < pixelGrid.length - 1 &&
              pixelGrid[i + 1][j] === CellType.empty
            ) {
              // Move right
              pixelGrid[i][j] = CellType.empty;
              pixelGrid[i + 1][j] = cell;
            }
          }
        }
      } else if (cell === CellType.crystals) {
        if (j < canvasHeight - 1 && pixelGrid[i][j + 1] === CellType.empty) {
          pixelGrid[i][j] = CellType.empty;
          pixelGrid[i][j + 1] = cell;
        }
      } else if (cell === CellType.floor) {
      }
    }
  }

  // Tap
  if (Math.random() > 0.7) {
    pixelGrid[canvasWidth / 2][0] = CellType.water;
  }
  if (Math.random() > 0.7) {
    pixelGrid[canvasWidth / 2 -1][0] = CellType.water;
  }
  if (Math.random() > 0.7) {
    pixelGrid[canvasWidth / 2 +1][0] = CellType.water;
  }
}

let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  nextState();

  Engine.draw(pixelGrid);
  requestAnimationFrame(update);
}

const canvas = document.getElementById("game");
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mouseout", function (event) {clearInterval(intervalId);});

let mouseX = 0,
  mouseY = 0;

var intervalId;

let brushSize = 5;
let brushType = CellType.sandPix;
const spawnSand = (x, y) => {
  for (
    let i = Math.max(0, x - brushSize);
    i < Math.min(x + brushSize, canvasWidth);
    i++
  ) {
    for (
      let j = Math.max(0, y - brushSize);
      j < Math.min(y + brushSize, canvasHeight);
      j++
    ) {
      if (Math.random() > 0.9) {
        pixelGrid[i][j] = brushType;
      }
    }
  }
  pixelGrid[x][y] = brushType;
};

function onMouseDown(event) {
  spawnSand(event.clientX, event.clientY);
  intervalId = setInterval(function () {
    spawnSand(mouseX, mouseY);
  }, 20);
}

function onMouseUp(event) {
  clearInterval(intervalId);
}

function onMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

function init() {
  pixelGrid = initArray();

  for (let i = canvasWidth /2 - 50; i < canvasWidth / 2 - 2; i++) {
    pixelGrid[i][200] = CellType.floor;
  }

  for (let i = canvasWidth / 2 + 3; i < canvasWidth /2 + 50; i++) {
    pixelGrid[i][200] = CellType.floor;
  }

  for (let i = canvasWidth / 2 - 150; i < canvasWidth / 2 + 150; i++) {
    pixelGrid[i][300] = CellType.floor;
  }

  for (let i = 0; i < canvasWidth / 2 - 5; i++) {
    pixelGrid[i][canvasHeight - 1] = CellType.floor;
  }

  for (let i = canvasWidth / 2 + 5; i < canvasWidth; i++) {
    pixelGrid[i][canvasHeight - 1] = CellType.floor;
  }
}

init();
update();
