import * as CellType from "./celltype.js";
import * as Game from "./game.js";

const brushTypeSelector = document.getElementById("brush-type");
const brushSizeSelector = document.getElementById("brush-size");
const brushSizeSlider = document.getElementById("brush-size-slider");
const brushOpacitySlider = document.getElementById("brush-opacity");

let brushType = CellType.sand;
let brushSize = 4;
let brushOpacity = 10;

export default class Brush {
  constructor(requestDrawFull) {
    this.requestDrawFull = requestDrawFull;
  }

  setBrushType(brush) {
    brushType = brush;
    brushTypeSelector.value = brush.name;
  }

  increaseBrushSize(size) {
    if (size > 0) {
      brushSize += size + Math.floor(brushSize / 10);
    } else {
      let step = Math.floor(brushSize / 10)
      brushSize += size - Math.floor((brushSize - step) / 10);
    }
    brushSize = Math.max(1, Math.min(32, brushSize));
    brushSizeSelector.value = brushSize;
  }

  increaseOpacity(size) {
    brushOpacity += size;
    brushOpacity = Math.max(0, Math.min(100, brushOpacity));
    brushOpacitySlider.value = brushOpacity;
  }

  init() {
    const canvas = document.getElementById("game");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let intervalId;

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
            Game.pixelGrid[i][j] = brushType;
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
        Game.pixelGrid[x][y] = brushType;
      }
      this.requestDrawFull();
    };

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

    // let prevMouseX = null,
    //   prevMouseY = null;
    let mouseX = 0,
      mouseY = 0;
    function onMouseMove(e) {
      let rect = canvas.getBoundingClientRect();
      mouseX = Math.round(
        ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
      );
      mouseY = Math.round(
        ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
      );

      if (isMouseDown) {
        spawnSand(mouseX, mouseY);
      }
    }

    function mouseOff() {
      isMouseDown = false;
      clearInterval(intervalId);
    }

    brushTypeSelector.addEventListener("change", function (e) {
      brushType = CellType.CellsMap[e.target.selectedIndex];
    });

    brushSizeSelector.addEventListener("input", function (e) {
      brushSize = parseInt(e.target.value, 10);
      brushSizeSlider.value = brushSize;
    });
    brushSizeSlider.addEventListener("input", function (e) {
      brushSize = parseInt(e.target.value, 10);
      brushSizeSelector.value = brushSize;
    });

    brushSizeSelector.value = brushSize;
    brushSizeSlider.value = brushSize;

    // Listeners
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", mouseOff);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseout", mouseOff);
  }
}
