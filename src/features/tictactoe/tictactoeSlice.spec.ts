import { range } from '../../utils';
import tictactoeReducer, { initialState, makeMove, TicTacToeState, winCondition } from './tictactoeSlice';
import { Player } from './types';

describe('tictactoe reducer', () => {
  it('should change active player each valid turn', () => {
    const x = 0;
    let y = 0;
    let state: TicTacToeState = { turn: Player.x };
    for (let iter = 0; iter < 10; iter++) {
      state = tictactoeReducer(state, makeMove({ x, y: y++ }));
      const player = iter % 2 === 1 ? Player.x : Player.o;
      expect(state.turn).toEqual(player);
    }
  });
  it('dont change state when cell is non-empty', () => {
    const x = 0;
    const y = 0;
    let state: TicTacToeState = { turn: Player.x, 0: { 0: Player.o } };
    for (let iter = 0; iter < 10; iter++) {
      expect(state).toEqual(tictactoeReducer(state, makeMove({ x, y })));
    }
  });
  it('will start the game over if some player become a winner', () => {
    const x = 0;
    const y = winCondition - 1;
    const state: TicTacToeState = {
      turn: Player.o,
      0: Object.fromEntries(
        range(winCondition - 1).map((idx) => [idx, Player.o])
      ),
    };
    expect(initialState).toEqual(tictactoeReducer(state, makeMove({ x, y })));
  });
});
