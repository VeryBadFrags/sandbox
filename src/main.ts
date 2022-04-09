import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";

import * as Display from "./display.js";
import * as CellType from "./celltype.js";
import * as Utils from "./utils.js";
import * as Game from "./game.js";
import * as Solid from "./engine/solid.js";
import * as Liquid from "./liquid";
import Brush from "./brush.js";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const pascalsLaw = false;

let canvasWidth: number, canvasHeight: number;

const iStart = (ltr: boolean, size: number) => (ltr ? 0 : size - 1);
const iEnd = (i: number, ltr: boolean, size: number) =>
  ltr ? i < size : i >= 0;
function nextState() {
  const leftToRight = Math.random() >= 0.5;

  for (
    let i = iStart(leftToRight, canvasWidth);
    iEnd(i, leftToRight, canvasWidth);
    leftToRight ? i++ : i--
  ) {
    const column = Game.pixelGrid[i];
    for (let j = canvasHeight - 2; j >= 0; j--) {
      const cell = column[j];
      if (cell === CellType.empty) {
        continue;
      }

      switch (cell.state) {
        case CellType.states.solid:
          Solid.process(cell, i, j, column, canvasWidth, canvasHeight);
          break;
        case CellType.states.liquid:
          Liquid.process(cell, i, j, column, canvasWidth, pascalsLaw);
          break;
        case CellType.states.fire:
          Game.processFire(
            cell,
            i,
            j,
            column,
            canvasWidth,
            canvasHeight,
            lightMap,
            dynamicLights
          );
          break;
        case CellType.states.gas:
          Game.processGas(cell, i, j, column, canvasWidth);
          break;
      }
    }

    // Destroy the last row
    Game.destroyCell(i, canvasHeight - 1);
  }

  // Spawn cells at the top
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

const frameMinInterval = 16.667;
const fpsDisplayInterval = 1000;
let timer = 0;
let lastTime = 0;
let dynamicLights = false;

let lightMap: number[][];
let play = true;
const fpsVal = document.getElementById("fps-val")!;
const engineVal = document.getElementById("engine-val")!;
const renderVal = document.getElementById("render-val")!;
let fpsTimer = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  fpsTimer += deltaTime;

  timer += deltaTime;
  if (timer > frameMinInterval) {
    const engineStart = performance.now();
    if (play) {
      if (dynamicLights) {
        Utils.wipeMatrix(lightMap, 0);
      }
      nextState();
    }
    const engineEnd = performance.now();

    const renderStart = performance.now();
    if (dynamicLights) {
      Display.drawPartialDynamic(Game.delta, Game.pixelGrid, lightMap);
    } else {
      Display.drawPartial(Game.delta);
    }
    const renderEnd = performance.now();
    Utils.wipeMatrix(Game.delta, null);
    // timer %= interval; // accurate
    timer -= frameMinInterval; // skip frames
    console.log(timer);

    if (fpsTimer > fpsDisplayInterval) {
      fpsVal.innerText = Math.round(fpsDisplayInterval / deltaTime).toString();
      engineVal.innerText = Math.round(engineEnd - engineStart).toString();
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
  for (
    let i = Math.floor(canvasWidth / 2) - 25;
    i < Math.floor(canvasWidth / 2) + 24;
    i++
  ) {
    Game.createCell(i, halfScreen, CellType.concrete);
  }

  for (let j = halfScreen; j >= halfScreen - 15; j--) {
    Game.createCell(Math.floor(canvasWidth / 2) - 25, j, CellType.concrete);
    Game.createCell(Math.floor(canvasWidth / 2 + 24), j, CellType.concrete);
  }

  for (let x = 0; x < canvasWidth; x++) {
    Game.createCell(x, canvasHeight - 2, CellType.concrete);
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

  const playPauseButton = document.getElementById("play-pause")!;
  playPauseButton.addEventListener("click", togglePlay);

  const eraseButton = document.getElementById("erase-button")!;
  eraseButton.addEventListener("click", () => {
    Utils.wipeMatrix(Game.pixelGrid, CellType.empty);
    Display.drawFull(Game.pixelGrid);
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
