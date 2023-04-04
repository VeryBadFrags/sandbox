import * as ColorUtils from "../utils/colorUtils";

interface Vector {
  x: number;
  y: number;
}

// interface flammable {
//   chance: number;
//   melt: Cell;
//   ash?: Cell;
// }

export interface Cell {
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
}

export enum States {
  liquid,
  solid,
  gas,
  fire,
  conveyor,
}

export const empty: Cell = {
  name: "✏️ Eraser",
  color: "#000000",
  density: 0,
  key: "e",
};

// FIRE
export const smoke: Cell = {
  color: "#333333",
  density: 0.1,
  state: States.gas,
  lifetime: 0.98,
  nextCell: empty,
};
export const flame3: Cell = {
  color: "#ff8800",
  density: 0.1,
  state: States.fire,
  lifetime: 0.885,
  propagation: 0.8,
  nextCell: smoke,
};
export const flame2: Cell = {
  color: "#ff4400",
  density: 0.1,
  state: States.fire,
  lifetime: 0.89,
  propagation: 0.77,
  nextCell: flame3,
};
export const flame: Cell = {
  name: "🔥 Fire",
  key: "f",
  color: "#e00000",
  density: 0.2,
  state: States.fire,
  lifetime: 0.9,
  propagation: 0.75,
  nextCell: flame2,
};

// LIQUIDS
export const water: Cell = {
  name: "🌊 Water",
  key: "w",
  color: "#2222ff",
  density: 1,
  state: States.liquid,
  dousing: true,
  melt: smoke,
};

export const saltyWater: Cell = {
  name: "Salty Water",
  color: "#22A2ff",
  density: 2,
  state: States.liquid,
  dousing: true,
};

export const oil: Cell = {
  name: "🛢️ Oil",
  key: "o",
  color: "#963e48",
  density: 0.5,
  state: States.liquid,
  flammable: 0.2,
  melt: flame,
};

export const acid: Cell = {
  name: "🧪 Acid",
  key: "a",
  color: "#00ff00",
  density: 3,
  state: States.liquid,
};

// SOLIDS
export const concrete: Cell = {
  name: "🧱 Concrete",
  key: "c",
  color: "#aaaaaa",
  density: 100,
  state: States.solid,
  static: true,
};
export const ice: Cell = {
  name: "🧊 Ice",
  key: "i",
  color: "#00eeee",
  density: 0.9,
  state: States.solid,
  propagation: 0.996,
  lifetime: 0.999,
  drip: 0.999,
  static: true,
  melt: water,
  dousing: true,
};
export const soil: Cell = {
  name: "🍂 Soil",
  key: "l",
  color: "#6D4C41",
  density: 20,
  state: States.solid,
  dousing: false,
};
export const wood: Cell = {
  name: "🌳 Wood",
  key: "d",
  color: "#654321",
  density: 20,
  state: States.solid,
  flammable: 0.9,
  melt: flame,
  ash: soil,
  static: true,
};
export const coal: Cell = {
  name: "♨️ Coal",
  key: "h",
  color: "#303030",
  density: 30,
  state: States.solid,
  flammable: 0.99,
  melt: flame,
};
export const sand: Cell = {
  name: "🏜️ Sand",
  key: "s",
  color: "#c2ff80",
  density: 20,
  state: States.solid,
  dousing: true,
};
export const salt: Cell = {
  name: "🧂 Salt",
  key: "m",
  color: "#eeeeee",
  state: States.solid,
  density: 9,
  disolve: water,
  disolveInto: saltyWater,
};

{
  // Reference after salt
  saltyWater.melt = salt;
}

export const gunPowder: Cell = {
  name: "💣 Gunpowder",
  key: "g",
  color: "#555555",
  density: 4,
  state: States.solid,
  flammable: 0.001,
  melt: flame,
};
export const crystals: Cell = {
  name: "💎 Crystals",
  key: "y",
  color: "#ff80b6",
  density: 30,
  state: States.solid,
  sticky: true,
};
export const seed: Cell = {
  name: "🌱 Seed",
  key: "z",
  color: "#b5651d",
  density: 12,
  flammable: 0.8,
  melt: soil,
  // ash: soil,
  state: States.solid,
};
export const plant: Cell = {
  name: "🌿 Plant",
  key: "p",
  color: "#00bf00",
  state: States.solid,
  density: 10,
  propagation: 0.5,
  propTarget: water,
  spawn: seed,
  flammable: 0.6,
  melt: flame,
  ash: soil,
  static: true,
};

export const conveyorLeft: Cell = {
  name: "⚙️⬅️ Conveyor",
  key: "r",
  color: "#00ACC1",
  colorSuite: ["#AFB42B", "#9E9D24", "#827717"],
  density: 100,
  state: States.conveyor,
  static: true,
  vector: { x: -1, y: 0 },
};

export const conveyorRight: Cell = {
  name: "⚙️➡️ Conveyor",
  key: "t",
  color: "#006064",
  colorSuite: ["#AFB42B", "#9E9D24", "#827717"],
  density: 100,
  state: States.conveyor,
  static: true,
  vector: { x: 1, y: 0 },
};

export const wax: Cell = {
  name: "🕯️ Wax",
  key: "x",
  color: "#A7FFEB",
  flammable: 0.995,
  melt: flame,
  density: 30,
  state: States.solid,
  sticky: true,
};
{
  wax.ash = wax;
}

/**
 * Cells that can be picked in the UI dropdown
 */
export const brushCells: Cell[] = [
  empty,
  sand,
  concrete,
  wood,
  water,
  ice,
  salt,
  gunPowder,
  oil,
  coal,
  plant,
  soil,
  seed,
  crystals,
  flame,
  acid,
  conveyorLeft,
  conveyorRight,
  wax,
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
  empty,
  acid,
  smoke,
  flame3,
  flame2,
  flame,
  water,
  saltyWater,
  oil,
  concrete,
  ice,
  soil,
  wood,
  coal,
  sand,
  salt,
  gunPowder,
  crystals,
  seed,
  plant,
  conveyorLeft,
  conveyorRight,
  wax,
];

export const TapValues: Cell[] = [
  oil,
  sand,
  water,
  acid,
  coal,
  gunPowder,
  salt,
  seed,
  soil,
  wax,
];

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
    "brush-type"
  ) as HTMLSelectElement;

  brushCells.forEach((cell) => addElementToSelect(cell, brushTypeSelector));

  for (let i = 1; i <= 3; i++) {
    const tap1Select = document.getElementById(
      "select-tap" + i
    ) as HTMLSelectElement;
    TapValues.forEach((cell) => addElementToSelect(cell, tap1Select));
  }

  // Set RGB values
  AllCells.forEach((c) => (c.rgb = ColorUtils.hexToRgb(c.color)));
  AllCells.forEach((c) => (c.hsl = ColorUtils.hexToHSL(c.color)));
}
