import { createAsyncThunk } from '@reduxjs/toolkit';
import chequeRequestService from '../../services/chequeRequestService';
import toastService from '../../services/toastService';
import { ChequeRequestForm } from '../../types/chequeRequest/chequeRequest.schema';
import {
  toChequeRequestForm,
  toChequeRequestModel,
} from '../../types/chequeRequest/chequeRequest.mapper';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setDropdowns,
  setError,
  saveSuccess,
  deleteSuccess,
} from './chequeRequestSlice';

export const fetchChequeRequestList = createAsyncThunk(
  'chequeRequest/fetchChequeRequestList',
  async (_: void, { dispatch }) => {
    try {
      dispatch(setLoading());
      const list = await chequeRequestService.getChequeRequestList();
      dispatch(fetchSuccess(list));
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch cheque requests';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchChequeRequestById = createAsyncThunk(
  'chequeRequest/fetchChequeRequestById',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading());
      const data = await chequeRequestService.getChequeRequest(id);
      const form = toChequeRequestForm(data);
      dispatch(setSelected(form));
      return form;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch cheque request details';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveChequeRequest = createAsyncThunk(
  'chequeRequest/saveChequeRequest',
  async (params: { form: ChequeRequestForm; currentUser: string }, { dispatch }) => {
    try {
      dispatch(setSaving());
      const response = await chequeRequestService.addEditChequeRequest(
        toChequeRequestModel(params.form, params.currentUser)
      );
      const msg = Number(params.form.id) > 0 ? 'Record is updated' : 'Record is saved';
      dispatch(saveSuccess(msg));
      toastService.success(msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save cheque request';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removeChequeRequest = createAsyncThunk(
  'chequeRequest/removeChequeRequest',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await chequeRequestService.deleteChequeRequest(id);
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

/** Banks, cost centres and payment methods for the form dropdowns. */
export const fetchChequeRequestDropdowns = createAsyncThunk(
  'chequeRequest/fetchChequeRequestDropdowns',
  async (_: void, { dispatch }) => {
    const [banks, costCentres, payMethods] = await Promise.all([
      chequeRequestService.getBanks().catch(() => []),
      chequeRequestService.getCostCentres().catch(() => []),
      chequeRequestService.getPayMethods().catch(() => []),
    ]);
    dispatch(setDropdowns({ banks, costCentres, payMethods }));
  }
);
