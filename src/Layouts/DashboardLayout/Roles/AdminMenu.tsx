import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface MenuProps {
  t?: (key: string) => string;
  collapsed?: boolean;
  onItemClick?: () => void;
}

const AdminMenu: React.FC<MenuProps> = ({ t = (s: string) => s, collapsed = false, onItemClick }) => {
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({
    employees: location.pathname.startsWith('/employees'),
    attendance: location.pathname.startsWith('/attendance'),
    tasks: location.pathname.startsWith('/tasks'),
    reports: location.pathname.startsWith('/reports'),
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

      <li className="menu-title">{t('Management')}</li>

      {/* Employees Menu with Submenu */}
      <li className={`menu-item has-submenu ${openSubMenus.employees ? 'mm-active' : ''}`}>
        <a
          href="#employees"
          className={`menu-link has-arrow ${location.pathname.startsWith('/employees') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('employees', e)}
          title={collapsed ? t('Employees & Teams') : undefined}
        >
          <i className="mdi mdi-account-group-outline"></i>
          {!collapsed && (
            <>
              <span>{t('Employees & Teams')}</span>
              <i className={`mdi ${openSubMenus.employees ? 'mdi-chevron-down' : 'mdi-chevron-right'} menu-arrow`}></i>
            </>
          )}
        </a>
        {!collapsed && openSubMenus.employees && (
          <ul className="sub-menu">
            <li>
              <NavLink
                to="/employees"
                end
                className={({ isActive }) => `sub-menu-link ${isActive ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('All Employees')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/employees?tab=teams"
                className={({ isActive }) => `sub-menu-link ${isActive && location.search.includes('teams') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Teams & Departments')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* Time & Attendance Menu with Submenu */}
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
                {t('Daily Timesheets')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/attendance?tab=live"
                className={() => `sub-menu-link ${location.search.includes('live') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Live Tracking')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/attendance?tab=shifts"
                className={() => `sub-menu-link ${location.search.includes('shifts') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Shift Logs')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* Tasks & Projects with Submenu */}
      <li className={`menu-item has-submenu ${openSubMenus.tasks ? 'mm-active' : ''}`}>
        <a
          href="#tasks"
          className={`menu-link has-arrow ${location.pathname.startsWith('/tasks') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('tasks', e)}
          title={collapsed ? t('Tasks & Projects') : undefined}
        >
          <i className="mdi mdi-clipboard-text-outline"></i>
          {!collapsed && (
            <>
              <span>{t('Tasks & Projects')}</span>
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
                {t('All Tasks')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tasks?tab=projects"
                className={() => `sub-menu-link ${location.search.includes('projects') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Active Projects')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* Office Locations */}
      <li className="menu-item">
        <NavLink
          to="/locations"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('Office Locations') : undefined}
        >
          <i className="mdi mdi-office-building-outline"></i>
          {!collapsed && <span>{t('Office Locations')}</span>}
        </NavLink>
      </li>

      <li className="menu-title">{t('Analytics & Setup')}</li>

      {/* Reports & Analytics with Submenu */}
      <li className={`menu-item has-submenu ${openSubMenus.reports ? 'mm-active' : ''}`}>
        <a
          href="#reports"
          className={`menu-link has-arrow ${location.pathname.startsWith('/reports') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('reports', e)}
          title={collapsed ? t('Reports & Analytics') : undefined}
        >
          <i className="mdi mdi-chart-box-outline"></i>
          {!collapsed && (
            <>
              <span>{t('Reports & Analytics')}</span>
              <i className={`mdi ${openSubMenus.reports ? 'mdi-chevron-down' : 'mdi-chevron-right'} menu-arrow`}></i>
            </>
          )}
        </a>
        {!collapsed && openSubMenus.reports && (
          <ul className="sub-menu">
            <li>
              <NavLink
                to="/reports"
                end
                className={({ isActive }) => `sub-menu-link ${isActive && !location.search ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Attendance Summary')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reports?tab=productivity"
                className={() => `sub-menu-link ${location.search.includes('productivity') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Productivity Analytics')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* System Settings */}
      <li className="menu-item">
        <NavLink
          to="/settings"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('System Settings') : undefined}
        >
          <i className="mdi mdi-cog-outline"></i>
          {!collapsed && <span>{t('System Settings')}</span>}
        </NavLink>
      </li>
    </>
  );
};

export default AdminMenu;
