import * as Display from "./display.js";
import * as CellType from "./celltype.js";
import * as Utils from "./utils.js";
import * as Game from "./game.js";
import Brush from "./brush.js";

let maxLightDistance = 6;
let canvasWidth, canvasHeight;

const canvas = document.getElementById("game");

function nextState() {
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
        destroyCell(i, j);
        continue;
      }

      let cellBelow = Game.pixelGrid[i][j + 1];
      if (cell.state === CellType.states.gas) {
        // SMOKE
        if (Math.random() > cell.lifetime) {
          destroyCell(i, j);
        } else if (
          j > 0 &&
          Game.pixelGrid[i][j - 1].id === CellType.empty.id &&
          Math.random() > 0.7
        ) {
          // Go up
          swapCells(i, j, i, j - 1);
        } else {
          let coinFlip = Math.random() >= 0.5 ? 1 : -1;
          if (
            coinFlip &&
            j > 0 &&
            i + coinFlip >= 0 &&
            i + coinFlip < canvasWidth &&
            Game.pixelGrid[i + coinFlip][j - 1].id === CellType.empty.id &&
            Math.random() > 0.7
          ) {
            swapCells(i, j, i + coinFlip, j - 1);
          }
        }
      } else if (cell.state === CellType.states.fire) {
        // FIRE

        // Propagate
        let a = Math.floor(Math.random() * 3) - 1;
        let b = Math.floor(Math.random() * 3) - 1;
        if (
          i + a >= 0 &&
          i + a < canvasWidth &&
          j + b >= 0 &&
          j + b < canvasHeight
        ) {
          let target = Game.pixelGrid[i + a][j + b];

          if (target.flammable && Math.random() > target.flammable) {
            createCell(i + a, j + b, target.melt);
            if (
              j + b + 1 < canvasHeight - 1 &&
              target.ash &&
              Game.pixelGrid[i + a][j + b + 1].id === CellType.empty.id
            ) {
              createCell(i + a, j + b + 1, target.ash);
            }
          }
        }

        // Extinguish
        if (
          Utils.testNeighbors(i, j, Game.pixelGrid, (test) => test.dousing) >=
            2 ||
          (Math.random() > cell.lifetime &&
            !Utils.isFuelAround(i, j, Game.pixelGrid))
        ) {
          createCell(i, j, cell.nextCell);
        } else if (
          j > 0 &&
          Math.random() > 0.8 &&
          Game.pixelGrid[i][j - 1].id === CellType.empty.id
          // || Game.pixelGrid[i][j - 1].flammable
        ) {
          // TODO use melt
          // Evolve
          createCell(i, j - 1, Math.random() >= 0.5 ? cell.nextCell : cell);
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
                  let distance = Utils.getDistance(a, b, i, j);
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
                (Game.pixelGrid[i][j - 1] === CellType.water ||
                  (Game.pixelGrid[i][j - 1] === CellType.soil &&
                    Utils.countNeighbors(
                      i,
                      j,
                      Game.pixelGrid,
                      CellType.plant
                    ) <= 3)) &&
                Math.random() > cell.propagation
              ) {
                createCell(i, j - 1, CellType.plant);
              }
              break;
            case 1:
              if (
                i < canvasWidth - 1 &&
                (Game.pixelGrid[i + 1][j] === CellType.water ||
                  (Game.pixelGrid[i + 1][j] === CellType.soil &&
                    Utils.countNeighbors(
                      i,
                      j,
                      Game.pixelGrid,
                      CellType.plant
                    ) <= 2)) &&
                Math.random() > cell.propagation
              ) {
                createCell(i + 1, j, CellType.plant);
              }
              break;
            case 2:
              if (
                j < canvasHeight - 1 &&
                Game.pixelGrid[i][j + 1] === CellType.water &&
                Math.random() > cell.propagation
              ) {
                createCell(i, j + 1, CellType.plant);
              }
              break;
            case 3:
              if (
                i > 0 &&
                (Game.pixelGrid[i - 1][j] === CellType.water ||
                  (Game.pixelGrid[i - 1][j] === CellType.soil &&
                    Utils.countNeighbors(
                      i,
                      j,
                      Game.pixelGrid,
                      CellType.plant
                    ) <= 2)) &&
                Math.random() > cell.propagation
              ) {
                createCell(i - 1, j, CellType.plant);
              }
              break;
          }

          // Spawn seed
          if (
            cellBelow.id === CellType.empty.id &&
            Math.random() > 0.999 &&
            Utils.countNeighbors(i, j, Game.pixelGrid, CellType.plant) > 5
          ) {
            createCell(i, j + 1, CellType.seed);
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
              createCell(i - 1, j - 1, CellType.ice);
            }
            if (
              i < canvasWidth - 1 &&
              Game.pixelGrid[i + 1][j - 1] === CellType.water &&
              Math.random() > cell.propagation
            ) {
              createCell(i + 1, j - 1, CellType.ice);
            }
            if (
              Game.pixelGrid[i][j - 1] === CellType.water &&
              Math.random() > cell.propagation
            ) {
              createCell(i, j - 1, CellType.ice);
            }
          }

          // Drip
          if (cellBelow.id === CellType.empty.id && Math.random() > cell.drip) {
            createCell(i, j + 1, CellType.water);
          }
          // Melt
          if (
            (Math.random() > cell.lifetime &&
              Utils.countNeighbors(i, j, Game.pixelGrid, CellType.ice) < 6) ||
            Utils.testNeighbors(i, j, Game.pixelGrid, (c) =>
              [CellType.fire, CellType.fire2, CellType.fire3].includes(c)
            ) > 0
          ) {
            createCell(i, j, cell.melt);
          }
        }
      } else if (cell.state === CellType.states.solid) {
        // SOLIDS

        switch (cell.id) {
          case CellType.seed.id:
            if (
              Math.random() > 0.999 &&
              Utils.countNeighbors(i, j, Game.pixelGrid, CellType.soil) >= 3
            ) {
              createCell(i, j, CellType.plant);
              continue;
            }
            break;
          case CellType.salt.id:
            if (cellBelow.id === CellType.ice.id) {
              createCell(i, j, CellType.water);
              createCell(i, j + 1, CellType.water);
            }
            if (i > 0 && Game.pixelGrid[i - 1][j + 1] === CellType.ice) {
              createCell(i, j, CellType.water);
              createCell(i - 1, j + 1, CellType.water);
            }
            if (
              i < canvasWidth - 1 &&
              Game.pixelGrid[i + 1][j + 1] === CellType.ice
            ) {
              createCell(i, j, CellType.water);
              createCell(i + 1, j + 1, CellType.water);
            }
            break;
        }

        if (cellBelow.id === CellType.empty.id) {
          swapCells(i, j, i, j + 1);
        } else if (
          cellBelow.state === CellType.states.fire &&
          Math.random() > 0.9
        ) {
          if (Math.random() > cell.flammable) {
            createCell(i, j, CellType.fire);
          } else {
            swapCells(i, j, i, j + 1);
          }
        } else if (
          j < canvasHeight - 2 &&
          cellBelow.state === CellType.states.liquid &&
          // TODO what is that?
          (!cell.granular ||
            Game.pixelGrid[i][j + 2].state === CellType.states.liquid)
        ) {
          // Sink in liquids
          if (
            Math.random() <=
            (cell.density - cellBelow.density) / cellBelow.density / 100
          ) {
            swapCells(i, j, i, j + 1);
          }
        } else if (cell.granular) {
          let coinToss = Math.random() >= 0.5 ? 1 : -1;
          if (i + coinToss >= 0 && i + coinToss < canvasWidth) {
            if (Game.pixelGrid[i + coinToss][j + 1].id === CellType.empty.id) {
              // Roll down
              swapCells(i, j, i + coinToss, j + 1);
            } else if (
              Game.pixelGrid[i + coinToss][j + 1].state ===
                CellType.states.fire &&
              Math.random() > 0.9
            ) {
              if (Math.random() > cell.flammable) {
                createCell(i, j, CellType.fire);
              } else {
                swapCells(i, j, i + coinToss, j + 1);
              }
            } else if (
              Game.pixelGrid[i + coinToss][j + 1].state ===
                CellType.states.liquid &&
              Math.random() > 0.95
            ) {
              // Swirl in liquid
              swapCells(i, j, i + coinToss, j + 1);
            }
          }
        }
      } else if (cell.state === CellType.states.liquid) {
        // LIQUIDS
        if (cellBelow.id === CellType.empty.id) {
          // Move down
          swapCells(i, j, i, j + 1);
        } else if (
          cellBelow.id !== cell.id &&
          cellBelow.state === CellType.states.liquid
        ) {
          if (
            Math.random() <=
            (cell.density - cellBelow.density) / cellBelow.density / 5
          ) {
            swapCells(i, j, i, j + 1);
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
              swapCells(i, j, i - 1, j);
            }
          } else {
            if (
              i < canvasWidth - 1 &&
              Game.pixelGrid[i + 1][j] != cell &&
              Game.pixelGrid[i + 1][j].state !== CellType.states.solid
            ) {
              // Move right
              swapCells(i, j, i + 1, j);
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
      createCell(Math.floor((3 * canvasWidth) / 4) + i, 0, CellType.water);
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      createCell(Math.floor(canvasWidth / 4) + i, 0, CellType.oil);
    }
  }
}

