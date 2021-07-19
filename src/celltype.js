export const empty = { color: "#000", density: 0.5 };
export const floor = { color: "#aaa", density: 100, state: "solid" };

// SOLIDS
export const sand = {
  color: "#c2b280",
  density: 8,
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
export const oil = { color: "#722f37", density: 0.5, state: "liquid" };

export const CellsMap = {
  empty: empty,
  sand: sand,
  floor: floor,
  water: water,
  crystals: crystals,
  oil: oil,
};
