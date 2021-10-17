import * as Display from "./display.js";
import * as CellType from "./celltype.js";
import * as Utils from "./utils.js";
import * as Game from "./game.js";
import Brush from "./brush.js";

let canvasWidth: number, canvasHeight: number;

const canvas = document.getElementById("game") as HTMLCanvasElement;

const pascalsLaw = false;

function nextState() {
  const leftToRight = Math.random() >= 0.5;
  const iStart = leftToRight ? 0 : canvasWidth - 1;
  const iEnd = (i: number) => (leftToRight ? i < canvasWidth : i >= 0);

  for (let i = iStart; iEnd(i); leftToRight ? i++ : i--) {
    const column = Game.pixelGrid[i];
    for (let j = canvasHeight - 2; j >= 0; j--) {
      const cell = column[j];
      if (cell === CellType.empty) {
        continue;
      }

      switch (cell.state) {
        case CellType.states.solid:
          Game.processSolid(cell, i, j, column, canvasWidth, canvasHeight);
          break;
        case CellType.states.liquid:
          Game.processLiquid(cell, i, j, column, canvasWidth, pascalsLaw);
          break;
        case CellType.states.fire:
          Game.processFire(cell, i, j, column, canvasWidth, canvasHeight, lightMap, dynamicLights);
          break;
        case CellType.states.gas:
          Game.processGas(cell, i, j, column, canvasWidth);
          break;
      }
    }

    Game.destroyCell(i, canvasHeight - 1);
  }

  createTaps();
}

function createTaps() {
  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      Game.createCell(Math.floor(canvasWidth / 2) + i, 0, CellType.sand);
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      Game.createCell(Math.floor((3 * canvasWidth) / 4) + i, 0, CellType.water);
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      Game.createCell(Math.floor(canvasWidth / 4) + i, 0, CellType.oil);
    }
  }
}

const interval = 16.667;
let timer = 0;
let lastTime = 0;
let dynamicLights = false;

let lightMap: number[][];
let play = true;
const fpsVal = document.getElementById("fps-val");
const engineVal = document.getElementById("engine-val");
const renderVal = document.getElementById("render-val");
let fpsTimer = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  fpsTimer += deltaTime;

  timer += deltaTime;
  if (timer > interval) {
    const t0 = performance.now();
    if (play) {
      if (dynamicLights) {
        Utils.wipeMatrix(lightMap, 0);
      }
      nextState();
    }
    const t1 = performance.now();

    const renderStart = performance.now();
    if (dynamicLights) {
      Display.drawPartialDynamic(Game.delta, Game.pixelGrid, lightMap);
    } else {
      Display.drawPartial(Game.delta);
    }
    const renderEnd = performance.now();
    Utils.wipeMatrix(Game.delta, null);
    timer = timer % interval;

    if (fpsTimer > 1000) {
      fpsVal.innerText = Math.round(1000 / deltaTime).toString();
      engineVal.innerText = Math.round(t1 - t0).toString();
      renderVal.innerText = Math.round(renderEnd - renderStart).toString();
      fpsTimer = 0;
    }
  }

  requestAnimationFrame(update);
}

let mainBrush: Brush;
function init() {
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  lightMap = Utils.initArray(canvasWidth, canvasHeight, 0);

  // Walls
  const halfScreen = Math.floor(canvasHeight / 2);
  for (let i = Math.floor(canvasWidth / 2) - 25; i < Math.floor(canvasWidth / 2) + 24; i++) {
    Game.createCell(i, halfScreen, CellType.concrete);
  }

  for (let j = halfScreen; j >= halfScreen - 15; j--) {
    Game.createCell(Math.floor(canvasWidth / 2) - 25, j, CellType.concrete);
    Game.createCell(Math.floor(canvasWidth / 2 + 24), j, CellType.concrete);
  }

  Display.drawFull(Game.pixelGrid);

  // Brush
  mainBrush = new Brush();
  mainBrush.init();

  const togglePlay = () => {
    play = !play;
    if (play) {
      playPauseButton.classList.add("btn-outline-primary");
      playPauseButton.classList.remove("btn-outline-danger");
    } else {
      playPauseButton.classList.remove("btn-outline-primary");
      playPauseButton.classList.add("btn-outline-danger");
    }
  };

  const keyToCell = new Map<string, CellType.Cell>();
  CellType.CellsMap.filter((cell) => cell.key).forEach((cell) => {
    keyToCell.set(cell.key, cell);
  });

  document.addEventListener("keydown", (e) => {
    if (keyToCell.has(e.key)) {
      mainBrush.setBrushType(keyToCell.get(e.key));
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

  const eraseButton = document.getElementById("erase-button");
  eraseButton.addEventListener("click", () => {
    Utils.wipeMatrix(Game.pixelGrid, CellType.empty);
    Display.drawFull(Game.pixelGrid);
  });

  const lightsCheck = document.getElementById("dynamic-lights") as HTMLInputElement;
  lightsCheck.addEventListener("click", (e) => {
    dynamicLights = (<HTMLInputElement>e.target).checked;
    // TODO Full draw when turning off to clear light effects
  });
  lightsCheck.checked = dynamicLights;
}

init();
update();
