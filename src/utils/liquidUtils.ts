import * as CellType from "../type/Cell";
import * as Game from "../game";

/**
 * Used for Pascal's Law
 * @param cell
 * @param x
 * @param y
 * @returns
 */
export function getHigherCell(cell: CellType.Cell, x: number, y: number) {
  const explored = [];
  const coords = hashCoordinates(x, y);
  explored.push(coords);
  return findHigherCell(cell, x, y, explored, y);
}

function findHigherCell(
  cell: CellType.Cell,
  x: number,
  y: number,
  explored: number[],
  inputHeight: number,
): number[] {
  {
    const upCoordinates = hashCoordinates(x, y - 1);
    if (
      y - 1 >= 0 &&
      Game.getCell(x, y - 1) === cell &&
      !explored.includes(upCoordinates)
    ) {
      explored.push(upCoordinates);
      if (y - 1 < inputHeight - 1) {
        return [x, y - 1];
      }
      const newHeight = findHigherCell(
        Game.getCell(x, y - 1),
        x,
        y - 1,
        explored,
        inputHeight,
      );
      if (newHeight) return newHeight;
    }
  }

  const leftCoordinates = hashCoordinates(x - 1, y);
  if (
    x - 1 >= 0 &&
    Game.getCell(x - 1, y) === cell &&
    !explored.includes(leftCoordinates)
  ) {
    explored.push(leftCoordinates);
    const newHeight = findHigherCell(
      Game.getCell(x - 1, y),
      x - 1,
      y,
      explored,
      inputHeight,
    );
    if (newHeight) return newHeight;
  }

  const rightCoordinates = hashCoordinates(x + 1, y);
  if (
    x + 1 < Game.getWidth() &&
    Game.getCell(x + 1, y) === cell &&
    !explored.includes(rightCoordinates)
  ) {
    explored.push(rightCoordinates);
    const newHeight = findHigherCell(
      Game.getCell(x + 1, y),
      x + 1,
      y,
      explored,
      inputHeight,
    );
    if (newHeight) return newHeight;
  }

  const downCoordinates = hashCoordinates(x, y + 1);
  if (
    y + 1 < Game.getHeight() &&
    Game.getCell(x, y + 1) === cell &&
    !explored.includes(downCoordinates)
  ) {
    explored.push(downCoordinates);
    const newHeight = findHigherCell(cell, x, y + 1, explored, inputHeight);
    if (newHeight) return newHeight;
  }
  return null;
}

function hashCoordinates(x: number, y: number) {
  return x * 3 + y * 5;
}
