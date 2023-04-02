import * as CellType from "../celltype";

export function init2DArray(
  width: number,
  height: number,
  cell: CellType.Cell | number
) {
  const newArray = new Array(width);
  for (let x = 0; x < width; x++) {
    const newRow = new Array(height);
    for (let y = 0; y < height; y++) {
      newRow[y] = cell;
    }
    newArray[x] = newRow;
  }
  return newArray;
}

export function init1DArray(
  width: number,
  height: number,
  cell: CellType.Cell | number
) {
  const newArray = new Array(width);
  for (let x = 0; x < width * height; x++) {
    newArray[x] = cell;
  }
  return newArray;
}

export function get1DIndex(x: number, y: number, width: number) {
  return y * width + x;
}
