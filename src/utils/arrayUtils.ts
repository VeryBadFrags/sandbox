import type { Cell } from "../types/cell.type";

export function initMatrix(width: number, height: number, cell: Cell | number) {
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
  cell: Cell,
): Array<Cell> {
  const newArray = new Array(width * height);
  newArray.fill(cell);
  return newArray;
}

export function wipe1DArray(array: Array<Cell>, value: Cell): void {
  array.fill(value);
  // array.forEach((cell) => (cell = value));
}

export function wipe2DMatrix(
  matrix: Array<Array<Cell | number>>,
  value?: Cell | number,
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

export function getCellFromBoard(board: Cell[], x: number, y: number, gameWidth: number) {
  const index = get1DIndex(x, y, gameWidth);
  return board[index];
}

export function get1DIndex(x: number, y: number, width: number) {
  return y * width + x;
}

export function getCoordsFromIndex(i: number, width: number): number[] {
  const x = i % width;
  const y = Math.floor(i / width);
  return [x, y];
}
