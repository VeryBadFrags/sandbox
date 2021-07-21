export const empty = { name: "✏️ Eraser", color: "#000", density: 0.5 };

// FIRE
export const smoke = {
  color: "#333",
  density: 0.1,
  state: "gas",
  lifetime: 0.98,
  nextCell: empty,
};
export const fire3 = {
  color: "#f80",
  density: 0.1,
  state: "fire",
  lifetime: 0.88,
  propagation: 0.8,
  nextCell: smoke,
};
export const fire2 = {
  color: "#f40",
  density: 0.1,
  state: "fire",
  lifetime: 0.89,
  propagation: 0.77,
  nextCell: fire3,
};
export const fire = {
  name: "🔥 Fire",
  color: "#e00000",
  density: 0.2,
  state: "fire",
  lifetime: 0.90,
  propagation: 0.75,
  nextCell: fire2,
};

// LIQUIDS
export const water = {
  name: "🌊 Water",
  color: "#22f",
  density: 1,
  state: "liquid",
  dousing: true,
};

export const oil = {
  name: "🛢️ Oil",
  color: "#963e48",
  density: 0.5,
  state: "liquid",
  flammable: 0.7,
  melt: fire,
};

// SOLIDS
export const floor = {
  name: "🧱 Concrete",
  color: "#aaa",
  density: 100,
  state: "solid",
  static: true,
};
export const ice = {
  name: "🧊 Ice",
  color: "#00ffff",
  density: 0.9,
  state: "solid",
  propagation: 0.996,
  lifetime: 0.999,
  drip: 0.999,
  static: true,
  melt: water,
}
export const wood = {
  name: "🌳 Wood",
  color: "#6a4b34",
  density: 20,
  state: "solid",
  flammable: 0.99,
  melt: fire,
  static: true,
};
export const sand = {
  name: "🏜️ Sand",
  color: "#c2b280",
  density: 9,
  state: "solid",
  granular: true,
  dousing: true,
};
export const powder = {
  name: "💣 Gunpowder",
  color: "#555",
  density: 4,
  state: "solid",
  granular: true,
  flammable: 0.5,
  melt: fire,
};
export const crystals = {
  name: "💎 Crystals",
  color: "#ff80b6",
  density: 30,
  state: "solid",
};
export const plant = {
  name: "🌿 Plant",
  color: "#2bfe20",
  state: "solid",
  density: 10,
  propagation: 0.6,
  propTarget: water,
  flammable: 0.8,
  melt: fire,
  static: true,
};

export const CellsMap = {
  empty: empty,
  sand: sand,
  floor: floor,
  wood: wood,
  water: water,
  ice: ice,
  powder: powder,
  oil: oil,
  plant: plant,
  crystals: crystals,
  fire: fire,
};

{
  let select = document.getElementById("brush-type");
  for (let cell in CellsMap) {
    var opt = document.createElement("option");
    opt.value = cell;
    opt.innerHTML = CellsMap[cell].name;
    select.appendChild(opt);
  }
  select.selected = CellsMap[2];
}
