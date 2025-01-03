import { combineReducers } from '@reduxjs/toolkit';
import sessionSlice from './sessionSlice';
import recordSlice from '../components/records/record.slice';

const rootReducer = combineReducers({
  session: sessionSlice,
  record: recordSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
