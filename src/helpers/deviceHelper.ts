/**
 * Device Helper for HO Tracker
 */

const DEVICE_ID_KEY = 'ho_tracker_device_id';

export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = generateUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
};

export const clearDeviceId = (): void => {
  localStorage.removeItem(DEVICE_ID_KEY);
};

export const getDeviceInfo = (): {
  deviceId: string;
  userAgent: string;
  timestamp: number;
} => {
  return {
    deviceId: getDeviceId(),
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
  };
};

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
