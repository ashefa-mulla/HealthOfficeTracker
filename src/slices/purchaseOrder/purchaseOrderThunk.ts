import { createAsyncThunk } from '@reduxjs/toolkit';
import purchaseOrderService from '../../services/purchaseOrderService';
import toastService from '../../services/toastService';
import employeeService from '../../services/employeeService';
import accountCategoryService from '../../services/accountCategoryService';
import chequeRequestService from '../../services/chequeRequestService';
import vendorAccountService from '../../services/vendorAccountService';
import { PurchaseOrderForm } from '../../types/purchaseOrder/purchaseOrder.schema';
import {
  toPurchaseOrderForm,
  toPurchaseOrderModel,
} from '../../types/purchaseOrder/purchaseOrder.mapper';
import { PurchaseOrderView } from '../../types/purchaseOrder/purchaseOrder.types';
import {
  setLoading,
  setSaving,
  fetchSuccess,
  setView,
  setSelected,
  setDropdowns,
  setRefDocs,
  setError,
  saveSuccess,
  deleteSuccess,
} from './purchaseOrderSlice';

/**
 * Due Date List  -> GetPurchaseOrderList/{company}
 * Active PO List -> GetPurchaseOrderListbyFilter?compnayid={company}&active=1
 * DeActive PO    -> GetPurchaseOrderListbyFilter?compnayid={company}&active=0
 */
