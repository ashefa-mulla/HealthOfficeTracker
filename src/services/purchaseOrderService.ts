import axiosInstance from '@/config/axiosInstance';
import { axiosErrorToApiError } from '@/types/errors';
import { PurchaseOrderListItem } from '@/types/purchaseOrder/purchaseOrder.types';
import { toPurchaseOrderListItem } from '@/types/purchaseOrder/purchaseOrder.mapper';
import { LookupItem } from '@/types/employee/employee.types';
import { SaveResponse } from '@/types/api.types';

const BASE_PO = '/api/PurchaseOrder';

const toList = (data: any): PurchaseOrderListItem[] =>
  Array.isArray(data) ? data.map(toPurchaseOrderListItem) : [];

class PurchaseOrderService {
  /**
   * GET /api/PurchaseOrder/GetPurchaseOrderList/{companyId}
   * The API returns the full list (no server paging); the list page paginates client-side.
   */
  async getPurchaseOrderList(companyId: number): Promise<PurchaseOrderListItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(
        `${BASE_PO}/GetPurchaseOrderList/${companyId}`
      );
      return toList(response.data);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/PurchaseOrder/GetPurchaseOrderListbyFilter?compnayid={companyId}&active={1|0}
   * (the API parameter really is spelled "compnayid")
   */
  async getPurchaseOrderListByFilter(
    companyId: number,
    active: 0 | 1
  ): Promise<PurchaseOrderListItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(
        `${BASE_PO}/GetPurchaseOrderListbyFilter`,
        { params: { compnayid: companyId, active } }
      );
      return toList(response.data);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/PurchaseOrder/GetPurchaseorder/{id}
   */
  async getPurchaseOrder(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(`${BASE_PO}/GetPurchaseorder/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * POST /api/PurchaseOrder/addeditPurchasehorder
   */
  async addEditPurchaseOrder(data: any): Promise<SaveResponse | any> {
    try {
      const response = await axiosInstance.post<any>(`${BASE_PO}/addeditPurchasehorder`, data);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * GET /api/PurchaseOrder/GetPurchaseOrderRefDocList/{id}
   */
  async getRefDocs(id: number): Promise<{ id: number; docCode: string; path: string }[]> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_PO}/GetPurchaseOrderRefDocList/${id}`);
      return (Array.isArray(response.data) ? response.data : []).map((r: any) => ({
        id: Number(r.id ?? r.ID ?? 0),
        docCode: String(r.docCode ?? r.DocCode ?? ''),
        path: String(r.referance_Document ?? r.Referance_Document ?? ''),
      }));
    } catch (error) {
      // 404 = no documents
      return [];
    }
  }

  /**
   * GET /api/PurchaseOrder/deleteFile/{id} (the API deletes a reference document with a GET)
   */
  async deleteRefDoc(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(`${BASE_PO}/deleteFile/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/PurchaseOrder/GetPopayby (id, payBy) */
  async getPayByOptions(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_PO}/GetPopayby`);
      return (response.data || [])
        .map((r: any) => ({ id: Number(r.id ?? r.ID ?? 0), name: r.payBy ?? r.PayBy ?? '' }))
        .filter((r) => r.id > 0 && r.name);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/PurchaseOrder/GetSnailMail (id, desc) */
  async getSnailMailOptions(): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(`${BASE_PO}/GetSnailMail`);
      return (response.data || [])
        .map((r: any) => ({ id: Number(r.id ?? r.ID ?? 0), name: r.desc ?? r.Desc ?? '' }))
        .filter((r) => r.id > 0 && r.name);
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** GET /api/VendorAccount/GetAllVendorAccountbyCategoryID/{categoryId} (id, name) */
  async getVendorsByCategory(categoryId: number): Promise<LookupItem[]> {
    try {
      const response = await axiosInstance.get<any[]>(
        `/api/VendorAccount/GetAllVendorAccountbyCategoryID/${categoryId}`
      );
      return (response.data || [])
        .map((r: any) => ({ id: Number(r.id ?? r.ID ?? 0), name: r.name ?? r.Name ?? '' }))
        .filter((r) => r.id > 0);
    } catch (error) {
      // 404 = none
      return [];
    }
  }

  /**
   * POST /api/VendorAccount/addeditvendoraccount - quick "Add New" vendor.
   * tblVandorAccountNumber is sent as null: the API returns OK for a new vendor only in that case.
   */
  async addVendor(data: { categoryId: number; name: string; contact: string }): Promise<any> {
    try {
      const response = await axiosInstance.post<any>('/api/VendorAccount/addeditvendoraccount', {
        id: 0,
        categoryId: data.categoryId,
        name: data.name,
        contact: data.contact,
        active: true,
        tblVandorAccountNumber: null,
      });
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /** POST /api/VendorAccount/addeditGetVendorAccountNumber - quick "Add New" account number */
  async addVendorAccountNumber(vendorId: number, accountNo: string): Promise<any> {
    try {
      const response = await axiosInstance.post<any>(
        '/api/VendorAccount/addeditGetVendorAccountNumber',
        { id: 0, vandorAccountID: vendorId, accountNo }
      );
      return response.data;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }

  /**
   * DELETE /api/PurchaseOrder/deletePurchasehorder/{id}
   */
  async deletePurchaseOrder(id: number): Promise<any> {
    try {
      const response = await axiosInstance.delete<any>(`${BASE_PO}/deletePurchasehorder/${id}`);
      return response.data ?? true;
    } catch (error) {
      throw axiosErrorToApiError(error);
    }
  }
}

export const purchaseOrderService = new PurchaseOrderService();
export default purchaseOrderService;
