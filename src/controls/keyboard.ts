import { brushCells } from "../content/CellGroups.ts";
import { Cell } from "../types/cell.type.ts";
import Brush from "./brush.ts";
import { togglePlay } from "./settings.ts";

export function initKeyboardListeners(mainBrush: Brush) {
  const keyToCell = new Map<string, Cell>();
  brushCells
    .filter((cell) => cell.key)
    .forEach((cell) => keyToCell.set(cell.key!, cell));

  document.addEventListener("keydown", (e) => {
    if (keyToCell.has(e.key)) {
      mainBrush.setBrushType(keyToCell.get(e.key)!);
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
}
