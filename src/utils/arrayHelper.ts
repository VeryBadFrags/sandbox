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

export function copyArray(arrayToCopy: Array<[]>) {
  return arrayToCopy.map((row: []) => row.slice());
}

export function wipeMatrix(
  matrix: Array<Array<CellType.Cell | number>>,
  value?: CellType.Cell | number
) {
  const width = matrix.length;
  const height = matrix[0].length;
  for (let x = 0; x < width; x++) {
    const column = matrix[x];
    for (let y = 0; y < height; y++) {
      column[y] = value;
    }
  }
}

export function get1DIndex(x: number, y: number, width: number) {
  return y * width + x;
}
