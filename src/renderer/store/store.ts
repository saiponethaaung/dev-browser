import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux';
import rootReducer, { RootState } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  Action<string>
>;
export type AwaitableThunk<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  Action<string>
>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunkApi = {
  dispatch: AppDispatch;
  state: RootState;
};
export default store;
