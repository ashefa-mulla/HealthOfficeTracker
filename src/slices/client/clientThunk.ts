import { createAsyncThunk } from '@reduxjs/toolkit';
import clientService from '../../services/clientService';
import employeeService from '../../services/employeeService';
import toastService from '../../services/toastService';
import { ClientForm } from '../../types/client/client.schema';
import { toClientForm, toClientModel } from '../../types/client/client.mapper';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setDropdowns,
  setError,
  saveSuccess,
  deleteSuccess,
} from './clientSlice';

export const fetchClientList = createAsyncThunk(
  'client/fetchClientList',
  async (_: void, { dispatch }) => {
    try {
      dispatch(setLoading());
      const list = await clientService.getClientList();
      dispatch(fetchSuccess(list));
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch clients';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const fetchClientById = createAsyncThunk(
  'client/fetchClientById',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading());
      const data = await clientService.getClient(id);
      const form = toClientForm(data);
      dispatch(setSelected(form));
      return form;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch client details';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const saveClient = createAsyncThunk(
  'client/saveClient',
  async (form: ClientForm, { dispatch }) => {
    try {
      dispatch(setSaving());
      const response = await clientService.addEditClient(toClientModel(form));
      const msg = Number(form.id) > 0 ? 'Record is updated' : 'Record is saved';
      dispatch(saveSuccess(msg));
      toastService.success(msg);
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save client';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removeClient = createAsyncThunk(
  'client/removeClient',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await clientService.deleteClient(id);
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

/** Companies and countries for the form dropdowns. */
export const fetchClientDropdowns = createAsyncThunk(
  'client/fetchClientDropdowns',
  async (_: void, { dispatch }) => {
    const [companies, countries] = await Promise.all([
      clientService.getCompanies().catch(() => []),
      employeeService.getCountries().catch(() => []),
    ]);
    dispatch(setDropdowns({ companies, countries }));
  }
);

export const fetchClientStates = createAsyncThunk(
  'client/fetchClientStates',
  async (countryId: number, { dispatch }) => {
    const states = countryId > 0 ? await employeeService.getStates(countryId).catch(() => []) : [];
    dispatch(setDropdowns({ states }));
  }
);

export const fetchClientCities = createAsyncThunk(
  'client/fetchClientCities',
  async (stateId: number, { dispatch }) => {
    const cities = stateId > 0 ? await employeeService.getCities(stateId).catch(() => []) : [];
    dispatch(setDropdowns({ cities }));
  }
);
