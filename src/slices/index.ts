import { combineReducers } from '@reduxjs/toolkit';
import LoginReducer from './auth/login/reducer';
import Top10TaskReducer from './top10task/top10taskSlice';
import ActivityReducer from './activity/activitySlice';

const rootReducer = combineReducers({
  Login: LoginReducer,
  Top10Task: Top10TaskReducer,
  Activity: ActivityReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
