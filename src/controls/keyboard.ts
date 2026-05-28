import { brushCells } from "../content/CellGroups.ts";
import type { Cell } from "../types/cell.type.ts";
import type Brush from "./brush.ts";
import { togglePlay } from "./settings.ts";

export function initKeyboardListeners(mainBrush: Brush) {
	const keyToCell = new Map<string, Cell>();
	brushCells.forEach((cell) => {
		if (cell.key) {
			keyToCell.set(cell.key, cell);
		}
	});

	document.addEventListener("keydown", (e) => {
		const cell = keyToCell.get(e.key);
		if (cell) {
			mainBrush.setBrushType(cell);
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
