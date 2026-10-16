import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PurchaseOrderListItem,
  PurchaseOrderView,
} from '@/types/purchaseOrder/purchaseOrder.types';
import { PurchaseOrderForm } from '@/types/purchaseOrder/purchaseOrder.schema';
import { LookupItem } from '@/types/employee/employee.types';
import {
  createBaseState,
  baseReducers,
  BaseEntityState,
} from '@/types/reducer.type';

export interface PurchaseOrderRefDoc {
  id: number;
  docCode: string;
  path: string;
}

export interface PurchaseOrderDropdowns {
  categories: LookupItem[];
  vendors: LookupItem[];
  accountNumbers: { id: number; accountNo: string }[];
  costCentres: LookupItem[];
  payBy: LookupItem[];
  snailMail: LookupItem[];
}

export interface PurchaseOrderExtendedState
  extends BaseEntityState<PurchaseOrderListItem, PurchaseOrderForm> {
  view: PurchaseOrderView;
  /** Record loaded by GetPurchaseorder/{id}; its non-form fields are sent back on update */
  selectedRaw: any | null;
  dropdowns: PurchaseOrderDropdowns;
  refDocs: PurchaseOrderRefDoc[];
}

const initialState: PurchaseOrderExtendedState = {
  ...createBaseState<PurchaseOrderListItem, PurchaseOrderForm>(),
  view: 'due',
  selectedRaw: null,
  dropdowns: {
    categories: [],
    vendors: [],
    accountNumbers: [],
    costCentres: [],
    payBy: [],
    snailMail: [],
  },
  refDocs: [],
};

const purchaseOrderSlice = createSlice({
  name: 'PurchaseOrder',
  initialState,
  reducers: {
    ...baseReducers,

    fetchSuccess: (state, action: PayloadAction<PurchaseOrderListItem[]>) => {
      state.loading = false;
      state.list = action.payload;
      state.success = true;
    },

    setView: (state, action: PayloadAction<PurchaseOrderView>) => {
      state.view = action.payload;
    },

    setSelected: (
      state,
      action: PayloadAction<{ form: PurchaseOrderForm; raw: any } | null>
    ) => {
      state.selected = action.payload ? action.payload.form : null;
      state.selectedRaw = action.payload ? action.payload.raw : null;
      state.loading = false;
    },

    setDropdowns: (state, action: PayloadAction<Partial<PurchaseOrderDropdowns>>) => {
      state.dropdowns = { ...state.dropdowns, ...action.payload };
    },

    setRefDocs: (state, action: PayloadAction<PurchaseOrderRefDoc[]>) => {
      state.refDocs = action.payload;
    },

    saveSuccess: (state) => {
      state.loading = false;
      state.saving = false;
      state.success = true;
    },

    deleteSuccess: (state, action: PayloadAction<number>) => {
      state.saving = false;
      state.success = true;
      state.list = state.list.filter((o) => o.id !== action.payload);
      state.message = 'Record deleted';
    },
  },
});

export const {
  setLoading,
  setSaving,
  fetchSuccess,
  setView,
  setSelected,
  setDropdowns,
  setRefDocs,
  setError,
  clearError,
  saveSuccess,
  deleteSuccess,
} = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;
