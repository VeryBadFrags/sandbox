export interface Cell {
  name?: string;
  color: string;
  hsl: number[];
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
  hsl: [0, 0, 0],
  density: 0,
  key: "e",
};

// FIRE
export const smoke: Cell = {
  color: "#333333",
  hsl: [0, 0, 20],
  density: 0.1,
  state: states.gas,
  lifetime: 0.98,
  nextCell: empty,
};
export const flame3: Cell = {
  color: "#ff8800",
  hsl: [32, 100, 50],
  density: 0.1,
  state: states.fire,
  lifetime: 0.885,
  propagation: 0.8,
  nextCell: smoke,
};
export const flame2: Cell = {
  color: "#ff4400",
  hsl: [16, 100, 50],
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
  hsl: [0, 100, 44],
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
  hsl: [240, 100, 57],
  density: 1,
  state: states.liquid,
  dousing: true,
  melt: smoke,
};

export const saltyWater: Cell = {
  name: "Salty Water",
  color: "#22A2ff",
  hsl: [240, 100, 57],
  density: 2,
  state: states.liquid,
  dousing: true,
};

export const oil: Cell = {
  name: "🛢️ Oil",
  key: "o",
  color: "#963e48",
  hsl: [353, 42, 42],
  density: 0.5,
  state: states.liquid,
  flammable: 0.2,
  melt: flame,
};

// SOLIDS
export const concrete: Cell = {
  name: "🧱 Concrete",
  key: "c",
  color: "#aaaaaa",
  hsl: [0, 0, 67],
  density: 100,
  state: states.solid,
  static: true,
};
export const ice: Cell = {
  name: "🧊 Ice",
  key: "i",
  color: "#00eeee",
  hsl: [180, 100, 47],
  density: 0.9,
  state: states.solid,
  propagation: 0.996,
  lifetime: 0.999,
  drip: 0.999,
  static: true,
  melt: water,
};
export const soil: Cell = {
  name: "🍂 Soil",
  key: "l",
  color: "#322110",
  hsl: [30, 52, 13],
  density: 20,
  state: states.solid,
  granular: true,
  dousing: false,
};
export const wood: Cell = {
  name: "🌳 Wood",
  key: "d",
  color: "#654321",
  hsl: [30, 51, 26],
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
  hsl: [0, 0, 13],
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
  hsl: [89, 100, 75],
  density: 10,
  state: states.solid,
  granular: true,
  dousing: true,
};
export const salt: Cell = {
  name: "🧂 Salt",
  key: "m",
  color: "#eeeeee",
  hsl: [0, 0, 93],
  state: states.solid,
  density: 9,
  granular: true,
  disolve: water,
  disolveInto: saltyWater,
};

{ // Reference after salt
  saltyWater.melt = salt;
}

export const powder: Cell = {
  name: "💣 Gunpowder",
  key: "g",
  color: "#555555",
  hsl: [0, 0, 33],
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
  hsl: [334, 100, 75],
  density: 30,
  state: states.solid,
};
export const seed: Cell = {
  name: "🌱 Seed",
  key: "z",
  color: "#b5651d",
  hsl: [28, 72, 41],
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
  hsl: [120, 100, 37],
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
];

export const AllCells: Cell[] = [
  empty,
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

{
  // INIT

  // Set Brush selector menu values
  const brushTypeSelector = document.getElementById(
    "brush-type"
  ) as HTMLSelectElement;
  CellsMap.forEach((cell) => {
    const opt = document.createElement("option");
    opt.value = cell.name;
    opt.innerHTML = cell.name + (cell.key ? ` (${cell.key})` : "");
    if (cell === concrete) {
      opt.selected = true;
    }
    brushTypeSelector.appendChild(opt);
  });

  // Set RGB values
  AllCells.forEach((c) => (c.rgb = hexToRgb(c.color)));
}
