import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";

import * as CellType from "./celltype";
import * as Display from "./display";
import * as Game from "./game";
import * as Settings from "./settings";
import * as Fire from "./engine/fire";
import * as Liquid from "./engine/liquid";
import * as Solid from "./engine/solid";
import * as Gas from "./engine/gas";
import * as Utils from "./utils";
import * as ArrayHelper from "./utils/arrayHelper";
import Brush from "./brush";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const pascalsLaw = false;
const iStart = (ltr: boolean, size: number) => (ltr ? 0 : size - 1);
const iEnd = (i: number, ltr: boolean, size: number) =>
  ltr ? i < size : i >= 0;

let mainBrush: Brush;

const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

function nextState() {
  const leftToRight = Math.random() >= 0.5;

  for (
    let i = iStart(leftToRight, canvasWidth);
    iEnd(i, leftToRight, canvasWidth);
    leftToRight ? i++ : i--
  ) {
    for (let j = canvasHeight - 2; j >= 0; j--) {
      const cell = Game.getCell(i, j);
      if (cell === CellType.empty) {
        continue;
      }

      switch (cell.state) {
        case CellType.states.solid:
          Solid.process(cell, i, j, canvasWidth, canvasHeight);
          break;
        case CellType.states.liquid:
          Liquid.process(cell, i, j, canvasWidth, pascalsLaw);
          break;
        case CellType.states.fire:
          Fire.process(
            cell,
            i,
            j,
            canvasWidth,
            canvasHeight,
            lightMap,
            dynamicLights
          );
          break;
        case CellType.states.gas:
          Gas.process(cell, i, j, canvasWidth);
          break;
      }
    }

    // Destroy the last row
    Game.destroyCell(i, canvasHeight - 1);
  }

  // Spawn cells at the top
  createTaps();
}

let tap1 = CellType.oil;
let tap2 = CellType.sand;
let tap3 = CellType.water;

// Tap listeners
const tapSelect = document.getElementById("select-tap1") as HTMLSelectElement;
tapSelect.addEventListener("change", function (e) {
  tap1 = CellType.TapValues[(<HTMLSelectElement>e.target).selectedIndex];
});
const tap2Select = document.getElementById("select-tap2") as HTMLSelectElement;
tap2Select.addEventListener("change", function (e) {
  tap2 = CellType.TapValues[(<HTMLSelectElement>e.target).selectedIndex];
});
tap2Select.selectedIndex = 1;
const tap3Select = document.getElementById("select-tap3") as HTMLSelectElement;
tap3Select.addEventListener("change", function (e) {
  tap3 = CellType.TapValues[(<HTMLSelectElement>e.target).selectedIndex];
});
tap3Select.selectedIndex = 2;

function createTaps() {
  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      Game.createCell(Math.floor(canvasWidth / 4) + i, 0, tap1);
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      Game.createCell(Math.floor(canvasWidth / 2) + i, 0, tap2);
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      Game.createCell(Math.floor((3 * canvasWidth) / 4) + i, 0, tap3);
    }
  }
}

const gameCyclesInterval = 1000 / 80; // Game Hz
const fpsDisplayInterval = 1000;
let timer = 0;
let lastTime = 0;
let dynamicLights = false;

let lightMap: number[][];
const fpsVal = document.getElementById("fps-val") as HTMLElement;
const engineVal = document.getElementById("engine-val") as HTMLElement;
const renderVal = document.getElementById("render-val") as HTMLElement;
let fpsTimer = 0;
let engineTimer = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  fpsTimer += deltaTime;

  timer += deltaTime;
  engineTimer += deltaTime;
  while (timer > gameCyclesInterval) {
    const engineStart = performance.now();
    if (Settings.play) {
      if (dynamicLights) {
        Utils.wipeMatrix(lightMap, 0);
      }
      nextState();
    }
    const engineEnd = performance.now();

    if (engineTimer > fpsDisplayInterval) {
      engineVal.innerText = Math.round(engineEnd - engineStart).toString();
      engineTimer = 0;
    }

    // TODO add no-frame skip setting
    // timer %= gameCyclesInterval;
    timer -= gameCyclesInterval; // skip frames if necessary
  }

  render(deltaTime);
  requestAnimationFrame(update);
}

function render(deltaTime: number) {
  const renderStart = performance.now();
  if (dynamicLights) {
    Display.drawPartialDynamic(Game.delta, Game.pixelGrid, lightMap);
  } else {
    Display.drawPartial(Game.delta);
  }
  const renderEnd = performance.now();

  if (fpsTimer > fpsDisplayInterval) {
    fpsVal.innerText = Math.round(fpsDisplayInterval / deltaTime).toString();
    renderVal.innerText = Math.round(renderEnd - renderStart).toString();
    fpsTimer = 0;
  }
  Utils.wipeMatrix(Game.delta, null);
}

function init() {
  lightMap = ArrayHelper.initArray(canvasWidth, canvasHeight, 0);

  // Middle box
  // {
  // const halfScreen = Math.floor(canvasHeight / 2);
  // for (
  //   let i = Math.floor(canvasWidth / 2) - 25;
  //   i < Math.floor(canvasWidth / 2) + 24;
  //   i++
  // ) {
  //   Game.createCell(i, halfScreen, CellType.concrete);
  // }

  // for (let j = halfScreen; j >= halfScreen - 15; j--) {
  //   Game.createCell(Math.floor(canvasWidth / 2) - 25, j, CellType.concrete);
  //   Game.createCell(Math.floor(canvasWidth / 2 + 24), j, CellType.concrete);
  // }
  // }

  for (let x = 0; x < canvasWidth; x++) {
    Game.createCell(x, canvasHeight - 2, CellType.concrete);
  }

  Display.drawFull(Game.pixelGrid);

  // Brush
  mainBrush = new Brush();
  mainBrush.init();

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
      Settings.togglePlay();
    }
  });

  const lightsCheck = document.getElementById(
    "dynamic-lights"
  ) as HTMLInputElement;
  lightsCheck.addEventListener("click", (e) => {
    dynamicLights = (<HTMLInputElement>e.target).checked;
    // TODO Full draw when turning off to clear light effects
  });
  lightsCheck.checked = dynamicLights;
}

init();
update();