function swapCells(x1, y1, x2, y2) {
  let destinationCell = Game.pixelGrid[x2][y2];
  let originCell = Game.pixelGrid[x1][y1];
  Game.pixelGrid[x1][y1] = destinationCell;
  Game.pixelGrid[x2][y2] = originCell;
  Game.delta[x1][y1] = destinationCell;
  Game.delta[x2][y2] = originCell;
}

function destroyCell(x, y) {
  Game.pixelGrid[x][y] = CellType.empty;
  Game.delta[x][y] = CellType.empty;
}

function createCell(x, y, cellType) {
  Game.pixelGrid[x][y] = cellType;
  Game.delta[x][y] = cellType;
}

const interval = 16.667;
let timer = 0;
let lastTime = 0;
let requestDrawFull = false;
let skipFrames = false;
let dynamicLights = false;

let lightMap;
let play = true;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  timer += deltaTime;

  if (timer > interval) {
    if (play) {
      if (dynamicLights) {
        Utils.wipeMatrix(lightMap, 0);
      }
      nextState();
    }

    if (!skipFrames || timer <= 2 * interval) {
      if (requestDrawFull) {
        Display.drawFull(Game.pixelGrid, lightMap);
        requestDrawFull = false;
      } else {
        Display.drawPartial(
          Game.delta,
          Game.pixelGrid,
          lightMap,
          dynamicLights
        );
      }
    }
    Utils.wipeMatrix(Game.delta, null);
    timer = timer % interval;
  }
  requestAnimationFrame(update);
}

let mainBrush;
function init() {
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

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

  let togglePlay = () => {
    play = !play;
    if (play) {
      playPauseButton.classList.add("btn-outline-primary");
      playPauseButton.classList.remove("btn-outline-danger");
    } else {
      playPauseButton.classList.remove("btn-outline-primary");
      playPauseButton.classList.add("btn-outline-danger");
    }
  };

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
    } else if (e.key === " ") {
      togglePlay();
    }
  });

  const playPauseButton = document.getElementById("play-pause");
  playPauseButton.addEventListener("click", togglePlay);

  let lightsCheck = document.getElementById("dynamic-lights");
  lightsCheck.addEventListener("click", (e) => {
    dynamicLights = e.target.checked;
  });
  lightsCheck.checked = dynamicLights;
}

init();
update();
