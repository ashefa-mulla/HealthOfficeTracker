import React from 'react';
import Login from '../pages/Authentication/login';
import MfaVerification from '../pages/Authentication/MfaVerification';
import MfaSetup from '../pages/Authentication/MfaSetup';
import OAuthCallback from '../pages/Authentication/OAuthCallback';
import Dashboard from '../pages/Dashboard';
import Employees from '../pages/Employees';
import Attendance from '../pages/Attendance';
import Timer from '../pages/Timer';
import Tasks from '../pages/Tasks';
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
  { path: '/locations', component: <Locations /> },
  { path: '/reports', component: <Reports /> },
  { path: '/settings', component: <Settings /> },
  { path: '/', component: <Dashboard /> },
];

export { publicRoutes, authProtectedRoutes };
