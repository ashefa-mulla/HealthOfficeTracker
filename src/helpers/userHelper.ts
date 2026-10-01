/**
 * User & Profile Formatting Helpers for HO Tracker
 */

export const getUserFullName = (user: any, profileInfo?: any): string => {
  if (profileInfo?.firstName && profileInfo?.lastName) {
    return `${profileInfo.firstName} ${profileInfo.lastName}`.trim();
  }
  if (profileInfo?.firstName) {
    return profileInfo.firstName;
  }
  if (user?.userName) {
    return user.userName.includes('@') ? user.userName.split('@')[0] : user.userName;
  }
  if (user?.email) {
    return user.email.split('@')[0];
  }
  if (user?.displayName) {
    return user.displayName;
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
  if (profileInfo?.firstName && profileInfo?.lastName) {
    return `${profileInfo.firstName[0]}${profileInfo.lastName[0]}`.toUpperCase();
  }
  if (profileInfo?.firstName) {
    return profileInfo.firstName.substring(0, 2).toUpperCase();
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
