import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

import { drawPartialDynamic, drawPartial, drawFull } from "./display";
import * as Game from "./game";
import * as Settings from "./controls/settings";
import * as Fire from "./engine/fire";
import * as Liquid from "./engine/liquid";
import * as Solid from "./engine/solid";
import * as Gas from "./engine/gas";
import * as ArrayHelper from "./utils/arrayUtils";
import Brush from "./controls/brush";
import { States } from "./types/states.enum";
import { concrete, emptyCell, oil, sand, water } from "./content/CellValues";
import { tapValues } from "./content/CellGroups";

import Plausible from "plausible-tracker";
import { initKeyboardListeners } from "./controls/keyboard";
const plausible = Plausible({
  domain: "sand.verybadfrags.com",
  apiHost: "/ps",
  hashMode: false,
});
plausible.trackPageview();

const pascalsLaw = false;

const iStart = (ltr: boolean, size: number) => (ltr ? 0 : size - 1);
const iEnd = (i: number, ltr: boolean, size: number) =>
  ltr ? i < size : i >= 0;

//let mainBrush: Brush;

function nextState() {
  const leftToRight = Math.random() >= 0.5;

  for (
    let i = iStart(leftToRight, Game.getGameWidth());
    iEnd(i, leftToRight, Game.getGameWidth());
    leftToRight ? i++ : i--
  ) {
    for (let j = Game.getGameHeight() - 2; j >= 0; j--) {
      const cell = Game.getCell(i, j);
      if (cell === emptyCell) {
        continue;
      }

      switch (cell.state) {
        case States.solid:
          Solid.process(cell, i, j);
          break;
        case States.liquid:
          Liquid.process(cell, i, j, pascalsLaw);
          break;
        case States.fire:
          Fire.process(cell, i, j, lightMap, dynamicLights);
          break;
        case States.gas:
          Gas.process(cell, i, j);
          break;
      }
    }

    Game.createCell(i, Game.getGameHeight() - 1, concrete);
    // Destroy the last row
    // Game.destroyCell(i, Game.getHeight() - 1);
  }

  // Spawn cells at the top
  createTaps();
}

let tap1 = oil;
let tap2 = sand;
let tap3 = water;

// Tap listeners
const tapSelect = document.getElementById("select-tap1") as HTMLSelectElement;
tapSelect.addEventListener("change", function (e) {
  tap1 = tapValues[(<HTMLSelectElement>e.target).selectedIndex];
});
const tap2Select = document.getElementById("select-tap2") as HTMLSelectElement;
tap2Select.addEventListener("change", function (e) {
  tap2 = tapValues[(<HTMLSelectElement>e.target).selectedIndex];
});
tap2Select.selectedIndex = 1;
const tap3Select = document.getElementById("select-tap3") as HTMLSelectElement;
tap3Select.addEventListener("change", function (e) {
  tap3 = tapValues[(<HTMLSelectElement>e.target).selectedIndex];
});
tap3Select.selectedIndex = 2;

function createTaps() {
  const tapSize = 3;
  for (let i = -tapSize; i <= tapSize; i++) {
    if (Math.random() > 0.9) {
      Game.createCell(Math.floor(Game.getGameWidth() / 4) + i, 0, tap1);
    }
  }

  for (let i = -tapSize; i <= tapSize; i++) {
    if (Math.random() > 0.9) {
      Game.createCell(Math.floor(Game.getGameWidth() / 2) + i, 0, tap2);
    }
  }

  for (let i = -tapSize; i <= tapSize; i++) {
    if (Math.random() > 0.9) {
      Game.createCell(Math.floor((3 * Game.getGameWidth()) / 4) + i, 0, tap3);
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

  let updatedState = false;
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
    updatedState = true;
  }

  render(deltaTime);
  if (updatedState) {
    Game.wipeDelta();
  }

  requestAnimationFrame(update);
}

function render(deltaTime: number) {
  const renderStart = performance.now();
  if (dynamicLights) {
    drawPartialDynamic(lightMap);
  } else {
    drawPartial();
  }
  const renderEnd = performance.now();

  if (fpsTimer > 1000) {
    fpsVal.innerText = Math.round(1000 / deltaTime).toString();
    renderVal.innerText = Math.round(renderEnd - renderStart).toString();
    fpsTimer = 0;
  }
}

function init() {
  lightMap = ArrayHelper.initMatrix(
    Game.getGameWidth(),
    Game.getGameHeight(),
    0,
  );

  drawFull();

  // Brush
  const mainBrush = new Brush();
  mainBrush.init();

  initKeyboardListeners(mainBrush);

  const lightsCheck = document.getElementById(
    "dynamic-lights",
  ) as HTMLInputElement;
  lightsCheck.addEventListener("click", (e) => {
    dynamicLights = (<HTMLInputElement>e.target).checked;
    // TODO Full draw when turning off to clear light effects
  });
  lightsCheck.checked = dynamicLights;
}

init();
update();
