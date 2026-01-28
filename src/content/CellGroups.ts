import type { Cell } from "../types/cell.type.ts";
import { hexToHSL, hexToRgb } from "../utils/colorUtils.ts";
import * as CellValue from "./CellValues.ts";

/**
 * Cells that can be picked in the UI dropdown
 */
export const brushCells: Cell[] = [
  CellValue.emptyCell, // Eraser
  CellValue.acid,
  CellValue.coal,
  CellValue.concrete,
  CellValue.conveyorLeft,
  CellValue.conveyorRight,
  CellValue.crystals,
  CellValue.flame,
  CellValue.gunPowder,
  CellValue.ice,
  CellValue.oil,
  CellValue.plant,
  CellValue.salt,
  CellValue.sand,
  CellValue.seed,
  CellValue.soil,
  CellValue.water,
  CellValue.wax,
  CellValue.wood,
];

// {
//   CellsMap.sort((a, b) => {
//     if (a.name < b.name) {
//       return 1;
//     } else return -1;
//   });
// }

// Must contain all cells
export const allCells: Cell[] = [
  CellValue.emptyCell,
  CellValue.acid,
  CellValue.smoke,
  CellValue.flame3,
  CellValue.flame2,
  CellValue.flame,
  CellValue.water,
  CellValue.saltyWater,
  CellValue.oil,
  CellValue.concrete,
  CellValue.ice,
  CellValue.soil,
  CellValue.wood,
  CellValue.coal,
  CellValue.sand,
  CellValue.salt,
  CellValue.gunPowder,
  CellValue.crystals,
  CellValue.seed,
  CellValue.plant,
  CellValue.conveyorLeft,
  CellValue.conveyorRight,
  CellValue.wax,
];

/**
 * Choices for picking a tap
 */
export const tapValues: Cell[] = [
  CellValue.oil,
  CellValue.sand,
  CellValue.water,
  CellValue.acid,
  CellValue.coal,
  CellValue.gunPowder,
  CellValue.salt,
  CellValue.seed,
  CellValue.soil,
  CellValue.wax,
];

function addElementToSelect(cell: Cell, select: HTMLSelectElement) {
  if (cell.name) {
    const opt = document.createElement("option");
    opt.value = cell.name;
    opt.innerHTML = cell.name + (cell.key ? ` (${cell.key})` : "");
    if (cell === CellValue.concrete) {
      opt.selected = true;
    }
    select.appendChild(opt);
  }
}

function initBrush() {
  // Set Brush selector menu values
  const brushTypeSelector = document.getElementById(
    "brush-type",
  ) as HTMLSelectElement;

  brushCells.forEach((cell) => addElementToSelect(cell, brushTypeSelector));
}
function initTap() {
  for (let i = 1; i <= 3; i++) {
    const tap1Select = document.getElementById(
      "select-tap" + i,
    ) as HTMLSelectElement;
    tapValues.forEach((cell) => addElementToSelect(cell, tap1Select));
  }
}
function initRgbAndHsl() {
  // Set RGB values
  allCells.forEach((c) => (c.rgb = hexToRgb(c.color)));
  allCells.forEach((c) => (c.hsl = hexToHSL(c.color)));
}

initBrush();
initTap();
initRgbAndHsl();
