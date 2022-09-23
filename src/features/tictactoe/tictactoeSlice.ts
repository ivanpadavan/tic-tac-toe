import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sum } from '../../utils';
import { CellState, Coordinate, Player } from './types';

export interface TicTacToeState {
  turn: Player;
  [x: number]: { [y: number]: CellState };
}
export const initialState: TicTacToeState = {
  0: { 0: CellState.x },
  turn: Player.o,
};
export const winCondition = (() => {
  const winConditionString = process.env.REACT_APP_WIN_CONDITION;
  if (winConditionString === parseInt(winConditionString).toString(10)) return parseInt((winConditionString))
  return 5;
})()
function hasWinner(state: TicTacToeState, { x, y }: Coordinate) {
  const directions: [[number, number], [number, number]][] = [
    [
      [-1, -1],
      [1, 1],
    ],
    [
      [-1, 0],
      [1, 0],
    ],
    [
      [0, -1],
      [0, 1],
    ],
    [
      [1, -1],
      [-1, 1],
    ],
  ];
  const countPath = (subdirection: [number, number]) => {
    let step = 1;
    while (
      state[x + subdirection[0] * step]?.[y + subdirection[1] * step] ===
      state.turn
    )
      step++;
    return step - 1;
  };
  const hasWinner = !!directions
    .map((subdirections) => subdirections.map(countPath).reduce(sum) + 1)
    .find((v) => v >= winCondition);
  return hasWinner ? state.turn : undefined;
}

export const tictactoeSlice = createSlice({
  name: 'tictactoe',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    makeMove: (state, action: PayloadAction<Coordinate>) => {
      const { x, y } = action.payload;
      if (state[x]?.[y] !== CellState.empty) return;
      if (hasWinner(state, action.payload)) return initialState;

      state[x] = { ...(state[x] ?? {}), [y]: state.turn };
      state.turn = state.turn === Player.o ? Player.x : Player.o;
    },
  },
});
export const { makeMove } = tictactoeSlice.actions;
export default tictactoeSlice.reducer;
