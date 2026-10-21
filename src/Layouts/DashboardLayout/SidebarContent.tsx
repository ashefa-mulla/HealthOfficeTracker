import React, { useEffect, useState } from 'react';
import AdminMenu from './Roles/AdminMenu';
import EmployeeMenu from './Roles/EmployeeMenu';
import ManagerMenu from './Roles/ManagerMenu';
import { useAuthStore } from '../../store/useAuthStore';
import AncillaryStaffMenu from './Roles/AncillaryStaffMenu';

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
      case 7:
        return <AncillaryStaffMenu {...menuProps} />;
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

  // Close every open child-menu flyout (toggles each open parent link)
  const closeFlyouts = (except?: Element | null) => {
    document
      .querySelectorAll<HTMLElement>('#side-menu .has-submenu.mm-active')
      .forEach((li) => {
        if (li !== except) li.querySelector<HTMLElement>(':scope > a')?.click();
      });
  };

  // Collapsed rail: flyouts must not stay open from the expanded state
  useEffect(() => {
    if (collapsed) closeFlyouts();
  }, [collapsed]);

  // Collapsed rail: close flyouts when clicking anywhere outside them
  useEffect(() => {
    if (!collapsed) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.('#side-menu .has-submenu')) closeFlyouts();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [collapsed]);

  // Collapsed rail: position the flyout beside the clicked icon, close others,
  // and close it once a child link has been chosen
  const handleClickCapture = (e: React.MouseEvent) => {
    if (!collapsed) return;
    const target = e.target as Element;
    const li = target.closest<HTMLElement>('.has-submenu');
    if (!li) {
      closeFlyouts();
      return;
    }
    if (target.closest('.sub-menu')) {
      if (target.closest('.sub-menu-link')) {
        setTimeout(() => li.querySelector<HTMLElement>(':scope > a')?.click(), 0);
      }
      return;
    }
    const top = li.querySelector(':scope > a')?.getBoundingClientRect().top ?? 80;
    li.style.setProperty('--flyout-top', `${top}px`);
    closeFlyouts(li);
  };

  return (
    <ul className="sidebar-menu" id="side-menu" onClickCapture={handleClickCapture}>
      {renderMenuByRole()}
    </ul>
  );
};

export default SidebarContent;
