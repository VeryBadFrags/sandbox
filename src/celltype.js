export const empty = { color: "#000", density: 0.5 };

// SOLIDS
export const floor = { color: "#aaa", density: 100, state: "solid" };
export const sand = {
  color: "#c2b280",
  density: 9,
  state: "solid",
  granular: true,
};
export const wood = {
  color: "#855e42",
  density: 0.8,
  state: "solid",
  granular: true,
};

export const crystals = { color: "#ff80b6", density: 30, state: "solid" };

// LIQUIDS
export const water = { color: "#22f", density: 1, state: "liquid" };
export const oil = { color: "#722f37", density: 0.5, state: "liquid", flammable: true };

// FIRE
export const fire3 = { color: "#fb1", density: 0.1, state: "fire", lifetime: 0.2, nextCell: empty };
export const fire2 = { color: "#f80", density: 0.1, state: "fire", lifetime: 0.1, nextCell: fire3 };
export const fire = { color: "#ff0000", density: 0.2, state: "fire", lifetime: 0.09, nextCell: fire2 };

export const CellsMap = {
  empty: empty,
  sand: sand,
  floor: floor,
  water: water,
  crystals: crystals,
  oil: oil,
  fire:fire,
};
