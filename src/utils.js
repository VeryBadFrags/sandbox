export function isFuelAround(x, y, pixelGrid) {
  for (
    let i = Math.max(x - 1, 0);
    i <= Math.min(x + 1, pixelGrid.length);
    i++
  ) {
    for (
      let j = Math.max(y - 1, 0);
      j <= Math.min(y + 1, pixelGrid[x].length);
      j++
    ) {
      if (i !== x || j !== y) {
        if (pixelGrid[i][j].flammable) return true;
      }
    }
  }
  return false;
}

export function countNeighbors(x, y, pixelGrid, cellTypes) {
  let count = 0;
  for (
    let i = Math.max(x - 1, 0);
    i <= Math.min(x + 1, pixelGrid.length);
    i++
  ) {
    for (
      let j = Math.max(y - 1, 0);
      j <= Math.min(y + 1, pixelGrid[x].length);
      j++
    ) {
      if (i !== x || j !== y) {
        for (let a = 0; a < cellTypes.length; a++) {
          if (pixelGrid[i][j] === cellTypes[a]) {
            count++;
          }
        }
      }
    }
  }
  return count;
}

function countNeighborType(x, y, pixelGrid, testNeighbor) {
  let count = 0;
  for (
    let i = Math.max(x - 1, 0);
    i <= Math.min(x + 1, pixelGrid.length);
    i++
  ) {
    for (
      let j = Math.max(y - 1, 0);
      j <= Math.min(y + 1, pixelGrid[x].length);
      j++
    ) {
      if (i !== x || j !== y) {
        if (testNeighbor(pixelGrid[i][j])) {
          count++;
        }
      }
    }
  }
  return count;
}
