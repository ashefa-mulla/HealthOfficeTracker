import { combineReducers } from '@reduxjs/toolkit';
import LoginReducer from './auth/login/reducer';
import Top10TaskReducer from './top10task/top10taskSlice';

const rootReducer = combineReducers({
  Login: LoginReducer,
  Top10Task: Top10TaskReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
