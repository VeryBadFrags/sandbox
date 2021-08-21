import * as CellType from "./celltype.js";

export function wipeMatrix(matrix, value) {
  let width = matrix.length;
  let height = matrix[0].length;
  for (let x = 0; x < width; x++) {
    let column = matrix[x];
    for (let y = 0; y < height; y++) {
      column[y] = value;
    }
  }
}

export function initArray(width, height, cell = CellType.empty) {
  let newArray = new Array(width);
  for (let x = 0; x < width; x++) {
    let newRow = new Array(height);
    for (let y = 0; y < height; y++) {
      newRow[y] = cell;
    }
    newArray[x] = newRow;
  }
  return newArray;
}

export function copyArray(arrayToCopy) {
  return arrayToCopy.map((row) => row.slice());
}

export function isFuelAround(x, y, pixelGrid) {
  let xMax = Math.min(x + 1, pixelGrid.length - 1);
  let yMax = Math.min(y + 1, pixelGrid[0].length - 1);
  for (let i = Math.max(x - 1, 0); i <= xMax; i++) {
    let column = pixelGrid[i];
    for (let j = Math.max(y - 1, 0); j <= yMax; j++) {
      if (i !== x || j !== y) {
        if (column[j].flammable) return true;
      }
    }
  }
  return false;
}

export function getHigherCell(cell, x, y, pixelGrid) {
  let explored = [];
  let coords = hashCoordinates(x, y);
  explored.push(coords);
  let highest = findHigherCell(cell, x, y, pixelGrid, explored, y);
  return highest;
}

function findHigherCell(cell, x, y, pixelGrid, explored, inputHeight) {
  {
    let upCoordinates = hashCoordinates(x, y - 1);
    if (
      y - 1 >= 0 &&
      pixelGrid[x][y - 1] === cell &&
      !explored.includes(upCoordinates)
    ) {
      explored.push(upCoordinates);
      if (y - 1 < inputHeight - 1) {
        return [x, y - 1];
      }
      let newHeight = findHigherCell(
        pixelGrid[x][y - 1],
        x,
        y - 1,
        pixelGrid,
        explored,
        inputHeight
      );
      if (newHeight) return newHeight;
    }
  }

  let leftCoordinates = hashCoordinates(x - 1, y);
  if (
    x - 1 >= 0 &&
    pixelGrid[x - 1][y] === cell &&
    !explored.includes(leftCoordinates)
  ) {
    explored.push(leftCoordinates);
    let newHeight = findHigherCell(
      pixelGrid[x - 1][y],
      x - 1,
      y,
      pixelGrid,
      explored,
      inputHeight
    );
    if (newHeight) return newHeight;
  }

  let rightCoordinates = hashCoordinates(x + 1, y);
  if (
    x + 1 < pixelGrid.length &&
    pixelGrid[x + 1][y] === cell &&
    !explored.includes(rightCoordinates)
  ) {
    explored.push(rightCoordinates);
    let newHeight = findHigherCell(
      pixelGrid[x + 1][y],
      x + 1,
      y,
      pixelGrid,
      explored,
      inputHeight
    );
    if (newHeight) return newHeight;
  }

  let downCoordinates = hashCoordinates(x, y + 1);
  if (
    y + 1 < pixelGrid[x].length &&
    pixelGrid[x][y + 1] === cell &&
    !explored.includes(downCoordinates)
  ) {
    explored.push(downCoordinates);
    let newHeight = findHigherCell(
      cell,
      x,
      y + 1,
      pixelGrid,
      explored,
      inputHeight
    );
    if (newHeight) return newHeight;
  }
  return null;
}

function hashCoordinates(x, y) {
  return x * 3 + y * 5;
}

export function countNeighbors(x, y, pixelGrid, neighType) {
  let count = 0;
  let xMax = Math.min(x + 1, pixelGrid.length - 1);
  let yMax = Math.min(y + 1, pixelGrid[0].length - 1);
  for (let i = Math.max(x - 1, 0); i <= xMax; i++) {
    let column = pixelGrid[i];
    for (let j = Math.max(y - 1, 0); j <= yMax; j++) {
      if (i !== x || j !== y) {
        if (column[j] === neighType) {
          count++;
        }
      }
    }
  }
  return count;
}

export function testNeighbors(x, y, pixelGrid, testFunction) {
  let count = 0;
  let xMax = Math.min(x + 1, pixelGrid.length - 1);
  let yMax = Math.min(y + 1, pixelGrid[0].length - 1);
  for (let i = Math.max(x - 1, 0); i <= xMax; i++) {
    let column = pixelGrid[i];
    for (let j = Math.max(y - 1, 0); j <= yMax; j++) {
      if (i !== x || j !== y) {
        if (testFunction(column[j])) {
          count++;
        }
      }
    }
  }
  return count;
}

export function hextoRGB(hex) {
  hex = hex.replace(/#/g, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((val) => val * 2)
      .join("");
  }
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(
    hex
  );
  if (result) {
    let red = parseInt(result[1], 16);
    let green = parseInt(result[2], 16);
    let blue = parseInt(result[3], 16);

    return [red, green, blue];
  } else {
    return null;
  }
}

export function hexToHSL(hex) {
  hex = hex.replace(/#/g, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((val) => val * 2)
      .join("");
  }
  let result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(hex);
  if (!result) {
    return null;
  }
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return [h, s, l];
}

export function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function getDistance(a1, b1, a2, b2) {
  return Math.sqrt((a2 - a1) ** 2 + (b2 - b1) ** 2);
}

export function createIntermediatePoints(a1, b1, a2, b2) {
  let points = [];
  let aDistance = Math.abs(a2 - a1);
  let bDistance = Math.abs(b2 - b1);
  if (aDistance > bDistance) {
    let leftToRight = a1 < a2;
    for (let i = a1; leftToRight ? i <= a2 : i >= a2; leftToRight ? i++ : i--) {
      let progress = (i - Math.min(a1, a2)) / aDistance;
      let j;
      if (leftToRight) {
        j = Math.round((b2 - b1) * progress + b1);
      } else {
        j = Math.round((b1 - b2) * progress + b2);
      }
      points.push([i, j]);
    }
  } else {
    let upToDown = b1 < b2;
    for (
      let j = upToDown ? b1 + 1 : b1 - 1;
      upToDown ? j < b2 : j > b2;
      upToDown ? j++ : j--
    ) {
      let progress = (j - Math.min(b1, b2)) / bDistance;
      let i;
      if (upToDown) {
        i = Math.round((a2 - a1) * progress + a1);
      } else {
        i = Math.round((a1 - a2) * progress + a2);
      }
      points.push([i, j]);
    }
  }
  return points;
}
