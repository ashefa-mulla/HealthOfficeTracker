import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import defaultLogo from '../../assets/images/ho-logo.svg';
import SidebarContent from './SidebarContent';
import {
  getUserFullName,
  getUserRole,
  getUserInitials,
  getUserAvatarUrl,
} from '../../helpers/userHelper';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  user: any;
  profileInfo?: any;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, mobileOpen, onCloseMobile, user, profileInfo }) => {
  const [imgError, setImgError] = useState(false);
  const appName = import.meta.env.VITE_APP_NAME || 'HO Tracker';
  const logo = import.meta.env.VITE_COMPANYLOGO || defaultLogo;

  const fullName = getUserFullName(user, profileInfo);
  const role = getUserRole(profileInfo);
  const initials = getUserInitials(user, profileInfo);
  const avatarUrl = getUserAvatarUrl(profileInfo);

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}
      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <Link to="/dashboard" className="sidebar-brand">
          <img src={logo} alt={appName} />
        </Link>

        {/* Dynamic Role-Based Sidebar Navigation Content */}
        <SidebarContent
          collapsed={collapsed}
          onItemClick={onCloseMobile}
          profileInfo={profileInfo}
        />

        {!collapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-user-card">
              {avatarUrl && !imgError ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="rounded-circle border me-2"
                  style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="user-avatar-badge">{initials}</div>
              )}
              <div className="user-info">
                <div className="user-name text-truncate" title={fullName}>
                  {fullName}
                </div>
                <div className="user-role">{role}</div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
