import React from 'react';
import Login from '../pages/Authentication/login';
import MfaVerification from '../pages/Authentication/MfaVerification';
import MfaSetup from '../pages/Authentication/MfaSetup';
import OAuthCallback from '../pages/Authentication/OAuthCallback';
import Dashboard from '../pages/Dashboard';
import Employees, { EmployeeList, EmployeeCreate } from '../pages/Employees';
import { ClientList, ClientCreate } from '../pages/Clients';
import { ProjectList, ProjectCreate } from '../pages/Projects';
import { CategoryList, CategoryCreate } from '../pages/Categories';
import { AccountCategoryList, AccountCategoryCreate } from '../pages/AccountCategories';
import { VendorAccountList, VendorAccountCreate } from '../pages/VendorAccounts';
import { BankMasterList, BankMasterCreate } from '../pages/BankMasters';
import { PurchaseOrderList, PurchaseOrderCreate } from '../pages/PurchaseOrders';
import { ChequeRequestList, ChequeRequestCreate } from '../pages/ChequeRequests';
import { EvaluationList } from '../pages/Evaluation';
import Attendance from '../pages/Attendance';
import Timer from '../pages/Timer';
import Tasks, { Top10TaskList, Top10TaskCreate } from '../pages/Tasks';
import TaskActivityList from '../pages/Activities';
import DailyToDo from '../pages/DailyToDo';
import Locations from '../pages/Locations';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import { ApplyLeaveList, ApplyLeaveCreate } from '../pages/Leave';

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
  { path: '/area/employee/list', component: <EmployeeList /> },
  { path: '/area/employee/create', component: <EmployeeCreate /> },
  { path: '/area/employee/edit/:id', component: <EmployeeCreate /> },
  { path: '/area/client/list', component: <ClientList /> },
  { path: '/area/client/create', component: <ClientCreate /> },
  { path: '/area/client/edit/:id', component: <ClientCreate /> },
  { path: '/area/project/list', component: <ProjectList /> },
  { path: '/area/project/create', component: <ProjectCreate /> },
  { path: '/area/project/edit/:id', component: <ProjectCreate /> },
  { path: '/area/category/list', component: <CategoryList /> },
  { path: '/area/category/create', component: <CategoryCreate /> },
  { path: '/area/category/edit/:id', component: <CategoryCreate /> },
  { path: '/area/accountcategory/list', component: <AccountCategoryList /> },
  { path: '/area/accountcategory/create', component: <AccountCategoryCreate /> },
  { path: '/area/accountcategory/edit/:id', component: <AccountCategoryCreate /> },
  { path: '/area/vendoraccount/list', component: <VendorAccountList /> },
  { path: '/area/vendoraccount/create', component: <VendorAccountCreate /> },
  { path: '/area/vendoraccount/edit/:id', component: <VendorAccountCreate /> },
  { path: '/area/bankmaster/list', component: <BankMasterList /> },
  { path: '/area/bankmaster/create', component: <BankMasterCreate /> },
  { path: '/area/bankmaster/edit/:id', component: <BankMasterCreate /> },
  { path: '/area/purchaseorder/list', component: <PurchaseOrderList /> },
  { path: '/area/purchaseorder/create', component: <PurchaseOrderCreate /> },
  { path: '/area/purchaseorder/edit/:id', component: <PurchaseOrderCreate /> },
  { path: '/area/chequerequest/list', component: <ChequeRequestList /> },
  { path: '/area/chequerequest/create', component: <ChequeRequestCreate /> },
  { path: '/area/chequerequest/edit/:id', component: <ChequeRequestCreate /> },
  { path: '/area/evaluation/list', component: <EvaluationList /> },
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
  { path: '/area/dailytodo', component: <DailyToDo /> },
  { path: '/area/dailytodo/list', component: <DailyToDo /> },
  { path: '/dailytodo', component: <DailyToDo /> },  
  { path: '/area/leavetransaction/list', component: <ApplyLeaveList /> },
  { path: '/area/leavetransaction/create', component: <ApplyLeaveCreate /> },
  { path: '/area/leavetransaction/edit/:id', component: <ApplyLeaveCreate /> },
  { path: '/locations', component: <Locations /> },
  { path: '/reports', component: <Reports /> },
  { path: '/settings', component: <Settings /> },
  { path: '/', component: <Dashboard /> },
];

export { publicRoutes, authProtectedRoutes };
