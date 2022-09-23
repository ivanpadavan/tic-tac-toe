export type Coordinate = { x: number; y: number };
export enum Player {
  x = 'x',
  o = 'o',
}
export const CellState = { empty: undefined, x: Player.x, o: Player.o };
export type CellState = typeof CellState[keyof typeof CellState];
