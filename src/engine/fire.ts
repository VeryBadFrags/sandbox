import * as Game from "../game";
import { States } from "../types/states.enum";
import { emptyCell } from "../content/CellValues";
import { testNeighbors } from "../utils/engineUtils";
import type { Cell } from "../types/cell.type";
import { getPointsDistance } from "../utils/drawUtils";

const maxLightDistance = 6;

export function process(
  cell: Cell,
  i: number,
  j: number,
  lightMap: number[][],
  dynamicLights: boolean,
) {
  // Douse
  if (
    testNeighbors(
      i,
      j,
      (test: Cell) => test.dousing,
      (current: Cell, x: number, y: number) =>
        current.melt && Math.random() > 0.5
          ? Game.createCell(x, y, current.melt)
          : null,
    ) > 0
  ) {
    const lastCell =
      cell.nextCell.state === States.fire
        ? cell.nextCell.nextCell
        : cell.nextCell;
    Game.createCell(i, j, lastCell);
    return;
  }

  // Extinguish
  if (
    Math.random() > cell.lifetime &&
    testNeighbors(i, j, (test: Cell) => test.flammable > 0) < 1
  ) {
    Game.createCell(i, j, cell.nextCell);
  } else if (
    j > 0 &&
    Math.random() > 0.8 &&
    Game.getCell(i, j - 1) === emptyCell
    // || Game.getCell(i, j - 1).flammable
  ) {
    // Evolve
    Game.createCell(i, j - 1, Math.random() >= 0.5 ? cell.nextCell : cell);
  }

  propagateFire(i, j);

  updateFireLightMap(dynamicLights, j, i, lightMap);
}

function updateFireLightMap(
  dynamicLights: boolean,
  j: number,
  i: number,
  lightMap: number[][],
) {
  if (dynamicLights && Game.getCell(i, j).state === States.fire) {
    for (
      let a = Math.max(i - maxLightDistance, 0);
      a <= Math.min(i + maxLightDistance, Game.getGameWidth() - 1);
      a++
    ) {
      for (
        let b = Math.max(j - maxLightDistance, 0);
        b <= Math.min(j + maxLightDistance, Game.getGameHeight() - 1);
        b++
      ) {
        if ((a !== i || b !== j) && Game.getCell(a, b).state !== States.fire) {
          const distance = getPointsDistance(a, b, i, j);
          lightMap[a][b] =
            lightMap[a][b] + Math.max(0, maxLightDistance - distance);
        }
      }
    }
  }
}

function propagateFire(i: number, j: number) {
  const a = Math.floor(Math.random() * 3) - 1;
  const b = Math.floor(Math.random() * 3) - 1;
  if (
    i + a >= 0 &&
    i + a < Game.getGameWidth() &&
    j + b >= 0 &&
    j + b < Game.getGameHeight()
  ) {
    const target = Game.getCell(i + a, j + b);

    if (target.flammable && Math.random() > target.flammable) {
      Game.createCell(i + a, j + b, target.melt);
      if (
        j + b + 1 < Game.getGameHeight() &&
        target.ash &&
        Game.getCell(i + a, j + b + 1) === emptyCell
      ) {
        Game.createCell(i + a, j + b + 1, target.ash);
      }
    }
  }
}
