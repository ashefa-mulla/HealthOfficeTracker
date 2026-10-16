import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClientListItem } from '@/types/client/client.types';
import { LookupItem } from '@/types/employee/employee.types';
import { ClientForm } from '@/types/client/client.schema';
import {
  createBaseState,
  baseReducers,
  resetBaseState,
  BaseEntityState,
} from '@/types/reducer.type';

export interface ClientDropdowns {
  companies: LookupItem[];
  countries: LookupItem[];
  states: LookupItem[];
  cities: LookupItem[];
}

export interface ClientExtendedState extends BaseEntityState<ClientListItem, ClientForm> {
  dropdowns: ClientDropdowns;
}

const initialState: ClientExtendedState = {
  ...createBaseState<ClientListItem, ClientForm>(),
  dropdowns: { companies: [], countries: [], states: [], cities: [] },
};

const clientSlice = createSlice({
  name: 'Client',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<ClientListItem[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    setSelected: (state, action: PayloadAction<ClientForm | null>) => {
      state.selected = action.payload;
      state.loading = false;
    },

    setDropdowns: (state, action: PayloadAction<Partial<ClientDropdowns>>) => {
      state.dropdowns = { ...state.dropdowns, ...action.payload };
    },

    saveSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.saving = false;
      state.success = true;
      state.message = action.payload;
    },

    deleteSuccess: (state, action: PayloadAction<number>) => {
      state.saving = false;
      state.success = true;
      state.list = state.list.filter((o) => o.id !== action.payload);
      state.message = 'Record deleted';
    },

    resetClientState: (state) => {
      resetBaseState(state);
      state.selected = null;
    },
  },
});

export const {
  setLoading,
  setSaving,
  fetchSuccess,
  setSelected,
  setDropdowns,
  setError,
  clearError,
  saveSuccess,
  deleteSuccess,
  resetClientState,
} = clientSlice.actions;

export default clientSlice.reducer;