export const fetchPurchaseOrderList = createAsyncThunk(
  'purchaseOrder/fetchPurchaseOrderList',
  async (params: { view: PurchaseOrderView; companyId: number }, { dispatch }) => {
    try {
      dispatch(setLoading());
      dispatch(setView(params.view));
      const list =
        params.view === 'due'
          ? await purchaseOrderService.getPurchaseOrderList(params.companyId)
          : await purchaseOrderService.getPurchaseOrderListByFilter(
              params.companyId,
              params.view === 'active' ? 1 : 0
            );
      dispatch(fetchSuccess(list));
      return list;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch purchase orders';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

export const removePurchaseOrder = createAsyncThunk(
  'purchaseOrder/removePurchaseOrder',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setSaving());
      await purchaseOrderService.deletePurchaseOrder(id);
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

// ---------------------------------------------------------------------------
// Add / Edit
// ---------------------------------------------------------------------------

export const fetchPurchaseOrderById = createAsyncThunk(
  'purchaseOrder/fetchPurchaseOrderById',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading());
      const raw = await purchaseOrderService.getPurchaseOrder(id);
      const form = toPurchaseOrderForm(raw);
      dispatch(setSelected({ form, raw }));
      return form;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch purchase order';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

/** Max size of the "Account Summary" file, as in the old screen (200 KB) */
const MAX_FILE_BYTES = 200000;

export const savePurchaseOrder = createAsyncThunk(
  'purchaseOrder/savePurchaseOrder',
  async (
    params: { form: PurchaseOrderForm; raw: any; userId: number; file: File | null },
    { dispatch }
  ) => {
    try {
      dispatch(setSaving());

      let filesdoc = 'NoFile';
      if (params.file) {
        if (params.file.size >= MAX_FILE_BYTES) {
          throw new Error('Filesize must be less than 200 KB');
        }
        filesdoc = (await employeeService.uploadFile(params.file, 'PurchaseOrder')) || 'NoFile';
      }

      const response = await purchaseOrderService.addEditPurchaseOrder(
        toPurchaseOrderModel(params.form, params.raw, params.userId, filesdoc)
      );
      dispatch(saveSuccess());
      toastService.success(Number(params.form.id) > 0 ? 'Record is updated' : 'Record is saved');
      return response;
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save purchase order';
      dispatch(setError(errorMsg));
      toastService.error(errorMsg);
      throw error;
    }
  }
);

/** Categories, cost centres, pay-by and snail-mail lists for the form dropdowns. */
export const fetchPurchaseOrderDropdowns = createAsyncThunk(
  'purchaseOrder/fetchPurchaseOrderDropdowns',
  async (_: void, { dispatch }) => {
    const [categoryList, costCentres, payBy, snailMail] = await Promise.all([
      accountCategoryService.getAccountCategoryList().catch(() => []),
      chequeRequestService.getCostCentres().catch(() => []),
      purchaseOrderService.getPayByOptions().catch(() => []),
      purchaseOrderService.getSnailMailOptions().catch(() => []),
    ]);
    dispatch(
      setDropdowns({
        categories: categoryList
          .filter((c) => c.active !== false)
          .map((c) => ({ id: Number(c.id), name: c.name || '' })),
        costCentres,
        payBy,
        snailMail,
      })
    );
  }
);

/** Vendors of the selected category */
export const fetchPoVendors = createAsyncThunk(
  'purchaseOrder/fetchPoVendors',
  async (categoryId: number, { dispatch }) => {
    const vendors = categoryId > 0 ? await purchaseOrderService.getVendorsByCategory(categoryId) : [];
    dispatch(setDropdowns({ vendors }));
  }
);

/** Account numbers of the selected vendor */
export const fetchPoAccountNumbers = createAsyncThunk(
  'purchaseOrder/fetchPoAccountNumbers',
  async (vendorId: number, { dispatch }) => {
    let accountNumbers: { id: number; accountNo: string }[] = [];
    if (vendorId > 0) {
      const rows = await vendorAccountService.getVendorAccountNumbers(vendorId).catch(() => []);
      accountNumbers = rows.map((r) => ({
        id: Number(r.id || 0),
        accountNo:
          typeof r.accountNo === 'number'
            ? r.accountNo.toLocaleString('fullwide', { useGrouping: false })
            : String(r.accountNo ?? ''),
      }));
    }
    dispatch(setDropdowns({ accountNumbers }));
  }
);

export const fetchPoRefDocs = createAsyncThunk(
  'purchaseOrder/fetchPoRefDocs',
  async (id: number, { dispatch }) => {
    const docs = id > 0 ? await purchaseOrderService.getRefDocs(id) : [];
    dispatch(setRefDocs(docs));
  }
);

export const removePoRefDoc = createAsyncThunk(
  'purchaseOrder/removePoRefDoc',
  async (params: { docId: number; purchaseOrderId: number }, { dispatch }) => {
    try {
      await purchaseOrderService.deleteRefDoc(params.docId);
      toastService.success('File is deleted');
      await dispatch(fetchPoRefDocs(params.purchaseOrderId));
    } catch (error: any) {
      toastService.error(error?.message || 'Failed to delete file');
      throw error;
    }
  }
);

// ---- quick "Add New" from the form -----------------------------------------

export const quickAddPoCategory = createAsyncThunk(
  'purchaseOrder/quickAddPoCategory',
  async (name: string, { dispatch }) => {
    try {
      await accountCategoryService.addEditAccountCategory({ id: 0, name, active: true });
      toastService.success('Record is added');
      await dispatch(fetchPurchaseOrderDropdowns());
    } catch (error: any) {
      toastService.error(error?.message || 'Failed to add category');
      throw error;
    }
  }
);

export const quickAddPoVendor = createAsyncThunk(
  'purchaseOrder/quickAddPoVendor',
  async (params: { categoryId: number; name: string; contact: string }, { dispatch }) => {
    try {
      await purchaseOrderService.addVendor(params);
      toastService.success('Record is added');
      await dispatch(fetchPoVendors(params.categoryId));
    } catch (error: any) {
      toastService.error(error?.message || 'Failed to add vendor');
      throw error;
    }
  }
);

export const quickAddPoAccountNumber = createAsyncThunk(
  'purchaseOrder/quickAddPoAccountNumber',
  async (params: { vendorId: number; accountNo: string }, { dispatch }) => {
    try {
      await purchaseOrderService.addVendorAccountNumber(params.vendorId, params.accountNo);
      toastService.success('Record is added');
      await dispatch(fetchPoAccountNumbers(params.vendorId));
    } catch (error: any) {
      toastService.error(error?.message || 'Failed to add account number');
      throw error;
    }
  }
);
