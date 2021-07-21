import * as Display from "./display.js";
import * as CellType from "./celltype.js";
import * as Utils from "./utils.js";
import * as Game from "./game.js";
import Brush from "./brush.js";

const canvas = document.getElementById("game");

function nextState() {
  let delta = Utils.initArray(canvas.width, canvas.height, null);

  let leftToRight = Math.random() >= 0.5;
  let iStart = leftToRight ? 0 : Game.pixelGrid.length - 1;
  let iEnd = (i) => (leftToRight ? i < Game.pixelGrid.length : i >= 0);

  for (let i = iStart; iEnd(i); leftToRight ? i++ : i--) {
    for (let j = Game.pixelGrid[i].length - 1; j >= 0; j--) {
      let cell = Game.pixelGrid[i][j];
      if (cell === CellType.empty || cell === CellType.floor) {
        continue;
      }

      if (j === canvas.height - 1) {
        destroyCell(i, j, delta);
        continue;
      }

      let cellBelow = Game.pixelGrid[i][j + 1];
      if (cell === CellType.smoke) {
        // SMOKE
        if (Math.random() > cell.lifetime) {
          destroyCell(i, j, delta);
        } else if (
          j > 0 &&
          Game.pixelGrid[i][j - 1] === CellType.empty &&
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
            Game.pixelGrid[i - 1][j - 1] === CellType.empty &&
            Math.random() > 0.7
          ) {
            swapCells(i, j, i - 1, j - 1, delta);
          } else if (
            j > 0 &&
            i < canvas.width - 1 &&
            Game.pixelGrid[i + 1][j - 1] === CellType.empty &&
            Math.random() > 0.7
          ) {
            swapCells(i, j, i + 1, j - 1, delta);
          }
        }
      } else if (cell.state === "fire") {
        // FIRE

        // Propagate
        for (
          let a = Math.max(i - 1, 0);
          a <= Math.min(i + 1, Game.pixelGrid.length -1);
          a++
        ) {
          for (
            let b = j;
            b <= Math.min(j + 1, Game.pixelGrid[a].length -1);
            b++
          ) {
            if (a === i && b === j) {
              continue;
            }
            if (Math.random() > Game.pixelGrid[a][b].flammable) {
              if (a === i || b === j) {
                createCell(a, b, Game.pixelGrid[a][b].melt, delta);
              } else if (Math.random() > 0.5) {
                // Corners
                createCell(a, b, Game.pixelGrid[a][b].melt, delta);
              }
            }
          }
        }

        // Extinguish
        if (
          (i > 0 &&
            Game.pixelGrid[i - 1][j] === CellType.water &&
            Math.random() > 0.9) ||
          (i < canvas.width - 1 &&
            Game.pixelGrid[i + 1][j] === CellType.water &&
            Math.random() > 0.9) ||
          (j > 0 && Game.pixelGrid[i][j-1] === CellType.water) ||
          Utils.countNeighbors(i,j,Game.pixelGrid,(test) => test.dousing) >= 2 ||
          (Math.random() > cell.lifetime &&
            !Utils.isFuelAround(i, j, Game.pixelGrid))
        ) {
          if (cell === CellType.fire3) {
            createCell(i, j, CellType.smoke, delta);
          } else {
            destroyCell(i, j, delta);
          }
        } else if (
          j > 0 &&
          Math.random() > 0.8 &&
          (Game.pixelGrid[i][j - 1] === CellType.empty ||
            Game.pixelGrid[i][j - 1].flammable)
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
          if(Utils.countNeighbors(i,j,Game.pixelGrid,[CellType.ice])) {
            continue;
          }
          let direction = Math.floor(Math.random() * 4);
          switch (direction) {
            case 0:
              if (
                j > 0 &&
                Game.pixelGrid[i][j - 1] === CellType.water &&
                Math.random() > cell.propagation
              ) {
                createCell(i, j - 1, CellType.plant, delta);
              }
              break;
            case 1:
              if (
                i < canvas.width - 1 &&
                Game.pixelGrid[i + 1][j] === CellType.water &&
                Math.random() > cell.propagation
              ) {
                createCell(i + 1, j, CellType.plant, delta);
              }
              break;
            case 2:
              if (
                j < canvas.height - 1 &&
                Game.pixelGrid[i][j + 1] === CellType.water &&
                Math.random() > cell.propagation
              ) {
                createCell(i, j + 1, CellType.plant, delta);
              }
              break;
            case 3:
              if (
                i > 0 &&
                Game.pixelGrid[i - 1][j] === CellType.water &&
                Math.random() > cell.propagation
              ) {
                createCell(i - 1, j, CellType.plant, delta);
              }
              break;
          }
        } else if (cell === CellType.ice) {
          // Propagate
          if (
            j > 0 &&
            Utils.countNeighbors(i, j, Game.pixelGrid, [CellType.water]) >= 2 &&
            Utils.countNeighbors(i, j, Game.pixelGrid, [CellType.ice]) <= 4
          ) {
            // TODO replace with for loop
            if (
              i > 0 &&
              Game.pixelGrid[i - 1][j - 1] === CellType.water &&
              Math.random() > cell.propagation
            ) {
              createCell(i - 1, j - 1, CellType.ice, delta);
            }
            if (
              i < canvas.width - 1 &&
              Game.pixelGrid[i + 1][j - 1] === CellType.water &&
              Math.random() > cell.propagation
            ) {
              createCell(i + 1, j - 1, CellType.ice, delta);
            }
            if(Game.pixelGrid[i][j - 1] === CellType.water &&
              Math.random() > cell.propagation) {
                createCell(i, j - 1, CellType.ice, delta);
              }
          }

          //Drip
          if (cellBelow === CellType.empty && Math.random() > cell.drip) {
            createCell(i, j + 1, CellType.water, delta);
          }
          //Melt
          if (
            (Math.random() > cell.lifetime && Utils.countNeighbors(i,j,Game.pixelGrid,[CellType.ice]) < 6) ||
            Utils.countNeighbors(i, j, Game.pixelGrid, [
              CellType.fire,
              CellType.fire2,
              CellType.fire3,
            ]) > 0
          ) {
            createCell(i, j, cell.melt, delta);
          }
        }
      } else if (cell.state === "solid") {
        // SOLIDS
        if (cellBelow === CellType.empty) {
          swapCells(i, j, i, j + 1, delta);
        } else if (
          j < canvas.height - 2 &&
          cellBelow.state === "liquid" &&
          (!cell.granular || Game.pixelGrid[i][j + 2].state === "liquid")
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
              if (i > 0 && Game.pixelGrid[i - 1][j + 1] === CellType.empty) {
                // Bottom left
                swapCells(i, j, i - 1, j + 1, delta);
              } else if (
                i > 0 &&
                Game.pixelGrid[i - 1][j + 1].state === "liquid" &&
                Math.random() > 0.95
              ) {
                swapCells(i, j, i - 1, j + 1, delta);
              }
            } else {
              // Bottom right
              if (
                i < Game.pixelGrid.length - 1 &&
                Game.pixelGrid[i + 1][j + 1] === CellType.empty
              ) {
                swapCells(i, j, i + 1, j + 1, delta);
              } else if (
                i < Game.pixelGrid.length - 1 &&
                Game.pixelGrid[i + 1][j + 1].state === "liquid" &&
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
              Game.pixelGrid[i - 1][j] != cell &&
              Game.pixelGrid[i - 1][j].state !== "solid"
            ) {
              // Move left
              swapCells(i, j, i - 1, j, delta);
            }
          } else {
            if (
              i < Game.pixelGrid.length - 1 &&
              Game.pixelGrid[i + 1][j] != cell &&
              Game.pixelGrid[i + 1][j].state !== "solid"
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
      Game.pixelGrid[canvas.width / 2 + i][0] = CellType.sand;
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      createCell(
        Math.floor((3 * canvas.width) / 4) + i,
        0,
        CellType.water,
        delta
      );
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      createCell(Math.floor(canvas.width / 4) + i, 0, CellType.oil, delta);
    }
  }

  return delta;
}

function swapCells(x1, y1, x2, y2, updatedArray) {
  let destinationCell = Game.pixelGrid[x2][y2];
  let originCell = Game.pixelGrid[x1][y1];
  Game.pixelGrid[x1][y1] = destinationCell;
  Game.pixelGrid[x2][y2] = originCell;
  updatedArray[x1][y1] = destinationCell;
  updatedArray[x2][y2] = originCell;
}

function destroyCell(x, y, updatedArray) {
  Game.pixelGrid[x][y] = CellType.empty;
  updatedArray[x][y] = CellType.empty;
}

function createCell(x, y, cellType, updatedArray) {
  Game.pixelGrid[x][y] = cellType;
  updatedArray[x][y] = cellType;
}

const interval = 16.667;
let timer = 0;
let lastTime = 0;
let requestDrawFull = false;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  timer += deltaTime;

  if (timer > interval) {
    let delta = nextState();
    if (requestDrawFull) {
      Display.drawFull(Game.pixelGrid);
      requestDrawFull = false;
    } else {
      Display.drawPartial(delta);
    }
    timer = timer % interval;
  }
  requestAnimationFrame(update);
}

let mainBrush;
function init() {
  let halfScreen = Math.floor(canvas.height / 2);
  for (let i = canvas.width / 2 - 25; i < canvas.width / 2 + 24; i++) {
    Game.pixelGrid[i][halfScreen] = CellType.floor;
  }

  for (let j = halfScreen; j >= halfScreen - 15; j--) {
    Game.pixelGrid[canvas.width / 2 - 25][j] = CellType.floor;
    Game.pixelGrid[canvas.width / 2 + 24][j] = CellType.floor;
  }

  Display.drawFull(Game.pixelGrid);

  mainBrush = new Brush(() => requestDrawFull = true);
  mainBrush.init();

  document.addEventListener('keydown', (e) => {
    if(CellType.CellsKeys[e.key]) {
      mainBrush.setBrushType(CellType.CellsKeys[e.key]);
    } else if (e.key === '+' || e.key === '=') {
      mainBrush.increaseBrushSize(1);
    } else if (e.key === '-' || e.key === '_') {
      mainBrush.increaseBrushSize(-1);
    } else if (e.key === '{' || e.key === '[') {
      mainBrush.increaseOpacity(-10);
    } else if (e.key === '}' || e.key === ']') {
      mainBrush.increaseOpacity(10);
    }
  });
}

init();
update();
