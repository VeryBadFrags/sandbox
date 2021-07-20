export const empty = { name: "✏️ Eraser", color: "#000", density: 0.5 };

// SOLIDS
export const floor = {
  name: "🧱 Concrete",
  color: "#aaa",
  density: 100,
  state: "solid",
  static: true,
};
export const wood = {
  name: "🌳 Wood",
  color: "#6a4b34",
  density: 20,
  state: "solid",
  flammable: true,
  static: true,
};
export const sand = {
  name: "🏜️ Sand",
  color: "#c2b280",
  density: 9,
  state: "solid",
  granular: true,
};
export const powder = {
  name: "💣 Gunpowder",
  color: "#444",
  density: 3,
  state: "solid",
  granular: true,
  flammable: true,
};
export const crystals = {
  name: "💎 Minerals",
  color: "#ff80b6",
  density: 30,
  state: "solid",
};
export const plant = {
  name: "🌿 Plant",
  color: "#2bfe20",
  state: "solid",
  density: 10,
  propagation: 0.4,
  flammable: true,
  static: true,
};

// LIQUIDS
export const water = {
  name: "🌊 Water",
  color: "#22f",
  density: 1,
  state: "liquid",
};
export const oil = {
  name: "🛢️ Oil",
  color: "#722f37",
  density: 0.5,
  state: "liquid",
  flammable: true,
};

// FIRE
export const smoke = {
  color: "#222",
  density: 0.1,
  state: "gas",
  lifetime: 0.98,
  nextCell: empty,
};
export const fire3 = {
  color: "#f80",
  density: 0.1,
  state: "fire",
  lifetime: 0.85,
  propagation: 0.7,
  nextCell: smoke,
};
export const fire2 = {
  color: "#f40",
  density: 0.1,
  state: "fire",
  lifetime: 0.9,
  propagation: 0.75,
  nextCell: fire3,
};
export const fire = {
  name: "🔥 Fire",
  color: "#ff0000",
  density: 0.2,
  state: "fire",
  lifetime: 0.91,
  propagation: 0.8,
  nextCell: fire2,
};

export const CellsMap = {
  empty: empty,
  sand: sand,
  floor: floor,
  wood: wood,
  water: water,
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
