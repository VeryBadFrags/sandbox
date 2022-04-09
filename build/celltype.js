export var states;
(function(states2) {
  states2[states2["liquid"] = 0] = "liquid";
  states2[states2["solid"] = 1] = "solid";
  states2[states2["gas"] = 2] = "gas";
  states2[states2["fire"] = 3] = "fire";
})(states || (states = {}));
export const empty = {
  name: "✏️ Eraser",
  color: "#000000",
  hsl: [0, 0, 0],
  density: 0,
  key: "e"
};
export const smoke = {
  color: "#333333",
  hsl: [0, 0, 20],
  density: 0.1,
  state: 2,
  lifetime: 0.98,
  nextCell: empty
};
export const flame3 = {
  color: "#ff8800",
  hsl: [32, 100, 50],
  density: 0.1,
  state: 3,
  lifetime: 0.885,
  propagation: 0.8,
  nextCell: smoke
};
export const flame2 = {
  color: "#ff4400",
  hsl: [16, 100, 50],
  density: 0.1,
  state: 3,
  lifetime: 0.89,
  propagation: 0.77,
  nextCell: flame3
};
export const flame = {
  name: "🔥 Fire",
  key: "f",
  color: "#e00000",
  hsl: [0, 100, 44],
  density: 0.2,
  state: 3,
  lifetime: 0.9,
  propagation: 0.75,
  nextCell: flame2
};
export const water = {
  name: "🌊 Water",
  key: "w",
  color: "#2222ff",
  hsl: [240, 100, 57],
  density: 1,
  state: 0,
  dousing: true
};
export const oil = {
  name: "🛢️ Oil",
  key: "o",
  color: "#963e48",
  hsl: [353, 42, 42],
  density: 0.5,
  state: 0,
  flammable: 0.2,
  melt: flame
};
export const concrete = {
  name: "🧱 Concrete",
  key: "c",
  color: "#aaaaaa",
  hsl: [0, 0, 67],
  density: 100,
  state: 1,
  static: true
};
export const ice = {
  name: "🧊 Ice",
  key: "i",
  color: "#00eeee",
  hsl: [180, 100, 47],
  density: 0.9,
  state: 1,
  propagation: 0.996,
  lifetime: 0.999,
  drip: 0.999,
  static: true,
  melt: water
};
export const soil = {
  name: "🍂 Soil",
  key: "l",
  color: "#322110",
  hsl: [30, 52, 13],
  density: 20,
  state: 1,
  granular: true,
  dousing: false
};
export const wood = {
  name: "🌳 Wood",
  key: "d",
  color: "#654321",
  hsl: [30, 51, 26],
  density: 20,
  state: 1,
  flammable: 0.9,
  melt: flame,
  ash: soil,
  static: true
};
export const coal = {
  name: "♨️ Coal",
  key: "h",
  color: "#222",
  hsl: [0, 0, 13],
  density: 30,
  state: 1,
  flammable: 0.99,
  melt: flame,
  granular: true
};
export const sand = {
  name: "🏜️ Sand",
  key: "s",
  color: "#c2ff80",
  hsl: [89, 100, 75],
  density: 10,
  state: 1,
  granular: true,
  dousing: true
};
export const salt = {
  name: "🧂 Salt",
  key: "m",
  color: "#eeeeee",
  hsl: [0, 0, 93],
  state: 1,
  density: 9,
  granular: true
};
export const powder = {
  name: "💣 Gunpowder",
  key: "g",
  color: "#555555",
  hsl: [0, 0, 33],
  density: 4,
  state: 1,
  granular: true,
  flammable: 1e-3,
  melt: flame
};
export const crystals = {
  name: "💎 Crystals",
  key: "y",
  color: "#ff80b6",
  hsl: [334, 100, 75],
  density: 30,
  state: 1
};
export const seed = {
  name: "🌱 Seed",
  key: "z",
  color: "#b5651d",
  hsl: [28, 72, 41],
  density: 5,
  granular: true,
  flammable: 0.8,
  melt: soil,
  state: 1
};
export const plant = {
  name: "🌿 Plant",
  key: "p",
  color: "#00bf00",
  hsl: [120, 100, 37],
  state: 1,
  density: 10,
  propagation: 0.5,
  propTarget: water,
  spawn: seed,
  flammable: 0.6,
  melt: flame,
  ash: soil,
  static: true
};
export const CellsMap = [
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
  flame
];
export const AllCells = [
  empty,
  smoke,
  flame3,
  flame2,
  flame,
  water,
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
  plant
];
export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}
{
  const brushTypeSelector = document.getElementById("brush-type");
  CellsMap.forEach((cell) => {
    const opt = document.createElement("option");
    opt.value = cell.name;
    opt.innerHTML = cell.name + (cell.key ? ` (${cell.key})` : "");
    if (cell === concrete) {
      opt.selected = true;
    }
    brushTypeSelector.appendChild(opt);
  });
  AllCells.forEach((c) => c.rgb = hexToRgb(c.color));
}
