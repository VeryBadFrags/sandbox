import * as Game from "../game";
import * as CellType from "../type/Cell";

interface Level {
  taps: Array<unknown>;
  tiles: Array<gameCell>;
}

interface gameCell {
  x: number;
  y: number;
  cell: CellType.Cell;
}

export function parseLevel(level: Level) {
  for (const tile of level.tiles) {
    Game.createCell(tile.x, tile.y, tile.cell);
  }
}
