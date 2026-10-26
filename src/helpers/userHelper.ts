import { getJwtFullName } from './tokenHelper';

export const getUserFullName = (user: any, profileInfo?: any): string => {
  // 1. Direct explicit full name fields
  if (profileInfo?.fullName && typeof profileInfo.fullName === 'string' && profileInfo.fullName.trim()) {
    return profileInfo.fullName.trim();
  }
  if (profileInfo?.displayName && typeof profileInfo.displayName === 'string' && profileInfo.displayName.trim()) {
    return profileInfo.displayName.trim();
  }
  if (user?.fullName && typeof user.fullName === 'string' && user.fullName.trim()) {
    return user.fullName.trim();
  }
  if (user?.displayName && typeof user.displayName === 'string' && user.displayName.trim()) {
    return user.displayName.trim();
  }

  // 2. First name and Last name combination
  if (profileInfo?.firstName && profileInfo?.lastName) {
    return `${profileInfo.firstName} ${profileInfo.lastName}`.trim();
  }
  if (profileInfo?.firstname && profileInfo?.lastname) {
    return `${profileInfo.firstname} ${profileInfo.lastname}`.trim();
  }
  if (profileInfo?.firstName) {
    return profileInfo.firstName;
  }
  if (profileInfo?.firstname) {
    return profileInfo.firstname;
  }

  // 3. Saved in localStorage
  const savedFullName = localStorage.getItem('fullName') || localStorage.getItem('displayName');
  if (savedFullName && savedFullName.trim()) {
    return savedFullName.trim();
  }

  // 4. Extract from JWT token claim (ClaimTypes.Name holds 'Firstname Lastname' like 'Ashefa Mulla')
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  const jwtName = getJwtFullName(token);
  if (jwtName && jwtName.trim() && !jwtName.includes('@')) {
    return jwtName.trim();
  }

  // 5. Fallback to userName / email prefix
  if (user?.userName) {
    return user.userName.includes('@') ? user.userName.split('@')[0] : user.userName;
  }
  if (user?.email) {
    return user.email.split('@')[0];
  }
  if (jwtName && jwtName.trim()) {
    return jwtName.trim();
  }

  return 'Team Member';
};

export const getUserEmail = (user: any, profileInfo?: any): string => {
  if (user?.userName && user.userName.includes('@')) {
    return user.userName;
  }
  if (user?.email) {
    return user.email;
  }
  return profileInfo?.email || 'user@hotracker.com';
};

export const getUserRole = (profileInfo?: any): string => {
  if (profileInfo?.userRole) {
    // Format camelCase / PascalCase or keep as is
    return profileInfo.userRole;
  }
  if (profileInfo?.utype === 1 || profileInfo?.utype === 4) {
    return 'Administrator';
  }
  if (profileInfo?.utype === 3) {
    return 'Team Member';
  }
  return 'Team Member';
};

export const getUserInitials = (user: any, profileInfo?: any): string => {
  const fullName = getUserFullName(user, profileInfo);
  if (fullName && fullName !== 'Team Member' && fullName !== 'User') {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  const name = user?.userName || user?.email || user?.displayName || 'User';
  return name.substring(0, 2).toUpperCase();
};

export const getUserAvatarUrl = (profileInfo?: any): string | null => {
  const imagePath = profileInfo?.profileImage;
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return null;
  }

  // If already absolute URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Clean backslashes from ASP.NET paths like "FileServer\\Employer\\xyz.png"
  const normalizedPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');

  const fileBaseUrl =
    import.meta.env.VITE_API_FILE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'https://localhost:44301';

  const cleanBaseUrl = fileBaseUrl.replace(/\/+$/, '');
  return `${cleanBaseUrl}/${normalizedPath}`;
};

/**
 * Extract numeric database User ID (matching Angular this.userid)
 */
