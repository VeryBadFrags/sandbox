export interface Cell {
  name?: string;
  color: string;
  hsl?: number[];
  rgb?: number[];
  density: number;
  key?: string;
  state?: states;
  static?: boolean;
  granular?: boolean;
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
}

export enum states {
  liquid,
  solid,
  gas,
  fire,
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
  granular: true,
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
  granular: true,
};
export const sand: Cell = {
  name: "🏜️ Sand",
  key: "s",
  color: "#c2ff80",
  density: 10,
  state: states.solid,
  granular: true,
  dousing: true,
};
export const salt: Cell = {
  name: "🧂 Salt",
  key: "m",
  color: "#eeeeee",
  state: states.solid,
  density: 9,
  granular: true,
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
  granular: true,
  flammable: 0.001,
  melt: flame,
};
export const crystals: Cell = {
  name: "💎 Crystals",
  key: "y",
  color: "#ff80b6",
  density: 30,
  state: states.solid,
};
export const seed: Cell = {
  name: "🌱 Seed",
  key: "z",
  color: "#b5651d",
  density: 5,
  granular: true,
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
];

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
];

export const TapValues: Cell[] = [oil, sand, water, coal, seed, soil];

// TODO move to Utils
export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result != null
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

// TODO move to Utils
function hexToHSL(hex: string): number[] {
  const parsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = parseInt(parsed[1], 16);
  let g = parseInt(parsed[2], 16);
  let b = parseInt(parsed[3], 16);
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}

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
  AllCells.forEach((c) => (c.rgb = hexToRgb(c.color)));
  AllCells.forEach((c) => (c.hsl = hexToHSL(c.color)));
}
