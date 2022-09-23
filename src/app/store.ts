import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import tictactoeReducer from '../features/tictactoe/tictactoeSlice';

export const store = configureStore({
  reducer: {
    tictactoe: tictactoeReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