export const getNumericUserId = (profileInfo?: any, user?: any): number => {
  // 1. Direct profileInfo fields (userId, UserId, userid, employeeId, entityId)
  if (profileInfo) {
    const raw =
      profileInfo.userId ??
      profileInfo.UserId ??
      profileInfo.userid ??
      profileInfo.employeeId ??
      profileInfo.entityId ??
      profileInfo.id;
    if (raw !== undefined && raw !== null && !isNaN(Number(raw)) && Number(raw) > 0) {
      return Number(raw);
    }
  }

  // 2. Check localStorage 'userid' (matching Angular localStorage.getItem('userid'))
  const lsUserId = localStorage.getItem('userid');
  if (lsUserId) {
    if (!isNaN(Number(lsUserId)) && Number(lsUserId) > 0) {
      return Number(lsUserId);
    }
    try {
      const parsed = JSON.parse(lsUserId);
      if (Array.isArray(parsed) && parsed.length > 0 && !isNaN(Number(parsed[0]))) {
        return Number(parsed[0]);
      }
      if (!isNaN(Number(parsed)) && Number(parsed) > 0) {
        return Number(parsed);
      }
    } catch {
      // ignore
    }
  }

  // 3. Check localStorage 'userProfile'
  const userProfileStr = localStorage.getItem('userProfile');
  if (userProfileStr) {
    try {
      const p = JSON.parse(userProfileStr);
      const raw =
        p.userId ??
        p.UserId ??
        p.userid ??
        p.employeeId ??
        p.entityId ??
        p.id;
      if (raw !== undefined && raw !== null && !isNaN(Number(raw)) && Number(raw) > 0) {
        return Number(raw);
      }
    } catch {
      // ignore
    }
  }

  // 4. Check localStorage 'employeeid'
  const lsEmpId = localStorage.getItem('employerId');
  if (lsEmpId && !isNaN(Number(lsEmpId)) && Number(lsEmpId) > 0) {
    return Number(lsEmpId);
  }

  // 5. Check user object for numeric userId
  if (user) {
    const raw = user.userId ?? user.UserId ?? user.userid;
    if (raw !== undefined && raw !== null && !isNaN(Number(raw)) && Number(raw) > 0) {
      return Number(raw);
    }
    if (user.id && !isNaN(Number(user.id)) && Number(user.id) > 0) {
      return Number(user.id);
    }
  }

  // 6. Check authUser in localStorage
  const authUserStr = localStorage.getItem('authUser');
  if (authUserStr) {
    try {
      const u = JSON.parse(authUserStr);
      const raw = u.userId ?? u.UserId ?? u.userid;
      if (raw !== undefined && raw !== null && !isNaN(Number(raw)) && Number(raw) > 0) {
        return Number(raw);
      }
      if (u.id && !isNaN(Number(u.id)) && Number(u.id) > 0) {
        return Number(u.id);
      }
    } catch {
      // ignore
    }
  }

  return 0;
};

/**
 * Extract numeric database Employee ID / Entity ID (matching Angular employeeid / entityId)
 * Priority: profileInfo.employeeId > profileInfo.entityId > localStorage 'employeeid' > localStorage 'entityid' > localStorage 'userProfile' > getNumericUserId
 */
