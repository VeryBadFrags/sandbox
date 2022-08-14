import * as CellType from "../celltype";

export function initArray(
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
