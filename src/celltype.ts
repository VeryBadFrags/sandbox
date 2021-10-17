export type Cell = {
  name?: string;
  color: string;
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
};

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
  color: "#222",
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
};
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
  //ash: soil,
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
];

{
  const brushTypeSelector = document.getElementById("brush-type") as HTMLSelectElement;
  CellsMap.forEach((cell) => {
    const opt = document.createElement("option");
    opt.value = cell.name;
    opt.innerHTML = cell.name + (cell.key ? ` (${cell.key})` : "");
    if (cell === concrete) {
      opt.selected = true;
    }
    brushTypeSelector.appendChild(opt);
  });
}
