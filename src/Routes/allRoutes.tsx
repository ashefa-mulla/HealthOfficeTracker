import React from 'react';
import Login from '../pages/Authentication/login';
import MfaVerification from '../pages/Authentication/MfaVerification';
import MfaSetup from '../pages/Authentication/MfaSetup';
import OAuthCallback from '../pages/Authentication/OAuthCallback';
import Dashboard from '../pages/Dashboard';
import Employees from '../pages/Employees';
import Attendance from '../pages/Attendance';
import Timer from '../pages/Timer';
import Tasks, { Top10TaskList, Top10TaskCreate } from '../pages/Tasks';
import TaskActivityList from '../pages/Activities';
import Locations from '../pages/Locations';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

export interface RouteProps {
  path: string;
  component: React.ReactNode;
  exact?: boolean;
}

const publicRoutes: Array<RouteProps> = [
  { path: '/login', component: <Login /> },
  { path: '/mfa-verification', component: <MfaVerification /> },
  { path: '/mfa-setup', component: <MfaSetup /> },
  { path: '/oauth-callback', component: <OAuthCallback /> },
];

const authProtectedRoutes: Array<RouteProps> = [
  { path: '/dashboard', component: <Dashboard /> },
  { path: '/employees', component: <Employees /> },
  { path: '/attendance', component: <Attendance /> },
  { path: '/timer', component: <Timer /> },
  { path: '/area/timer', component: <Timer /> },
  { path: '/clock-in', component: <Timer /> },
  { path: '/tasks', component: <Tasks /> },
  { path: '/tasks/create', component: <Top10TaskCreate /> },
  { path: '/tasks/edit/:id', component: <Top10TaskCreate /> },
  { path: '/area/top10task/list', component: <Top10TaskList /> },
  { path: '/area/top10task/create', component: <Top10TaskCreate /> },
  { path: '/area/top10task/edit/:id', component: <Top10TaskCreate /> },
  { path: '/area/top10task/top10task/edit/:id', component: <Top10TaskCreate /> },
  { path: '/module/area/top10task/list', component: <Top10TaskList /> },
  { path: '/area/taskactivity', component: <TaskActivityList /> },
  { path: '/area/taskactivity/list', component: <TaskActivityList /> },
  { path: '/taskactivity', component: <TaskActivityList /> },
  { path: '/activities', component: <TaskActivityList /> },
  { path: '/my-activities', component: <TaskActivityList /> },
  { path: '/locations', component: <Locations /> },
  { path: '/reports', component: <Reports /> },
  { path: '/settings', component: <Settings /> },
  { path: '/', component: <Dashboard /> },
];

export { publicRoutes, authProtectedRoutes };
