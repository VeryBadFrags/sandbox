export const states = {
  liquid: "liquid",
  solid: "solid",
  gas: "gas",
  fire:"fire"
}

export const empty = {
  name: "✏️ Eraser",
  key: "e",
  color: "#000000",
  density: 0.5,
};

// FIRE
export const smoke = {
  color: "#333333",
  density: 0.1,
  state: states.gas,
  lifetime: 0.98,
  nextCell: empty,
};
export const fire3 = {
  color: "#ff8800",
  density: 0.1,
  state: states.fire,
  lifetime: 0.88,
  propagation: 0.8,
  nextCell: smoke,
};
export const fire2 = {
  color: "#ff4400",
  density: 0.1,
  state: states.fire,
  lifetime: 0.89,
  propagation: 0.77,
  nextCell: fire3,
};
export const fire = {
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
  name: "🌊 Water",
  key: "w",
  color: "#2222ff",
  density: 1,
  state: states.liquid,
  dousing: true,
};

export const oil = {
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
  name: "🧱 Concrete",
  key: "c",
  color: "#aaaaaa",
  density: 100,
  state: states.solid,
  static: true,
};
export const ice = {
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
export const wood = {
  name: "🌳 Wood",
  key: "d",
  color: "#6a4b34",
  density: 20,
  state: states.solid,
  flammable: 0.99,
  melt: fire,
  static: true,
};
export const sand = {
  name: "🏜️ Sand",
  key: "s",
  color: "#c2b280",
  density: 9,
  state: states.solid,
  granular: true,
  dousing: true,
};
export const salt = {
  name: "🧂 Salt",
  key: "m",
  color: "#eeeeee",
  state: states.solid,
  density: 10,
  granular: true,
}
export const powder = {
  name: "💣 Gunpowder",
  key: "g",
  color: "#555555",
  density: 4,
  state: states.solid,
  granular: true,
  flammable: 0.5,
  melt: fire,
};
export const crystals = {
  name: "💎 Crystals",
  color: "#ff80b6",
  density: 30,
  state: states.solid,
};
export const plant = {
  name: "🌿 Plant",
  key:"p",
  color: "#2bfe20",
  state: states.solid,
  density: 10,
  propagation: 0.6,
  propTarget: water,
  flammable: 0.81,
  melt: fire,
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
