import * as Display from "./display.js";
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
  let updated = initArray();

  let leftToRight = Math.random() >= 0.5;
  let iStart = leftToRight ? 0 : pixelGrid.length - 1;
  let iEnd = (i) => (leftToRight ? i < pixelGrid.length : i >= 0);

  for (let i = iStart; iEnd(i); leftToRight ? i++ : i--) {
    for (let j = pixelGrid[i].length - 1; j >= 0; j--) {
      let cell = pixelGrid[i][j];

      // SAND
      if (cell === CellType.sand) {
        if (j < canvasHeight - 1) {
          if (pixelGrid[i][j + 1] === CellType.empty) {
            swapCells(CellType.empty, i, j, cell, i, j + 1, updated);
          } else {
            // Sink in water
            if (
              j < canvasHeight - 2 &&
              pixelGrid[i][j + 1] === CellType.water &&
              pixelGrid[i][j + 2] === CellType.water
            ) {
              if (Math.random() > 0.93) {
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
          swapCells(CellType.empty, i, j, cell, i, j + 1, updated);
        }
      } else if (cell === CellType.floor) {
        // Do nothing for floor
      }
    }
  }

  // Tap
  if (Math.random() > 0.7) {
    pixelGrid[canvasWidth / 2][0] = CellType.water;
  }
  if (Math.random() > 0.7) {
    pixelGrid[canvasWidth / 2 - 1][0] = CellType.water;
  }
  if (Math.random() > 0.7) {
    pixelGrid[canvasWidth / 2 + 1][0] = CellType.water;
  }
}

function swapCells(cellType1, x1, y1, cellType2, x2, y2, updatedArray) {
  pixelGrid[x1][y1] = cellType1;
  pixelGrid[x2][y2] = cellType2;
  updatedArray[x1][y1] = cellType1;
  updatedArray[x2][y2] = cellType2;
}

const interval = 16.667;
let timer = 0;
let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  timer += deltaTime;

  if (timer > interval) {
    nextState();
    Display.draw(pixelGrid);
    timer = timer % interval;
  }
  requestAnimationFrame(update);
}

var intervalId;
const canvas = document.getElementById("game");
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", function () {
  isMouseDown = false;
  clearInterval(intervalId);
});
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mouseout", function () {
  isMouseDown = false;
  clearInterval(intervalId);
});

let brushSize = 5;
let brushType = CellType.sand;
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
      let density = brushType == CellType.floor ? 1 : 0.1;
      if (Math.random() <= density) {
        pixelGrid[i][j] = brushType;
      }
    }
  }
  pixelGrid[x][y] = brushType;
};

let isMouseDown = false;
function onMouseDown() {
  isMouseDown = true;
  spawnSand(mouseX, mouseY);
  intervalId = setInterval(
    function () {
      spawnSand(mouseX, mouseY);
    },
    brushType === CellType.floor ? 1 : 20
  );
}

var mouseX = 0,
  mouseY = 0;
function onMouseMove(e) {
  if (e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  } else if (e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
  }

  if (isMouseDown) {
    spawnSand(mouseX, mouseY);
  }
}

const brushTypeSelector = document.getElementById("brush-type");
brushTypeSelector.addEventListener("change", function (e) {
  brushType = CellType.CellsMap[e.target.options[e.target.selectedIndex].value];
});
brushTypeSelector.value = "sand";

const brushSizeSelector = document.getElementById("brush-size");
brushSizeSelector.addEventListener("change", function (e) {
  brushSize = parseInt(e.target.value, 10);
});
brushSizeSelector.value = brushSize;

function init() {
  pixelGrid = initArray();

  for (let i = canvasWidth / 2 - 50; i < canvasWidth / 2 - 2; i++) {
    pixelGrid[i][200] = CellType.floor;
  }

  for (let i = canvasWidth / 2 + 3; i < canvasWidth / 2 + 50; i++) {
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
