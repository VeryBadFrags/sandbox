import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

import * as CellType from "./celltype";
import * as Display from "./display";
import * as Game from "./game";
import * as Settings from "./settings";
import * as Fire from "./engine/fire";
import * as Liquid from "./engine/liquid";
import * as Solid from "./engine/solid";
import * as Gas from "./engine/gas";
import * as ArrayHelper from "./utils/arrayHelper";
import Brush from "./brush";

const pascalsLaw = false;

const iStart = (ltr: boolean, size: number) => (ltr ? 0 : size - 1);
const iEnd = (i: number, ltr: boolean, size: number) =>
  ltr ? i < size : i >= 0;

let mainBrush: Brush;

function nextState() {
  const leftToRight = Math.random() >= 0.5;

  for (
    let i = iStart(leftToRight, Game.getWidth());
    iEnd(i, leftToRight, Game.getWidth());
    leftToRight ? i++ : i--
  ) {
    for (let j = Game.getHeight() - 2; j >= 0; j--) {
      const cell = Game.getCell(i, j);
      if (cell === CellType.empty) {
        continue;
      }

      switch (cell.state) {
        case CellType.states.solid:
          Solid.process(cell, i, j);
          break;
        case CellType.states.liquid:
          Liquid.process(cell, i, j, pascalsLaw);
          break;
        case CellType.states.fire:
          Fire.process(cell, i, j, lightMap, dynamicLights);
          break;
        case CellType.states.gas:
          Gas.process(cell, i, j);
          break;
      }
    }

    Game.createCell(i, Game.getHeight() - 1, CellType.concrete);
    // Destroy the last row
    // Game.destroyCell(i, Game.getHeight() - 1);
  }

  // Spawn cells at the top
  createTaps();
  Game.updateFullBoard();
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
      Game.createCell(Math.floor(Game.getWidth() / 4) + i, 0, tap1);
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      Game.createCell(Math.floor(Game.getWidth() / 2) + i, 0, tap2);
    }
  }

  for (let i = -3; i <= 3; i++) {
    if (Math.random() > 0.9) {
      Game.createCell(Math.floor((3 * Game.getWidth()) / 4) + i, 0, tap3);
    }
  }
}

const gameCyclesInterval = 1000 / 80; // Game Hz
let timer = 0;
let lastTime = 0;
let dynamicLights = false;

let lightMap: number[][];
const fpsVal = document.getElementById("fps-val");
const engineVal = document.getElementById("engine-val");
const renderVal = document.getElementById("render-val");
let fpsTimer = 0;
let engineTimer = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  fpsTimer += deltaTime;
  timer += deltaTime;
  engineTimer += deltaTime;

  if (timer > gameCyclesInterval) {
    const engineStart = performance.now();
    if (Settings.play) {
      if (dynamicLights) {
        ArrayHelper.wipe2DMatrix(lightMap, 0);
      }
      nextState();
    }
    const engineEnd = performance.now();

    if (engineTimer > 1000) {
      engineVal.innerText = Math.round(engineEnd - engineStart).toString();
      engineTimer = 0;
    }

    // timer = 0;
    // timer %= gameCyclesInterval;
    timer -= gameCyclesInterval;
  }

  render(deltaTime);
  requestAnimationFrame(update);
}

function render(deltaTime: number) {
  const renderStart = performance.now();
  if (dynamicLights) {
    Display.drawPartialDynamic(lightMap);
  } else {
    Display.drawPartial();
  }
  const renderEnd = performance.now();

  if (fpsTimer > 1000) {
    fpsVal.innerText = Math.round(1000 / deltaTime).toString();
    renderVal.innerText = Math.round(renderEnd - renderStart).toString();
    fpsTimer = 0;
  }
  Game.wipeDelta(); // Needs to be called here because of the brush
}

function init() {
  lightMap = ArrayHelper.initMatrix(Game.getWidth(), Game.getHeight(), 0);

  // for (let x = 0; x < Game.getWidth(); x++) {
  //   Game.createCell(x, Game.getHeight() - 2, CellType.concrete);
  // }

  Display.drawFull();

  // Brush
  mainBrush = new Brush();
  mainBrush.init();

  const keyToCell = new Map<string, CellType.Cell>();
  CellType.brushCells.filter((cell) => cell.key).forEach((cell) => {
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
