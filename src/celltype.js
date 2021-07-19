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
  density: 0.8,
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
export const crystals = {
  name: "💎 Minerals",
  color: "#ff80b6",
  density: 30,
  state: "solid",
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
export const fire3 = {
  color: "#fb1",
  density: 0.1,
  state: "fire",
  lifetime: 0.2,
  nextCell: empty,
};
export const fire2 = {
  color: "#f80",
  density: 0.1,
  state: "fire",
  lifetime: 0.1,
  nextCell: fire3,
};
export const fire = {
  name:"🔥 Fire",
  color: "#ff0000",
  density: 0.2,
  state: "fire",
  lifetime: 0.09,
  nextCell: fire2,
};

export const CellsMap = {
  empty: empty,
  sand: sand,
  floor: floor,
  wood: wood,
  water: water,
  crystals: crystals,
  oil: oil,
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
