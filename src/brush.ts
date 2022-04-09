import * as CellType from "./celltype.js";
import * as Game from "./game.js";
import * as Utils from "./utils.js";

const brushTypeSelector = document.getElementById(
  "brush-type"
) as HTMLSelectElement;
const brushSizeInput = document.getElementById(
  "brush-size"
) as HTMLInputElement;
const brushSizeSlider = document.getElementById(
  "brush-size-slider"
) as HTMLInputElement;
const brushOpacitySlider = document.getElementById(
  "brush-opacity"
) as HTMLInputElement;

let brushType = CellType.concrete;
let brushSize = 2;
let brushOpacity = 100;

export default class Brush {
  setBrushType(brush: CellType.Cell): void {
    brushType = brush;
    brushTypeSelector.value = brush.name;
  }

  increaseBrushSize(size: number): void {
    if (size > 0) {
      brushSize += size + Math.floor(brushSize / 10);
    } else {
      const step = Math.floor(brushSize / 10);
      brushSize += size - Math.floor((brushSize - step) / 10);
    }
    brushSize = Math.max(1, Math.min(32, brushSize));
    brushSizeInput.value = brushSize.toString();
    brushSizeSlider.value = brushSize.toString();
  }

  increaseOpacity(size: number): void {
    brushOpacity += size;
    brushOpacity = Math.max(0, Math.min(100, brushOpacity));
    brushOpacitySlider.value = brushOpacity.toString();
  }

  init(): void {
    const canvas = document.getElementById("game") as HTMLCanvasElement;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let intervalId: number;

    const spawnCell = (x: number, y: number): void => {
      const actualBrushSize = brushSize - 1;
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
            Game.delta[i][j] = brushType;
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
        Game.delta[x][y] = brushType;
        Game.pixelGrid[x][y] = brushType;
      }
    };

    brushOpacitySlider.addEventListener("click", function (e) {
      brushOpacity = parseInt((<HTMLInputElement>e.target).value);
    });
    brushOpacitySlider.value = brushOpacity.toString();

    let isMouseDown = false;
    function onMouseDown() {
      isMouseDown = true;
      spawnCell(mouseX, mouseY);
      intervalId = setInterval(
        function () {
          spawnCell(mouseX, mouseY);
        },
        brushType === CellType.concrete ? 1 : 20
      );
    }

    let prevMouseX = 0;
    let prevMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    const rect = canvas.getBoundingClientRect();
    function onMouseMove(e: MouseEvent) {
      mouseX = Math.round(
        ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
      );
      mouseY = Math.round(
        ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
      );

      if (isMouseDown) {
        if (Utils.getDistance(mouseX, mouseY, prevMouseX, prevMouseY) > 2) {
          const interpolated = Utils.createIntermediatePoints(
            mouseX,
            mouseY,
            prevMouseX,
            prevMouseY
          );
          interpolated.forEach((point) => spawnCell(point[0], point[1]));
        }
        spawnCell(mouseX, mouseY);
      }

      prevMouseX = mouseX;
      prevMouseY = mouseY;
    }

    function mouseOff() {
      isMouseDown = false;
      clearInterval(intervalId);
    }

    brushTypeSelector.addEventListener("change", function (e) {
      brushType =
        CellType.CellsMap[(<HTMLSelectElement>e.target).selectedIndex];
    });

    brushSizeInput.addEventListener("input", function (e) {
      brushSize = parseInt((<HTMLInputElement>e.target).value, 10);
      brushSizeSlider.value = brushSize.toString();
    });
    brushSizeSlider.addEventListener("input", function (e) {
      brushSize = parseInt((<HTMLInputElement>e.target).value, 10);
      brushSizeInput.value = brushSize.toString();
    });

    brushSizeInput.value = brushSize.toString();
    brushSizeSlider.value = brushSize.toString();

    // Listeners
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", mouseOff);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseout", mouseOff);
  }
}
