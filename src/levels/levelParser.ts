import * as Game from "../game.ts";
import type { Cell } from "../types/cell.type.ts";

interface Level {
  taps: Array<unknown>;
  tiles: Array<gameCell>;
}

interface gameCell {
  x: number;
  y: number;
  cell: Cell;
}

export function parseLevel(level: Level) {
  for (const tile of level.tiles) {
    Game.createCell(tile.x, tile.y, tile.cell);
  }
}
