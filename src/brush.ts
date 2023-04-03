import * as CellType from "./celltype";
import * as Game from "./game";
import * as DrawUtils from "./utils/drawUtils";

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

    const ratioX = Game.getWidth() / canvasWidth;
    const ratioY = Game.getHeight() / canvasHeight;

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
            const boardX = Math.min(Math.ceil(i * ratioX), Game.getWidth() - 1);
            const boardY = Math.min(
              Math.ceil(j * ratioY),
              Game.getHeight() - 1
            );
            Game.createCell(boardX, boardY, brushType);
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
        const boardX = Math.min(Math.ceil(x * ratioX), Game.getWidth() - 1);
        const boardY = Math.min(Math.ceil(y * ratioY), Game.getHeight() - 1);
        Game.createCell(boardX, boardY, brushType);
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
        ((e.clientX - rect.left) / (rect.right - rect.left)) * canvasWidth
      );
      mouseY = Math.round(
        ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvasHeight
      );

      if (isMouseDown) {
        if (DrawUtils.getDistance(mouseX, mouseY, prevMouseX, prevMouseY) > 2) {
          const interpolated = DrawUtils.createIntermediatePoints(
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
        CellType.brushCells[(<HTMLSelectElement>e.target).selectedIndex];
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

    // Mouse
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", mouseOff);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseout", mouseOff);

    // Touch
    canvas.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    });
    canvas.addEventListener("touchend", (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    });
    canvas.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    });

    // Prevent scrolling when touching the canvas
    document.body.addEventListener(
      "touchstart",
      (e) => {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      false
    );
    document.body.addEventListener(
      "touchend",
      (e) => {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      false
    );
    document.body.addEventListener(
      "touchmove",
      (e) => {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      false
    );
  }
}
