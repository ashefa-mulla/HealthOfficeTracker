import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface MenuProps {
  t?: (key: string) => string;
  collapsed?: boolean;
  onItemClick?: () => void;
}

const EmployeeMenu: React.FC<MenuProps> = ({ t = (s: string) => s, collapsed = false, onItemClick }) => {
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({
    attendance: location.pathname.startsWith('/attendance'),
    tasks: location.pathname.startsWith('/tasks'),
  });

  const toggleSubMenu = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <li className="menu-title">{t('Main Navigation')}</li>
      <li className="menu-item">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('My Dashboard') : undefined}
        >
          <i className="mdi mdi-view-dashboard-outline"></i>
          {!collapsed && <span>{t('My Dashboard')}</span>}
        </NavLink>
      </li>

      <li className="menu-title">{t('My Work & Tracking')}</li>

      {/* Attendance Submenu for Employee */}
      <li className={`menu-item has-submenu ${openSubMenus.attendance ? 'mm-active' : ''}`}>
        <a
          href="#attendance"
          className={`menu-link has-arrow ${location.pathname.startsWith('/attendance') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('attendance', e)}
          title={collapsed ? t('Time & Attendance') : undefined}
        >
          <i className="mdi mdi-clock-check-outline"></i>
          {!collapsed && (
            <>
              <span>{t('Time & Attendance')}</span>
              <i className={`mdi ${openSubMenus.attendance ? 'mdi-chevron-down' : 'mdi-chevron-right'} menu-arrow`}></i>
            </>
          )}
        </a>
        {!collapsed && openSubMenus.attendance && (
          <ul className="sub-menu">
            <li>
              <NavLink
                to="/attendance"
                end
                className={({ isActive }) => `sub-menu-link ${isActive && !location.search ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('My Timesheet')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/attendance?tab=clock"
                className={() => `sub-menu-link ${location.search.includes('clock') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Clock In / Out')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* Tasks Submenu for Employee */}
      <li className={`menu-item has-submenu ${openSubMenus.tasks ? 'mm-active' : ''}`}>
        <a
          href="#tasks"
          className={`menu-link has-arrow ${location.pathname.startsWith('/tasks') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('tasks', e)}
          title={collapsed ? t('My Tasks') : undefined}
        >
          <i className="mdi mdi-clipboard-text-outline"></i>
          {!collapsed && (
            <>
              <span>{t('My Tasks')}</span>
              <i className={`mdi ${openSubMenus.tasks ? 'mdi-chevron-down' : 'mdi-chevron-right'} menu-arrow`}></i>
            </>
          )}
        </a>
        {!collapsed && openSubMenus.tasks && (
          <ul className="sub-menu">
            <li>
              <NavLink
                to="/tasks"
                end
                className={({ isActive }) => `sub-menu-link ${isActive && !location.search ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Assigned Tasks')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tasks?tab=completed"
                className={() => `sub-menu-link ${location.search.includes('completed') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Completed Tasks')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      <li className="menu-title">{t('Reports & Account')}</li>

      {/* Reports */}
      <li className="menu-item">
        <NavLink
          to="/reports"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('My Activity Logs') : undefined}
        >
          <i className="mdi mdi-chart-box-outline"></i>
          {!collapsed && <span>{t('My Activity Logs')}</span>}
        </NavLink>
      </li>

      {/* Settings / Profile */}
      <li className="menu-item">
        <NavLink
          to="/settings"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('Profile & Settings') : undefined}
        >
          <i className="mdi mdi-account-cog-outline"></i>
          {!collapsed && <span>{t('Profile & Settings')}</span>}
        </NavLink>
      </li>
    </>
  );
};

export default EmployeeMenu;
