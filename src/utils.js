import * as CellType from "./celltype.js";

export function wipeMatrix(matrix, value) {
  if (matrix.length < 1 || matrix[0].length < 1) {
    return null;
  }
  let width = matrix.length;
  let height = matrix[0].length;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      matrix[x][y] = value;
    }
  }
}

export function initArray(width, height, cell = CellType.empty) {
  let newArray = new Array(width);
  for (let i = 0; i < width; i++) {
    newArray[i] = new Array(height);
    for (let j = 0; j < height; j++) {
      newArray[i][j] = cell;
    }
  }
  return newArray;
}

export function isFuelAround(x, y, pixelGrid) {
  for (
    let i = Math.max(x - 1, 0);
    i <= Math.min(x + 1, pixelGrid.length - 1);
    i++
  ) {
    for (
      let j = Math.max(y - 1, 0);
      j <= Math.min(y + 1, pixelGrid[x].length - 1);
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
    i <= Math.min(x + 1, pixelGrid.length - 1);
    i++
  ) {
    for (
      let j = Math.max(y - 1, 0);
      j <= Math.min(y + 1, pixelGrid[x].length - 1);
      j++
    ) {
      if (i !== x || j !== y) {
        if (pixelGrid[i][j] === cellTypes) {
          count++;
        }
      }
    }
  }
  return count;
}

export function testNeighbors(x, y, pixelGrid, testNeighbor) {
  let count = 0;
  for (
    let i = Math.max(x - 1, 0);
    i <= Math.min(x + 1, pixelGrid.length - 1);
    i++
  ) {
    for (
      let j = Math.max(y - 1, 0);
      j <= Math.min(y + 1, pixelGrid[x].length - 1);
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

export function hextoRGB(hex) {
  hex = hex.replace(/#/g, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map(function (hex) {
        return hex + hex;
      })
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
      .map(function (hex) {
        return hex + hex;
      })
      .join("");
  }
  var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(hex);
  if (!result) {
    return null;
  }
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    var d = max - min;
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
  return Math.sqrt(
    Math.pow(Math.abs(a2 - a1), 2) + Math.pow(Math.abs(b2 - b1), 2)
  );
}

export function createIntermediatePoints(a1, b1, a2, b2) {
  let points = [];
  let aDistance = Math.abs(a2 - a1);
  let bDistance = Math.abs(b2 - b1);
  if (aDistance > bDistance) {
    let leftToRight = a1 < a2;
    for (
      let i = a1;
      leftToRight ? i <= a2 : i >= a2;
      leftToRight ? i++ : i--
    ) {
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
      let progress = (j - Math.min(b1,b2)) / bDistance;
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
