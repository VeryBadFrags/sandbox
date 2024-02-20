import { TapValues, brushCells } from "../content/CellGroups";
import { concrete } from "../content/CellValues";
import { States } from "./States";

export type Cell = {
  color: string;
  state?: States;
  density: number;

  name?: string;
  hsl?: number[];
  rgb?: number[];

  key?: string; // Shortcut
  static?: boolean;
  lifetime?: number;
  propagation?: number;
  propTarget?: Cell;
  spawn?: Cell;
  nextCell?: Cell;
  dousing?: boolean;
  flammable?: number;
  melt?: Cell;
  ash?: Cell;
  drip?: number;
  disolve?: Cell;
  disolveInto?: Cell;
  vector?: Vector;
  colorSuite?: string[];
  sticky?: boolean;
};

interface Vector {
  x: number;
  y: number;
}

// interface flammable {
//   chance: number;
//   melt: Cell;
//   ash?: Cell;
// }

function addElementToSelect(cell: Cell, select: HTMLSelectElement) {
  const opt = document.createElement("option");
  opt.value = cell.name;
  opt.innerHTML = cell.name + (cell.key ? ` (${cell.key})` : "");
  if (cell === concrete) {
    opt.selected = true;
  }
  select.appendChild(opt);
}

{
  // INIT

  // Set Brush selector menu values
  const brushTypeSelector = document.getElementById(
    "brush-type",
  ) as HTMLSelectElement;

  brushCells.forEach((cell) => addElementToSelect(cell, brushTypeSelector));

  for (let i = 1; i <= 3; i++) {
    const tap1Select = document.getElementById(
      "select-tap" + i,
    ) as HTMLSelectElement;
    TapValues.forEach((cell) => addElementToSelect(cell, tap1Select));
  }
}
