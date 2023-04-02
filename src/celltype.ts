import * as ColorUtils from "./utils/colorUtils";

interface Vector {
  x: number;
  y: number;
}

export interface Cell {
  color: string;
  state?: states;
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

export enum states {
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
  state: states.gas,
  lifetime: 0.98,
  nextCell: empty,
};
export const flame3: Cell = {
  color: "#ff8800",
  density: 0.1,
  state: states.fire,
  lifetime: 0.885,
  propagation: 0.8,
  nextCell: smoke,
};
export const flame2: Cell = {
  color: "#ff4400",
  density: 0.1,
  state: states.fire,
  lifetime: 0.89,
  propagation: 0.77,
  nextCell: flame3,
};
export const flame: Cell = {
  name: "🔥 Fire",
  key: "f",
  color: "#e00000",
  density: 0.2,
  state: states.fire,
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
  state: states.liquid,
  dousing: true,
  melt: smoke,
};

export const saltyWater: Cell = {
  name: "Salty Water",
  color: "#22A2ff",
  density: 2,
  state: states.liquid,
  dousing: true,
};

export const oil: Cell = {
  name: "🛢️ Oil",
  key: "o",
  color: "#963e48",
  density: 0.5,
  state: states.liquid,
  flammable: 0.2,
  melt: flame,
};

export const acid: Cell = {
  name: "🧪 Acid",
  key: "a",
  color: "#00ff00",
  density: 3,
  state: states.liquid,
};

// SOLIDS
export const concrete: Cell = {
  name: "🧱 Concrete",
  key: "c",
  color: "#aaaaaa",
  density: 100,
  state: states.solid,
  static: true,
};
export const ice: Cell = {
  name: "🧊 Ice",
  key: "i",
  color: "#00eeee",
  density: 0.9,
  state: states.solid,
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
  color: "#322110",
  density: 20,
  state: states.solid,
  dousing: false,
};
export const wood: Cell = {
  name: "🌳 Wood",
  key: "d",
  color: "#654321",
  density: 20,
  state: states.solid,
  flammable: 0.9,
  melt: flame,
  ash: soil,
  static: true,
};
export const coal: Cell = {
  name: "♨️ Coal",
  key: "h",
  color: "#202020",
  density: 30,
  state: states.solid,
  flammable: 0.99,
  melt: flame,
};
export const sand: Cell = {
  name: "🏜️ Sand",
  key: "s",
  color: "#c2ff80",
  density: 10,
  state: states.solid,
  dousing: true,
};
export const salt: Cell = {
  name: "🧂 Salt",
  key: "m",
  color: "#eeeeee",
  state: states.solid,
  density: 9,
  disolve: water,
  disolveInto: saltyWater,
};

{
  // Reference after salt
  saltyWater.melt = salt;
}

export const powder: Cell = {
  name: "💣 Gunpowder",
  key: "g",
  color: "#555555",
  density: 4,
  state: states.solid,
  flammable: 0.001,
  melt: flame,
};
export const crystals: Cell = {
  name: "💎 Crystals",
  key: "y",
  color: "#ff80b6",
  density: 30,
  state: states.solid,
  sticky: true,
};
export const seed: Cell = {
  name: "🌱 Seed",
  key: "z",
  color: "#b5651d",
  density: 5,
  flammable: 0.8,
  melt: soil,
  // ash: soil,
  state: states.solid,
};
export const plant: Cell = {
  name: "🌿 Plant",
  key: "p",
  color: "#00bf00",
  state: states.solid,
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
  state: states.conveyor,
  static: true,
  vector: { x: -1, y: 0 },
};

export const conveyorRight: Cell = {
  name: "⚙️➡️ Conveyor",
  key: "t",
  color: "#006064",
  colorSuite: ["#AFB42B", "#9E9D24", "#827717"],
  density: 100,
  state: states.conveyor,
  static: true,
  vector: { x: 1, y: 0 },
};

/**
 * Cells that can be picked in the UI dropdown
 */
export const CellsMap: Cell[] = [
  empty,
  sand,
  concrete,
  wood,
  water,
  ice,
  salt,
  powder,
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
];

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
  powder,
  crystals,
  seed,
  plant,
  conveyorLeft,
  conveyorRight,
];

export const TapValues: Cell[] = [oil, sand, water, coal, seed, soil];

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

  CellsMap.forEach((cell) => addElementToSelect(cell, brushTypeSelector));

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
