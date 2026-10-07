/**
 * Punch Detail & Timer Service for HO Tracker
 *
 */

import axiosInstance from '../config/axiosInstance';
import {
  PunchDetailPayload,
  PunchLogItem,
  CompanyBranchInfo,
  UserInOutStatus,
} from '../types/timer/timer.types';

const ENDPOINTS = {
  GET_USER_IN_OUT: (userId: number | string) => `api/PunchDetail/GetUserInOutvalue/${userId}`,
  GET_COMPANY_BRANCH_LIST: (companyId: number | string) =>
    `api/PunchDetail/GetCompanyBranchListByCompanyID/${companyId}`,
  GET_USER_LOGS: 'api/PunchDetail/GetUserLogWithCaptureImg',
  ADD_EDIT_PUNCH: 'api/PunchDetail/AddEditPunchDetail',
};

class TimerService {
  private axiosInstance = axiosInstance;

  /**
   * Fetch current user In/Out punch status
   * Matches Angular: this._http.get('api/PunchDetail/GetUserInOutvalue/' + userid)
   */
  async getUserInOutValue(userId: number | string): Promise<UserInOutStatus | null> {
    try {
      const response = await this.axiosInstance.get(ENDPOINTS.GET_USER_IN_OUT(userId));
      const data = response?.data;
      if (!data) return null;

      const raw = data.data !== undefined ? data.data : data;
      if (raw && typeof raw === 'object') {
        const id = raw.id ?? raw.Id ?? raw.ID;
        if (id !== undefined && id !== null && Number(id) > 0) {
          return {
            id: Number(id),
            branch: Number(raw.branch ?? raw.Branch ?? 1),
            latitude: raw.latitude ?? raw.Latitude ?? '0',
            longitude: raw.longitude ?? raw.Longitude ?? '0',
            userID: Number(raw.userID ?? raw.UserID ?? raw.userid ?? userId),
            ...raw,
          };
        }
      }
      return null;
    } catch (error: any) {
      console.warn('[TimerService] getUserInOutValue API call failed:', error?.message || error);
      return null;
    }
  }

  /**
   * Fetch company branch time zone and UTC offset
   * Matches Angular: this._http.get('api/PunchDetail/GetCompanyBranchListByCompanyID/' + companyid, options)
   */
  async getCompanyBranchList(companyId: number | string = 1): Promise<CompanyBranchInfo> {
    try {
      const response = await this.axiosInstance.get(ENDPOINTS.GET_COMPANY_BRANCH_LIST(companyId));
      const data = response?.data;
      if (data) {
        const raw = data.data !== undefined ? data.data : data;
        return {
          timeZone:
            raw.timeZone ??
            raw.TimeZone ??
            raw.timezone ??
            Intl.DateTimeFormat().resolvedOptions().timeZone ??
            'Eastern Standard Time',
          offset: Number(
            raw.offset ?? raw.Offset ?? (new Date().getTimezoneOffset() * -60)
          ),
          ...raw,
        };
      }
      return {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Eastern Standard Time',
        offset: new Date().getTimezoneOffset() * -60,
      };
    } catch (error) {
      console.warn('[TimerService] getCompanyBranchList failed, using local time info:', error);
      return {
        companyId: Number(companyId),
        branchName: 'Main Branch',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Eastern Standard Time',
        offset: new Date().getTimezoneOffset() * -60,
      };
    }
  }

  /**
   * Fetch all punch logs with capture image/timestamps
   * Matches Angular: this._http.get('api/PunchDetail/GetUserLogWithCaptureImg')
   */
  async getUserLogsWithCaptureImg(): Promise<PunchLogItem[]> {
    try {
      const response = await this.axiosInstance.get(ENDPOINTS.GET_USER_LOGS);
      const data = response?.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];
      return list
        .filter((x: any) => x && (x.id ?? x.Id ?? x.ID) !== 0)
        .map((x: any) => ({
          id: Number(x.id ?? x.Id ?? x.ID ?? 0),
          fullname: x.fullname ?? x.Fullname ?? x.FullName ?? x.name ?? 'Staff Member',
          execDate: x.execDate ?? x.ExecDate,
          outDate: x.outDate ?? x.OutDate,
          oExecDate: x.oExecDate ?? x.OExecDate ?? x.execDate ?? x.ExecDate ?? '',
          oOutDate: x.oOutDate ?? x.OOutDate ?? x.outDate ?? x.OutDate ?? null,
          branch: Number(x.branch ?? x.Branch ?? 1),
          latitude: x.latitude ?? x.Latitude,
          longitude: x.longitude ?? x.Longitude,
          ...x,
        }));
    } catch (error) {
      console.warn('[TimerService] getUserLogsWithCaptureImg failed:', error);
      return [];
    }
  }

  /**
   * Add or Edit Punch Detail (Clock In / Clock Out)
   * Matches Angular: this._http.post('api/PunchDetail/AddEditPunchDetail', data, options)
   */
  async addEditPunchDetail(payload: PunchDetailPayload): Promise<{ message: string; success: boolean; data?: any }> {
    try {
      const response = await this.axiosInstance.post(ENDPOINTS.ADD_EDIT_PUNCH, payload);
      const data = response?.data;
      return {
        message:
          data?.message ||
          data?.Message ||
          (payload.id && payload.id > 0
            ? 'Successfully Clocked Out!'
            : 'Successfully Clocked In!'),
        success: true,
        data: data,
      };
    } catch (error: any) {
      console.error('[TimerService] addEditPunchDetail API failed:', error);
      throw error;
    }
  }
}

export const timerService = new TimerService();
export default timerService;
