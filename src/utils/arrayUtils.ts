import * as CellType from "../types/Cell";

export function initMatrix(
  width: number,
  height: number,
  cell: CellType.Cell | number,
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

export function initArray(
  width: number,
  height: number,
  cell: CellType.Cell,
): Array<CellType.Cell> {
  const newArray = new Array(width * height);
  newArray.fill(cell);
  return newArray;
}

export function wipe1DArray(
  array: Array<CellType.Cell>,
  value: CellType.Cell,
): void {
  array.fill(value);
  // array.forEach((cell) => (cell = value));
}

export function wipe2DMatrix(
  matrix: Array<Array<CellType.Cell | number>>,
  value?: CellType.Cell | number,
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

export function getCoordsFromIndex(i: number, width: number): number[] {
  const x = i % width;
  const y = Math.floor(i / width);
  return [x, y];
}
