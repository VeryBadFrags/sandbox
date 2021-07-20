import * as Display from "./display.js";
import * as CellType from "./celltype.js";
import * as Utils from "./utils.js";

var canvasWidth = 800;
var canvasHeight = 600;
var pixelGrid;

function initArray(cell = CellType.empty) {
  let newArray = new Array(canvasWidth);
  for (let i = 0; i < newArray.length; i++) {
    newArray[i] = new Array(canvasHeight);
    for (let j = 0; j < newArray[i].length; j++) {
      newArray[i][j] = cell;
    }
  }
  return newArray;
}

function nextState() {
  let delta = initArray(null);

  let leftToRight = Math.random() >= 0.5;
  let iStart = leftToRight ? 0 : pixelGrid.length - 1;
  let iEnd = (i) => (leftToRight ? i < pixelGrid.length : i >= 0);

  for (let i = iStart; iEnd(i); leftToRight ? i++ : i--) {
    for (let j = pixelGrid[i].length - 1; j >= 0; j--) {
      let cell = pixelGrid[i][j];
      if (cell === CellType.empty || cell === CellType.floor) {
        continue;
      }

      if (j === canvasHeight - 1) {
        destroyCell(i, j, delta);
        continue;
      }

      let cellBelow = pixelGrid[i][j + 1];
      if (cell === CellType.smoke) {
        // SMOKE
        if (Math.random() > cell.lifetime) {
          destroyCell(i, j, delta);
        } else if (
          j > 0 &&
          pixelGrid[i][j - 1] === CellType.empty &&
          Math.random() > 0.7
        ) {
          swapCells(i, j, i, j - 1, delta);
        } else {
          // TODO investigate uneven distribution
          let coinFlip = Math.random() < 0.6;
          if (
            coinFlip &&
            j > 0 &&
            i > 0 &&
            pixelGrid[i - 1][j - 1] === CellType.empty &&
            Math.random() > 0.7
          ) {
            swapCells(i, j, i - 1, j - 1, delta);
          } else if (
            j > 0 &&
            i < canvasWidth - 1 &&
            pixelGrid[i + 1][j - 1] === CellType.empty &&
            Math.random() > 0.7
          ) {
            swapCells(i, j, i + 1, j - 1, delta);
          }
        }
      } else if (cell.state === "fire") {
        // FIRE

        // Propagate
        if (
          i > 0 &&
          pixelGrid[i - 1][j].melt &&
          Math.random() > pixelGrid[i - 1][j].flammable
        ) {
          createCell(i - 1, j, pixelGrid[i - 1][j].melt, delta);
        }
        if (
          i < canvasWidth - 1 &&
          pixelGrid[i + 1][j].melt &&
          Math.random() > pixelGrid[i + 1][j].flammable
        ) {
          createCell(i + 1, j, pixelGrid[i + 1][j].melt, delta);
        }
        // DOWN
        if (pixelGrid[i][j + 1].melt && Math.random() > pixelGrid[i][j + 1].flammable) {
          createCell(i, j + 1, pixelGrid[i][j + 1].melt, delta);
        }
        // UP
        if (
          j > 0 &&
          pixelGrid[i][j - 1].melt &&
          Math.random() > pixelGrid[i][j - 1].flammable * 1.1
        ) {
          createCell(i, j - 1, pixelGrid[i][j - 1].melt, delta);
        }

        // Extinguish
        if (
          (i > 0 &&
            pixelGrid[i - 1][j] === CellType.water &&
            Math.random() > 0.9) ||
          (i < canvasWidth - 1 &&
            pixelGrid[i + 1][j] === CellType.water &&
            Math.random() > 0.9) ||
          (Math.random() > cell.lifetime &&
            !Utils.isFuelAround(i, j, pixelGrid))
        ) {
          if (cell === CellType.fire3) {
            createCell(i, j, CellType.smoke, delta);
          } else {
            destroyCell(i, j, delta);
          }
        } else if (
          j > 0 &&
          Math.random() > 0.8 &&
          (pixelGrid[i][j - 1] === CellType.empty ||
            pixelGrid[i][j - 1].flammable)
        ) {
          // TODO use melt
          // Evolve
          createCell(
            i,
            j - 1,
            Math.random() > 0.5 ? cell.nextCell : cell,
            delta
          );
        }
      } else if (cell.static) {
        if (cell === CellType.plant) {
          let direction = Math.floor(Math.random() * 4);
          switch (direction) {
            case 0:
              if (
                j > 0 &&
                pixelGrid[i][j - 1] === CellType.water &&
                Math.random() > cell.propagation
              ) {
                createCell(i, j - 1, CellType.plant, delta);
              }
              break;
            case 1:
              if (
                i < canvasWidth - 1 &&
                pixelGrid[i + 1][j] === CellType.water &&
                Math.random() > cell.propagation
              ) {
                createCell(i + 1, j, CellType.plant, delta);
              }
              break;
            case 2:
              if (
                j < canvasHeight - 1 &&
                pixelGrid[i][j + 1] === CellType.water &&
                Math.random() > cell.propagation
              ) {
                createCell(i, j + 1, CellType.plant, delta);
              }
              break;
            case 3:
              if (
                i > 0 &&
                pixelGrid[i - 1][j] === CellType.water &&
                Math.random() > cell.propagation
              ) {
                createCell(i - 1, j, CellType.plant, delta);
              }
              break;
          }
        } else if (cell === CellType.ice) {
          if (j > 0 && pixelGrid[i][j-1] === CellType.water) {
            if (
              i > 0 &&
              pixelGrid[i - 1][j - 1] === CellType.water  &&
              Math.random() > cell.propagation
            ) {
              createCell(i - 1, j - 1, CellType.ice, delta);
            }
            if (
              i < canvasWidth - 1 &&
              pixelGrid[i + 1][j - 1] === CellType.water &&
              Math.random() > cell.propagation
            ) {
              createCell(i + 1, j - 1, CellType.ice, delta);
            }
          }

          //Drip
          if(cellBelow === CellType.empty && Math.random() > 0.9992) {
            createCell(i, j+1, CellType.water, delta);
          }
          //Melt
          if(Math.random() > 0.9993) {
            createCell(i, j, cell.melt, delta);
          }
        }
      } else if (cell.state === "solid") {
        // SOLIDS
        if (cellBelow === CellType.empty) {
          swapCells(i, j, i, j + 1, delta);
        } else if (
          j < canvasHeight - 2 &&
          cellBelow.state === "liquid" &&
          (!cell.granular || pixelGrid[i][j + 2].state === "liquid")
        ) {
          // Sink in liquids
          if (
            Math.random() <=
            (cell.density - cellBelow.density) / cellBelow.density / 100
          ) {
            swapCells(i, j, i, j + 1, delta);
          }
        } else {
          if (cell.granular) {
            // Roll down
            let coinToss = Math.random() >= 0.5;
            if (coinToss) {
              if (i > 0 && pixelGrid[i - 1][j + 1] === CellType.empty) {
                // Bottom left
                swapCells(i, j, i - 1, j + 1, delta);
              } else if (
                i > 0 &&
                pixelGrid[i - 1][j + 1].state === "liquid" &&
                Math.random() > 0.95
              ) {
                swapCells(i, j, i - 1, j + 1, delta);
              }
            } else {
              // Bottom right
              if (
                i < pixelGrid.length - 1 &&
                pixelGrid[i + 1][j + 1] === CellType.empty
              ) {
                swapCells(i, j, i + 1, j + 1, delta);
              } else if (
                i < pixelGrid.length - 1 &&
                pixelGrid[i + 1][j + 1].state === "liquid" &&
                Math.random() > 0.95
              ) {
                swapCells(i, j, i + 1, j + 1, delta);
              }
            }
          }
        }
      } else if (cell.state === "liquid") {
        // LIQUIDS
        if (cellBelow === CellType.empty) {
          // Move down
          swapCells(i, j, i, j + 1, delta);
        } else if (cellBelow !== cell && cellBelow.state === "liquid") {
          if (
            Math.random() <=
            (cell.density - cellBelow.density) / cellBelow.density / 5
          ) {
            swapCells(i, j, i, j + 1, delta);
          }
        } else if (cellBelow.state !== "solid") {
          // Move liquid around
          let coinToss = Math.random() >= 0.5;
          if (coinToss) {
            if (
              i > 0 &&
              pixelGrid[i - 1][j] != cell &&
              pixelGrid[i - 1][j].state !== "solid"
            ) {
              // Move left
              swapCells(i, j, i - 1, j, delta);
            }
          } else {
            if (
              i < pixelGrid.length - 1 &&
              pixelGrid[i + 1][j] != cell &&
              pixelGrid[i + 1][j].state !== "solid"
            ) {
              // Move right
              swapCells(i, j, i + 1, j, delta);
            }
          }
        }
      }
    }
  }

  // Tap
  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      pixelGrid[canvasWidth / 2 + i][0] = CellType.sand;
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      createCell(
        Math.floor((2 * canvasWidth) / 3) + i,
        0,
        CellType.water,
        delta
      );
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      createCell(Math.floor(canvasWidth / 3) + i, 0, CellType.oil, delta);
    }
  }

  return delta;
}

