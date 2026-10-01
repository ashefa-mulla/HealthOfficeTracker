import React, { useEffect, useState } from 'react';
import AdminMenu from './Roles/AdminMenu';
import EmployeeMenu from './Roles/EmployeeMenu';
import ManagerMenu from './Roles/ManagerMenu';
import { useAuthStore } from '../../store/useAuthStore';

interface SidebarContentProps {
  collapsed?: boolean;
  onItemClick?: () => void;
  profileInfo?: any;
  t?: (key: string) => string;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  collapsed = false,
  onItemClick,
  profileInfo: propProfileInfo,
  t = (key: string) => key,
}) => {
  const { profileInfo: storeProfileInfo } = useAuthStore();
  const [userType, setUserType] = useState<number | null>(null);

  // Get user type from prop, store, or localStorage (userProfile)
  useEffect(() => {
    const profile = propProfileInfo || storeProfileInfo;
    if (profile) {
      const type = profile.utype ?? profile.usertype ?? profile.userType;
      if (type !== undefined && type !== null) {
        setUserType(Number(type));
        return;
      }
    }

    const userProfileStr = localStorage.getItem('userProfile');
    if (userProfileStr) {
      try {
        const userProfile = JSON.parse(userProfileStr);
        const type = userProfile.utype ?? userProfile.usertype ?? userProfile.userType;
        setUserType(type !== undefined && type !== null ? Number(type) : null);
      } catch (error) {
        console.error('[SidebarContent] Error parsing userProfile:', error);
        setUserType(null);
      }
    }
  }, [propProfileInfo, storeProfileInfo]);

  // Function to render role-based menu matching VirtualClinic-React / Angular VO_Tracker
  const renderMenuByRole = () => {
    const menuProps = {
      t,
      collapsed,
      onItemClick,
    };

    switch (userType) {
      case 3:
        // Employee / Team Member Menu
        return <EmployeeMenu {...menuProps} />;

      case 2:
      case 13:
        // Manager / Supervisor / SubAdmin Menu
        return <ManagerMenu {...menuProps} />;

      case 1:
      case 4:
      case 12:
        // Admin / Super Admin / Employer Menu
        return <AdminMenu {...menuProps} />;

      default:
        // Default to AdminMenu (or fallback based on role name)
        const role = (propProfileInfo?.userRole || storeProfileInfo?.userRole || '').toLowerCase();
        if (role.includes('employee') || role.includes('member')) {
          return <EmployeeMenu {...menuProps} />;
        }
        if (role.includes('manager') || role.includes('supervisor')) {
          return <ManagerMenu {...menuProps} />;
        }
        return <AdminMenu {...menuProps} />;
    }
  };

  return (
    <ul className="sidebar-menu" id="side-menu">
      {renderMenuByRole()}
    </ul>
  );
};

export default SidebarContent;
