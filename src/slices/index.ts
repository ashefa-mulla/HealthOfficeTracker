import { combineReducers } from '@reduxjs/toolkit';
import LoginReducer from './auth/login/reducer';

const rootReducer = combineReducers({
  Login: LoginReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
