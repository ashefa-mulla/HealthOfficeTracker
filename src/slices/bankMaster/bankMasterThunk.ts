import { createAsyncThunk } from '@reduxjs/toolkit';
import bankMasterService from '../../services/bankMasterService';
import toastService from '../../services/toastService';
import { BankMasterForm } from '../../types/bankMaster/bankMaster.schema';
import {
  toBankMasterForm,
  toBankMasterModel,
} from '../../types/bankMaster/bankMaster.mapper';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setError,
  saveSuccess,
  deleteSuccess,
} from './bankMasterSlice';

export const fetchBankMasterList = createAsyncThunk(
  'bankMaster/fetchBankMasterList',
  async (_: void, { dispatch }) => {
    try {
      dispatch(setLoading());
      const list = await bankMasterService.getBankMasterList();
      dispatch(fetchSuccess(list));
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch bank master list';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchBankMasterById = createAsyncThunk(
  'bankMaster/fetchBankMasterById',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading());
      const data = await bankMasterService.getBankMaster(id);
      const form = toBankMasterForm(data);
      dispatch(setSelected(form));
      return form;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch bank details';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveBankMaster = createAsyncThunk(
  'bankMaster/saveBankMaster',
  async (form: BankMasterForm, { dispatch }) => {
    try {
      dispatch(setSaving());
      const response = await bankMasterService.addEditBankMaster(toBankMasterModel(form));
      const msg = Number(form.id) > 0 ? 'Record is updated' : 'Record is saved';
      dispatch(saveSuccess(msg));
      toastService.success(msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save bank';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removeBankMaster = createAsyncThunk(
  'bankMaster/removeBankMaster',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await bankMasterService.deleteBankMaster(id);
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
