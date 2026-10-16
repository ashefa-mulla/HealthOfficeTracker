import { combineReducers } from '@reduxjs/toolkit';
import LoginReducer from './auth/login/reducer';
import Top10TaskReducer from './top10task/top10taskSlice';
import ActivityReducer from './activity/activitySlice';
import LeaveReducer from './leave/leaveSlice';
import EmployeeReducer from './employee/employeeSlice';
import ClientReducer from './client/clientSlice';
import ProjectReducer from './project/projectSlice';
import CategoryReducer from './category/categorySlice';
import AccountCategoryReducer from './accountCategory/accountCategorySlice';
import VendorAccountReducer from './vendorAccount/vendorAccountSlice';
import BankMasterReducer from './bankMaster/bankMasterSlice';
import PurchaseOrderReducer from './purchaseOrder/purchaseOrderSlice';
import ChequeRequestReducer from './chequeRequest/chequeRequestSlice';
import EvaluationReducer from './evaluation/evaluationSlice';
const rootReducer = combineReducers({
  Login: LoginReducer,
  Top10Task: Top10TaskReducer,
  Activity: ActivityReducer,
  Leave: LeaveReducer,
  Employee: EmployeeReducer,
  Client: ClientReducer,
  Project: ProjectReducer,
  Category: CategoryReducer,
  AccountCategory: AccountCategoryReducer,
  VendorAccount: VendorAccountReducer,
  BankMaster: BankMasterReducer,
  PurchaseOrder: PurchaseOrderReducer,
  ChequeRequest: ChequeRequestReducer,
  Evaluation: EvaluationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
