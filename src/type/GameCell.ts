import { Cell } from "./Cell";

/**
 * Store the state of a game cell
 */
export interface GameCell {
  index: number;
  x: number;
  y: number;
  cell: Cell;
}