function swapCells(x1, y1, x2, y2, updatedArray) {
  let destinationCell = pixelGrid[x2][y2];
  let originCell = pixelGrid[x1][y1];
  pixelGrid[x1][y1] = destinationCell;
  pixelGrid[x2][y2] = originCell;
  updatedArray[x1][y1] = destinationCell;
  updatedArray[x2][y2] = originCell;
}

function destroyCell(x, y, updatedArray) {
  pixelGrid[x][y] = CellType.empty;
  updatedArray[x][y] = CellType.empty;
}

function createCell(x, y, cellType, updatedArray) {
  pixelGrid[x][y] = cellType;
  updatedArray[x][y] = cellType;
}

const interval = 16.667;
let timer = 0;
let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  timer += deltaTime;

  if (timer > interval) {
    let delta = nextState();
    if (requestDrawFull) {
      Display.drawFull(pixelGrid);
      requestDrawFull = false;
    } else {
      Display.drawPartial(delta);
    }
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

let brushSize = 4;
let brushOpacity = 10;
let brushType = CellType.sand;
var requestDrawFull = false;
const spawnSand = (x, y) => {
  let actualBrushSize = brushSize - 1;
  for (
    let i = Math.max(0, x - actualBrushSize);
    i < Math.min(x + actualBrushSize, canvasWidth);
    i++
  ) {
    for (
      let j = Math.max(0, y - actualBrushSize);
      j < Math.min(y + actualBrushSize, canvasHeight);
      j++
    ) {
      if (Math.random() <= brushOpacity / 100) {
        pixelGrid[i][j] = brushType;
      }
    }
  }
  if (
    brushSize > 0 &&
    x >= 0 &&
    x < canvasWidth &&
    y >= 0 &&
    y < canvasHeight
  ) {
    pixelGrid[x][y] = brushType;
  }
  requestDrawFull = true;
};

let brushOpacitySlider = document.getElementById("brush-opacity");
brushOpacitySlider.addEventListener("click", function (e) {
  brushOpacity = e.target.value;
});
brushOpacitySlider.value = brushOpacity;

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

  for (let i = canvasWidth / 2 - 25; i < canvasWidth / 2 + 24; i++) {
    pixelGrid[i][300] = CellType.floor;
  }

  for (let j = 300; j >= 285; j--) {
    pixelGrid[canvasWidth / 2 - 25][j] = CellType.floor;
  }

  for (let j = 300; j >= 285; j--) {
    pixelGrid[canvasWidth / 2 + 24][j] = CellType.floor;
  }

  Display.drawFull(pixelGrid);
}

init();
update();
