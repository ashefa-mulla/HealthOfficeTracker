import { combineReducers } from '@reduxjs/toolkit';
import LoginReducer from './auth/login/reducer';
import Top10TaskReducer from './top10task/top10taskSlice';
import ActivityReducer from './activity/activitySlice';
import LeaveReducer from './leave/leaveSlice';
const rootReducer = combineReducers({
  Login: LoginReducer,
  Top10Task: Top10TaskReducer,
  Activity: ActivityReducer,
    Leave: LeaveReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
