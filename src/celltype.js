export const states = {
  liquid: "liquid",
  solid: "solid",
  gas: "gas",
  fire:"fire"
}

export const empty = {
  id:0,
  name: "✏️ Eraser",
  key: "e",
  color: "#000000",
  density: 0.5,
};

// FIRE
export const smoke = {
  id:9,
  color: "#333333",
  density: 0.1,
  state: states.gas,
  lifetime: 0.98,
  nextCell: empty,
};
export const fire3 = {
  id:8,
  color: "#ff8800",
  density: 0.1,
  state: states.fire,
  lifetime: 0.885,
  propagation: 0.8,
  nextCell: smoke,
};
export const fire2 = {
  id:7,
  color: "#ff4400",
  density: 0.1,
  state: states.fire,
  lifetime: 0.89,
  propagation: 0.77,
  nextCell: fire3,
};
export const fire = {
  id:6,
  name: "🔥 Fire",
  key:"f",
  color: "#e00000",
  density: 0.2,
  state: states.fire,
  lifetime: 0.9,
  propagation: 0.75,
  nextCell: fire2,
};

// LIQUIDS
export const water = {
  id:2,
  name: "🌊 Water",
  key: "w",
  color: "#2222ff",
  density: 1,
  state: states.liquid,
  dousing: true,
};

export const oil = {
  id:3,
  name: "🛢️ Oil",
  key: "o",
  color: "#963e48",
  density: 0.5,
  state: states.liquid,
  flammable: 0.7,
  melt: fire,
};

// SOLIDS
export const floor = {
  id:4,
  name: "🧱 Concrete",
  key: "c",
  color: "#aaaaaa",
  density: 100,
  state: states.solid,
  static: true,
};
export const ice = {
  id:10,
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
export const soil = {
  id:11,
  name: "🍂 Soil",
  key: "l",
  color: "#322110",
  density: 20,
  state: states.solid,
  granular: true,
  dousing: false,
};
export const wood = {
  id:12,
  name: "🌳 Wood",
  key: "d",
  color: "#654321",
  density: 20,
  state: states.solid,
  flammable: 0.99,
  melt: fire,
  ash: soil,
  static: true,
};
export const sand = {
  id:1,
  name: "🏜️ Sand",
  key: "s",
  color: "#c2ff80",
  density: 9,
  state: states.solid,
  granular: true,
  dousing: true,
};
export const salt = {
  id:13,
  name: "🧂 Salt",
  key: "m",
  color: "#eeeeee",
  state: states.solid,
  density: 10,
  granular: true,
}
export const powder = {
  id:14,
  name: "💣 Gunpowder",
  key: "g",
  color: "#555555",
  density: 4,
  state: states.solid,
  granular: true,
  flammable: 0.4,
  melt: fire,
};
export const crystals = {
  id:5,
  name: "💎 Crystals",
  key: "y",
  color: "#ff80b6",
  density: 30,
  state: states.solid,
};
export const seed = {
  id:17,
  name:"🌱 Seed",
  key: "z",
  color: "#b5651d",
  density: 5,
  granular: true,
  flammable: 0.95,
  melt: soil,
  //ash: soil,
  state: states.solid,
}
export const plant = {
  id:16,
  name: "🌿 Plant",
  key:"p",
  color: "#00bf00",
  state: states.solid,
  density: 10,
  propagation: 0.7,
  propTarget: water,
  spawn: seed,
  flammable: 0.81,
  melt: fire,
  ash: soil,
  static: true,
};

export const CellsMap = [
  empty,
  sand,
  floor,
  wood,
  water,
  ice,
  salt,
  powder,
  oil,
  plant,
  soil,
  seed,
  crystals,
  fire,
];

export const CellsKeys = {};
CellsMap.forEach((k) => {
  if (k.key) {
    CellsKeys[k.key] = k;
  }
});

{
  const brushTypeSelector = document.getElementById("brush-type");
  CellsMap.forEach((cell) => {
    let opt = document.createElement("option");
    opt.value = cell.name;
    opt.innerHTML = cell.name + (cell.key ? ` (${cell.key})` : "");
    if (cell === sand) {
      opt.selected = "selected";
    }
    brushTypeSelector.appendChild(opt);
  });
}
