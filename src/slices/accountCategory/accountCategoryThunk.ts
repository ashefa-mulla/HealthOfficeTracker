import { createAsyncThunk } from '@reduxjs/toolkit';
import accountCategoryService from '../../services/accountCategoryService';
import toastService from '../../services/toastService';
import { AccountCategoryForm } from '../../types/accountCategory/accountCategory.schema';
import {
  toAccountCategoryForm,
  toAccountCategoryModel,
} from '../../types/accountCategory/accountCategory.mapper';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setError,
  saveSuccess,
  deleteSuccess,
} from './accountCategorySlice';

export const fetchAccountCategoryList = createAsyncThunk(
  'accountCategory/fetchAccountCategoryList',
  async (_: void, { dispatch }) => {
    try {
      dispatch(setLoading());
      const list = await accountCategoryService.getAccountCategoryList();
      dispatch(fetchSuccess(list));
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch account categories';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchAccountCategoryById = createAsyncThunk(
  'accountCategory/fetchAccountCategoryById',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading());
      const data = await accountCategoryService.getAccountCategory(id);
      const form = toAccountCategoryForm(data);
      dispatch(setSelected(form));
      return form;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch account category details';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveAccountCategory = createAsyncThunk(
  'accountCategory/saveAccountCategory',
  async (form: AccountCategoryForm, { dispatch }) => {
    try {
      dispatch(setSaving());
      const response = await accountCategoryService.addEditAccountCategory(
        toAccountCategoryModel(form)
      );
      const msg = Number(form.id) > 0 ? 'Record is updated' : 'Record is saved';
      dispatch(saveSuccess(msg));
      toastService.success(msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save account category';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removeAccountCategory = createAsyncThunk(
  'accountCategory/removeAccountCategory',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await accountCategoryService.deleteAccountCategory(id);
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
