import { createAsyncThunk } from '@reduxjs/toolkit';
import vendorAccountService from '../../services/vendorAccountService';
import accountCategoryService from '../../services/accountCategoryService';
import toastService from '../../services/toastService';
import { VendorAccountForm } from '../../types/vendorAccount/vendorAccount.schema';
import {
  toVendorAccountForm,
  toVendorAccountModel,
} from '../../types/vendorAccount/vendorAccount.mapper';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setCategories,
  setError,
  saveSuccess,
  deleteSuccess,
} from './vendorAccountSlice';

export const fetchVendorAccountList = createAsyncThunk(
  'vendorAccount/fetchVendorAccountList',
  async (_: void, { dispatch }) => {
    try {
      dispatch(setLoading());
      const list = await vendorAccountService.getVendorAccountList();
      dispatch(fetchSuccess(list));
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch vendor accounts';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchVendorAccountById = createAsyncThunk(
  'vendorAccount/fetchVendorAccountById',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading());
      const [data, numbers] = await Promise.all([
        vendorAccountService.getVendorAccount(id),
        vendorAccountService.getVendorAccountNumbers(id).catch(() => []),
      ]);
      const form = toVendorAccountForm(data, numbers);
      dispatch(setSelected(form));
      return form;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch vendor account details';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveVendorAccount = createAsyncThunk(
  'vendorAccount/saveVendorAccount',
  async (form: VendorAccountForm, { dispatch }) => {
    try {
      dispatch(setSaving());
      const response = await vendorAccountService.addEditVendorAccount(
        toVendorAccountModel(form)
      );
      const msg = Number(form.id) > 0 ? 'Record is updated' : 'Record is saved';
      dispatch(saveSuccess(msg));
      toastService.success(msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save vendor account';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removeVendorAccount = createAsyncThunk(
  'vendorAccount/removeVendorAccount',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await vendorAccountService.deleteVendorAccount(id);
      dispatch(deleteSuccess(id));
      toastService.success('Record deleted');
      return id;
    } catch (error: any) {
      const errorMsg = error?.message || 'Error deleting record';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

/** Active account categories for the Category dropdown (GET api/AccountCategory/GetAllAccountCategoryList). */
export const fetchVendorCategories = createAsyncThunk(
  'vendorAccount/fetchVendorCategories',
  async (_: void, { dispatch }) => {
    try {
      const list = await accountCategoryService.getAccountCategoryList();
      dispatch(
        setCategories(
          list
            .filter((c) => c.active !== false)
            .map((c) => ({ id: Number(c.id), name: c.name || '' }))
        )
      );
    } catch (error: any) {
      console.error('Error fetching account categories:', error?.message);
    }
  }
);
