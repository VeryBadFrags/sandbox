import * as Display from "./display.js";
import * as CellType from "./celltype.js";
import * as Utils from "./utils.js";
import * as Game from "./game.js";
import Brush from "./brush.js";

let maxLightDistance = 6;
let canvasWidth, canvasHeight;

const canvas = document.getElementById("game");

let delta;
function nextState() {
  Utils.wipeMatrix(delta, null);

  let leftToRight = Math.random() >= 0.5;
  let iStart = leftToRight ? 0 : canvasWidth - 1;
  let iEnd = (i) => (leftToRight ? i < canvasWidth : i >= 0);

  for (let i = iStart; iEnd(i); leftToRight ? i++ : i--) {
    for (let j = canvasHeight - 1; j >= 0; j--) {
      let cell = Game.pixelGrid[i][j];
      if (cell.id === CellType.empty.id || cell.id === CellType.floor.id) {
        continue;
      }

      if (j === canvasHeight - 1) {
        destroyCell(i, j, delta);
        continue;
      }

      let cellBelow = Game.pixelGrid[i][j + 1];
      if (cell.state === CellType.states.gas) {
        // SMOKE
        if (Math.random() > cell.lifetime) {
          destroyCell(i, j, delta);
        } else if (
          j > 0 &&
          Game.pixelGrid[i][j - 1] === CellType.empty &&
          Math.random() > 0.7
        ) {
          // Go up
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
            i < canvasWidth - 1 &&
            Game.pixelGrid[i + 1][j - 1] === CellType.empty &&
            Math.random() > 0.7
          ) {
            swapCells(i, j, i + 1, j - 1, delta);
          }
        }
      } else if (cell.state === CellType.states.fire) {
        // FIRE

        // Propagate
        for (
          let a = Math.max(i - 1, 0);
          a <= Math.min(i + 1, canvasWidth - 1);
          a++
        ) {
          for (let b = j; b <= Math.min(j + 1, canvasHeight - 1); b++) {
            if (a === i && b === j) {
              continue;
            }
            let target = Game.pixelGrid[a][b];
            if (Math.random() > target.flammable) {
              if (a === i || b === j) {
                createCell(a, b, target.melt, delta);
                if(b + 1 < canvasHeight - 1 && target.ash && Game.pixelGrid[a][b+1] === CellType.empty) {
                  createCell(a, b+1, target.ash, delta);
                }
              } else if (Math.random() > 0.5) {
                // Corners
                createCell(a, b, target.melt, delta);
                if(b + 1 < canvasHeight - 1 && target.ash && Game.pixelGrid[a][b+1] === CellType.empty) {
                  createCell(a, b+1, target.ash, delta);
                }
              }
            }
          }
        }

        // Extinguish
        if (
          (i > 0 &&
            Game.pixelGrid[i - 1][j] === CellType.water &&
            Math.random() > 0.9) ||
          (i < canvasWidth - 1 &&
            Game.pixelGrid[i + 1][j] === CellType.water &&
            Math.random() > 0.9) ||
          (j > 0 && Game.pixelGrid[i][j - 1] === CellType.water) ||
          Utils.testNeighbors(i, j, Game.pixelGrid, (test) => test.dousing) >=
            2 ||
          (Math.random() > cell.lifetime &&
            !Utils.isFuelAround(i, j, Game.pixelGrid))
        ) {
          if (cell.id === CellType.fire3.id) {
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

        // Lightmap
        if (dynamicLights) {
          if (Game.pixelGrid[i][j].state === CellType.states.fire) {
            for (
              let a = Math.max(i - maxLightDistance, 0);
              a <= Math.min(i + maxLightDistance, canvasWidth - 1);
              a++
            ) {
              for (
                let b = Math.max(j - maxLightDistance, 0);
                b <= Math.min(j + maxLightDistance, canvasHeight - 1);
                b++
              ) {
                if (
                  (a !== i || b !== j) &&
                  Game.pixelGrid[a][b].state !== CellType.states.fire
                ) {
                  let distance = Math.sqrt(
                    Math.pow(Math.abs(a - i), 2) + Math.pow(Math.abs(b - j), 2)
                  );
                  lightMap[a][b] =
                    lightMap[a][b] + Math.max(0, maxLightDistance - distance);
                }
              }
            }
          }
        }
        //} else if (pixelGrid[x][y].state === CellType.states.liquid && Math.random() > 0.99) {
        //  lightMap[x][y] = lightMap[x][y] + 10;
      } else if (cell.static) {
        if (cell.id === CellType.plant.id) {
          // Propagate
          if (Utils.countNeighbors(i, j, Game.pixelGrid, CellType.ice) >= 2) {
            continue;
          }
          let direction = Math.floor(Math.random() * 4);
          switch (direction) {
            case 0:
              if (
                j > 0 &&
                (Game.pixelGrid[i][j - 1] === CellType.water || (Game.pixelGrid[i][j - 1] === CellType.soil && Utils.countNeighbors(i,j,Game.pixelGrid,CellType.plant) <= 3)) &&
                Math.random() > cell.propagation
              ) {
                createCell(i, j - 1, CellType.plant, delta);
              }
              break;
            case 1:
              if (
                i < canvasWidth - 1 &&
                (Game.pixelGrid[i + 1][j] === CellType.water || (Game.pixelGrid[i+1][j] === CellType.soil && Utils.countNeighbors(i,j,Game.pixelGrid,CellType.plant) <= 2)) &&
                Math.random() > cell.propagation
              ) {
                createCell(i + 1, j, CellType.plant, delta);
              }
              break;
            case 2:
              if (
                j < canvasHeight - 1 &&
                Game.pixelGrid[i][j + 1] === CellType.water &&
                Math.random() > cell.propagation
              ) {
                createCell(i, j + 1, CellType.plant, delta);
              }
              break;
            case 3:
              if (
                i > 0 &&
                (Game.pixelGrid[i - 1][j] === CellType.water || (Game.pixelGrid[i-1][j] === CellType.soil && Utils.countNeighbors(i,j,Game.pixelGrid,CellType.plant) <= 2)) &&
                Math.random() > cell.propagation
              ) {
                createCell(i - 1, j, CellType.plant, delta);
              }
              break;
          }

          // Spawn seed
          if (
            cellBelow.id === CellType.empty.id && Math.random() > 0.999 &&
            Utils.countNeighbors(i, j, Game.pixelGrid, CellType.plant) > 5
          ) {
            createCell(i, j + 1, CellType.seed, delta);
          }
        } else if (cell.id === CellType.ice.id) {
          // Propagate
          if (
            j > 0 &&
            Utils.countNeighbors(i, j, Game.pixelGrid, CellType.water) >= 2 &&
            Utils.countNeighbors(i, j, Game.pixelGrid, CellType.ice) <= 4
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
              i < canvasWidth - 1 &&
              Game.pixelGrid[i + 1][j - 1] === CellType.water &&
              Math.random() > cell.propagation
            ) {
              createCell(i + 1, j - 1, CellType.ice, delta);
            }
            if (
              Game.pixelGrid[i][j - 1] === CellType.water &&
              Math.random() > cell.propagation
            ) {
              createCell(i, j - 1, CellType.ice, delta);
            }
          }

          //Drip
          if (cellBelow .id === CellType.empty.id && Math.random() > cell.drip) {
            createCell(i, j + 1, CellType.water, delta);
          }
          //Melt
          if (
            (Math.random() > cell.lifetime &&
              Utils.countNeighbors(i, j, Game.pixelGrid, CellType.ice) < 6) ||
            Utils.testNeighbors(i, j, Game.pixelGrid, (c) => [
              CellType.fire,
              CellType.fire2,
              CellType.fire3,
            ].includes(c)) > 0
          ) {
            createCell(i, j, cell.melt, delta);
          }
        }
      } else if (cell.state === CellType.states.solid) {
        // SOLIDS

        // Seeds
        if(cell.id === CellType.seed.id) {
          if(Math.random() > 0.999 && Utils.countNeighbors(i, j, Game.pixelGrid, CellType.soil) >= 3) {
            createCell(i,j,CellType.plant,delta);
            continue;
          }
        } else if (cell.id === CellType.salt.id) {
          // Salt
          if (cellBelow.id === CellType.ice.id) {
            createCell(i, j, CellType.water, delta);
            createCell(i, j + 1, CellType.water, delta);
          }
          if (i > 0 && Game.pixelGrid[i - 1][j + 1] === CellType.ice) {
            createCell(i, j, CellType.water, delta);
            createCell(i - 1, j + 1, CellType.water, delta);
          }
          if (
            i < canvasWidth - 1 &&
            Game.pixelGrid[i + 1][j + 1] === CellType.ice
          ) {
            createCell(i, j, CellType.water, delta);
            createCell(i + 1, j + 1, CellType.water, delta);
          }
        }

        if (cellBelow.id === CellType.empty.id) {
          swapCells(i, j, i, j + 1, delta);
        } else if (
          j < canvasHeight - 2 &&
          cellBelow.state === CellType.states.liquid &&
          (!cell.granular || Game.pixelGrid[i][j + 2].state === CellType.states.liquid)
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
                Game.pixelGrid[i - 1][j + 1].state === CellType.states.liquid &&
                Math.random() > 0.95
              ) {
                swapCells(i, j, i - 1, j + 1, delta);
              }
            } else {
              // Bottom right
              if (
                i < canvasWidth - 1 &&
                Game.pixelGrid[i + 1][j + 1] === CellType.empty
              ) {
                swapCells(i, j, i + 1, j + 1, delta);
              } else if (
                i < canvasWidth - 1 &&
                Game.pixelGrid[i + 1][j + 1].state === CellType.states.liquid &&
                Math.random() > 0.95
              ) {
                swapCells(i, j, i + 1, j + 1, delta);
              }
            }
          }
        }
      } else if (cell.state === CellType.states.liquid) {
        // LIQUIDS
        if (cellBelow.id === CellType.empty.id) {
          // Move down
          swapCells(i, j, i, j + 1, delta);
        } else if (cellBelow.id !== cell.id && cellBelow.state === CellType.states.liquid) {
          if (
            Math.random() <=
            (cell.density - cellBelow.density) / cellBelow.density / 5
          ) {
            swapCells(i, j, i, j + 1, delta);
          }
        } else if (cellBelow.state !== CellType.states.solid) {
          // Move liquid around
          let coinToss = Math.random() >= 0.5;
          if (coinToss) {
            if (
              i > 0 &&
              Game.pixelGrid[i - 1][j] != cell &&
              Game.pixelGrid[i - 1][j].state !== CellType.states.solid
            ) {
              // Move left
              swapCells(i, j, i - 1, j, delta);
            }
          } else {
            if (
              i < canvasWidth - 1 &&
              Game.pixelGrid[i + 1][j] != cell &&
              Game.pixelGrid[i + 1][j].state !== CellType.states.solid
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
      Game.pixelGrid[Math.floor(canvasWidth / 2) + i][0] = CellType.sand;
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      createCell(
        Math.floor((3 * canvasWidth) / 4) + i,
        0,
        CellType.water,
        delta
      );
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      createCell(Math.floor(canvasWidth / 4) + i, 0, CellType.oil, delta);
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
let skipFrames = false;
let dynamicLights = false;

let lightMap;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  timer += deltaTime;

  if (timer > interval) {
    if (dynamicLights) {
      Utils.wipeMatrix(lightMap, 0);
    }
    nextState();

    if (!skipFrames || timer <= 2 * interval) {
      if (requestDrawFull) {
        Display.drawFull(Game.pixelGrid, lightMap);
        requestDrawFull = false;
      } else {
        Display.drawPartial(delta, Game.pixelGrid, lightMap, dynamicLights);
      }
    }
    timer = timer % interval;
  }
  requestAnimationFrame(update);
}

let mainBrush;
function init() {
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  delta = Utils.initArray(canvasWidth, canvasHeight, null);
  lightMap = Utils.initArray(canvasWidth, canvasHeight, 0);

  let halfScreen = Math.floor(canvasHeight / 2);
  for (let i = canvasWidth / 2 - 25; i < canvasWidth / 2 + 24; i++) {
    Game.pixelGrid[i][halfScreen] = CellType.floor;
  }

  for (let j = halfScreen; j >= halfScreen - 15; j--) {
    Game.pixelGrid[canvasWidth / 2 - 25][j] = CellType.floor;
    Game.pixelGrid[canvasWidth / 2 + 24][j] = CellType.floor;
  }

  Display.drawFull(Game.pixelGrid);

  mainBrush = new Brush(() => (requestDrawFull = true));
  mainBrush.init();

  document.addEventListener("keydown", (e) => {
    if (CellType.CellsKeys[e.key]) {
      mainBrush.setBrushType(CellType.CellsKeys[e.key]);
    } else if (e.key === "+" || e.key === "=") {
      mainBrush.increaseBrushSize(1);
    } else if (e.key === "-" || e.key === "_") {
      mainBrush.increaseBrushSize(-1);
    } else if (e.key === "{") {
      mainBrush.increaseOpacity(-10);
    } else if (e.key === "}") {
      mainBrush.increaseOpacity(10);
    }
  });

  let lightsCheck = document.getElementById("dynamic-lights");
  lightsCheck.addEventListener("click", (e) => {
    dynamicLights = e.target.checked;
  });
  lightsCheck.checked = dynamicLights;
}

init();
update();
