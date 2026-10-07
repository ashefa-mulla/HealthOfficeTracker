/**
 * Types for Punch Clock / Timer Module
 * Matching Angular VO_Tracker Area Timer specifications
 */

export interface PunchDetailPayload {
    id: number;
    PIN: string;
    branch: number;
    latitude: string | number;
    longitude: string | number;
    ipAddOut?: string | null;
    userID: number;
}

export interface PunchLogItem {
    id: number;
    fullname: string;
    execDate?: string;
    outDate?: string;
    oExecDate: string;
    oOutDate: string | null;
    branch?: number;
    latitude?: number | string;
    longitude?: number | string;
    ipAddOut?: string | null;
    [key: string]: any;
}

export interface CompanyBranchInfo {
    id?: number;
    companyId?: number;
    branchName?: string;
    timeZone?: string;
    offset?: number; // Offset in seconds
    [key: string]: any;
}

export interface UserInOutStatus {
    id?: number;
    branch?: number;
    latitude?: string | number;
    longitude?: string | number;
    userID?: number;
    ipAddOut?: string | null;
    [key: string]: any;
}

export interface GeolocationState {
    latitude: string | number | null;
    longitude: string | number | null;
    accuracy: number | null;
    status: 'idle' | 'locating' | 'granted' | 'denied' | 'unavailable';
    errorMessage: string | null;
}
