import type { Cell } from "../types/cell.type";
import { hexToHSL, hexToRgb } from "../utils/colorUtils";
import * as CellValue from "./CellValues";

/**
 * Cells that can be picked in the UI dropdown
 */
export const brushCells: Cell[] = [
  CellValue.emptyCell,
  CellValue.sand,
  CellValue.concrete,
  CellValue.wood,
  CellValue.water,
  CellValue.ice,
  CellValue.salt,
  CellValue.gunPowder,
  CellValue.oil,
  CellValue.coal,
  CellValue.plant,
  CellValue.soil,
  CellValue.seed,
  CellValue.crystals,
  CellValue.flame,
  CellValue.acid,
  CellValue.conveyorLeft,
  CellValue.conveyorRight,
  CellValue.wax,
];

// {
//   CellsMap.sort((a, b) => {
//     if (a.name < b.name) {
//       return 1;
//     } else return -1;
//   });
// }

// Must contain all cells
export const AllCells: Cell[] = [
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
export const TapValues: Cell[] = [
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

{
  // Set RGB values
  AllCells.forEach((c) => (c.rgb = hexToRgb(c.color)));
  AllCells.forEach((c) => (c.hsl = hexToHSL(c.color)));
}
