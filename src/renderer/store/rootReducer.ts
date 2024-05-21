import { combineReducers } from '@reduxjs/toolkit';
import sessionSlice from './sessionSlice';

const rootReducer = combineReducers({
  session: sessionSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