export const getNumericEmployeeId = (profileInfo?: any, user?: any): number => {
  // 1. Direct profileInfo fields (employeeId, entityId, EmployeeId, EntityId, employeeid, entityid)
  if (profileInfo) {
    const empFields = [
      profileInfo.employeeId,
      profileInfo.entityId,
    ];
    for (const val of empFields) {
      if (val !== undefined && val !== null && !isNaN(Number(val)) && Number(val) > 0) {
        return Number(val);
      }
    }
  }

  // 2. Check localStorage 'employeeid' / 'entityid'
  const lsKeys = ['employeeid', 'entityid', 'employeeId', 'entityId', 'EmpID', 'EmpId'];
  for (const key of lsKeys) {
    const lsVal = localStorage.getItem(key);
    if (lsVal) {
      if (!isNaN(Number(lsVal)) && Number(lsVal) > 0) {
        return Number(lsVal);
      }
      try {
        const parsed = JSON.parse(lsVal);
        if (Array.isArray(parsed) && parsed.length > 0 && !isNaN(Number(parsed[0])) && Number(parsed[0]) > 0) {
          return Number(parsed[0]);
        }
        if (!isNaN(Number(parsed)) && Number(parsed) > 0) {
          return Number(parsed);
        }
      } catch {
        // ignore
      }
    }
  }

  // 3. Check localStorage 'userProfile'
  const userProfileStr = localStorage.getItem('userProfile');
  if (userProfileStr) {
    try {
      const p = JSON.parse(userProfileStr);
      const empFields = [
        p.employeeId,
        p.EmployeeId,
        p.employeeid,
        p.entityId,
        p.EntityId,
        p.entityid,
      ];
      for (const val of empFields) {
        if (val !== undefined && val !== null && !isNaN(Number(val)) && Number(val) > 0) {
          return Number(val);
        }
      }
    } catch {
      // ignore
    }
  }

  // 4. Fallback to numeric user id if no employeeId found
  return getNumericUserId(profileInfo, user);
};

/**
 * Extract numeric database Entity ID (employee entityid)
 */
export const getEntityId = (profileInfo?: any, user?: any): number => {
  // 1. Direct profileInfo fields (entityId, entityid, EntityId, EntityID)
  if (profileInfo) {
    const raw =
      profileInfo.entityId ??
      profileInfo.entityid ??
      profileInfo.EntityId ??
      profileInfo.EntityID;
    if (raw !== undefined && raw !== null && !isNaN(Number(raw)) && Number(raw) > 0) {
      return Number(raw);
    }
  }

  // 2. Check localStorage 'entityid' / 'entityId'
  const lsKeys = ['entityid', 'entityId', 'EntityId', 'EntityID'];
  for (const key of lsKeys) {
    const lsVal = localStorage.getItem(key);
    if (lsVal) {
      if (!isNaN(Number(lsVal)) && Number(lsVal) > 0) {
        return Number(lsVal);
      }
      try {
        const parsed = JSON.parse(lsVal);
        if (Array.isArray(parsed) && parsed.length > 0 && !isNaN(Number(parsed[0])) && Number(parsed[0]) > 0) {
          return Number(parsed[0]);
        }
        if (!isNaN(Number(parsed)) && Number(parsed) > 0) {
          return Number(parsed);
        }
      } catch {
        // ignore
      }
    }
  }

  // 3. Check localStorage 'userProfile'
  const userProfileStr = localStorage.getItem('userProfile');
  if (userProfileStr) {
    try {
      const p = JSON.parse(userProfileStr);
      const raw =
        p.entityId ??
        p.entityid ??
        p.EntityId ??
        p.EntityID;
      if (raw !== undefined && raw !== null && !isNaN(Number(raw)) && Number(raw) > 0) {
        return Number(raw);
      }
    } catch {
      // ignore
    }
  }

  // 4. Check user object
  if (user) {
    const raw =
      user.entityId ??
      user.entityid ??
      user.EntityId ??
      user.EntityID;
    if (raw !== undefined && raw !== null && !isNaN(Number(raw)) && Number(raw) > 0) {
      return Number(raw);
    }
  }

  // 5. Fallback to getNumericEmployeeId
  return getNumericEmployeeId(profileInfo, user);
};

/** Admin / Super Admin (utype 1 / 4) */
export const isAdminUser = (profileInfo?: any): boolean => {
  const type = Number(profileInfo?.utype ?? profileInfo?.usertype ?? profileInfo?.userType);
  if (type === 1 || type === 4) return true;
  const role = localStorage.getItem('sessionrole') || profileInfo?.userRole || '';
  return role === 'Admin';
};