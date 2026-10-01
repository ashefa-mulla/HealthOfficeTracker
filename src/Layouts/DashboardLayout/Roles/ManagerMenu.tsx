import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface MenuProps {
  t?: (key: string) => string;
  collapsed?: boolean;
  onItemClick?: () => void;
}

const ManagerMenu: React.FC<MenuProps> = ({ t = (s: string) => s, collapsed = false, onItemClick }) => {
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
          title={collapsed ? t('Dashboard') : undefined}
        >
          <i className="mdi mdi-view-dashboard-outline"></i>
          {!collapsed && <span>{t('Dashboard')}</span>}
        </NavLink>
      </li>

      <li className="menu-title">{t('Team Management')}</li>

      {/* Team Members */}
      <li className="menu-item">
        <NavLink
          to="/employees"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('Team Members') : undefined}
        >
          <i className="mdi mdi-account-group-outline"></i>
          {!collapsed && <span>{t('Team Members')}</span>}
        </NavLink>
      </li>

      {/* Team Attendance */}
      <li className={`menu-item has-submenu ${openSubMenus.attendance ? 'mm-active' : ''}`}>
        <a
          href="#attendance"
          className={`menu-link has-arrow ${location.pathname.startsWith('/attendance') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('attendance', e)}
          title={collapsed ? t('Team Attendance') : undefined}
        >
          <i className="mdi mdi-clock-check-outline"></i>
          {!collapsed && (
            <>
              <span>{t('Team Attendance')}</span>
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
                {t('Team Timesheets')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/attendance?tab=live"
                className={() => `sub-menu-link ${location.search.includes('live') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Live Team Tracking')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* Team Tasks */}
      <li className={`menu-item has-submenu ${openSubMenus.tasks ? 'mm-active' : ''}`}>
        <a
          href="#tasks"
          className={`menu-link has-arrow ${location.pathname.startsWith('/tasks') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('tasks', e)}
          title={collapsed ? t('Task Assignments') : undefined}
        >
          <i className="mdi mdi-clipboard-text-outline"></i>
          {!collapsed && (
            <>
              <span>{t('Task Assignments')}</span>
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
                {t('Task Board')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tasks?tab=projects"
                className={() => `sub-menu-link ${location.search.includes('projects') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Project Overview')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      <li className="menu-title">{t('Analytics & Settings')}</li>

      {/* Reports */}
      <li className="menu-item">
        <NavLink
          to="/reports"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('Team Reports') : undefined}
        >
          <i className="mdi mdi-chart-box-outline"></i>
          {!collapsed && <span>{t('Team Reports')}</span>}
        </NavLink>
      </li>

      {/* Settings */}
      <li className="menu-item">
        <NavLink
          to="/settings"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('Settings') : undefined}
        >
          <i className="mdi mdi-cog-outline"></i>
          {!collapsed && <span>{t('Settings')}</span>}
        </NavLink>
      </li>
    </>
  );
};

export default ManagerMenu;
