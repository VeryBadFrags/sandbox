export function isFuelAround(x, y, pixelGrid) {
  if (x > 0 && pixelGrid[x - 1][y].flammable) return true;
  if (x < pixelGrid.length - 1 && pixelGrid[x + 1][y].flammable) return true;
  if (y > 0 && pixelGrid[x][y - 1].flammable) return true;
  if (x < pixelGrid[x].length - 1 && pixelGrid[x][y + 1].flammable) return true;
  return false;
}
