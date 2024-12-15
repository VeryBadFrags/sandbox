import { States } from "./states.enum.ts";

export type Cell = {
  color: string;
  state?: States;
  density: number;

  name?: string;
  hsl?: number[];
  rgb?: number[];

  /**
   * Keyboard shortcut
   */
  key?: string;
  static?: boolean;
  lifetime?: number;
  propagation?: number;
  propTarget?: Cell;
  spawn?: Cell;
  nextCell?: Cell;
  dousing?: boolean;
  flammable?: number;
  melt?: Cell;
  ash?: Cell;
  drip?: number;
  disolve?: Cell;
  disolveInto?: Cell;
  vector?: Vector;
  /**
   * Some elements like conveyors cycle through multiple colors
   */
  colorSuite?: string[];
  sticky?: boolean;
};

interface Vector {
  x: number;
  y: number;
}

// interface flammable {
//   chance: number;
//   melt: Cell;
//   ash?: Cell;
// }
