import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { logoutUser } from '../../slices/auth/login/thunk';
import {
  getUserFullName,
  getUserEmail,
  getUserRole,
  getUserInitials,
  getUserAvatarUrl,
} from '../../helpers/userHelper';

interface HeaderProps {
  onToggleSidebar: () => void;
  user: any;
  profileInfo?: any;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, user, profileInfo }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const fullName = getUserFullName(user, profileInfo);
  const email = getUserEmail(user, profileInfo);
  const role = getUserRole(profileInfo);
  const initials = getUserInitials(user, profileInfo);
  const avatarUrl = getUserAvatarUrl(profileInfo);

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar Navigation"
          title="Toggle Sidebar"
        >
          <i className="mdi mdi-menu"></i>
        </button>

        <div className="header-search d-none d-md-block">
          <i className="mdi mdi-magnify"></i>
          <input type="text" placeholder="Search employees, tasks, logs..." />
        </div>
      </div>

      <div className="header-right">
        <div className="live-status-pill d-none d-sm-inline-flex">
          <span className="live-pulse"></span>
          <span>Live Tracking Active</span>
        </div>

        <div className="header-actions">
          <button className="header-action-btn" title="Notifications">
            <i className="mdi mdi-bell-outline"></i>
            <span className="badge-dot"></span>
          </button>
          <button className="header-action-btn d-none d-md-flex" title="Quick Actions">
            <i className="mdi mdi-view-grid-plus-outline"></i>
          </button>
        </div>

        {/* User Profile Dropdown */}
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
          <DropdownToggle tag="button" className="user-dropdown-btn">
            {avatarUrl && !imgError ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="rounded-circle border"
                style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="user-avatar-badge">{initials}</div>
            )}
            <div className="text-start d-none d-lg-block">
              <div className="user-name text-dark">{fullName}</div>
              <div className="user-role text-muted small">{role}</div>
            </div>
            <i className="mdi mdi-chevron-down text-muted ms-1"></i>
          </DropdownToggle>

          <DropdownMenu end className="shadow-lg border-0 mt-2" style={{ minWidth: '240px' }}>
            <div className="px-3 py-2 border-bottom bg-light bg-opacity-50">
              <div className="fw-bold text-dark">{fullName}</div>
              <div className="text-muted small text-truncate">{email}</div>
              <div className="badge bg-info-subtle text-info mt-1">{role}</div>
            </div>

            <DropdownItem onClick={() => navigate('/settings')}>
              <i className="mdi mdi-account-cog-outline me-2 text-primary"></i>
              Account Settings
            </DropdownItem>

            <DropdownItem onClick={() => navigate('/reports')}>
              <i className="mdi mdi-chart-timeline-variant me-2 text-info"></i>
              My Activity Logs
            </DropdownItem>

            <DropdownItem divider />

            <DropdownItem onClick={handleLogout} className="text-danger">
              <i className="mdi mdi-logout me-2"></i>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
