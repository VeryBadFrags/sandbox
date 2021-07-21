import * as CellType from "./celltype.js";
import * as Game from "./game.js";

export default class Brush {
  constructor(requestDrawFull) {
    this.requestDrawFull = requestDrawFull;
  }

  init() {
    const canvas = document.getElementById("game");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let intervalId;

    let brushSize = 4;
    let brushOpacity = 10;
    let brushType = CellType.sand;

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

    let prevMouseX = null, prevMouseY = null;
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

    const brushTypeSelector = document.getElementById("brush-type");
    brushTypeSelector.addEventListener("change", function (e) {
      brushType =
        CellType.CellsMap[e.target.options[e.target.selectedIndex].value];
    });
    brushTypeSelector.value = "sand";

    const brushSizeSelector = document.getElementById("brush-size");
    brushSizeSelector.addEventListener("change", function (e) {
      brushSize = parseInt(e.target.value, 10);
    });
    brushSizeSelector.value = brushSize;

    // Listeners
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", mouseOff);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseout", mouseOff);
  }
}
