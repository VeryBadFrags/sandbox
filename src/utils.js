import * as CellType from "./celltype.js";

export function initArray(width, height, cell = CellType.empty) {
  let newArray = new Array(width);
  for (let i = 0; i < newArray.length; i++) {
    newArray[i] = new Array(height);
    for (let j = 0; j < newArray[i].length; j++) {
      newArray[i][j] = cell;
    }
  }
  return newArray;
}

export function isFuelAround(x, y, pixelGrid) {
  for (
    let i = Math.max(x - 1, 0);
    i <= Math.min(x + 1, pixelGrid.length -1);
    i++
  ) {
    for (
      let j = Math.max(y - 1, 0);
      j <= Math.min(y + 1, pixelGrid[x].length -1);
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
    i <= Math.min(x + 1, pixelGrid.length -1);
    i++
  ) {
    for (
      let j = Math.max(y - 1, 0);
      j <= Math.min(y + 1, pixelGrid[x].length -1);
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

export function countNeighborType(x, y, pixelGrid, testNeighbor) {
  let count = 0;
  for (
    let i = Math.max(x - 1, 0);
    i <= Math.min(x + 1, pixelGrid.length -1);
    i++
  ) {
    for (
      let j = Math.max(y - 1, 0);
      j <= Math.min(y + 1, pixelGrid[x].length -1);
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
